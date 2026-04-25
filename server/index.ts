// ============================================================
// MONARC PRIVÉ — COMPLETE PRODUCTION BACKEND
// File: server/index.ts
// ============================================================

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import cron from "node-cron";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;

// ── CLIENTS ──────────────────────────────────────────────────
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

// ── MIDDLEWARE ────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS || "http://localhost:5173").split(","),
  credentials: true,
}));

// Raw body for Stripe webhooks
app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "10mb" }));

// Rate limiting
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: "Too many requests" } });
const agentLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 30, message: { error: "Rate limit: 30 agent messages per minute" } });
app.use("/api", apiLimiter);
app.use("/api/agents", agentLimiter);

// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// ── IMPORT PROMPTS ────────────────────────────────────────────
import { AGENT_PROMPTS } from "./agents/prompts";

// ── HEALTH ────────────────────────────────────────────────────
app.get("/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), agents: 5, version: "2.0.0" });
});

// ════════════════════════════════════════════════════════════
// AGENT ROUTES
// ════════════════════════════════════════════════════════════

// Chat with agent
app.post("/api/agents/:agentId/chat", async (req, res) => {
  const { agentId } = req.params;
  const { messages, userId } = req.body;

  if (!AGENT_PROMPTS[agentId]) return res.status(404).json({ error: "Agent not found" });
  if (!messages?.length) return res.status(400).json({ error: "Messages required" });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: AGENT_PROMPTS[agentId],
      messages: messages.slice(-20), // keep last 20 for context
    });

    const reply = response.content.find(b => b.type === "text")?.text || "";

    // Log to DB
    await supabase.from("agent_conversations").insert({
      agent_id: agentId, user_id: userId || "anonymous",
      messages, response: reply,
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    });

    res.json({ reply, usage: response.usage });
  } catch (err: any) {
    console.error("Agent chat error:", err);
    res.status(500).json({ error: "Agent temporarily unavailable" });
  }
});

// Generate weekly report
app.post("/api/agents/:agentId/weekly-report", async (req, res) => {
  const { agentId } = req.params;
  const { email, userId } = req.body;
  if (!AGENT_PROMPTS[agentId]) return res.status(404).json({ error: "Agent not found" });

  try {
    const prompt = buildWeeklyReportPrompt(agentId);
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: AGENT_PROMPTS[agentId],
      messages: [{ role: "user", content: prompt }],
    });
    const report = response.content.find(b => b.type === "text")?.text || "";

    const { data } = await supabase.from("weekly_reports")
      .insert({ agent_id: agentId, user_id: userId || "owner", content: report, week_of: getWeekStart() })
      .select().single();

    if (email) await sendReportEmail(email, agentId, report);

    res.json({ report, reportId: data?.id });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ error: "Report generation failed" });
  }
});

// Get report history
app.get("/api/reports/:userId", async (req, res) => {
  const { data } = await supabase.from("weekly_reports")
    .select("*").eq("user_id", req.params.userId)
    .order("timestamp", { ascending: false }).limit(50);
  res.json({ reports: data || [] });
});

// Guest concierge (public endpoint)
app.post("/api/concierge/chat", async (req, res) => {
  const { messages, guestName, bookingId } = req.body;
  try {
    const systemCtx = AGENT_PROMPTS.concierge +
      (guestName ? `\n\nYou are speaking with ${guestName}.` : "") +
      (bookingId ? `\n\nBooking reference: ${bookingId}.` : "");

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemCtx,
      messages: (messages || []).slice(-10),
    });
    const reply = response.content.find(b => b.type === "text")?.text || "";

    await supabase.from("concierge_chats").insert({ guest_name: guestName, booking_id: bookingId, message: messages?.at(-1)?.content, response: reply });

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Concierge unavailable" });
  }
});

// ════════════════════════════════════════════════════════════
// PAYMENT ROUTES
// ════════════════════════════════════════════════════════════

// Create membership payment intent
app.post("/api/payments/create-membership-intent", async (req, res) => {
  const { email, name, tier = "curated" } = req.body;
  const amounts: Record<string, number> = { curated: 30000, private: 75000, founding: 150000 };
  const amount = amounts[tier] || 30000;

  try {
    let customer;
    const existing = await stripe.customers.list({ email, limit: 1 });
    customer = existing.data[0] || await stripe.customers.create({ email, name });

    const paymentIntent = await stripe.paymentIntents.create({
      amount, currency: "usd",
      customer: customer.id,
      metadata: { product: "membership", tier, email, name },
      description: `Monarc Privé ${tier} Membership`,
      statement_descriptor: "MONARC PRIVE",
      receipt_email: email,
    });

    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id, customerId: customer.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create booking payment intent
app.post("/api/payments/create-booking-intent", async (req, res) => {
  const { bookingId, amount, bookingReference, paymentType = "full_payment" } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: { booking_id: bookingId, booking_reference: bookingReference, payment_type: paymentType },
      description: `Monarc Privé Booking ${bookingReference}`,
      statement_descriptor: "MONARC PRIVE",
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════
// SUBSCRIPTION ROUTES (host / agent / experience)
// ════════════════════════════════════════════════════════════

app.post("/api/subscriptions/create", async (req, res) => {
  const { email, name, type, priceId } = req.body;
  if (!email || !type || !priceId) return res.status(400).json({ error: "email, type, priceId required" });

  try {
    // Get or create customer
    let customer;
    const existing = await stripe.customers.list({ email, limit: 1 });
    customer = existing.data[0] || await stripe.customers.create({ email, name, metadata: { type } });

    // Create subscription with trial (0 days — charge immediately)
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: { type, email, name },
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/subscriptions/cancel", async (req, res) => {
  const { subscriptionId } = req.body;
  try {
    await stripe.subscriptions.cancel(subscriptionId);
    res.json({ cancelled: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════
// BOOKING ROUTES
// ════════════════════════════════════════════════════════════

app.post("/api/bookings/:bookingId/approve", async (req, res) => {
  const { bookingId } = req.params;
  const { adminId } = req.body;
  try {
    await supabase.from("bookings")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq("id", bookingId);

    // Get booking details for email
    const { data: booking } = await supabase.from("bookings")
      .select("*, users!guest_id(email, user_metadata), properties(name)")
      .eq("id", bookingId).single();

    if (booking?.users?.email) {
      await sendBookingEmail("approved", booking.users.email, booking);
    }

    await supabase.from("admin_notes").insert({
      admin_id: adminId, entity_type: "booking", entity_id: bookingId,
      note: "Booking approved by admin", flag_level: "info",
    });

    res.json({ approved: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/bookings/:bookingId/decline", async (req, res) => {
  const { bookingId } = req.params;
  const { reason, adminId } = req.body;
  try {
    await supabase.from("bookings")
      .update({ status: "declined", admin_notes: reason })
      .eq("id", bookingId);
    res.json({ declined: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ════════════════════════════════════════════════════════════

app.get("/api/admin/stats", async (_, res) => {
  try {
    const [members, properties, agents, experiences, bookings, revenue] = await Promise.all([
      supabase.from("memberships").select("count", { count: "exact" }).eq("status", "active"),
      supabase.from("host_listings").select("count", { count: "exact" }).eq("status", "active"),
      supabase.from("agent_listings").select("count", { count: "exact" }).eq("status", "active"),
      supabase.from("experience_listings").select("count", { count: "exact" }).eq("status", "active"),
      supabase.from("bookings").select("count", { count: "exact" }).eq("status", "confirmed"),
      supabase.from("partner_revenue").select("amount").gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()),
    ]);

    const monthlyRevenue = (revenue.data || []).reduce((sum, r) => sum + r.amount, 0);

    res.json({
      activeMembers: members.count || 0,
      activeProperties: properties.count || 0,
      activeAgents: agents.count || 0,
      activeExperiences: experiences.count || 0,
      confirmedBookings: bookings.count || 0,
      monthlyRevenue,
    });
  } catch (err) {
    res.status(500).json({ error: "Stats unavailable" });
  }
});

app.post("/api/admin/listings/approve", async (req, res) => {
  const { type, listingId } = req.body;
  const tables: Record<string, string> = { property: "host_listings", agent: "agent_listings", experience: "experience_listings" };
  const table = tables[type];
  if (!table) return res.status(400).json({ error: "Invalid type" });

  try {
    const { data: listing } = await supabase.from(table).update({ status: "active" }).eq("id", listingId).select().single();
    const emailField = type === "property" ? "host_email" : "email";
    if (listing?.[emailField]) {
      await sendListingApprovedEmail(type, listing[emailField], listing);
    }
    res.json({ approved: true, listing });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/admin/listings/reject", async (req, res) => {
  const { type, listingId, reason } = req.body;
  const tables: Record<string, string> = { property: "host_listings", agent: "agent_listings", experience: "experience_listings" };
  const table = tables[type];
  if (!table) return res.status(400).json({ error: "Invalid type" });

  await supabase.from(table).update({ status: "rejected" }).eq("id", listingId);
  res.json({ rejected: true });
});

// ════════════════════════════════════════════════════════════
// NOTIFICATIONS — paste this block into server/index.ts
// Place it right after the /api/admin/listings/reject route
// (around line 218, before the FILE UPLOAD section)
// ════════════════════════════════════════════════════════════

// ── PARTNER APPLICATION NOTIFICATION ─────────────────────────
// Called by PartnerPortal.jsx after successful listing submit
app.post("/api/notifications/partner-application", async (req, res) => {
  const { category, partnerEmail, listingData } = req.body;
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) return res.json({ sent: false, reason: "OWNER_EMAIL not set" });

  try {
    const categoryNames: Record<string, string> = {
      property: "Estate / Property", agent: "Real Estate Agent",
      restaurant: "Restaurant / Dining", golf: "Golf Club / Course",
      cars: "Luxury Car Rental", medspa: "Med Spa & Wellness",
      aviation: "Private Aviation", yacht: "Yacht & Charters",
      shopping: "Luxury Shopping", wine: "Wine & Spirits",
      events: "Private Events", experience: "Experiences & Activities",
    };

    const name = listingData?.property_title || listingData?.restaurant_name ||
      listingData?.club_name || listingData?.company_name ||
      listingData?.business_name || listingData?.agent_name || "Untitled";

    const html = wrap(`
      <h2>New Partner Application</h2>
      <p>A new partner has submitted a listing application and is awaiting your review.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px 0;border-bottom:1px solid rgba(212,201,181,.1);color:rgba(248,245,240,.5);font-size:.75rem;font-family:Arial,sans-serif;width:140px">Category</td>
            <td style="padding:8px 0;border-bottom:1px solid rgba(212,201,181,.1);font-size:.82rem">${categoryNames[category] || category}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid rgba(212,201,181,.1);color:rgba(248,245,240,.5);font-size:.75rem;font-family:Arial,sans-serif">Listing Name</td>
            <td style="padding:8px 0;border-bottom:1px solid rgba(212,201,181,.1);font-size:.82rem">${name}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid rgba(212,201,181,.1);color:rgba(248,245,240,.5);font-size:.75rem;font-family:Arial,sans-serif">Partner Email</td>
            <td style="padding:8px 0;border-bottom:1px solid rgba(212,201,181,.1);font-size:.82rem">${partnerEmail}</td></tr>
        <tr><td style="padding:8px 0;color:rgba(248,245,240,.5);font-size:.75rem;font-family:Arial,sans-serif">Submitted</td>
            <td style="padding:8px 0;font-size:.82rem">${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</td></tr>
      </table>
      <p style="margin-top:8px;font-size:.78rem;color:rgba(248,245,240,.5);font-family:Arial,sans-serif">Log into your admin portal to review, approve, or reject this application.</p>
      <a href="${process.env.APP_URL || "https://monarcprive.com"}/admin" class="btn" style="margin-top:18px;display:inline-block">Review in Admin Portal →</a>
    `);

    await mailer().sendMail({
      from: `"Monarc Privé" <${process.env.SMTP_USER}>`,
      to: ownerEmail,
      subject: `New Partner Application — ${categoryNames[category] || category} — ${name}`,
      html,
    });

    res.json({ sent: true });
  } catch (e: any) {
    console.error("Partner notification error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

function wrap(content: string) {
  return emailBase(content);
}

function mailer() {
  return getMailTransporter();
}

// ── CONTACT FORM NOTIFICATION ────────────────────────────────
// Called by MonarcPrive-Complete.jsx contact form
app.post("/api/notifications/contact", async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) return res.json({ sent: false, reason: "OWNER_EMAIL not set" });

  try {
    const html = wrap(`
      <h2>New Contact Inquiry</h2>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px 0;border-bottom:1px solid rgba(212,201,181,.1);color:rgba(248,245,240,.5);font-size:.75rem;font-family:Arial,sans-serif;width:140px">Name</td>
            <td style="padding:8px 0;border-bottom:1px solid rgba(212,201,181,.1);font-size:.82rem">${firstName} ${lastName}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid rgba(212,201,181,.1);color:rgba(248,245,240,.5);font-size:.75rem;font-family:Arial,sans-serif">Email</td>
            <td style="padding:8px 0;border-bottom:1px solid rgba(212,201,181,.1);font-size:.82rem">${email}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid rgba(212,201,181,.1);color:rgba(248,245,240,.5);font-size:.75rem;font-family:Arial,sans-serif">Subject</td>
            <td style="padding:8px 0;border-bottom:1px solid rgba(212,201,181,.1);font-size:.82rem">${subject}</td></tr>
        <tr><td style="padding:8px 0;color:rgba(248,245,240,.5);font-size:.75rem;font-family:Arial,sans-serif;vertical-align:top;padding-top:12px">Message</td>
            <td style="padding:8px 0;font-size:.82rem;padding-top:12px;line-height:1.7">${message?.replace(/\n/g, "<br>") || "—"}</td></tr>
      </table>
      <p style="margin-top:8px;font-size:.78rem;color:rgba(248,245,240,.5);font-family:Arial,sans-serif">Reply directly to this email to respond to ${firstName}.</p>
    `);

    await mailer().sendMail({
      from: `"Monarc Privé" <${process.env.SMTP_USER}>`,
      to: ownerEmail,
      replyTo: email,   // ← reply goes straight to the person who contacted you
      subject: `Contact Form — ${subject} — ${firstName} ${lastName}`,
      html,
    });

    // Also send confirmation to the person who submitted
    const confirmHtml = wrap(`
      <h2>We received your message</h2>
      <p>Thank you for reaching out, ${firstName}. Our team will review your inquiry and respond personally within 24 hours.</p>
      <p style="margin-top:14px;font-size:.78rem;color:rgba(248,245,240,.5);font-family:Arial,sans-serif">
        <strong style="color:#F8F5F0">Subject:</strong> ${subject}<br/>
        <strong style="color:#F8F5F0">Submitted:</strong> ${new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}
      </p>
      <a href="${process.env.APP_URL || "https://monarcprive.com"}" class="btn" style="margin-top:20px;display:inline-block">Return to Monarc Privé</a>
    `);

    
    await mailer().sendMail({
      from: `"Monarc Privé" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `We received your message — Monarc Privé`,
      html: confirmHtml,
    });

    res.json({ sent: true });
  } catch (e: any) {
    console.error("Contact notification error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── WELCOME EMAIL (already exists, keeping for reference) ─────
// POST /api/notifications/welcome  →  already in your server

//////////////////


// ════════════════════════════════════════════════════════════
// FILE UPLOAD ROUTE
// ════════════════════════════════════════════════════════════

app.post("/api/upload", upload.array("files", 20), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const { bucket = "property-images", folder = "uploads" } = req.body;

  const urls: string[] = [];
  for (const file of files) {
    const ext = path.extname(file.originalname);
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 8)}${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(filename, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "3600",
    });

    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename);
      urls.push(publicUrl);
    }
  }

  res.json({ urls });
});

// ════════════════════════════════════════════════════════════
// STRIPE WEBHOOK
// ════════════════════════════════════════════════════════════

app.post("/api/webhooks/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;

        if (pi.metadata.product === "membership") {
          // Activate membership
          const tierAmounts: Record<number, string> = { 30000: "curated", 75000: "private", 150000: "founding" };
          const tier = tierAmounts[pi.amount] || "curated";
          const annualAmount: Record<string, number> = { curated: 300, private: 750, founding: 1500 };

          await supabase.from("memberships").upsert({
            email: pi.metadata.email,
            name: pi.metadata.name,
            stripe_customer_id: pi.customer as string,
            stripe_payment_intent_id: pi.id,
            tier,
            status: "active",
            amount_paid: annualAmount[tier],
            starts_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 365 * 86400000).toISOString(),
          }, { onConflict: "email" });

          await sendMembershipWelcomeEmail(pi.metadata.email, pi.metadata.name, tier);
          console.log(`✓ Membership activated: ${pi.metadata.email}`);
        }

        if (pi.metadata.booking_id) {
          await supabase.from("bookings")
            .update({ payment_status: "paid", status: "confirmed" })
            .eq("id", pi.metadata.booking_id);
          console.log(`✓ Booking payment confirmed: ${pi.metadata.booking_id}`);
        }
        break;
      }

      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const type = sub.metadata.type;
        const tables: Record<string, string> = { property: "host_listings", agent: "agent_listings", experience: "experience_listings" };
        const table = tables[type];

        if (table) {
          await supabase.from(table)
            .update({ stripe_subscription_id: sub.id, subscription_status: "active" })
            .eq("host_email", sub.metadata.email)
            .or(`email.eq.${sub.metadata.email}`);
        }

        await supabase.from("partner_revenue").insert({
          partner_type: type,
          revenue_type: "monthly_fee",
          amount: (sub.items.data[0]?.plan?.amount || 0) / 100,
          stripe_payment_id: sub.id,
          description: `${type} listing subscription`,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const type = sub.metadata.type;
        const tables: Record<string, string> = { property: "host_listings", agent: "agent_listings", experience: "experience_listings" };
        const table = tables[type];
        if (table) await supabase.from(table).update({ status: "paused", subscription_status: "cancelled" }).eq("stripe_subscription_id", sub.id);
        break;
      }

      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        console.log(`⚠ Payment failed for customer: ${inv.customer}`);
        // TODO: send payment failure email
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        await supabase.from("admin_notes").insert({
          entity_type: "booking",
          note: `URGENT: Stripe dispute opened. Amount: $${dispute.amount / 100}. Reason: ${dispute.reason}`,
          flag_level: "urgent",
        });
        // Alert owner
        if (process.env.OWNER_EMAIL) {
          await sendAdminAlert(process.env.OWNER_EMAIL, "Stripe Dispute", `Dispute opened for $${dispute.amount / 100}. Reason: ${dispute.reason}. Log in to Stripe dashboard immediately.`);
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// ════════════════════════════════════════════════════════════
// NOTIFICATION ROUTES
// ════════════════════════════════════════════════════════════

app.post("/api/notifications/test", async (req, res) => {
  const { to, type } = req.body;
  try {
    if (type === "welcome") await sendMembershipWelcomeEmail(to, "Test Member", "curated");
    if (type === "report") await sendReportEmail(to, "sales", "This is a test report.");
    res.json({ sent: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════
// SCHEDULED JOBS
// ════════════════════════════════════════════════════════════

// Weekly reports every Monday 8am MST
cron.schedule("0 8 * * 1", async () => {
  console.log("?? Running weekly AI reports...");
  const REPORT_AGENTS = ["sales", "marketing", "operations", "analytics"];
  for (const agentId of REPORT_AGENTS) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: AGENT_PROMPTS[agentId],
        messages: [{ role: "user", content: buildWeeklyReportPrompt(agentId) }],
      });
      const report = response.content.find(b => b.type === "text")?.text || "";
      await supabase.from("weekly_reports").insert({
        agent_id: agentId, user_id: "system", content: report,
        week_of: getWeekStart(), is_scheduled: true,
      });
      if (process.env.OWNER_EMAIL) await sendReportEmail(process.env.OWNER_EMAIL, agentId, report);
      console.log(`✓ ${agentId} report sent`);
    } catch (err) {
      console.error(`✗ ${agentId} report failed:`, err);
    }
  }
}, { timezone: "America/Phoenix" });

// Daily: expire memberships at midnight
cron.schedule("0 0 * * *", async () => {
  const { data } = await supabase.from("memberships")
    .update({ status: "expired" })
    .lt("expires_at", new Date().toISOString())
    .eq("status", "active")
    .select("email, name");

  if (data?.length) {
    console.log(`Expired ${data.length} memberships`);
    // TODO: send renewal emails
  }
}, { timezone: "America/Phoenix" });

// ════════════════════════════════════════════════════════════
// EMAIL HELPERS
// ════════════════════════════════════════════════════════════

function getMailTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.sendgrid.net",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function emailBase(content: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{font-family:Georgia,serif;background:#161412;color:#F8F5F0;margin:0;padding:0}
    .wrap{max-width:600px;margin:0 auto;padding:40px 20px}
    .logo{text-align:center;font-size:1.4rem;letter-spacing:.2em;text-transform:uppercase;color:#F8F5F0;margin-bottom:8px}
    .logo span{color:#C9A96E}
    .divider{width:60px;height:1px;background:linear-gradient(90deg,transparent,#C9A96E,transparent);margin:16px auto 32px}
    .content{font-size:15px;line-height:1.8;color:rgba(248,245,240,.8);font-weight:300}
    h2{color:#C9A96E;font-size:1.3rem;font-weight:400;letter-spacing:.03em;margin:24px 0 12px}
    .btn{display:inline-block;background:#C9A96E;color:#161412;padding:14px 32px;text-decoration:none;font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;font-weight:600;margin:20px 0;font-family:Arial,sans-serif}
    .footer{margin-top:40px;padding-top:24px;border-top:1px solid rgba(212,201,181,.1);font-size:.7rem;color:rgba(158,142,120,.7);text-align:center;line-height:1.6;font-family:Arial,sans-serif}
    strong{color:#F8F5F0;font-weight:500}
    .ref{display:inline-block;border:1px solid rgba(201,169,110,.3);padding:8px 18px;font-size:.7rem;letter-spacing:.25em;color:#C9A96E;margin:16px 0;font-family:Arial,sans-serif}
  </style></head><body><div class="wrap">
    <div class="logo">Monarc<span>·</span>Privé</div>
    <div class="divider"></div>
    <div class="content">${content}</div>
    <div class="footer">© ${new Date().getFullYear()} Monarc Privé · Scottsdale, Arizona<br>You are receiving this because you are a Monarc Privé member or partner.<br><a href="mailto:hello@monarcprive.com" style="color:#9E8E78">Unsubscribe</a></div>
  </div></body></html>`;
}

async function sendMembershipWelcomeEmail(to: string, name: string, tier: string) {
  const t = getMailTransporter();
  const tierNames: Record<string, string> = { curated: "Curated", private: "Private", founding: "Founding" };
  const prices: Record<string, string> = { curated: "$300", private: "$750", founding: "$1,500" };
  const html = emailBase(`
    <p>Dear ${name || "Member"},</p>
    <p>Welcome to Monarc Privé. Your <strong>${tierNames[tier]} Membership</strong> is now active.</p>
    <h2>Your Membership Details</h2>
    <p>Tier: <strong>${tierNames[tier]}</strong><br>
    Annual Fee: <strong>${prices[tier]}</strong><br>
    Valid Through: <strong>${new Date(Date.now() + 365*86400000).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</strong></p>
    <p>You now have exclusive access to Scottsdale's finest private estates, your AI concierge Sterling, and our full suite of luxury services.</p>
    <a href="${process.env.APP_URL || "https://monarcprive.com"}/portal" class="btn">Enter Member Portal</a>
    <p>Sterling, your AI concierge, has been briefed on your preferences and is ready to assist 24/7. Simply click the concierge button in your portal.</p>
    <p>We look forward to crafting unforgettable experiences for you.</p>
    <p>With warm regards,<br>The Monarc Privé Team</p>
  `);
  await t.sendMail({ from: `"Monarc Privé" <${process.env.SMTP_USER}>`, to, subject: `Welcome to Monarc Privé — Your ${tierNames[tier]} Membership is Active`, html });
}

async function sendListingApprovedEmail(type: string, to: string, listing: any) {
  const t = getMailTransporter();
  const typeNames: Record<string, string> = { property: "Property Listing", agent: "Agent Advertisement", experience: "Experience Listing" };
  const html = emailBase(`
    <p>Congratulations! Your <strong>${typeNames[type]}</strong> has been approved and is now live on Monarc Privé.</p>
    <h2>${listing.property_title || listing.agent_name || listing.experience_name}</h2>
    <p>Your listing is now visible to all Monarc Privé members. You can manage your listing from your partner dashboard.</p>
    <p>Reference: <span class="ref">${listing.reference || "MP-" + Math.random().toString(36).substr(2,8).toUpperCase()}</span></p>
    <a href="${process.env.APP_URL || "https://monarcprive.com"}/host" class="btn">View Your Dashboard</a>
    <p>Thank you for partnering with Monarc Privé.</p>
  `);
  await t.sendMail({ from: `"Monarc Privé" <${process.env.SMTP_USER}>`, to, subject: `Your Monarc Privé listing is live ✓`, html });
}

async function sendBookingEmail(status: string, to: string, booking: any) {
  const t = getMailTransporter();
  const subject = status === "approved" ? "Your booking request has been approved" : "Booking status update";
  const html = emailBase(`
    <p>Your booking request for <strong>${booking.properties?.name}</strong> has been <strong>${status}</strong>.</p>
    <p>Check-in: <strong>${booking.check_in}</strong><br>Check-out: <strong>${booking.check_out}</strong></p>
    <p>Reference: <span class="ref">${booking.reference}</span></p>
    <a href="${process.env.APP_URL}/portal" class="btn">View Booking Details</a>
  `);
  await t.sendMail({ from: `"Monarc Privé" <${process.env.SMTP_USER}>`, to, subject, html });
}

async function sendReportEmail(to: string, agentId: string, content: string) {
  const t = getMailTransporter();
  const names: Record<string, string> = { sales: "Aria — Sales & Revenue", marketing: "Celeste — Marketing", operations: "Atlas — Operations", analytics: "Orion — Analytics" };
  const html = emailBase(`<h2>${names[agentId] || agentId} Weekly Report</h2>${content.replace(/\n/g,"<br>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/^## (.+)$/gm,"<h2>$1</h2>").replace(/^# (.+)$/gm,"<h2>$1</h2>").replace(/^- (.+)$/gm,"• $1<br>")}`);
  await t.sendMail({ from: `"Monarc Privé AI" <${process.env.SMTP_USER}>`, to, subject: `${names[agentId]} · Weekly Report · ${new Date().toLocaleDateString()}`, html });
}

async function sendAdminAlert(to: string, subject: string, message: string) {
  const t = getMailTransporter();
  const html = emailBase(`<h2>⚠ Admin Alert</h2><p>${message}</p>`);
  await t.sendMail({ from: `"Monarc Privé System" <${process.env.SMTP_USER}>`, to, subject: `[URGENT] ${subject}`, html });
}

// ════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ════════════════════════════════════════════════════════════

function buildWeeklyReportPrompt(agentId: string): string {
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const prompts: Record<string, string> = {
    sales: `Generate a comprehensive weekly SALES & REVENUE report for the week ending ${date}. Include: 1) Executive Summary, 2) Key Metrics (bookings, revenue, conversion, avg booking value), 3) Property Performance Rankings, 4) Lead Pipeline, 5) Pricing Opportunities, 6) Risk Flags, 7) Next Week Priorities. Use specific numbers for a luxury Scottsdale rental with 6 properties averaging $3,000/night.`,
    marketing: `Generate a comprehensive weekly MARKETING & BRAND report for the week ending ${date}. Include: 1) Brand Health Summary, 2) Campaign Performance, 3) Content Highlights, 4) Audience Growth, 5) SEO & Traffic, 6) Upcoming Campaigns, 7) Next Week Content Plan.`,
    operations: `Generate a comprehensive weekly OPERATIONS report for the week ending ${date}. Include: 1) Operations Summary, 2) Property Readiness Scores (all 6), 3) Turnover Performance, 4) Vendor SLA Report, 5) Open Issues Log, 6) Upcoming Stays & Prep, 7) Process Improvements.`,
    analytics: `Generate a comprehensive weekly ANALYTICS & INTELLIGENCE report for the week ending ${date}. Include: 1) Platform Health (GMV, conversion, DAU), 2) Booking Analytics, 3) Guest Behavior Insights, 4) Revenue Intelligence, 5) 4-Week Forecast, 6) Market Intelligence, 7) Strategic Recommendations.`,
  };
  return prompts[agentId] || `Generate a weekly report for ${agentId} for the week ending ${date}.`;
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split("T")[0];
}

// ── START ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║  Monarc Privé — Production API Server        ║
  ║  Port: ${PORT}                                  ║
  ║  5 AI Agents Active                          ║
  ║  Stripe: ${process.env.STRIPE_SECRET_KEY ? "✓ Connected" : "✗ Not configured"}               ║
  ║  Supabase: ${process.env.SUPABASE_URL ? "✓ Connected" : "✗ Not configured"}           ║
  ║  Email: ${process.env.SMTP_HOST ? "✓ Configured" : "✗ Not configured"}               ║
  ║  Weekly reports: Monday 8am MST              ║
  ╚══════════════════════════════════════════════╝
  `);
});

export default app;
