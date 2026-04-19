// ============================================================
// Monarc Privé — Stripe Payment Integration
// File: src/components/StripePayment.jsx
// Replace the mock payment form with this for real charges
// ============================================================

// SETUP:
// npm install @stripe/stripe-js @stripe/react-stripe-js
// Add to your .env: VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_STYLE = {
  style: {
    base: {
      fontFamily: "'Jost', system-ui, sans-serif",
      fontSize: "14px",
      color: "#F8F5F0",
      fontWeight: "300",
      letterSpacing: "0.02em",
      "::placeholder": { color: "rgba(158,142,120,0.4)" },
    },
    invalid: { color: "#E05252" },
  },
};

// ── INNER FORM (must be inside <Elements>) ──────────────────
function PaymentForm({ onSuccess, onError, memberName, email }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [nameOnCard, setNameOnCard] = useState(memberName || "");

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);

    try {
      // 1. Create PaymentIntent on your backend
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-membership-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: nameOnCard }),
      });
      const { clientSecret, error: backendError } = await res.json();
      if (backendError) throw new Error(backendError);

      // 2. Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name: nameOnCard, email },
        },
      });

      if (error) throw new Error(error.message);
      if (paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      onError(err.message);
    }
    setProcessing(false);
  };

  return (
    <div>
      <div className="payment-summary">
        <div className="payment-sum-row"><span>Monarc Privé Annual Membership</span><span>$300.00</span></div>
        <div className="payment-sum-row"><span>Platform fee</span><span>$0.00</span></div>
        <div className="payment-sum-row total"><span>Total due today</span><span>$300.00</span></div>
      </div>

      <div className="form-group">
        <label className="form-label">Cardholder Name</label>
        <input
          className="form-input"
          placeholder="Name as on card"
          value={nameOnCard}
          onChange={e => setNameOnCard(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Card Number</label>
        <div className="form-input" style={{ padding: "15px 16px" }}>
          <CardNumberElement options={CARD_STYLE} />
        </div>
      </div>

      <div className="card-field-row">
        <div className="form-group">
          <label className="form-label">Expiry</label>
          <div className="form-input" style={{ padding: "15px 16px" }}>
            <CardExpiryElement options={CARD_STYLE} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">CVC</label>
          <div className="form-input" style={{ padding: "15px 16px" }}>
            <CardCvcElement options={CARD_STYLE} />
          </div>
        </div>
      </div>

      <div className="payment-secure-note">
        <span style={{ color: "var(--green)" }}>●</span>
        <span>256-bit SSL encryption · Secured by Stripe</span>
      </div>

      <button
        className="btn-primary-full"
        onClick={handleSubmit}
        disabled={processing || !stripe || !nameOnCard}
        style={{ marginTop: 16 }}
      >
        {processing ? "Processing securely..." : "Activate Membership — $300"}
      </button>

      <div className="stripe-badge">Powered by Stripe · PCI DSS Compliant</div>
    </div>
  );
}

// ── EXPORTED WRAPPER ────────────────────────────────────────
export default function StripePayment({ onSuccess, onError, memberName, email }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        onSuccess={onSuccess}
        onError={onError}
        memberName={memberName}
        email={email}
      />
    </Elements>
  );
}


// ============================================================
// BACKEND ROUTE TO ADD TO server/index.ts
// ============================================================

/*
// Add this route to your Express server:

app.post("/api/payments/create-membership-intent", async (req, res) => {
  const { email, name } = req.body;

  try {
    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer;

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({ email, name });
    }

    // Create payment intent for $300 membership
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 30000, // $300.00 in cents
      currency: "usd",
      customer: customer.id,
      metadata: {
        product: "monarc_prive_annual_membership",
        email,
        name,
      },
      description: "Monarc Privé Annual Membership",
      statement_descriptor: "MONARC PRIVE",
      receipt_email: email,
    });

    // Create membership record in Supabase
    await supabase.from("memberships").insert({
      email,
      name,
      stripe_customer_id: customer.id,
      stripe_payment_intent_id: paymentIntent.id,
      tier: "curated",
      status: "pending", // Update to "active" when payment_intent.succeeded fires
      amount_paid: 300,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/
