// ============================================================
// Monarc Privé — Stripe Webhook Handler
// File: server/webhooks/stripe.ts
// ============================================================

import express from "express";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

// Use raw body for Stripe signature verification
router.post("/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Stripe webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const bookingId = pi.metadata.booking_id;

        await supabase.from("bookings").update({
          payment_status: "paid",
          status: "confirmed",
          stripe_payment_intent_id: pi.id,
        }).eq("id", bookingId);

        await supabase.from("payments").insert({
          booking_id: bookingId,
          stripe_payment_intent_id: pi.id,
          amount: pi.amount / 100,
          payment_type: pi.metadata.payment_type || "full_payment",
          status: "succeeded",
        });

        await supabase.from("notification_logs").insert({
          type: "booking_confirmed",
          channel: "email",
          title: "Booking Confirmed — Monarc Privé",
          body: `Your booking has been confirmed. Reference: ${pi.metadata.booking_reference}`,
          reference_type: "booking",
        });

        console.log(`✓ Payment succeeded for booking ${bookingId}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const bookingId = pi.metadata.booking_id;

        await supabase.from("bookings").update({
          payment_status: "unpaid",
          status: "payment_pending",
        }).eq("id", bookingId);

        console.log(`✗ Payment failed for booking ${bookingId}`);
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        console.log(`⚠ Dispute created: ${dispute.id}`);

        await supabase.from("admin_notes").insert({
          entity_type: "booking",
          note: `Stripe dispute opened: ${dispute.reason}. Amount: $${dispute.amount / 100}`,
          flag_level: "urgent",
        });
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log(`Refund processed: ${charge.id}`);
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// ── CREATE PAYMENT INTENT ────────────────────────────────────
router.post("/create-payment-intent", async (req, res) => {
  const { bookingId, amount, bookingReference, paymentType = "full_payment" } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        booking_id: bookingId,
        booking_reference: bookingReference,
        payment_type: paymentType,
        platform: "monarc_prive",
      },
      description: `Monarc Privé — ${paymentType} — ${bookingReference}`,
      statement_descriptor: "MONARC PRIVE",
      statement_descriptor_suffix: "BOOKING",
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── CAPTURE SECURITY DEPOSIT ─────────────────────────────────
router.post("/capture-deposit", async (req, res) => {
  const { bookingId, depositAmount, guestEmail, guestName } = req.body;

  try {
    // Create a setup intent to save payment method for deposit
    const customer = await stripe.customers.create({
      email: guestEmail,
      name: guestName,
      metadata: { booking_id: bookingId },
    });

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      usage: "off_session",
      metadata: { booking_id: bookingId, deposit_amount: depositAmount.toString() },
    });

    res.json({ clientSecret: setupIntent.client_secret, customerId: customer.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── PAYOUT TO HOST ────────────────────────────────────────────
router.post("/payout-host", async (req, res) => {
  const { hostStripeAccountId, amount, bookingId } = req.body;

  try {
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      destination: hostStripeAccountId,
      metadata: { booking_id: bookingId },
    });

    await supabase.from("payouts").update({
      stripe_transfer_id: transfer.id,
      status: "paid",
      payout_date: new Date().toISOString().split("T")[0],
    }).eq("booking_id", bookingId);

    res.json({ transfer });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
