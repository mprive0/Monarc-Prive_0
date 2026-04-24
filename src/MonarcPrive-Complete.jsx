import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ──────────────────────────────────────────
const SUPA_URL = "https://vgmxzkedexjxdtjtbbok.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbXh6a2VkZXhqeGR0anRiYm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjQ1NjUsImV4cCI6MjA5MjIwMDU2NX0.zbCmIPOvIzFRFYTdVsjp1UTFEDl6x1CwqxfaizmwSkw";
const supabase = createClient(SUPA_URL, SUPA_KEY);

const db = async (fn) => {
  try { return await fn(supabase); }
  catch (e) { console.error("DB error:", e.message); return null; }
};

const PROPERTIES = [
  { id: 1, name: "Casa del Cielo", area: "Paradise Valley", price: 2800, beds: 6, baths: 7, guests: 14, badge: "Curated Pick", tags: ["Pool", "Spa", "Golf View", "Event-Ready"], img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&q=85" },
  { id: 2, name: "The Ironwood Estate", area: "North Scottsdale", price: 4200, beds: 8, baths: 9, guests: 20, badge: "Event-Ready", tags: ["Theater", "Chef Kitchen", "7 Acres", "Gated"], img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=85" },
  { id: 3, name: "Hacienda Serena", area: "Scottsdale", price: 1650, beds: 4, baths: 4.5, guests: 8, badge: "Guest Favorite", tags: ["Spa", "Mountain View", "Pet-Friendly", "Sauna"], img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=85" },
  { id: 4, name: "Monolith Modern", area: "Paradise Valley", price: 3500, beds: 5, baths: 6, guests: 10, badge: "New Arrival", tags: ["Infinity Pool", "Golf Access", "Architecture"], img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=85" },
  { id: 5, name: "The Camelback Retreat", area: "Paradise Valley", price: 5800, beds: 9, baths: 10, guests: 22, badge: "Elite", tags: ["2 Pools", "Spa Pavilion", "Screening Room", "Event-Ready"], img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&q=85" },
  { id: 6, name: "Desert Glass House", area: "North Scottsdale", price: 2100, beds: 4, baths: 5, guests: 8, badge: "Guest Favorite", tags: ["Glass Pavilion", "Mountain View", "Pet-Friendly"], img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=700&q=85" },
];

const RESTAURANTS = [
  { id: 1, name: "Nobu Scottsdale", cuisine: "Japanese \u00b7 Sushi \u00b7 New American", chef: "Nobu Matsuhisa", area: "Scottsdale Fashion Square", price: "$$$$", signature: "Black Cod Miso \u00b7 Wagyu Omakase", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=85", badge: "Member Favorite", desc: "The legendary Nobu experience. Omakase available for private dining rooms seating up to 20." },
  { id: 2, name: "Maple & Ash", cuisine: "Wood-Fired \u00b7 Steakhouse", chef: "Danny Grant", area: "Old Town Scottsdale", price: "$$$$", signature: "Wagyu Tomahawk \u00b7 Wood-Fired Everything", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=85", badge: "Top Rated", desc: "Chicago's most celebrated steakhouse now in Scottsdale. Wood-fired, theatrical, unforgettable." },
  { id: 3, name: "Bourbon Steak", cuisine: "American Steakhouse", chef: "Michael Mina", area: "JW Marriott Desert Ridge", price: "$$$$", signature: "Butter-Poached Lobster \u00b7 Wagyu Strip", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=85", badge: "Chef's Table", desc: "Michael Mina's flagship steakhouse. Butter-poached everything. Private dining available." },
  { id: 4, name: "FnB", cuisine: "Modern American \u00b7 Farm-to-Table", chef: "Charleen Badman", area: "Old Town Scottsdale", price: "$$$", signature: "Seasonal Vegetable Feast \u00b7 Arizona Wine List", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=85", badge: "James Beard Award", desc: "James Beard nominated. Farm-to-table excellence with the best Arizona wine list in the state." },
  { id: 5, name: "Virt\u00f9 Honest Craft", cuisine: "Mediterranean \u00b7 Seafood", chef: "Gio Osso", area: "Old Town Scottsdale", price: "$$$", signature: "Whole Branzino \u00b7 Handmade Pasta", img: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=700&q=85", badge: "Critic's Pick", desc: "Intimate, honest, extraordinary. Mediterranean craft with Arizona soul. Reservations essential." },
  { id: 6, name: "The Global Ambassador", cuisine: "Multi-Concept \u00b7 Rooftop", chef: "James Beard Nominees", area: "Arcadia", price: "$$$$", signature: "Rooftop Bar \u00b7 Private Events", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=85", badge: "New & Notable", desc: "Scottsdale's most talked-about new hotel and restaurant complex. Multiple concepts, all exceptional." },
];

const LUXURY_CARS = [
  { id: 1, name: "Ferrari Roma Spider", category: "Exotic Sports", company: "Arizona Exotics", price: 2800, img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=700&q=85", badge: "Most Requested", desc: "Open-top Italian perfection. 612hp. The drive Scottsdale deserves.", included: ["Insurance", "Estate Delivery", "Concierge Support"] },
  { id: 2, name: "Rolls-Royce Cullinan", category: "Ultra-Luxury SUV", company: "Scottsdale Luxury Fleet", price: 3200, img: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=700&q=85", imgPos: "bottom", badge: "Member Favorite", desc: "The world's most capable luxury SUV. Starlight headliner. Champagne fridge. Effortless.", included: ["Chauffeur Available", "Insurance", "Airport Pickup"] },
  { id: 3, name: "Lamborghini Urus", category: "Super SUV", company: "Arizona Exotics", price: 2400, img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=700&q=85", badge: "Top Pick", desc: "640hp super SUV. Four seats. Fits golf clubs. Turns every road into an event.", included: ["Insurance", "Delivery", "24/7 Support"] },
  { id: 4, name: "Bentley Continental GT", category: "Grand Tourer", company: "Scottsdale Luxury Fleet", price: 1800, img: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=700&q=85", badge: "Classic Choice", desc: "Hand-crafted British grand touring. 626hp. The perfect car for a desert sunset drive.", included: ["Insurance", "Estate Delivery", "Concierge"] },
];

const GOLF_VENUES = [
  { id: 1, name: "TPC Scottsdale", type: "Championship Course", area: "North Scottsdale", price: "$350\u2013750/round", img: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=700&q=85", badge: "PGA Tour Venue", desc: "Home of the Waste Management Phoenix Open. The Stadium Course. Bucket list round in Scottsdale." },
  { id: 2, name: "Troon North", type: "Desert Signature Course", area: "North Scottsdale", price: "$250\u2013500/round", img: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=700&q=85", badge: "Top 100 US", desc: "Two Tom Weiskopf masterpieces carved through the Sonoran Desert. Pinnacle and Monument courses." },
  { id: 3, name: "Desert Highlands", type: "Private Club", area: "North Scottsdale", price: "Member Access Only", img: "https://images.unsplash.com/photo-1592919505780-303950717480?w=700&q=85", badge: "Private Access", desc: "Jack Nicklaus Signature course. We arrange exclusive guest access for Monarc Priv\u00e9 members." },
  { id: 4, name: "We-Ko-Pa Golf Club", type: "Native American Course", area: "Scottsdale", price: "$175\u2013350/round", img: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=700&q=85", badge: "Scenic", desc: "Two courses carved through pristine desert. No homes. No roads. Pure golf." },
];

const MED_SPAS = [
  { id: 1, name: "REVIVE IV & Aesthetics", type: "IV Therapy \u00b7 Aesthetics", area: "Scottsdale", price: "From $195", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&q=85", badge: "In-Villa Available", desc: "In-villa IV therapy, vitamin infusions, NAD+, Myers Cocktail, Botox and fillers by board-certified providers." },
  { id: 2, name: "The Spa at Sanctuary", type: "Luxury Spa \u00b7 Forbes 5-Star", area: "Paradise Valley", price: "From $250", img: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=700&q=85", badge: "Forbes 5-Star", desc: "Forbes Five-Star awarded. Desert-inspired treatments. In-villa services available for Monarc Priv\u00e9 members." },
  { id: 3, name: "Modern Luxe Aesthetics", type: "Medical Aesthetics", area: "Old Town Scottsdale", price: "From $300", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=700&q=85", badge: "VIP Access", desc: "Board-certified physicians. Natural results. In-villa consultations available for Monarc Priv\u00e9 members." },
];

const AVIATION_DATA = [
  { id: 1, name: "Wheels Up Private", type: "Jet Card \u00b7 On-Demand Charter", area: "Scottsdale Airport (SDL)", price: "From $12,500/hr", img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&q=85", badge: "Most Popular", desc: "On-demand private aviation. Light to heavy jets. 24-hour booking. Based at Scottsdale Airport." },
  { id: 2, name: "NetJets Arizona", type: "Fractional Ownership \u00b7 Charter", area: "Scottsdale Airport (SDL)", price: "From $8,500/hr", img: "https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=700&q=85", badge: "Elite Fleet", desc: "The world's largest private aviation company. Any aircraft, any time, anywhere." },
  { id: 3, name: "Maverick Helicopters", type: "Helicopter Tours \u00b7 Transfers", area: "Scottsdale Airport", price: "From $1,800/flight", img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=700&q=85", badge: "Scenic Tours", desc: "Grand Canyon, Sedona, and city helicopter tours. Airport transfers and sunset experiences." },
];

const WINE_DATA = [
  { id: 1, name: "Scottsdale Cellar", type: "Rare Wine \u00b7 Private Tasting", area: "Old Town Scottsdale", price: "From $350/person", img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=85", badge: "Sommelier Led", desc: "Private in-villa wine tastings led by a Master Sommelier. Rare bottles curated to your preferences." },
  { id: 2, name: "Arizona Craft Spirits", type: "Private Distillery Tour", area: "Cave Creek", price: "From $280/person", img: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=700&q=85", badge: "Exclusive Access", desc: "Private after-hours distillery tours with barrel tasting and custom bottle blending." },
  { id: 3, name: "The Rare Bottle Club", type: "Rare Spirits Delivery", area: "All Scottsdale", price: "From $500/delivery", img: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=700&q=85", badge: "Estate Delivery", desc: "Rare and allocated whiskey, cognac, and wine delivered to your estate. Pappy Van Winkle available." },
];

const SHOPPING_DATA = [
  { id: 1, name: "Elan Personal Styling", type: "Personal Shopper \u00b7 Styling", area: "Scottsdale Fashion Square", price: "From $500/session", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=85", badge: "By Appointment", desc: "Private styling sessions at Scottsdale Fashion Square. Hermes, Chanel, Louis Vuitton. After-hours access." },
  { id: 2, name: "Desert Jewels Fine", type: "Custom Jewelry \u00b7 Estate Pieces", area: "Old Town Scottsdale", price: "From $1,000", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=85", badge: "Bespoke", desc: "Custom jewelry design and estate piece acquisition. In-villa consultations for significant purchases." },
  { id: 3, name: "Art Scottsdale Gallery", type: "Fine Art \u00b7 Acquisition", area: "Old Town Scottsdale", price: "Custom", img: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=700&q=85", badge: "Collector Access", desc: "Private after-hours gallery access. Artist introductions. Acquisition consulting for serious collectors." },
];

const EXPERIENCES_DATA = [
  { id: 1, name: "Desert Jeep Adventure", category: "Outdoor", host: "Sonoran Outfitters", price: 285, per: "person", duration: "4 hrs", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85", badge: "Top Rated", desc: "Private guided jeep tours through McDowell Mountains. Sundowner catering available." },
  { id: 2, name: "Horseback Sunrise Ride", category: "Equestrian", host: "Pinnacle Peak Stables", price: 420, per: "person", duration: "3 hrs", img: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=700&q=85", badge: "Member Favorite", desc: "Private sunrise ride through Sonoran Desert with champagne breakfast at the summit." },
  { id: 3, name: "Private Chef Tasting", category: "Private Dining", host: "Culinary Estates AZ", price: 950, per: "event", duration: "4-6 hrs", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=85", badge: "Michelin Chefs", desc: "Michelin-trained chefs create fully custom tasting menus in your private estate." },
  { id: 4, name: "Desert Wellness Day", category: "Wellness", host: "Sanctuary Wellness", price: 680, per: "person", duration: "Full Day", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&q=85", badge: "Signature", desc: "Sound bath, IV therapy, in-villa massage, and organic plant-based cuisine." },
  { id: 5, name: "Golf & Caddie VIP", category: "Golf", host: "PV Golf Concierge", price: 480, per: "person", duration: "18 holes", img: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=700&q=85", badge: "VIP Access", desc: "Preferred tee times at TPC Scottsdale with private caddie and post-round bourbon." },
  { id: 6, name: "Hot Air Balloon", category: "Aviation", host: "AZ Balloon Adventures", price: 450, per: "person", duration: "3 hrs", img: "https://images.unsplash.com/photo-1507608158173-1dcec673a2e5?w=700&q=85", badge: "Sunrise Only", desc: "Exclusive sunrise balloon flight over the Sonoran Desert with champagne landing toast." },
];

const REVIEWS = [
  { name: "Victoria Ashworth", title: "Private Equity Partner, New York", text: "Monarc Priv\u00e9 redefined what a private stay means. The AI concierge had our chef preferences and champagne waiting before we landed. Nothing else compares.", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80", prop: "Casa del Cielo" },
  { name: "James Holloway III", title: "Founder & CEO, Holloway Capital", text: "I've stayed at every ultra-luxury property in Scottsdale. Nothing touches the level of curation and discretion Monarc delivers. Worth every penny.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80", prop: "The Camelback Retreat" },
  { name: "Sophia Laurent", title: "Art Collector & Philanthropist", text: "We hosted our foundation gathering at The Ironwood Estate. Every single detail was handled with the taste I simply cannot find elsewhere.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80", prop: "The Ironwood Estate" },
  { name: "Marcus Chen", title: "Managing Director, Pacific Rim Ventures", text: "The Lamborghini was at the estate when we arrived. Dinner at Nobu was arranged for 12. Sterling handled everything flawlessly. This is the standard.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", prop: "Monolith Modern" },
];

const HERO_IMGS = [
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1400&q=90",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=90",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=90",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1400&q=90",
];

const QUESTIONS = [
  { q: "How do you primarily travel?", opts: ["Private aviation", "First class commercial", "Charter & yacht", "Flexible"] },
  { q: "Your typical group size?", opts: ["Just myself or partner", "Intimate group of 4-6", "Family or group of 8-12", "Large gatherings of 15+"] },
  { q: "What brings you to Scottsdale?", opts: ["Private retreat & wellness", "Golf & outdoor pursuits", "Corporate retreat", "Celebrations & events"] },
  { q: "Which luxury services matter most?", opts: ["Private chef & fine dining", "Spa, wellness & aesthetics", "Exotic cars & aviation", "Shopping, art & experiences"] },
];

const AGENTS = [
  { id: "aria", icon: "\u25c8", name: "Aria", role: "Sales & Revenue", sys: "You are Aria, Sales & Revenue AI Agent for Monarc Prive luxury platform in Scottsdale AZ. Sharp CRO level. Specific actionable revenue intelligence. All 12 partner categories. Concise." },
  { id: "celeste", icon: "\u25c9", name: "Celeste", role: "Marketing & Brand", sys: "You are Celeste, Brand & Marketing AI Agent for Monarc Prive. Luxury copy and strategy. Conde Nast meets performance marketer. Concise." },
  { id: "sterling", icon: "\u25cc", name: "Sterling", role: "Guest Concierge", sys: "You are Sterling, ultra-luxury AI concierge for Monarc Prive Scottsdale. Know every estate, restaurant, car rental, golf course, spa, aviation, wine, shopping service. Four Seasons level. Warm and effortlessly helpful. Concise." },
  { id: "atlas", icon: "\u25ce", name: "Atlas", role: "Operations", sys: "You are Atlas, Operations AI Agent for Monarc Prive. Monitor 6 estates plus all partner operations. COO level. Flag risks. Direct and precise." },
  { id: "orion", icon: "\u25cd", name: "Orion", role: "Analytics", sys: "You are Orion, Analytics AI Agent for Monarc Prive. Track all 12 revenue streams. Data into insight. Always answer: what does this mean and what should we do. Concise." },
];

const PARTNER_STREAMS = [
  { id: "property", icon: "\u25c8", label: "List Property", price: "$25/mo", desc: "List your luxury estate to our members" },
  { id: "agent", icon: "\u25c9", label: "Agent Advertising", price: "$50/mo", desc: "Advertise your real estate brand" },
  { id: "restaurant", icon: "\ud83c\udf7d", label: "Restaurant", price: "$75/mo", desc: "Promote your restaurant to UHNW members" },
  { id: "golf", icon: "\u26f3", label: "Golf & Clubs", price: "$125/mo", desc: "Promote tee times and club access" },
  { id: "cars", icon: "\ud83d\ude97", label: "Luxury Cars", price: "$150/mo", desc: "List exotic and luxury vehicle rentals" },
  { id: "medspa", icon: "\ud83d\udc86", label: "Med Spa & Beauty", price: "$75/mo", desc: "IV therapy, aesthetics and wellness" },
  { id: "aviation", icon: "\u2708", label: "Private Aviation", price: "$250/mo", desc: "Jet charters and air travel services" },
  { id: "yacht", icon: "\ud83d\udee5", label: "Yacht & Charters", price: "$200/mo", desc: "Watercraft and boat experiences" },
  { id: "shopping", icon: "\ud83d\udc8e", label: "Luxury Shopping", price: "$100/mo", desc: "Boutiques, jewelers and personal stylists" },
  { id: "wine", icon: "\ud83c\udf77", label: "Wine & Spirits", price: "$100/mo", desc: "Tastings, rare bottles and delivery" },
  { id: "events", icon: "\ud83c\udfaa", label: "Private Events", price: "$150/mo", desc: "Venues, entertainment and production" },
  { id: "experience", icon: "\u25cc", label: "Experiences", price: "$100/mo", desc: "Outdoor, wellness and unique activities" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --gold:#C9A96E;--gold-l:#E2C896;
  --ink:#161412;--ink-m:#1E1C19;--ink-s:#2A2825;
  --t1:#F8F5F0;--t2:rgba(248,245,240,.68);--t3:rgba(248,245,240,.38);
  --border:rgba(212,201,181,.11);--bh:rgba(201,169,110,.32);
  --green:#5BAF84;--red:#E05252;--amber:#E8A838;--taupe:#9E8E78;
  --serif:'Cormorant Garamond',Georgia,serif;--sans:'Jost',system-ui,sans-serif;
}
html,body{min-height:100%;font-family:var(--sans);background:var(--ink);color:var(--t1);-webkit-font-smoothing:antialiased;overflow-x:hidden}
.nav{position:sticky;top:0;z-index:200;height:56px;background:rgba(22,20,18,.96);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 36px;backdrop-filter:blur(20px)}
.nav-logo{font-family:var(--serif);font-size:1.1rem;font-weight:300;letter-spacing:.18em;text-transform:uppercase;color:var(--t1);cursor:pointer;margin-right:24px;flex-shrink:0}
.nav-logo span{color:var(--gold)}
.nav-links{display:flex;height:100%;flex:1;overflow-x:auto;scrollbar-width:none}
.nav-links::-webkit-scrollbar{display:none}
.nl{display:flex;align-items:center;padding:0 13px;font-size:.57rem;letter-spacing:.13em;text-transform:uppercase;font-weight:400;color:var(--t3);cursor:pointer;border-bottom:2px solid transparent;transition:all .18s;white-space:nowrap;flex-shrink:0}
.nl:hover{color:var(--t2)}
.nl.on{color:var(--gold);border-bottom-color:var(--gold)}
.nav-right{display:flex;gap:8px;flex-shrink:0;margin-left:auto}
.nb{background:none;border:1px solid var(--border);color:var(--t2);font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;font-family:var(--sans);padding:7px 13px;cursor:pointer;transition:all .18s;border-radius:2px;white-space:nowrap}
.nb:hover{border-color:var(--bh);color:var(--t1)}
.nb.cta{background:var(--gold);border-color:var(--gold);color:var(--ink);font-weight:600}
.nb.cta:hover{background:var(--gold-l)}
.hero{position:relative;height:90vh;min-height:520px;overflow:hidden}
.hi{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity 1.6s ease}
.hg{position:absolute;inset:0;background:linear-gradient(180deg,rgba(22,20,18,.18) 0%,rgba(22,20,18,.08) 30%,rgba(22,20,18,.6) 70%,rgba(22,20,18,.96) 100%);z-index:1}
.hc{position:absolute;bottom:0;left:0;right:0;padding:44px 56px;z-index:2}
.he{font-size:.52rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold);margin-bottom:12px;display:flex;align-items:center;gap:12px}
.he::before{content:'';width:22px;height:1px;background:var(--gold);flex-shrink:0}
.hh{font-family:var(--serif);font-size:clamp(2.6rem,5.5vw,4.8rem);font-weight:300;line-height:1.05;color:var(--t1);margin-bottom:22px}
.hh em{font-style:italic;color:var(--gold-l)}
.ha{display:flex;gap:12px;flex-wrap:wrap}
.hdots{position:absolute;bottom:28px;right:56px;display:flex;gap:6px;z-index:2}
.hd{width:18px;height:1px;background:rgba(248,245,240,.2);cursor:pointer;transition:all .25s}
.hd.on{background:var(--gold);width:34px}
.btn-g{background:var(--gold);color:var(--ink);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;font-weight:600;font-family:var(--sans);padding:15px 34px;border:none;cursor:pointer;transition:all .22s;border-radius:2px}
.btn-g:hover{background:var(--gold-l);transform:translateY(-2px);box-shadow:0 8px 28px rgba(201,169,110,.28)}
.btn-o{background:none;border:1px solid rgba(248,245,240,.28);color:var(--t1);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;font-weight:400;font-family:var(--sans);padding:14px 26px;cursor:pointer;transition:all .2s;border-radius:2px}
.btn-o:hover{border-color:var(--gold);color:var(--gold)}
.sec{padding:68px 56px}
.sec-d{background:var(--ink-m)}
.sh{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:24px}
.st{font-family:var(--serif);font-size:clamp(1.7rem,3vw,2.5rem);font-weight:300;color:var(--t1);letter-spacing:.02em}
.sl{font-size:.56rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);cursor:pointer;font-weight:500}
.sl:hover{color:var(--gold-l)}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.g2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.card{background:var(--ink-m);border:1px solid var(--border);border-radius:3px;overflow:hidden;cursor:pointer;transition:all .25s}
.card:hover{border-color:var(--bh);transform:translateY(-3px);box-shadow:0 14px 44px rgba(0,0,0,.38)}
.ciw{position:relative;padding-top:60%;overflow:hidden}
.ci{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .55s ease}
.card:hover .ci{transform:scale(1.05)}
.cbadge{position:absolute;top:11px;left:11px;background:rgba(22,20,18,.88);border:1px solid rgba(201,169,110,.28);font-size:.5rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);padding:4px 9px;border-radius:2px;font-weight:500}
.cfav{position:absolute;top:9px;right:11px;background:none;border:none;font-size:1.05rem;cursor:pointer;color:rgba(248,245,240,.85);filter:drop-shadow(0 1px 3px rgba(0,0,0,.4));transition:transform .18s}
.cfav:hover{transform:scale(1.15)}
.cfav.on{color:#E05252}
.cb{padding:14px 16px 16px}
.cn{font-family:var(--serif);font-size:1.05rem;font-weight:400;color:var(--t1);margin-bottom:2px}
.ca{font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;color:var(--taupe);margin-bottom:8px}
.ctags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px}
.ctag{font-size:.52rem;letter-spacing:.08em;color:var(--t3);border:1px solid rgba(212,201,181,.1);padding:2px 7px;border-radius:2px}
.cf{display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid rgba(212,201,181,.07)}
.cp{font-family:var(--serif);font-size:1rem;color:var(--t1)}
.cps{font-size:.56rem;color:var(--taupe);font-weight:300}
.cc{font-size:.54rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);background:none;border:none;cursor:pointer;font-family:var(--sans);font-weight:600}
.cc:hover{color:var(--gold-l)}
.cb-banner{background:var(--ink-s);border:1px solid var(--border);border-radius:3px;padding:32px;position:relative;overflow:hidden;cursor:pointer;display:grid;grid-template-columns:1fr auto;align-items:center;gap:24}
.cb-banner::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.revg{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.revc{background:var(--ink-m);border:1px solid var(--border);border-radius:3px;padding:20px;transition:border-color .18s}
.revc:hover{border-color:var(--bh)}
.revs{color:var(--gold);font-size:.72rem;margin-bottom:10px;letter-spacing:2px}
.revt{font-family:var(--serif);font-size:.9rem;font-weight:300;color:var(--t2);line-height:1.7;margin-bottom:14px;font-style:italic}
.revauth{display:flex;align-items:center;gap:9px}
.revav{width:34px;height:34px;border-radius:50%;object-fit:cover;border:1px solid rgba(201,169,110,.18);flex-shrink:0}
.revn{font-size:.72rem;font-weight:500;color:var(--t1)}
.revr{font-size:.58rem;color:var(--taupe);font-weight:300;margin-top:2px}
.revp{font-size:.54rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);opacity:.65;margin-top:9px}
.ph{position:relative;height:280px;overflow:hidden}
.phi{width:100%;height:100%;object-fit:cover}
.pho{position:absolute;inset:0;background:linear-gradient(180deg,rgba(22,20,18,.28),rgba(22,20,18,.9))}
.phc{position:absolute;bottom:0;left:0;right:0;padding:28px 56px}
.phe{font-size:.52rem;letter-spacing:.36em;text-transform:uppercase;color:var(--gold);margin-bottom:7px}
.pht{font-family:var(--serif);font-size:2.4rem;font-weight:300;color:var(--t1);line-height:1.1}
.pht em{font-style:italic;color:var(--gold-l)}
.ptabs{display:flex;border-bottom:1px solid var(--border);padding:0 56px;background:var(--ink-m);overflow-x:auto;scrollbar-width:none}
.ptabs::-webkit-scrollbar{display:none}
.ptab{padding:13px 16px;font-size:.56rem;letter-spacing:.13em;text-transform:uppercase;color:var(--t3);cursor:pointer;border-bottom:2px solid transparent;transition:all .18s;white-space:nowrap;flex-shrink:0}
.ptab:hover{color:var(--t2)}
.ptab.on{color:var(--gold);border-bottom-color:var(--gold)}
.psg{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
.psc{background:var(--ink-m);border:1px solid var(--border);border-radius:3px;padding:18px;cursor:pointer;transition:all .2s;text-align:center}
.psc:hover{border-color:var(--bh);transform:translateY(-2px)}
.pf-wrap{display:grid;grid-template-columns:1fr 1.1fr;gap:36px;align-items:start}
.pf-form{background:var(--ink-m);border:1px solid var(--border);border-radius:3px;padding:26px;position:relative;overflow:hidden}
.pf-form::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.fg{margin-bottom:13px}
.fl{font-size:.54rem;letter-spacing:.2em;text-transform:uppercase;color:var(--taupe);display:block;margin-bottom:6px;font-weight:500}
.fi{width:100%;background:rgba(248,245,240,.04);border:1px solid var(--border);border-radius:2px;padding:11px 13px;font-family:var(--sans);font-size:.8rem;color:var(--t1);font-weight:300;outline:none;transition:border-color .18s}
.fi:focus{border-color:var(--bh)}
.fi::placeholder{color:var(--t3)}
.fis{width:100%;background:rgba(248,245,240,.04);border:1px solid var(--border);border-radius:2px;padding:11px 13px;font-family:var(--sans);font-size:.8rem;color:var(--t1);font-weight:300;outline:none;-webkit-appearance:none;cursor:pointer;transition:border-color .18s}
.fis:focus{border-color:var(--bh)}
.fit{width:100%;background:rgba(248,245,240,.04);border:1px solid var(--border);border-radius:2px;padding:11px 13px;font-family:var(--sans);font-size:.8rem;color:var(--t1);font-weight:300;outline:none;resize:vertical;min-height:75px;line-height:1.6;transition:border-color .18s}
.fit:focus{border-color:var(--bh)}
.fit::placeholder{color:var(--t3)}
.r2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.btnf{width:100%;background:var(--gold);color:var(--ink);font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;font-weight:600;font-family:var(--sans);padding:14px;border:none;cursor:pointer;transition:background .18s;border-radius:2px;margin-top:6px}
.btnf:hover{background:var(--gold-l)}
.btng{width:100%;background:none;border:1px solid var(--border);color:var(--t2);font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;font-family:var(--sans);padding:12px;cursor:pointer;transition:all .18s;border-radius:2px;margin-top:8px}
.btng:hover{border-color:var(--bh);color:var(--t1)}
.mov{position:fixed;inset:0;z-index:500;background:rgba(16,14,12,.9);backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.mb{background:var(--ink-m);border:1px solid var(--border);border-radius:4px;width:100%;max-width:460px;max-height:92vh;overflow-y:auto;position:relative;animation:slideUp .28s cubic-bezier(.22,.68,0,1.2)}
@keyframes slideUp{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}
.mh{padding:22px 26px 17px;border-bottom:1px solid var(--border);position:relative}
.mc{position:absolute;top:13px;right:15px;background:none;border:none;color:var(--t3);cursor:pointer;font-size:.95rem;transition:color .15s;padding:4px}
.mc:hover{color:var(--t1)}
.me{font-size:.5rem;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);margin-bottom:5px}
.mt{font-family:var(--serif);font-size:1.55rem;font-weight:300;color:var(--t1)}
.ms{font-size:.68rem;color:var(--taupe);font-weight:300;margin-top:3px}
.mbd{padding:20px 26px 26px}
.ps{background:rgba(248,245,240,.03);border:1px solid rgba(201,169,110,.14);border-radius:2px;padding:13px;margin-bottom:15px}
.pr{display:flex;justify-content:space-between;font-size:.74rem;color:var(--t2);font-weight:300;padding:4px 0}
.pt{border-top:1px solid var(--border);margin-top:7px;padding-top:11px;font-family:var(--serif);font-size:.92rem;color:var(--t1)}
.qp{display:flex;gap:5px;margin-bottom:15px}
.qd{flex:1;height:2px;background:rgba(212,201,181,.12);border-radius:1px;transition:background .25s}
.qd.on{background:var(--gold)}
.qq{font-family:var(--serif);font-size:1.2rem;font-weight:300;color:var(--t1);line-height:1.3;margin-bottom:14px}
.qo{display:flex;flex-direction:column;gap:7px}
.qopt{background:rgba(248,245,240,.03);border:1px solid var(--border);border-radius:2px;padding:11px 13px;cursor:pointer;transition:all .18s;display:flex;align-items:center;justify-content:space-between}
.qopt:hover{border-color:rgba(201,169,110,.26);background:rgba(201,169,110,.04)}
.qopt.s{border-color:var(--gold);background:rgba(201,169,110,.08)}
.qot{font-size:.76rem;color:var(--t2);font-weight:300}
.qr{width:13px;height:13px;border:1px solid var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .18s}
.qopt.s .qr{background:var(--gold);border-color:var(--gold)}
.qrd{width:5px;height:5px;background:var(--ink);border-radius:50%;opacity:0;transition:opacity .14s}
.qopt.s .qrd{opacity:1}
.sw{text-align:center;margin-top:14px;font-size:.68rem;color:var(--taupe);font-weight:300}
.sw span{color:var(--gold);cursor:pointer}
.sc{text-align:center;padding:8px 0 4px}
.si{font-size:2.2rem;color:var(--gold);margin-bottom:13px;display:block;animation:pop .4s cubic-bezier(.22,.68,0,1.2)}
@keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}
.stit{font-family:var(--serif);font-size:1.6rem;font-weight:300;color:var(--t1);margin-bottom:8px}
.ssub{font-size:.72rem;color:var(--taupe);font-weight:300;line-height:1.7;margin-bottom:15px}
.sref{font-size:.54rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,169,110,.22);padding:7px 15px;display:inline-block;border-radius:2px;margin-bottom:18px}
.adm{display:grid;grid-template-columns:210px 1fr;height:calc(100vh - 56px);overflow:hidden}
.aside{background:var(--ink-m);border-right:1px solid var(--border);overflow-y:auto;display:flex;flex-direction:column}
.aside-logo{padding:18px 16px;border-bottom:1px solid var(--border)}
.aside-wm{font-family:var(--serif);font-size:1rem;font-weight:300;letter-spacing:.15em;text-transform:uppercase;color:var(--t1)}
.aside-wm span{color:var(--gold)}
.aside-sub{font-size:.48rem;letter-spacing:.24em;text-transform:uppercase;color:var(--t3);margin-top:3px}
.asec{padding:12px 0 0}
.albl{font-size:.48rem;letter-spacing:.24em;text-transform:uppercase;color:var(--t3);padding:0 14px 7px;font-weight:500}
.ait{display:flex;align-items:center;gap:8px;padding:9px 14px;cursor:pointer;transition:all .14s;border-left:2px solid transparent}
.ait:hover{background:rgba(212,201,181,.04)}
.ait.on{background:rgba(201,169,110,.07);border-left-color:var(--gold)}
.ait-i{font-size:.85rem;width:14px;text-align:center;flex-shrink:0}
.ait-t{font-size:.68rem;font-weight:400;color:var(--t2)}
.ait.on .ait-t{color:var(--gold-l)}
.abadge{margin-left:auto;background:var(--red);color:white;font-size:.46rem;font-weight:700;padding:2px 5px;border-radius:8px;min-width:16px;text-align:center}
.adm-main{overflow-y:auto;display:flex;flex-direction:column}
.adm-hdr{padding:14px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.adm-title{font-family:var(--serif);font-size:1.25rem;font-weight:300;color:var(--t1)}
.adm-body{padding:20px 22px;flex:1}
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}
.sc2{background:var(--ink-m);border:1px solid var(--border);border-radius:3px;padding:15px}
.slbl{font-size:.5rem;letter-spacing:.2em;text-transform:uppercase;color:var(--taupe);margin-bottom:6px;font-weight:500}
.sval{font-family:var(--serif);font-size:1.65rem;color:var(--t1);font-weight:300}
.schg{font-size:.58rem;margin-top:4px}
.schg.up{color:var(--green)}
.schg.am{color:var(--amber)}
.tbl{background:var(--ink-m);border:1px solid var(--border);border-radius:3px;overflow:hidden;margin-bottom:18px}
table{width:100%;border-collapse:collapse}
thead th{font-size:.48rem;letter-spacing:.18em;text-transform:uppercase;color:var(--taupe);padding:9px 13px;text-align:left;border-bottom:1px solid var(--border);background:var(--ink-s);font-weight:500}
tbody tr{border-bottom:1px solid rgba(212,201,181,.05);transition:background .14s}
tbody tr:last-child{border-bottom:none}
tbody tr:hover{background:rgba(212,201,181,.03)}
td{padding:10px 13px;font-size:.7rem;color:var(--t2);font-weight:300;vertical-align:middle}
.tdn{color:var(--t1);font-weight:400;font-size:.74rem}
.sp2{display:inline-block;font-size:.48rem;letter-spacing:.14em;text-transform:uppercase;font-weight:600;padding:3px 7px;border-radius:2px}
.sp-p{background:rgba(232,168,56,.1);border:1px solid rgba(232,168,56,.24);color:var(--amber)}
.sp-a{background:rgba(91,175,132,.1);border:1px solid rgba(91,175,132,.24);color:var(--green)}
.abr{display:flex;gap:5px}
.ab{background:none;border:1px solid var(--border);color:var(--t3);font-size:.47rem;letter-spacing:.11em;text-transform:uppercase;font-family:var(--sans);padding:4px 8px;cursor:pointer;transition:all .14s;border-radius:2px;font-weight:500}
.ab.app{border-color:rgba(91,175,132,.26);color:var(--green)}
.ab.app:hover{background:rgba(91,175,132,.08)}
.ab.rej{border-color:rgba(224,82,82,.2);color:var(--red)}
.ab.view{border-color:rgba(201,169,110,.2);color:var(--gold)}
.achips{display:grid;grid-template-columns:repeat(5,1fr);gap:9px;margin-bottom:16px}
.achip{background:var(--ink-m);border:1px solid var(--border);border-radius:2px;padding:13px;text-align:center;cursor:pointer;transition:all .18s}
.achip:hover{border-color:var(--bh);transform:translateY(-2px)}
.achip.on{border-color:var(--gold);background:rgba(201,169,110,.07)}
.aci{font-size:1.05rem;color:var(--gold);margin-bottom:6px;display:block}
.acn{font-family:var(--serif);font-size:.85rem;color:var(--t1);font-weight:400}
.acr{font-size:.52rem;color:var(--taupe);font-weight:300;margin-top:2px}
.acd{display:flex;align-items:center;justify-content:center;gap:3px;margin-top:6px;font-size:.5rem;letter-spacing:.1em;text-transform:uppercase;color:var(--green)}
.sdot{width:5px;height:5px;border-radius:50%;background:var(--green);display:inline-block;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.chat-panel{background:var(--ink-m);border:1px solid var(--border);border-radius:3px;overflow:hidden}
.chat-hdr{padding:11px 15px;background:var(--ink-s);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:9px}
.chat-msgs{padding:13px;min-height:180px;max-height:240px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;scrollbar-color:rgba(212,201,181,.1) transparent}
.cmsg{display:flex;gap:8px;align-items:flex-start}
.cmsg.u{flex-direction:row-reverse}
.cav{width:26px;height:26px;border-radius:50%;background:rgba(201,169,110,.12);border:1px solid rgba(212,201,181,.18);display:flex;align-items:center;justify-content:center;font-size:.7rem;color:var(--gold);flex-shrink:0}
.cbub{max-width:80%;padding:9px 12px;font-size:.7rem;line-height:1.65;font-weight:300;white-space:pre-wrap}
.cbub.a{background:#2A2825;border:1px solid rgba(212,201,181,.08);color:rgba(248,245,240,.85);border-radius:2px 10px 10px 2px}
.cbub.u{background:rgba(201,169,110,.12);border:1px solid rgba(201,169,110,.18);color:var(--t1);border-radius:10px 2px 2px 10px}
.typing{display:flex;gap:4px;padding:9px 12px;background:#2A2825;border:1px solid rgba(212,201,181,.08);border-radius:2px 10px 10px 2px;width:fit-content}
.td2{width:5px;height:5px;background:var(--taupe);border-radius:50%;animation:bounce 1.2s infinite}
.td2:nth-child(2){animation-delay:.2s}
.td2:nth-child(3){animation-delay:.4s}
@keyframes bounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-4px);opacity:1}}
.cia{padding:9px 12px 11px;border-top:1px solid var(--border);display:flex;gap:7px}
.ci2{flex:1;background:rgba(248,245,240,.04);border:1px solid var(--border);border-radius:2px;padding:9px 11px;font-family:var(--sans);font-size:.72rem;color:var(--t1);outline:none;font-weight:300}
.ci2:focus{border-color:var(--bh)}
.ci2::placeholder{color:var(--t3)}
.csend{width:32px;height:32px;background:var(--gold);border:none;border-radius:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--ink);font-size:.82rem;font-weight:700;transition:background .18s;flex-shrink:0}
.csend:hover{background:var(--gold-l)}
.csend:disabled{opacity:.4;cursor:not-allowed}
.qkb{padding:4px 12px 9px;display:flex;gap:5px;flex-wrap:wrap}
.qk{font-size:.52rem;letter-spacing:.08em;color:var(--taupe);border:1px solid var(--border);padding:4px 8px;border-radius:2px;cursor:pointer;background:none;font-family:var(--sans);transition:color .14s}
.qk:hover{color:var(--gold);border-color:rgba(201,169,110,.26)}
.ft{background:var(--ink);border-top:1px solid var(--border);padding:44px 56px 28px}
.ftg{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;gap:24px;margin-bottom:32px}
.ftb{font-family:var(--serif);font-size:1.2rem;font-weight:300;letter-spacing:.14em;text-transform:uppercase;color:var(--t1);margin-bottom:10px}
.ftb span{color:var(--gold)}
.fttag{font-size:.7rem;color:var(--taupe);font-weight:300;line-height:1.7}
.ftct{font-size:.54rem;letter-spacing:.26em;text-transform:uppercase;color:var(--taupe);margin-bottom:12px;font-weight:500}
.ftl{display:block;font-size:.7rem;color:rgba(248,245,240,.42);font-weight:300;margin-bottom:7px;cursor:pointer;transition:color .18s}
.ftl:hover{color:var(--gold)}
.ftbot{display:flex;justify-content:space-between;align-items:center;padding-top:18px;border-top:1px solid rgba(212,201,181,.07);flex-wrap:wrap;gap:10px}
.ftcopy{font-size:.56rem;letter-spacing:.1em;color:var(--taupe)}
.ftleg{display:flex;gap:14px;flex-wrap:wrap}
.ftll{font-size:.56rem;letter-spacing:.08em;color:var(--taupe);cursor:pointer;transition:color .14s}
.ftll:hover{color:var(--t2)}
@media(max-width:1100px){.g3,.revg{grid-template-columns:repeat(2,1fr)}.g4,.psg{grid-template-columns:repeat(3,1fr)}.ftg{grid-template-columns:1fr 1fr 1fr}}
@media(max-width:768px){.sec{padding:48px 22px}.phc{padding:22px}.ptabs{padding:0 22px}.ft{padding:36px 22px 24px}.ftg{grid-template-columns:1fr 1fr}.g3,.g4,.psg,.revg,.achips{grid-template-columns:repeat(2,1fr)}.pf-wrap{grid-template-columns:1fr}.adm{grid-template-columns:1fr;height:auto}.aside{display:none}.hc{padding:28px 22px}.hh{font-size:2.3rem}.nav{padding:0 16px}.sg{grid-template-columns:repeat(2,1fr)}.cb-banner{grid-template-columns:1fr}}
@media(max-width:500px){.g3,.g4,.psg,.revg,.achips{grid-template-columns:1fr}.ftg{grid-template-columns:1fr}.ftbot{flex-direction:column;text-align:center}.nb:not(.cta){display:none}}
`;

const QUICK = {
  aria: ["Weekly revenue report", "Top performing estate", "Reprice suggestions", "All 12 revenue streams"],
  celeste: ["Instagram caption for Casa del Cielo", "Restaurant partner recruitment email", "Content calendar", "Luxury brand campaign idea"],
  sterling: ["Best estate for 12 guests with event", "Recommend a restaurant tonight", "Book an exotic car for sunset drive", "Golf tee time this morning"],
  atlas: ["Property readiness check", "Vendor SLA status", "Booking risk flags", "Upcoming turnovers"],
  orion: ["All 12 revenue streams summary", "Conversion rate this month", "Partner category performance", "30-day forecast"],
};

export default function MonarcPrive() {
  const [page, setPage] = useState("home");
  const [pTab, setPTab] = useState("overview");
  const [aSection, setASection] = useState("overview");
  const [modal, setModal] = useState(null);
  const [mData, setMData] = useState({});
  const [heroIdx, setHeroIdx] = useState(0);
  const [favs, setFavs] = useState(new Set([0, 3]));
  const [qStep, setQStep] = useState(0);
  const [qAns, setQAns] = useState({});
  const [fv, setFv] = useState({});
  const [agent, setAgent] = useState("aria");
  const [chatH, setChatH] = useState({});
  const [cInp, setCInp] = useState("");
  const [cTyping, setCTyping] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminPwInput, setAdminPwInput] = useState("");
  const [adminPwError, setAdminPwError] = useState(false);
  const ADMIN_PASSWORD = "MP@Admin2025!";
  const [currentUser, setCurrentUser] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [memberBookings, setMemberBookings] = useState([]);
  const [memberLoading, setMemberLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [toast, setToast] = useState(null);
  const [pending, setPending] = useState([
    { id: 1, type: "property", name: "Villa Castellan", detail: "R. Mercer \u00b7 PV \u00b7 $3,200/nt", submitted: "2h ago" },
    { id: 2, type: "agent", name: "Theodore Walsh", detail: "Douglas Elliman \u00b7 $180M+", submitted: "4h ago" },
    { id: 3, type: "restaurant", name: "Saffron Kitchen", detail: "Mediterranean \u00b7 Old Town", submitted: "5h ago" },
    { id: 4, type: "cars", name: "PV Exotic Rentals", detail: "Ferrari \u00b7 Lamborghini Fleet", submitted: "6h ago" },
    { id: 5, type: "golf", name: "Silverado Golf Club", detail: "Championship \u00b7 N. Scottsdale", submitted: "7h ago" },
    { id: 6, type: "medspa", name: "Azure Wellness Studio", detail: "IV Therapy \u00b7 In-Villa", submitted: "8h ago" },
    { id: 7, type: "experience", name: "Sunrise Hot Air Balloon", detail: "AZ Balloon Co \u00b7 3hrs", submitted: "9h ago" },
  ]);
  const [bookings, setBookings] = useState([
    { ref: "MP-4A7B9C", prop: "The Ironwood Estate", guest: "Victoria Ashworth", total: "$16,800", status: "confirmed" },
    { ref: "MP-2D3E4F", prop: "Casa del Cielo", guest: "James Holloway", total: "$8,400", status: "pending" },
    { ref: "MP-8G9H1I", prop: "The Camelback Retreat", guest: "Sophia Laurent", total: "$17,400", status: "pending" },
    { ref: "MP-5J6K7L", prop: "Monolith Modern", guest: "Marcus Chen", total: "$10,500", status: "confirmed" },
  ]);
  const chatRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMGS.length), 5200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const init = {};
    AGENTS.forEach(a => {
      init[a.id] = [{ role: "assistant", content: `Good day. I am ${a.name}, your ${a.role} Agent for Monarc Prive.\n\nI monitor all 6 estates plus our complete partner network across 12 categories including restaurants, luxury cars, golf, spas, aviation, wine, shopping, and more.\n\nHow can I help you today?` }];
    });
    setChatH(init);
  }, []);

  useEffect(() => { chatRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatH, cTyping]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user || null);
      if (session?.user) loadMemberData(session.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
      if (session?.user) loadMemberData(session.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadMemberData = async (user) => {
    if (!supabase || !user) return;
    setMemberLoading(true);
    try {
      const [memRes, bookRes] = await Promise.all([
        supabase.from("memberships").select("*").eq("user_id", user.id).eq("status", "active").single(),
        supabase.from("bookings").select("*").eq("guest_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (memRes.data) setMemberData(memRes.data);
      if (bookRes.data) setMemberBookings(bookRes.data);
    } catch (e) { console.error("loadMemberData:", e); }
    setMemberLoading(false);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setCurrentUser(null);
    setMemberData(null);
    setMemberBookings([]);
    setPage("home");
    showToast("Signed out successfully");
  };

  const SIGNUP_FLOW = ["join", "questionnaire", "payment", "success"];
  const openModal = (type, data = {}) => {
    setModal(type);
    setMData(data);
    setQStep(0);
    if (!SIGNUP_FLOW.includes(type)) { setQAns({}); setFv({}); }
  };
  const closeModal = () => setModal(null);
  const field = k => e => setFv(p => ({ ...p, [k]: e.target.value }));
  const toggleFav = i => setFavs(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  const sendWelcomeEmail = async (email, firstName, tier = "curated") => {
    const API = import.meta.env.VITE_API_URL;
    if (!API) return;
    try {
      await fetch(`${API}/api/notifications/welcome`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name: firstName, tier }) });
    } catch (e) { console.log("Welcome email queued"); }
  };

  const approvePending = async (id, action = "approve") => {
    const item = pending.find(x => x.id === id);
    if (!item) return;
    const tableMap = { property: "host_listings", agent: "agent_listings", restaurant: "restaurant_listings", golf: "golf_listings", cars: "car_listings", medspa: "medspa_listings", aviation: "aviation_listings", yacht: "yacht_listings", shopping: "shopping_listings", wine: "wine_listings", events: "events_listings", experience: "experience_listings" };
    const table = tableMap[item.type];
    if (table && item.dbId) await db(sb => sb.from(table).update({ status: action === "approve" ? "active" : "rejected", reviewed_at: new Date().toISOString() }).eq("id", item.dbId));
    setPending(p => p.filter(x => x.id !== id));
    showToast(action === "approve" ? `\u2713 ${item.name} approved and now live` : `${item.name} rejected`, action === "approve" ? "success" : "error");
  };

  const approveBooking = async (ref) => {
    setBookings(p => p.map(b => b.ref === ref ? { ...b, status: "confirmed" } : b));
    await db(sb => sb.from("bookings").update({ status: "confirmed", reviewed_at: new Date().toISOString() }).eq("reference", ref));
    showToast(`Booking ${ref} confirmed`);
  };

  const loadAdminPending = async () => {
    if (!supabase) return;
    const tables = [
      { key: "property", table: "host_listings", nameField: "property_title", detailField: "host_email" },
      { key: "agent", table: "agent_listings", nameField: "agent_name", detailField: "agency" },
      { key: "restaurant", table: "restaurant_listings", nameField: "restaurant_name", detailField: "cuisine_type" },
      { key: "golf", table: "golf_listings", nameField: "club_name", detailField: "area" },
      { key: "cars", table: "car_listings", nameField: "business_name", detailField: "fleet_description" },
      { key: "medspa", table: "medspa_listings", nameField: "business_name", detailField: "services_offered" },
      { key: "aviation", table: "aviation_listings", nameField: "company_name", detailField: "service_type" },
      { key: "yacht", table: "yacht_listings", nameField: "business_name", detailField: "area" },
      { key: "shopping", table: "shopping_listings", nameField: "business_name", detailField: "business_type" },
      { key: "wine", table: "wine_listings", nameField: "business_name", detailField: "business_type" },
      { key: "events", table: "events_listings", nameField: "business_name", detailField: "area" },
      { key: "experience", table: "experience_listings", nameField: "experience_name", detailField: "category" },
    ];
    const all = [];
    for (const { key, table, nameField, detailField } of tables) {
      const { data } = await supabase.from(table).select("id," + nameField + "," + detailField + ",created_at").eq("status", "pending").limit(20);
      if (data) data.forEach(row => all.push({ id: Math.random(), dbId: row.id, type: key, name: row[nameField] || "Untitled", detail: row[detailField] || "", submitted: new Date(row.created_at).toLocaleDateString() }));
    }
    if (all.length > 0) setPending(all);
  };

  const curAgent = AGENTS.find(a => a.id === agent);

  const sendChat = async text => {
    if (!text.trim() || cTyping) return;
    setCInp("");
    const uMsg = { role: "user", content: text.trim() };
    setChatH(p => ({ ...p, [agent]: [...(p[agent] || []), uMsg] }));
    setCTyping(true);
    try {
      const msgs = [...(chatH[agent] || []), uMsg].map(m => ({ role: m.role, content: m.content }));
      const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, system: curAgent?.sys || "", messages: msgs }) });
      const d = await r.json();
      const reply = d.content?.find(b => b.type === "text")?.text || "Let me look into that for you.";
      setChatH(p => ({ ...p, [agent]: [...(p[agent] || []), { role: "assistant", content: reply }] }));
    } catch {
      setChatH(p => ({ ...p, [agent]: [...(p[agent] || []), { role: "assistant", content: "Brief connectivity issue. Please add your Anthropic API key in Vercel Settings > Environment Variables as VITE_ANTHROPIC_API_KEY." }] }));
    }
    setCTyping(false);
  };

  const NavItems = [
    { id: "home", label: "Estates" }, { id: "restaurants", label: "Dining" },
    { id: "cars", label: "Luxury Cars" }, { id: "golf", label: "Golf" },
    { id: "experiences", label: "Experiences" }, { id: "medspa", label: "Spa & Wellness" },
    { id: "aviation", label: "Aviation" }, { id: "wine", label: "Wine & Spirits" },
    { id: "shopping", label: "Shopping" }, { id: "membership", label: "Membership" },
  ];

  const PropCard = ({ p, idx }) => (
    <div className="card">
      <div className="ciw">
        <img className="ci" src={p.img} alt={p.name} loading="lazy" />
        <span className="cbadge">{p.badge}</span>
        <button className={`cfav${favs.has(idx) ? " on" : ""}`} onClick={() => toggleFav(idx)}>\u2665</button>
      </div>
      <div className="cb">
        <div className="cn">{p.name}</div>
        <div className="ca">{p.area}</div>
        <div className="ctags">{p.tags.slice(0, 3).map(t => <span key={t} className="ctag">{t}</span>)}</div>
        <div className="cf">
          <div><span className="cp">${p.price.toLocaleString()}</span><div className="cps">{p.beds}bd \u00b7 {p.baths}ba \u00b7 Sleeps {p.guests}</div></div>
          <button className="cc" onClick={() => currentUser ? openModal("book", p) : openModal("join")}>Request \u2192</button>
        </div>
      </div>
    </div>
  );

  const RestCard = ({ r }) => {
    const handleClick = () => currentUser ? openModal("concierge", { name: r.name, type: "Dining Reservation", price: r.price }) : openModal("join");
    return (
      <div className="card" onClick={handleClick}>
        <div className="ciw" style={{ paddingTop: "52%" }}>
          <img className="ci" src={r.img} alt={r.name} loading="lazy" />
          <span className="cbadge">{r.badge}</span>
          <span style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(22,20,18,.85)", fontSize: ".58rem", color: "var(--gold-l)", padding: "4px 9px", borderRadius: 2, fontFamily: "var(--serif)" }}>{r.price}</span>
        </div>
        <div className="cb">
          <div className="cn">{r.name}</div>
          <div style={{ fontSize: ".6rem", letterSpacing: ".1em", color: "var(--taupe)", marginBottom: 4 }}>{r.cuisine}</div>
          {r.chef && <div style={{ fontSize: ".64rem", color: "var(--gold-l)", fontWeight: 300, marginBottom: 6 }}>Chef: {r.chef}</div>}
          <div style={{ fontSize: ".7rem", color: "var(--t3)", fontWeight: 300, lineHeight: 1.6, marginBottom: 8 }}>{r.desc}</div>
          <div style={{ fontSize: ".62rem", color: "var(--t2)", fontStyle: "italic", marginBottom: 10 }}>\u2726 {r.signature}</div>
          <div className="cf">
            <span style={{ fontSize: ".6rem", color: "var(--taupe)", fontWeight: 300 }}>{r.area}</span>
            <button className="cc" onClick={() => currentUser ? openModal("concierge", { name: r.name, type: "Dining Reservation", price: r.price }) : openModal("join")}>Reserve \u2192</button>
          </div>
        </div>
      </div>
    );
  };

  const CarCard = ({ c }) => {
    const handleClick = () => currentUser ? openModal("concierge", { name: c.name, type: "Luxury Car Rental", price: `$${c.price.toLocaleString()}/day` }) : openModal("join");
    return (
      <div className="card" onClick={handleClick}>
        <div className="ciw">
          <img className="ci" src={c.img} alt={c.name} loading="lazy" style={{ objectPosition: c.imgPos || "center" }} />
          <span className="cbadge">{c.badge}</span>
        </div>
        <div className="cb">
          <div className="cn">{c.name}</div>
          <div style={{ fontSize: ".58rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--taupe)", marginBottom: 4 }}>{c.category}</div>
          <div style={{ fontSize: ".64rem", color: "var(--gold-l)", fontWeight: 300, marginBottom: 6 }}>{c.company}</div>
          <div style={{ fontSize: ".7rem", color: "var(--t3)", fontWeight: 300, lineHeight: 1.6, marginBottom: 8 }}>{c.desc}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {c.included.map(i => <span key={i} style={{ fontSize: ".52rem", letterSpacing: ".08em", color: "var(--green)", border: "1px solid rgba(91,175,132,.2)", padding: "2px 7px", borderRadius: 2 }}>\u2713 {i}</span>)}
          </div>
          <div className="cf">
            <div><span className="cp">${c.price.toLocaleString()}</span><div className="cps">per day</div></div>
            <button className="cc" onClick={() => currentUser ? openModal("concierge", { name: c.name, type: "Luxury Car Rental", price: `$${c.price.toLocaleString()}/day` }) : openModal("join")}>Reserve \u2192</button>
          </div>
        </div>
      </div>
    );
  };

  // ── THE FIX: LuxCard uses a shared handleClick so the card div AND button both respect currentUser ──
  const LuxCard = ({ item, onClick }) => {
    const handleClick = () => {
      if (currentUser) {
        openModal("concierge", { name: item.name, type: item.type || item.category, price: item.price });
      } else {
        openModal("join");
      }
    };
    return (
      <div className="card" onClick={onClick || handleClick}>
        <div className="ciw">
          <img className="ci" src={item.img} alt={item.name} loading="lazy" />
          <span className="cbadge">{item.badge}</span>
        </div>
        <div className="cb">
          <div className="cn">{item.name}</div>
          <div style={{ fontSize: ".58rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--taupe)", marginBottom: 5 }}>{item.type || item.category}</div>
          <div style={{ fontSize: ".7rem", color: "var(--t3)", fontWeight: 300, lineHeight: 1.6, marginBottom: 8 }}>{item.desc}</div>
          <div className="cf">
            <div><div className="cp" style={{ fontSize: ".95rem" }}>{item.price || item.green_fee}</div><div className="cps">{item.area || ""}</div></div>
            <button className="cc" onClick={e => { e.stopPropagation(); handleClick(); }}>Book \u2192</button>
          </div>
        </div>
      </div>
    );
  };

  const ExpCard = ({ e }) => {
    const handleClick = () => currentUser ? openModal("concierge", { name: e.name, type: e.category, price: `$${e.price.toLocaleString()} per ${e.per}` }) : openModal("join");
    return (
      <div className="card" onClick={handleClick}>
        <div className="ciw">
          <img className="ci" src={e.img} alt={e.name} loading="lazy" />
          <span className="cbadge">{e.badge}</span>
          <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(22,20,18,.8)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--t2)", padding: "3px 7px", borderRadius: 2 }}>{e.category}</span>
        </div>
        <div className="cb">
          <div className="cn">{e.name}</div>
          <div style={{ fontSize: ".62rem", color: "var(--gold-l)", fontWeight: 300, marginBottom: 6 }}>by {e.host}</div>
          <div style={{ fontSize: ".7rem", color: "var(--t3)", fontWeight: 300, lineHeight: 1.6, marginBottom: 10 }}>{e.desc}</div>
          <div className="cf">
            <div><div className="cp">${e.price.toLocaleString()}</div><div className="cps">per {e.per} \u00b7 {e.duration}</div></div>
            <button className="cc" onClick={() => currentUser ? openModal("concierge", { name: e.name, type: e.category, price: `$${e.price.toLocaleString()} per ${e.per}` }) : openModal("join")}>Book \u2192</button>
          </div>
        </div>
      </div>
    );
  };

  const PartnerCTA = ({ msg, btn, stream }) => (
    <div style={{ marginTop: 32, background: "var(--ink-m)", border: "1px solid var(--border)", borderRadius: 3, padding: 26, textAlign: "center" }}>
      <div style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", color: "var(--t1)", marginBottom: 8 }}>{msg}</div>
      <div style={{ fontSize: ".76rem", color: "var(--t3)", fontWeight: 300, marginBottom: 18 }}>Reach Monarc Prive members spending $2,000-$6,000/night on estates who are actively looking for exactly what you offer.</div>
      <button className="btn-g" onClick={() => { setPage("partners"); setPTab(stream); }}>{btn}</button>
    </div>
  );

  const Footer = () => (
    <footer className="ft">
      <div className="ftg">
        <div>
          <div className="ftb">Monarc<span>\u00b7</span>Prive</div>
          <p className="fttag">An exclusive membership platform for Scottsdale's most discerning travelers. Private estates, luxury dining, exotic cars, world-class golf, private aviation, AI concierge 24/7.</p>
        </div>
        <div>
          <div className="ftct">For Members</div>
          <span className="ftl" onClick={() => openModal("join")}>Apply</span>
          <span className="ftl" onClick={() => openModal("login")}>Member Login</span>
          <span className="ftl" onClick={() => setPage("membership")}>Membership Tiers</span>
          <span className="ftl" onClick={() => setPage("experiences")}>Concierge Services</span>
        </div>
        <div>
          <div className="ftct">Explore</div>
          <span className="ftl" onClick={() => setPage("restaurants")}>Fine Dining</span>
          <span className="ftl" onClick={() => setPage("cars")}>Luxury Cars</span>
          <span className="ftl" onClick={() => setPage("golf")}>Golf</span>
          <span className="ftl" onClick={() => setPage("aviation")}>Private Aviation</span>
          <span className="ftl" onClick={() => setPage("wine")}>Wine & Spirits</span>
          <span className="ftl" onClick={() => setPage("shopping")}>Luxury Shopping</span>
        </div>
        <div>
          <div className="ftct">List Your Business</div>
          <span className="ftl" onClick={() => setPage("partners")}>List Estate \u2014 $25/mo</span>
          <span className="ftl" onClick={() => setPage("partners")}>Agent Ad \u2014 $50/mo</span>
          <span className="ftl" onClick={() => setPage("partners")}>Restaurant \u2014 $75/mo</span>
          <span className="ftl" onClick={() => setPage("partners")}>Golf Club \u2014 $125/mo</span>
          <span className="ftl" onClick={() => setPage("partners")}>Luxury Cars \u2014 $150/mo</span>
          <span className="ftl" onClick={() => setPage("partners")}>Aviation \u2014 $250/mo</span>
        </div>
        <div>
          <div className="ftct">Company</div>
          <span className="ftl" onClick={() => setPage("about")}>About Monarc Prive</span>
          <span className="ftl" onClick={() => setPage("contact")}>Contact Us</span>
          <span className="ftl" onClick={() => setPage("admin")}>Admin Portal</span>
          <span className="ftl" onClick={() => setPage("privacy")}>Privacy Policy</span>
          <span className="ftl" onClick={() => setPage("terms")}>Terms of Service</span>
        </div>
      </div>
      <div className="ftbot">
        <div className="ftcopy">\u00a9 {new Date().getFullYear()} Monarc Prive \u00b7 Scottsdale, Arizona \u00b7 All rights reserved</div>
        <div className="ftleg">
          <span className="ftll">Privacy Policy</span>
          <span className="ftll">Terms of Service</span>
          <span className="ftll">Membership Agreement</span>
          <span className="ftll">Partner Terms</span>
        </div>
      </div>
    </footer>
  );

  const PartnerForm = ({ streamId }) => {
    const stream = PARTNER_STREAMS.find(s => s.id === streamId);
    if (!stream) return null;
    const perks = [[stream.price, "Monthly flat fee \u2014 no hidden costs"], ["UHNW Audience", "Members earn $500K+ annually"], ["Cancel Anytime", "No contracts or long-term commitments"], ["24-48hr Review", "Team reviews every listing personally"], ["Premium Placement", "Featured above general search"]];
    return (
      <div className="pf-wrap">
        <div>
          <div style={{ fontSize: ".56rem", letterSpacing: ".36em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>{stream.icon} {stream.label}</div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 300, color: "var(--t1)", marginBottom: 14, lineHeight: 1.2 }}>List with Monarc Prive.<br />Reach the right people.</h2>
          <p style={{ fontSize: ".8rem", color: "var(--t3)", fontWeight: 300, lineHeight: 1.8, marginBottom: 22 }}>Our members are high-net-worth individuals spending $2,000-$6,000 per night on their estates. They are actively looking for exactly what you offer.</p>
          <div>
            {perks.map(([val, lbl]) => (
              <div key={lbl} style={{ display: "flex", gap: 14, padding: "9px 0", borderBottom: "1px solid rgba(212,201,181,.07)", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: ".95rem", color: "var(--gold)", minWidth: 90, flexShrink: 0 }}>{val}</span>
                <span style={{ fontSize: ".74rem", color: "var(--t2)", fontWeight: 300, lineHeight: 1.5 }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pf-form">
          <div style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", color: "var(--t1)", marginBottom: 18 }}>Start Your Application</div>
          {streamId === "property" && <>
            <div className="fg"><label className="fl">Property Name</label><input className="fi" placeholder="e.g. Villa Dorada at Paradise Valley" onChange={field("pn")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Area</label><select className="fis" onChange={field("area")}><option value="">Select area</option>{["Paradise Valley", "North Scottsdale", "Scottsdale", "Old Town Scottsdale", "Arcadia", "DC Ranch", "Troon"].map(a => <option key={a}>{a}</option>)}</select></div>
              <div className="fg"><label className="fl">Nightly Rate ($)</label><input className="fi" type="number" placeholder="2500" onChange={field("rate")} /></div>
            </div>
            <div className="r2">
              <div className="fg"><label className="fl">Bedrooms</label><input className="fi" type="number" placeholder="6" onChange={field("beds")} /></div>
              <div className="fg"><label className="fl">Max Guests</label><input className="fi" type="number" placeholder="12" onChange={field("guests")} /></div>
            </div>
            <div className="r2">
              <div className="fg"><label className="fl">Events Allowed?</label><select className="fis" onChange={field("ev")}><option>No</option><option>Yes - with approval</option></select></div>
              <div className="fg"><label className="fl">Pet Friendly?</label><select className="fis" onChange={field("pet")}><option>No</option><option>Yes</option></select></div>
            </div>
            <div className="fg"><label className="fl">Description</label><textarea className="fit" rows={3} placeholder="Describe in luxury, editorial terms..." onChange={field("desc")} /></div>
            <div className="fg"><label className="fl">Your Name</label><input className="fi" placeholder="Full name or company" onChange={field("hn")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="your@email.com" onChange={field("he")} /></div>
              <div className="fg"><label className="fl">Phone</label><input className="fi" type="tel" placeholder="(480) 555-0000" onChange={field("hp")} /></div>
            </div>
          </>}
          {streamId === "agent" && <>
            <div className="r2">
              <div className="fg"><label className="fl">Full Name</label><input className="fi" placeholder="Your name" onChange={field("an")} /></div>
              <div className="fg"><label className="fl">Title</label><input className="fi" placeholder="Luxury Estate Specialist" onChange={field("at")} /></div>
            </div>
            <div className="fg"><label className="fl">Brokerage / Agency</label><input className="fi" placeholder="e.g. Russ Lyon Sotheby's International" onChange={field("ag")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Years in Luxury RE</label><input className="fi" type="number" placeholder="14" onChange={field("ay")} /></div>
              <div className="fg"><label className="fl">Career Sales Volume</label><input className="fi" placeholder="$280M+" onChange={field("as")} /></div>
            </div>
            <div className="r2">
              <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="you@agency.com" onChange={field("ae")} /></div>
              <div className="fg"><label className="fl">Phone</label><input className="fi" type="tel" onChange={field("ap")} /></div>
            </div>
            <div className="fg"><label className="fl">Professional Bio</label><textarea className="fit" rows={3} placeholder="2-3 sentences on your luxury market expertise..." onChange={field("ab")} /></div>
            <div className="fg"><label className="fl">License Number (AZ)</label><input className="fi" placeholder="AZ RE License #" onChange={field("al")} /></div>
          </>}
          {streamId === "restaurant" && <>
            <div className="fg"><label className="fl">Restaurant Name</label><input className="fi" placeholder="Your restaurant name" onChange={field("rn")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Cuisine Type</label><input className="fi" placeholder="e.g. Japanese \u00b7 Contemporary" onChange={field("rc")} /></div>
              <div className="fg"><label className="fl">Price Range</label><select className="fis" onChange={field("rp")}><option>$$</option><option>$$$</option><option>$$$$</option></select></div>
            </div>
            <div className="r2">
              <div className="fg"><label className="fl">Chef / Owner</label><input className="fi" placeholder="Chef name" onChange={field("rch")} /></div>
              <div className="fg"><label className="fl">Neighborhood</label><input className="fi" placeholder="Old Town Scottsdale" onChange={field("ra")} /></div>
            </div>
            <div className="fg"><label className="fl">Signature Dishes</label><input className="fi" placeholder="Your 2-3 signature dishes" onChange={field("rs")} /></div>
            <div className="fg"><label className="fl">Description</label><textarea className="fit" rows={3} placeholder="What makes your restaurant exceptional?" onChange={field("rd")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Reservation Phone</label><input className="fi" type="tel" onChange={field("rph")} /></div>
              <div className="fg"><label className="fl">Email / Contact</label><input className="fi" type="email" onChange={field("re")} /></div>
            </div>
            <div className="fg"><label className="fl">Reservation Link / Website</label><input className="fi" placeholder="https://" onChange={field("rw")} /></div>
          </>}
          {streamId === "golf" && <>
            <div className="fg"><label className="fl">Club / Course Name</label><input className="fi" placeholder="Your club or course name" onChange={field("gn")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Type</label><select className="fis" onChange={field("gt")}><option>Championship Course</option><option>Private Club</option><option>Semi-Private</option><option>Resort Course</option></select></div>
              <div className="fg"><label className="fl">Green Fee Range</label><input className="fi" placeholder="$250-$500" onChange={field("gf")} /></div>
            </div>
            <div className="fg"><label className="fl">Location / Area</label><input className="fi" placeholder="North Scottsdale" onChange={field("ga")} /></div>
            <div className="fg"><label className="fl">Description</label><textarea className="fit" rows={3} placeholder="Describe the course, designer, signature holes..." onChange={field("gd")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Contact Name</label><input className="fi" onChange={field("gc")} /></div>
              <div className="fg"><label className="fl">Email</label><input className="fi" type="email" onChange={field("ge")} /></div>
            </div>
            <div className="fg"><label className="fl">Phone</label><input className="fi" type="tel" onChange={field("gp")} /></div>
          </>}
          {streamId === "cars" && <>
            <div className="fg"><label className="fl">Business Name</label><input className="fi" placeholder="Your rental company name" onChange={field("vcn")} /></div>
            <div className="fg"><label className="fl">Fleet Description</label><input className="fi" placeholder="e.g. Ferrari, Lamborghini, Rolls-Royce, Bentley" onChange={field("vf")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Starting Daily Rate ($)</label><input className="fi" type="number" placeholder="1800" onChange={field("vr")} /></div>
              <div className="fg"><label className="fl">Estate Delivery?</label><select className="fis" onChange={field("vd")}><option>Yes - deliver to estate</option><option>Pick up at our location</option></select></div>
            </div>
            <div className="fg"><label className="fl">Description</label><textarea className="fit" rows={3} placeholder="Describe your fleet and the experience..." onChange={field("vdesc")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Email</label><input className="fi" type="email" onChange={field("ve")} /></div>
              <div className="fg"><label className="fl">Phone</label><input className="fi" type="tel" onChange={field("vp")} /></div>
            </div>
          </>}
          {streamId === "medspa" && <>
            <div className="fg"><label className="fl">Business Name</label><input className="fi" placeholder="Your spa or clinic name" onChange={field("spn")} /></div>
            <div className="fg"><label className="fl">Services Offered</label><input className="fi" placeholder="e.g. IV Therapy, Botox, Massage, Aesthetics" onChange={field("sps")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Location / Area</label><input className="fi" placeholder="Scottsdale" onChange={field("spa")} /></div>
              <div className="fg"><label className="fl">In-Villa Service?</label><select className="fis" onChange={field("spv")}><option>Yes - available in-villa</option><option>Spa location only</option><option>Both</option></select></div>
            </div>
            <div className="fg"><label className="fl">Starting Price</label><input className="fi" placeholder="From $195" onChange={field("spp")} /></div>
            <div className="fg"><label className="fl">Description</label><textarea className="fit" rows={3} placeholder="Describe your services..." onChange={field("spd")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Email</label><input className="fi" type="email" onChange={field("spe")} /></div>
              <div className="fg"><label className="fl">Phone</label><input className="fi" type="tel" onChange={field("spph")} /></div>
            </div>
          </>}
          {streamId === "aviation" && <>
            <div className="fg"><label className="fl">Company Name</label><input className="fi" placeholder="Your aviation company" onChange={field("avn")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Service Type</label><select className="fis" onChange={field("avt")}><option>On-Demand Charter</option><option>Jet Card</option><option>Fractional</option><option>Helicopter</option><option>Tours</option></select></div>
              <div className="fg"><label className="fl">Base Airport</label><input className="fi" placeholder="Scottsdale Airport (SDL)" onChange={field("avb")} /></div>
            </div>
            <div className="fg"><label className="fl">Aircraft Available</label><input className="fi" placeholder="e.g. Citation, Gulfstream, Bell 407" onChange={field("ava")} /></div>
            <div className="fg"><label className="fl">Starting Rate</label><input className="fi" placeholder="From $8,500/hr" onChange={field("avr")} /></div>
            <div className="fg"><label className="fl">Description</label><textarea className="fit" rows={3} placeholder="Describe your service and destinations..." onChange={field("avd")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Email</label><input className="fi" type="email" onChange={field("ave")} /></div>
              <div className="fg"><label className="fl">Phone</label><input className="fi" type="tel" onChange={field("avp")} /></div>
            </div>
          </>}
          {(streamId === "yacht" || streamId === "shopping" || streamId === "wine" || streamId === "events" || streamId === "experience") && <>
            <div className="fg"><label className="fl">Business / Service Name</label><input className="fi" placeholder="Your business name" onChange={field("bn")} /></div>
            <div className="fg"><label className="fl">Type / Category</label><input className="fi" placeholder="Describe what you offer" onChange={field("bt")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Location / Service Area</label><input className="fi" placeholder="Scottsdale area" onChange={field("ba")} /></div>
              <div className="fg"><label className="fl">Starting Price</label><input className="fi" placeholder="From $500" onChange={field("bp")} /></div>
            </div>
            <div className="fg"><label className="fl">Description</label><textarea className="fit" rows={3} placeholder="Describe what makes your offering exceptional..." onChange={field("bd")} /></div>
            <div className="r2">
              <div className="fg"><label className="fl">Email</label><input className="fi" type="email" onChange={field("be")} /></div>
              <div className="fg"><label className="fl">Phone</label><input className="fi" type="tel" onChange={field("bph")} /></div>
            </div>
          </>}
          <button className="btnf" style={{ marginTop: 16 }} onClick={async () => {
            const tableMap = { property: "host_listings", agent: "agent_listings", restaurant: "restaurant_listings", golf: "golf_listings", cars: "car_listings", medspa: "medspa_listings", aviation: "aviation_listings", yacht: "yacht_listings", shopping: "shopping_listings", wine: "wine_listings", events: "events_listings", experience: "experience_listings" };
            const table = tableMap[streamId];
            const record = {
              status: "pending", monthly_fee: stream.fee,
              ...(streamId === "property" && { host_name: fv.hn || "", host_email: fv.he || "", host_phone: fv.hp || "", property_title: fv.pn || "", area: fv.area || "", nightly_rate: parseFloat(fv.rate) || 0, bedrooms: parseInt(fv.beds) || 0, max_guests: parseInt(fv.guests) || 0, description: fv.desc || "", event_ready: fv.ev === "Yes - with approval", pet_friendly: fv.pet === "Yes" }),
              ...(streamId === "agent" && { agent_name: fv.an || "", agent_title: fv.at || "", agency: fv.ag || "", email: fv.ae || "", phone: fv.ap || "", bio: fv.ab || "", years_experience: parseInt(fv.ay) || 0, career_sales_volume: fv.as || "", license_number: fv.al || "" }),
              ...(streamId === "restaurant" && { restaurant_name: fv.rn || "", cuisine_type: fv.rc || "", chef_name: fv.rch || "", area: fv.ra || "", price_range: fv.rp || "$$$$", signature_dishes: fv.rs || "", description: fv.rd || "", reservation_phone: fv.rph || "", email: fv.re || "", website_url: fv.rw || "" }),
              ...(streamId === "golf" && { club_name: fv.gn || "", course_type: fv.gt || "", area: fv.ga || "", green_fee_range: fv.gf || "", description: fv.gd || "", contact_name: fv.gc2 || "", email: fv.ge || "", phone: fv.gp || "" }),
              ...(streamId === "cars" && { business_name: fv.vcn || "", fleet_description: fv.vf || "", starting_daily_rate: parseFloat(fv.vr) || 0, estate_delivery: fv.vd !== "Pick up at our location", description: fv.vdesc || "", email: fv.ve || "", phone: fv.vp || "" }),
              ...(streamId === "medspa" && { business_name: fv.spn || "", services_offered: fv.sps || "", area: fv.spa || "", in_villa_service: fv.spv !== "Spa location only", starting_price: fv.spp || "", description: fv.spd || "", email: fv.spe || "", phone: fv.spph || "" }),
              ...(streamId === "aviation" && { company_name: fv.avn || "", service_type: fv.avt || "", base_airport: fv.avb || "", aircraft_available: fv.ava || "", starting_rate: fv.avr || "", description: fv.avd || "", email: fv.ave || "", phone: fv.avp || "" }),
              ...(["yacht", "shopping", "wine", "events", "experience"].includes(streamId) && { business_name: fv.bn || "", business_type: fv.bt || "", area: fv.ba || "", starting_price: fv.bp || "", description: fv.bd || "", email: fv.be || "", phone: fv.bph || "" }),
            };
            if (table) await db(sb => sb.from(table).insert(record));
            openModal("success-listing", { stream });
          }}>Submit Application \u2014 {stream.price} \u2192</button>
          <div style={{ fontSize: ".6rem", color: "var(--taupe)", textAlign: "center", marginTop: 10, lineHeight: 1.6 }}>Reviewed within 24-48 hours. Billing starts upon approval. Cancel anytime.</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{CSS}</style>
      <nav className="nav">
        <div className="nav-logo" onClick={() => setPage("home")}>Monarc<span>\u00b7</span>Prive</div>
        <div className="nav-links">
          {NavItems.map(n => <div key={n.id} className={`nl${page === n.id ? " on" : ""}`} onClick={() => setPage(n.id)}>{n.label}</div>)}
        </div>
        <div className="nav-right">
          {currentUser ? (
            <>
              <button className="nb" onClick={() => setPage("portal")} style={{ color: "var(--gold)", borderColor: "rgba(201,169,110,.3)" }}>\u25c8 My Portal</button>
              <button className="nb" onClick={signOut}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="nb" onClick={() => openModal("login")}>Sign In</button>
              <button className="nb cta" onClick={() => openModal("join")}>Join</button>
            </>
          )}
        </div>
      </nav>

      {page === "home" && <>
        <div className="hero">
          {HERO_IMGS.map((src, i) => <img key={i} className="hi" src={src} alt="" style={{ opacity: i === heroIdx ? 1 : 0, zIndex: i === heroIdx ? 1 : 0 }} />)}
          <div className="hg" />
          <div className="hc">
            <div className="he">Scottsdale \u00b7 Paradise Valley \u00b7 Members Only</div>
            <h1 className="hh">Privacy as an<br /><em>art form</em></h1>
            <div className="ha">
              <button className="btn-g" onClick={() => openModal("join")}>Request Membership</button>
              <button className="btn-o" onClick={() => setPage("partners")}>List Your Business</button>
            </div>
          </div>
          <div className="hdots">{HERO_IMGS.map((_, i) => <div key={i} className={`hd${i === heroIdx ? " on" : ""}`} onClick={() => setHeroIdx(i)} />)}</div>
        </div>
        <div className="sec sec-d">
          <div className="sh"><div className="st">Featured Estates</div><span className="sl" onClick={() => setPage("home")}>All 6 \u2192</span></div>
          <div className="g3">{PROPERTIES.slice(0, 3).map((p, i) => <PropCard key={p.id} p={p} idx={i} />)}</div>
        </div>
        <div className="sec">
          <div className="sh"><div className="st">Curated Dining</div><span className="sl" onClick={() => setPage("restaurants")}>All restaurants \u2192</span></div>
          <div className="g3">{RESTAURANTS.slice(0, 3).map(r => <RestCard key={r.id} r={r} />)}</div>
        </div>
        <div className="sec sec-d">
          <div className="sh"><div className="st">Exotic & Luxury Cars</div><span className="sl" onClick={() => setPage("cars")}>All vehicles \u2192</span></div>
          <div className="g4">{LUXURY_CARS.map(c => <CarCard key={c.id} c={c} />)}</div>
        </div>
        <div className="sec">
          <div className="sh"><div className="st">World-Class Golf</div><span className="sl" onClick={() => setPage("golf")}>All courses \u2192</span></div>
          <div className="g4">{GOLF_VENUES.map(g => <LuxCard key={g.id} item={g} />)}</div>
        </div>
        <div className="sec sec-d">
          <div className="cb-banner" onClick={() => setPage("experiences")}>
            <div>
              <div style={{ fontSize: ".52rem", letterSpacing: ".36em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>Monarc Prive Concierge</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 300, color: "var(--t1)", lineHeight: 1.2 }}>Private chef. Exotic car. Helicopter to the Grand Canyon.<br /><em style={{ fontStyle: "italic", color: "var(--gold-l)" }}>All arranged before you land.</em></div>
            </div>
            <button className="btn-g" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>Explore Concierge \u2192</button>
          </div>
        </div>
        <div className="sec">
          <div className="sh"><div className="st">Private Aviation</div><span className="sl" onClick={() => setPage("aviation")}>All operators \u2192</span></div>
          <div className="g3">{AVIATION_DATA.map(a => <LuxCard key={a.id} item={a} />)}</div>
        </div>
        <div className="sec sec-d">
          <div className="sh"><div className="st">Med Spa & Wellness</div><span className="sl" onClick={() => setPage("medspa")}>All spas \u2192</span></div>
          <div className="g3">{MED_SPAS.map(m => <LuxCard key={m.id} item={m} />)}</div>
        </div>
        <div className="sec">
          <div className="sh"><div className="st">More Estates</div></div>
          <div className="g3">{PROPERTIES.slice(3).map((p, i) => <PropCard key={p.id} p={p} idx={i + 3} />)}</div>
        </div>
        <div className="sec sec-d">
          <div className="sh">
            <div className="st">Member Voices</div>
            <div style={{ textAlign: "right" }}><div style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", fontWeight: 300, color: "var(--gold)" }}>5.0</div><div style={{ fontSize: ".56rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--taupe)" }}>\u2605\u2605\u2605\u2605\u2605 \u00b7 147 reviews</div></div>
          </div>
          <div className="revg">
            {REVIEWS.map(r => (
              <div key={r.name} className="revc">
                <div className="revs">\u2605\u2605\u2605\u2605\u2605</div>
                <div className="revt">"{r.text}"</div>
                <div className="revauth"><img src={r.img} alt={r.name} className="revav" loading="lazy" /><div><div className="revn">{r.name}</div><div className="revr">{r.title}</div></div></div>
                <div className="revp">{r.prop}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="sec" style={{ textAlign: "center" }}>
          <div style={{ fontSize: ".58rem", letterSpacing: ".4em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>Limited Memberships</div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem,4vw,3.4rem)", fontWeight: 300, color: "var(--t1)", marginBottom: 16, lineHeight: 1.1 }}>Everything Scottsdale has to offer,<br /><em style={{ fontStyle: "italic", color: "var(--gold-l)" }}>curated for you</em></h2>
          <p style={{ fontSize: ".86rem", color: "var(--t3)", fontWeight: 300, lineHeight: 1.85, maxWidth: 480, margin: "0 auto 32px" }}>One membership. Six estates. Dozens of luxury partners. AI concierge 24/7.</p>
          <button className="btn-g" style={{ padding: "17px 44px" }} onClick={() => openModal("join")}>Apply for Membership</button>
        </div>
        <Footer />
      </>}

      {page === "restaurants" && <>
        <div className="ph"><img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=85" className="phi" alt="" /><div className="pho" /><div className="phc"><div className="phe">Curated Dining \u00b7 Member Access</div><h1 className="pht">Scottsdale finest tables.<br /><em>Reserved for you.</em></h1></div></div>
        <div className="sec"><div className="g3">{RESTAURANTS.map(r => <RestCard key={r.id} r={r} />)}</div><PartnerCTA msg="Own a luxury restaurant?" btn="List Your Restaurant \u2014 $75/mo" stream="restaurant" /></div>
        <Footer />
      </>}

      {page === "cars" && <>
        <div className="ph"><img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=85" className="phi" alt="" /><div className="pho" /><div className="phc"><div className="phe">Exotic & Luxury Vehicles</div><h1 className="pht">Drive something<br /><em>extraordinary.</em></h1></div></div>
        <div className="sec"><div className="g4">{LUXURY_CARS.map(c => <CarCard key={c.id} c={c} />)}</div><PartnerCTA msg="Operate a luxury or exotic car rental?" btn="List Your Fleet \u2014 $150/mo" stream="cars" /></div>
        <Footer />
      </>}

      {page === "golf" && <>
        <div className="ph"><img src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1400&q=85" className="phi" alt="" /><div className="pho" /><div className="phc"><div className="phe">World-Class Golf \u00b7 Scottsdale</div><h1 className="pht">The golf capital.<br /><em>Played properly.</em></h1></div></div>
        <div className="sec"><div className="g4">{GOLF_VENUES.map(g => <LuxCard key={g.id} item={g} />)}</div><PartnerCTA msg="Run a golf club, course, or caddie service?" btn="List Your Club \u2014 $125/mo" stream="golf" /></div>
        <Footer />
      </>}

      {page === "experiences" && <>
        <div className="ph"><img src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1400&q=85" className="phi" alt="" /><div className="pho" /><div className="phc"><div className="phe">Curated Experiences</div><h1 className="pht">Beyond the estate.<br /><em>Beyond the ordinary.</em></h1></div></div>
        <div className="sec"><div className="g3">{EXPERIENCES_DATA.map(e => <ExpCard key={e.id} e={e} />)}</div><PartnerCTA msg="Offer an extraordinary experience?" btn="List Your Experience \u2014 $100/mo" stream="experience" /></div>
        <Footer />
      </>}

      {page === "medspa" && <>
        <div className="ph"><img src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1400&q=85" className="phi" alt="" /><div className="pho" /><div className="phc"><div className="phe">Spa \u00b7 Wellness \u00b7 Medical Aesthetics</div><h1 className="pht">Restoration.<br /><em>In-villa or in-spa.</em></h1></div></div>
        <div className="sec"><div className="g3">{MED_SPAS.map(m => <LuxCard key={m.id} item={m} />)}</div><PartnerCTA msg="Run a med spa, luxury spa, or wellness clinic?" btn="List Your Spa \u2014 $75/mo" stream="medspa" /></div>
        <Footer />
      </>}

      {page === "aviation" && <>
        <div className="ph"><img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=85" className="phi" alt="" /><div className="pho" /><div className="phc"><div className="phe">Private Aviation \u00b7 Scottsdale Airport</div><h1 className="pht">Fly private.<br /><em>Land anywhere.</em></h1></div></div>
        <div className="sec"><div className="g3">{AVIATION_DATA.map(a => <LuxCard key={a.id} item={a} />)}</div><PartnerCTA msg="Offer private aviation or helicopter services?" btn="List Your Service \u2014 $250/mo" stream="aviation" /></div>
        <Footer />
      </>}

      {page === "wine" && <>
        <div className="ph"><img src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1400&q=85" className="phi" alt="" /><div className="pho" /><div className="phc"><div className="phe">Wine \u00b7 Rare Spirits \u00b7 Private Tastings</div><h1 className="pht">Drink something<br /><em>worth remembering.</em></h1></div></div>
        <div className="sec"><div className="g3">{WINE_DATA.map(w => <LuxCard key={w.id} item={w} />)}</div><PartnerCTA msg="Wine, spirits, or private tasting experiences?" btn="List Your Service \u2014 $100/mo" stream="wine" /></div>
        <Footer />
      </>}

      {page === "shopping" && <>
        <div className="ph"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=85" className="phi" alt="" /><div className="pho" /><div className="phc"><div className="phe">Luxury Shopping \u00b7 Art \u00b7 Jewelry</div><h1 className="pht">Acquire something<br /><em>exceptional.</em></h1></div></div>
        <div className="sec"><div className="g3">{SHOPPING_DATA.map(s => <LuxCard key={s.id} item={s} />)}</div><PartnerCTA msg="Luxury boutique, jeweler, gallery, or stylist?" btn="List Your Business \u2014 $100/mo" stream="shopping" /></div>
        <Footer />
      </>}

      {page === "membership" && <>
        <div style={{ background: "var(--ink)" }}>
          <div style={{ textAlign: "center", padding: "72px 56px 56px" }}>
            <div style={{ fontSize: ".58rem", letterSpacing: ".4em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>Exclusive Membership</div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2.2rem,4.5vw,3.8rem)", fontWeight: 300, color: "var(--t1)", lineHeight: 1.1, marginBottom: 16 }}>Not a marketplace.<br /><em style={{ fontStyle: "italic", color: "var(--gold-l)" }}>A private club.</em></h1>
            <p style={{ fontSize: ".86rem", color: "var(--t3)", fontWeight: 300, lineHeight: 1.85, maxWidth: 560, margin: "0 auto" }}>One membership unlocks 6 private estates, every luxury partner \u2014 restaurants, exotic cars, golf, spas, aviation, wine, shopping \u2014 and a 24/7 AI concierge that knows your preferences before you ask.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "var(--border)", marginBottom: 0 }}>
            {[
              { name: "Curated", icon: "\u25cc", price: "$300", period: "/year", highlight: false, badge: null, perks: ["Access to all 6 curated private estates", "Sterling AI concierge \u2014 24/7", "Standard booking window", "Member pricing on all services", "Vetted guest community", "Digital membership card"] },
              { name: "Private", icon: "\u25c8", price: "$750", period: "/year", highlight: true, badge: "Most Popular", perks: ["Everything in Curated", "48-hour priority access window", "Dedicated account manager", "Exclusive member events & invitations", "Concierge service credits ($200)", "Physical membership card & gift", "Early access to new estates"] },
              { name: "Founding", icon: "\u25c9", price: "By Invite", period: "", highlight: false, badge: "Limited \u2014 50 Members", perks: ["Everything in Private", "Founding member status forever", "Annual luxury gratitude gift", "Direct founder access & influence", "Co-creation of new estate additions", "Lifetime rate lock \u2014 never increases", "Named acknowledgment in platform"] },
            ].map(t => (
              <div key={t.name} style={{ background: "var(--ink-m)", padding: "36px 32px", position: "relative", overflow: "hidden" }}>
                {t.highlight && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />}
                {t.badge && <div style={{ position: "absolute", top: t.highlight ? 14 : 10, right: 16, fontSize: ".48rem", letterSpacing: ".2em", textTransform: "uppercase", color: t.highlight ? "var(--gold)" : "var(--taupe)", background: "var(--ink-m)", padding: "0 6px" }}>{t.badge}</div>}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <span style={{ fontSize: "1.4rem", color: "var(--gold)", display: "block", marginBottom: 10 }}>{t.icon}</span>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", color: "var(--t1)", fontWeight: 400, marginBottom: 6 }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "2.6rem", color: t.highlight ? "var(--gold)" : "var(--t1)", fontWeight: 300, lineHeight: 1 }}>{t.price === "$300" || t.price === "$750" ? <><sup style={{ fontSize: "1.1rem", verticalAlign: "top", marginTop: ".3rem", color: "var(--gold)" }}>$</sup>{t.price.slice(1)}</> : t.price}</div>
                  <div style={{ fontSize: ".58rem", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--taupe)", marginTop: 5 }}>{t.period || " "}</div>
                </div>
                <ul style={{ listStyle: "none", marginBottom: 26, borderTop: "1px solid rgba(212,201,181,.08)", paddingTop: 18 }}>
                  {t.perks.map(p => (
                    <li key={p} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(212,201,181,.05)", fontSize: ".72rem", color: "var(--t2)", fontWeight: 300, lineHeight: 1.5 }}>
                      <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }}>\u2014</span>{p}
                    </li>
                  ))}
                </ul>
                <button onClick={() => t.price === "By Invite" ? openModal("invite") : openModal("join")}
                  style={{ width: "100%", background: t.highlight ? "var(--gold)" : "none", color: t.highlight ? "var(--ink)" : "var(--t2)", border: t.highlight ? "none" : "1px solid rgba(212,201,181,.2)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: t.highlight ? 600 : 400, fontFamily: "var(--sans)", padding: 13, cursor: "pointer", borderRadius: 2, transition: "all .2s" }}
                  onMouseEnter={e => { if (!t.highlight) { e.target.style.borderColor = "var(--gold)"; e.target.style.color = "var(--gold)"; } }}
                  onMouseLeave={e => { if (!t.highlight) { e.target.style.borderColor = "rgba(212,201,181,.2)"; e.target.style.color = "var(--t2)"; } }}
                >{t.price === "By Invite" ? "Request an Invitation" : "Apply for " + t.name}</button>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--ink-s)", padding: "28px 56px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
              {[["6 Private Estates", "All tiers"], ["AI Concierge 24/7", "Sterling \u00b7 All tiers"], ["12 Luxury Partners", "Dining \u00b7 Cars \u00b7 Golf \u00b7 Spa \u00b7 Aviation \u00b7 More"], ["Total Discretion", "Vetted members only"]].map(([val, sub]) => (
                <div key={val}><div style={{ fontFamily: "var(--serif)", fontSize: "1rem", color: "var(--t1)", fontWeight: 400, marginBottom: 4 }}>{val}</div><div style={{ fontSize: ".6rem", color: "var(--taupe)", fontWeight: 300 }}>{sub}</div></div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "40px 56px" }}>
            <button className="btng" style={{ display: "inline-block", width: "auto", padding: "12px 32px" }} onClick={() => openModal("login")}>Already a member? Sign in</button>
          </div>
        </div>
        <Footer />
      </>}

      {page === "partners" && <>
        <div className="ph"><img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85" className="phi" alt="" /><div className="pho" /><div className="phc"><div className="phe">Partner Hub \u00b7 12 Revenue Streams</div><h1 className="pht">List. Advertise.<br /><em>Earn.</em></h1></div></div>
        <div className="ptabs">
          <div className={`ptab${pTab === "overview" ? " on" : ""}`} onClick={() => setPTab("overview")}>Overview</div>
          {PARTNER_STREAMS.map(s => <div key={s.id} className={`ptab${pTab === s.id ? " on" : ""}`} onClick={() => setPTab(s.id)}>{s.icon} {s.label}</div>)}
        </div>
        {pTab === "overview" && (
          <div className="sec">
            <div className="sh" style={{ marginBottom: 22 }}><div className="st">Partner Programs</div><span style={{ fontSize: ".56rem", color: "var(--taupe)" }}>12 revenue streams</span></div>
            <div className="psg">
              {PARTNER_STREAMS.map(s => (
                <div key={s.id} className="psc" onClick={() => setPTab(s.id)}>
                  <span style={{ fontSize: "1.4rem", marginBottom: 10, display: "block" }}>{s.icon}</span>
                  <div style={{ fontFamily: "var(--serif)", fontSize: ".95rem", color: "var(--t1)", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: ".62rem", color: "var(--gold)", letterSpacing: ".1em", fontWeight: 500, marginBottom: 8 }}>{s.price}</div>
                  <div style={{ fontSize: ".66rem", color: "var(--t3)", fontWeight: 300, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(201,169,110,.05)", border: "1px solid rgba(201,169,110,.15)", borderRadius: 3, padding: 24, marginTop: 8 }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", color: "var(--t1)", marginBottom: 14 }}>Revenue Potential</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[["10 Properties", "$250/mo", "+3% booking fees"], ["10 Restaurants", "$750/mo", "flat rate"], ["10 Golf Clubs", "$1,250/mo", "flat rate"], ["5 Aviation Ops", "$1,250/mo", "flat rate"]].map(([l, v, s]) => (
                  <div key={l} style={{ textAlign: "center", background: "var(--ink-m)", border: "1px solid var(--border)", borderRadius: 2, padding: 14 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", color: "var(--gold)", fontWeight: 300 }}>{v}</div>
                    <div style={{ fontSize: ".56rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--taupe)", margin: "4px 0 2px" }}>{l}</div>
                    <div style={{ fontSize: ".58rem", color: "var(--t3)", fontWeight: 300 }}>{s}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: 16, fontSize: ".8rem", color: "var(--t2)", fontWeight: 300 }}>10 partners per category \u00d7 12 categories = <strong style={{ color: "var(--gold-l)" }}>$12,750+/month</strong> in recurring partner fees alone</div>
            </div>
          </div>
        )}
        {PARTNER_STREAMS.map(s => pTab === s.id && <div key={s.id} className="sec"><PartnerForm streamId={s.id} /></div>)}
        <Footer />
      </>}

      {page === "portal" && (
        <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--ink)" }}>
          {memberLoading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, flexDirection: "column", gap: 16 }}>
              <div style={{ width: 28, height: 28, border: "1px solid rgba(201,169,110,.2)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <div style={{ fontSize: ".68rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--taupe)" }}>Loading your portal</div>
            </div>
          ) : !currentUser ? (
            <div style={{ textAlign: "center", padding: "80px 40px" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--t1)", marginBottom: 12 }}>Members Only</div>
              <p style={{ fontSize: ".82rem", color: "var(--t3)", fontWeight: 300, marginBottom: 24 }}>Please sign in to access your member portal.</p>
              <button className="btn-g" onClick={() => openModal("login")}>Sign In</button>
            </div>
          ) : (
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 40px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: ".54rem", letterSpacing: ".38em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 6 }}>Member Portal</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 300, color: "var(--t1)" }}>Welcome back{currentUser.user_metadata?.first_name ? `, ${currentUser.user_metadata.first_name}` : ""}</div>
                  <div style={{ fontSize: ".68rem", color: "var(--taupe)", marginTop: 4, fontWeight: 300 }}>
                    {memberData ? `${(memberData?.tier ? memberData.tier.charAt(0).toUpperCase() + memberData.tier.slice(1) : "Curated")} Member \u00b7 Active until ${new Date(memberData.expires_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : "Member in good standing"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {memberData && (
                    <div style={{ background: "var(--ink-m)", border: "1px solid rgba(201,169,110,.2)", borderRadius: 3, padding: "14px 20px", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
                      <div style={{ fontSize: ".5rem", letterSpacing: ".28em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 4 }}>\u25c8 Membership</div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: "1rem", color: "var(--t1)", marginBottom: 2 }}>{(memberData?.tier ? memberData.tier.charAt(0).toUpperCase() + memberData.tier.slice(1) : "Curated")} Tier</div>
                      <div style={{ fontSize: ".56rem", letterSpacing: ".16em", color: "var(--taupe)", fontFamily: "monospace" }}>{memberData.referral_code || "MP-MEMBER"}</div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 32 }}>
                {[
                  ["Bookings", memberBookings.length, "total stays"],
                  ["Confirmed", memberBookings.filter(b => b.status === "confirmed").length, "upcoming"],
                  ["Pending", memberBookings.filter(b => b.status === "pending").length, "awaiting approval"],
                  ["Tier", (memberData?.tier ? memberData.tier.charAt(0).toUpperCase() + memberData.tier.slice(1) : "Curated"), "membership level"],
                ].map(([lbl, val, sub]) => (
                  <div key={lbl} style={{ background: "var(--ink-m)", border: "1px solid var(--border)", borderRadius: 3, padding: "16px 18px" }}>
                    <div style={{ fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--taupe)", marginBottom: 6 }}>{lbl}</div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", color: "var(--t1)", fontWeight: 300 }}>{val}</div>
                    <div style={{ fontSize: ".6rem", color: "var(--t3)", marginTop: 3, fontWeight: 300 }}>{sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", fontWeight: 300, color: "var(--t1)" }}>My Bookings</div>
                  <button className="btn-g" style={{ padding: "10px 22px", fontSize: ".56rem" }} onClick={() => setPage("home")}>Book Another Estate \u2192</button>
                </div>
                {memberBookings.length === 0 ? (
                  <div style={{ background: "var(--ink-m)", border: "1px solid var(--border)", borderRadius: 3, padding: "48px 32px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", color: "var(--t2)", marginBottom: 8 }}>No bookings yet</div>
                    <p style={{ fontSize: ".76rem", color: "var(--t3)", fontWeight: 300, marginBottom: 20 }}>Browse our six private estates and request your first stay.</p>
                    <button className="btn-g" onClick={() => setPage("home")}>Browse Estates</button>
                  </div>
                ) : (
                  <div style={{ background: "var(--ink-m)", border: "1px solid var(--border)", borderRadius: 3, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr style={{ background: "var(--ink-s)" }}>
                        {["Reference", "Estate", "Check-In", "Check-Out", "Guests", "Total", "Status"].map(h => (
                          <th key={h} style={{ fontSize: ".5rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--taupe)", padding: "10px 16px", textAlign: "left", borderBottom: "1px solid var(--border)" }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {memberBookings.map((b, i) => (
                          <tr key={b.id || i} style={{ borderBottom: "1px solid rgba(212,201,181,.05)" }}>
                            <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: ".68rem", color: "var(--gold)" }}>{b.reference || "MP-" + String(b.id || "").slice(0, 8).toUpperCase()}</td>
                            <td style={{ padding: "12px 16px", fontSize: ".74rem", color: "var(--t1)", fontWeight: 400 }}>{PROPERTIES.find(p => p.id === b.property_id)?.name || "Estate"}</td>
                            <td style={{ padding: "12px 16px", fontSize: ".7rem", color: "var(--t2)" }}>{b.check_in ? new Date(b.check_in).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u2014"}</td>
                            <td style={{ padding: "12px 16px", fontSize: ".7rem", color: "var(--t2)" }}>{b.check_out ? new Date(b.check_out).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u2014"}</td>
                            <td style={{ padding: "12px 16px", fontSize: ".7rem", color: "var(--t2)" }}>{b.num_guests || "\u2014"}</td>
                            <td style={{ padding: "12px 16px", fontFamily: "var(--serif)", color: "var(--t1)" }}>{b.total ? `$${Number(b.total).toLocaleString()}` : "\u2014"}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ fontSize: ".5rem", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 600, padding: "3px 8px", borderRadius: 2, background: b.status === "confirmed" ? "rgba(91,175,132,.1)" : b.status === "pending" ? "rgba(232,168,56,.1)" : "rgba(224,82,82,.1)", border: `1px solid ${b.status === "confirmed" ? "rgba(91,175,132,.25)" : b.status === "pending" ? "rgba(232,168,56,.25)" : "rgba(224,82,82,.2)"}`, color: b.status === "confirmed" ? "var(--green)" : b.status === "pending" ? "var(--amber)" : "var(--red)" }}>{b.status || "pending"}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 32 }}>
                {[
                  { icon: "\u25cc", title: "Chat with Sterling", desc: "Your AI concierge is ready to arrange anything \u2014 chef, car, golf, spa.", action: () => { setPage("admin"); setASection("agents_ai"); setAgent("sterling"); } },
                  { icon: "\u25c8", title: "Browse Estates", desc: "All six private estates available for your next stay.", action: () => setPage("home") },
                  { icon: "\ud83c\udf7d", title: "Explore Dining", desc: "Priority reservations at Scottsdale's finest restaurants.", action: () => setPage("restaurants") },
                ].map(item => (
                  <div key={item.title} style={{ background: "var(--ink-m)", border: "1px solid var(--border)", borderRadius: 3, padding: 22, cursor: "pointer", transition: "border-color .18s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,169,110,.32)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                    onClick={item.action}>
                    <span style={{ fontSize: "1.1rem", color: "var(--gold)", marginBottom: 10, display: "block" }}>{item.icon}</span>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "1rem", color: "var(--t1)", marginBottom: 5 }}>{item.title}</div>
                    <div style={{ fontSize: ".68rem", color: "var(--t3)", fontWeight: 300, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--ink-m)", border: "1px solid var(--border)", borderRadius: 3, padding: 22 }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", color: "var(--t1)", marginBottom: 14 }}>Account Details</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {[
                    ["Email", currentUser.email],
                    ["Member Since", memberData?.created_at ? new Date(memberData.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "\u2014"],
                    ["Membership Tier", (memberData?.tier ? memberData.tier.charAt(0).toUpperCase() + memberData.tier.slice(1) : "Curated")],
                    ["Valid Through", memberData?.expires_at ? new Date(memberData.expires_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "\u2014"],
                  ].map(([lbl, val]) => (
                    <div key={lbl} style={{ padding: "10px 14px", background: "rgba(248,245,240,.03)", borderRadius: 2, border: "1px solid rgba(212,201,181,.06)" }}>
                      <div style={{ fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--taupe)", marginBottom: 4 }}>{lbl}</div>
                      <div style={{ fontSize: ".78rem", color: "var(--t1)", fontWeight: 300 }}>{val || "\u2014"}</div>
                    </div>
                  ))}
                </div>
                <button onClick={signOut} style={{ background: "none", border: "1px solid rgba(224,82,82,.2)", color: "var(--red)", fontSize: ".56rem", letterSpacing: ".16em", textTransform: "uppercase", fontFamily: "var(--sans)", padding: "9px 18px", cursor: "pointer", borderRadius: 2, transition: "all .18s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(224,82,82,.08)" }}
                  onMouseLeave={e => { e.target.style.background = "none" }}>Sign Out</button>
              </div>
            </div>
          )}
        </div>
      )}

      {page === "about" && <>
        <div className="ph" style={{ height: 320 }}>
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85" className="phi" alt="" />
          <div className="pho" /><div className="phc"><div className="phe">Our Story</div><h1 className="pht">A new standard for<br /><em>private luxury.</em></h1></div>
        </div>
        <div className="sec" style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 300, color: "var(--t1)", lineHeight: 1.15, marginBottom: 28 }}>We built the platform we always wished existed.</h2>
          <p style={{ fontSize: ".86rem", color: "var(--t2)", fontWeight: 300, lineHeight: 1.95, marginBottom: 24 }}>Monarc Priv\u00e9 was founded with a single conviction: the ultra-luxury travel market deserved something better than public marketplaces, impersonal listings, and reactive service.</p>
          <p style={{ fontSize: ".86rem", color: "var(--t2)", fontWeight: 300, lineHeight: 1.95, marginBottom: 24 }}>Based in Scottsdale and Paradise Valley, Arizona, we operate at the intersection of hospitality, technology, and taste. Our platform gives discerning travelers access to six exceptional private estates alongside a curated network of Scottsdale's finest restaurants, exotic car providers, world-class golf courses, private aviation operators, luxury spas, and more.</p>
          <p style={{ fontSize: ".86rem", color: "var(--t2)", fontWeight: 300, lineHeight: 1.95, marginBottom: 40 }}>At the heart of the experience is Sterling \u2014 our AI concierge \u2014 who learns your preferences and orchestrates every detail before you arrive.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "var(--border)", marginBottom: 48 }}>
            {[["2024", "Founded in Scottsdale"], ["6", "Private Estates"], ["12", "Luxury Partner Categories"]].map(([val, lbl]) => (
              <div key={lbl} style={{ background: "var(--ink-m)", padding: "28px 24px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: "2.4rem", fontWeight: 300, color: "var(--gold)", marginBottom: 8 }}>{val}</div>
                <div style={{ fontSize: ".62rem", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--taupe)" }}>{lbl}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--ink-m)", border: "1px solid var(--border)", borderRadius: 3, padding: 32, position: "relative", overflow: "hidden", textAlign: "center" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
            <div style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 300, color: "var(--t1)", marginBottom: 12 }}>Ready to experience it?</div>
            <p style={{ fontSize: ".78rem", color: "var(--t3)", fontWeight: 300, lineHeight: 1.8, maxWidth: 440, margin: "0 auto 22px" }}>Membership is limited. Apply today and let Sterling take care of everything else.</p>
            <button className="btn-g" onClick={() => openModal("join")}>Apply for Membership \u2014 $300/yr</button>
          </div>
        </div>
        <Footer />
      </>}

      {page === "contact" && <>
        <div className="ph" style={{ height: 280 }}>
          <img src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1400&q=85" className="phi" alt="" />
          <div className="pho" /><div className="phc"><div className="phe">Get In Touch</div><h1 className="pht">We would love<br /><em>to hear from you.</em></h1></div>
        </div>
        <div className="sec" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 40, alignItems: "start" }}>
            <div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 300, color: "var(--t1)", lineHeight: 1.2, marginBottom: 18 }}>How can we help you?</h2>
              <p style={{ fontSize: ".82rem", color: "var(--t3)", fontWeight: 300, lineHeight: 1.85, marginBottom: 28 }}>Whether you have a question about membership, want to list your property, or simply want to learn more \u2014 our team responds within 24 hours.</p>
              {[["Membership Inquiries", "members@monarcprive.com"], ["Partner & Listing", "partners@monarcprive.com"], ["General Questions", "info@monarcprive.com"], ["Location", "Scottsdale, Arizona"]].map(([lbl, val]) => (
                <div key={lbl} style={{ display: "flex", gap: 16, padding: "12px 0", borderBottom: "1px solid rgba(212,201,181,.07)" }}>
                  <div style={{ fontSize: ".56rem", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--taupe)", minWidth: 130, paddingTop: 2, flexShrink: 0 }}>{lbl}</div>
                  <div style={{ fontSize: ".78rem", color: "var(--t2)", fontWeight: 300 }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "var(--ink-m)", border: "1px solid var(--border)", borderRadius: 3, padding: 26, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.15rem", color: "var(--t1)", marginBottom: 18 }}>Send Us a Message</div>
              <div className="r2">
                <div className="fg"><label className="fl">First Name</label><input className="fi" placeholder="First" onChange={field("cfn")} /></div>
                <div className="fg"><label className="fl">Last Name</label><input className="fi" placeholder="Last" onChange={field("cln")} /></div>
              </div>
              <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="your@email.com" onChange={field("cem")} /></div>
              <div className="fg"><label className="fl">Subject</label>
                <select className="fis" onChange={field("csub")}>
                  <option>Membership Inquiry</option><option>List My Property</option><option>Partner Advertising</option><option>Booking Question</option><option>General Inquiry</option>
                </select>
              </div>
              <div className="fg"><label className="fl">Message</label><textarea className="fit" rows={4} placeholder="How can we help you?" onChange={field("cmsg")} /></div>
              <button className="btnf" onClick={() => { showToast("Message sent \u2014 we'll be in touch within 24 hours."); setFv({}); }}>Send Message</button>
            </div>
          </div>
        </div>
        <Footer />
      </>}

      {page === "privacy" && <>
        <div className="ph" style={{ height: 240 }}><img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=85" className="phi" alt="" /><div className="pho" /><div className="phc"><div className="phe">Legal</div><h1 className="pht">Privacy Policy</h1></div></div>
        <div className="sec" style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ fontSize: ".6rem", color: "var(--taupe)", marginBottom: 32 }}>Last updated: January 1, 2025</div>
          {[["1. Information We Collect", "We collect information you provide directly to us, including when you create an account, apply for membership, submit a partner listing, or contact us. We never sell your personal data to third parties."], ["2. Data Security", "We implement industry-standard security measures including SSL encryption, secure database storage, and access controls. Payment information is processed through Stripe and is never stored on our servers."], ["3. Your Rights", "You have the right to access, update, or delete your personal information at any time. Contact us at privacy@monarcprive.com to exercise these rights."], ["4. Contact Us", "If you have questions about this Privacy Policy, contact us at privacy@monarcprive.com or write to Monarc Priv\u00e9, Scottsdale, Arizona."]].map(([title, body]) => (
            <div key={title} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid rgba(212,201,181,.07)" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.05rem", color: "var(--gold)", marginBottom: 10 }}>{title}</div>
              <p style={{ fontSize: ".8rem", color: "var(--t2)", fontWeight: 300, lineHeight: 1.9 }}>{body}</p>
            </div>
          ))}
          <div style={{ textAlign: "center", paddingTop: 12 }}><button className="btn-o" onClick={() => setPage("home")}>Return to Site</button></div>
        </div>
        <Footer />
      </>}

      {page === "terms" && <>
        <div className="ph" style={{ height: 240 }}><img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1400&q=85" className="phi" alt="" /><div className="pho" /><div className="phc"><div className="phe">Legal</div><h1 className="pht">Terms of Service</h1></div></div>
        <div className="sec" style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ fontSize: ".6rem", color: "var(--taupe)", marginBottom: 32 }}>Last updated: January 1, 2025</div>
          {[["1. Acceptance of Terms", "By accessing or using the Monarc Priv\u00e9 platform, you agree to be bound by these Terms of Service."], ["2. Membership", "Membership fees are billed annually and are non-refundable except as required by law. Memberships are personal and non-transferable."], ["3. Booking & Reservations", "Estate booking requests are subject to availability and host approval. Submission of a booking request does not guarantee a reservation."], ["4. Governing Law", "These Terms of Service shall be governed by the laws of the State of Arizona. Contact us at legal@monarcprive.com with any questions."]].map(([title, body]) => (
            <div key={title} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid rgba(212,201,181,.07)" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.05rem", color: "var(--gold)", marginBottom: 10 }}>{title}</div>
              <p style={{ fontSize: ".8rem", color: "var(--t2)", fontWeight: 300, lineHeight: 1.9 }}>{body}</p>
            </div>
          ))}
          <div style={{ textAlign: "center", paddingTop: 12 }}><button className="btn-o" onClick={() => setPage("home")}>Return to Site</button></div>
        </div>
        <Footer />
      </>}

      {page === "admin" && !adminAuthed && (
        <div style={{ minHeight: "100vh", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "var(--ink-m)", border: "1px solid var(--border)", borderRadius: 4, width: "100%", maxWidth: 380, overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
            <div style={{ padding: "28px 30px 24px" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", fontWeight: 300, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--t1)", marginBottom: 4 }}>Monarc<span style={{ color: "var(--gold)" }}>\u00b7</span>Priv\u00e9</div>
                <div style={{ fontSize: ".52rem", letterSpacing: ".3em", textTransform: "uppercase", color: "var(--taupe)" }}>Admin Portal</div>
              </div>
              <div style={{ fontSize: ".56rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--taupe)", display: "block", marginBottom: 7, fontWeight: 500 }}>Access Password</div>
              <input type="password" placeholder="Enter admin password" value={adminPwInput}
                onChange={e => { setAdminPwInput(e.target.value); setAdminPwError(false); }}
                onKeyDown={e => { if (e.key === "Enter") { if (adminPwInput === ADMIN_PASSWORD) { setAdminAuthed(true); setAdminPwInput(""); } else { setAdminPwError(true); setAdminPwInput(""); } } }}
                style={{ width: "100%", background: "rgba(248,245,240,.04)", border: `1px solid ${adminPwError ? "var(--red)" : "var(--border)"}`, borderRadius: 2, padding: "11px 13px", fontFamily: "var(--sans)", fontSize: ".8rem", color: "var(--t1)", fontWeight: 300, outline: "none", marginBottom: adminPwError ? 6 : 14, letterSpacing: ".1em" }}
              />
              {adminPwError && <div style={{ fontSize: ".62rem", color: "var(--red)", marginBottom: 12 }}>Incorrect password. Try again.</div>}
              <button onClick={() => { if (adminPwInput === ADMIN_PASSWORD) { setAdminAuthed(true); setAdminPwInput(""); } else { setAdminPwError(true); setAdminPwInput(""); } }}
                style={{ width: "100%", background: "var(--gold)", color: "var(--ink)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--sans)", padding: 13, border: "none", cursor: "pointer", borderRadius: 2 }}>Enter Admin Portal</button>
              <button onClick={() => setPage("home")} style={{ width: "100%", background: "none", border: "1px solid var(--border)", color: "var(--t3)", fontSize: ".56rem", letterSpacing: ".18em", textTransform: "uppercase", fontFamily: "var(--sans)", padding: 10, cursor: "pointer", borderRadius: 2, marginTop: 8 }}>\u2190 Return to Site</button>
            </div>
          </div>
        </div>
      )}

      {page === "admin" && adminAuthed && (
        <div className="adm">
          <aside className="aside">
            <div className="aside-logo"><div className="aside-wm">Monarc<span>\u00b7</span>Prive</div><div className="aside-sub">Admin Dashboard</div></div>
            <div className="asec">
              <div className="albl">Navigation</div>
              {[["overview", "\u25c8", "Overview"], ["listings", "\u25c9", "Listing Approvals"], ["bookings", "\u25cc", "Bookings"], ["members", "\u25ce", "Members"], ["revenue", "\u25cd", "Revenue"], ["agents_ai", "\u2726", "AI Agents"]].map(([id, icon, label]) => (
                <div key={id} className={`ait${aSection === id ? " on" : ""}`} onClick={() => { setASection(id); if (id === "listings") loadAdminPending(); }}>
                  <span className="ait-i">{icon}</span>
                  <span className="ait-t">{label}</span>
                  {id === "listings" && pending.length > 0 && <span className="abadge">{pending.length}</span>}
                </div>
              ))}
            </div>
          </aside>
          <div className="adm-main">
            <div className="adm-hdr">
              <div>
                <div className="adm-title">{{ overview: "Command Center", listings: "Listing Approvals", bookings: "Bookings", members: "Members", revenue: "Revenue", agents_ai: "AI Agents" }[aSection] || ""}</div>
                <div style={{ fontSize: ".56rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--t3)", marginTop: 2 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="nb" onClick={() => setPage("home")}>\u2190 Back to Site</button>
                <button className="nb" onClick={() => { setAdminAuthed(false); setPage("home"); }} style={{ borderColor: "rgba(224,82,82,.2)", color: "var(--red)" }}>Sign Out</button>
              </div>
            </div>
            <div className="adm-body">
              {aSection === "overview" && <>
                <div className="sg">
                  {[["Members", "47", "\u2191 +3 this week", "up"], ["Bookings", "23", "\u2191 +2 today", "up"], ["Monthly MRR", "$17,975", "\u2191 +18%", "up"], ["Pending", pending.length, pending.length > 0 ? "Action required" : "All clear", pending.length > 0 ? "am" : "up"]].map(([l, v, c, d]) => (
                    <div key={l} className="sc2"><div className="slbl">{l}</div><div className="sval">{v}</div><div className={`schg ${d}`}>{c}</div></div>
                  ))}
                </div>
                {pending.length > 0 && <div style={{ background: "rgba(232,168,56,.05)", border: "1px solid rgba(232,168,56,.2)", borderRadius: 3, padding: "13px 17px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div><div style={{ fontSize: ".66rem", color: "var(--amber)", fontWeight: 500, marginBottom: 3 }}>\u26a0 Action Required</div><div style={{ fontSize: ".72rem", color: "var(--t2)", fontWeight: 300 }}>{pending.length} partner listings awaiting review</div></div>
                  <button className="nb" style={{ borderColor: "rgba(232,168,56,.3)", color: "var(--amber)" }} onClick={() => setASection("listings")}>Review \u2192</button>
                </div>}
                <div style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", color: "var(--t1)", marginBottom: 11 }}>Recent Bookings</div>
                <div className="tbl"><table>
                  <thead><tr><th>Ref</th><th>Property</th><th>Guest</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>{bookings.map(b => (
                    <tr key={b.ref}>
                      <td style={{ fontFamily: "monospace", fontSize: ".66rem", color: "var(--gold)" }}>{b.ref}</td>
                      <td className="tdn">{b.prop}</td><td>{b.guest}</td>
                      <td style={{ fontFamily: "var(--serif)", color: "var(--t1)" }}>{b.total}</td>
                      <td><span className={`sp2 sp-${b.status === "confirmed" ? "a" : "p"}`}>{b.status}</span></td>
                      <td><div className="abr">{b.status === "pending" && <button className="ab app" onClick={() => approveBooking(b.ref)}>Approve</button>}<button className="ab view">View</button></div></td>
                    </tr>
                  ))}</tbody>
                </table></div>
              </>}
              {aSection === "listings" && <>
                {pending.length === 0
                  ? <div style={{ textAlign: "center", padding: "50px", color: "var(--t3)" }}><div style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", color: "var(--t2)", marginBottom: 6 }}>All caught up</div><div style={{ fontSize: ".72rem", fontWeight: 300 }}>No pending listings to review</div></div>
                  : <div className="tbl"><table>
                    <thead><tr><th>Type</th><th>Name</th><th>Details</th><th>Submitted</th><th>Actions</th></tr></thead>
                    <tbody>{pending.map(l => (
                      <tr key={l.id}>
                        <td><span className="sp2 sp-p">{l.type}</span></td>
                        <td className="tdn">{l.name}</td>
                        <td style={{ fontSize: ".66rem", color: "var(--t3)" }}>{l.detail}</td>
                        <td style={{ fontSize: ".64rem", color: "var(--t3)" }}>{l.submitted}</td>
                        <td><div className="abr"><button className="ab app" onClick={() => approvePending(l.id)}>\u2713 Approve</button><button className="ab rej" onClick={() => approvePending(l.id)}>\u2715 Reject</button><button className="ab view">Review</button></div></td>
                      </tr>
                    ))}</tbody>
                  </table></div>
                }
              </>}
              {aSection === "bookings" && <div className="tbl"><table>
                <thead><tr><th>Ref</th><th>Property</th><th>Guest</th><th>Total</th><th>6% Fee</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{bookings.map(b => (
                  <tr key={b.ref}>
                    <td style={{ fontFamily: "monospace", fontSize: ".66rem", color: "var(--gold)" }}>{b.ref}</td>
                    <td className="tdn">{b.prop}</td><td>{b.guest}</td>
                    <td style={{ fontFamily: "var(--serif)", color: "var(--t1)" }}>{b.total}</td>
                    <td style={{ color: "var(--green)", fontFamily: "var(--serif)" }}>${(parseInt(b.total.replace(/[$,]/g, "")) * 0.06).toFixed(0)}</td>
                    <td><span className={`sp2 sp-${b.status === "confirmed" ? "a" : "p"}`}>{b.status}</span></td>
                    <td><div className="abr">{b.status === "pending" && <><button className="ab app" onClick={() => approveBooking(b.ref)}>Approve</button><button className="ab rej">Decline</button></>}<button className="ab view">View</button></div></td>
                  </tr>
                ))}</tbody>
              </table></div>}
              {aSection === "revenue" && <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 }}>
                  {[["Memberships", "$14,100", "47 members \u00d7 $300"], ["Prop Listings", "$150", "6 \u00d7 $25/mo"], ["Agent Ads", "$600", "12 \u00d7 $50/mo"], ["Restaurants", "$750", "10 \u00d7 $75/mo"], ["Golf Clubs", "$625", "5 \u00d7 $125/mo"], ["Luxury Cars", "$450", "3 \u00d7 $150/mo"], ["Experiences", "$800", "8 \u00d7 $100/mo"], ["Aviation", "$500", "2 \u00d7 $250/mo"]].map(([l, v, s]) => (
                    <div key={l} className="sc2"><div className="slbl">{l}</div><div className="sval" style={{ fontSize: "1.2rem", color: "var(--gold)" }}>{v}</div><div style={{ fontSize: ".58rem", color: "var(--t3)", marginTop: 3, fontWeight: 300 }}>{s}</div></div>
                  ))}
                </div>
                <div className="sg">
                  {[["Total MRR", "$17,975", "All 12 streams combined"], ["Annual Run Rate", "$215K", "Subscriptions only"], ["Booking GMV", "$153K", "This month confirmed"], ["Platform Revenue", "$19K+", "MRR + 6% booking fees"]].map(([l, v, s]) => (
                    <div key={l} className="sc2"><div className="slbl">{l}</div><div className="sval">{v}</div><div style={{ fontSize: ".58rem", color: "var(--green)", marginTop: 4 }}>\u2191 {s}</div></div>
                  ))}
                </div>
              </>}
              {aSection === "members" && <div className="tbl"><table>
                <thead><tr><th>Member</th><th>Email</th><th>Tier</th><th>Since</th><th>Bookings</th><th>Actions</th></tr></thead>
                <tbody>{[
                  { n: "Victoria Ashworth", e: "v.ashworth@email.com", t: "private", s: "Jan 2025", b: 3 },
                  { n: "James Holloway III", e: "j.holloway@hcapital.com", t: "founding", s: "Dec 2024", b: 5 },
                  { n: "Sophia Laurent", e: "s.laurent@email.com", t: "curated", s: "Feb 2025", b: 2 },
                  { n: "Marcus Chen", e: "m.chen@ventures.com", t: "private", s: "Mar 2025", b: 2 },
                  { n: "Isabella Fontaine", e: "i.fontaine@email.com", t: "curated", s: "Apr 2025", b: 1 },
                ].map(m => (
                  <tr key={m.e}>
                    <td className="tdn">{m.n}</td><td style={{ fontSize: ".64rem", color: "var(--t3)" }}>{m.e}</td>
                    <td><span className={`sp2 ${m.t === "founding" ? "sp-a" : m.t === "private" ? "sp-a" : "sp-p"}`}>{m.t}</span></td>
                    <td style={{ fontSize: ".66rem", color: "var(--t3)" }}>{m.s}</td>
                    <td style={{ fontFamily: "var(--serif)", color: "var(--gold)" }}>{m.b}</td>
                    <td><div className="abr"><button className="ab view">View</button><button className="ab">Message</button></div></td>
                  </tr>
                ))}</tbody>
              </table></div>}
              {aSection === "agents_ai" && <>
                <div className="achips">
                  {AGENTS.map(a => (
                    <div key={a.id} className={`achip${agent === a.id ? " on" : ""}`} onClick={() => setAgent(a.id)}>
                      <span className="aci">{a.icon}</span>
                      <div className="acn">{a.name}</div>
                      <div className="acr">{a.role}</div>
                      <div className="acd"><span className="sdot" />Active</div>
                    </div>
                  ))}
                </div>
                <div className="chat-panel">
                  <div className="chat-hdr">
                    <span style={{ fontSize: ".95rem", color: "var(--gold)" }}>{curAgent?.icon}</span>
                    <span style={{ fontFamily: "var(--serif)", fontSize: ".9rem", color: "var(--t1)" }}>{curAgent?.name}</span>
                    <span style={{ fontSize: ".54rem", color: "var(--gold)", letterSpacing: ".1em" }}>{curAgent?.role}</span>
                    <span style={{ marginLeft: "auto", fontSize: ".5rem", color: "var(--green)", display: "flex", alignItems: "center", gap: 3 }}><span className="sdot" />Live AI \u00b7 Add VITE_ANTHROPIC_API_KEY in Vercel</span>
                  </div>
                  <div className="chat-msgs">
                    {(chatH[agent] || []).map((m, i) => (
                      <div key={i} className={`cmsg${m.role === "user" ? " u" : ""}`}>
                        <div className="cav">{m.role === "assistant" ? curAgent?.icon : "\u2299"}</div>
                        <div className={`cbub ${m.role === "assistant" ? "a" : "u"}`}>{m.content}</div>
                      </div>
                    ))}
                    {cTyping && <div className="cmsg"><div className="cav">{curAgent?.icon}</div><div className="typing"><div className="td2" /><div className="td2" /><div className="td2" /></div></div>}
                    <div ref={chatRef} />
                  </div>
                  <div className="qkb">
                    {(QUICK[agent] || []).map(q => <button key={q} className="qk" onClick={() => sendChat(q)}>{q}</button>)}
                  </div>
                  <div className="cia">
                    <input className="ci2" placeholder={`Message ${curAgent?.name}...`} value={cInp} onChange={e => setCInp(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat(cInp)} />
                    <button className="csend" onClick={() => sendChat(cInp)} disabled={!cInp.trim() || cTyping}>\u2191</button>
                  </div>
                </div>
              </>}
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="mov" onClick={() => !["success", "success-listing"].includes(modal) && closeModal()}>
          <div className="mb" onClick={e => e.stopPropagation()}>
            {modal === "login" && <>
              <div className="mh"><button className="mc" onClick={closeModal}>\u2715</button><div className="me">Monarc Prive</div><div className="mt">Welcome back</div><div className="ms">Sign in to your member account</div></div>
              <div className="mbd">
                <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="your@email.com" onChange={field("em")} /></div>
                <div className="fg"><label className="fl">Password</label><input className="fi" type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" onChange={field("pw")} /></div>
                <div id="login-error" style={{ display: "none", fontSize: ".68rem", color: "var(--red)", marginBottom: 10, padding: "8px 10px", background: "rgba(224,82,82,.08)", border: "1px solid rgba(224,82,82,.2)", borderRadius: 2 }}></div>
                <button className="btnf" onClick={async () => {
                  if (!supabase) { closeModal(); return; }
                  const errEl = document.getElementById("login-error");
                  if (errEl) errEl.style.display = "none";
                  const { data, error } = await supabase.auth.signInWithPassword({ email: fv.em || "", password: fv.pw || "" });
                  if (error) {
                    if (errEl) { errEl.textContent = error.message; errEl.style.display = "block"; }
                  } else {
                    setCurrentUser(data.user);
                    if (data.user) loadMemberData(data.user);
                    closeModal(); setPage("portal");
                    showToast("Welcome back to Monarc Priv\u00e9");
                  }
                }}>Sign In</button>
                <div className="sw">No account? <span onClick={() => openModal("join")}>Apply for membership</span></div>
              </div>
            </>}
            {modal === "join" && <>
              <div className="mh"><button className="mc" onClick={closeModal}>\u2715</button><div className="me">Membership Application</div><div className="mt">Create your account</div><div className="ms">Step 1 of 3</div></div>
              <div className="mbd">
                <div className="r2">
                  <div className="fg"><label className="fl">First Name</label><input className="fi" placeholder="First" onChange={field("fn")} /></div>
                  <div className="fg"><label className="fl">Last Name</label><input className="fi" placeholder="Last" onChange={field("ln")} /></div>
                </div>
                <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="your@email.com" onChange={field("em")} /></div>
                <div className="fg"><label className="fl">Phone</label><input className="fi" type="tel" placeholder="+1 (555) 000-0000" autoComplete="tel" onChange={field("ph")} /></div>
                <div className="fg"><label className="fl">Password</label><input className="fi" type="password" placeholder="Min. 8 characters" onChange={field("pw")} /></div>
                <button className="btnf" onClick={() => { setFv(p => ({ ...p, _signupReady: true })); openModal("questionnaire"); }}>Continue to Questions \u2192</button>
                <div className="sw">Already a member? <span onClick={() => openModal("login")}>Sign in</span></div>
              </div>
            </>}
            {modal === "questionnaire" && <>
              <div className="mh"><button className="mc" onClick={closeModal}>\u2715</button><div className="me">Step 2 of 3</div><div className="mt">A few quick questions</div><div className="ms">So we can personalize your experience</div></div>
              <div className="mbd">
                <div className="qp">{QUESTIONS.map((_, i) => <div key={i} className={`qd${i <= qStep ? " on" : ""}`} />)}</div>
                <div className="qq">{QUESTIONS[qStep].q}</div>
                <div className="qo">{QUESTIONS[qStep].opts.map(o => (
                  <div key={o} className={`qopt${qAns[qStep] === o ? " s" : ""}`} onClick={() => {
                    setQAns(p => ({ ...p, [qStep]: o }));
                    setTimeout(() => { if (qStep < QUESTIONS.length - 1) setQStep(s => s + 1); else openModal("payment"); }, 280);
                  }}>
                    <span className="qot">{o}</span>
                    <div className="qr"><div className="qrd" /></div>
                  </div>
                ))}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 13 }}>
                  <button onClick={() => qStep > 0 && setQStep(s => s - 1)} style={{ background: "none", border: "none", color: "var(--taupe)", fontSize: ".58rem", letterSpacing: ".15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--sans)", opacity: qStep > 0 ? 1 : 0 }}>\u2190 Back</button>
                  <span style={{ fontSize: ".56rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--taupe)" }}>{qStep + 1} of {QUESTIONS.length}</span>
                </div>
              </div>
            </>}
            {modal === "payment" && <>
              <div className="mh"><button className="mc" onClick={closeModal}>\u2715</button><div className="me">Step 3 of 3</div><div className="mt">Complete membership</div><div className="ms">Annual access \u2014 cancel anytime</div></div>
              <div className="mbd">
                <div className="ps">
                  <div className="pr"><span>Monarc Priv\u00e9 Annual Membership</span><span>$300.00</span></div>
                  <div className="pr"><span>Platform fee</span><span>$0.00</span></div>
                  <div className="pr pt"><span>Total due today</span><span>$300.00</span></div>
                </div>
                {paymentError && <div style={{ fontSize: ".68rem", color: "var(--red)", padding: "8px 12px", background: "rgba(224,82,82,.08)", border: "1px solid rgba(224,82,82,.2)", borderRadius: 2, marginBottom: 12 }}>{paymentError}</div>}
                <div className="fg"><label className="fl">Cardholder Name</label><input className="fi" placeholder="Name on card" onChange={field("cn")} /></div>
                <div className="fg"><label className="fl">Card Number</label>
                  <input className="fi" placeholder="4242 4242 4242 4242" maxLength={19} onChange={e => { let v = e.target.value.replace(/\D/g, "").substring(0, 16); v = v.replace(/(.{4})/g, "$1 ").trim(); e.target.value = v; field("num")(e); }} />
                </div>
                <div className="r2">
                  <div className="fg"><label className="fl">Expiry</label><input className="fi" placeholder="MM / YY" maxLength={7} onChange={e => { let v = e.target.value.replace(/\D/g, ""); if (v.length >= 2) v = v.substring(0, 2) + " / " + v.substring(2, 4); e.target.value = v; field("exp")(e); }} /></div>
                  <div className="fg"><label className="fl">CVC</label><input className="fi" placeholder="\u2022\u2022\u2022" maxLength={4} onChange={field("cvc")} /></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "10px 0 4px", fontSize: ".54rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--taupe)" }}><span style={{ color: "var(--green)" }}>\u25cf</span>256-bit SSL \u00b7 Stripe Secured</div>
                <div style={{ fontSize: ".62rem", color: "var(--t3)", marginBottom: 12, fontWeight: 300, lineHeight: 1.6 }}>Test card: 4242 4242 4242 4242 \u00b7 Any future expiry \u00b7 Any CVC</div>
                <button className="btnf" style={{ marginTop: 4 }} disabled={stripeLoading} onClick={async () => {
                  setStripeLoading(true); setPaymentError("");
                  const email = fv.em || "", firstName = fv.fn || "", lastName = fv.ln || "", phone = fv.ph || "", password = fv.pw || "", fullName = `${firstName} ${lastName}`.trim();
                  try {
                    if (supabase && email && password) {
                      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { first_name: firstName, last_name: lastName, full_name: fullName, phone } } });
                      if (authError && !authError.message.includes("already registered")) throw new Error(authError.message);
                      const memberRef = "MP-" + Math.random().toString(36).substr(2, 8).toUpperCase();
                      await db(sb => sb.from("memberships").insert({ user_id: authData?.user?.id, email, first_name: firstName, last_name: lastName, full_name: fullName, phone, tier: "curated", status: "active", amount_paid: 300, questionnaire_answers: qAns, expires_at: new Date(Date.now() + 365 * 86400000).toISOString(), referral_code: memberRef }));
                      if (authData?.user) { setCurrentUser(authData.user); await loadMemberData(authData.user); }
                    }
                    await sendWelcomeEmail(email, firstName, "curated");
                    setStripeLoading(false);
                    openModal("success");
                    showToast(`Welcome to Monarc Priv\u00e9, ${firstName}! Your membership is active.`);
                  } catch (err) { setStripeLoading(false); setPaymentError(err.message || "Something went wrong. Please try again."); }
                }}>{stripeLoading ? "Activating..." : "Activate Membership \u2014 $300"}</button>
              </div>
            </>}
            {modal === "concierge" && <>
              <div className="mh"><button className="mc" onClick={closeModal}>\u2715</button><div className="me">Concierge Request</div><div className="mt">{mData.name}</div><div className="ms">{mData.type} \u00b7 {mData.price}</div></div>
              <div className="mbd">
                <div style={{ fontSize: ".76rem", color: "var(--t2)", fontWeight: 300, lineHeight: 1.8, marginBottom: 18, padding: "12px 14px", background: "rgba(201,169,110,.05)", border: "1px solid rgba(201,169,110,.12)", borderRadius: 2 }}>
                  Sterling, your AI concierge, will confirm availability and arrange all details within 2 hours of your request.
                </div>
                <div className="fg"><label className="fl">Preferred Date</label><input className="fi" type="date" onChange={field("cdate")} /></div>
                <div className="fg"><label className="fl">Number of Guests</label><input className="fi" type="number" placeholder="2" onChange={field("cguests")} /></div>
                <div className="fg"><label className="fl">Special Requests</label><textarea className="fit" rows={3} placeholder="Any specific preferences or requirements..." onChange={field("cnote")} /></div>
                <button className="btnf" onClick={async () => {
                  await db(sb => sb.from("concierge_requests").insert({ guest_id: currentUser?.id || null, service_type: mData.type || mData.name, description: mData.name, requested_date: fv.cdate || null, num_guests: parseInt(fv.cguests) || 1, special_notes: fv.cnote || "", status: "requested" }));
                  closeModal();
                  showToast(`Request submitted \u2014 Sterling will confirm your ${mData.name} within 2 hours.`);
                }}>Submit Request</button>
              </div>
            </>}
            {modal === "book" && <>
              <div className="mh"><button className="mc" onClick={closeModal}>\u2715</button><div className="me">Booking Request</div><div className="mt">{mData.name || "Request to Book"}</div><div className="ms">{mData.area} \u00b7 ${mData.price?.toLocaleString()}/night</div></div>
              <div className="mbd">
                <div className="r2">
                  <div className="fg"><label className="fl">Check-in</label><input className="fi" type="date" onChange={field("ci")} /></div>
                  <div className="fg"><label className="fl">Check-out</label><input className="fi" type="date" onChange={field("co")} /></div>
                </div>
                <div className="r2">
                  <div className="fg"><label className="fl">Total Guests</label><input className="fi" type="number" placeholder={`Max ${mData.guests || 12}`} onChange={field("gc")} /></div>
                  <div className="fg"><label className="fl">Children Under 12</label><input className="fi" type="number" min="0" placeholder="0" onChange={field("children")} /></div>
                </div>
                <div className="r2">
                  <div className="fg"><label className="fl">Pets</label><select className="fis" onChange={field("pets")}><option value="">No pets</option><option>Dog (small)</option><option>Dog (large)</option><option>Cat</option><option>Multiple pets</option></select></div>
                  <div className="fg"><label className="fl">Trip Type</label><select className="fis" onChange={field("tt")}><option>Stay only</option><option>Event</option><option>Stay + Event</option><option>Corporate Retreat</option><option>Celebration</option></select></div>
                </div>
                <div className="fg"><label className="fl">Occasion</label><input className="fi" placeholder="e.g. Anniversary, birthday, family reunion..." onChange={field("occasion")} /></div>
                <div className="fg"><label className="fl">Special Requests</label><textarea className="fit" rows={3} placeholder="Arrival time, dietary needs, anything we should arrange..." onChange={field("note")} /></div>
                <button className="btnf" onClick={async () => {
                  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
                  await db(sb => sb.from("bookings").insert({
                    property_id: mData.id ? String(mData.id) : null,
                    guest_id: user?.id || null,
                    check_in: fv.ci || null,
                    check_out: fv.co || null,
                    num_guests: parseInt(fv.gc) || 1,
                    num_nights: fv.ci && fv.co ? Math.ceil((new Date(fv.co) - new Date(fv.ci)) / (1000 * 60 * 60 * 24)) : 1,
                    trip_type: fv.tt === "Event" ? "event" : fv.tt === "Stay + Event" ? "stay_event" : "stay",
                    occasion: fv.occasion || "",
                    pets: fv.pets || "",
                    num_children: parseInt(fv.children) || 0,
                    special_requests: fv.note || "",
                    nightly_rate: mData.price || 0,
                    subtotal: (mData.price || 0) * (fv.ci && fv.co ? Math.ceil((new Date(fv.co) - new Date(fv.ci)) / (1000 * 60 * 60 * 24)) : 1),
                    total: (mData.price || 0) * (fv.ci && fv.co ? Math.ceil((new Date(fv.co) - new Date(fv.ci)) / (1000 * 60 * 60 * 24)) : 1),
                    status: "pending",
                  }));
                  openModal("success");
                }}>Submit Request</button>
              </div>
            </>}
            {modal === "success" && <>
              <div className="mh"><div className="me">Monarc Prive</div></div>
              <div className="mbd">
                <div className="sc">
                  <span className="si">\u25c8</span>
                  <div className="stit">Welcome to Monarc Prive</div>
                  <p className="ssub">Your membership is active. You now have access to all 6 estates, our full luxury partner network, and your AI concierge Sterling is ready.</p>
                  <div className="sref">MP-{Math.random().toString(36).substr(2, 8).toUpperCase()}</div>
                  <button className="btnf" onClick={() => { closeModal(); setPage("portal"); }}>Enter Your Member Portal \u2192</button>
                </div>
              </div>
            </>}
            {modal === "invite" && <>
              <div className="mh"><button className="mc" onClick={closeModal}>\u2715</button><div className="me">Founding Membership</div><div className="mt">Request an Invitation</div><div className="ms">Limited to 50 founding members worldwide</div></div>
              <div className="mbd">
                <div style={{ background: "rgba(201,169,110,.06)", border: "1px solid rgba(201,169,110,.15)", borderRadius: 2, padding: 14, marginBottom: 18, fontSize: ".74rem", color: "var(--t2)", fontWeight: 300, lineHeight: 1.7 }}>Founding membership is by invitation only. Our team will review your application personally within 48 hours.</div>
                <div className="r2">
                  <div className="fg"><label className="fl">First Name</label><input className="fi" placeholder="First" onChange={field("fn")} /></div>
                  <div className="fg"><label className="fl">Last Name</label><input className="fi" placeholder="Last" onChange={field("ln")} /></div>
                </div>
                <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="your@email.com" onChange={field("em")} /></div>
                <div className="fg"><label className="fl">Phone</label><input className="fi" type="tel" placeholder="+1 (555) 000-0000" onChange={field("ph")} /></div>
                <div className="fg"><label className="fl">How did you hear about Monarc Priv\u00e9?</label><input className="fi" placeholder="Referral, social media, etc." onChange={field("ref")} /></div>
                <div className="fg"><label className="fl">Tell us about yourself (optional)</label><textarea className="fit" rows={3} placeholder="Your background, travel habits, what brings you to Scottsdale..." onChange={field("bio")} /></div>
                <button className="btnf" onClick={async () => {
                  await db(sb => sb.from("invitation_requests").insert({ first_name: fv.fn || "", last_name: fv.ln || "", email: fv.em || "", phone: fv.ph || "", referral: fv.ref || "", bio: fv.bio || "", status: "pending" }));
                  openModal("success");
                }}>Submit Invitation Request</button>
              </div>
            </>}
            {modal === "success-listing" && <>
              <div className="mh"><div className="me">Monarc Prive</div></div>
              <div className="mbd">
                <div className="sc">
                  <span className="si">\u25c8</span>
                  <div className="stit">Application Submitted</div>
                  <p className="ssub">Your {mData.stream?.label || "listing"} application has been received. Our team will review within 24-48 hours. Billing of {mData.stream?.price || "the monthly fee"} begins upon approval.</p>
                  <div className="sref">REF \u00b7 MP-{Math.random().toString(36).substr(2, 8).toUpperCase()}</div>
                  <button className="btnf" onClick={closeModal}>Done</button>
                </div>
              </div>
            </>}
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, background: "var(--ink-s)", border: `1px solid ${toast.type === "error" ? "rgba(224,82,82,.28)" : "rgba(91,175,132,.3)"}`, borderRadius: 3, padding: "13px 18px", display: "flex", alignItems: "center", gap: 12, minWidth: 280, maxWidth: 400, boxShadow: "0 8px 32px rgba(0,0,0,.4)", animation: "slideDown .3s cubic-bezier(.22,.68,0,1.2)" }}>
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>{toast.type === "error" ? "\u2715" : "\u2713"}</span>
          <span style={{ fontSize: ".78rem", color: "var(--t1)", fontWeight: 300, lineHeight: 1.5 }}>{toast.msg}</span>
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "var(--t3)", cursor: "pointer", marginLeft: "auto", fontSize: ".8rem", flexShrink: 0 }}>\u2715</button>
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
      `}</style>
    </>
  );
}
