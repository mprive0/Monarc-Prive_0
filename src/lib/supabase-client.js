import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ── AUTH HELPERS ─────────────────────────────────────────────

export const signUp = async ({ email, password, firstName, lastName, phone, answers }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        phone,
        questionnaire_answers: answers,
        role: "guest",
      },
    },
  });
  return { data, error };
};

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/portal` },
  });
  return { data, error };
};

export const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: { redirectTo: `${window.location.origin}/portal` },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};

// ── DATABASE HELPERS ─────────────────────────────────────────

export const getActiveMembership = async (userId) => {
  const { data, error } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();
  return { data, error };
};

export const getProperties = async (filters = {}) => {
  let query = supabase
    .from("properties")
    .select("*, property_media(*), property_amenities(*)")
    .eq("status", "active");

  if (filters.area) query = query.eq("area", filters.area);
  if (filters.eventReady) query = query.eq("event_friendly", true);
  if (filters.petFriendly) query = query.eq("pet_friendly", true);
  if (filters.minPrice) query = query.gte("nightly_rate", filters.minPrice);
  if (filters.maxPrice) query = query.lte("nightly_rate", filters.maxPrice);

  const { data, error } = await query.order("featured_order", { ascending: true });
  return { data, error };
};

export const getBookings = async (userId) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, properties(*), concierge_requests(*)")
    .eq("guest_id", userId)
    .order("created_at", { ascending: false });
  return { data, error };
};

export const createBookingRequest = async (booking) => {
  const { data, error } = await supabase
    .from("bookings")
    .insert(booking)
    .select()
    .single();
  return { data, error };
};

export const getMessages = async (userId) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*, bookings(properties(name))")
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  return { data, error };
};

export const sendMessage = async (message) => {
  const { data, error } = await supabase
    .from("messages")
    .insert(message)
    .select()
    .single();
  return { data, error };
};

export const getAgentListings = async () => {
  const { data, error } = await supabase
    .from("agent_listings")
    .select("*")
    .eq("status", "active")
    .order("featured", { ascending: false });
  return { data, error };
};

export const getExperienceListings = async (category = null) => {
  let query = supabase
    .from("experience_listings")
    .select("*")
    .eq("status", "active");
  if (category) query = query.eq("category", category);
  const { data, error } = await query.order("featured", { ascending: false });
  return { data, error };
};

export const getHostListings = async (hostEmail) => {
  const { data, error } = await supabase
    .from("host_listings")
    .select("*, bookings(count)")
    .eq("host_email", hostEmail);
  return { data, error };
};

export const saveFavorite = async (userId, propertyId) => {
  const { data, error } = await supabase
    .from("saved_properties")
    .upsert({ user_id: userId, property_id: propertyId });
  return { data, error };
};

export const removeFavorite = async (userId, propertyId) => {
  const { error } = await supabase
    .from("saved_properties")
    .delete()
    .eq("user_id", userId)
    .eq("property_id", propertyId);
  return { error };
};

export const getFavorites = async (userId) => {
  const { data, error } = await supabase
    .from("saved_properties")
    .select("property_id, properties(*)")
    .eq("user_id", userId);
  return { data, error };
};
