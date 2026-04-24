import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   MONARC PRIVÉ — PARTNER HUB
   4 Sections:
   1. List Your Property  ($25/mo + 3% host fee)
   2. Property Listings   (guest browse)
   3. Real Estate Agents  ($50/mo ad cards)
   4. Experiences         ($100/mo business listings)
═══════════════════════════════════════════════════════════════ */

// ── MOCK DATA ────────────────────────────────────────────────

const PROPERTIES = [
  { id:1, name:"Villa Dorada", area:"Paradise Valley", beds:5, baths:5.5, guests:10, price:2400, badge:"New", img:"https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&q=85", host:"Meridian Estates", eventReady:true, pet:false, tags:["Pool","Spa","Golf View"] },
  { id:2, name:"The Obsidian House", area:"North Scottsdale", beds:4, baths:4, guests:8, price:1800, badge:"Popular", img:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=700&q=85", host:"AZ Luxury Homes", eventReady:false, pet:true, tags:["Mountain View","Pool","Gym"] },
  { id:3, name:"Amber Ridge Estate", area:"Scottsdale", beds:6, baths:6, guests:14, price:3200, badge:"Featured", img:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=85", host:"Pinnacle Stays", eventReady:true, pet:false, tags:["Event-Ready","Chef Kitchen","Theater"] },
  { id:4, name:"Copper Canyon Villa", area:"Paradise Valley", beds:7, baths:8, guests:16, price:4800, badge:"Elite", img:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700&q=85", host:"Premier Rentals AZ", eventReady:true, pet:true, tags:["Security","Pool","Firepit"] },
  { id:5, name:"Sonoran Light House", area:"North Scottsdale", beds:3, baths:3.5, guests:6, price:1200, badge:"Curated", img:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=85", host:"Desert Living Co", eventReady:false, pet:true, tags:["Modern","Pool","Wellness"] },
  { id:6, name:"The Sage Compound", area:"Scottsdale", beds:8, baths:9, guests:20, price:5500, badge:"Elite", img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=85", host:"Luxe AZ Properties", eventReady:true, pet:false, tags:["Compound","Event-Ready","Private Security"] },
];

const AGENTS = [
  { id:1, name:"Alexandra Voss", title:"Luxury Estate Specialist", agency:"Russ Lyon Sotheby's International", years:14, sales:"$280M+", areas:["Paradise Valley","Scottsdale","Arcadia"], phone:"(480) 555-0101", email:"avoss@russlyon.com", img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=85", badge:"Top Producer", specialties:["Ultra-Luxury","New Construction","Investment"] },
  { id:2, name:"James Hollister", title:"Private Estate Advisor", agency:"Compass Luxury Division", years:18, sales:"$420M+", areas:["Paradise Valley","Camelback","North Scottsdale"], phone:"(480) 555-0202", email:"jhollister@compass.com", img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=85", badge:"Elite Partner", specialties:["Off-Market","Investment","1031 Exchange"] },
  { id:3, name:"Sophia Laurent", title:"Luxury Residential Specialist", agency:"The Agency AZ", years:11, sales:"$195M+", areas:["Scottsdale","Paradise Valley","McCormick Ranch"], phone:"(480) 555-0303", email:"slaurent@theagency.com", img:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=85", badge:"Top Producer", specialties:["Luxury Residential","Relocation","Second Homes"] },
  { id:4, name:"Marcus Chen", title:"Investment & Estate Advisor", agency:"Engel & Völkers Scottsdale", years:16, sales:"$340M+", areas:["North Scottsdale","Troon","DC Ranch"], phone:"(480) 555-0404", email:"mchen@evaz.com", img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=85", badge:"Elite Partner", specialties:["Investment","New Development","Golf Properties"] },
  { id:5, name:"Isabella Fontaine", title:"Ultra-Luxury Estate Director", agency:"Douglas Elliman Arizona", years:20, sales:"$510M+", areas:["Paradise Valley","Biltmore","Arcadia"], phone:"(480) 555-0505", email:"ifontaine@elliman.com", img:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&q=85", badge:"Founding Partner", specialties:["Estates $5M+","Architecture","International Buyers"] },
  { id:6, name:"William Ashford", title:"Private Client Specialist", agency:"Christie's International RE", years:22, sales:"$680M+", areas:["All Greater Scottsdale","Paradise Valley"], phone:"(480) 555-0606", email:"washford@christies.com", img:"https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=85", badge:"Founding Partner", specialties:["Estate Sales","Auction","Private Portfolio"] },
];

const EXPERIENCES = [
  { id:1, name:"Desert Jeep Adventures", category:"Outdoor & Adventure", host:"Sonoran Outfitters", price:285, per:"person", duration:"4 hours", groupMin:2, groupMax:12, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85", badge:"Top Rated", desc:"Private guided jeep tours through the McDowell Mountains. Sundowner routes, bespoke catering packages, and full vehicle exclusivity available.", tags:["Private","Adventure","Scenic"] },
  { id:2, name:"Horseback Sunrise Experience", category:"Equestrian", host:"Pinnacle Peak Stables", price:420, per:"person", duration:"3 hours", groupMin:2, groupMax:8, img:"https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=700&q=85", badge:"Member Favorite", desc:"Private sunrise rides through the Sonoran Desert with a champagne breakfast at the summit. Horses matched to your experience level.", tags:["Sunrise","Champagne","Private"] },
  { id:3, name:"Private Aviation Experience", category:"Aviation", host:"Scottsdale Air Center", price:1800, per:"flight", duration:"2 hours", groupMin:1, groupMax:6, img:"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&q=85", badge:"Ultra-Luxury", desc:"Door-to-door private air charter service from Scottsdale Airport. Grand Canyon, Sedona, and Wine Country routes available.", tags:["Private Jet","Charter","Exclusive"] },
  { id:4, name:"Michelin Dining at Home", category:"Private Dining", host:"Culinary Estates AZ", price:950, per:"event", duration:"4–6 hours", groupMin:4, groupMax:20, img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=85", badge:"New", desc:"A rotating roster of Michelin-trained chefs create fully custom tasting menus in your private estate. Wine pairings and full service included.", tags:["Chef","Tasting Menu","In-Villa"] },
  { id:5, name:"Desert Wellness Immersion", category:"Wellness & Spa", host:"Sanctuary Wellness AZ", price:680, per:"person", duration:"Full Day", groupMin:1, groupMax:6, img:"https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&q=85", badge:"Member Favorite", desc:"In-villa full-day wellness retreat: sound bath at sunrise, IV therapy, massage, Ayurvedic consultation, and organic plant-based cuisine.", tags:["Wellness","IV Therapy","Meditation"] },
  { id:6, name:"Golf & Caddie Experience", category:"Golf", host:"PV Golf Concierge", price:480, per:"person", duration:"18 holes", groupMin:1, groupMax:4, img:"https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=700&q=85", badge:"Top Rated", desc:"Preferred tee times at TPC Scottsdale, Desert Highlands, and Troon North with private caddie, club fitting, and post-round bourbon tasting.", tags:["Golf","Caddie","VIP Access"] },
];

// ── STYLES ──────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ivory:#F8F5F0; --cream:#EDE8DF; --sand:#D4C9B5; --taupe:#9E8E78;
  --gold:#C9A96E; --gold-l:#E2C896; --gold-p:#F5EDD8;
  --ink:#161412; --ink-m:#222018; --ink-s:#2E2C28; --ink-xs:#3A3834;
  --t1:#F8F5F0; --t2:rgba(248,245,240,.65); --t3:rgba(248,245,240,.4); --t4:rgba(248,245,240,.2);
  --border:rgba(212,201,181,.12); --border-h:rgba(201,169,110,.3);
  --serif:'Cormorant Garamond',Georgia,serif; --sans:'Jost',system-ui,sans-serif;
  --green:#5BAF84; --red:#E05252; --amber:#E8A838;
  --r:3px;
}
html,body{min-height:100%;font-family:var(--sans);background:var(--ink);color:var(--t1);-webkit-font-smoothing:antialiased;overflow-x:hidden}

/* ── NAV ── */
.pnav{position:sticky;top:0;z-index:100;height:60px;background:rgba(22,20,18,.96);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 40px;gap:0}
.pnav-logo{font-family:var(--serif);font-size:1.1rem;font-weight:300;letter-spacing:.18em;text-transform:uppercase;color:var(--t1);cursor:pointer;margin-right:40px;flex-shrink:0}
.pnav-logo span{color:var(--gold)}
.pnav-tabs{display:flex;flex:1;height:100%;overflow-x:auto;scrollbar-width:none}
.pnav-tabs::-webkit-scrollbar{display:none}
.pnav-tab{display:flex;align-items:center;gap:8px;padding:0 20px;font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;font-weight:500;color:var(--t3);cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;transition:all .2s;flex-shrink:0}
.pnav-tab:hover{color:var(--t2)}
.pnav-tab.active{color:var(--gold);border-bottom-color:var(--gold)}
.pnav-tab-icon{font-size:.9rem}
.pnav-right{margin-left:auto;display:flex;gap:10px;flex-shrink:0;padding-left:20px}
.pnav-btn{background:none;border:1px solid var(--border);color:var(--t2);font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;font-family:var(--sans);padding:8px 16px;cursor:pointer;transition:all .2s;border-radius:2px;white-space:nowrap}
.pnav-btn:hover{border-color:var(--gold);color:var(--gold)}
.pnav-btn.cta{background:var(--gold);border-color:var(--gold);color:var(--ink);font-weight:600}
.pnav-btn.cta:hover{background:var(--gold-l)}

/* ── PAGE HEADER ── */
.page-hero{position:relative;overflow:hidden;height:340px}
.page-hero-img{width:100%;height:100%;object-fit:cover}
.page-hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(22,20,18,.4) 0%,rgba(22,20,18,.85) 100%)}
.page-hero-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:40px 48px}
.page-hero-eyebrow{font-size:.58rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);margin-bottom:10px;display:flex;align-items:center;gap:10px}
.page-hero-eyebrow::before{content:'';width:24px;height:1px;background:var(--gold)}
.page-hero-title{font-family:var(--serif);font-size:clamp(2rem,4vw,3.5rem);font-weight:300;color:var(--t1);line-height:1.1;letter-spacing:.02em}
.page-hero-title em{font-style:italic;color:var(--gold-l)}
.page-hero-desc{font-size:.82rem;color:var(--t2);font-weight:300;line-height:1.7;margin-top:10px;max-width:500px}

/* ── PRICING BANNER ── */
.pricing-banner{background:var(--ink-m);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:18px 48px;display:flex;gap:0;overflow-x:auto;scrollbar-width:none}
.pricing-banner::-webkit-scrollbar{display:none}
.pricing-pill{display:flex;align-items:center;gap:10px;padding:0 24px 0 0;border-right:1px solid var(--border);flex-shrink:0}
.pricing-pill:last-child{border-right:none;padding-right:0}
.pricing-pill:first-child{padding-left:0}
.pp-icon{font-size:1rem;color:var(--gold);flex-shrink:0}
.pp-amount{font-family:var(--serif);font-size:1.3rem;font-weight:300;color:var(--gold)}
.pp-label{font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--t3);font-weight:400;line-height:1.4}

/* ── FILTER BAR ── */
.filter-bar{padding:20px 48px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;border-bottom:1px solid var(--border)}
.filter-chip{background:none;border:1px solid var(--border);color:var(--t3);font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;font-family:var(--sans);padding:7px 16px;cursor:pointer;transition:all .18s;border-radius:2px;white-space:nowrap;font-weight:400}
.filter-chip:hover{border-color:var(--border-h);color:var(--t2)}
.filter-chip.active{background:rgba(201,169,110,.1);border-color:var(--gold);color:var(--gold-l)}
.filter-search{flex:1;min-width:200px;background:rgba(248,245,240,.04);border:1px solid var(--border);border-radius:2px;padding:9px 14px;font-family:var(--sans);font-size:.8rem;color:var(--t1);outline:none;transition:border-color .2s;font-weight:300}
.filter-search:focus{border-color:var(--border-h)}
.filter-search::placeholder{color:var(--t3)}
.filter-count{font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--t3);margin-left:auto;white-space:nowrap}

/* ── GRID LAYOUTS ── */
.content-area{padding:32px 48px 80px}
.prop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.agent-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.exp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}

/* ── PROPERTY CARD ── */
.prop-card{background:var(--ink-m);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;cursor:pointer;transition:all .25s}
.prop-card:hover{border-color:var(--border-h);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.35)}
.prop-card-img-wrap{position:relative;padding-top:60%;overflow:hidden}
.prop-card-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
.prop-card:hover .prop-card-img{transform:scale(1.04)}
.prop-card-badge{position:absolute;top:12px;left:12px;background:rgba(22,20,18,.88);border:1px solid rgba(201,169,110,.3);font-size:.52rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);padding:4px 10px;border-radius:2px;font-weight:500}
.prop-card-fav{position:absolute;top:10px;right:12px;background:none;border:none;font-size:1.1rem;cursor:pointer;filter:drop-shadow(0 1px 4px rgba(0,0,0,.5));transition:transform .2s}
.prop-card-fav:hover{transform:scale(1.15)}
.prop-card-body{padding:16px 18px 18px}
.prop-card-name{font-family:var(--serif);font-size:1.1rem;font-weight:400;color:var(--t1);letter-spacing:.02em;margin-bottom:3px}
.prop-card-area{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--taupe);margin-bottom:10px}
.prop-card-meta{display:flex;gap:12px;font-size:.68rem;color:var(--t2);font-weight:300;margin-bottom:10px}
.prop-card-meta span{display:flex;align-items:center;gap:4px}
.prop-card-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.prop-card-tag{font-size:.56rem;letter-spacing:.1em;color:var(--t3);border:1px solid rgba(212,201,181,.1);padding:3px 8px;border-radius:2px}
.prop-card-footer{display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(212,201,181,.07)}
.prop-card-price{font-family:var(--serif);font-size:1.1rem;color:var(--t1)}
.prop-card-price-night{font-size:.6rem;color:var(--taupe);font-weight:300}
.prop-card-host{font-size:.6rem;color:var(--taupe);font-weight:300;letter-spacing:.05em}
.prop-card-cta{font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);font-weight:500;cursor:pointer;background:none;border:none;font-family:var(--sans);transition:color .2s}
.prop-card-cta:hover{color:var(--gold-l)}

/* ── AGENT CARD ── */
.agent-card{background:var(--ink-m);border:1px solid var(--border);border-radius:var(--r);padding:28px;cursor:pointer;transition:all .25s;position:relative;overflow:hidden}
.agent-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);opacity:0;transition:opacity .3s}
.agent-card:hover{border-color:var(--border-h);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.3)}
.agent-card:hover::before{opacity:1}
.agent-card-top{display:flex;gap:16px;margin-bottom:18px}
.agent-avatar{width:68px;height:68px;border-radius:50%;object-fit:cover;border:2px solid rgba(201,169,110,.2);flex-shrink:0}
.agent-info{flex:1}
.agent-badge-row{margin-bottom:6px}
.agent-badge{font-size:.5rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,169,110,.3);padding:3px 9px;border-radius:1px;font-weight:500}
.agent-name{font-family:var(--serif);font-size:1.15rem;font-weight:400;color:var(--t1);letter-spacing:.02em;margin-bottom:2px}
.agent-title{font-size:.65rem;color:var(--taupe);font-weight:300;letter-spacing:.06em}
.agent-agency{font-size:.68rem;color:var(--gold-l);font-weight:400;margin-top:4px;letter-spacing:.04em}
.agent-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;padding:14px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.agent-stat-val{font-family:var(--serif);font-size:1rem;color:var(--t1);display:block;font-weight:400}
.agent-stat-label{font-size:.52rem;letter-spacing:.15em;text-transform:uppercase;color:var(--taupe);margin-top:2px;display:block}
.agent-areas{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.agent-area-tag{font-size:.56rem;letter-spacing:.1em;text-transform:uppercase;color:var(--taupe);border:1px solid rgba(212,201,181,.1);padding:3px 8px;border-radius:2px}
.agent-specialties{font-size:.68rem;color:var(--t2);font-weight:300;line-height:1.6;margin-bottom:16px}
.agent-contact-row{display:flex;gap:8px}
.agent-contact-btn{flex:1;background:none;border:1px solid var(--border);color:var(--t2);font-size:.58rem;letter-spacing:.15em;text-transform:uppercase;font-family:var(--sans);padding:9px 8px;cursor:pointer;transition:all .2s;border-radius:2px;font-weight:400}
.agent-contact-btn:hover{border-color:var(--gold);color:var(--gold)}
.agent-contact-btn.primary{background:var(--gold);border-color:var(--gold);color:var(--ink);font-weight:600}
.agent-contact-btn.primary:hover{background:var(--gold-l)}

/* ── EXPERIENCE CARD ── */
.exp-card{background:var(--ink-m);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;cursor:pointer;transition:all .25s}
.exp-card:hover{border-color:var(--border-h);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.35)}
.exp-card-img-wrap{position:relative;padding-top:56%;overflow:hidden}
.exp-card-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
.exp-card:hover .exp-card-img{transform:scale(1.05)}
.exp-card-badge{position:absolute;top:12px;left:12px;background:rgba(22,20,18,.88);border:1px solid rgba(201,169,110,.3);font-size:.52rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);padding:4px 10px;border-radius:2px;font-weight:500}
.exp-card-cat{position:absolute;top:12px;right:12px;background:rgba(22,20,18,.8);font-size:.52rem;letter-spacing:.15em;text-transform:uppercase;color:var(--t2);padding:4px 9px;border-radius:2px}
.exp-card-body{padding:18px}
.exp-card-name{font-family:var(--serif);font-size:1.1rem;font-weight:400;color:var(--t1);margin-bottom:4px;letter-spacing:.02em}
.exp-card-host{font-size:.62rem;color:var(--taupe);font-weight:300;letter-spacing:.06em;margin-bottom:10px}
.exp-card-desc{font-size:.74rem;color:var(--t2);font-weight:300;line-height:1.65;margin-bottom:14px}
.exp-card-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.exp-card-tag{font-size:.56rem;letter-spacing:.1em;color:var(--taupe);border:1px solid rgba(212,201,181,.1);padding:3px 8px;border-radius:2px}
.exp-card-footer{display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid rgba(212,201,181,.07)}
.exp-card-price-wrap{}
.exp-card-price{font-family:var(--serif);font-size:1.2rem;color:var(--t1)}
.exp-card-per{font-size:.6rem;color:var(--taupe);font-weight:300;margin-top:1px}
.exp-card-detail{display:flex;gap:12px;font-size:.62rem;color:var(--t3);font-weight:300}
.exp-book-btn{background:none;border:1px solid rgba(201,169,110,.3);color:var(--gold);font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;font-family:var(--sans);padding:8px 16px;cursor:pointer;transition:all .2s;border-radius:2px;font-weight:500}
.exp-book-btn:hover{background:var(--gold);color:var(--ink)}

/* ── LISTING MODAL ── */
.modal-overlay{position:fixed;inset:0;z-index:500;background:rgba(16,14,12,.92);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:var(--ink-m);border:1px solid var(--border);border-radius:var(--r);width:100%;max-width:640px;max-height:90vh;overflow-y:auto;position:relative;animation:slideUp .28s cubic-bezier(.22,.68,0,1.2)}
.modal-scroll{overflow-y:auto;max-height:calc(90vh - 120px)}
@keyframes slideUp{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}
.modal-header{padding:28px 32px 22px;border-bottom:1px solid var(--border);position:sticky;top:0;background:var(--ink-m);z-index:2}
.modal-close{position:absolute;top:18px;right:20px;background:none;border:none;color:var(--t3);cursor:pointer;font-size:1.1rem;transition:color .15s;padding:4px}
.modal-close:hover{color:var(--t1)}
.modal-eyebrow{font-size:.55rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
.modal-title{font-family:var(--serif);font-size:1.7rem;font-weight:300;color:var(--t1);letter-spacing:.02em}
.modal-sub{font-size:.72rem;color:var(--taupe);font-weight:300;margin-top:4px}
.modal-body{padding:26px 32px 32px}
.modal-pricing{background:rgba(248,245,240,.03);border:1px solid rgba(201,169,110,.15);border-radius:2px;padding:18px;margin-bottom:24px;display:flex;gap:0}
.modal-price-item{flex:1;text-align:center;border-right:1px solid var(--border)}
.modal-price-item:last-child{border-right:none}
.modal-price-val{font-family:var(--serif);font-size:1.5rem;color:var(--gold);font-weight:300}
.modal-price-label{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--taupe);margin-top:3px}
.form-group{margin-bottom:16px}
.form-label{font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;color:var(--taupe);display:block;margin-bottom:7px;font-weight:500}
.form-input{width:100%;background:rgba(248,245,240,.04);border:1px solid var(--border);border-radius:2px;padding:12px 14px;font-family:var(--sans);font-size:.82rem;color:var(--t1);font-weight:300;outline:none;transition:border-color .2s}
.form-input:focus{border-color:var(--border-h)}
.form-input::placeholder{color:var(--t3)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.form-select{background:rgba(248,245,240,.04);border:1px solid var(--border);border-radius:2px;padding:12px 14px;font-family:var(--sans);font-size:.82rem;color:var(--t1);outline:none;width:100%;transition:border-color .2s;-webkit-appearance:none;cursor:pointer}
.form-select:focus{border-color:var(--border-h)}
.form-textarea{width:100%;background:rgba(248,245,240,.04);border:1px solid var(--border);border-radius:2px;padding:12px 14px;font-family:var(--sans);font-size:.82rem;color:var(--t1);font-weight:300;outline:none;resize:vertical;min-height:80px;transition:border-color .2s;line-height:1.6}
.form-textarea:focus{border-color:var(--border-h)}
.form-textarea::placeholder{color:var(--t3)}
.checkbox-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
.checkbox-item{display:flex;align-items:center;gap:8px;cursor:pointer;padding:7px 12px;border:1px solid var(--border);border-radius:2px;transition:all .18s}
.checkbox-item:hover{border-color:var(--border-h)}
.checkbox-item.checked{border-color:var(--gold);background:rgba(201,169,110,.07)}
.checkbox-item input{display:none}
.checkbox-box{width:14px;height:14px;border:1px solid var(--border);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:.6rem;transition:all .15s;flex-shrink:0}
.checkbox-item.checked .checkbox-box{background:var(--gold);border-color:var(--gold);color:var(--ink)}
.checkbox-label{font-size:.68rem;color:var(--t2);font-weight:300;letter-spacing:.05em}
.upload-zone{border:1px dashed rgba(201,169,110,.25);border-radius:2px;padding:28px;text-align:center;cursor:pointer;transition:all .2s}
.upload-zone:hover{border-color:rgba(201,169,110,.5);background:rgba(201,169,110,.03)}
.upload-icon{font-size:1.5rem;color:var(--taupe);margin-bottom:8px}
.upload-text{font-size:.72rem;color:var(--taupe);font-weight:300;line-height:1.6}
.upload-text strong{color:var(--gold);font-weight:400}
.modal-section-title{font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;color:var(--taupe);margin-bottom:14px;margin-top:20px;font-weight:500;padding-top:16px;border-top:1px solid var(--border)}
.modal-section-title:first-child{border-top:none;padding-top:0;margin-top:0}
.modal-footer{padding:16px 32px 20px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end}
.modal-btn{background:none;border:1px solid var(--border);color:var(--t2);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;font-family:var(--sans);padding:12px 24px;cursor:pointer;transition:all .2s;border-radius:2px;font-weight:400}
.modal-btn:hover{border-color:var(--t2);color:var(--t1)}
.modal-btn.gold{background:var(--gold);border-color:var(--gold);color:var(--ink);font-weight:600}
.modal-btn.gold:hover{background:var(--gold-l)}
.modal-btn.gold:disabled{opacity:.5;cursor:not-allowed}

/* ── SUCCESS MODAL ── */
.success-content{text-align:center;padding:16px 0}
.success-icon-lg{font-size:2.8rem;color:var(--gold);margin-bottom:18px;display:block;animation:pop .4s cubic-bezier(.22,.68,0,1.2)}
@keyframes pop{from{transform:scale(0) rotate(-10deg)}to{transform:scale(1) rotate(0)}}
.success-title{font-family:var(--serif);font-size:2rem;font-weight:300;color:var(--t1);margin-bottom:10px;letter-spacing:.02em}
.success-sub{font-size:.78rem;color:var(--taupe);font-weight:300;line-height:1.75;max-width:380px;margin:0 auto 22px}
.success-ref{font-size:.6rem;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,169,110,.25);padding:9px 18px;display:inline-block;border-radius:2px;margin-bottom:26px}
.success-note{font-size:.7rem;color:var(--taupe);font-weight:300;line-height:1.6;font-style:italic}

/* ── HOST REVENUE CALC ── */
.revenue-calc{background:rgba(201,169,110,.05);border:1px solid rgba(201,169,110,.15);border-radius:var(--r);padding:24px;margin-bottom:24px}
.rc-title{font-family:var(--serif);font-size:1rem;color:var(--t1);margin-bottom:16px}
.rc-row{display:flex;justify-content:space-between;padding:7px 0;font-size:.78rem;font-weight:300;color:var(--t2);border-bottom:1px solid rgba(212,201,181,.07)}
.rc-row.total{color:var(--t1);font-weight:500;border-bottom:none;padding-top:12px;margin-top:4px;font-family:var(--serif);font-size:.95rem}
.rc-row span:last-child{color:var(--gold-l)}

/* ── EMPTY STATE ── */
.empty-state{text-align:center;padding:60px 20px;color:var(--t3)}
.empty-icon{font-size:2rem;margin-bottom:12px;display:block}
.empty-title{font-family:var(--serif);font-size:1.3rem;color:var(--t2);margin-bottom:6px}
.empty-sub{font-size:.75rem;color:var(--t3);font-weight:300;line-height:1.6}

/* ── REVENUE STRIP ── */
.revenue-strip{background:var(--ink-s);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:32px 48px;display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.rs-item{text-align:center}
.rs-label{font-size:.55rem;letter-spacing:.3em;text-transform:uppercase;color:var(--taupe);margin-bottom:6px}
.rs-value{font-family:var(--serif);font-size:1.8rem;color:var(--gold);font-weight:300}
.rs-sub{font-size:.6rem;color:var(--t3);font-weight:300;margin-top:3px}

/* ── PROGRESS STEPS ── */
.steps-row{display:flex;gap:0;padding:24px 48px;background:var(--ink-s);border-bottom:1px solid var(--border);overflow-x:auto}
.step{flex:1;display:flex;align-items:center;gap:0;min-width:fit-content}
.step-num{width:28px;height:28px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:600;color:var(--t3);flex-shrink:0;transition:all .2s}
.step.active .step-num{background:var(--gold);border-color:var(--gold);color:var(--ink)}
.step.done .step-num{background:rgba(91,175,132,.15);border-color:var(--green);color:var(--green)}
.step-label{font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);font-weight:400;padding:0 14px;white-space:nowrap;transition:color .2s}
.step.active .step-label{color:var(--t1)}
.step-line{flex:1;height:1px;background:var(--border);min-width:20px}

/* ── RESPONSIVE ── */
@media(max-width:1100px){.prop-grid,.agent-grid,.exp-grid{grid-template-columns:repeat(2,1fr)}.revenue-strip{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){.prop-grid,.agent-grid,.exp-grid{grid-template-columns:1fr}.page-hero-content{padding:24px 24px}.pricing-banner{padding:14px 20px}.filter-bar{padding:14px 20px}.content-area{padding:20px 20px 60px}.revenue-strip{grid-template-columns:1fr 1fr;padding:20px}.pnav{padding:0 16px}.modal{max-width:calc(100vw - 20px)}.modal-body{padding:20px}.modal-header{padding:20px 20px 16px}.modal-footer{padding:12px 20px}.form-row,.form-row-3{grid-template-columns:1fr}}
`;

// ── AMENITY OPTIONS ──────────────────────────────────────────
const AMENITY_OPTIONS = ["Pool","Hot Tub","Spa","Gym","Theater","Chef Kitchen","Golf Access","Mountain View","Firepit","Outdoor Kitchen","Security","Gated","Game Room","Wine Cellar","EV Charging","Pet-Friendly","Event-Ready","Parking 10+"];
const CATEGORY_OPTIONS = ["Outdoor & Adventure","Equestrian","Aviation","Private Dining","Wellness & Spa","Golf","Water Sports","Photography","Wine & Spirits","Cultural & Arts","Fitness","Nightlife"];
const SPECIALTY_OPTIONS = ["Ultra-Luxury","Investment Properties","New Construction","Off-Market","Golf Properties","Second Homes","Relocation","1031 Exchange","Estate Sales","International Buyers"];

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function PartnerHub() {
  const [tab, setTab] = useState("properties");
  const [modal, setModal] = useState(null); // null | 'list-property' | 'list-agent' | 'list-experience' | 'success'
  const [successType, setSuccessType] = useState("");
  const [favs, setFavs] = useState(new Set([1,4]));
  const [propFilter, setPropFilter] = useState("All");
  const [agentFilter, setAgentFilter] = useState("All");
  const [expFilter, setExpFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [formStep, setFormStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [checkedAmenities, setCheckedAmenities] = useState(new Set());
  const [checkedSpecialties, setCheckedSpecialties] = useState(new Set());
  const [propForm, setPropForm] = useState({ title:"", area:"", beds:"", baths:"", guests:"", price:"", cleanFee:"", description:"", eventReady:false, petFriendly:false, hostName:"", hostEmail:"", hostPhone:"", cardNumber:"", cardExpiry:"", cardCvc:"", cardName:"" });
  const [agentForm, setAgentForm] = useState({ name:"", title:"", agency:"", years:"", salesVolume:"", phone:"", email:"", bio:"", cardNumber:"", cardExpiry:"", cardCvc:"", cardName:"" });
  const [expForm, setExpForm] = useState({ name:"", category:"", host:"", price:"", per:"person", duration:"", groupMin:"", groupMax:"", description:"", contactName:"", contactEmail:"", contactPhone:"", cardNumber:"", cardExpiry:"", cardCvc:"", cardName:"" });

  const openModal = (type) => { setModal(type); setFormStep(1); };
  const closeModal = () => { setModal(null); setFormStep(1); setProcessing(false); };

  const toggleAmenity = (a) => setCheckedAmenities(prev => { const n = new Set(prev); n.has(a) ? n.delete(a) : n.add(a); return n; });
  const toggleSpecialty = (s) => setCheckedSpecialties(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });

  const handleSubmit = async (type) => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    setProcessing(false);
    setSuccessType(type);
    setModal("success");
  };

  const PROP_FILTERS = ["All","Paradise Valley","North Scottsdale","Scottsdale","Event-Ready","Pet-Friendly"];
  const AGENT_FILTERS = ["All","Paradise Valley","North Scottsdale","Scottsdale","Top Producer","Elite Partner"];
  const EXP_FILTERS = ["All","Outdoor & Adventure","Equestrian","Private Dining","Wellness & Spa","Golf","Aviation"];

  const filteredProps = PROPERTIES.filter(p => {
    if (propFilter === "Event-Ready") return p.eventReady;
    if (propFilter === "Pet-Friendly") return p.pet;
    if (propFilter !== "All") return p.area === propFilter;
    if (search) return p.name.toLowerCase().includes(search.toLowerCase()) || p.area.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const filteredAgents = AGENTS.filter(a => {
    if (agentFilter === "Top Producer") return a.badge === "Top Producer";
    if (agentFilter === "Elite Partner") return a.badge === "Elite Partner";
    if (agentFilter !== "All") return a.areas.some(ar => ar.includes(agentFilter));
    if (search) return a.name.toLowerCase().includes(search.toLowerCase()) || a.agency.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const filteredExp = EXPERIENCES.filter(e => {
    if (expFilter !== "All") return e.category === expFilter;
    if (search) return e.name.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const TAB_CONFIG = [
    { id:"properties", icon:"◈", label:"Private Estates", cta:"List Your Property", ctaFn:() => openModal("list-property") },
    { id:"agents", icon:"◉", label:"Real Estate Agents", cta:"Advertise as Agent", ctaFn:() => openModal("list-agent") },
    { id:"experiences", icon:"◌", label:"Experiences", cta:"List an Experience", ctaFn:() => openModal("list-experience") },
    { id:"revenue", icon:"◎", label:"Revenue Calculator", cta:null, ctaFn:null },
  ];

  const currentTab = TAB_CONFIG.find(t => t.id === tab);

  // ── PROPERTY LISTING MODAL ───────────────────────────────
  const renderPropertyModal = () => (
    <>
      <div className="modal-header">
        <button className="modal-close" onClick={closeModal}>✕</button>
        <div className="modal-eyebrow">Host Application</div>
        <div className="modal-title">List Your Property</div>
        <div className="modal-sub">$25/month · 3% fee on guest payment · 3% fee on host payout</div>
      </div>
      <div className="steps-row" style={{ padding:"16px 32px", background:"transparent", borderBottom:"1px solid var(--border)" }}>
        {["Property Details","Amenities & Rules","Host Info","Billing"].map((s,i) => (
          <div key={s} className={`step${formStep === i+1 ? " active" : ""}${formStep > i+1 ? " done" : ""}`}>
            <div className="step-num">{formStep > i+1 ? "✓" : i+1}</div>
            <div className="step-label">{s}</div>
            {i < 3 && <div className="step-line" />}
          </div>
        ))}
      </div>
      <div className="modal-scroll">
        <div className="modal-body">
          {formStep === 1 && (<>
            <div className="modal-pricing">
              <div className="modal-price-item"><div className="modal-price-val">$25</div><div className="modal-price-label">/ month listing</div></div>
              <div className="modal-price-item"><div className="modal-price-val">3%</div><div className="modal-price-label">guest booking fee</div></div>
              <div className="modal-price-item"><div className="modal-price-val">3%</div><div className="modal-price-label">host payout fee</div></div>
            </div>
            <div className="modal-section-title">Property Information</div>
            <div className="form-group"><label className="form-label">Property Name / Title</label><input className="form-input" placeholder="e.g. Villa Dorada at Paradise Valley" value={propForm.title} onChange={e => setPropForm(p=>({...p,title:e.target.value}))} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Location / Area</label>
                <select className="form-select" value={propForm.area} onChange={e => setPropForm(p=>({...p,area:e.target.value}))}>
                  <option value="">Select area</option>
                  {["Paradise Valley","North Scottsdale","Scottsdale","Old Town Scottsdale","Arcadia","Camelback","McCormick Ranch","Troon","DC Ranch"].map(a=><option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Nightly Rate ($)</label><input className="form-input" type="number" placeholder="e.g. 2500" value={propForm.price} onChange={e => setPropForm(p=>({...p,price:e.target.value}))} /></div>
            </div>
            <div className="form-row-3">
              <div className="form-group"><label className="form-label">Bedrooms</label><input className="form-input" type="number" placeholder="6" value={propForm.beds} onChange={e => setPropForm(p=>({...p,beds:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Bathrooms</label><input className="form-input" type="number" placeholder="6.5" step="0.5" value={propForm.baths} onChange={e => setPropForm(p=>({...p,baths:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Max Guests</label><input className="form-input" type="number" placeholder="12" value={propForm.guests} onChange={e => setPropForm(p=>({...p,guests:e.target.value}))} /></div>
            </div>
            <div className="form-group"><label className="form-label">Cleaning Fee ($)</label><input className="form-input" type="number" placeholder="450" value={propForm.cleanFee} onChange={e => setPropForm(p=>({...p,cleanFee:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Property Description</label><textarea className="form-textarea" rows={4} placeholder="Describe your property in editorial, luxury terms. What makes it exceptional?" value={propForm.description} onChange={e => setPropForm(p=>({...p,description:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Property Photos</label><div className="upload-zone"><div className="upload-icon">◌</div><div className="upload-text"><strong>Drop photos here</strong> or click to upload<br />Min. 8 high-resolution photos required · JPG, PNG · Max 20MB each</div></div></div>
          </>)}
          {formStep === 2 && (<>
            <div className="modal-section-title">Amenities</div>
            <div className="checkbox-row">
              {AMENITY_OPTIONS.map(a=>(
                <div key={a} className={`checkbox-item${checkedAmenities.has(a)?" checked":""}`} onClick={()=>toggleAmenity(a)}>
                  <div className="checkbox-box">{checkedAmenities.has(a)&&"✓"}</div>
                  <span className="checkbox-label">{a}</span>
                </div>
              ))}
            </div>
            <div className="modal-section-title">House Rules & Policies</div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Check-in Time</label><input className="form-input" placeholder="4:00 PM" /></div>
              <div className="form-group"><label className="form-label">Check-out Time</label><input className="form-input" placeholder="11:00 AM" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Minimum Stay (nights)</label><input className="form-input" type="number" placeholder="2" /></div>
              <div className="form-group"><label className="form-label">Security Deposit ($)</label><input className="form-input" type="number" placeholder="2000" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Events Allowed?</label>
                <select className="form-select" value={propForm.eventReady} onChange={e=>setPropForm(p=>({...p,eventReady:e.target.value}))}>
                  <option value={false}>No</option>
                  <option value={true}>Yes — with prior approval</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Pets Allowed?</label>
                <select className="form-select" value={propForm.petFriendly} onChange={e=>setPropForm(p=>({...p,petFriendly:e.target.value}))}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Additional Rules / Notes</label><textarea className="form-textarea" rows={3} placeholder="Any additional house rules, quiet hours, parking details..." /></div>
          </>)}
          {formStep === 3 && (<>
            <div className="modal-section-title">Your Contact Information</div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Your Name / Company</label><input className="form-input" placeholder="Name or company" value={propForm.hostName} onChange={e=>setPropForm(p=>({...p,hostName:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Phone Number</label><input className="form-input" placeholder="+1 (480) 555-0000" value={propForm.hostPhone} onChange={e=>setPropForm(p=>({...p,hostPhone:e.target.value}))} /></div>
            </div>
            <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" placeholder="your@email.com" value={propForm.hostEmail} onChange={e=>setPropForm(p=>({...p,hostEmail:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Create Password</label><input className="form-input" type="password" placeholder="Min. 8 characters" /></div>
            <div style={{background:"rgba(248,245,240,.03)",border:"1px solid var(--border)",borderRadius:2,padding:"16px",marginTop:18}}>
              <div style={{fontSize:".68rem",color:"var(--taupe)",fontWeight:300,lineHeight:1.7}}>
                By listing your property, you agree to our <span style={{color:"var(--gold)",cursor:"pointer"}}>Host Agreement</span>, <span style={{color:"var(--gold)",cursor:"pointer"}}>Privacy Policy</span>, and authorize Monarc Privé to collect 3% of guest payments and retain 3% from your payouts on confirmed bookings. Monthly listing fee of $25 will be charged to the card provided.
              </div>
            </div>
          </>)}
          {formStep === 4 && (<>
            <div className="modal-section-title">Monthly Subscription — $25/month</div>
            <div style={{background:"rgba(201,169,110,.05)",border:"1px solid rgba(201,169,110,.15)",borderRadius:2,padding:16,marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".78rem",color:"var(--t2)",fontWeight:300,padding:"5px 0"}}><span>Property listing fee</span><span style={{color:"var(--gold-l)"}}>$25.00 / month</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".78rem",color:"var(--t2)",fontWeight:300,padding:"5px 0",borderTop:"1px solid var(--border)",marginTop:6,paddingTop:10,fontFamily:"var(--serif)",fontSize:".95rem",color:"var(--t1)"}}><span>Total due today</span><span>$25.00</span></div>
              <div style={{fontSize:".62rem",color:"var(--taupe)",fontWeight:300,marginTop:8}}>+ 3% fee collected from guest at booking · 3% deducted from your payout</div>
            </div>
            <div className="form-group"><label className="form-label">Cardholder Name</label><input className="form-input" placeholder="Name on card" value={propForm.cardName} onChange={e=>setPropForm(p=>({...p,cardName:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Card Number</label><input className="form-input" placeholder="1234 5678 9012 3456" value={propForm.cardNumber} onChange={e=>setPropForm(p=>({...p,cardNumber:e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim()}))} maxLength={19} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Expiry</label><input className="form-input" placeholder="MM / YY" value={propForm.cardExpiry} onChange={e=>setPropForm(p=>({...p,cardExpiry:e.target.value}))} maxLength={7} /></div>
              <div className="form-group"><label className="form-label">CVC</label><input className="form-input" placeholder="•••" value={propForm.cardCvc} onChange={e=>setPropForm(p=>({...p,cardCvc:e.target.value.replace(/\D/g,"").slice(0,4)}))} maxLength={4} /></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,fontSize:".58rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--taupe)"}}>
              <span style={{color:"var(--green)"}}>●</span> 256-bit SSL · Powered by Stripe
            </div>
          </>)}
        </div>
      </div>
      <div className="modal-footer">
        {formStep > 1 && <button className="modal-btn" onClick={()=>setFormStep(s=>s-1)}>← Back</button>}
        <button className="modal-btn" onClick={closeModal}>Cancel</button>
        {formStep < 4
          ? <button className="modal-btn gold" onClick={()=>setFormStep(s=>s+1)}>Continue →</button>
          : <button className="modal-btn gold" onClick={()=>handleSubmit("property")} disabled={processing}>{processing?"Submitting...":"Submit Listing — $25/mo"}</button>
        }
      </div>
    </>
  );

  // ── AGENT LISTING MODAL ──────────────────────────────────
  const renderAgentModal = () => (
    <>
      <div className="modal-header">
        <button className="modal-close" onClick={closeModal}>✕</button>
        <div className="modal-eyebrow">Agent Advertisement</div>
        <div className="modal-title">Advertise as an Agent</div>
        <div className="modal-sub">$50/month · Premium placement · Member-only audience</div>
      </div>
      <div className="steps-row" style={{padding:"16px 32px",background:"transparent",borderBottom:"1px solid var(--border)"}}>
        {["Your Profile","Specialties","Billing"].map((s,i)=>(
          <div key={s} className={`step${formStep===i+1?" active":""}${formStep>i+1?" done":""}`}>
            <div className="step-num">{formStep>i+1?"✓":i+1}</div>
            <div className="step-label">{s}</div>
            {i<2&&<div className="step-line"/>}
          </div>
        ))}
      </div>
      <div className="modal-scroll">
        <div className="modal-body">
          {formStep===1&&(<>
            <div className="modal-pricing">
              <div className="modal-price-item"><div className="modal-price-val">$50</div><div className="modal-price-label">/ month</div></div>
              <div className="modal-price-item"><div className="modal-price-val">UHNW</div><div className="modal-price-label">audience reach</div></div>
              <div className="modal-price-item"><div className="modal-price-val">Cancel</div><div className="modal-price-label">anytime</div></div>
            </div>
            <div className="modal-section-title">Agent Information</div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Your full name" value={agentForm.name} onChange={e=>setAgentForm(p=>({...p,name:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Title / Designation</label><input className="form-input" placeholder="e.g. Luxury Estate Specialist" value={agentForm.title} onChange={e=>setAgentForm(p=>({...p,title:e.target.value}))} /></div>
            </div>
            <div className="form-group"><label className="form-label">Brokerage / Agency</label><input className="form-input" placeholder="e.g. Russ Lyon Sotheby's International" value={agentForm.agency} onChange={e=>setAgentForm(p=>({...p,agency:e.target.value}))} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Years in Luxury RE</label><input className="form-input" type="number" placeholder="12" value={agentForm.years} onChange={e=>setAgentForm(p=>({...p,years:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Career Sales Volume</label><input className="form-input" placeholder="e.g. $280M+" value={agentForm.salesVolume} onChange={e=>setAgentForm(p=>({...p,salesVolume:e.target.value}))} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+1 (480) 555-0000" value={agentForm.phone} onChange={e=>setAgentForm(p=>({...p,phone:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@agency.com" value={agentForm.email} onChange={e=>setAgentForm(p=>({...p,email:e.target.value}))} /></div>
            </div>
            <div className="form-group"><label className="form-label">Professional Bio</label><textarea className="form-textarea" rows={3} placeholder="A compelling 2–3 sentence bio. Focus on your luxury market expertise and client results." value={agentForm.bio} onChange={e=>setAgentForm(p=>({...p,bio:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Professional Headshot</label><div className="upload-zone"><div className="upload-icon">◌</div><div className="upload-text"><strong>Upload your headshot</strong><br />Professional photo required · Min 400×400px · JPG or PNG</div></div></div>
          </>)}
          {formStep===2&&(<>
            <div className="modal-section-title">Areas Served</div>
            <div className="checkbox-row">
              {["Paradise Valley","Scottsdale","North Scottsdale","Old Town","Arcadia","Camelback","DC Ranch","Troon","McCormick Ranch","Biltmore"].map(a=>(
                <div key={a} className={`checkbox-item${checkedAmenities.has(a)?" checked":""}`} onClick={()=>toggleAmenity(a)}>
                  <div className="checkbox-box">{checkedAmenities.has(a)&&"✓"}</div>
                  <span className="checkbox-label">{a}</span>
                </div>
              ))}
            </div>
            <div className="modal-section-title">Specialties</div>
            <div className="checkbox-row">
              {SPECIALTY_OPTIONS.map(s=>(
                <div key={s} className={`checkbox-item${checkedSpecialties.has(s)?" checked":""}`} onClick={()=>toggleSpecialty(s)}>
                  <div className="checkbox-box">{checkedSpecialties.has(s)&&"✓"}</div>
                  <span className="checkbox-label">{s}</span>
                </div>
              ))}
            </div>
            <div className="modal-section-title">License Information</div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">License Number</label><input className="form-input" placeholder="AZ RE License #" /></div>
              <div className="form-group"><label className="form-label">License State</label><input className="form-input" placeholder="Arizona" /></div>
            </div>
          </>)}
          {formStep===3&&(<>
            <div className="modal-section-title">Monthly Subscription — $50/month</div>
            <div style={{background:"rgba(201,169,110,.05)",border:"1px solid rgba(201,169,110,.15)",borderRadius:2,padding:16,marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".78rem",color:"var(--t2)",fontWeight:300,padding:"5px 0"}}><span>Agent advertisement</span><span style={{color:"var(--gold-l)"}}>$50.00 / month</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".78rem",color:"var(--t2)",fontWeight:300,padding:"5px 0"}}><span>Premium placement</span><span style={{color:"var(--green)"}}>Included</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".78rem",borderTop:"1px solid var(--border)",marginTop:6,paddingTop:10,fontFamily:"var(--serif)",fontSize:".95rem",color:"var(--t1)"}}><span>Total due today</span><span>$50.00</span></div>
            </div>
            <div className="form-group"><label className="form-label">Cardholder Name</label><input className="form-input" placeholder="Name on card" value={agentForm.cardName} onChange={e=>setAgentForm(p=>({...p,cardName:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Card Number</label><input className="form-input" placeholder="1234 5678 9012 3456" value={agentForm.cardNumber} onChange={e=>setAgentForm(p=>({...p,cardNumber:e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim()}))} maxLength={19} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Expiry</label><input className="form-input" placeholder="MM / YY" value={agentForm.cardExpiry} onChange={e=>setAgentForm(p=>({...p,cardExpiry:e.target.value}))} maxLength={7} /></div>
              <div className="form-group"><label className="form-label">CVC</label><input className="form-input" placeholder="•••" value={agentForm.cardCvc} onChange={e=>setAgentForm(p=>({...p,cardCvc:e.target.value.replace(/\D/g,"").slice(0,4)}))} maxLength={4} /></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,fontSize:".58rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--taupe)"}}>
              <span style={{color:"var(--green)"}}>●</span> 256-bit SSL · Powered by Stripe
            </div>
          </>)}
        </div>
      </div>
      <div className="modal-footer">
        {formStep>1&&<button className="modal-btn" onClick={()=>setFormStep(s=>s-1)}>← Back</button>}
        <button className="modal-btn" onClick={closeModal}>Cancel</button>
        {formStep<3
          ?<button className="modal-btn gold" onClick={()=>setFormStep(s=>s+1)}>Continue →</button>
          :<button className="modal-btn gold" onClick={()=>handleSubmit("agent")} disabled={processing}>{processing?"Submitting...":"Activate Listing — $50/mo"}</button>
        }
      </div>
    </>
  );

  // ── EXPERIENCE LISTING MODAL ─────────────────────────────
  const renderExperienceModal = () => (
    <>
      <div className="modal-header">
        <button className="modal-close" onClick={closeModal}>✕</button>
        <div className="modal-eyebrow">Experience Partner</div>
        <div className="modal-title">List an Experience</div>
        <div className="modal-sub">$100/month · Reach luxury members · Full booking integration</div>
      </div>
      <div className="steps-row" style={{padding:"16px 32px",background:"transparent",borderBottom:"1px solid var(--border)"}}>
        {["Experience Details","Business Info","Billing"].map((s,i)=>(
          <div key={s} className={`step${formStep===i+1?" active":""}${formStep>i+1?" done":""}`}>
            <div className="step-num">{formStep>i+1?"✓":i+1}</div>
            <div className="step-label">{s}</div>
            {i<2&&<div className="step-line"/>}
          </div>
        ))}
      </div>
      <div className="modal-scroll">
        <div className="modal-body">
          {formStep===1&&(<>
            <div className="modal-pricing">
              <div className="modal-price-item"><div className="modal-price-val">$100</div><div className="modal-price-label">/ month</div></div>
              <div className="modal-price-item"><div className="modal-price-val">Private</div><div className="modal-price-label">member bookings</div></div>
              <div className="modal-price-item"><div className="modal-price-val">Cancel</div><div className="modal-price-label">anytime</div></div>
            </div>
            <div className="modal-section-title">Experience Information</div>
            <div className="form-group"><label className="form-label">Experience Name</label><input className="form-input" placeholder="e.g. Desert Sunrise Jeep Adventure" value={expForm.name} onChange={e=>setExpForm(p=>({...p,name:e.target.value}))} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Category</label>
                <select className="form-select" value={expForm.category} onChange={e=>setExpForm(p=>({...p,category:e.target.value}))}>
                  <option value="">Select category</option>
                  {CATEGORY_OPTIONS.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Duration</label><input className="form-input" placeholder="e.g. 3 hours / Full Day" value={expForm.duration} onChange={e=>setExpForm(p=>({...p,duration:e.target.value}))} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Starting Price ($)</label><input className="form-input" type="number" placeholder="285" value={expForm.price} onChange={e=>setExpForm(p=>({...p,price:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Price Per</label>
                <select className="form-select" value={expForm.per} onChange={e=>setExpForm(p=>({...p,per:e.target.value}))}>
                  {["person","group","event","flight","session","hour"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Min Group Size</label><input className="form-input" type="number" placeholder="2" value={expForm.groupMin} onChange={e=>setExpForm(p=>({...p,groupMin:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Max Group Size</label><input className="form-input" type="number" placeholder="12" value={expForm.groupMax} onChange={e=>setExpForm(p=>({...p,groupMax:e.target.value}))} /></div>
            </div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" rows={4} placeholder="Describe the experience in vivid, aspirational detail. What makes it extraordinary? What will guests feel and remember?" value={expForm.description} onChange={e=>setExpForm(p=>({...p,description:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Experience Photos</label><div className="upload-zone"><div className="upload-icon">◌</div><div className="upload-text"><strong>Upload experience photos</strong><br />Min. 4 high-quality photos · Shows the experience in action</div></div></div>
          </>)}
          {formStep===2&&(<>
            <div className="modal-section-title">Business / Contact Information</div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Business / Host Name</label><input className="form-input" placeholder="Your business name" value={expForm.host} onChange={e=>setExpForm(p=>({...p,host:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Contact Name</label><input className="form-input" placeholder="Primary contact" value={expForm.contactName} onChange={e=>setExpForm(p=>({...p,contactName:e.target.value}))} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+1 (480) 555-0000" value={expForm.contactPhone} onChange={e=>setExpForm(p=>({...p,contactPhone:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@business.com" value={expForm.contactEmail} onChange={e=>setExpForm(p=>({...p,contactEmail:e.target.value}))} /></div>
            </div>
            <div className="form-group"><label className="form-label">Business License / Insurance</label><input className="form-input" placeholder="License # or insurance provider" /></div>
            <div style={{background:"rgba(248,245,240,.03)",border:"1px solid var(--border)",borderRadius:2,padding:14,marginTop:10}}>
              <div style={{fontSize:".68rem",color:"var(--taupe)",fontWeight:300,lineHeight:1.7}}>All experience providers must carry appropriate liability insurance. By submitting, you confirm your business is properly licensed and insured to operate in Arizona. Monarc Privé reserves the right to verify credentials before publishing your listing.</div>
            </div>
          </>)}
          {formStep===3&&(<>
            <div className="modal-section-title">Monthly Subscription — $100/month</div>
            <div style={{background:"rgba(201,169,110,.05)",border:"1px solid rgba(201,169,110,.15)",borderRadius:2,padding:16,marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".78rem",color:"var(--t2)",fontWeight:300,padding:"5px 0"}}><span>Experience listing</span><span style={{color:"var(--gold-l)"}}>$100.00 / month</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".78rem",color:"var(--t2)",fontWeight:300,padding:"5px 0"}}><span>Featured placement in member app</span><span style={{color:"var(--green)"}}>Included</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".78rem",borderTop:"1px solid var(--border)",marginTop:6,paddingTop:10,fontFamily:"var(--serif)",fontSize:".95rem",color:"var(--t1)"}}><span>Total due today</span><span>$100.00</span></div>
            </div>
            <div className="form-group"><label className="form-label">Cardholder Name</label><input className="form-input" placeholder="Name on card" value={expForm.cardName} onChange={e=>setExpForm(p=>({...p,cardName:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Card Number</label><input className="form-input" placeholder="1234 5678 9012 3456" value={expForm.cardNumber} onChange={e=>setExpForm(p=>({...p,cardNumber:e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim()}))} maxLength={19} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Expiry</label><input className="form-input" placeholder="MM / YY" value={expForm.cardExpiry} onChange={e=>setExpForm(p=>({...p,cardExpiry:e.target.value}))} maxLength={7} /></div>
              <div className="form-group"><label className="form-label">CVC</label><input className="form-input" placeholder="•••" value={expForm.cardCvc} onChange={e=>setExpForm(p=>({...p,cardCvc:e.target.value.replace(/\D/g,"").slice(0,4)}))} maxLength={4} /></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,fontSize:".58rem",letterSpacing:".12em",textTransform:"uppercase",color:"var(--taupe)"}}>
              <span style={{color:"var(--green)"}}>●</span> 256-bit SSL · Powered by Stripe
            </div>
          </>)}
        </div>
      </div>
      <div className="modal-footer">
        {formStep>1&&<button className="modal-btn" onClick={()=>setFormStep(s=>s-1)}>← Back</button>}
        <button className="modal-btn" onClick={closeModal}>Cancel</button>
        {formStep<3
          ?<button className="modal-btn gold" onClick={()=>setFormStep(s=>s+1)}>Continue →</button>
          :<button className="modal-btn gold" onClick={()=>handleSubmit("experience")} disabled={processing}>{processing?"Submitting...":"Activate Listing — $100/mo"}</button>
        }
      </div>
    </>
  );

  // ── SUCCESS MODAL ────────────────────────────────────────
  const SUCCESS_COPY = {
    property: { title:"Your property is pending review", sub:"Our curation team will review your listing within 24–48 hours. Once approved, your estate goes live to all Monarc Privé members. You'll receive an email confirmation shortly.", note:"Monthly billing of $25 begins upon approval. The 3% booking fee applies to both guest payment and host payout on confirmed reservations." },
    agent: { title:"Your profile is pending review", sub:"Your agent advertisement will be reviewed within 24 hours. Once approved, you'll appear in our real estate directory, visible exclusively to Monarc Privé's UHNW member base.", note:"Monthly billing of $50 begins upon approval. Cancel anytime from your partner dashboard." },
    experience: { title:"Your experience is pending review", sub:"Our team will verify your listing within 24–48 hours. Once approved, your experience will be featured in the member portal and available for booking.", note:"Monthly billing of $100 begins upon approval. Members will be able to book directly through the platform." },
  };
  const sc = SUCCESS_COPY[successType] || SUCCESS_COPY.property;

  // ── REVENUE CALCULATOR TAB ───────────────────────────────
  const [rcType, setRcType] = useState("property");
  const [rcBookings, setRcBookings] = useState(12);
  const [rcNightlyRate, setRcNightlyRate] = useState(2500);
  const [rcNights, setRcNights] = useState(3);

  const bookingValue = rcNightlyRate * rcNights;
  const annualRevenue = bookingValue * rcBookings;
  const guestFee = bookingValue * 0.03;
  const hostFee = bookingValue * 0.03;
  const listingCost = rcType === "property" ? 25 * 12 : rcType === "agent" ? 50 * 12 : 100 * 12;
  const netAnnual = annualRevenue - (hostFee * rcBookings) - listingCost;

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className="pnav">
        <div className="pnav-logo">Monarc<span>·</span>Privé</div>
        <div className="pnav-tabs">
          {TAB_CONFIG.map(t => (
            <div key={t.id} className={`pnav-tab${tab===t.id?" active":""}`} onClick={()=>{ setTab(t.id); setSearch(""); }}>
              <span className="pnav-tab-icon">{t.icon}</span>
              {t.label}
            </div>
          ))}
        </div>
        <div className="pnav-right">
          {currentTab?.cta && <button className="pnav-btn cta" onClick={currentTab.ctaFn}>{currentTab.cta}</button>}
          <button className="pnav-btn" onClick={()=>window.location.reload()}>← Back to Site</button>
        </div>
      </nav>

      {/* PAGE HERO */}
      {tab === "properties" && (
        <div className="page-hero">
          <img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1400&q=90" alt="" className="page-hero-img" />
          <div className="page-hero-overlay" />
          <div className="page-hero-content">
            <div className="page-hero-eyebrow">Private Estates</div>
            <h1 className="page-hero-title">Curated stays for<br /><em>those who expect more</em></h1>
            <p className="page-hero-desc">Luxury villas and estates in Scottsdale's most coveted neighborhoods — exclusively for Monarc Privé members.</p>
          </div>
        </div>
      )}
      {tab === "agents" && (
        <div className="page-hero">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=90" alt="" className="page-hero-img" />
          <div className="page-hero-overlay" />
          <div className="page-hero-content">
            <div className="page-hero-eyebrow">Real Estate Specialists</div>
            <h1 className="page-hero-title">Luxury agents for<br /><em>extraordinary properties</em></h1>
            <p className="page-hero-desc">Our vetted network of Scottsdale's finest luxury real estate professionals, exclusively accessible to Monarc Privé members.</p>
          </div>
        </div>
      )}
      {tab === "experiences" && (
        <div className="page-hero">
          <img src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1400&q=90" alt="" className="page-hero-img" />
          <div className="page-hero-overlay" />
          <div className="page-hero-content">
            <div className="page-hero-eyebrow">Curated Experiences</div>
            <h1 className="page-hero-title">Beyond the estate.<br /><em>Beyond the ordinary.</em></h1>
            <p className="page-hero-desc">Private adventures, culinary experiences, and wellness journeys curated for Scottsdale's most discerning visitors.</p>
          </div>
        </div>
      )}
      {tab === "revenue" && (
        <div className="page-hero">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=90" alt="" className="page-hero-img" />
          <div className="page-hero-overlay" />
          <div className="page-hero-content">
            <div className="page-hero-eyebrow">Partner Revenue</div>
            <h1 className="page-hero-title">Calculate your<br /><em>earning potential</em></h1>
            <p className="page-hero-desc">See exactly what you can earn as a Monarc Privé partner — transparent pricing, no surprises.</p>
          </div>
        </div>
      )}

      {/* PRICING BANNER */}
      <div className="pricing-banner">
        <div className="pricing-pill"><span className="pp-icon">◈</span><div><div className="pp-amount">$25<span style={{fontSize:".8rem"}}>/mo</span></div><div className="pp-label">Property Listing</div></div></div>
        <div className="pricing-pill"><span className="pp-icon">◉</span><div><div className="pp-amount">$50<span style={{fontSize:".8rem"}}>/mo</span></div><div className="pp-label">Agent Advertisement</div></div></div>
        <div className="pricing-pill"><span className="pp-icon">◌</span><div><div className="pp-amount">$100<span style={{fontSize:".8rem"}}>/mo</span></div><div className="pp-label">Experience Listing</div></div></div>
        <div className="pricing-pill"><span className="pp-icon" style={{color:"var(--green)"}}>◎</span><div><div className="pp-amount">3<span style={{fontSize:".8rem"}}>%</span></div><div className="pp-label">Guest Booking Fee</div></div></div>
        <div className="pricing-pill"><span className="pp-icon" style={{color:"var(--green)"}}>◎</span><div><div className="pp-amount">3<span style={{fontSize:".8rem"}}>%</span></div><div className="pp-label">Host Payout Fee</div></div></div>
        <div className="pricing-pill"><span className="pp-icon">✦</span><div><div className="pp-amount" style={{fontSize:"1rem",letterSpacing:".05em"}}>UHNW</div><div className="pp-label">Exclusive audience</div></div></div>
      </div>

      {/* FILTER BAR */}
      {tab !== "revenue" && (
        <div className="filter-bar">
          <input className="filter-search" placeholder={`Search ${tab}...`} value={search} onChange={e=>setSearch(e.target.value)} />
          {tab === "properties" && PROP_FILTERS.map(f=><button key={f} className={`filter-chip${propFilter===f?" active":""}`} onClick={()=>setPropFilter(f)}>{f}</button>)}
          {tab === "agents" && AGENT_FILTERS.map(f=><button key={f} className={`filter-chip${agentFilter===f?" active":""}`} onClick={()=>setAgentFilter(f)}>{f}</button>)}
          {tab === "experiences" && EXP_FILTERS.map(f=><button key={f} className={`filter-chip${expFilter===f?" active":""}`} onClick={()=>setExpFilter(f)}>{f}</button>)}
          <span className="filter-count">
            {tab==="properties"?`${filteredProps.length} estates`:tab==="agents"?`${filteredAgents.length} agents`:`${filteredExp.length} experiences`}
          </span>
        </div>
      )}

      {/* CONTENT */}
      <div className="content-area">

        {/* PROPERTIES TAB */}
        {tab === "properties" && (
          filteredProps.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">◈</span><div className="empty-title">No estates found</div><div className="empty-sub">Try adjusting your filters.</div></div>
          ) : (
            <div className="prop-grid">
              {filteredProps.map(p => (
                <div key={p.id} className="prop-card">
                  <div className="prop-card-img-wrap">
                    <img src={p.img} alt={p.name} className="prop-card-img" loading="lazy" />
                    <span className="prop-card-badge">{p.badge}</span>
                    <button className="prop-card-fav" onClick={e=>{e.stopPropagation();setFavs(prev=>{const n=new Set(prev);n.has(p.id)?n.delete(p.id):n.add(p.id);return n;})}}>
                      <span style={{color:favs.has(p.id)?"#E05252":"rgba(248,245,240,.8)"}}>{favs.has(p.id)?"♥":"♡"}</span>
                    </button>
                  </div>
                  <div className="prop-card-body">
                    <div className="prop-card-name">{p.name}</div>
                    <div className="prop-card-area">{p.area}</div>
                    <div className="prop-card-meta">
                      <span>🛏 {p.beds} bd</span>
                      <span>🚿 {p.baths} ba</span>
                      <span>👥 {p.guests} guests</span>
                    </div>
                    <div className="prop-card-tags">{p.tags.map(t=><span key={t} className="prop-card-tag">{t}</span>)}</div>
                    <div className="prop-card-footer">
                      <div>
                        <span className="prop-card-price">${p.price.toLocaleString()}</span>
                        <span className="prop-card-price-night"> / night</span>
                        <div className="prop-card-host">{p.host}</div>
                      </div>
                      <button className="prop-card-cta">Request →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* AGENTS TAB */}
        {tab === "agents" && (
          filteredAgents.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">◉</span><div className="empty-title">No agents found</div><div className="empty-sub">Try adjusting your filters.</div></div>
          ) : (
            <div className="agent-grid">
              {filteredAgents.map(a => (
                <div key={a.id} className="agent-card">
                  <div className="agent-card-top">
                    <img src={a.img} alt={a.name} className="agent-avatar" loading="lazy" />
                    <div className="agent-info">
                      <div className="agent-badge-row"><span className="agent-badge">{a.badge}</span></div>
                      <div className="agent-name">{a.name}</div>
                      <div className="agent-title">{a.title}</div>
                      <div className="agent-agency">{a.agency}</div>
                    </div>
                  </div>
                  <div className="agent-stats">
                    <div><span className="agent-stat-val">{a.years}yrs</span><span className="agent-stat-label">Experience</span></div>
                    <div><span className="agent-stat-val">{a.sales}</span><span className="agent-stat-label">Sales Volume</span></div>
                    <div><span className="agent-stat-val">★5.0</span><span className="agent-stat-label">Rating</span></div>
                  </div>
                  <div className="agent-areas">{a.areas.map(ar=><span key={ar} className="agent-area-tag">{ar}</span>)}</div>
                  <div className="agent-specialties">{a.specialties.join(" · ")}</div>
                  <div className="agent-contact-row">
                    <button className="agent-contact-btn">📞 Call</button>
                    <button className="agent-contact-btn">✉ Email</button>
                    <button className="agent-contact-btn primary">Connect →</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* EXPERIENCES TAB */}
        {tab === "experiences" && (
          filteredExp.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">◌</span><div className="empty-title">No experiences found</div><div className="empty-sub">Try adjusting your filters.</div></div>
          ) : (
            <div className="exp-grid">
              {filteredExp.map(e => (
                <div key={e.id} className="exp-card">
                  <div className="exp-card-img-wrap">
                    <img src={e.img} alt={e.name} className="exp-card-img" loading="lazy" />
                    <span className="exp-card-badge">{e.badge}</span>
                    <span className="exp-card-cat">{e.category}</span>
                  </div>
                  <div className="exp-card-body">
                    <div className="exp-card-name">{e.name}</div>
                    <div className="exp-card-host">by {e.host}</div>
                    <div className="exp-card-desc">{e.desc}</div>
                    <div className="exp-card-tags">{e.tags.map(t=><span key={t} className="exp-card-tag">{t}</span>)}</div>
                    <div className="exp-card-footer">
                      <div className="exp-card-price-wrap">
                        <div className="exp-card-price">${e.price.toLocaleString()}</div>
                        <div className="exp-card-per">per {e.per}</div>
                        <div className="exp-card-detail"><span>⏱ {e.duration}</span><span>👥 {e.groupMin}–{e.groupMax}</span></div>
                      </div>
                      <button className="exp-book-btn">Book Now →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* REVENUE CALCULATOR TAB */}
        {tab === "revenue" && (
          <div style={{maxWidth:800,margin:"0 auto"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32}}>
              <div>
                <div style={{fontFamily:"var(--serif)",fontSize:"1.4rem",color:"var(--t1)",marginBottom:20,fontWeight:300}}>Partner Type</div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
                  {[{id:"property",label:"Property Host",price:"$25/mo + 3%"},{id:"agent",label:"Real Estate Agent",price:"$50/mo"},{id:"experience",label:"Experience Provider",price:"$100/mo"}].map(t=>(
                    <div key={t.id} onClick={()=>setRcType(t.id)} style={{padding:"14px 16px",border:`1px solid ${rcType===t.id?"var(--gold)":"var(--border)"}`,borderRadius:2,cursor:"pointer",background:rcType===t.id?"rgba(201,169,110,.06)":"none",transition:"all .2s",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:".82rem",color:rcType===t.id?"var(--ivory)":"var(--t2)",fontWeight:300}}>{t.label}</span>
                      <span style={{fontSize:".68rem",color:"var(--gold)",fontWeight:400}}>{t.price}</span>
                    </div>
                  ))}
                </div>
                {rcType==="property"&&(<>
                  <div style={{marginBottom:16}}>
                    <label className="form-label">Nightly Rate ($)</label>
                    <input className="form-input" type="number" value={rcNightlyRate} onChange={e=>setRcNightlyRate(Number(e.target.value)||0)} />
                  </div>
                  <div style={{marginBottom:16}}>
                    <label className="form-label">Average Stay Length (nights)</label>
                    <input className="form-input" type="number" value={rcNights} onChange={e=>setRcNights(Number(e.target.value)||1)} />
                  </div>
                  <div style={{marginBottom:16}}>
                    <label className="form-label">Bookings per Year</label>
                    <input className="form-input" type="number" value={rcBookings} onChange={e=>setRcBookings(Number(e.target.value)||0)} />
                  </div>
                </>)}
              </div>
              <div>
                <div style={{fontFamily:"var(--serif)",fontSize:"1.4rem",color:"var(--t1)",marginBottom:20,fontWeight:300}}>Your Numbers</div>
                <div className="revenue-calc">
                  <div className="rc-title">Annual Revenue Breakdown</div>
                  {rcType==="property"&&(<>
                    <div className="rc-row"><span>Gross booking revenue</span><span>${annualRevenue.toLocaleString()}</span></div>
                    <div className="rc-row"><span>Monarc host fee (3% × {rcBookings} bookings)</span><span>−${(hostFee*rcBookings).toLocaleString()}</span></div>
                    <div className="rc-row"><span>Annual listing fee ($25 × 12)</span><span>−${listingCost}</span></div>
                    <div className="rc-row total"><span>Your net annual payout</span><span>${netAnnual.toLocaleString()}</span></div>
                  </>)}
                  {rcType!=="property"&&(<>
                    <div className="rc-row"><span>Monthly listing fee</span><span>${rcType==="agent"?"50":"100"}</span></div>
                    <div className="rc-row"><span>Annual cost</span><span>−${listingCost}</span></div>
                    <div className="rc-row"><span>Leads generated (estimated)</span><span>∞</span></div>
                    <div className="rc-row total"><span>Potential referral value</span><span>Unlimited</span></div>
                  </>)}
                </div>
                <div style={{fontSize:".72rem",color:"var(--taupe)",fontWeight:300,lineHeight:1.7,fontStyle:"italic"}}>
                  {rcType==="property"?"Monarc Privé also collects 3% from the guest's payment separately — your net payout is after the host-side 3% only. The guest fee does not reduce your earnings.":rcType==="agent"?"Agent advertisement is $50/month flat. No commission. No transaction fees. Direct connections with Monarc Privé's UHNW member base.":"Experience listings are $100/month flat. Members book directly through the platform. Monarc Privé may take a referral arrangement — contact us for details."}
                </div>
                <button className="modal-btn gold" style={{width:"100%",marginTop:20,padding:"15px"}} onClick={()=>openModal(`list-${rcType==="property"?"property":rcType==="agent"?"agent":"experience"}`)}>
                  Get Started →
                </button>
              </div>
            </div>

            {/* Revenue Strip */}
            <div style={{marginTop:48,marginLeft:-48,marginRight:-48}}>
              <div style={{padding:"0 48px 24px",fontFamily:"var(--serif)",fontSize:"1.5rem",color:"var(--t1)",fontWeight:300}}>Platform Revenue Potential</div>
              <div className="revenue-strip">
                {[
                  {label:"10 Properties + 10 Agents + 10 Exp",value:"$1,750",sub:"monthly recurring revenue"},
                  {label:"100 Bookings × $3,000 avg × 3%",value:"$9,000",sub:"monthly booking fees"},
                  {label:"100 Members × $300/yr",value:"$30,000",sub:"annual membership"},
                  {label:"Combined Annual GMV (est.)",value:"$500K+",sub:"year one potential"},
                ].map(s=>(
                  <div key={s.label} className="rs-item">
                    <div className="rs-label">{s.label}</div>
                    <div className="rs-value">{s.value}</div>
                    <div className="rs-sub">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {(modal && modal !== "success") && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            {modal==="list-property" && renderPropertyModal()}
            {modal==="list-agent" && renderAgentModal()}
            {modal==="list-experience" && renderExperienceModal()}
          </div>
        </div>
      )}

      {modal === "success" && (
        <div className="modal-overlay">
          <div className="modal" style={{maxWidth:480}}>
            <div className="modal-header">
              <div className="modal-logo" style={{fontFamily:"var(--serif)",fontSize:"1rem",letterSpacing:".18em",textTransform:"uppercase",color:"var(--t1)",marginBottom:0}}>
                Monarc<span style={{color:"var(--gold)"}}>·</span>Privé
              </div>
            </div>
            <div className="modal-body">
              <div className="success-content">
                <span className="success-icon-lg">◈</span>
                <div className="success-title">{sc.title}</div>
                <p className="success-sub">{sc.sub}</p>
                <div className="success-ref">Ref · MP-{Math.random().toString(36).substr(2,8).toUpperCase()}</div>
                <p className="success-note">{sc.note}</p>
                <button className="modal-btn gold" style={{width:"100%",marginTop:24,padding:"15px"}} onClick={closeModal}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
