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
  const tPrices: Record<string, string> = { curated: "$300", private: "$750", founding: "By Invitation" };
  const firstName = name?.split(" ")[0] || "Member";
  const ref = "MP-" + Math.random().toString(36).substr(2,8).toUpperCase();
  const expiry = new Date(Date.now()+365*86400000).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  const joinDate = new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  const siteUrl = process.env.APP_URL || "https://monarcprive.com";

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Welcome to Monarc Privé</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Georgia,serif;background:#0E0C0A;color:#F8F5F0;-webkit-font-smoothing:antialiased}
.wrap{max-width:600px;margin:0 auto;background:#0E0C0A}
.hdr{background:#0E0C0A;padding:36px 44px 28px;text-align:center;border-bottom:1px solid rgba(201,169,110,.15)}
.logo{font-size:1.5rem;font-weight:300;letter-spacing:.22em;text-transform:uppercase;color:#F8F5F0}
.logo span{color:#C9A96E}
.logo-sub{font-size:.5rem;letter-spacing:.4em;text-transform:uppercase;color:#9E8E78;margin-top:5px;font-family:Arial,sans-serif}
.div{width:48px;height:1px;background:linear-gradient(90deg,transparent,#C9A96E,transparent);margin:14px auto}
.hero{background:#161412;padding:48px 44px 40px;text-align:center}
.eye{font-size:.5rem;letter-spacing:.4em;text-transform:uppercase;color:#C9A96E;margin-bottom:14px;font-family:Arial,sans-serif}
.h1{font-size:2.2rem;font-weight:300;color:#F8F5F0;line-height:1.1;margin-bottom:14px}
.h1 em{font-style:italic;color:#E2C896}
.hero-p{font-size:.88rem;color:rgba(248,245,240,.62);font-weight:300;line-height:1.85;max-width:420px;margin:0 auto;font-family:Arial,sans-serif}
.mc{background:#1E1C19;border:1px solid rgba(201,169,110,.2);border-radius:3px;padding:26px 30px;margin:0 44px;position:relative;overflow:hidden}
.mc-top{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#C9A96E,transparent)}
.mc-badge{font-size:.5rem;letter-spacing:.34em;text-transform:uppercase;color:#C9A96E;margin-bottom:8px;font-family:Arial,sans-serif}
.mc-tier{font-size:1.5rem;font-weight:300;color:#F8F5F0;margin-bottom:3px}
.mc-ref{font-size:.56rem;letter-spacing:.2em;text-transform:uppercase;color:#9E8E78;margin-bottom:18px;font-family:Arial,sans-serif}
.mc-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(212,201,181,.06);font-family:Arial,sans-serif}
.mc-lbl{font-size:.7rem;color:rgba(248,245,240,.42);font-weight:300}
.mc-val{font-size:.7rem;color:#F8F5F0;font-weight:400}
.mc-val.g{color:#C9A96E}
.sec{padding:40px 44px;background:#0E0C0A}
.sec-eye{font-size:.5rem;letter-spacing:.36em;text-transform:uppercase;color:#C9A96E;margin-bottom:12px;font-family:Arial,sans-serif}
.sec-title{font-size:1.4rem;font-weight:300;color:#F8F5F0;margin-bottom:18px}
.perk-row{display:flex;gap:12px;margin-bottom:10px}
.perk{background:#161412;border:1px solid rgba(212,201,181,.1);border-radius:2px;padding:14px;flex:1}
.perk-icon{font-size:1rem;color:#C9A96E;margin-bottom:7px;display:block}
.perk-name{font-size:.82rem;color:#F8F5F0;margin-bottom:3px}
.perk-desc{font-size:.66rem;color:rgba(248,245,240,.4);font-weight:300;line-height:1.5;font-family:Arial,sans-serif}
.sterling{background:#161412;border:1px solid rgba(201,169,110,.15);border-radius:3px;padding:24px 28px;margin-bottom:28px}
.s-hdr{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.s-av{width:40px;height:40px;border-radius:50%;background:rgba(201,169,110,.12);border:1px solid rgba(201,169,110,.25);display:flex;align-items:center;justify-content:center;font-size:1rem;color:#C9A96E;flex-shrink:0;text-align:center;line-height:40px}
.s-name{font-size:1rem;color:#F8F5F0;font-weight:300}
.s-role{font-size:.54rem;letter-spacing:.14em;text-transform:uppercase;color:#C9A96E;font-family:Arial,sans-serif}
.s-msg{font-size:.8rem;color:rgba(248,245,240,.6);font-weight:300;line-height:1.8;font-style:italic;font-family:Georgia,serif}
.estate-row{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid rgba(212,201,181,.07);font-family:Arial,sans-serif}
.e-name{font-size:.9rem;color:#F8F5F0}
.e-detail{font-size:.62rem;color:#9E8E78;font-weight:300;margin-top:2px}
.e-price{font-size:.88rem;color:#C9A96E}
.cta-sec{text-align:center;padding:40px 44px;background:#161412;border-top:1px solid rgba(212,201,181,.1);border-bottom:1px solid rgba(212,201,181,.1)}
.cta-title{font-size:1.5rem;font-weight:300;color:#F8F5F0;margin-bottom:10px}
.cta-p{font-size:.78rem;color:rgba(248,245,240,.5);font-weight:300;line-height:1.75;margin-bottom:22px;font-family:Arial,sans-serif}
.btn{display:inline-block;background:#C9A96E;color:#161412;font-family:Arial,sans-serif;font-size:.6rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;padding:15px 38px;border-radius:2px}
.ft{padding:28px 44px;text-align:center;border-top:1px solid rgba(212,201,181,.08)}
.ft-logo{font-size:.95rem;font-weight:300;letter-spacing:.18em;text-transform:uppercase;color:rgba(248,245,240,.4);margin-bottom:10px}
.ft-logo span{color:#C9A96E}
.ft-copy{font-size:.6rem;color:rgba(248,245,240,.2);font-weight:300;line-height:1.7;font-family:Arial,sans-serif}
</style></head><body>
<div class="wrap">
<div class="hdr"><div class="logo">Monarc<span>·</span>Privé</div><div class="logo-sub">Private Estates · Scottsdale, Arizona</div><div class="div"></div></div>
<div class="hero">
  <div class="eye">Welcome, ${firstName}</div>
  <div class="h1">Your membership<br/>is <em>active.</em></div>
  <p class="hero-p">You now have exclusive access to Scottsdale's most private portfolio of luxury estates, our full network of curated partners, and Sterling — your personal AI concierge available around the clock.</p>
</div>
<div class="mc">
  <div class="mc-top"></div>
  <div class="mc-badge">◈ Membership Details</div>
  <div class="mc-tier">${tNames[tier]} Member</div>
  <div class="mc-ref">${ref}</div>
  <div>
    <div class="mc-row"><span class="mc-lbl">Member Name</span><span class="mc-val">${name || firstName}</span></div>
    <div class="mc-row"><span class="mc-lbl">Membership Tier</span><span class="mc-val g">${tNames[tier]}</span></div>
    <div class="mc-row"><span class="mc-lbl">Annual Fee</span><span class="mc-val">${tPrices[tier]}</span></div>
    <div class="mc-row"><span class="mc-lbl">Valid Through</span><span class="mc-val">${expiry}</span></div>
    <div class="mc-row"><span class="mc-lbl">Member Since</span><span class="mc-val">${joinDate}</span></div>
    <div class="mc-row"><span class="mc-lbl">Status</span><span class="mc-val g">● Active</span></div>
  </div>
</div>
<div class="sec">
  <div class="sec-eye">Your Access</div>
  <div class="sec-title">Everything Monarc Privé has to offer</div>
  <div class="perk-row">
    <div class="perk"><span class="perk-icon">◈</span><div class="perk-name">6 Private Estates</div><div class="perk-desc">Paradise Valley and Scottsdale's finest from $1,650 to $5,800 per night</div></div>
    <div class="perk"><span class="perk-icon">◌</span><div class="perk-name">Sterling Concierge</div><div class="perk-desc">Your personal AI concierge available 24 hours a day, 7 days a week</div></div>
  </div>
  <div class="perk-row">
    <div class="perk"><span class="perk-icon">🍽</span><div class="perk-name">Curated Dining</div><div class="perk-desc">Priority reservations at Nobu, Maple & Ash, Bourbon Steak and more</div></div>
    <div class="perk"><span class="perk-icon">🚗</span><div class="perk-name">Exotic Vehicles</div><div class="perk-desc">Ferrari, Rolls-Royce and Lamborghini delivered to your estate door</div></div>
  </div>
  <div class="perk-row">
    <div class="perk"><span class="perk-icon">⛳</span><div class="perk-name">World-Class Golf</div><div class="perk-desc">TPC Scottsdale, Troon North, Desert Highlands access arranged</div></div>
    <div class="perk"><span class="perk-icon">✈</span><div class="perk-name">Private Aviation</div><div class="perk-desc">Jet charters and helicopter tours from Scottsdale Airport</div></div>
  </div>
  <div class="sec-eye" style="margin-top:28px">Your Personal Concierge</div>
  <div class="sterling">
    <div class="s-hdr"><div class="s-av">◌</div><div><div class="s-name">Sterling</div><div class="s-role">Personal AI Concierge · 24/7</div></div></div>
    <p class="s-msg">"Good day, ${firstName}. I have been briefed on your membership and I am ready to assist you. Whether you would like to arrange a private chef for your arrival, reserve a table at Nobu, book a sunrise horseback ride, or have a Rolls-Royce waiting at your estate — simply ask. I am here every hour of every day."</p>
  </div>
  <div class="sec-eye">Your Private Portfolio</div>
  <div class="sec-title">Six curated estates</div>
  <div class="estate-row"><div><div class="e-name">Casa del Cielo</div><div class="e-detail">Paradise Valley · 6bd · Sleeps 14</div></div><div class="e-price">$2,800/nt</div></div>
  <div class="estate-row"><div><div class="e-name">The Ironwood Estate</div><div class="e-detail">North Scottsdale · 8bd · Sleeps 20 · Event-Ready</div></div><div class="e-price">$4,200/nt</div></div>
  <div class="estate-row"><div><div class="e-name">Hacienda Serena</div><div class="e-detail">Scottsdale · 4bd · Sleeps 8 · Wellness</div></div><div class="e-price">$1,650/nt</div></div>
  <div class="estate-row"><div><div class="e-name">Monolith Modern</div><div class="e-detail">Paradise Valley · 5bd · Sleeps 10</div></div><div class="e-price">$3,500/nt</div></div>
  <div class="estate-row"><div><div class="e-name">The Camelback Retreat</div><div class="e-detail">Paradise Valley · 9bd · Sleeps 22 · Elite</div></div><div class="e-price">$5,800/nt</div></div>
  <div class="estate-row"><div><div class="e-name">Desert Glass House</div><div class="e-detail">North Scottsdale · 4bd · Sleeps 8</div></div><div class="e-price">$2,100/nt</div></div>
</div>
<div class="cta-sec">
  <div class="cta-title">Your first stay awaits</div>
  <p class="cta-p">Browse all six estates, speak with Sterling, and begin planning something unforgettable.<br/>This is Scottsdale the way it was meant to be experienced.</p>
  <a href="${siteUrl}" class="btn">Browse Private Estates</a>
</div>
<div class="ft">
  <div class="ft-logo">Monarc<span>·</span>Privé</div>
  <div class="ft-copy">You are receiving this because you recently joined Monarc Privé.<br/>Your membership is confirmed and active.<br/>© ${new Date().getFullYear()} Monarc Privé · Scottsdale, Arizona</div>
</div>
</div></body></html>`;

  await mailer().sendMail({
    from: `"Monarc Privé" <${process.env.SMTP_USER}>`,
    to,
    subject: `Welcome to Monarc Privé — Your ${tNames[tier]} Membership Is Active`,
    html,
  });
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
