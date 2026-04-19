import { useState, useEffect, useRef } from "react";

// ─── AGENT DEFINITIONS ───────────────────────────────────────────────────────

const AGENTS = {
  sales: {
    id: "sales",
    name: "Aria",
    title: "Sales & Revenue Agent",
    role: "sales",
    avatar: "◈",
    color: "#C9A96E",
    status: "active",
    systemPrompt: `You are Aria, the elite Sales & Revenue Intelligence Agent for Monarc Privé — a luxury real estate rental marketplace in Scottsdale, Paradise Valley, and North Scottsdale.

Your responsibilities:
- Analyze booking trends, conversion rates, and revenue performance
- Identify high-value leads and guest segments
- Generate weekly sales performance reports
- Suggest dynamic pricing strategies for peak/off-peak periods
- Identify underperforming listings and recommend improvements
- Track competitor intelligence in the luxury Scottsdale market
- Score and qualify inbound booking inquiries
- Suggest upsell opportunities (concierge, extended stays, event packages)

Weekly Report Format: Always provide structured reports with: Executive Summary, Key Metrics (bookings, revenue, conversion rate, avg booking value), Top Performers, Risk Flags, and Next Week Priorities.

Tone: Executive, data-driven, direct. You speak like a Chief Revenue Officer. Always quantify. Always prioritize. Reference specific properties by name (Casa del Cielo, Ironwood Estate, Hacienda Serena, Monolith Modern, Camelback Retreat, Desert Glass House). Current nightly rates range $1,650–$5,800.`,
    description: "Revenue intelligence, pricing strategy & sales optimization",
    capabilities: ["Weekly Revenue Reports", "Pricing Strategy", "Lead Scoring", "Conversion Analysis", "Competitive Intel"],
  },
  marketing: {
    id: "marketing",
    name: "Celeste",
    title: "Marketing & Brand Agent",
    role: "marketing",
    avatar: "◉",
    color: "#9E8E78",
    status: "active",
    systemPrompt: `You are Celeste, the Brand & Marketing Intelligence Agent for Monarc Privé — a luxury real estate rental marketplace positioned above Airbnb and VRBO in the Scottsdale market.

Your responsibilities:
- Generate campaign ideas for Instagram, email, and paid media
- Write luxury-tier copy for property listings, ads, emails, and social posts
- Analyze guest personas and recommend targeting strategies
- Suggest seasonal campaigns (golf season, spring events, summer retreats)
- Create content calendars
- Monitor brand perception and suggest reputation strategies
- Generate email sequences for guest nurturing, re-engagement, post-stay
- Write SEO-optimized property descriptions
- Suggest influencer/partnership opportunities in the luxury travel space

Tone: Editorial, aspirational, sophisticated. You write like a Condé Nast editor meets a luxury brand strategist. Avoid generic travel language. Use sensory, emotional, evocative language. Always match the Monarc Privé brand voice: quiet luxury, editorial, minimal, exclusive.

Key brand pillars: Exclusivity, Trust, Elegance, Ease, Curation, Discretion.`,
    description: "Brand campaigns, copy, content strategy & guest acquisition",
    capabilities: ["Campaign Creation", "Luxury Copywriting", "Email Sequences", "Social Content", "SEO Descriptions"],
  },
  concierge: {
    id: "concierge",
    name: "Sterling",
    title: "Guest Concierge Agent",
    role: "concierge",
    avatar: "◌",
    color: "#C9A96E",
    status: "active",
    systemPrompt: `You are Sterling, the AI Guest Concierge for Monarc Privé — a luxury real estate rental marketplace in Scottsdale, Paradise Valley, and North Scottsdale.

You assist guests with the highest level of personalized service. Your responsibilities:
- Answer questions about properties (amenities, policies, location, access)
- Handle booking inquiries with grace and precision
- Recommend concierge services: private chef, airport transfer, spa, grocery stocking, security, event planning, car service
- Suggest local luxury experiences: restaurants, golf courses, spas, nightlife, shopping
- Handle special requests with creativity and discretion
- Provide check-in instructions and property details
- Recommend properties based on guest needs and group size
- Assist with event planning for villa events
- Provide weather, local tips, and Scottsdale insider knowledge

Properties available:
- Casa del Cielo (Paradise Valley) — $2,800/night, 6bd/7ba, sleeps 14, event-ready
- The Ironwood Estate (N. Scottsdale) — $4,200/night, 8bd/9ba, sleeps 20, event-ready
- Hacienda Serena (Scottsdale) — $1,650/night, 4bd/4.5ba, sleeps 8, wellness focus
- Monolith Modern (Paradise Valley) — $3,500/night, 5bd/6ba, sleeps 10
- The Camelback Retreat (Paradise Valley) — $5,800/night, 9bd/10ba, sleeps 22, ultra-luxury
- Desert Glass House (N. Scottsdale) — $2,100/night, 4bd/5ba, sleeps 8

Tone: Warm, polished, effortlessly helpful. You are like a Four Seasons concierge — anticipate needs, never say no, always offer alternatives. Address guests by name when provided.`,
    description: "Guest support, local recommendations & concierge requests",
    capabilities: ["Property Q&A", "Booking Assistance", "Local Recommendations", "Concierge Requests", "Event Planning"],
  },
  operations: {
    id: "operations",
    name: "Atlas",
    title: "Operations & Property Agent",
    role: "operations",
    avatar: "◎",
    color: "#5C5650",
    status: "active",
    systemPrompt: `You are Atlas, the Operations & Property Intelligence Agent for Monarc Privé.

Your responsibilities:
- Monitor property readiness and flag maintenance issues
- Track host compliance and listing quality scores
- Manage vendor coordination (cleaning, maintenance, security, staging)
- Generate operational reports: occupancy rates, turnover efficiency, issue logs
- Flag high-risk bookings or policy violations
- Coordinate check-in/check-out logistics
- Monitor damage claims and security deposit status
- Track host response times and guest satisfaction signals
- Recommend process improvements
- Manage blackout dates and availability conflicts

Operational KPIs to track:
- Property readiness score (target: 98%+)
- Average turnover time (target: <4 hours)
- Host response time (target: <2 hours)
- Guest issue resolution time (target: <1 hour)
- Maintenance ticket SLA (target: <24 hours)

Tone: Precise, operational, detail-oriented. You think like a COO. Flag problems proactively. Quantify everything. Escalate urgent issues immediately.`,
    description: "Property readiness, vendor management & operational efficiency",
    capabilities: ["Property Monitoring", "Vendor Coordination", "Risk Flagging", "Ops Reports", "Host Compliance"],
  },
  analytics: {
    id: "analytics",
    name: "Orion",
    title: "Data & Analytics Agent",
    role: "analytics",
    avatar: "◍",
    color: "#9E8E78",
    status: "active",
    systemPrompt: `You are Orion, the Data & Analytics Intelligence Agent for Monarc Privé.

Your responsibilities:
- Analyze platform metrics: DAU, conversion funnels, booking velocity
- Generate weekly and monthly performance dashboards
- Identify trends in guest behavior, search patterns, and booking windows
- Provide revenue forecasting and demand modeling
- Track marketing attribution and ROI by channel
- Monitor guest satisfaction scores and review sentiment
- Build cohort analyses of repeat guests vs. new guests
- Identify seasonal demand patterns in Scottsdale luxury market
- Benchmark against industry standards
- Flag anomalies and provide root-cause analysis

Key metrics to track:
- GMV (Gross Merchandise Volume)
- Take rate (platform fee %)
- Booking conversion rate (target: 8–12% for luxury)
- Average booking window (days in advance)
- Repeat guest rate (target: 35%+)
- Revenue per available night (RevPAN)
- Host retention rate

Scottsdale luxury market context: Peak season Nov–April (golf + weather), secondary peak Jul–Aug (summer events), spring break surge in March.

Tone: Analytical, insightful, forward-looking. Present data as strategic insight, not just numbers. Always answer: so what does this mean, and what should we do?`,
    description: "Platform metrics, forecasting & strategic business intelligence",
    capabilities: ["Performance Dashboards", "Revenue Forecasting", "Funnel Analysis", "Guest Cohorts", "Market Intelligence"],
  },
};

const WEEKLY_REPORT_PROMPT = `Generate a comprehensive weekly performance report for Monarc Privé for the week of ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. 

Include:
1. EXECUTIVE SUMMARY (3-4 sentences)
2. KEY METRICS TABLE (use realistic luxury rental market numbers for a new Scottsdale platform with 6 properties)
3. TOP INSIGHTS (3-5 bullets)
4. RISK FLAGS (1-3 items)
5. NEXT WEEK PRIORITIES (3-5 action items)

Make it feel like a real executive report. Use specific numbers. Be direct and actionable.`;

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ivory: #F7F4EF;
  --cream: #EDE8DF;
  --sand: #D4C9B5;
  --taupe: #9E8E78;
  --gold: #C9A96E;
  --gold-light: #E2C896;
  --charcoal: #1A1917;
  --charcoal-mid: #2C2A27;
  --charcoal-soft: #3D3B37;
  --text-primary: #1A1917;
  --text-secondary: #5C5650;
  --text-muted: #9E8E78;
  --serif: 'Cormorant Garamond', Georgia, serif;
  --sans: 'Jost', system-ui, sans-serif;
  --green: #4CAF7D;
  --red: #E05252;
  --amber: #E8A838;
}

html, body { height: 100%; font-family: var(--sans); background: var(--charcoal); color: var(--ivory); -webkit-font-smoothing: antialiased; }

.hub {
  display: flex; height: 100vh; overflow: hidden;
  background: var(--charcoal);
}

/* ── SIDEBAR ── */
.sidebar {
  width: 260px; flex-shrink: 0;
  background: var(--charcoal-mid);
  border-right: 1px solid rgba(212,201,181,0.1);
  display: flex; flex-direction: column;
  overflow-y: auto;
}
.sidebar-logo {
  padding: 24px 20px 20px;
  border-bottom: 1px solid rgba(212,201,181,0.1);
}
.sidebar-wordmark {
  font-family: var(--serif);
  font-size: 1.2rem; font-weight: 300;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--ivory);
}
.sidebar-wordmark span { color: var(--gold); }
.sidebar-sub {
  font-size: 0.55rem; letter-spacing: 0.3em;
  text-transform: uppercase; color: var(--taupe);
  margin-top: 3px; font-weight: 400;
}
.sidebar-section { padding: 18px 0 0; }
.sidebar-section-label {
  font-size: 0.55rem; letter-spacing: 0.3em;
  text-transform: uppercase; color: var(--taupe);
  padding: 0 20px 10px; font-weight: 500;
}
.sidebar-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 20px; cursor: pointer;
  transition: all 0.15s; position: relative;
  border-left: 2px solid transparent;
}
.sidebar-item:hover { background: rgba(212,201,181,0.06); }
.sidebar-item.active {
  background: rgba(201,169,110,0.08);
  border-left-color: var(--gold);
}
.sidebar-item-icon {
  font-size: 1rem; width: 18px; text-align: center;
  flex-shrink: 0;
}
.sidebar-item-text { flex: 1; }
.sidebar-item-name {
  font-size: 0.78rem; font-weight: 500;
  color: var(--ivory); letter-spacing: 0.02em;
}
.sidebar-item.active .sidebar-item-name { color: var(--gold-light); }
.sidebar-item-role {
  font-size: 0.58rem; color: var(--taupe);
  letter-spacing: 0.08em; margin-top: 1px;
}
.sidebar-status {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--green); flex-shrink: 0;
  box-shadow: 0 0 6px rgba(76,175,125,0.5);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.sidebar-footer {
  margin-top: auto; padding: 16px 20px;
  border-top: 1px solid rgba(212,201,181,0.1);
}
.sidebar-footer-text {
  font-size: 0.6rem; letter-spacing: 0.1em;
  color: var(--taupe); line-height: 1.5;
}

/* ── MAIN ── */
.main {
  flex: 1; display: flex; flex-direction: column;
  overflow: hidden;
}
.main-header {
  padding: 20px 28px 18px;
  border-bottom: 1px solid rgba(212,201,181,0.1);
  display: flex; align-items: center; justify-content: space-between;
  flex-shrink: 0;
}
.main-header-left {}
.agent-badge {
  display: inline-flex; align-items: center; gap: 8px;
  margin-bottom: 6px;
}
.agent-badge-icon {
  font-size: 1.1rem;
}
.agent-badge-label {
  font-size: 0.58rem; letter-spacing: 0.3em;
  text-transform: uppercase; font-weight: 500;
}
.main-agent-name {
  font-family: var(--serif);
  font-size: 1.6rem; font-weight: 300;
  color: var(--ivory); letter-spacing: 0.03em;
}
.main-agent-desc {
  font-size: 0.72rem; color: var(--taupe);
  font-weight: 300; margin-top: 2px;
  letter-spacing: 0.03em;
}
.header-actions { display: flex; gap: 10px; }
.header-btn {
  background: none;
  border: 1px solid rgba(212,201,181,0.2);
  color: var(--ivory); padding: 8px 16px;
  border-radius: 2px; cursor: pointer;
  font-size: 0.62rem; letter-spacing: 0.2em;
  text-transform: uppercase; font-weight: 500;
  font-family: var(--sans);
  transition: all 0.2s;
  display: flex; align-items: center; gap: 7px;
}
.header-btn:hover { background: rgba(212,201,181,0.08); border-color: rgba(212,201,181,0.4); }
.header-btn.gold {
  background: var(--gold); border-color: var(--gold);
  color: var(--charcoal);
}
.header-btn.gold:hover { background: var(--gold-light); }

/* ── CAPABILITIES ROW ── */
.caps-row {
  display: flex; gap: 8px; padding: 14px 28px;
  border-bottom: 1px solid rgba(212,201,181,0.08);
  flex-shrink: 0; overflow-x: auto;
  scrollbar-width: none;
}
.caps-row::-webkit-scrollbar { display: none; }
.cap-chip {
  flex-shrink: 0;
  font-size: 0.58rem; letter-spacing: 0.12em;
  text-transform: uppercase; font-weight: 500;
  padding: 5px 12px; border-radius: 2px;
  border: 1px solid rgba(212,201,181,0.2);
  color: var(--taupe); cursor: pointer;
  transition: all 0.2s; white-space: nowrap;
}
.cap-chip:hover { border-color: var(--gold); color: var(--gold-light); background: rgba(201,169,110,0.06); }

/* ── MESSAGES ── */
.messages-area {
  flex: 1; overflow-y: auto;
  padding: 24px 28px;
  display: flex; flex-direction: column;
  gap: 20px;
  scrollbar-width: thin;
  scrollbar-color: rgba(212,201,181,0.2) transparent;
}
.messages-area::-webkit-scrollbar { width: 4px; }
.messages-area::-webkit-scrollbar-track { background: transparent; }
.messages-area::-webkit-scrollbar-thumb { background: rgba(212,201,181,0.2); border-radius: 2px; }

.msg {
  display: flex; gap: 14px; align-items: flex-start;
  animation: fadeUp 0.3s ease;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.msg.user { flex-direction: row-reverse; }
.msg-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; flex-shrink: 0;
  border: 1px solid rgba(212,201,181,0.2);
}
.msg-avatar.agent { background: rgba(201,169,110,0.12); }
.msg-avatar.user { background: rgba(212,201,181,0.1); }
.msg-body { max-width: 72%; }
.msg.user .msg-body { align-items: flex-end; display: flex; flex-direction: column; }
.msg-sender {
  font-size: 0.6rem; letter-spacing: 0.15em;
  text-transform: uppercase; color: var(--taupe);
  margin-bottom: 6px; font-weight: 500;
}
.msg-bubble {
  padding: 14px 18px; border-radius: 3px;
  font-size: 0.82rem; line-height: 1.75;
  font-weight: 300;
}
.msg-bubble.agent {
  background: rgba(44,42,39,0.8);
  border: 1px solid rgba(212,201,181,0.12);
  color: var(--ivory);
}
.msg-bubble.user {
  background: rgba(201,169,110,0.15);
  border: 1px solid rgba(201,169,110,0.25);
  color: var(--ivory);
}
.msg-bubble pre {
  white-space: pre-wrap; word-break: break-word;
  font-family: var(--sans); font-size: 0.82rem;
  line-height: 1.75; font-weight: 300;
}
.msg-bubble h1, .msg-bubble h2, .msg-bubble h3 {
  font-family: var(--serif); font-weight: 400;
  color: var(--gold-light); margin: 14px 0 8px;
  letter-spacing: 0.03em;
}
.msg-bubble h1 { font-size: 1.2rem; }
.msg-bubble h2 { font-size: 1rem; }
.msg-bubble h3 { font-size: 0.9rem; }
.msg-bubble strong { color: var(--gold-light); font-weight: 600; }
.msg-bubble em { color: var(--sand); font-style: italic; }
.msg-bubble hr {
  border: none; border-top: 1px solid rgba(212,201,181,0.2);
  margin: 14px 0;
}
.msg-bubble ul, .msg-bubble ol {
  padding-left: 16px; margin: 8px 0;
}
.msg-bubble li { margin-bottom: 4px; }
.msg-time {
  font-size: 0.58rem; color: var(--taupe);
  margin-top: 5px; letter-spacing: 0.05em;
}

/* ── TYPING ── */
.typing-indicator {
  display: flex; align-items: center; gap: 4px;
  padding: 12px 16px;
  background: rgba(44,42,39,0.8);
  border: 1px solid rgba(212,201,181,0.12);
  border-radius: 3px;
  width: fit-content;
}
.typing-dot {
  width: 6px; height: 6px;
  background: var(--taupe); border-radius: 50%;
  animation: typingBounce 1.2s infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes typingBounce {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(-4px); opacity: 1; }
}

/* ── INPUT ── */
.input-area {
  padding: 16px 28px 20px;
  border-top: 1px solid rgba(212,201,181,0.1);
  flex-shrink: 0;
}
.input-wrap {
  display: flex; gap: 10px; align-items: flex-end;
  background: rgba(44,42,39,0.6);
  border: 1px solid rgba(212,201,181,0.15);
  border-radius: 3px; padding: 12px 14px;
  transition: border-color 0.2s;
}
.input-wrap:focus-within { border-color: rgba(201,169,110,0.4); }
.input-field {
  flex: 1; background: none; border: none; outline: none;
  font-family: var(--sans); font-size: 0.85rem;
  color: var(--ivory); font-weight: 300;
  resize: none; min-height: 20px; max-height: 120px;
  letter-spacing: 0.02em; line-height: 1.5;
}
.input-field::placeholder { color: rgba(158,142,120,0.6); }
.send-btn {
  background: var(--gold); border: none;
  width: 34px; height: 34px; border-radius: 2px;
  cursor: pointer; display: flex;
  align-items: center; justify-content: center;
  font-size: 0.9rem; color: var(--charcoal);
  flex-shrink: 0; align-self: flex-end;
  transition: background 0.2s; font-weight: 600;
}
.send-btn:hover { background: var(--gold-light); }
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.input-hints {
  display: flex; gap: 8px; margin-top: 10px;
  flex-wrap: wrap;
}
.hint-chip {
  font-size: 0.6rem; letter-spacing: 0.1em;
  color: var(--taupe); border: 1px solid rgba(212,201,181,0.12);
  padding: 4px 10px; border-radius: 2px;
  cursor: pointer; transition: all 0.15s;
  white-space: nowrap;
}
.hint-chip:hover { color: var(--gold-light); border-color: rgba(201,169,110,0.3); }

/* ── OVERVIEW DASHBOARD ── */
.dashboard {
  flex: 1; overflow-y: auto; padding: 24px 28px;
  scrollbar-width: thin;
  scrollbar-color: rgba(212,201,181,0.2) transparent;
}
.dashboard::-webkit-scrollbar { width: 4px; }
.dash-greeting {
  margin-bottom: 28px;
}
.dash-greeting-time {
  font-size: 0.6rem; letter-spacing: 0.3em;
  text-transform: uppercase; color: var(--gold);
  margin-bottom: 6px; font-weight: 400;
}
.dash-greeting-title {
  font-family: var(--serif);
  font-size: 2rem; font-weight: 300;
  color: var(--ivory); letter-spacing: 0.02em;
}
.dash-greeting-sub {
  font-size: 0.75rem; color: var(--taupe);
  font-weight: 300; margin-top: 4px;
}
.dash-section-title {
  font-size: 0.6rem; letter-spacing: 0.3em;
  text-transform: uppercase; color: var(--taupe);
  font-weight: 500; margin-bottom: 14px;
}
.metrics-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 12px; margin-bottom: 28px;
}
.metric-card {
  background: rgba(44,42,39,0.7);
  border: 1px solid rgba(212,201,181,0.1);
  border-radius: 3px; padding: 16px;
  transition: border-color 0.2s;
}
.metric-card:hover { border-color: rgba(201,169,110,0.2); }
.metric-label {
  font-size: 0.58rem; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--taupe);
  margin-bottom: 8px; font-weight: 500;
}
.metric-value {
  font-family: var(--serif);
  font-size: 1.6rem; font-weight: 300;
  color: var(--ivory); letter-spacing: 0.02em;
}
.metric-change {
  font-size: 0.65rem; margin-top: 5px;
  font-weight: 500; letter-spacing: 0.05em;
}
.metric-change.up { color: var(--green); }
.metric-change.down { color: var(--red); }

.agents-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 12px; margin-bottom: 28px;
}
.agent-card {
  background: rgba(44,42,39,0.7);
  border: 1px solid rgba(212,201,181,0.1);
  border-radius: 3px; padding: 18px;
  cursor: pointer; transition: all 0.2s;
}
.agent-card:hover {
  border-color: rgba(201,169,110,0.3);
  background: rgba(44,42,39,0.9);
}
.agent-card-header {
  display: flex; align-items: center;
  justify-content: space-between; margin-bottom: 12px;
}
.agent-card-icon { font-size: 1.4rem; }
.agent-card-status {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.58rem; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--green);
}
.agent-card-status-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--green);
  animation: pulse 2s infinite;
}
.agent-card-name {
  font-family: var(--serif);
  font-size: 1.1rem; font-weight: 400;
  color: var(--ivory); margin-bottom: 2px;
}
.agent-card-title {
  font-size: 0.65rem; color: var(--gold);
  letter-spacing: 0.08em; margin-bottom: 10px;
}
.agent-card-desc {
  font-size: 0.7rem; color: var(--taupe);
  font-weight: 300; line-height: 1.5;
}
.agent-card-btn {
  margin-top: 14px; width: 100%;
  background: none; border: 1px solid rgba(212,201,181,0.15);
  color: var(--ivory); padding: 8px;
  border-radius: 2px; cursor: pointer;
  font-size: 0.6rem; letter-spacing: 0.2em;
  text-transform: uppercase; font-weight: 500;
  font-family: var(--sans);
  transition: all 0.2s;
}
.agent-card-btn:hover { border-color: var(--gold); color: var(--gold-light); }

.reports-list { margin-bottom: 28px; }
.report-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(212,201,181,0.08);
  cursor: pointer;
}
.report-item:hover .report-item-name { color: var(--gold-light); }
.report-icon {
  width: 36px; height: 36px;
  background: rgba(201,169,110,0.1);
  border-radius: 2px; display: flex;
  align-items: center; justify-content: center;
  font-size: 1rem; flex-shrink: 0;
}
.report-item-name {
  font-size: 0.82rem; color: var(--ivory);
  font-weight: 400; transition: color 0.2s;
}
.report-item-meta {
  font-size: 0.62rem; color: var(--taupe);
  margin-top: 2px; font-weight: 300;
}
.report-item-arrow {
  margin-left: auto; color: var(--taupe);
  font-size: 0.7rem;
}

/* ── REPORT PANEL ── */
.report-panel {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(26,25,23,0.85);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.report-modal {
  background: var(--charcoal-mid);
  border: 1px solid rgba(212,201,181,0.15);
  border-radius: 4px;
  width: 90%; max-width: 700px;
  max-height: 80vh;
  overflow: hidden; display: flex; flex-direction: column;
}
.report-modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(212,201,181,0.1);
  display: flex; align-items: center; justify-content: space-between;
}
.report-modal-title {
  font-family: var(--serif);
  font-size: 1.3rem; font-weight: 300; color: var(--ivory);
}
.report-modal-close {
  background: none; border: none; color: var(--taupe);
  cursor: pointer; font-size: 1.2rem; padding: 4px;
  transition: color 0.2s;
}
.report-modal-close:hover { color: var(--ivory); }
.report-modal-body {
  padding: 24px; overflow-y: auto; flex: 1;
  font-size: 0.82rem; line-height: 1.75;
  color: var(--ivory); font-weight: 300;
}
.report-modal-body h1, .report-modal-body h2, .report-modal-body h3 {
  font-family: var(--serif); font-weight: 400;
  color: var(--gold-light); margin: 16px 0 8px;
}
.report-modal-body strong { color: var(--gold-light); font-weight: 600; }
.report-modal-body hr {
  border: none; border-top: 1px solid rgba(212,201,181,0.15);
  margin: 14px 0;
}
.report-modal-body ul, .report-modal-body ol {
  padding-left: 18px; margin: 8px 0;
}
.report-modal-body li { margin-bottom: 5px; }

/* ── SCROLLBAR GLOBAL ── */
* { scrollbar-width: thin; scrollbar-color: rgba(212,201,181,0.15) transparent; }

/* ── MOBILE TOGGLE ── */
.sidebar-toggle {
  display: none;
  position: fixed; top: 16px; left: 16px; z-index: 300;
  background: var(--charcoal-mid);
  border: 1px solid rgba(212,201,181,0.2);
  border-radius: 2px; padding: 8px 12px;
  cursor: pointer; color: var(--ivory); font-size: 1rem;
}
@media (max-width: 768px) {
  .sidebar-toggle { display: flex; }
  .sidebar { position: fixed; left: -260px; top: 0; bottom: 0; z-index: 200; transition: left 0.3s ease; }
  .sidebar.open { left: 0; }
  .hub { flex-direction: column; }
  .metrics-grid { grid-template-columns: repeat(2,1fr); }
  .agents-grid { grid-template-columns: 1fr; }
  .main-header { padding: 64px 20px 16px; }
  .caps-row { padding: 12px 20px; }
  .messages-area { padding: 16px 20px; }
  .input-area { padding: 12px 20px 16px; }
  .dashboard { padding: 16px 20px 64px; }
}
`;

// ─── MARKDOWN RENDERER ───────────────────────────────────────────────────────

function renderMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^---+$/gm, "<hr/>")
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");
  return `<p>${html}</p>`;
}

// ─── QUICK HINTS ─────────────────────────────────────────────────────────────

const HINTS = {
  sales: [
    "Generate my weekly sales report",
    "Which property should I reprice?",
    "Score this lead: $5k budget, 10 guests, bachelorette",
    "Forecast revenue for June",
  ],
  marketing: [
    "Write an Instagram caption for Casa del Cielo",
    "Create a Mother's Day email campaign",
    "Generate 5 luxury listing headlines",
    "Plan a Q3 content calendar",
  ],
  concierge: [
    "What's the best property for a 15-person event?",
    "Recommend a private chef for this weekend",
    "What are the top golf courses near our properties?",
    "Help a guest plan a romantic anniversary stay",
  ],
  operations: [
    "Run a property readiness check",
    "Flag any booking risks this week",
    "What's our average turnover time?",
    "Create a vendor checklist for Ironwood Estate",
  ],
  analytics: [
    "What's our conversion rate this month?",
    "Show me a demand forecast for summer",
    "Analyze our repeat guest rate",
    "What's our RevPAN vs market?",
  ],
};

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function MonarcAgentHub() {
  const [activeView, setActiveView] = useState("dashboard");
  const [activeAgent, setActiveAgent] = useState(null);
  const [conversations, setConversations] = useState({});
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, isTyping]);

  const openAgent = (agentId) => {
    setActiveAgent(agentId);
    setActiveView("chat");
    setSidebarOpen(false);
    if (!conversations[agentId]) {
      const agent = AGENTS[agentId];
      setConversations(prev => ({
        ...prev,
        [agentId]: [{
          role: "assistant",
          content: getWelcomeMessage(agent),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }],
      }));
    }
  };

  const getWelcomeMessage = (agent) => {
    const messages = {
      sales: `Good ${getTimeOfDay()}. I'm **Aria**, your Sales & Revenue Intelligence Agent.\n\nI'm monitoring all 6 Monarc Privé properties and tracking booking velocity, pricing gaps, and revenue opportunities in real time.\n\nI can generate your **weekly performance report**, score incoming leads, recommend pricing adjustments, or analyze any aspect of your sales pipeline. What would you like to focus on?`,
      marketing: `Good ${getTimeOfDay()}. I'm **Celeste**, your Brand & Marketing Agent.\n\nI live and breathe the Monarc Privé brand — editorial, aspirational, quietly luxurious. I can write campaign copy, plan your content calendar, craft email sequences, or generate listing descriptions that convert at a premium.\n\nWhat would you like to create today?`,
      concierge: `Good ${getTimeOfDay()}. Welcome to Monarc Privé.\n\nI'm **Sterling**, your personal concierge. I'm here to make your Scottsdale experience exceptional — from finding the perfect estate to arranging every detail of your stay.\n\nHow may I assist you today?`,
      operations: `Good ${getTimeOfDay()}. I'm **Atlas**, your Operations Agent.\n\nAll 6 properties are currently under monitoring. I track readiness scores, vendor SLAs, booking risk flags, and host compliance — so nothing slips through.\n\nWhat would you like to review?`,
      analytics: `Good ${getTimeOfDay()}. I'm **Orion**, your Analytics & Intelligence Agent.\n\nI have full visibility into platform metrics, booking funnels, guest behavior, and market trends. I turn data into decisions.\n\nWhat would you like to analyze?`,
    };
    return messages[agent.id] || `Hello, I'm ${agent.name}. How can I help you today?`;
  };

  const getTimeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return "morning";
    if (h < 17) return "afternoon";
    return "evening";
  };

  const sendMessage = async (content) => {
    if (!content.trim() || isTyping || !activeAgent) return;
    const agent = AGENTS[activeAgent];
    const userMsg = {
      role: "user",
      content: content.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations(prev => ({
      ...prev,
      [activeAgent]: [...(prev[activeAgent] || []), userMsg],
    }));
    setInputVal("");
    setIsTyping(true);

    const history = (conversations[activeAgent] || []).map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));
    history.push({ role: "user", content: content.trim() });

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: agent.systemPrompt,
          messages: history,
        }),
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "I encountered an issue. Please try again.";

      setConversations(prev => ({
        ...prev,
        [activeAgent]: [...(prev[activeAgent] || []), {
          role: "assistant",
          content: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }],
      }));
    } catch (e) {
      setConversations(prev => ({
        ...prev,
        [activeAgent]: [...(prev[activeAgent] || []), {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please check your API configuration and try again.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }],
      }));
    }
    setIsTyping(false);
  };

  const generateWeeklyReport = async (agentId) => {
    const agent = AGENTS[agentId];
    setReportTitle(`${agent.name} — Weekly Report`);
    setReportContent("");
    setShowReport(true);
    setReportLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: agent.systemPrompt,
          messages: [{ role: "user", content: WEEKLY_REPORT_PROMPT }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Unable to generate report.";
      setReportContent(reply);
    } catch (e) {
      setReportContent("Unable to generate report. Please check your API configuration.");
    }
    setReportLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputVal);
    }
  };

  const currentMsgs = activeAgent ? (conversations[activeAgent] || []) : [];
  const currentAgent = activeAgent ? AGENTS[activeAgent] : null;

  // ── DASHBOARD VIEW ────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="dashboard">
      <div className="dash-greeting">
        <div className="dash-greeting-time">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · Monarc Privé Command Center
        </div>
        <h1 className="dash-greeting-title">Good {getTimeOfDay()}</h1>
        <p className="dash-greeting-sub">5 AI agents active · All systems operational · 6 properties monitored</p>
      </div>

      <div className="dash-section-title">Platform Overview</div>
      <div className="metrics-grid">
        {[
          { label: "Active Listings", value: "6", change: "+1 this week", dir: "up" },
          { label: "Pending Requests", value: "3", change: "2 need approval", dir: "up" },
          { label: "Monthly Revenue", value: "$84K", change: "+18% vs last mo", dir: "up" },
          { label: "Avg Booking Value", value: "$11.2K", change: "+8% this quarter", dir: "up" },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="metric-label">{m.label}</div>
            <div className="metric-value">{m.value}</div>
            <div className={`metric-change ${m.dir}`}>
              {m.dir === "up" ? "↑" : "↓"} {m.change}
            </div>
          </div>
        ))}
      </div>

      <div className="dash-section-title" style={{ marginTop: 4 }}>Your AI Agents</div>
      <div className="agents-grid">
        {Object.values(AGENTS).map(agent => (
          <div key={agent.id} className="agent-card">
            <div className="agent-card-header">
              <span className="agent-card-icon" style={{ color: agent.color }}>{agent.avatar}</span>
              <span className="agent-card-status">
                <span className="agent-card-status-dot" />
                Active
              </span>
            </div>
            <div className="agent-card-name">{agent.name}</div>
            <div className="agent-card-title">{agent.title}</div>
            <div className="agent-card-desc">{agent.description}</div>
            <button className="agent-card-btn" onClick={() => openAgent(agent.id)}>
              Open Agent →
            </button>
          </div>
        ))}
      </div>

      <div className="dash-section-title">Weekly Reports</div>
      <div className="reports-list">
        {[
          { icon: "◈", agent: "sales", name: "Sales & Revenue Report", meta: "Aria · Booking trends, pricing, conversion" },
          { icon: "◉", agent: "marketing", name: "Marketing Performance Report", meta: "Celeste · Campaigns, content, brand metrics" },
          { icon: "◎", agent: "operations", name: "Operations Status Report", meta: "Atlas · Readiness, vendors, SLA compliance" },
          { icon: "◍", agent: "analytics", name: "Analytics Intelligence Report", meta: "Orion · Platform metrics, forecasts, insights" },
        ].map(r => (
          <div key={r.name} className="report-item" onClick={() => generateWeeklyReport(r.agent)}>
            <div className="report-icon" style={{ color: "var(--gold)" }}>{r.icon}</div>
            <div>
              <div className="report-item-name">{r.name}</div>
              <div className="report-item-meta">{r.meta}</div>
            </div>
            <div className="report-item-arrow">Generate →</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── CHAT VIEW ─────────────────────────────────────────────────────────────
  const renderChat = () => {
    if (!currentAgent) return null;
    return (
      <>
        <div className="caps-row">
          {(HINTS[currentAgent.id] || []).map(h => (
            <div key={h} className="cap-chip" onClick={() => sendMessage(h)}>{h}</div>
          ))}
        </div>
        <div className="messages-area">
          {currentMsgs.map((msg, i) => (
            <div key={i} className={`msg ${msg.role === "user" ? "user" : ""}`}>
              <div className={`msg-avatar ${msg.role === "assistant" ? "agent" : "user"}`}>
                {msg.role === "assistant"
                  ? <span style={{ color: currentAgent.color }}>{currentAgent.avatar}</span>
                  : "⊙"}
              </div>
              <div className="msg-body">
                <div className="msg-sender">
                  {msg.role === "assistant" ? currentAgent.name : "You"}
                </div>
                <div className={`msg-bubble ${msg.role === "assistant" ? "agent" : "user"}`}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
                <div className="msg-time">{msg.time}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="msg">
              <div className="msg-avatar agent">
                <span style={{ color: currentAgent.color }}>{currentAgent.avatar}</span>
              </div>
              <div className="msg-body">
                <div className="msg-sender">{currentAgent.name}</div>
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <div className="input-wrap">
            <textarea
              ref={textareaRef}
              className="input-field"
              placeholder={`Message ${currentAgent.name}...`}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ overflow: "hidden" }}
            />
            <button className="send-btn" onClick={() => sendMessage(inputVal)} disabled={!inputVal.trim() || isTyping}>
              ↑
            </button>
          </div>
          <div className="input-hints">
            {(HINTS[currentAgent.id] || []).slice(0, 3).map(h => (
              <div key={h} className="hint-chip" onClick={() => { setInputVal(h); textareaRef.current?.focus(); }}>{h}</div>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <style>{css}</style>

      {/* Mobile sidebar toggle */}
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      <div className="hub">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-logo">
            <div className="sidebar-wordmark">Monarc<span>·</span>Privé</div>
            <div className="sidebar-sub">AI Command Center</div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">Navigation</div>
            <div
              className={`sidebar-item ${activeView === "dashboard" ? "active" : ""}`}
              onClick={() => { setActiveView("dashboard"); setSidebarOpen(false); }}
            >
              <span className="sidebar-item-icon" style={{ color: "var(--gold)" }}>◈</span>
              <div className="sidebar-item-text">
                <div className="sidebar-item-name">Dashboard</div>
                <div className="sidebar-item-role">Overview & Reports</div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">AI Agents</div>
            {Object.values(AGENTS).map(agent => (
              <div
                key={agent.id}
                className={`sidebar-item ${activeView === "chat" && activeAgent === agent.id ? "active" : ""}`}
                onClick={() => openAgent(agent.id)}
              >
                <span className="sidebar-item-icon" style={{ color: agent.color }}>{agent.avatar}</span>
                <div className="sidebar-item-text">
                  <div className="sidebar-item-name">{agent.name}</div>
                  <div className="sidebar-item-role">{agent.title.split("&")[0].trim()}</div>
                </div>
                <div className="sidebar-status" />
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-footer-text">
              Monarc Privé · AI Command Center<br />
              5 agents active · Scottsdale market<br />
              <span style={{ color: "var(--gold)" }}>All systems operational</span>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="main-header">
            <div className="main-header-left">
              {activeView === "dashboard" ? (
                <>
                  <div className="agent-badge">
                    <span className="agent-badge-icon" style={{ color: "var(--gold)" }}>◈</span>
                    <span className="agent-badge-label" style={{ color: "var(--gold)" }}>Command Center</span>
                  </div>
                  <div className="main-agent-name">Agent Hub</div>
                  <div className="main-agent-desc">All 5 AI agents · Platform intelligence · Weekly reports</div>
                </>
              ) : currentAgent ? (
                <>
                  <div className="agent-badge">
                    <span className="agent-badge-icon" style={{ color: currentAgent.color }}>{currentAgent.avatar}</span>
                    <span className="agent-badge-label" style={{ color: currentAgent.color }}>{currentAgent.title}</span>
                  </div>
                  <div className="main-agent-name">{currentAgent.name}</div>
                  <div className="main-agent-desc">{currentAgent.description}</div>
                </>
              ) : null}
            </div>
            <div className="header-actions">
              {activeView === "chat" && currentAgent && ["sales","marketing","operations","analytics"].includes(currentAgent.id) && (
                <button className="header-btn gold" onClick={() => generateWeeklyReport(currentAgent.id)}>
                  ◈ Weekly Report
                </button>
              )}
              <button className="header-btn" onClick={() => setActiveView("dashboard")}>
                ← Dashboard
              </button>
            </div>
          </div>

          {activeView === "dashboard" ? renderDashboard() : renderChat()}
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <div className="report-panel" onClick={() => setShowReport(false)}>
          <div className="report-modal" onClick={e => e.stopPropagation()}>
            <div className="report-modal-header">
              <div className="report-modal-title">{reportTitle}</div>
              <button className="report-modal-close" onClick={() => setShowReport(false)}>✕</button>
            </div>
            <div className="report-modal-body">
              {reportLoading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "40px 0", color: "var(--taupe)" }}>
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                  <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em" }}>Generating report...</span>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(reportContent) }} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
