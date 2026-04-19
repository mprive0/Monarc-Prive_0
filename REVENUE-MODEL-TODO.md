# ═══════════════════════════════════════════════════════════
# MONARC PRIVÉ — COMPLETE REVENUE MODEL & MASTER TODO
# Updated with all 5 revenue streams
# ═══════════════════════════════════════════════════════════

## YOUR COMPLETE REVENUE MODEL

### 5 Revenue Streams

| Stream | Price | Type | Notes |
|--------|-------|------|-------|
| 🔑 Guest Membership | $300/yr | Annual subscription | Already built |
| 🏡 Property Listings | $25/mo | Monthly recurring | NEW |
| 📊 Booking Fee (Guest) | 3% per booking | Transaction fee | NEW |
| 💰 Booking Fee (Host) | 3% per payout | Transaction fee | NEW |
| 🏢 Agent Ads | $50/mo | Monthly recurring | NEW |
| ✨ Experience Listings | $100/mo | Monthly recurring | NEW |

---

### Revenue Math — Conservative Year 1

| Scenario | Members | Props | Agents | Exp | Monthly |
|----------|---------|-------|--------|-----|---------|
| **Launch** | 25 | 6 | 6 | 6 | ~$1,475 |
| **Month 3** | 75 | 12 | 10 | 10 | ~$3,875 |
| **Month 6** | 150 | 20 | 15 | 15 | ~$7,375 |
| **Month 12** | 300 | 40 | 25 | 20 | ~$14,625 |

**Monthly Recurring Revenue at 40 Properties, 25 Agents, 20 Experiences, 300 Members:**
- 300 memberships × $25/mo = $7,500
- 40 properties × $25/mo = $1,000
- 25 agents × $50/mo = $1,250
- 20 experiences × $100/mo = $2,000
- **Base MRR = $11,750/mo = $141,000/yr**

**Plus booking fees** (40 properties, 50% occupancy, $2,500 avg rate, 3-night avg):
- 40 props × 15 bookings/yr = 600 bookings/yr
- 600 × $7,500 avg booking = $4.5M GMV
- 3% from guest + 3% from host = 6% platform take
- **Booking revenue = $270,000/yr**

**Combined Year 1 conservative:** ~$400,000+

---

## ALL FILES DELIVERED

| File | What it is |
|------|------------|
| `monarc-membership.jsx` | Complete landing page + member portal ($300/yr) |
| `monarc-partner-hub.jsx` | Property listings, agent cards, experiences |
| `monarc-agents.jsx` | Owner AI command center (Aria, Celeste, etc.) |
| `server-index.ts` | Express API backend |
| `agent-prompts.ts` | All 5 AI agent system prompts |
| `supabase-schema.sql` | Core database tables |
| `partner-schema.sql` | Partner Hub tables (NEW) |
| `membership-schema-additions.sql` | Membership table |
| `StripePayment.jsx` | Real Stripe payment component |
| `stripe-webhooks.ts` | Stripe webhook handler |
| `env-example.txt` | All environment variables |
| `server-package.json` | Backend dependencies |
| `README.md` | Full deployment guide |

---

## HOW THE PAGES CONNECT

```
monarcprive.com/              → monarc-membership.jsx  (landing + member portal)
monarcprive.com/partners      → monarc-partner-hub.jsx (list property/agent/exp)
monarcprive.com/admin         → monarc-agents.jsx      (your AI command center)
```

---

## UPDATED TODO LIST

### Already done from before ✅
- [x] Landing page with splash, hero, reviews, tiers
- [x] $300/yr membership flow (register → questionnaire → pay → portal)
- [x] Member portal with AI concierge Sterling
- [x] 5 AI agents (Aria, Celeste, Sterling, Atlas, Orion)
- [x] Weekly auto-reports to your email every Monday
- [x] Supabase schema, Stripe webhooks, backend API

### New this build ✅
- [x] Property listing flow ($25/mo, 4-step form)
- [x] Agent advertisement cards ($50/mo, 3-step form)
- [x] Experience/event listings ($100/mo, 3-step form)
- [x] Revenue calculator with all 5 streams
- [x] Filter/search on all three listing types
- [x] Partner schema SQL for Supabase
- [x] Booking fee tracking (3% guest + 3% host)

---

## WHAT YOU STILL NEED TO DO

### Priority 1 — Connect real Stripe subscriptions (1-2 days)

The payment forms currently collect card info but need Stripe Subscription
API to actually charge monthly recurring fees.

In Stripe Dashboard, create 3 Products:
1. "Monarc Privé Property Listing" — $25/month recurring
2. "Monarc Privé Agent Advertisement" — $50/month recurring  
3. "Monarc Privé Experience Listing" — $100/month recurring

Then in server/index.ts, add subscription creation endpoint:
```
POST /api/subscriptions/create
  body: { priceId, email, name, type }
  → creates Stripe customer + subscription
  → saves to Supabase host_listings/agent_listings/experience_listings
  → sends welcome email
  → status = "pending" until admin approves
```

### Priority 2 — Admin approval workflow (1 day)

Add to your admin panel (monarc-agents.jsx or a separate admin page):
- View pending listings (properties, agents, experiences)
- Approve / Reject with one click
- Approval email sent automatically
- Status updates in Supabase

### Priority 3 — Photo uploads (1 day)

Connect the upload zones to Supabase Storage:
```javascript
const { data, error } = await supabase.storage
  .from('property-images')
  .upload(`${listingId}/${file.name}`, file);
```

### Priority 4 — Link partner hub to main site (2 hours)

Add navigation between membership site and partner hub:
- In monarc-membership.jsx footer: add "List Your Property" link → /partners
- In monarc-partner-hub.jsx nav: "← Back to Site" already works

### Priority 5 — Route setup (2 hours)

In your React app (App.jsx), add routing:
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// npm install react-router-dom

<Routes>
  <Route path="/" element={<MonarcMembership />} />
  <Route path="/partners" element={<PartnerHub />} />
  <Route path="/admin" element={<MonarcAgentHub />} />
</Routes>
```

---

## ANSWER TO "IS THAT ALL?"

No — here's what you might want to add next:

### Revenue you're leaving on the table

1. **Concierge service markups** — You're passing through chef/spa/transport
   at cost. Mark up 15–20% and keep the difference. Easy $10–30K/yr.

2. **Event surcharge** — Properties hosting events could pay an additional
   $500–2,000 event approval fee on top of the booking commission.

3. **Featured placement** — Charge properties/agents/experiences an extra
   $50–100/mo for top-of-page placement. Pure margin.

4. **Annual partner packages** — Discount 10% for annual prepay on agent/
   experience listings. Improves cash flow predictability.

5. **Corporate memberships** — $2,500/yr for a company account with 5 logins.
   Target wealth management firms, law firms, medical practices.

6. **Referral program** — Members earn $50 credit for each referral.
   Viral growth engine.

---

*Monarc Privé · Complete Revenue Platform · Scottsdale, AZ*
