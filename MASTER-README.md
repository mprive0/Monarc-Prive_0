# MONARC PRIVÉ — COMPLETE PRODUCTION SYSTEM
## Master Launch Guide & File Reference

---

## COMPLETE FILE MANIFEST (35 files)

### FRONTEND PAGES (React JSX)
| File | Route | Description |
|------|-------|-------------|
| `monarc-membership.jsx` | `/` | Landing page + member portal ($300/yr flow) |
| `monarc-partner-hub.jsx` | `/partners` | Property listings, agents, experiences |
| `monarc-agents.jsx` | `/admin` | AI command center (owner only) |
| `AdminHub.jsx` | `/admin/dashboard` | Full admin panel: approvals, bookings, revenue |
| `monarc-prive.jsx` | `/portal` | Guest-facing property browser |
| `ConciergeWidget.jsx` | Embed anywhere | Floating Sterling AI chat bubble |

### FRONTEND INFRASTRUCTURE
| File | Purpose |
|------|---------|
| `App.jsx` | Router — connects all pages |
| `main.tsx` | React entry point |
| `index.html` | HTML shell with SEO meta tags |
| `globals.css` | Design system — all CSS variables, components |
| `supabase-client.js` | Database & auth helpers |
| `stripe-client.js` | Payment helpers |
| `api-client.js` | Backend API calls |
| `LoadingScreen.jsx` | Luxury loading animation |
| `StripePayment.jsx` | Real Stripe Elements component |

### BUILD & DEPLOY CONFIG
| File | Purpose |
|------|---------|
| `frontend-package.json` | Frontend npm dependencies |
| `vite.config.ts` | Vite bundler config |
| `tsconfig.json` | TypeScript config (frontend) |
| `vercel.json` | Vercel deployment config |
| `render.yaml` | Render backend service config |
| `github-deploy.yml` | CI/CD auto-deploy pipeline |

### BACKEND (Node.js + TypeScript)
| File | Purpose |
|------|---------|
| `server-index.ts` | Complete API server (all routes) |
| `agent-prompts.ts` | All 5 AI agent system prompts |
| `stripe-webhooks.ts` | Stripe event handler |
| `server-package.json` | Backend npm dependencies |
| `server-tsconfig.json` | TypeScript config (backend) |

### DATABASE
| File | Purpose |
|------|---------|
| `complete-schema.sql` | ✅ USE THIS — all tables, indexes, RLS, triggers |
| `supabase-schema.sql` | (older version — superseded) |
| `partner-schema.sql` | (merged into complete-schema.sql) |
| `membership-schema-additions.sql` | (merged into complete-schema.sql) |

### CONFIGURATION
| File | Purpose |
|------|---------|
| `env-complete.txt` | ALL environment variables with setup instructions |
| `README.md` | This file |
| `REVENUE-MODEL-TODO.md` | Revenue model + what to build next |
| `YOUR-TODO-LIST.md` | Step-by-step deployment todo |

---

## FOLDER STRUCTURE (how to organize your project)

```
monarc-prive/
├── index.html                    ← copy from outputs
├── package.json                  ← copy frontend-package.json
├── vite.config.ts                ← copy from outputs
├── tsconfig.json                 ← copy from outputs
├── vercel.json                   ← copy from outputs
├── render.yaml                   ← copy from outputs
├── .env                          ← copy env-complete.txt, fill in values
├── .gitignore                    ← create (see below)
├── .github/
│   └── workflows/
│       └── deploy.yml            ← copy github-deploy.yml
│
├── src/
│   ├── main.tsx                  ← copy from outputs
│   ├── App.jsx                   ← copy from outputs
│   ├── styles/
│   │   └── globals.css           ← copy from outputs
│   ├── lib/
│   │   ├── supabase.js           ← copy supabase-client.js
│   │   ├── stripe.js             ← copy stripe-client.js
│   │   └── api.js                ← copy api-client.js
│   ├── pages/
│   │   ├── LandingPage.jsx       ← copy monarc-membership.jsx, rename
│   │   ├── MemberPortal.jsx      ← extract from monarc-membership.jsx
│   │   ├── PartnerHub.jsx        ← copy monarc-partner-hub.jsx
│   │   ├── AdminHub.jsx          ← copy from outputs
│   │   └── PropertyDetail.jsx    ← stub (see below)
│   └── components/
│       ├── LoadingScreen.jsx     ← copy from outputs
│       ├── ConciergeWidget.jsx   ← copy from outputs
│       └── StripePayment.jsx     ← copy from outputs
│
├── server/
│   ├── package.json              ← copy server-package.json
│   ├── tsconfig.json             ← copy server-tsconfig.json
│   ├── index.ts                  ← copy server-index.ts
│   ├── agents/
│   │   └── prompts.ts            ← copy agent-prompts.ts
│   └── webhooks/
│       └── stripe.ts             ← copy stripe-webhooks.ts
│
└── supabase/
    └── schema.sql                ← copy complete-schema.sql
```

---

## QUICK START — GO LIVE TODAY

### Step 1: Create accounts (30 min total)
- [ ] Supabase: supabase.com → New Project → US West
- [ ] Anthropic: console.anthropic.com → API Keys → Create
- [ ] Stripe: dashboard.stripe.com → Create account + verify
- [ ] SendGrid: app.sendgrid.com → Create + verify domain
- [ ] Render: render.com → Create account
- [ ] Vercel: vercel.com → Create account
- [ ] Namecheap: namecheap.com → Buy monarcprive.com (~$12)

### Step 2: Database (10 min)
```
1. Supabase Dashboard → SQL Editor
2. Paste: complete-schema.sql
3. Click Run
4. Settings → API → copy URL, anon key, service key
```

### Step 3: Stripe Products (15 min)
```
Create in Stripe → Products → Add Product:
1. "Curated Membership"   → $300 one-time       → copy Price ID
2. "Private Membership"   → $750 one-time        → copy Price ID
3. "Property Listing"     → $25/mo recurring     → copy Price ID
4. "Agent Advertisement"  → $50/mo recurring     → copy Price ID
5. "Experience Listing"   → $100/mo recurring    → copy Price ID

Create Webhook:
URL: https://YOUR-API.onrender.com/api/webhooks/stripe
Events: payment_intent.succeeded, customer.subscription.created,
        customer.subscription.deleted, charge.dispute.created
Copy webhook secret
```

### Step 4: Set up project locally (5 min)
```bash
# Frontend
npm create vite@latest monarc-prive -- --template react
cd monarc-prive
# Copy all src files from outputs folder
npm install
cp env-complete.txt .env
# Fill in .env with all your keys

# Backend  
mkdir server && cd server
# Copy server files from outputs folder
npm install
# Create server/.env with backend keys
```

### Step 5: Deploy backend to Render (10 min)
```
1. Push code to GitHub (git init, git add ., git commit, git push)
2. render.com → New → Web Service → connect GitHub
3. Root directory: server
4. Build: npm install && npm run build
5. Start: node dist/index.js
6. Add all env vars from env-complete.txt [BACKEND section]
7. Deploy → copy your URL (e.g. https://monarc-api.onrender.com)
8. Update VITE_API_URL in your .env
```

### Step 6: Deploy frontend to Vercel (5 min)
```
1. vercel.com → New Project → Import GitHub repo
2. Framework: Vite
3. Add all VITE_ env vars
4. Deploy → copy URL
5. Settings → Domains → Add monarcprive.com
6. Update DNS at Namecheap per Vercel instructions
```

### Step 7: Test everything (20 min)
```
✓ Visit site → splash screen loads
✓ "Apply for Membership" → questionnaire → payment (test card: 4242 4242 4242 4242)
✓ Member portal loads after payment
✓ Sterling AI chat responds
✓ /partners → list a property form works
✓ /admin → admin dashboard shows stats
✓ Email received after payment
✓ Check Render logs: no errors
✓ Check Supabase: memberships table has entry
```

---

## YOUR REVENUE STREAMS — WHAT CHARGES WHAT

| Action | Who Pays | Amount | Where Set Up |
|--------|----------|--------|-------------|
| Member signup | Guest | $300–1,500/yr | Stripe one-time payment |
| Property listing | Host | $25/mo | Stripe subscription |
| Guest booking fee | Guest | 3% of booking total | Calculated in server |
| Host payout fee | Host | 3% deducted from payout | Calculated in server |
| Agent ad | Agent | $50/mo | Stripe subscription |
| Experience listing | Business | $100/mo | Stripe subscription |

---

## THE 5 AI AGENTS — WHAT THEY DO

| Agent | Talks To | Runs Automatically |
|-------|----------|-------------------|
| Aria (Sales) | You (owner) | Weekly report Monday 8am MST |
| Celeste (Marketing) | You (owner) | Weekly report Monday 8am MST |
| Sterling (Concierge) | Guests | 24/7 via chat widget |
| Atlas (Operations) | You (owner) | Weekly report Monday 8am MST |
| Orion (Analytics) | You (owner) | Weekly report Monday 8am MST |

**You do nothing** — Aria, Celeste, Atlas, and Orion send reports to your email every Monday morning. Sterling handles guests around the clock.

---

## .gitignore (create this file)
```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
server/dist/
```

---

## MONTHLY COSTS AT LAUNCH

| Service | Cost |
|---------|------|
| Vercel Hobby | Free |
| Render Starter | $7/mo |
| Supabase Free | Free |
| SendGrid Free | Free (100 emails/day) |
| Anthropic API | ~$10–30/mo |
| Domain | $1/mo |
| **Total** | **~$18–38/mo** |

**First 10 members = $3,000/yr = covers 6+ years of hosting costs.**

---

*Monarc Privé · Complete Production System · Built April 2026*
