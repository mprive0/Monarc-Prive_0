import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   MONARC PRIVÉ — EXCLUSIVE MEMBERSHIP EXPERIENCE
   Complete: Splash → Gate → Questionnaire → Payment → Portal
═══════════════════════════════════════════════════════════════ */

// ── MOCK MEMBERS / REVIEWS ──────────────────────────────────
const REVIEWS = [
  {
    name: "Victoria Ashworth",
    title: "Private Equity Partner, New York",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=80",
    text: "Monarc Privé redefined what a private stay means. The Casa del Cielo estate was flawless — the AI concierge had our chef preferences and champagne waiting before we landed. Nothing else compares.",
    stars: 5,
    property: "Casa del Cielo, Paradise Valley",
    date: "March 2025",
  },
  {
    name: "James Holloway III",
    title: "Founder & CEO, Holloway Capital",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80",
    text: "I've stayed at every ultra-luxury property in Scottsdale. Nothing touches the level of curation and discretion Monarc delivers. Worth every penny of the membership and then some.",
    stars: 5,
    property: "The Camelback Retreat, Paradise Valley",
    date: "February 2025",
  },
  {
    name: "Sophia Laurent",
    title: "Art Collector & Philanthropist",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80",
    text: "We hosted our annual foundation gathering at The Ironwood Estate. Every single detail was handled with the kind of discretion and taste I simply cannot find elsewhere. Absolute perfection.",
    stars: 5,
    property: "The Ironwood Estate, North Scottsdale",
    date: "January 2025",
  },
  {
    name: "Marcus Chen",
    title: "Managing Director, Pacific Rim Ventures",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
    text: "The level of personalization is unlike anything I've experienced. My preferences were known before I could articulate them. The Monolith Modern estate is an architectural masterpiece.",
    stars: 5,
    property: "Monolith Modern, Paradise Valley",
    date: "April 2025",
  },
  {
    name: "Isabella Fontaine",
    title: "Luxury Real Estate Developer",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&q=80",
    text: "As someone who lives and breathes luxury real estate, I have extremely high standards. Monarc Privé exceeded every single one. The membership has already paid for itself ten times over.",
    stars: 5,
    property: "Desert Glass House, North Scottsdale",
    date: "March 2025",
  },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1800&q=95",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=95",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=95",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1800&q=95",
];

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=90", label: "Casa del Cielo", sub: "Paradise Valley" },
  { src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=90", label: "The Ironwood Estate", sub: "North Scottsdale" },
  { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=90", label: "Hacienda Serena", sub: "Scottsdale" },
  { src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=90", label: "Monolith Modern", sub: "Paradise Valley" },
  { src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=90", label: "The Camelback Retreat", sub: "Paradise Valley" },
  { src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=90", label: "Desert Glass House", sub: "North Scottsdale" },
];

const QUESTIONS = [
  {
    id: "travel_type",
    question: "How do you primarily travel?",
    options: ["Private aviation", "First class commercial", "Charter & yacht", "Flexible — varies by destination"],
  },
  {
    id: "group_size",
    question: "Your typical group size?",
    options: ["Just myself or a partner", "Intimate group of 4–6", "Family or group of 8–12", "Large gatherings of 15+"],
  },
  {
    id: "stay_purpose",
    question: "What brings you to Scottsdale?",
    options: ["Private retreat & wellness", "Golf & outdoor pursuits", "Corporate or board retreat", "Celebrations & milestone events"],
  },
  {
    id: "concierge_interest",
    question: "Which services matter most to you?",
    options: ["Private chef & dining", "Spa, wellness & longevity", "Event production & design", "Security & total privacy"],
  },
];

// ── STYLES ──────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ivory:#F8F5F0;
  --cream:#EDE8DF;
  --sand:#D4C9B5;
  --taupe:#9E8E78;
  --gold:#C9A96E;
  --gold-light:#E2C896;
  --gold-pale:#F0E4C8;
  --charcoal:#18161480;
  --ink:#161412;
  --ink-mid:#252220;
  --ink-soft:#343230;
  --text-body:#4A4440;
  --text-muted:#8A7D6E;
  --serif:'Cormorant Garamond',Georgia,serif;
  --sans:'Jost',system-ui,sans-serif;
  --green:#5BAF84;
  --easing:cubic-bezier(.22,.68,0,1.2);
}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:var(--sans);background:var(--ink);color:var(--ivory);-webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:none}
.cursor{position:fixed;pointer-events:none;z-index:99999;mix-blend-mode:difference}
.cursor-dot{width:8px;height:8px;background:var(--gold);border-radius:50%;transform:translate(-50%,-50%);transition:transform .1s}
.cursor-ring{width:36px;height:36px;border:1px solid rgba(201,169,110,.5);border-radius:50%;transform:translate(-50%,-50%);transition:all .15s ease}
body:has(a:hover) .cursor-ring,body:has(button:hover) .cursor-ring{transform:translate(-50%,-50%) scale(1.6);border-color:var(--gold)}

/* ── SPLASH ── */
.splash{position:fixed;inset:0;z-index:1000;background:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 1s ease,transform 1.2s ease}
.splash.out{opacity:0;transform:scale(1.06);pointer-events:none}
.splash-crest{font-size:2.5rem;color:var(--gold);margin-bottom:20px;animation:fadeUp 1s .2s ease both}
.splash-name{font-family:var(--serif);font-size:3.2rem;font-weight:300;letter-spacing:.3em;text-transform:uppercase;color:var(--ivory);animation:fadeUp 1s .4s ease both}
.splash-line{width:80px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:18px auto;animation:expandLine .8s .8s ease both;transform:scaleX(0);transform-origin:center}
.splash-sub{font-size:.6rem;letter-spacing:.5em;text-transform:uppercase;color:var(--taupe);animation:fadeUp 1s 1s ease both}

/* ── LANDING / GATE ── */
.landing{min-height:100vh;position:relative;overflow:hidden}
.hero-bg{position:fixed;inset:0;z-index:0}
.hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity 1.5s ease;opacity:0}
.hero-img.active{opacity:1}
.hero-gradient{position:absolute;inset:0;background:linear-gradient(180deg,rgba(22,20,18,.3) 0%,rgba(22,20,18,.15) 40%,rgba(22,20,18,.7) 75%,rgba(22,20,18,.95) 100%)}
.hero-grain{position:absolute;inset:0;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:256px}

.nav-bar{position:fixed;top:0;left:0;right:0;z-index:100;padding:24px 48px;display:flex;align-items:center;justify-content:space-between}
.nav-logo{font-family:var(--serif);font-size:1.3rem;font-weight:300;letter-spacing:.2em;text-transform:uppercase;color:var(--ivory);cursor:pointer}
.nav-logo span{color:var(--gold)}
.nav-right{display:flex;align-items:center;gap:24px}
.nav-link{font-size:.62rem;letter-spacing:.25em;text-transform:uppercase;color:rgba(248,245,240,.7);cursor:pointer;transition:color .2s;font-weight:400}
.nav-link:hover{color:var(--gold)}
.nav-cta{background:transparent;border:1px solid rgba(201,169,110,.5);color:var(--ivory);font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;font-weight:500;font-family:var(--sans);padding:10px 22px;cursor:pointer;transition:all .2s;border-radius:1px}
.nav-cta:hover{background:var(--gold);border-color:var(--gold);color:var(--ink)}

.hero-content{position:relative;z-index:10;min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:0 80px 80px}
.hero-eyebrow{font-size:.58rem;letter-spacing:.5em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;display:flex;align-items:center;gap:14px;animation:fadeUp .8s .2s ease both}
.hero-eyebrow::before{content:'';width:32px;height:1px;background:var(--gold);display:block;flex-shrink:0}
.hero-title{font-family:var(--serif);font-size:clamp(3rem,6vw,5.5rem);font-weight:300;line-height:1.05;color:var(--ivory);margin-bottom:24px;animation:fadeUp .9s .3s ease both}
.hero-title em{font-style:italic;color:var(--gold-light)}
.hero-desc{font-size:.88rem;color:rgba(248,245,240,.7);font-weight:300;line-height:1.8;max-width:460px;margin-bottom:36px;letter-spacing:.02em;animation:fadeUp 1s .4s ease both}
.hero-actions{display:flex;gap:16px;align-items:center;animation:fadeUp 1s .5s ease both}
.btn-gold{background:var(--gold);color:var(--ink);font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;font-weight:600;font-family:var(--sans);padding:18px 40px;border:none;cursor:pointer;transition:all .25s;border-radius:1px}
.btn-gold:hover{background:var(--gold-light);transform:translateY(-2px);box-shadow:0 8px 32px rgba(201,169,110,.3)}
.btn-ghost{background:none;border:1px solid rgba(248,245,240,.3);color:var(--ivory);font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;font-weight:400;font-family:var(--sans);padding:17px 32px;cursor:pointer;transition:all .2s;border-radius:1px}
.btn-ghost:hover{border-color:var(--gold);color:var(--gold)}

.hero-scroll{position:absolute;bottom:36px;right:60px;display:flex;flex-direction:column;align-items:center;gap:8px;z-index:10;animation:fadeUp 1s .8s ease both}
.scroll-line{width:1px;height:50px;background:linear-gradient(180deg,var(--gold),transparent);animation:scrollPulse 2s infinite}
.scroll-text{font-size:.5rem;letter-spacing:.35em;text-transform:uppercase;color:var(--taupe);transform:rotate(90deg);white-space:nowrap}

/* ── IMAGE DOTS ── */
.hero-dots{position:absolute;bottom:40px;left:80px;display:flex;gap:8px;z-index:10}
.hero-dot{width:20px;height:1px;background:rgba(248,245,240,.25);cursor:pointer;transition:all .3s}
.hero-dot.active{background:var(--gold);width:36px}

/* ── SECTION BASE ── */
.section{position:relative;z-index:10;background:var(--ink)}
.section-padded{padding:100px 80px}

/* ── MEMBERS ONLY GATE ── */
.gate-section{background:var(--ink);padding:120px 80px;text-align:center;position:relative;overflow:hidden}
.gate-section::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(201,169,110,.04) 0%,transparent 70%);pointer-events:none}
.gate-eyebrow{font-size:.6rem;letter-spacing:.45em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;font-weight:400}
.gate-title{font-family:var(--serif);font-size:clamp(2.5rem,5vw,4.5rem);font-weight:300;color:var(--ivory);line-height:1.1;margin-bottom:20px;letter-spacing:.02em}
.gate-title em{font-style:italic;color:var(--gold-light)}
.gate-desc{font-size:.9rem;color:rgba(248,245,240,.55);font-weight:300;line-height:1.85;max-width:520px;margin:0 auto 50px;letter-spacing:.02em}
.membership-card{display:inline-block;background:var(--ink-mid);border:1px solid rgba(201,169,110,.2);border-radius:3px;padding:48px 56px;text-align:left;max-width:440px;width:100%;position:relative;overflow:hidden}
.membership-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.mc-badge{font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);margin-bottom:20px;font-weight:500}
.mc-price{font-family:var(--serif);font-size:3.5rem;font-weight:300;color:var(--ivory);line-height:1;margin-bottom:6px}
.mc-price sup{font-size:1.5rem;vertical-align:top;margin-top:.5rem;color:var(--gold)}
.mc-period{font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:var(--taupe);margin-bottom:28px}
.mc-perks{list-style:none;margin-bottom:32px}
.mc-perk{display:flex;align-items:flex-start;gap:12px;padding:8px 0;border-bottom:1px solid rgba(212,201,181,.07);font-size:.78rem;color:rgba(248,245,240,.7);font-weight:300;line-height:1.5}
.mc-perk::before{content:'—';color:var(--gold);flex-shrink:0;margin-top:1px}
.mc-cta{width:100%;background:var(--gold);color:var(--ink);font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;font-weight:600;font-family:var(--sans);padding:18px;border:none;cursor:pointer;transition:all .2s;border-radius:1px;margin-bottom:12px}
.mc-cta:hover{background:var(--gold-light)}
.mc-login{width:100%;background:none;border:1px solid rgba(212,201,181,.15);color:rgba(248,245,240,.6);font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;font-family:var(--sans);padding:14px;cursor:pointer;transition:all .2s;border-radius:1px}
.mc-login:hover{border-color:rgba(201,169,110,.4);color:var(--ivory)}
.mc-secure{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:16px;font-size:.58rem;letter-spacing:.15em;text-transform:uppercase;color:var(--taupe)}

/* ── GALLERY STRIP ── */
.gallery-section{padding:0 0 100px;background:var(--ink)}
.gallery-header{padding:80px 80px 40px;display:flex;align-items:baseline;justify-content:space-between}
.gallery-title{font-family:var(--serif);font-size:2.8rem;font-weight:300;color:var(--ivory);letter-spacing:.02em}
.gallery-link{font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);cursor:pointer}
.gallery-scroll{display:flex;gap:16px;overflow-x:auto;padding:0 80px 20px;scrollbar-width:none}
.gallery-scroll::-webkit-scrollbar{display:none}
.gallery-item{flex-shrink:0;width:340px;cursor:pointer;position:relative;overflow:hidden;border-radius:2px}
.gallery-img{width:100%;height:240px;object-fit:cover;transition:transform .6s ease}
.gallery-item:hover .gallery-img{transform:scale(1.04)}
.gallery-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(22,20,18,.9) 100%)}
.gallery-info{position:absolute;bottom:0;left:0;right:0;padding:16px 18px}
.gallery-name{font-family:var(--serif);font-size:1.1rem;font-weight:400;color:var(--ivory)}
.gallery-sub{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-top:2px}

/* ── AI FEATURES SECTION ── */
.features-section{padding:100px 80px;background:var(--ink-mid)}
.features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(212,201,181,.06);margin-top:56px}
.feature-card{background:var(--ink-mid);padding:40px 36px;transition:background .2s}
.feature-card:hover{background:rgba(44,42,39,.9)}
.feature-icon{font-size:1.6rem;color:var(--gold);margin-bottom:20px;display:block}
.feature-name{font-family:var(--serif);font-size:1.25rem;font-weight:400;color:var(--ivory);margin-bottom:10px;letter-spacing:.02em}
.feature-desc{font-size:.78rem;color:rgba(248,245,240,.5);font-weight:300;line-height:1.75;letter-spacing:.02em}
.feature-badge{display:inline-block;font-size:.52rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,169,110,.25);padding:4px 10px;border-radius:1px;margin-top:14px}

/* ── REVIEWS SECTION ── */
.reviews-section{padding:100px 80px;background:var(--ink)}
.reviews-intro{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:56px}
.reviews-title{font-family:var(--serif);font-size:2.8rem;font-weight:300;color:var(--ivory);letter-spacing:.02em}
.reviews-rating{text-align:right}
.reviews-score{font-family:var(--serif);font-size:3rem;font-weight:300;color:var(--gold)}
.reviews-sub{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--taupe)}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.review-card{background:var(--ink-mid);border:1px solid rgba(212,201,181,.08);border-radius:2px;padding:32px 28px;transition:border-color .2s}
.review-card:hover{border-color:rgba(201,169,110,.2)}
.review-stars{display:flex;gap:3px;margin-bottom:16px}
.review-star{color:var(--gold);font-size:.8rem}
.review-text{font-family:var(--serif);font-size:1.05rem;font-weight:300;color:rgba(248,245,240,.8);line-height:1.7;margin-bottom:24px;font-style:italic;letter-spacing:.01em}
.review-author{display:flex;align-items:center;gap:12px}
.review-avatar{width:42px;height:42px;border-radius:50%;object-fit:cover;border:1px solid rgba(201,169,110,.2)}
.review-name{font-size:.8rem;font-weight:500;color:var(--ivory);letter-spacing:.03em}
.review-title{font-size:.62rem;color:var(--taupe);letter-spacing:.08em;margin-top:2px}
.review-property{font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);opacity:.7;margin-top:12px}

/* ── MODAL OVERLAY ── */
.modal-overlay{position:fixed;inset:0;z-index:500;background:rgba(22,20,18,.92);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .25s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal-box{background:var(--ink-mid);border:1px solid rgba(212,201,181,.12);border-radius:4px;width:100%;max-width:500px;max-height:90vh;overflow-y:auto;position:relative;animation:slideUp .3s var(--easing)}
@keyframes slideUp{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}
.modal-header{padding:32px 36px 24px;border-bottom:1px solid rgba(212,201,181,.08)}
.modal-logo{font-family:var(--serif);font-size:1rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ivory);margin-bottom:8px}
.modal-logo span{color:var(--gold)}
.modal-title{font-family:var(--serif);font-size:1.7rem;font-weight:300;color:var(--ivory);letter-spacing:.02em}
.modal-sub{font-size:.72rem;color:var(--taupe);font-weight:300;margin-top:4px;letter-spacing:.03em}
.modal-close{position:absolute;top:20px;right:20px;background:none;border:none;color:var(--taupe);cursor:pointer;font-size:1.1rem;transition:color .2s;padding:4px}
.modal-close:hover{color:var(--ivory)}
.modal-body{padding:28px 36px 36px}

/* ── LOGIN FORM ── */
.form-group{margin-bottom:18px}
.form-label{font-size:.58rem;letter-spacing:.25em;text-transform:uppercase;color:var(--taupe);display:block;margin-bottom:8px;font-weight:500}
.form-input{width:100%;background:rgba(248,245,240,.04);border:1px solid rgba(212,201,181,.15);border-radius:2px;padding:14px 16px;font-family:var(--sans);font-size:.85rem;color:var(--ivory);font-weight:300;outline:none;transition:border-color .2s;letter-spacing:.02em}
.form-input:focus{border-color:rgba(201,169,110,.4)}
.form-input::placeholder{color:rgba(158,142,120,.4)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.btn-primary-full{width:100%;background:var(--gold);color:var(--ink);font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;font-weight:600;font-family:var(--sans);padding:17px;border:none;cursor:pointer;transition:all .2s;border-radius:1px;margin-top:8px}
.btn-primary-full:hover{background:var(--gold-light)}
.btn-primary-full:disabled{opacity:.5;cursor:not-allowed}
.form-divider{display:flex;align-items:center;gap:14px;margin:20px 0}
.form-divider-line{flex:1;height:1px;background:rgba(212,201,181,.1)}
.form-divider-text{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--taupe)}
.social-btn{width:100%;background:none;border:1px solid rgba(212,201,181,.12);color:rgba(248,245,240,.65);font-size:.72rem;font-family:var(--sans);padding:13px;cursor:pointer;transition:all .2s;border-radius:2px;display:flex;align-items:center;justify-content:center;gap:10px;font-weight:300;letter-spacing:.03em;margin-bottom:8px}
.social-btn:hover{border-color:rgba(201,169,110,.3);color:var(--ivory)}
.form-switch{text-align:center;margin-top:18px;font-size:.72rem;color:var(--taupe);font-weight:300}
.form-switch span{color:var(--gold);cursor:pointer}
.form-switch span:hover{color:var(--gold-light)}

/* ── QUESTIONNAIRE ── */
.q-progress{display:flex;gap:6px;margin-bottom:28px}
.q-prog-dot{flex:1;height:2px;background:rgba(212,201,181,.15);border-radius:1px;transition:background .3s}
.q-prog-dot.done{background:var(--gold)}
.q-question{font-family:var(--serif);font-size:1.5rem;font-weight:300;color:var(--ivory);line-height:1.3;margin-bottom:24px;letter-spacing:.01em}
.q-options{display:flex;flex-direction:column;gap:8px}
.q-option{background:rgba(248,245,240,.03);border:1px solid rgba(212,201,181,.12);border-radius:2px;padding:14px 18px;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:space-between}
.q-option:hover{border-color:rgba(201,169,110,.3);background:rgba(201,169,110,.04)}
.q-option.selected{border-color:var(--gold);background:rgba(201,169,110,.08)}
.q-option-text{font-size:.82rem;color:rgba(248,245,240,.8);font-weight:300;letter-spacing:.02em}
.q-option-check{width:16px;height:16px;border:1px solid rgba(212,201,181,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}
.q-option.selected .q-option-check{background:var(--gold);border-color:var(--gold)}
.q-option-check-dot{width:6px;height:6px;background:var(--ink);border-radius:50%;opacity:0;transition:opacity .15s}
.q-option.selected .q-option-check-dot{opacity:1}
.q-nav{display:flex;justify-content:space-between;align-items:center;margin-top:24px}
.q-back{background:none;border:none;color:var(--taupe);font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;font-family:var(--sans);transition:color .2s}
.q-back:hover{color:var(--ivory)}
.q-step{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--taupe)}

/* ── PAYMENT STEP ── */
.payment-summary{background:rgba(248,245,240,.03);border:1px solid rgba(212,201,181,.1);border-radius:2px;padding:20px;margin-bottom:22px}
.payment-sum-row{display:flex;justify-content:space-between;padding:6px 0;font-size:.8rem;color:rgba(248,245,240,.65);font-weight:300}
.payment-sum-row.total{border-top:1px solid rgba(212,201,181,.1);margin-top:8px;padding-top:14px;color:var(--ivory);font-family:var(--serif);font-size:1.1rem;font-weight:400}
.card-field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.payment-secure-note{display:flex;align-items:center;gap:8px;margin-top:12px;font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;color:var(--taupe)}
.stripe-badge{font-size:.58rem;color:var(--taupe);text-align:center;margin-top:10px;letter-spacing:.08em}

/* ── SUCCESS STATE ── */
.success-screen{text-align:center;padding:12px 0 8px}
.success-icon{font-size:2.5rem;color:var(--gold);margin-bottom:20px;display:block;animation:scaleIn .4s var(--easing)}
@keyframes scaleIn{from{transform:scale(0)}to{transform:scale(1)}}
.success-title{font-family:var(--serif);font-size:2rem;font-weight:300;color:var(--ivory);margin-bottom:10px;letter-spacing:.02em}
.success-sub{font-size:.78rem;color:var(--taupe);font-weight:300;line-height:1.7;margin-bottom:24px}
.success-ref{font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,169,110,.25);padding:10px 20px;display:inline-block;border-radius:2px;margin-bottom:28px}

/* ── MEMBER PORTAL ── */
.portal{min-height:100vh;background:var(--ink)}
.portal-nav{position:fixed;top:0;left:0;right:0;z-index:100;height:60px;background:rgba(22,20,18,.9);backdrop-filter:blur(20px);border-bottom:1px solid rgba(212,201,181,.08);display:flex;align-items:center;padding:0 40px;justify-content:space-between}
.portal-logo{font-family:var(--serif);font-size:1.1rem;font-weight:300;letter-spacing:.18em;text-transform:uppercase;color:var(--ivory);cursor:pointer}
.portal-logo span{color:var(--gold)}
.portal-nav-right{display:flex;align-items:center;gap:20px}
.portal-member-badge{font-size:.58rem;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,169,110,.3);padding:5px 12px;border-radius:1px}
.portal-signout{background:none;border:none;color:var(--taupe);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;font-family:var(--sans);transition:color .2s}
.portal-signout:hover{color:var(--ivory)}

.portal-hero{position:relative;height:65vh;overflow:hidden;margin-top:60px}
.portal-hero-img{width:100%;height:100%;object-fit:cover}
.portal-hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(22,20,18,.2) 0%,rgba(22,20,18,.8) 100%)}
.portal-hero-content{position:absolute;bottom:0;left:0;right:0;padding:48px 80px;display:flex;justify-content:space-between;align-items:flex-end}
.portal-welcome{font-family:var(--serif);font-size:2.8rem;font-weight:300;color:var(--ivory);letter-spacing:.02em;line-height:1.1}
.portal-welcome em{font-style:italic;color:var(--gold-light)}
.portal-member-since{text-align:right}
.portal-ms-label{font-size:.55rem;letter-spacing:.3em;text-transform:uppercase;color:var(--taupe);display:block;margin-bottom:4px}
.portal-ms-date{font-family:var(--serif);font-size:1.1rem;color:var(--ivory)}

.portal-body{padding:60px 80px 100px}
.portal-section-title{font-family:var(--serif);font-size:1.8rem;font-weight:300;color:var(--ivory);margin-bottom:28px;letter-spacing:.02em}
.portal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:56px}
.portal-card{background:var(--ink-mid);border:1px solid rgba(212,201,181,.08);border-radius:3px;overflow:hidden;cursor:pointer;transition:all .25s}
.portal-card:hover{border-color:rgba(201,169,110,.2);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.3)}
.portal-card-img{width:100%;height:180px;object-fit:cover}
.portal-card-body{padding:18px}
.portal-card-badge{font-size:.55rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;font-weight:500}
.portal-card-name{font-family:var(--serif);font-size:1.15rem;font-weight:400;color:var(--ivory);margin-bottom:4px}
.portal-card-area{font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:var(--taupe)}
.portal-card-price{font-family:var(--serif);font-size:1rem;color:var(--gold-light);margin-top:10px}

/* ── AI CONCIERGE PORTAL WIDGET ── */
.ai-widget{position:fixed;bottom:28px;right:28px;z-index:200}
.ai-fab{width:58px;height:58px;background:var(--ink-mid);border:1px solid rgba(201,169,110,.4);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.2rem;color:var(--gold);box-shadow:0 4px 24px rgba(0,0,0,.4);transition:transform .2s;animation:fabGlow 3s infinite}
.ai-fab:hover{transform:scale(1.08)}
@keyframes fabGlow{0%,100%{box-shadow:0 4px 24px rgba(0,0,0,.4),0 0 0 0 rgba(201,169,110,.1)}50%{box-shadow:0 4px 24px rgba(0,0,0,.4),0 0 0 12px rgba(201,169,110,0)}}
.ai-chat-window{position:fixed;bottom:100px;right:28px;z-index:199;width:340px;background:var(--ink-mid);border:1px solid rgba(212,201,181,.12);border-radius:6px;box-shadow:0 20px 60px rgba(0,0,0,.5);overflow:hidden;animation:slideUp .25s var(--easing)}
.ai-chat-header{padding:14px 18px;background:#252220;border-bottom:1px solid rgba(212,201,181,.08);display:flex;align-items:center;gap:10px}
.ai-chat-avatar{width:34px;height:34px;border-radius:50%;background:rgba(201,169,110,.12);border:1px solid rgba(201,169,110,.3);display:flex;align-items:center;justify-content:center;font-size:.9rem;color:var(--gold)}
.ai-chat-name{font-family:var(--serif);font-size:.95rem;font-weight:400;color:var(--ivory)}
.ai-chat-status{font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;color:var(--green)}
.ai-chat-close{margin-left:auto;background:none;border:none;color:var(--taupe);cursor:pointer;font-size:.9rem}
.ai-messages{padding:14px;display:flex;flex-direction:column;gap:10px;max-height:280px;overflow-y:auto;scrollbar-width:none}
.ai-messages::-webkit-scrollbar{display:none}
.ai-msg{max-width:82%;padding:10px 13px;border-radius:2px;font-size:.76rem;line-height:1.6;font-weight:300}
.ai-msg.agent{background:#2C2A27;border:1px solid rgba(212,201,181,.08);color:rgba(248,245,240,.85);align-self:flex-start;border-radius:2px 10px 10px 2px}
.ai-msg.user{background:rgba(201,169,110,.12);border:1px solid rgba(201,169,110,.18);color:var(--ivory);align-self:flex-end;border-radius:10px 2px 2px 10px}
.ai-typing{display:flex;gap:4px;padding:10px 13px;background:#2C2A27;border:1px solid rgba(212,201,181,.08);border-radius:2px 10px 10px 2px;width:fit-content}
.ai-typing-dot{width:5px;height:5px;background:var(--taupe);border-radius:50%;animation:typBounce 1.2s infinite}
.ai-typing-dot:nth-child(2){animation-delay:.2s}
.ai-typing-dot:nth-child(3){animation-delay:.4s}
@keyframes typBounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-4px);opacity:1}}
.ai-input-area{padding:10px 12px 12px;border-top:1px solid rgba(212,201,181,.08);display:flex;gap:8px}
.ai-input{flex:1;background:rgba(248,245,240,.04);border:1px solid rgba(212,201,181,.1);border-radius:2px;padding:9px 12px;font-family:var(--sans);font-size:.76rem;color:var(--ivory);outline:none;font-weight:300}
.ai-input::placeholder{color:rgba(158,142,120,.45)}
.ai-send{width:32px;height:32px;background:var(--gold);border:none;border-radius:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--ink);font-size:.85rem;font-weight:700;transition:background .2s}
.ai-send:hover{background:var(--gold-light)}
.ai-send:disabled{opacity:.4;cursor:not-allowed}

/* ── MEMBERSHIP TIER BADGES ── */
.tier-section{padding:80px 80px;background:var(--ink-mid)}
.tier-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(212,201,181,.06);margin-top:48px}
.tier-card{background:var(--ink-mid);padding:36px 32px;text-align:center}
.tier-card.featured{background:rgba(201,169,110,.06);position:relative}
.tier-card.featured::before{content:'MOST POPULAR';position:absolute;top:-1px;left:50%;transform:translateX(-50%);font-size:.5rem;letter-spacing:.35em;color:var(--gold);background:var(--ink-mid);padding:0 12px;white-space:nowrap}
.tier-icon{font-size:1.5rem;color:var(--gold);margin-bottom:16px;display:block}
.tier-name{font-family:var(--serif);font-size:1.5rem;font-weight:300;color:var(--ivory);margin-bottom:6px}
.tier-price{font-family:var(--serif);font-size:2.5rem;font-weight:300;color:var(--gold);margin-bottom:4px}
.tier-period{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--taupe);margin-bottom:24px}
.tier-perks-list{list-style:none;text-align:left;margin-bottom:28px}
.tier-perk{font-size:.76rem;color:rgba(248,245,240,.65);font-weight:300;padding:7px 0;border-bottom:1px solid rgba(212,201,181,.06);display:flex;gap:10px;line-height:1.4}
.tier-perk::before{content:'—';color:var(--gold);flex-shrink:0}
.tier-btn{width:100%;background:none;border:1px solid rgba(212,201,181,.2);color:var(--ivory);font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;font-family:var(--sans);padding:14px;cursor:pointer;transition:all .2s;border-radius:1px;font-weight:500}
.tier-btn:hover,.tier-card.featured .tier-btn{background:var(--gold);border-color:var(--gold);color:var(--ink)}

/* ── FOOTER ── */
.footer{background:var(--ink);padding:60px 80px 40px;border-top:1px solid rgba(212,201,181,.06)}
.footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:48px}
.footer-brand{font-family:var(--serif);font-size:1.5rem;font-weight:300;letter-spacing:.15em;text-transform:uppercase;color:var(--ivory);margin-bottom:12px}
.footer-brand span{color:var(--gold)}
.footer-tagline{font-size:.75rem;color:var(--taupe);font-weight:300;line-height:1.7}
.footer-col-title{font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;color:var(--taupe);margin-bottom:14px;font-weight:500}
.footer-link{display:block;font-size:.75rem;color:rgba(248,245,240,.5);font-weight:300;margin-bottom:8px;cursor:pointer;transition:color .2s;letter-spacing:.02em}
.footer-link:hover{color:var(--gold)}
.footer-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:24px;border-top:1px solid rgba(212,201,181,.06)}
.footer-copy{font-size:.6rem;letter-spacing:.12em;color:var(--taupe)}
.footer-legal{display:flex;gap:20px}
.footer-legal-link{font-size:.6rem;letter-spacing:.1em;color:var(--taupe);cursor:pointer;transition:color .15s}
.footer-legal-link:hover{color:var(--ivory)}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes expandLine{to{transform:scaleX(1)}}
@keyframes scrollPulse{0%,100%{opacity:1}50%{opacity:.3}}
.reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}
.reveal.visible{opacity:1;transform:none}

/* ── RESPONSIVE ── */
@media(max-width:1024px){
  .section-padded,.gate-section,.features-section,.reviews-section,.portal-body,.tier-section{padding:60px 40px}
  .gallery-header,.gallery-scroll{padding-left:40px;padding-right:40px}
  .nav-bar,.portal-hero-content,.footer-top,.footer-bottom{padding-left:40px;padding-right:40px}
  .hero-content{padding:0 40px 60px}
  .hero-scroll{right:40px}
  .hero-dots{left:40px}
  .features-grid,.reviews-grid,.portal-grid{grid-template-columns:repeat(2,1fr)}
  .tier-grid{grid-template-columns:1fr}
  .footer-top{grid-template-columns:1fr 1fr}
}
@media(max-width:640px){
  .section-padded,.gate-section,.features-section,.reviews-section,.portal-body,.tier-section{padding:50px 20px}
  .gallery-header,.gallery-scroll{padding-left:20px;padding-right:20px}
  .nav-bar{padding:18px 20px}
  .nav-link{display:none}
  .hero-content{padding:0 20px 50px}
  .hero-scroll,.hero-dots{display:none}
  .hero-title{font-size:2.4rem}
  .features-grid,.reviews-grid,.portal-grid{grid-template-columns:1fr}
  .reviews-intro{flex-direction:column;gap:12px}
  .portal-hero-content{padding:28px 20px;flex-direction:column;align-items:flex-start;gap:16px}
  .portal-nav{padding:0 20px}
  .portal-member-since{text-align:left}
  .footer-top{grid-template-columns:1fr;gap:28px}
  .footer-bottom{flex-direction:column;gap:12px;text-align:center}
  .footer-legal{flex-wrap:wrap;justify-content:center}
  .ai-chat-window{width:calc(100vw - 40px)}
  body{cursor:auto}
  .cursor{display:none}
}
`;

// ── AI FEATURES DATA ──────────────────────────────────────────
const AI_FEATURES = [
  { icon: "◈", name: "Sterling AI Concierge", desc: "Your 24/7 personal concierge learns your preferences over time — arriving before you need to ask. Chef selections, arrival rituals, temperature settings — all anticipated.", badge: "Powered by Claude AI" },
  { icon: "◉", name: "Intelligent Arrival", desc: "Your profile trains a personalized arrival experience. Preferred champagne chilled, curated playlist playing, lighting set to your exact preference — every time.", badge: "AI Personalization" },
  { icon: "◌", name: "Predictive Availability", desc: "Our AI monitors your saved properties and alerts you to openings during your preferred windows — before they're publicly listed to the general membership.", badge: "Priority Access" },
  { icon: "◎", name: "Experience Curation", desc: "Based on your questionnaire and booking history, your AI companion surfaces private dinners, exclusive golf access, and events matched precisely to your lifestyle.", badge: "Smart Recommendations" },
  { icon: "◍", name: "Privacy Shield", desc: "AI-powered identity masking ensures your name, travel dates, and guest details are never shared with third parties. Total discretion, guaranteed.", badge: "AI Security Layer" },
  { icon: "✦", name: "Dynamic Pricing Intelligence", desc: "Members receive real-time pricing optimization alerts. Our AI identifies the ideal booking window for your desired dates — maximizing value without compromising quality.", badge: "Revenue Intelligence" },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function MonarcMembership() {
  const [phase, setPhase] = useState("splash"); // splash | landing | questionnaire | payment | success | portal
  const [splashOut, setSplashOut] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [modal, setModal] = useState(null); // null | 'join' | 'login'
  const [authMode, setAuthMode] = useState("login"); // login | register
  const [qStep, setQStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [formData, setFormData] = useState({ email: "", password: "", firstName: "", lastName: "", phone: "" });
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [processing, setProcessing] = useState(false);
  const [member, setMember] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ role: "assistant", content: "Good evening. I'm Sterling, your Monarc Privé AI concierge. How may I assist you today?" }]);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const chatEndRef = useRef(null);

  // Splash
  useEffect(() => {
    const t1 = setTimeout(() => setSplashOut(true), 2400);
    const t2 = setTimeout(() => setPhase("landing"), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Hero carousel
  useEffect(() => {
    if (phase !== "landing") return;
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, [phase]);

  // Custom cursor
  useEffect(() => {
    const move = (e) => {
      if (cursorDotRef.current) { cursorDotRef.current.style.left = e.clientX + "px"; cursorDotRef.current.style.top = e.clientY + "px"; }
      if (cursorRingRef.current) { setTimeout(() => { if (cursorRingRef.current) { cursorRingRef.current.style.left = e.clientX + "px"; cursorRingRef.current.style.top = e.clientY + "px"; } }, 80); }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [phase]);

  // Chat scroll
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, chatTyping]);

  const handleAnswer = (qId, answer) => {
    setAnswers(prev => ({ ...prev, [qId]: answer }));
    setTimeout(() => {
      if (qStep < QUESTIONS.length - 1) setQStep(s => s + 1);
      else { setModal("payment"); }
    }, 300);
  };

  const handleJoin = () => {
    setModal("join");
    setAuthMode("register");
  };
  const handleLogin = () => {
    setModal("login");
    setAuthMode("login");
  };

  const handleRegisterSubmit = () => {
    if (!formData.email || !formData.password || !formData.firstName) return;
    setModal("questionnaire");
    setQStep(0);
  };

  const handleLoginSubmit = () => {
    if (!formData.email || !formData.password) return;
    setMember({ name: formData.firstName || "Member", email: formData.email, since: "May 2025" });
    setModal(null);
    setPhase("portal");
  };

  const handlePayment = async () => {
    if (!cardData.number || !cardData.expiry || !cardData.cvc || !cardData.name) return;
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2200));
    setProcessing(false);
    setModal("success");
  };

  const handleEnterPortal = () => {
    setMember({ name: formData.firstName || "Member", email: formData.email, since: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) });
    setModal(null);
    setPhase("portal");
  };

  const sendChat = async (text) => {
    if (!text.trim() || chatTyping) return;
    const userMsg = { role: "user", content: text.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatTyping(true);
    try {
      const history = [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are Sterling, the ultra-luxury AI concierge for Monarc Privé — an exclusive membership platform for private estate rentals in Scottsdale and Paradise Valley, Arizona. You serve ultra-high-net-worth guests (HNW/UHNW). Be warm, discreet, effortlessly helpful. Anticipate needs. Never say no — always offer alternatives. Speak like a Four Seasons concierge meets a personal butler. Keep responses concise but complete. The member's name is ${member?.name || "our distinguished member"}.`,
          messages: history,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Allow me to have our team follow up with you directly.";
      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Please allow me a moment — I'll have our team reach you within the hour." }]);
    }
    setChatTyping(false);
  };

  // ── SPLASH ─────────────────────────────────────────────────
  if (phase === "splash") return (
    <>
      <style>{css}</style>
      <div className={`cursor`}><div ref={cursorDotRef} className="cursor-dot" style={{ position: "fixed" }} /><div ref={cursorRingRef} className="cursor-ring" style={{ position: "fixed" }} /></div>
      <div className={`splash${splashOut ? " out" : ""}`}>
        <div className="splash-crest">◈</div>
        <div className="splash-name">Monarc Privé</div>
        <div className="splash-line" />
        <div className="splash-sub">Private Estates · Scottsdale</div>
      </div>
    </>
  );

  // ── PORTAL ─────────────────────────────────────────────────
  if (phase === "portal") return (
    <>
      <style>{css}</style>
      <div className="cursor"><div ref={cursorDotRef} className="cursor-dot" style={{ position: "fixed" }} /><div ref={cursorRingRef} className="cursor-ring" style={{ position: "fixed" }} /></div>
      <div className="portal">
        <nav className="portal-nav">
          <div className="portal-logo">Monarc<span>·</span>Privé</div>
          <div className="portal-nav-right">
            <span className="portal-member-badge">◈ Annual Member</span>
            <button className="portal-signout" onClick={() => setPhase("landing")}>Sign Out</button>
          </div>
        </nav>

        <div className="portal-hero">
          <img src={HERO_IMAGES[0]} alt="" className="portal-hero-img" />
          <div className="portal-hero-overlay" />
          <div className="portal-hero-content">
            <div>
              <div style={{ fontSize: ".58rem", letterSpacing: ".35em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>Welcome back</div>
              <div className="portal-welcome">Good {getTimeGreeting()},<br /><em>{member?.name || "Member"}</em></div>
            </div>
            <div className="portal-member-since">
              <span className="portal-ms-label">Member Since</span>
              <span className="portal-ms-date">{member?.since || "May 2025"}</span>
            </div>
          </div>
        </div>

        <div className="portal-body">
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 40 }}>
              {[
                { label: "Properties Available", value: "6", icon: "◈" },
                { label: "Concierge Requests", value: "∞", icon: "◌" },
                { label: "Member Since", value: member?.since?.split(" ")[1] || "2025", icon: "◉" },
                { label: "Annual Savings", value: "$4,200+", icon: "◎" },
              ].map(s => (
                <div key={s.label} style={{ background: "var(--ink-mid)", border: "1px solid rgba(212,201,181,.08)", borderRadius: 3, padding: "20px 18px" }}>
                  <div style={{ fontSize: "1.1rem", color: "var(--gold)", marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", color: "var(--ivory)", fontWeight: 300 }}>{s.value}</div>
                  <div style={{ fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--taupe)", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="portal-section-title">Your Curated Estates</div>
          <div className="portal-grid">
            {GALLERY.map(g => (
              <div key={g.label} className="portal-card">
                <img src={g.src} alt={g.label} className="portal-card-img" />
                <div className="portal-card-body">
                  <div className="portal-card-badge">Member Access</div>
                  <div className="portal-card-name">{g.label}</div>
                  <div className="portal-card-area">{g.sub}</div>
                  <div className="portal-card-price">From $1,650 / night</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="portal-section-title">Member Perks This Month</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
              {[
                { icon: "◈", title: "Complimentary Arrival Champagne", desc: "Included with every booking through June 30th" },
                { icon: "◉", title: "Early Access: New Paradise Valley Estate", desc: "A stunning new 7-bedroom compound — members only preview" },
                { icon: "◌", title: "Private Chef Saturday Series", desc: "Book a private chef experience at 20% off this weekend" },
                { icon: "◎", title: "Refer & Earn", desc: "Refer a member and receive $500 credit on your next booking" },
              ].map(p => (
                <div key={p.title} style={{ background: "var(--ink-mid)", border: "1px solid rgba(212,201,181,.08)", borderRadius: 3, padding: "22px 20px", cursor: "pointer", transition: "border-color .2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,169,110,.2)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(212,201,181,.08)"}
                >
                  <div style={{ fontSize: "1.1rem", color: "var(--gold)", marginBottom: 10 }}>{p.icon}</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1rem", color: "var(--ivory)", marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontSize: ".72rem", color: "var(--taupe)", fontWeight: 300, lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sterling AI Chat */}
      <div className="ai-widget">
        {chatOpen && (
          <div className="ai-chat-window">
            <div className="ai-chat-header">
              <div className="ai-chat-avatar">◌</div>
              <div>
                <div className="ai-chat-name">Sterling</div>
                <div className="ai-chat-status">● AI Concierge · Active</div>
              </div>
              <button className="ai-chat-close" onClick={() => setChatOpen(false)}>✕</button>
            </div>
            <div className="ai-messages">
              {chatMessages.map((m, i) => (
                <div key={i} className={`ai-msg ${m.role}`}>{m.content}</div>
              ))}
              {chatTyping && <div className="ai-typing"><div className="ai-typing-dot" /><div className="ai-typing-dot" /><div className="ai-typing-dot" /></div>}
              <div ref={chatEndRef} />
            </div>
            <div className="ai-input-area">
              <input className="ai-input" placeholder="Ask Sterling..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat(chatInput)} />
              <button className="ai-send" onClick={() => sendChat(chatInput)} disabled={!chatInput.trim() || chatTyping}>↑</button>
            </div>
          </div>
        )}
        <div className="ai-fab" onClick={() => setChatOpen(o => !o)}>
          {chatOpen ? "✕" : "◌"}
        </div>
      </div>
    </>
  );

  // ── LANDING PAGE ────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="cursor"><div ref={cursorDotRef} className="cursor-dot" style={{ position: "fixed" }} /><div ref={cursorRingRef} className="cursor-ring" style={{ position: "fixed" }} /></div>

      {/* NAV */}
      <nav className="nav-bar">
        <div className="nav-logo">Monarc<span>·</span>Privé</div>
        <div className="nav-right">
          <span className="nav-link">Estates</span>
          <span className="nav-link">Membership</span>
          <span className="nav-link">Concierge</span>
          <button className="nav-cta" onClick={handleLogin}>Member Login</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="landing">
        <div className="hero-bg">
          {HERO_IMAGES.map((src, i) => (
            <img key={i} src={src} alt="" className={`hero-img${i === heroIdx ? " active" : ""}`} />
          ))}
          <div className="hero-gradient" />
          <div className="hero-grain" />
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">Private Estates · Scottsdale · Members Only</div>
          <h1 className="hero-title">
            Where privacy<br />becomes an <em>art form</em>
          </h1>
          <p className="hero-desc">An invitation-only portfolio of Scottsdale's most exceptional private estates. Curated for those who live without compromise.</p>
          <div className="hero-actions">
            <button className="btn-gold" onClick={handleJoin}>Request Membership</button>
            <button className="btn-ghost" onClick={() => document.getElementById("estates")?.scrollIntoView({ behavior: "smooth" })}>Explore Estates</button>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <div className="scroll-text">Scroll</div>
        </div>
        <div className="hero-dots">
          {HERO_IMAGES.map((_, i) => (
            <div key={i} className={`hero-dot${i === heroIdx ? " active" : ""}`} onClick={() => setHeroIdx(i)} />
          ))}
        </div>
      </div>

      {/* MEMBERS ONLY GATE */}
      <div className="gate-section section" id="membership">
        <div className="reveal">
          <div className="gate-eyebrow">Exclusive Access</div>
          <h2 className="gate-title">Not a marketplace.<br /><em>A private club.</em></h2>
          <p className="gate-desc">Monarc Privé is not open to the public. Every member is vetted. Every estate is curated. Annual membership grants you access to Scottsdale's most private luxury portfolio — and the AI-powered concierge team behind it.</p>
        </div>
        <div className="reveal" style={{ display: "flex", justifyContent: "center" }}>
          <div className="membership-card">
            <div className="mc-badge">◈ Annual Membership</div>
            <div className="mc-price"><sup>$</sup>300</div>
            <div className="mc-period">per year · cancel anytime</div>
            <ul className="mc-perks">
              {["Access to all 6 curated private estates", "Sterling AI concierge — 24/7 personalized service", "Priority booking before public availability", "Exclusive member pricing & seasonal offers", "AI-powered arrival personalization", "Dedicated host relationship management", "Vetted guest community — full discretion guaranteed", "Annual membership card & member benefits"].map(p => (
                <li key={p} className="mc-perk">{p}</li>
              ))}
            </ul>
            <button className="mc-cta" onClick={handleJoin}>Apply for Membership</button>
            <button className="mc-login" onClick={handleLogin}>Sign in to your account</button>
            <div className="mc-secure">
              <span style={{ color: "var(--green)" }}>●</span>
              <span>Secured by Stripe · 256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <div className="gallery-section section" id="estates">
        <div className="gallery-header reveal">
          <h2 className="gallery-title">The Estates</h2>
          <span className="gallery-link">Members view all →</span>
        </div>
        <div className="gallery-scroll">
          {GALLERY.map(g => (
            <div key={g.label} className="gallery-item">
              <img src={g.src} alt={g.label} className="gallery-img" loading="lazy" />
              <div className="gallery-overlay" />
              <div className="gallery-info">
                <div className="gallery-name">{g.label}</div>
                <div className="gallery-sub">{g.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI FEATURES */}
      <div className="features-section section">
        <div className="reveal">
          <div style={{ fontSize: ".6rem", letterSpacing: ".45em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>Intelligence</div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 300, color: "var(--ivory)", letterSpacing: ".02em" }}>
            AI that works for you,<br /><em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>before you ask</em>
          </h2>
        </div>
        <div className="features-grid reveal">
          {AI_FEATURES.map(f => (
            <div key={f.name} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <div className="feature-name">{f.name}</div>
              <p className="feature-desc">{f.desc}</p>
              <span className="feature-badge">{f.badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MEMBERSHIP TIERS */}
      <div className="tier-section section">
        <div className="reveal" style={{ textAlign: "center" }}>
          <div style={{ fontSize: ".6rem", letterSpacing: ".45em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>Membership Tiers</div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, color: "var(--ivory)" }}>Choose your level of access</h2>
        </div>
        <div className="tier-grid reveal">
          {[
            { name: "Curated", price: "$300", period: "/ year", icon: "◌", perks: ["Access to 6 estates", "Sterling AI Concierge", "Standard booking window", "Member pricing", "Email support"], btn: "Join Curated" },
            { name: "Private", price: "$750", period: "/ year", icon: "◈", featured: true, perks: ["Everything in Curated", "48-hour priority access", "Dedicated account manager", "Exclusive event invitations", "Concierge service credits", "Private member gatherings"], btn: "Join Private" },
            { name: "Founding", price: "Invite Only", period: "", icon: "◉", perks: ["Everything in Private", "Founding member status", "Annual gratitude gift", "Direct founder access", "Co-creation of new estates", "First access to new markets"], btn: "Request Invitation" },
          ].map(t => (
            <div key={t.name} className={`tier-card${t.featured ? " featured" : ""}`}>
              <span className="tier-icon">{t.icon}</span>
              <div className="tier-name">{t.name}</div>
              <div className="tier-price">{t.price}</div>
              <div className="tier-period">{t.period}</div>
              <ul className="tier-perks-list">
                {t.perks.map(p => <li key={p} className="tier-perk">{p}</li>)}
              </ul>
              <button className="tier-btn" onClick={handleJoin}>{t.btn}</button>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS */}
      <div className="reviews-section section">
        <div className="reviews-intro reveal">
          <h2 className="reviews-title">Member Voices</h2>
          <div className="reviews-rating">
            <div className="reviews-score">5.0</div>
            <div className="reviews-sub">★★★★★ · 147 member reviews</div>
          </div>
        </div>
        <div className="reviews-grid reveal">
          {REVIEWS.map(r => (
            <div key={r.name} className="review-card">
              <div className="review-stars">{[...Array(r.stars)].map((_, i) => <span key={i} className="review-star">★</span>)}</div>
              <div className="review-text">"{r.text}"</div>
              <div className="review-author">
                <img src={r.avatar} alt={r.name} className="review-avatar" loading="lazy" />
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-title">{r.title}</div>
                </div>
              </div>
              <div className="review-property">{r.property} · {r.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="section" style={{ background: "var(--ink-mid)", padding: "100px 80px", textAlign: "center" }}>
        <div className="reveal">
          <div style={{ fontSize: ".6rem", letterSpacing: ".45em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>Limited Memberships</div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 300, color: "var(--ivory)", marginBottom: 18, letterSpacing: ".02em" }}>
            The world's finest stays<br /><em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>deserve a finer platform</em>
          </h2>
          <p style={{ fontSize: ".9rem", color: "rgba(248,245,240,.55)", fontWeight: 300, lineHeight: 1.85, maxWidth: 480, margin: "0 auto 40px", letterSpacing: ".02em" }}>
            We limit membership to maintain the standard our estates and members deserve. Availability is not guaranteed.
          </p>
          <button className="btn-gold" onClick={handleJoin} style={{ fontSize: ".65rem", padding: "20px 52px" }}>
            Apply for Membership — $300 / yr
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand">Monarc<span>·</span>Privé</div>
            <p className="footer-tagline">An exclusive membership platform for the world's most discerning travelers. Private estates, AI-powered service, total discretion.</p>
          </div>
          <div>
            <div className="footer-col-title">Membership</div>
            {["Apply Now", "Member Login", "Pricing & Tiers", "Refer a Member"].map(l => <span key={l} className="footer-link" onClick={handleJoin}>{l}</span>)}
          </div>
          <div>
            <div className="footer-col-title">Estates</div>
            {["Paradise Valley", "North Scottsdale", "Scottsdale", "Coming Soon: Malibu"].map(l => <span key={l} className="footer-link">{l}</span>)}
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            {["About Monarc Privé", "Contact", "Privacy Policy", "Terms of Service"].map(l => <span key={l} className="footer-link">{l}</span>)}
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2025 Monarc Privé. All rights reserved. Scottsdale, Arizona.</div>
          <div className="footer-legal">
            {["Privacy Policy", "Terms of Service", "Membership Agreement", "Cancellation Policy"].map(l => <span key={l} className="footer-legal-link">{l}</span>)}
          </div>
        </div>
      </footer>

      {/* ── MODALS ── */}
      {modal && (
        <div className="modal-overlay" onClick={() => modal !== "success" && setModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            {modal !== "success" && <button className="modal-close" onClick={() => setModal(null)}>✕</button>}

            {/* LOGIN */}
            {(modal === "login" || (modal === "join" && authMode === "login")) && (
              <>
                <div className="modal-header">
                  <div className="modal-logo">Monarc<span style={{ color: "var(--gold)" }}>·</span>Privé</div>
                  <div className="modal-title">Welcome back</div>
                  <div className="modal-sub">Sign in to your member account</div>
                </div>
                <div className="modal-body">
                  <button className="social-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Continue with Google
                  </button>
                  <div className="form-divider"><div className="form-divider-line" /><div className="form-divider-text">or email</div><div className="form-divider-line" /></div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="form-input" type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} />
                  </div>
                  <button className="btn-primary-full" onClick={handleLoginSubmit}>Sign In</button>
                  <div className="form-switch">Don't have an account? <span onClick={() => { setModal("join"); setAuthMode("register"); }}>Apply for membership</span></div>
                </div>
              </>
            )}

            {/* REGISTER */}
            {modal === "join" && authMode === "register" && (
              <>
                <div className="modal-header">
                  <div className="modal-logo">Monarc<span style={{ color: "var(--gold)" }}>·</span>Privé</div>
                  <div className="modal-title">Apply for membership</div>
                  <div className="modal-sub">Create your private account</div>
                </div>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input className="form-input" placeholder="First" value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input className="form-input" placeholder="Last" value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="form-input" type="password" placeholder="Min. 8 characters" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} />
                  </div>
                  <button className="btn-primary-full" onClick={handleRegisterSubmit} disabled={!formData.email || !formData.password || !formData.firstName}>
                    Continue to Member Questions →
                  </button>
                  <div className="form-switch">Already a member? <span onClick={() => { setModal("login"); setAuthMode("login"); }}>Sign in</span></div>
                </div>
              </>
            )}

            {/* QUESTIONNAIRE */}
            {modal === "questionnaire" && (
              <>
                <div className="modal-header">
                  <div className="modal-logo">Monarc<span style={{ color: "var(--gold)" }}>·</span>Privé</div>
                  <div className="modal-title">A few quick questions</div>
                  <div className="modal-sub">So we can personalize your experience</div>
                </div>
                <div className="modal-body">
                  <div className="q-progress">
                    {QUESTIONS.map((_, i) => <div key={i} className={`q-prog-dot${i <= qStep ? " done" : ""}`} />)}
                  </div>
                  <div className="q-question">{QUESTIONS[qStep].question}</div>
                  <div className="q-options">
                    {QUESTIONS[qStep].options.map(opt => (
                      <div key={opt} className={`q-option${answers[QUESTIONS[qStep].id] === opt ? " selected" : ""}`} onClick={() => handleAnswer(QUESTIONS[qStep].id, opt)}>
                        <span className="q-option-text">{opt}</span>
                        <div className="q-option-check"><div className="q-option-check-dot" /></div>
                      </div>
                    ))}
                  </div>
                  <div className="q-nav">
                    <button className="q-back" onClick={() => qStep > 0 && setQStep(s => s - 1)} style={{ opacity: qStep === 0 ? 0 : 1 }}>← Back</button>
                    <span className="q-step">{qStep + 1} of {QUESTIONS.length}</span>
                  </div>
                </div>
              </>
            )}

            {/* PAYMENT */}
            {modal === "payment" && (
              <>
                <div className="modal-header">
                  <div className="modal-logo">Monarc<span style={{ color: "var(--gold)" }}>·</span>Privé</div>
                  <div className="modal-title">Complete membership</div>
                  <div className="modal-sub">Annual access — cancel anytime</div>
                </div>
                <div className="modal-body">
                  <div className="payment-summary">
                    <div className="payment-sum-row"><span>Monarc Privé Annual Membership</span><span>$300.00</span></div>
                    <div className="payment-sum-row"><span>Platform fee</span><span>$0.00</span></div>
                    <div className="payment-sum-row total"><span>Total due today</span><span>$300.00</span></div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input className="form-input" placeholder="Name as on card" value={cardData.name} onChange={e => setCardData(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input className="form-input" placeholder="1234 5678 9012 3456" value={cardData.number} onChange={e => setCardData(p => ({ ...p, number: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim() }))} maxLength={19} />
                  </div>
                  <div className="card-field-row">
                    <div className="form-group">
                      <label className="form-label">Expiry</label>
                      <input className="form-input" placeholder="MM / YY" value={cardData.expiry} onChange={e => setCardData(p => ({ ...p, expiry: e.target.value }))} maxLength={7} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVC</label>
                      <input className="form-input" placeholder="•••" value={cardData.cvc} onChange={e => setCardData(p => ({ ...p, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))} maxLength={4} />
                    </div>
                  </div>
                  <div className="payment-secure-note">
                    <span style={{ color: "var(--green)" }}>●</span>
                    <span>256-bit SSL encryption · Secured by Stripe</span>
                  </div>
                  <button className="btn-primary-full" onClick={handlePayment} disabled={processing || !cardData.number || !cardData.expiry || !cardData.cvc || !cardData.name} style={{ marginTop: 16 }}>
                    {processing ? "Processing securely..." : "Activate Membership — $300"}
                  </button>
                  <div className="stripe-badge">Powered by Stripe · PCI DSS Compliant</div>
                </div>
              </>
            )}

            {/* SUCCESS */}
            {modal === "success" && (
              <>
                <div className="modal-header">
                  <div className="modal-logo">Monarc<span style={{ color: "var(--gold)" }}>·</span>Privé</div>
                </div>
                <div className="modal-body">
                  <div className="success-screen">
                    <span className="success-icon">◈</span>
                    <div className="success-title">Welcome to Monarc Privé</div>
                    <p className="success-sub">Your membership is active. You now have access to Scottsdale's most exclusive private estates and your AI concierge Sterling is ready to serve.</p>
                    <div className="success-ref">Member Reference · MP-{Math.random().toString(36).substr(2, 8).toUpperCase()}</div>
                    <div style={{ fontSize: ".72rem", color: "var(--taupe)", lineHeight: 1.7, marginBottom: 24, fontWeight: 300 }}>
                      A welcome email has been sent to <strong style={{ color: "var(--ivory)" }}>{formData.email}</strong>.<br />Your membership renews annually on {new Date(Date.now() + 365 * 86400000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
                    </div>
                    <button className="btn-primary-full" onClick={handleEnterPortal}>Enter Member Portal →</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function getTimeGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
}
