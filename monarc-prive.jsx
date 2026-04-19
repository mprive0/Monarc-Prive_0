import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PROPERTIES = [
  {
    id: 1,
    name: "Casa del Cielo",
    area: "Paradise Valley",
    badge: "Curated Pick",
    price: 2800,
    beds: 6, baths: 7, guests: 14,
    tags: ["Pool", "Spa", "Event-Ready", "Golf Access"],
    description: "A masterpiece of desert modernism perched above Paradise Valley. Floor-to-ceiling glass dissolves the boundary between inside and the Sonoran landscape. Designed by a James Beard–level residential architect, every surface speaks of intention.",
    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=90",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=90",
    ],
    rating: 4.97, reviews: 43,
    eventFriendly: true, petFriendly: false,
  },
  {
    id: 2,
    name: "The Ironwood Estate",
    area: "North Scottsdale",
    badge: "Event-Ready",
    price: 4200,
    beds: 8, baths: 9, guests: 20,
    tags: ["Theater", "Chef Kitchen", "Security", "Firepit"],
    description: "North Scottsdale's most sought-after event property. Seven acres of gated desert sanctuary with a resort-scale pool, private theater, and a chef's kitchen appointed with Sub-Zero and La Cornue. The definition of effortless hosting.",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=90",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90",
    ],
    rating: 4.99, reviews: 28,
    eventFriendly: true, petFriendly: true,
  },
  {
    id: 3,
    name: "Hacienda Serena",
    area: "Scottsdale",
    badge: "Guest Favorite",
    price: 1650,
    beds: 4, baths: 4.5, guests: 8,
    tags: ["Pool", "Mountain View", "Spa", "Wellness"],
    description: "Hacienda Serena is a sanctuary. Adobe walls and terracotta floors ground you in the desert while every modern luxury—infrared sauna, plunge pool, Tonal gym—keeps you at your absolute best. Romance and restoration in equal measure.",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=90",
    ],
    rating: 4.95, reviews: 61,
    eventFriendly: false, petFriendly: true,
  },
  {
    id: 4,
    name: "Monolith Modern",
    area: "Paradise Valley",
    badge: "New Arrival",
    price: 3500,
    beds: 5, baths: 6, guests: 10,
    tags: ["Pool", "Golf Access", "Gated", "Photo-Friendly"],
    description: "An architectural statement. Monolith Modern rises from the desert floor in a composition of black steel, white plaster, and glass. The infinity pool appears to pour directly into the mountain. Impossible to photograph poorly.",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=90",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=90",
    ],
    rating: 4.92, reviews: 19,
    eventFriendly: true, petFriendly: false,
  },
  {
    id: 5,
    name: "The Camelback Retreat",
    area: "Paradise Valley",
    badge: "Curated Pick",
    price: 5800,
    beds: 9, baths: 10, guests: 22,
    tags: ["Event-Ready", "Chef Kitchen", "Spa", "Security", "Theater"],
    description: "The pinnacle of Paradise Valley luxury. Set on three private acres below Camelback Mountain, this compound was designed for those who accept no compromise. Three structures, two pools, a full outdoor kitchen, private spa pavilion, and an eleven-seat screening room.",
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=90",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90",
    ],
    rating: 5.0, reviews: 14,
    eventFriendly: true, petFriendly: true,
  },
  {
    id: 6,
    name: "Desert Glass House",
    area: "North Scottsdale",
    badge: "Guest Favorite",
    price: 2100,
    beds: 4, baths: 5, guests: 8,
    tags: ["Pool", "Mountain View", "Gym", "Golf Access"],
    description: "Nearly invisible from the road, Desert Glass House reveals itself through a sequence of stone walls and desert garden to a stunning pavilion of glass and steel. The main living room is one open frame—sky, saguaro, and silence.",
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=90",
    thumb: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=90",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90",
    ],
    rating: 4.93, reviews: 38,
    eventFriendly: false, petFriendly: true,
  },
];

const COLLECTIONS = [
  { label: "Desert Modern Escapes", icon: "◈", filter: null },
  { label: "Event-Ready Villas", icon: "◉", filter: "event" },
  { label: "Wellness Retreats", icon: "◌", filter: "wellness" },
  { label: "Golf Weekend Estates", icon: "◎", filter: "golf" },
  { label: "Romantic Luxury Stays", icon: "◍", filter: null },
];

const CONCIERGE_SERVICES = [
  { name: "Private Chef", icon: "🍽", desc: "Michelin-caliber in-home dining" },
  { name: "Grocery Stocking", icon: "🛒", desc: "Curated arrival provisions" },
  { name: "Airport Transfer", icon: "✈", desc: "Luxury ground transportation" },
  { name: "Event Planning", icon: "🥂", desc: "Full-service event production" },
  { name: "Spa & Wellness", icon: "◌", desc: "In-villa massage and treatments" },
  { name: "Private Security", icon: "◈", desc: "Discreet professional security" },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

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
    --radius: 2px;
    --radius-card: 4px;
  }

  html, body, #root { height: 100%; }

  body {
    font-family: var(--sans);
    background: var(--ivory);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  .app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    background: var(--ivory);
    position: relative;
    overflow-x: hidden;
  }

  /* ── SPLASH ── */
  .splash {
    position: fixed; inset: 0; z-index: 999;
    background: var(--charcoal);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .splash.out { opacity: 0; pointer-events: none; transform: scale(1.04); }
  .splash-wordmark {
    font-family: var(--serif);
    font-weight: 300;
    font-size: 2.8rem;
    letter-spacing: 0.25em;
    color: var(--ivory);
    text-transform: uppercase;
    animation: fadeUp 1s ease forwards;
    opacity: 0;
  }
  .splash-sub {
    font-family: var(--sans);
    font-weight: 300;
    font-size: 0.6rem;
    letter-spacing: 0.45em;
    color: var(--gold);
    text-transform: uppercase;
    margin-top: 10px;
    animation: fadeUp 1s 0.3s ease forwards;
    opacity: 0;
  }
  .splash-line {
    width: 40px; height: 1px;
    background: var(--gold);
    margin: 24px auto 0;
    animation: expandLine 0.8s 0.5s ease forwards;
    transform: scaleX(0);
    transform-origin: center;
  }

  /* ── NAV ── */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(247,244,239,0.94);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(212,201,181,0.4);
    padding: 0 20px;
    height: 58px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-logo {
    font-family: var(--serif);
    font-weight: 400;
    font-size: 1.35rem;
    letter-spacing: 0.12em;
    color: var(--charcoal);
    text-transform: uppercase;
    cursor: pointer;
  }
  .nav-logo span { color: var(--gold); }
  .nav-actions { display: flex; gap: 16px; align-items: center; }
  .nav-btn {
    background: none; border: none; cursor: pointer;
    font-size: 1.1rem; color: var(--charcoal-soft);
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px;
    transition: color 0.2s;
    position: relative;
  }
  .nav-btn:hover { color: var(--gold); }
  .nav-badge {
    position: absolute; top: 0; right: 0;
    width: 8px; height: 8px;
    background: var(--gold);
    border-radius: 50%;
  }

  /* ── BOTTOM TAB ── */
  .bottom-tab {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 430px;
    background: rgba(247,244,239,0.96);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(212,201,181,0.5);
    display: flex; align-items: center;
    padding: 8px 0 20px;
    z-index: 100;
  }
  .tab-item {
    flex: 1;
    display: flex; flex-direction: column; align-items: center;
    gap: 3px;
    cursor: pointer;
    padding: 4px 0;
    transition: all 0.2s;
  }
  .tab-icon { font-size: 1.15rem; line-height: 1; transition: transform 0.2s; }
  .tab-label {
    font-size: 0.55rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--text-muted);
    transition: color 0.2s;
  }
  .tab-item.active .tab-icon { transform: scale(1.1); }
  .tab-item.active .tab-label { color: var(--gold); }

  /* ── HERO ── */
  .hero {
    position: relative;
    height: 76vh;
    overflow: hidden;
  }
  .hero-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 8s ease;
  }
  .hero-img.zoomed { transform: scale(1.06); }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      180deg,
      rgba(26,25,23,0.1) 0%,
      rgba(26,25,23,0.05) 30%,
      rgba(26,25,23,0.55) 75%,
      rgba(26,25,23,0.85) 100%
    );
  }
  .hero-content {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 32px 24px 40px;
  }
  .hero-eyebrow {
    font-size: 0.6rem;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--gold-light);
    font-weight: 400;
    margin-bottom: 10px;
    display: flex; align-items: center; gap: 10px;
  }
  .hero-eyebrow::before {
    content: '';
    width: 28px; height: 1px;
    background: var(--gold);
    display: inline-block;
  }
  .hero-title {
    font-family: var(--serif);
    font-size: 2.6rem;
    font-weight: 300;
    line-height: 1.1;
    color: var(--ivory);
    margin-bottom: 18px;
  }
  .hero-title em { font-style: italic; color: var(--gold-light); }
  .hero-search {
    background: rgba(247,244,239,0.12);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(247,244,239,0.25);
    border-radius: 3px;
    padding: 14px 18px;
    display: flex; align-items: center; gap: 12px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .hero-search:hover { background: rgba(247,244,239,0.18); }
  .hero-search-icon { font-size: 0.9rem; color: var(--gold-light); }
  .hero-search-text {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    color: var(--ivory);
    font-weight: 300;
  }
  .hero-search-pill {
    margin-left: auto;
    background: var(--gold);
    color: var(--charcoal);
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 2px;
  }

  /* ── SEARCH BAR (SEARCH SCREEN) ── */
  .search-header {
    padding: 20px 20px 0;
    background: var(--ivory);
  }
  .search-title {
    font-family: var(--serif);
    font-size: 1.8rem;
    font-weight: 300;
    color: var(--charcoal);
    margin-bottom: 16px;
    letter-spacing: 0.02em;
  }
  .search-input-wrap {
    display: flex; align-items: center;
    border: 1px solid var(--sand);
    border-radius: var(--radius);
    padding: 12px 16px;
    gap: 10px;
    background: white;
    margin-bottom: 12px;
  }
  .search-input-wrap input {
    flex: 1; border: none; outline: none;
    font-family: var(--sans);
    font-size: 0.85rem;
    color: var(--charcoal);
    background: transparent;
    font-weight: 300;
    letter-spacing: 0.03em;
  }
  .search-input-wrap input::placeholder { color: var(--text-muted); }

  /* ── FILTER CHIPS ── */
  .filter-row {
    display: flex; gap: 8px;
    overflow-x: auto; padding: 0 20px 16px;
    scrollbar-width: none;
  }
  .filter-row::-webkit-scrollbar { display: none; }
  .filter-chip {
    flex-shrink: 0;
    border: 1px solid var(--sand);
    border-radius: 2px;
    padding: 6px 14px;
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--text-secondary);
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .filter-chip.active {
    background: var(--charcoal);
    border-color: var(--charcoal);
    color: var(--ivory);
  }
  .filter-chip:hover:not(.active) { border-color: var(--gold); color: var(--gold); }

  /* ── SECTION HEADER ── */
  .section-header {
    display: flex; align-items: baseline; justify-content: space-between;
    padding: 28px 20px 16px;
  }
  .section-title {
    font-family: var(--serif);
    font-size: 1.55rem;
    font-weight: 300;
    color: var(--charcoal);
    letter-spacing: 0.02em;
  }
  .section-link {
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
  }

  /* ── PROPERTY CARD ── */
  .card {
    margin: 0 20px 24px;
    background: white;
    border-radius: var(--radius-card);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 12px rgba(26,25,23,0.06);
  }
  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 32px rgba(26,25,23,0.12);
  }
  .card-img-wrap {
    position: relative;
    padding-top: 62%;
    overflow: hidden;
  }
  .card-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  .card:hover .card-img { transform: scale(1.04); }
  .card-badge {
    position: absolute; top: 14px; left: 14px;
    background: rgba(247,244,239,0.95);
    color: var(--charcoal);
    font-size: 0.58rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 600;
    padding: 5px 11px;
    border-radius: 2px;
  }
  .card-fav {
    position: absolute; top: 10px; right: 14px;
    background: none; border: none;
    font-size: 1.2rem; cursor: pointer;
    line-height: 1;
    filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3));
    transition: transform 0.2s;
  }
  .card-fav:hover { transform: scale(1.2); }
  .card-body { padding: 16px 18px 18px; }
  .card-meta {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 6px;
  }
  .card-name {
    font-family: var(--serif);
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--charcoal);
    letter-spacing: 0.02em;
    line-height: 1.2;
  }
  .card-price {
    text-align: right; flex-shrink: 0; margin-left: 12px;
  }
  .card-price-amount {
    font-family: var(--serif);
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--charcoal);
  }
  .card-price-night {
    font-size: 0.6rem;
    color: var(--text-muted);
    letter-spacing: 0.1em;
    display: block;
    margin-top: 1px;
  }
  .card-area {
    font-size: 0.68rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 10px;
  }
  .card-tags {
    display: flex; gap: 6px; flex-wrap: wrap;
  }
  .card-tag {
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
    border: 1px solid var(--cream);
    padding: 3px 8px;
    border-radius: 2px;
  }
  .card-rating {
    display: flex; align-items: center; gap: 4px;
    font-size: 0.68rem;
    color: var(--text-secondary);
    margin-top: 10px;
  }
  .card-rating-star { color: var(--gold); font-size: 0.7rem; }

  /* ── COLLECTIONS SCROLL ── */
  .collections-row {
    display: flex; gap: 10px;
    overflow-x: auto; padding: 0 20px 4px;
    scrollbar-width: none;
  }
  .collections-row::-webkit-scrollbar { display: none; }
  .collection-card {
    flex-shrink: 0;
    width: 130px;
    background: var(--charcoal);
    border-radius: var(--radius-card);
    padding: 16px 14px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .collection-card:hover { transform: translateY(-2px); }
  .collection-icon {
    font-size: 1.1rem;
    color: var(--gold);
    margin-bottom: 10px;
    display: block;
  }
  .collection-name {
    font-family: var(--serif);
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--ivory);
    line-height: 1.3;
  }

  /* ── CONCIERGE BANNER ── */
  .concierge-banner {
    margin: 8px 20px 28px;
    background: var(--charcoal);
    border-radius: var(--radius-card);
    padding: 28px 22px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .concierge-banner::after {
    content: '';
    position: absolute;
    top: -30px; right: -30px;
    width: 120px; height: 120px;
    border: 1px solid rgba(201,169,110,0.2);
    border-radius: 50%;
  }
  .concierge-banner::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 200px; height: 200px;
    border: 1px solid rgba(201,169,110,0.1);
    border-radius: 50%;
  }
  .concierge-eyebrow {
    font-size: 0.58rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 400;
    margin-bottom: 10px;
  }
  .concierge-title {
    font-family: var(--serif);
    font-size: 1.5rem;
    font-weight: 300;
    color: var(--ivory);
    line-height: 1.2;
    margin-bottom: 16px;
  }
  .concierge-btn {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--gold);
    background: none;
    border: 1px solid rgba(201,169,110,0.4);
    padding: 9px 16px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .concierge-btn:hover {
    background: rgba(201,169,110,0.1);
    border-color: var(--gold);
  }

  /* ── PROPERTY DETAIL ── */
  .detail-screen {
    background: var(--ivory);
    min-height: 100vh;
    padding-bottom: 120px;
  }
  .detail-hero {
    position: relative; height: 55vh; overflow: hidden;
  }
  .detail-hero-img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .detail-back {
    position: absolute; top: 16px; left: 16px;
    width: 38px; height: 38px;
    background: rgba(247,244,239,0.92);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: none; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    transition: transform 0.2s;
  }
  .detail-back:hover { transform: scale(1.05); }
  .detail-gallery-counter {
    position: absolute; bottom: 16px; right: 16px;
    background: rgba(26,25,23,0.7);
    color: var(--ivory);
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    padding: 5px 10px;
    border-radius: 2px;
  }
  .detail-save {
    position: absolute; top: 16px; right: 16px;
    width: 38px; height: 38px;
    background: rgba(247,244,239,0.92);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: none; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1.1rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    transition: transform 0.2s;
  }
  .detail-save:hover { transform: scale(1.05); }
  .detail-content { padding: 24px 20px 0; }
  .detail-badge-row {
    display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
  }
  .detail-badge {
    font-size: 0.58rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--gold);
    border: 1px solid rgba(201,169,110,0.4);
    padding: 4px 10px; border-radius: 2px;
  }
  .detail-rating {
    display: flex; align-items: center; gap: 4px;
    font-size: 0.72rem; color: var(--text-secondary);
    margin-left: auto;
  }
  .detail-name {
    font-family: var(--serif);
    font-size: 2rem; font-weight: 300;
    color: var(--charcoal); line-height: 1.1;
    margin-bottom: 4px;
    letter-spacing: 0.01em;
  }
  .detail-area {
    font-size: 0.65rem; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--text-muted);
    margin-bottom: 18px;
  }
  .detail-facts {
    display: flex; gap: 20px;
    padding: 16px 0; border-top: 1px solid var(--cream); border-bottom: 1px solid var(--cream);
    margin-bottom: 22px;
  }
  .detail-fact { text-align: center; }
  .detail-fact-val {
    font-family: var(--serif);
    font-size: 1.3rem; font-weight: 400;
    color: var(--charcoal); display: block;
  }
  .detail-fact-label {
    font-size: 0.58rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--text-muted);
  }
  .detail-desc {
    font-size: 0.85rem; line-height: 1.75;
    color: var(--text-secondary); font-weight: 300;
    margin-bottom: 24px;
  }
  .detail-section-title {
    font-family: var(--serif);
    font-size: 1.15rem; font-weight: 400;
    color: var(--charcoal); margin-bottom: 14px;
    letter-spacing: 0.02em;
  }
  .amenities-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 8px; margin-bottom: 26px;
  }
  .amenity-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.75rem; color: var(--text-secondary);
    font-weight: 300;
  }
  .amenity-dot {
    width: 5px; height: 5px;
    background: var(--gold); border-radius: 50%; flex-shrink: 0;
  }

  /* ── CONCIERGE GRID (DETAIL) ── */
  .concierge-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 8px; margin-bottom: 26px;
  }
  .concierge-item {
    border: 1px solid var(--cream);
    border-radius: var(--radius-card);
    padding: 14px 12px;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
  }
  .concierge-item:hover {
    border-color: var(--gold);
    box-shadow: 0 2px 12px rgba(201,169,110,0.1);
  }
  .concierge-item-icon { font-size: 1.2rem; margin-bottom: 6px; display: block; }
  .concierge-item-name {
    font-size: 0.72rem; font-weight: 500;
    color: var(--charcoal); margin-bottom: 3px;
    letter-spacing: 0.03em;
  }
  .concierge-item-desc {
    font-size: 0.62rem; color: var(--text-muted); font-weight: 300;
  }

  /* ── BOOKING CTA ── */
  .booking-cta {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 430px;
    background: rgba(247,244,239,0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(212,201,181,0.5);
    padding: 16px 20px 32px;
    z-index: 90;
  }
  .booking-price-row {
    display: flex; align-items: center; margin-bottom: 12px;
  }
  .booking-price {
    font-family: var(--serif);
    font-size: 1.5rem; font-weight: 400; color: var(--charcoal);
  }
  .booking-price-night {
    font-size: 0.65rem; letter-spacing: 0.1em;
    color: var(--text-muted); margin-left: 6px; align-self: flex-end;
    padding-bottom: 4px;
  }
  .booking-rating {
    margin-left: auto;
    font-size: 0.7rem; color: var(--text-secondary);
    display: flex; align-items: center; gap: 3px;
  }
  .btn-primary {
    width: 100%;
    background: var(--charcoal);
    color: var(--ivory);
    font-size: 0.68rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-weight: 600;
    font-family: var(--sans);
    padding: 16px;
    border: none; border-radius: var(--radius);
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-primary:hover { background: var(--charcoal-soft); }
  .btn-primary.gold {
    background: var(--gold); color: var(--charcoal);
  }
  .btn-primary.gold:hover { background: var(--gold-light); }
  .btn-secondary {
    width: 100%; border: 1px solid var(--sand);
    background: transparent; color: var(--charcoal);
    font-size: 0.68rem; letter-spacing: 0.22em;
    text-transform: uppercase; font-weight: 600;
    font-family: var(--sans); padding: 14px;
    border-radius: var(--radius); cursor: pointer;
    margin-top: 8px; transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: var(--charcoal); }

  /* ── BOOKING FLOW ── */
  .booking-screen {
    background: var(--ivory);
    min-height: 100vh;
    padding-bottom: 120px;
  }
  .booking-header {
    padding: 58px 20px 24px;
    border-bottom: 1px solid var(--cream);
  }
  .booking-step-label {
    font-size: 0.58rem; letter-spacing: 0.3em;
    text-transform: uppercase; color: var(--gold);
    font-weight: 500; margin-bottom: 8px;
  }
  .booking-screen-title {
    font-family: var(--serif);
    font-size: 1.8rem; font-weight: 300;
    color: var(--charcoal); letter-spacing: 0.02em;
  }
  .booking-body { padding: 24px 20px; }
  .booking-prop-summary {
    display: flex; gap: 14px; align-items: center;
    background: white; border-radius: var(--radius-card);
    padding: 14px; margin-bottom: 24px;
    border: 1px solid var(--cream);
  }
  .booking-prop-img {
    width: 64px; height: 64px; border-radius: var(--radius);
    object-fit: cover; flex-shrink: 0;
  }
  .booking-prop-name {
    font-family: var(--serif);
    font-size: 1rem; font-weight: 400; color: var(--charcoal);
  }
  .booking-prop-area {
    font-size: 0.62rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--text-muted);
    margin-top: 2px;
  }
  .form-group { margin-bottom: 18px; }
  .form-label {
    font-size: 0.62rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--text-muted);
    font-weight: 500; display: block; margin-bottom: 7px;
  }
  .form-input {
    width: 100%; border: 1px solid var(--sand);
    border-radius: var(--radius); padding: 13px 14px;
    font-family: var(--sans); font-size: 0.85rem;
    color: var(--charcoal); font-weight: 300;
    background: white; outline: none;
    transition: border-color 0.2s;
    letter-spacing: 0.02em;
  }
  .form-input:focus { border-color: var(--gold); }
  .form-input::placeholder { color: var(--text-muted); }
  .form-row { display: flex; gap: 12px; }
  .form-row .form-group { flex: 1; }
  .trip-type-grid {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 8px;
    margin-bottom: 18px;
  }
  .trip-type-btn {
    border: 1px solid var(--sand);
    border-radius: var(--radius); padding: 12px 8px;
    text-align: center; cursor: pointer;
    transition: all 0.2s; background: white;
  }
  .trip-type-btn.active {
    border-color: var(--charcoal); background: var(--charcoal);
  }
  .trip-type-icon { font-size: 1.2rem; display: block; margin-bottom: 4px; }
  .trip-type-label {
    font-size: 0.62rem; letter-spacing: 0.1em;
    text-transform: uppercase; font-weight: 500;
    color: var(--text-secondary);
  }
  .trip-type-btn.active .trip-type-label { color: var(--ivory); }

  /* ── PRICE BREAKDOWN ── */
  .price-breakdown {
    background: white; border: 1px solid var(--cream);
    border-radius: var(--radius-card); padding: 20px;
    margin-bottom: 18px;
  }
  .price-row {
    display: flex; justify-content: space-between;
    align-items: center; padding: 8px 0;
    font-size: 0.82rem; color: var(--text-secondary);
    font-weight: 300;
  }
  .price-row.total {
    border-top: 1px solid var(--cream); margin-top: 8px; padding-top: 14px;
    font-weight: 600; color: var(--charcoal);
    font-family: var(--serif); font-size: 1rem;
  }

  /* ── MESSAGES ── */
  .messages-screen { min-height: 100vh; }
  .messages-header {
    padding: 24px 20px 16px;
    border-bottom: 1px solid var(--cream);
  }
  .messages-title {
    font-family: var(--serif);
    font-size: 1.8rem; font-weight: 300;
    color: var(--charcoal);
  }
  .message-thread {
    display: flex; gap: 14px; align-items: flex-start;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(212,201,181,0.3);
    cursor: pointer; transition: background 0.15s;
  }
  .message-thread:hover { background: rgba(212,201,181,0.1); }
  .message-avatar {
    width: 46px; height: 46px; border-radius: 50%;
    object-fit: cover; flex-shrink: 0;
    border: 1px solid var(--cream);
  }
  .message-thread-content { flex: 1; min-width: 0; }
  .message-thread-header {
    display: flex; justify-content: space-between; margin-bottom: 4px;
  }
  .message-thread-name {
    font-weight: 500; font-size: 0.85rem; color: var(--charcoal);
  }
  .message-thread-time {
    font-size: 0.62rem; color: var(--text-muted); letter-spacing: 0.05em;
  }
  .message-thread-prop {
    font-size: 0.65rem; color: var(--gold);
    letter-spacing: 0.08em; margin-bottom: 3px;
  }
  .message-thread-preview {
    font-size: 0.75rem; color: var(--text-secondary);
    font-weight: 300; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis;
  }
  .message-unread {
    width: 8px; height: 8px; background: var(--gold);
    border-radius: 50%; flex-shrink: 0; align-self: center;
  }

  /* ── TRIPS ── */
  .trips-screen { min-height: 100vh; padding-bottom: 100px; }
  .trips-header { padding: 24px 20px 16px; }
  .trips-title {
    font-family: var(--serif);
    font-size: 1.8rem; font-weight: 300; color: var(--charcoal);
    margin-bottom: 16px;
  }
  .trips-tabs {
    display: flex; gap: 0; border-bottom: 1px solid var(--cream);
  }
  .trips-tab {
    flex: 1; padding: 10px 0;
    font-size: 0.65rem; letter-spacing: 0.2em;
    text-transform: uppercase; font-weight: 500;
    color: var(--text-muted); cursor: pointer;
    border-bottom: 2px solid transparent;
    text-align: center; transition: all 0.2s;
  }
  .trips-tab.active { color: var(--charcoal); border-bottom-color: var(--charcoal); }
  .trip-card {
    margin: 16px 20px;
    background: white; border-radius: var(--radius-card);
    overflow: hidden; border: 1px solid var(--cream);
    box-shadow: 0 2px 8px rgba(26,25,23,0.05);
  }
  .trip-card-img { width: 100%; height: 140px; object-fit: cover; }
  .trip-card-body { padding: 16px; }
  .trip-status {
    display: inline-block; font-size: 0.58rem;
    letter-spacing: 0.18em; text-transform: uppercase;
    font-weight: 600; padding: 4px 10px; border-radius: 2px;
    margin-bottom: 10px;
  }
  .trip-status.confirmed { background: rgba(201,169,110,0.15); color: var(--gold); }
  .trip-status.pending { background: rgba(212,201,181,0.3); color: var(--text-secondary); }
  .trip-status.past { background: var(--cream); color: var(--text-muted); }
  .trip-card-name {
    font-family: var(--serif);
    font-size: 1.15rem; font-weight: 400; color: var(--charcoal);
    margin-bottom: 4px;
  }
  .trip-card-dates {
    font-size: 0.7rem; color: var(--text-secondary);
    font-weight: 300; margin-bottom: 12px;
  }
  .trip-card-footer {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 12px; border-top: 1px solid var(--cream);
  }
  .trip-card-total {
    font-family: var(--serif);
    font-size: 1rem; font-weight: 400; color: var(--charcoal);
  }
  .trip-card-action {
    font-size: 0.62rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold);
    font-weight: 600; cursor: pointer;
  }

  /* ── PROFILE ── */
  .profile-screen { min-height: 100vh; padding-bottom: 100px; }
  .profile-hero {
    background: var(--charcoal); padding: 40px 20px 32px;
    text-align: center;
  }
  .profile-avatar-wrap { position: relative; display: inline-block; margin-bottom: 14px; }
  .profile-avatar {
    width: 72px; height: 72px; border-radius: 50%;
    border: 2px solid var(--gold);
    object-fit: cover;
  }
  .profile-verified {
    position: absolute; bottom: 0; right: 0;
    width: 22px; height: 22px; background: var(--gold);
    border-radius: 50%; border: 2px solid var(--charcoal);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.6rem;
  }
  .profile-name {
    font-family: var(--serif);
    font-size: 1.5rem; font-weight: 300;
    color: var(--ivory); margin-bottom: 4px;
  }
  .profile-member {
    font-size: 0.6rem; letter-spacing: 0.3em;
    text-transform: uppercase; color: var(--gold);
    font-weight: 400;
  }
  .profile-stats {
    display: flex; border-top: 1px solid rgba(212,201,181,0.15);
    margin-top: 20px; padding-top: 20px;
  }
  .profile-stat { flex: 1; text-align: center; }
  .profile-stat-val {
    font-family: var(--serif);
    font-size: 1.3rem; color: var(--ivory); display: block;
  }
  .profile-stat-label {
    font-size: 0.55rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--taupe);
  }
  .profile-section { padding: 22px 20px 0; }
  .profile-section-title {
    font-size: 0.6rem; letter-spacing: 0.3em;
    text-transform: uppercase; color: var(--text-muted);
    margin-bottom: 12px; font-weight: 500;
  }
  .profile-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 0; border-bottom: 1px solid rgba(212,201,181,0.3);
    cursor: pointer;
  }
  .profile-item-icon { font-size: 1rem; width: 20px; text-align: center; }
  .profile-item-text {
    flex: 1; font-size: 0.82rem; color: var(--charcoal); font-weight: 300;
  }
  .profile-item-arrow { font-size: 0.7rem; color: var(--text-muted); }

  /* ── EMPTY / SAVED ── */
  .saved-screen { min-height: 100vh; padding: 24px 20px 100px; }
  .saved-title {
    font-family: var(--serif);
    font-size: 1.8rem; font-weight: 300;
    color: var(--charcoal); margin-bottom: 24px;
  }
  .saved-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .saved-card { cursor: pointer; }
  .saved-card-img-wrap {
    position: relative; padding-top: 100%;
    overflow: hidden; border-radius: var(--radius-card);
  }
  .saved-card-img {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .saved-card:hover .saved-card-img { transform: scale(1.04); }
  .saved-card-fav {
    position: absolute; top: 8px; right: 8px;
    font-size: 1rem; filter: drop-shadow(0 1px 4px rgba(0,0,0,0.4));
    background: none; border: none; cursor: pointer;
  }
  .saved-card-name {
    font-family: var(--serif);
    font-size: 0.9rem; color: var(--charcoal);
    margin-top: 8px; font-weight: 400;
  }
  .saved-card-price {
    font-size: 0.7rem; color: var(--text-muted); font-weight: 300;
  }
  .empty-state {
    text-align: center; padding: 60px 20px;
  }
  .empty-icon { font-size: 2rem; margin-bottom: 16px; display: block; color: var(--sand); }
  .empty-title {
    font-family: var(--serif);
    font-size: 1.3rem; color: var(--charcoal); margin-bottom: 8px;
  }
  .empty-desc {
    font-size: 0.78rem; color: var(--text-muted);
    font-weight: 300; line-height: 1.6;
  }

  /* ── BOOKING CONFIRMATION ── */
  .confirm-screen {
    min-height: 100vh; background: var(--charcoal);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 28px; text-align: center;
  }
  .confirm-icon { font-size: 2.5rem; margin-bottom: 20px; }
  .confirm-title {
    font-family: var(--serif);
    font-size: 2rem; font-weight: 300;
    color: var(--ivory); margin-bottom: 10px;
    letter-spacing: 0.02em;
  }
  .confirm-sub {
    font-size: 0.78rem; color: var(--taupe);
    font-weight: 300; line-height: 1.7; margin-bottom: 30px;
  }
  .confirm-ref {
    font-size: 0.65rem; letter-spacing: 0.3em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 28px; border: 1px solid rgba(201,169,110,0.3);
    padding: 10px 20px; border-radius: 2px;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes expandLine {
    to { transform: scaleX(1); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }

  .fade-in { animation: fadeUp 0.5s ease forwards; }

  /* ── SEARCH SCREEN CARDS ── */
  .search-results { padding: 0 0 100px; }
  .search-count {
    padding: 8px 20px 16px;
    font-size: 0.68rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--text-muted);
    font-weight: 400;
  }

  /* divider */
  .divider {
    height: 1px; background: var(--cream);
    margin: 4px 20px 0;
  }
`;

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function MonarcPrive() {
  const [splashOut, setSplashOut] = useState(false);
  const [tab, setTab] = useState("home");
  const [heroZoomed, setHeroZoomed] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookingStep, setBookingStep] = useState(null); // null | 'form' | 'review' | 'confirm'
  const [favorites, setFavorites] = useState(new Set([2, 4]));
  const [activeFilter, setActiveFilter] = useState("All");
  const [tripType, setTripType] = useState("stay");
  const [tripsTab, setTripsTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const t1 = setTimeout(() => setSplashOut(true), 2200);
    const t2 = setTimeout(() => setHeroZoomed(true), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const toggleFav = (id) => {
    setFavorites(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const filters = ["All", "Event-Ready", "Wellness", "Golf", "Romantic", "Pet-Friendly"];

  const filteredProps = PROPERTIES.filter(p => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Event-Ready") return p.eventFriendly;
    if (activeFilter === "Pet-Friendly") return p.petFriendly;
    if (activeFilter === "Wellness") return p.tags.some(t => t.toLowerCase().includes("spa") || t.toLowerCase().includes("wellness"));
    if (activeFilter === "Golf") return p.tags.some(t => t.toLowerCase().includes("golf"));
    return true;
  }).filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const savedProps = PROPERTIES.filter(p => favorites.has(p.id));

  // ── RENDER SCREENS ────────────────────────────────────────────────────────

  const renderHome = () => (
    <div className="fade-in">
      {/* Hero */}
      <div className="hero">
        <img
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=90"
          alt="Luxury property"
          className={`hero-img${heroZoomed ? " zoomed" : ""}`}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-eyebrow">Scottsdale · Paradise Valley</div>
          <h1 className="hero-title">
            Private luxury,<br/><em>effortlessly yours</em>
          </h1>
          <div className="hero-search" onClick={() => setTab("search")}>
            <span className="hero-search-icon">⌕</span>
            <span className="hero-search-text">Where are you going?</span>
            <span className="hero-search-pill">Search</span>
          </div>
        </div>
      </div>

      {/* Collections */}
      <div className="section-header">
        <h2 className="section-title">Curated Collections</h2>
        <span className="section-link" onClick={() => setTab("search")}>View all</span>
      </div>
      <div className="collections-row">
        {COLLECTIONS.map((c, i) => (
          <div key={i} className="collection-card" onClick={() => { setActiveFilter(c.filter || "All"); setTab("search"); }}>
            <span className="collection-icon">{c.icon}</span>
            <span className="collection-name">{c.label}</span>
          </div>
        ))}
      </div>

      {/* Featured */}
      <div className="section-header">
        <h2 className="section-title">Featured Estates</h2>
        <span className="section-link" onClick={() => setTab("search")}>All properties</span>
      </div>

      {PROPERTIES.slice(0, 3).map(p => (
        <PropertyCard key={p.id} p={p} favorites={favorites} toggleFav={toggleFav} onSelect={() => setSelectedProperty(p)} />
      ))}

      {/* Concierge Banner */}
      <div className="concierge-banner" onClick={() => setSelectedProperty(PROPERTIES[0])}>
        <div className="concierge-eyebrow">Monarc Privé Concierge</div>
        <div className="concierge-title">Your vision.<br/>Our expertise.</div>
        <button className="concierge-btn">Explore Services →</button>
      </div>

      {/* More Properties */}
      <div className="section-header">
        <h2 className="section-title">New Arrivals</h2>
      </div>
      {PROPERTIES.slice(3).map(p => (
        <PropertyCard key={p.id} p={p} favorites={favorites} toggleFav={toggleFav} onSelect={() => setSelectedProperty(p)} />
      ))}

      <div style={{ height: 100 }} />
    </div>
  );

  const renderSearch = () => (
    <div className="fade-in search-results">
      <div className="search-header">
        <h2 className="search-title">Find your estate</h2>
        <div className="search-input-wrap">
          <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>⌕</span>
          <input
            placeholder="Location, property name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <span style={{ cursor: "pointer", color: "var(--text-muted)", fontSize: "0.8rem" }} onClick={() => setSearchQuery("")}>✕</span>
          )}
        </div>
      </div>
      <div className="filter-row">
        {filters.map(f => (
          <div key={f} className={`filter-chip${activeFilter === f ? " active" : ""}`} onClick={() => setActiveFilter(f)}>{f}</div>
        ))}
      </div>
      <div className="search-count">{filteredProps.length} properties</div>
      {filteredProps.map(p => (
        <PropertyCard key={p.id} p={p} favorites={favorites} toggleFav={toggleFav} onSelect={() => setSelectedProperty(p)} />
      ))}
      {filteredProps.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">◌</span>
          <div className="empty-title">No estates found</div>
          <div className="empty-desc">Try adjusting your filters or search term.</div>
        </div>
      )}
      <div style={{ height: 100 }} />
    </div>
  );

  const renderSaved = () => (
    <div className="saved-screen fade-in">
      <h2 className="saved-title">Saved Estates</h2>
      {savedProps.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">♡</span>
          <div className="empty-title">Nothing saved yet</div>
          <div className="empty-desc">Tap the heart on any property to save it to your collection.</div>
        </div>
      ) : (
        <div className="saved-grid">
          {savedProps.map(p => (
            <div key={p.id} className="saved-card" onClick={() => setSelectedProperty(p)}>
              <div className="saved-card-img-wrap">
                <img src={p.thumb} alt={p.name} className="saved-card-img" />
                <button className="saved-card-fav" onClick={e => { e.stopPropagation(); toggleFav(p.id); }}>
                  {favorites.has(p.id) ? "♥" : "♡"}
                </button>
              </div>
              <div className="saved-card-name">{p.name}</div>
              <div className="saved-card-price">${p.price.toLocaleString()} / night</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTrips = () => (
    <div className="trips-screen fade-in">
      <div className="trips-header">
        <h2 className="trips-title">My Trips</h2>
        <div className="trips-tabs">
          {["upcoming","pending","past"].map(t => (
            <div key={t} className={`trips-tab${tripsTab === t ? " active" : ""}`} onClick={() => setTripsTab(t)}>
              {t}
            </div>
          ))}
        </div>
      </div>
      {tripsTab === "upcoming" && (
        <div>
          <div className="trip-card">
            <img src={PROPERTIES[1].thumb} alt="" className="trip-card-img" />
            <div className="trip-card-body">
              <span className="trip-status confirmed">Confirmed</span>
              <div className="trip-card-name">{PROPERTIES[1].name}</div>
              <div className="trip-card-dates">June 14–18, 2025 · 4 nights</div>
              <div className="trip-card-footer">
                <span className="trip-card-total">${(PROPERTIES[1].price * 4).toLocaleString()}</span>
                <span className="trip-card-action">View Details →</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {tripsTab === "pending" && (
        <div>
          <div className="trip-card">
            <img src={PROPERTIES[3].thumb} alt="" className="trip-card-img" />
            <div className="trip-card-body">
              <span className="trip-status pending">Awaiting Approval</span>
              <div className="trip-card-name">{PROPERTIES[3].name}</div>
              <div className="trip-card-dates">July 4–7, 2025 · 3 nights</div>
              <div className="trip-card-footer">
                <span className="trip-card-total">${(PROPERTIES[3].price * 3).toLocaleString()}</span>
                <span className="trip-card-action">View Request →</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {tripsTab === "past" && (
        <div>
          <div className="trip-card">
            <img src={PROPERTIES[2].thumb} alt="" className="trip-card-img" />
            <div className="trip-card-body">
              <span className="trip-status past">Completed</span>
              <div className="trip-card-name">{PROPERTIES[2].name}</div>
              <div className="trip-card-dates">March 22–26, 2025 · 4 nights</div>
              <div className="trip-card-footer">
                <span className="trip-card-total">${(PROPERTIES[2].price * 4).toLocaleString()}</span>
                <span className="trip-card-action">Leave Review →</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMessages = () => (
    <div className="messages-screen fade-in">
      <div className="messages-header">
        <h2 className="messages-title">Messages</h2>
      </div>
      {[
        { name: "Monarc Concierge", prop: "The Ironwood Estate", time: "10m ago", preview: "Your private chef request has been confirmed for June 14.", unread: true, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
        { name: "Casa del Cielo Host", prop: "Casa del Cielo", time: "2h ago", preview: "Looking forward to hosting you — I've sent the arrival instructions.", unread: false, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
        { name: "Monarc Support", prop: "General inquiry", time: "Yesterday", preview: "Thank you for reaching out. Our team will respond within the hour.", unread: false, img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&q=80" },
      ].map((m, i) => (
        <div key={i} className="message-thread">
          <img src={m.img} alt={m.name} className="message-avatar" />
          <div className="message-thread-content">
            <div className="message-thread-header">
              <span className="message-thread-name">{m.name}</span>
              <span className="message-thread-time">{m.time}</span>
            </div>
            <div className="message-thread-prop">{m.prop}</div>
            <div className="message-thread-preview">{m.preview}</div>
          </div>
          {m.unread && <div className="message-unread" />}
        </div>
      ))}
    </div>
  );

  const renderProfile = () => (
    <div className="profile-screen fade-in">
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" alt="Profile" className="profile-avatar" />
          <span className="profile-verified">✓</span>
        </div>
        <div className="profile-name">Alexandra V.</div>
        <div className="profile-member">Monarc Member</div>
        <div className="profile-stats">
          <div className="profile-stat"><span className="profile-stat-val">6</span><span className="profile-stat-label">Stays</span></div>
          <div className="profile-stat"><span className="profile-stat-val">3</span><span className="profile-stat-label">Saved</span></div>
          <div className="profile-stat"><span className="profile-stat-val">★ 5.0</span><span className="profile-stat-label">Guest Rating</span></div>
        </div>
      </div>
      <div className="profile-section">
        <div className="profile-section-title">Account</div>
        {["Personal Information","Payment Methods","Verification & ID","Notifications","Privacy & Security"].map(item => (
          <div key={item} className="profile-item">
            <span className="profile-item-icon">◌</span>
            <span className="profile-item-text">{item}</span>
            <span className="profile-item-arrow">›</span>
          </div>
        ))}
      </div>
      <div className="profile-section">
        <div className="profile-section-title">Preferences</div>
        {["Travel Preferences","Favorite Destinations","Concierge Preferences"].map(item => (
          <div key={item} className="profile-item">
            <span className="profile-item-icon">◈</span>
            <span className="profile-item-text">{item}</span>
            <span className="profile-item-arrow">›</span>
          </div>
        ))}
      </div>
      <div className="profile-section">
        <div className="profile-section-title">Support</div>
        {["Help & FAQ","Terms of Service","Privacy Policy","Sign Out"].map(item => (
          <div key={item} className="profile-item">
            <span className="profile-item-icon">◍</span>
            <span className="profile-item-text">{item}</span>
            <span className="profile-item-arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── PROPERTY DETAIL ────────────────────────────────────────────────────────
  if (selectedProperty && bookingStep === null) {
    const p = selectedProperty;
    const nights = 3;
    const serviceFee = Math.round(p.price * nights * 0.12);
    const cleaning = 450;
    const total = p.price * nights + serviceFee + cleaning;

    return (
      <div className="app">
        <style>{css}</style>
        <div className="detail-screen">
          <div className="detail-hero">
            <img src={p.gallery[0]} alt={p.name} className="detail-hero-img" />
            <button className="detail-back" onClick={() => setSelectedProperty(null)}>←</button>
            <button className="detail-save" onClick={() => toggleFav(p.id)}>
              {favorites.has(p.id) ? "♥" : "♡"}
            </button>
            <div className="detail-gallery-counter">1 / {p.gallery.length}</div>
          </div>

          <div className="detail-content">
            <div className="detail-badge-row">
              <span className="detail-badge">{p.badge}</span>
              <div className="detail-rating">
                <span style={{ color: "var(--gold)" }}>★</span> {p.rating} · {p.reviews} reviews
              </div>
            </div>
            <h1 className="detail-name">{p.name}</h1>
            <div className="detail-area">{p.area} · Scottsdale Metro</div>

            <div className="detail-facts">
              <div className="detail-fact">
                <span className="detail-fact-val">{p.guests}</span>
                <span className="detail-fact-label">Guests</span>
              </div>
              <div className="detail-fact">
                <span className="detail-fact-val">{p.beds}</span>
                <span className="detail-fact-label">Beds</span>
              </div>
              <div className="detail-fact">
                <span className="detail-fact-val">{p.baths}</span>
                <span className="detail-fact-label">Baths</span>
              </div>
              <div className="detail-fact">
                <span className="detail-fact-val">{p.eventFriendly ? "Yes" : "No"}</span>
                <span className="detail-fact-label">Events</span>
              </div>
            </div>

            <p className="detail-desc">{p.description}</p>

            <div className="detail-section-title">Amenities</div>
            <div className="amenities-grid">
              {[...p.tags, "High-Speed WiFi", "Smart Home", "Climate Control", "Premium Linens"].map(a => (
                <div key={a} className="amenity-item">
                  <div className="amenity-dot" />
                  <span>{a}</span>
                </div>
              ))}
            </div>

            <div className="divider" style={{ margin: "4px 0 24px" }} />

            <div className="detail-section-title">Concierge Services</div>
            <div className="concierge-grid">
              {CONCIERGE_SERVICES.map(s => (
                <div key={s.name} className="concierge-item">
                  <span className="concierge-item-icon">{s.icon}</span>
                  <div className="concierge-item-name">{s.name}</div>
                  <div className="concierge-item-desc">{s.desc}</div>
                </div>
              ))}
            </div>

            <div className="divider" style={{ margin: "4px 0 24px" }} />

            <div className="detail-section-title">House Rules</div>
            <div style={{ marginBottom: 24 }}>
              {[
                `Check-in after 4:00 PM`,
                `Check-out before 11:00 AM`,
                `Maximum ${p.guests} guests`,
                `Events: ${p.eventFriendly ? "Permitted with prior approval" : "Not permitted"}`,
                `Pets: ${p.petFriendly ? "Welcome" : "Not permitted"}`,
                `Security deposit required`,
                `ID verification required`,
                `Host approval required`,
              ].map(r => (
                <div key={r} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "7px 0", borderBottom: "1px solid var(--cream)", fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 300 }}>
                  <span style={{ color: "var(--gold)", marginTop: 1 }}>—</span> {r}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="booking-cta">
          <div className="booking-price-row">
            <span className="booking-price">${p.price.toLocaleString()}</span>
            <span className="booking-price-night">per night</span>
            <div className="booking-rating">
              <span style={{ color: "var(--gold)" }}>★</span> {p.rating}
            </div>
          </div>
          <button className="btn-primary" onClick={() => setBookingStep("form")}>
            Request to Book
          </button>
          <button className="btn-secondary">Ask Concierge</button>
        </div>
      </div>
    );
  }

  // ── BOOKING FORM ───────────────────────────────────────────────────────────
  if (bookingStep === "form") {
    const p = selectedProperty;
    return (
      <div className="app">
        <style>{css}</style>
        <div className="booking-screen">
          <div className="booking-header">
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", marginBottom: 16, fontSize: "0.8rem", letterSpacing: "0.1em" }} onClick={() => setBookingStep(null)}>
              ← Back
            </button>
            <div className="booking-step-label">Step 1 of 2</div>
            <h2 className="booking-screen-title">Your Request</h2>
          </div>
          <div className="booking-body">
            <div className="booking-prop-summary">
              <img src={p.thumb} alt={p.name} className="booking-prop-img" />
              <div>
                <div className="booking-prop-name">{p.name}</div>
                <div className="booking-prop-area">{p.area}</div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Check-in</label>
                <input type="date" className="form-input" defaultValue="2025-06-14" />
              </div>
              <div className="form-group">
                <label className="form-label">Check-out</label>
                <input type="date" className="form-input" defaultValue="2025-06-17" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Number of Guests</label>
              <input type="number" className="form-input" placeholder="How many guests?" min={1} max={p.guests} defaultValue={4} />
            </div>

            <div className="form-group">
              <label className="form-label">Trip Type</label>
              <div className="trip-type-grid">
                {[{label:"Stay",icon:"🏡",val:"stay"},{label:"Event",icon:"🥂",val:"event"},{label:"Both",icon:"✦",val:"both"}].map(t => (
                  <div key={t.val} className={`trip-type-btn${tripType===t.val?" active":""}`} onClick={() => setTripType(t.val)}>
                    <span className="trip-type-icon">{t.icon}</span>
                    <span className="trip-type-label">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tell us about your trip</label>
              <textarea className="form-input" rows={3} placeholder="Occasion, special requests, anything we should know..." style={{ resize: "none", lineHeight: 1.6 }} />
            </div>

            <div className="form-group">
              <label className="form-label">Concierge Interest</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Private Chef","Car Service","Spa","Groceries","Decor","Security"].map(s => (
                  <div key={s} className="filter-chip" style={{ cursor: "pointer" }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="booking-cta">
          <button className="btn-primary" onClick={() => setBookingStep("review")}>
            Review Request
          </button>
        </div>
      </div>
    );
  }

  // ── BOOKING REVIEW ─────────────────────────────────────────────────────────
  if (bookingStep === "review") {
    const p = selectedProperty;
    const nights = 3;
    const nightly = p.price * nights;
    const serviceFee = Math.round(nightly * 0.12);
    const cleaning = 450;
    const deposit = 2000;
    const total = nightly + serviceFee + cleaning;

    return (
      <div className="app">
        <style>{css}</style>
        <div className="booking-screen">
          <div className="booking-header">
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", marginBottom: 16, fontSize: "0.8rem", letterSpacing: "0.1em" }} onClick={() => setBookingStep("form")}>
              ← Back
            </button>
            <div className="booking-step-label">Step 2 of 2</div>
            <h2 className="booking-screen-title">Review & Submit</h2>
          </div>
          <div className="booking-body">
            <div className="booking-prop-summary">
              <img src={p.thumb} alt={p.name} className="booking-prop-img" />
              <div>
                <div className="booking-prop-name">{p.name}</div>
                <div className="booking-prop-area">June 14–17 · 3 nights · 4 guests</div>
              </div>
            </div>

            <div className="price-breakdown">
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 500, marginBottom: 8 }}>Price Breakdown</div>
              <div className="price-row"><span>${p.price.toLocaleString()} × 3 nights</span><span>${nightly.toLocaleString()}</span></div>
              <div className="price-row"><span>Cleaning fee</span><span>${cleaning}</span></div>
              <div className="price-row"><span>Service fee</span><span>${serviceFee.toLocaleString()}</span></div>
              <div className="price-row"><span>Security deposit (refundable)</span><span>${deposit.toLocaleString()}</span></div>
              <div className="price-row total"><span>Total</span><span>${total.toLocaleString()}</span></div>
            </div>

            <div style={{ background: "white", border: "1px solid var(--cream)", borderRadius: "var(--radius-card)", padding: 16, marginBottom: 18 }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 500, marginBottom: 10 }}>What happens next</div>
              {["Your request will be reviewed within 24 hours", "Host approval is required before payment", "You'll receive a confirmation via email and in-app", "Payment captured only after approval"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.5, marginBottom: 8 }}>
                  <span style={{ color: "var(--gold)", fontFamily: "var(--serif)" }}>{i+1}.</span> {s}
                </div>
              ))}
            </div>

            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6, fontWeight: 300 }}>
              By submitting you agree to our Terms of Service, Cancellation Policy, and House Rules.
            </div>
          </div>
        </div>
        <div className="booking-cta">
          <button className="btn-primary gold" onClick={() => setBookingStep("confirm")}>
            Submit Request
          </button>
        </div>
      </div>
    );
  }

  // ── BOOKING CONFIRM ────────────────────────────────────────────────────────
  if (bookingStep === "confirm") {
    return (
      <div className="app">
        <style>{css}</style>
        <div className="confirm-screen fade-in">
          <div className="confirm-icon">◈</div>
          <h2 className="confirm-title">Request Submitted</h2>
          <p className="confirm-sub">
            Your booking request for {selectedProperty.name} has been received.
            A member of our team will review and respond within 24 hours.
          </p>
          <div className="confirm-ref">Reference: MP-{Math.random().toString(36).substr(2,8).toUpperCase()}</div>
          <button className="btn-primary" style={{ background: "var(--gold)", color: "var(--charcoal)", maxWidth: 280 }} onClick={() => { setBookingStep(null); setSelectedProperty(null); setTab("trips"); }}>
            View My Trips
          </button>
          <button className="btn-secondary" style={{ maxWidth: 280, marginTop: 10, borderColor: "rgba(212,201,181,0.3)", color: "var(--taupe)" }} onClick={() => { setBookingStep(null); setSelectedProperty(null); setTab("home"); }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── MAIN APP ───────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <style>{css}</style>

      {/* Splash */}
      <div className={`splash${splashOut ? " out" : ""}`}>
        <div className="splash-wordmark">Monarc Privé</div>
        <div className="splash-sub">Luxury Estates · Scottsdale</div>
        <div className="splash-line" />
      </div>

      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => setTab("home")}>
          Monarc<span>·</span>Privé
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={() => setTab("messages")}>
            ✉
            <span className="nav-badge" />
          </button>
          <button className="nav-btn" onClick={() => setTab("profile")}>⊙</button>
        </div>
      </nav>

      {/* Screen content */}
      <main style={{ paddingBottom: tab === "home" ? 0 : 0 }}>
        {tab === "home" && renderHome()}
        {tab === "search" && renderSearch()}
        {tab === "saved" && renderSaved()}
        {tab === "trips" && renderTrips()}
        {tab === "messages" && renderMessages()}
        {tab === "profile" && renderProfile()}
      </main>

      {/* Bottom Tab */}
      <div className="bottom-tab">
        {[
          { id: "home", icon: "⌂", label: "Home" },
          { id: "search", icon: "⌕", label: "Explore" },
          { id: "saved", icon: "♡", label: "Saved" },
          { id: "trips", icon: "◌", label: "Trips" },
          { id: "messages", icon: "✉", label: "Messages" },
        ].map(t => (
          <div key={t.id} className={`tab-item${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
            <span className="tab-icon">{tab === t.id && t.id === "saved" ? "♥" : t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROPERTY CARD COMPONENT ──────────────────────────────────────────────────
function PropertyCard({ p, favorites, toggleFav, onSelect }) {
  return (
    <div className="card" onClick={onSelect}>
      <div className="card-img-wrap">
        <img src={p.thumb} alt={p.name} className="card-img" loading="lazy" />
        <span className="card-badge">{p.badge}</span>
        <button className="card-fav" onClick={e => { e.stopPropagation(); toggleFav(p.id); }}>
          <span style={{ color: favorites.has(p.id) ? "#e74c3c" : "white" }}>
            {favorites.has(p.id) ? "♥" : "♡"}
          </span>
        </button>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <div>
            <div className="card-name">{p.name}</div>
            <div className="card-area">{p.area}</div>
          </div>
          <div className="card-price">
            <span className="card-price-amount">${p.price.toLocaleString()}</span>
            <span className="card-price-night">/ night</span>
          </div>
        </div>
        <div className="card-tags">
          {p.tags.slice(0, 3).map(t => <span key={t} className="card-tag">{t}</span>)}
        </div>
        <div className="card-rating">
          <span className="card-rating-star">★</span>
          <span>{p.rating}</span>
          <span style={{ color: "var(--sand)" }}>· {p.reviews} reviews</span>
          <span style={{ marginLeft: "auto", fontSize: "0.62rem", color: "var(--text-muted)" }}>
            {p.beds} bd · {p.baths} ba · Sleeps {p.guests}
          </span>
        </div>
      </div>
    </div>
  );
}
