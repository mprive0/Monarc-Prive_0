// ============================================================
// MONARC PRIVÉ — COMPLETE PRODUCTION BACKEND v2.0
// File: server/index.ts
// All routes: agents, payments, subscriptions, admin, uploads
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
import { AGENT_PROMPTS } from "./agents/prompts";

const app = express();
const PORT = process.env.PORT || 3001;

// ── CLIENTS ─────────────────────────────────────────────────
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// ── MIDDLEWARE ───────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: (process.env.ALLOWED_ORIGINS || "http://localhost:5173").split(","), credentials: true }));
app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "10mb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use("/api/agents", rateLimit({ windowMs: 60 * 1000, max: 30 }));

// ── HEALTH ───────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok", agents: 5, timestamp: new Date().toISOString() }));

// ════════════════════════════════════════════════════════════
// AGENT ROUTES
// ════════════════════════════════════════════════════════════

app.post("/api/agents/:agentId/chat", async (req, res) => {
  const { agentId } = req.params;
  const { messages, userId } = req.body;
  if (!AGENT_PROMPTS[agentId]) return res.status(404).json({ error: "Agent not found" });
  try {
    const r = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514", max_tokens: 1500,
      system: AGENT_PROMPTS[agentId], messages: (messages || []).slice(-20),
    });
    const reply = r.content.find((b: any) => b.type === "text")?.text || "";
    await supabase.from("agent_conversations").insert({ agent_id: agentId, user_id: userId, messages, response: reply });
    res.json({ reply, usage: r.usage });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/agents/:agentId/weekly-report", async (req, res) => {
  const { agentId } = req.params;
  const { email, userId } = req.body;
  if (!AGENT_PROMPTS[agentId]) return res.status(404).json({ error: "Agent not found" });
  try {
    const r = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514", max_tokens: 1500,
      system: AGENT_PROMPTS[agentId],
      messages: [{ role: "user", content: buildWeeklyPrompt(agentId) }],
    });
    const report = r.content.find((b: any) => b.type === "text")?.text || "";
    const { data } = await supabase.from("weekly_reports")
      .insert({ agent_id: agentId, user_id: userId, content: report, week_of: weekStart() })
      .select().single();
    if (email) await emailReport(email, agentId, report);
    res.json({ report, reportId: data?.id });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.get("/api/reports/:userId", async (req, res) => {
  const { data } = await supabase.from("weekly_reports").select("*")
    .eq("user_id", req.params.userId).order("timestamp", { ascending: false }).limit(50);
  res.json({ reports: data || [] });
});

app.post("/api/concierge/chat", async (req, res) => {
  const { messages, guestName, bookingId } = req.body;
  try {
    const system = AGENT_PROMPTS.concierge +
      (guestName ? `\n\nYou are speaking with ${guestName}.` : "") +
      (bookingId ? `\n\nBooking reference: ${bookingId}.` : "");
    const r = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514", max_tokens: 1000, system,
      messages: (messages || []).slice(-10),
    });
    const reply = r.content.find((b: any) => b.type === "text")?.text || "";
    await supabase.from("concierge_chats").insert({ guest_name: guestName, booking_id: bookingId, message: messages?.at(-1)?.content, response: reply });
    res.json({ reply });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════════════════════
// PAYMENT ROUTES
// ════════════════════════════════════════════════════════════

app.post("/api/payments/create-membership-intent", async (req, res) => {
  const { email, name, tier = "curated" } = req.body;
  const amounts: Record<string, number> = { curated: 30000, private: 75000, founding: 150000 };
  try {
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data[0] || await stripe.customers.create({ email, name });
    const pi = await stripe.paymentIntents.create({
      amount: amounts[tier] || 30000, currency: "usd", customer: customer.id,
      metadata: { product: "membership", tier, email, name },
      description: `Monarc Privé ${tier} Membership`,
      statement_descriptor: "MONARC PRIVE", receipt_email: email,
    });
    res.json({ clientSecret: pi.client_secret, paymentIntentId: pi.id, customerId: customer.id });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/payments/create-booking-intent", async (req, res) => {
  const { bookingId, amount, bookingReference, paymentType = "full_payment" } = req.body;
  try {
    const pi = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), currency: "usd",
      metadata: { booking_id: bookingId, booking_reference: bookingReference, payment_type: paymentType },
      statement_descriptor: "MONARC PRIVE",
    });
    res.json({ clientSecret: pi.client_secret });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════════════════════
// SUBSCRIPTION ROUTES
// ════════════════════════════════════════════════════════════

app.post("/api/subscriptions/create", async (req, res) => {
  const { email, name, type, priceId } = req.body;
  if (!email || !type || !priceId) return res.status(400).json({ error: "email, type, priceId required" });
  try {
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data[0] || await stripe.customers.create({ email, name, metadata: { type } });
    const sub = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: { type, email, name },
    });
    const invoice = sub.latest_invoice as any;
    res.json({ subscriptionId: sub.id, clientSecret: invoice.payment_intent?.client_secret, customerId: customer.id });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/subscriptions/cancel", async (req, res) => {
  try {
    await stripe.subscriptions.cancel(req.body.subscriptionId);
    res.json({ cancelled: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════════════════════
// BOOKING ROUTES
// ════════════════════════════════════════════════════════════

app.post("/api/bookings/:id/approve", async (req, res) => {
  const { id } = req.params;
  await supabase.from("bookings").update({ status: "approved" }).eq("id", id);
  const { data: b } = await supabase.from("bookings").select("*, users:guest_id(email, raw_user_meta_data), properties(name)").eq("id", id).single();
  if (b?.users?.email) await emailBooking("approved", b.users.email, b);
  res.json({ approved: true });
});

app.post("/api/bookings/:id/decline", async (req, res) => {
  await supabase.from("bookings").update({ status: "declined", admin_notes: req.body.reason }).eq("id", req.params.id);
  res.json({ declined: true });
});

// ════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ════════════════════════════════════════════════════════════

app.get("/api/admin/stats", async (_, res) => {
  try {
    const [m, p, a, e, b] = await Promise.all([
      supabase.from("memberships").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("host_listings").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("agent_listings").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("experience_listings").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    ]);
    const pm = await supabase.from("host_listings").select("*", { count: "exact", head: true }).eq("status", "pending");
    const pa = await supabase.from("agent_listings").select("*", { count: "exact", head: true }).eq("status", "pending");
    const pe = await supabase.from("experience_listings").select("*", { count: "exact", head: true }).eq("status", "pending");
    res.json({ activeMembers: m.count, activeProperties: p.count, activeAgents: a.count, activeExperiences: e.count, confirmedBookings: b.count, pendingProperties: pm.count, pendingAgents: pa.count, pendingExperiences: pe.count });
  } catch { res.status(500).json({ error: "Stats unavailable" }); }
});

app.post("/api/admin/listings/approve", async (req, res) => {
  const { type, listingId } = req.body;
  const tables: Record<string, string> = { property: "host_listings", agent: "agent_listings", experience: "experience_listings" };
  const table = tables[type]; if (!table) return res.status(400).json({ error: "Invalid type" });
  const { data } = await supabase.from(table).update({ status: "active" }).eq("id", listingId).select().single();
  const emailField = type === "property" ? "host_email" : "email";
  if (data?.[emailField]) await emailListingApproved(type, data[emailField], data);
  res.json({ approved: true });
});

app.post("/api/admin/listings/reject", async (req, res) => {
  const { type, listingId } = req.body;
  const tables: Record<string, string> = { property: "host_listings", agent: "agent_listings", experience: "experience_listings" };
  await supabase.from(tables[type]).update({ status: "rejected" }).eq("id", listingId);
  res.json({ rejected: true });
});

// ════════════════════════════════════════════════════════════
// FILE UPLOAD
// ════════════════════════════════════════════════════════════

app.post("/api/upload", upload.array("files", 20), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const { bucket = "property-images", folder = "uploads" } = req.body;
  const urls: string[] = [];
  for (const file of files) {
    const ext = path.extname(file.originalname);
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 8)}${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(filename, file.buffer, { contentType: file.mimetype });
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
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"] as string, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e: any) { return res.status(400).send(`Webhook Error: ${e.message}`); }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      if (pi.metadata.product === "membership") {
        const tierAmounts: Record<number, string> = { 30000: "curated", 75000: "private", 150000: "founding" };
        const annualPrices: Record<string, number> = { curated: 300, private: 750, founding: 1500 };
        const tier = tierAmounts[pi.amount] || "curated";
        await supabase.from("memberships").upsert({
          email: pi.metadata.email, name: pi.metadata.name, stripe_customer_id: pi.customer as string,
          stripe_payment_intent_id: pi.id, tier, status: "active", amount_paid: annualPrices[tier],
          starts_at: new Date().toISOString(), expires_at: new Date(Date.now() + 365 * 86400000).toISOString(),
        }, { onConflict: "email" });
        await emailWelcome(pi.metadata.email, pi.metadata.name, tier);
      }
      if (pi.metadata.booking_id) {
        await supabase.from("bookings").update({ payment_status: "paid", status: "confirmed" }).eq("id", pi.metadata.booking_id);
      }
      break;
    }
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      const tables: Record<string, string> = { property: "host_listings", agent: "agent_listings", experience: "experience_listings" };
      const table = tables[sub.metadata.type];
      if (table) await supabase.from(table).update({ stripe_subscription_id: sub.id, subscription_status: "active" }).or(`host_email.eq.${sub.metadata.email},email.eq.${sub.metadata.email}`);
      await supabase.from("partner_revenue").insert({ partner_type: sub.metadata.type, revenue_type: "monthly_fee", amount: (sub.items.data[0]?.plan?.amount || 0) / 100, stripe_payment_id: sub.id });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const tables: Record<string, string> = { property: "host_listings", agent: "agent_listings", experience: "experience_listings" };
      const table = tables[sub.metadata.type];
      if (table) await supabase.from(table).update({ status: "paused", subscription_status: "cancelled" }).eq("stripe_subscription_id", sub.id);
      break;
    }
    case "charge.dispute.created": {
      const d = event.data.object as Stripe.Dispute;
      await supabase.from("admin_notes").insert({ entity_type: "booking", note: `URGENT DISPUTE: $${d.amount / 100} — ${d.reason}`, flag_level: "urgent" });
      if (process.env.OWNER_EMAIL) await emailAlert(process.env.OWNER_EMAIL, "Stripe Dispute Opened", `Amount: $${d.amount / 100}. Reason: ${d.reason}. Check Stripe dashboard immediately.`);
      break;
    }
  }
  res.json({ received: true });
});

// ════════════════════════════════════════════════════════════
// SCHEDULED JOBS
// ════════════════════════════════════════════════════════════

// Weekly reports — Monday 8am MST
cron.schedule("0 8 * * 1", async () => {
  console.log("🤖 Running weekly AI reports...");
  for (const agentId of ["sales", "marketing", "operations", "analytics"]) {
    try {
      const r = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514", max_tokens: 1500, system: AGENT_PROMPTS[agentId],
        messages: [{ role: "user", content: buildWeeklyPrompt(agentId) }],
      });
      const report = r.content.find((b: any) => b.type === "text")?.text || "";
      await supabase.from("weekly_reports").insert({ agent_id: agentId, user_id: "system", content: report, week_of: weekStart(), is_scheduled: true });
      if (process.env.OWNER_EMAIL) await emailReport(process.env.OWNER_EMAIL, agentId, report);
      console.log(`  ✓ ${agentId} report sent`);
    } catch (e) { console.error(`  ✗ ${agentId} failed:`, e); }
  }
}, { timezone: "America/Phoenix" });

// Expire memberships — daily midnight
cron.schedule("0 0 * * *", async () => {
  await supabase.from("memberships").update({ status: "expired" }).lt("expires_at", new Date().toISOString()).eq("status", "active");
}, { timezone: "America/Phoenix" });

// ════════════════════════════════════════════════════════════
// EMAIL SYSTEM
// ════════════════════════════════════════════════════════════

const mailer = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.sendgrid.net",
  port: Number(process.env.SMTP_PORT) || 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const wrap = (body: string) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Georgia,serif;background:#161412;color:#F8F5F0;margin:0}.w{max-width:600px;margin:0 auto;padding:40px 24px}.logo{text-align:center;font-size:1.3rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px}.logo span{color:#C9A96E}.d{width:50px;height:1px;background:linear-gradient(90deg,transparent,#C9A96E,transparent);margin:14px auto 28px}.c{font-size:15px;line-height:1.8;color:rgba(248,245,240,.8);font-weight:300}h2{color:#C9A96E;font-size:1.2rem;font-weight:400;margin:20px 0 10px}.btn{display:inline-block;background:#C9A96E;color:#161412;padding:13px 28px;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600;margin:18px 0;text-decoration:none;font-family:Arial,sans-serif}.f{margin-top:36px;padding-top:20px;border-top:1px solid rgba(212,201,181,.1);font-size:.65rem;color:rgba(158,142,120,.65);text-align:center;font-family:Arial,sans-serif}</style></head><body><div class="w"><div class="logo">Monarc<span>·</span>Privé</div><div class="d"></div><div class="c">${body}</div><div class="f">© ${new Date().getFullYear()} Monarc Privé · Scottsdale, AZ</div></div></body></html>`;

async function emailWelcome(to: string, name: string, tier: string) {
  const tNames: Record<string, string> = { curated: "Curated", private: "Private", founding: "Founding" };
  const tPrices: Record<string, string> = { curated: "$300", private: "$750", founding: "$1,500" };
  const html = wrap(`<p>Dear ${name || "Member"},</p><p>Welcome to Monarc Privé. Your <strong>${tNames[tier]} Membership</strong> is now active.</p><h2>Your Membership</h2><p>Tier: <strong>${tNames[tier]}</strong> · Fee: <strong>${tPrices[tier]}/year</strong><br>Expires: <strong>${new Date(Date.now()+365*86400000).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</strong></p><p>Sterling, your AI concierge, is ready to assist 24/7 in your portal.</p><a href="${process.env.APP_URL||"https://monarcprive.com"}/portal" class="btn">Enter Member Portal</a><p>With warm regards,<br>The Monarc Privé Team</p>`);
  await mailer().sendMail({ from: `"Monarc Privé" <${process.env.SMTP_USER}>`, to, subject: `Welcome to Monarc Privé — ${tNames[tier]} Membership Active`, html });
}

async function emailListingApproved(type: string, to: string, listing: any) {
  const typeNames: Record<string, string> = { property: "Property Listing", agent: "Agent Advertisement", experience: "Experience Listing" };
  const html = wrap(`<p>Great news — your <strong>${typeNames[type]}</strong> has been approved and is now live on Monarc Privé.</p><p>It is now visible to all members. Manage it from your partner dashboard.</p><a href="${process.env.APP_URL||"https://monarcprive.com"}/host" class="btn">View Dashboard</a>`);
  await mailer().sendMail({ from: `"Monarc Privé" <${process.env.SMTP_USER}>`, to, subject: "Your Monarc Privé listing is live ✓", html });
}

async function emailBooking(status: string, to: string, booking: any) {
  const html = wrap(`<p>Your booking at <strong>${booking.properties?.name || "your selected estate"}</strong> has been <strong>${status}</strong>.</p><p>Check-in: <strong>${booking.check_in}</strong> · Check-out: <strong>${booking.check_out}</strong></p><a href="${process.env.APP_URL||"https://monarcprive.com"}/portal" class="btn">View Booking</a>`);
  await mailer().sendMail({ from: `"Monarc Privé" <${process.env.SMTP_USER}>`, to, subject: `Booking ${status} — Monarc Privé`, html });
}

async function emailReport(to: string, agentId: string, content: string) {
  const names: Record<string, string> = { sales: "Aria — Sales & Revenue", marketing: "Celeste — Marketing", operations: "Atlas — Operations", analytics: "Orion — Analytics" };
  const formatted = content.replace(/\n/g,"<br>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/^## (.+)$/gm,"<h2>$1</h2>");
  const html = wrap(`<h2>${names[agentId]||agentId} · Weekly Report</h2>${formatted}`);
  await mailer().sendMail({ from: `"Monarc Privé AI" <${process.env.SMTP_USER}>`, to, subject: `${names[agentId]||agentId} · Weekly Report · ${new Date().toLocaleDateString()}`, html });
}

async function emailAlert(to: string, subject: string, message: string) {
  const html = wrap(`<h2>⚠ Admin Alert</h2><p>${message}</p>`);
  await mailer().sendMail({ from: `"Monarc Privé System" <${process.env.SMTP_USER}>`, to, subject: `[URGENT] ${subject}`, html });
}

// ════════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════════

function buildWeeklyPrompt(agentId: string): string {
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const prompts: Record<string, string> = {
    sales: `Generate a comprehensive SALES & REVENUE weekly report for ${date}. Include: Executive Summary, Key Metrics (bookings/revenue/conversion/avg booking value), Property Performance Rankings (all 6 estates), Lead Pipeline Analysis, Pricing Opportunities, Risk Flags, Next Week Priorities. Use realistic numbers for a luxury Scottsdale rental portfolio averaging $3,000/night.`,
    marketing: `Generate a comprehensive MARKETING & BRAND weekly report for ${date}. Include: Brand Health Summary, Campaign Performance, Content Created This Week, Audience Insights, SEO & Traffic Highlights, Upcoming Campaigns, Next Week Content Calendar.`,
    operations: `Generate a comprehensive OPERATIONS weekly report for ${date}. Include: Operations Summary, Property Readiness Scores for all 6 estates (traffic-light format), Turnover Performance, Vendor SLA Report, Open Issues Log, Upcoming Stay Prep Items, Process Improvement Recommendations.`,
    analytics: `Generate a comprehensive ANALYTICS & INTELLIGENCE weekly report for ${date}. Include: Platform Health (GMV, conversion rate, active users), Booking Analytics, Guest Behavior Insights, Revenue Intelligence, 4-Week Forward Forecast, Market Benchmarks, Strategic Recommendations.`,
  };
  return prompts[agentId] || `Generate a weekly report for ${agentId} for the week ending ${date}.`;
}

function weekStart(): string {
  const d = new Date(); const day = d.getDay();
  return new Date(d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))).toISOString().split("T")[0];
}

// ── START ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  Monarc Privé API — Port ${PORT}\n  Agents: 5 active | Reports: Monday 8am MST\n`);
});

export default app;
