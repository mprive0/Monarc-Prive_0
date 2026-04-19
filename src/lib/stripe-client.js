import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ── MEMBERSHIP PAYMENT ────────────────────────────────────────
export const createMembershipPayment = async ({ email, name, tier = "curated" }) => {
  const res = await fetch(`${API_URL}/api/payments/create-membership-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, tier }),
  });
  return res.json();
};

// ── BOOKING PAYMENT ───────────────────────────────────────────
export const createBookingPayment = async ({ bookingId, amount, bookingReference, paymentType }) => {
  const res = await fetch(`${API_URL}/api/payments/create-booking-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId, amount, bookingReference, paymentType }),
  });
  return res.json();
};

// ── SUBSCRIPTION (host / agent / experience) ──────────────────
export const createPartnerSubscription = async ({ email, name, type, priceId }) => {
  const res = await fetch(`${API_URL}/api/subscriptions/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, type, priceId }),
  });
  return res.json();
};

// ── CANCEL SUBSCRIPTION ───────────────────────────────────────
export const cancelSubscription = async ({ subscriptionId }) => {
  const res = await fetch(`${API_URL}/api/subscriptions/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscriptionId }),
  });
  return res.json();
};

// ── STRIPE PRICE IDs (set in Stripe Dashboard, add to .env) ──
export const STRIPE_PRICES = {
  membership_curated:  import.meta.env.VITE_STRIPE_PRICE_MEMBERSHIP_CURATED,   // $300/yr
  membership_private:  import.meta.env.VITE_STRIPE_PRICE_MEMBERSHIP_PRIVATE,   // $750/yr
  host_listing:        import.meta.env.VITE_STRIPE_PRICE_HOST_LISTING,         // $25/mo
  agent_listing:       import.meta.env.VITE_STRIPE_PRICE_AGENT_LISTING,        // $50/mo
  experience_listing:  import.meta.env.VITE_STRIPE_PRICE_EXPERIENCE_LISTING,   // $100/mo
};
