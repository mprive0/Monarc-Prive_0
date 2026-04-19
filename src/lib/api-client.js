const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function req(method, path, body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// ── AGENTS ───────────────────────────────────────────────────
export const chatWithAgent = (agentId, messages, userId) =>
  req("POST", `/api/agents/${agentId}/chat`, { messages, userId });

export const generateWeeklyReport = (agentId, email, userId) =>
  req("POST", `/api/agents/${agentId}/weekly-report`, { email, userId });

export const getReports = (userId) =>
  req("GET", `/api/reports/${userId}`);

// ── CONCIERGE ────────────────────────────────────────────────
export const chatWithConcierge = (messages, guestName, bookingId) =>
  req("POST", `/api/concierge/chat`, { messages, guestName, bookingId });

// ── PAYMENTS ─────────────────────────────────────────────────
export const createMembershipIntent = (email, name, tier) =>
  req("POST", `/api/payments/create-membership-intent`, { email, name, tier });

export const createBookingIntent = (bookingId, amount, bookingReference, paymentType) =>
  req("POST", `/api/payments/create-booking-intent`, { bookingId, amount, bookingReference, paymentType });

// ── SUBSCRIPTIONS ─────────────────────────────────────────────
export const createSubscription = (email, name, type, priceId) =>
  req("POST", `/api/subscriptions/create`, { email, name, type, priceId });

export const cancelSubscription = (subscriptionId) =>
  req("POST", `/api/subscriptions/cancel`, { subscriptionId });

// ── BOOKINGS ─────────────────────────────────────────────────
export const approveBooking = (bookingId, adminId) =>
  req("POST", `/api/bookings/${bookingId}/approve`, { adminId });

export const declineBooking = (bookingId, reason, adminId) =>
  req("POST", `/api/bookings/${bookingId}/decline`, { reason, adminId });

// ── ADMIN ─────────────────────────────────────────────────────
export const approveListing = (type, listingId) =>
  req("POST", `/api/admin/listings/approve`, { type, listingId });

export const rejectListing = (type, listingId, reason) =>
  req("POST", `/api/admin/listings/reject`, { type, listingId, reason });

export const getAdminStats = () =>
  req("GET", `/api/admin/stats`);

// ── NOTIFICATIONS ─────────────────────────────────────────────
export const sendTestEmail = (to, type) =>
  req("POST", `/api/notifications/test`, { to, type });

// ── UPLOAD ────────────────────────────────────────────────────
export const uploadFile = async (file, bucket, path) => {
  const { supabase } = await import("./supabase");
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  return { data, error };
};

export const getPublicUrl = async (bucket, path) => {
  const { supabase } = await import("./supabase");
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
