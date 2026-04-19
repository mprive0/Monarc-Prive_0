import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { approveListing, rejectListing, approveBooking, declineBooking, getAdminStats } from "../lib/api";

/* ══════════════════════════════════════════════════════════
   MONARC PRIVÉ — ADMIN DASHBOARD
   Full admin panel: stats, listing approvals, bookings,
   members, reports — dark luxury aesthetic
══════════════════════════════════════════════════════════ */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--ivory:#F8F5F0;--gold:#C9A96E;--gold-l:#E2C896;--ink:#161412;--ink-m:#222018;--ink-s:#2E2C28;--ink-xs:#3A3834;--t1:#F8F5F0;--t2:rgba(248,245,240,.65);--t3:rgba(248,245,240,.38);--border:rgba(212,201,181,.1);--border-h:rgba(201,169,110,.3);--green:#5BAF84;--red:#E05252;--amber:#E8A838;--serif:'Cormorant Garamond',serif;--sans:'Jost',sans-serif}
html,body{height:100%;font-family:var(--sans);background:var(--ink);color:var(--t1);-webkit-font-smoothing:antialiased}
.admin{display:flex;height:100vh;overflow:hidden}

/* SIDEBAR */
.aside{width:220px;flex-shrink:0;background:var(--ink-m);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto}
.aside-logo{padding:22px 20px 18px;border-bottom:1px solid var(--border)}
.aside-wordmark{font-family:var(--serif);font-size:1.05rem;font-weight:300;letter-spacing:.16em;text-transform:uppercase;color:var(--t1)}
.aside-wordmark span{color:var(--gold)}
.aside-sub{font-size:.52rem;letter-spacing:.28em;text-transform:uppercase;color:var(--t3);margin-top:3px}
.aside-section{padding:14px 0 0}
.aside-label{font-size:.52rem;letter-spacing:.28em;text-transform:uppercase;color:var(--t3);padding:0 18px 8px;font-weight:500}
.aside-item{display:flex;align-items:center;gap:10px;padding:10px 18px;cursor:pointer;transition:all .15s;border-left:2px solid transparent;position:relative}
.aside-item:hover{background:rgba(212,201,181,.04)}
.aside-item.active{background:rgba(201,169,110,.07);border-left-color:var(--gold)}
.aside-item-icon{font-size:.9rem;width:16px;text-align:center;flex-shrink:0}
.aside-item-text{font-size:.72rem;font-weight:400;color:var(--t2);letter-spacing:.04em}
.aside-item.active .aside-item-text{color:var(--gold-l)}
.aside-badge{margin-left:auto;background:var(--red);color:white;font-size:.5rem;font-weight:700;padding:2px 6px;border-radius:10px;min-width:18px;text-align:center}
.aside-badge.gold{background:rgba(201,169,110,.2);color:var(--gold)}
.aside-footer{margin-top:auto;padding:16px 18px;border-top:1px solid var(--border)}
.aside-footer-text{font-size:.6rem;color:var(--t3);line-height:1.5}
.aside-footer span{color:var(--green)}

/* MAIN */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.main-header{padding:18px 28px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:rgba(22,20,18,.6);backdrop-filter:blur(10px)}
.main-title{font-family:var(--serif);font-size:1.4rem;font-weight:300;color:var(--t1);letter-spacing:.03em}
.main-sub{font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--t3);margin-top:2px}
.header-actions{display:flex;gap:10px}
.hbtn{background:none;border:1px solid var(--border);color:var(--t2);font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;font-family:var(--sans);padding:8px 16px;cursor:pointer;transition:all .18s;border-radius:2px}
.hbtn:hover{border-color:var(--border-h);color:var(--t1)}
.hbtn.primary{background:var(--gold);border-color:var(--gold);color:var(--ink);font-weight:600}
.hbtn.primary:hover{background:var(--gold-l)}

/* CONTENT */
.content{flex:1;overflow-y:auto;padding:24px 28px 40px;scrollbar-width:thin;scrollbar-color:rgba(212,201,181,.1) transparent}

/* STAT CARDS */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
.stat-card{background:var(--ink-m);border:1px solid var(--border);border-radius:3px;padding:18px}
.stat-label{font-size:.55rem;letter-spacing:.25em;text-transform:uppercase;color:var(--t3);margin-bottom:8px;font-weight:500}
.stat-value{font-family:var(--serif);font-size:1.8rem;font-weight:300;color:var(--t1);letter-spacing:.02em}
.stat-change{font-size:.62rem;margin-top:5px;font-weight:500}
.stat-change.up{color:var(--green)}
.stat-change.down{color:var(--red)}
.stat-change.neutral{color:var(--t3)}

/* SECTION */
.section-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;margin-top:8px}
.section-title{font-family:var(--serif);font-size:1.1rem;font-weight:300;color:var(--t1);letter-spacing:.02em}
.section-count{font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--t3)}

/* TABLE */
.table-wrap{background:var(--ink-m);border:1px solid var(--border);border-radius:3px;overflow:hidden;margin-bottom:24px}
table{width:100%;border-collapse:collapse}
thead th{font-size:.55rem;letter-spacing:.22em;text-transform:uppercase;color:var(--t3);font-weight:500;padding:12px 16px;text-align:left;border-bottom:1px solid var(--border);background:var(--ink-s)}
tbody tr{border-bottom:1px solid rgba(212,201,181,.05);transition:background .15s}
tbody tr:last-child{border-bottom:none}
tbody tr:hover{background:rgba(212,201,181,.03)}
td{padding:13px 16px;font-size:.74rem;color:var(--t2);font-weight:300;vertical-align:middle}
.td-name{color:var(--t1);font-weight:400;font-size:.78rem}
.td-badge{display:inline-block;font-size:.5rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600;padding:3px 8px;border-radius:2px}
.td-badge.pending{background:rgba(232,168,56,.12);border:1px solid rgba(232,168,56,.25);color:var(--amber)}
.td-badge.active{background:rgba(91,175,132,.1);border:1px solid rgba(91,175,132,.25);color:var(--green)}
.td-badge.rejected{background:rgba(224,82,82,.1);border:1px solid rgba(224,82,82,.2);color:var(--red)}
.td-badge.confirmed{background:rgba(91,175,132,.1);border:1px solid rgba(91,175,132,.25);color:var(--green)}
.td-badge.curated{background:rgba(201,169,110,.1);border:1px solid rgba(201,169,110,.25);color:var(--gold)}
.action-row{display:flex;gap:6px}
.action-btn{background:none;border:1px solid var(--border);color:var(--t3);font-size:.5rem;letter-spacing:.14em;text-transform:uppercase;font-family:var(--sans);padding:5px 10px;cursor:pointer;transition:all .15s;border-radius:2px;font-weight:500}
.action-btn.approve{border-color:rgba(91,175,132,.3);color:var(--green)}
.action-btn.approve:hover{background:rgba(91,175,132,.1)}
.action-btn.reject{border-color:rgba(224,82,82,.2);color:var(--red)}
.action-btn.reject:hover{background:rgba(224,82,82,.08)}
.action-btn.view{border-color:rgba(201,169,110,.2);color:var(--gold)}
.action-btn.view:hover{background:rgba(201,169,110,.07)}

/* EMPTY */
.empty{padding:40px;text-align:center;color:var(--t3)}
.empty-icon{font-size:1.5rem;margin-bottom:10px;display:block}
.empty-text{font-size:.75rem;font-weight:300}

/* REVENUE PANEL */
.rev-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:24px}
.rev-card{background:var(--ink-m);border:1px solid var(--border);border-radius:3px;padding:16px;text-align:center}
.rev-icon{font-size:1.1rem;color:var(--gold);margin-bottom:8px;display:block}
.rev-amount{font-family:var(--serif);font-size:1.3rem;color:var(--t1);font-weight:300}
.rev-label{font-size:.55rem;letter-spacing:.18em;text-transform:uppercase;color:var(--t3);margin-top:4px}
.rev-sub{font-size:.6rem;color:var(--t3);font-weight:300;margin-top:3px}

/* TABS */
.tab-row{display:flex;border-bottom:1px solid var(--border);margin-bottom:20px}
.tab{padding:10px 20px;font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:var(--t3);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;font-weight:400;white-space:nowrap}
.tab.active{color:var(--gold);border-bottom-color:var(--gold)}
.tab:hover:not(.active){color:var(--t2)}

/* MEMBERS */
.member-row{display:flex;align-items:center;gap:14px;padding:13px 16px;border-bottom:1px solid rgba(212,201,181,.05)}
.member-row:last-child{border-bottom:none}
.member-avatar{width:34px;height:34px;border-radius:50%;background:rgba(201,169,110,.12);border:1px solid rgba(201,169,110,.2);display:flex;align-items:center;justify-content:center;font-size:.8rem;color:var(--gold);flex-shrink:0}
.member-name{font-size:.78rem;color:var(--t1);font-weight:400}
.member-email{font-size:.62rem;color:var(--t3);font-weight:300;margin-top:1px}
.member-tier{margin-left:auto;font-size:.52rem;letter-spacing:.16em;text-transform:uppercase;font-weight:600;padding:3px 8px;border-radius:2px}

/* RESPONSIVE */
@media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr)}.rev-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:768px){.aside{display:none}.stats-grid{grid-template-columns:repeat(2,1fr)}.rev-grid{grid-template-columns:repeat(2,1fr)}.content{padding:16px}.main-header{padding:14px 16px}}
`;

// ── MOCK DATA (replace with Supabase queries in production) ──
const MOCK_PENDING_LISTINGS = {
  properties: [
    { id:"p1", title:"Villa Castellan", area:"Paradise Valley", host:"Robert Mercer", email:"r.mercer@email.com", rate:"$3,200/night", beds:6, submitted:"2 hours ago" },
    { id:"p2", title:"The Amber House", area:"North Scottsdale", host:"Sandra Chen", email:"s.chen@email.com", rate:"$1,900/night", beds:4, submitted:"5 hours ago" },
    { id:"p3", title:"Desert Bloom Estate", area:"Scottsdale", host:"PV Estates LLC", email:"info@pvestates.com", rate:"$4,500/night", beds:8, submitted:"1 day ago" },
  ],
  agents: [
    { id:"a1", name:"Theodore Walsh", agency:"Douglas Elliman", email:"t.walsh@elliman.com", phone:"(480) 555-0101", sales:"$180M+", submitted:"3 hours ago" },
    { id:"a2", name:"Camille Rousseau", agency:"The Agency AZ", email:"c.rousseau@theagency.com", phone:"(480) 555-0202", sales:"$95M+", submitted:"1 day ago" },
  ],
  experiences: [
    { id:"e1", name:"Sunrise Helicopter Tour", business:"AZ Sky Tours", email:"info@azskytours.com", category:"Aviation", price:"$1,200/flight", submitted:"6 hours ago" },
    { id:"e2", name:"Desert Wine & Whiskey", business:"Copper State Spirits", email:"book@copperstate.com", category:"Wine & Spirits", price:"$280/person", submitted:"2 days ago" },
  ],
};

const MOCK_RECENT_BOOKINGS = [
  { ref:"MP-4A7B9C", property:"The Ironwood Estate", guest:"Victoria Ashworth", dates:"Jun 14–18", nights:4, total:16800, status:"confirmed", submitted:"1 hour ago" },
  { ref:"MP-2D3E4F", property:"Casa del Cielo", guest:"James Holloway", dates:"Jun 22–25", nights:3, total:8400, status:"pending", submitted:"3 hours ago" },
  { ref:"MP-8G9H1I", property:"The Camelback Retreat", guest:"Sophia Laurent", dates:"Jul 4–7", nights:3, total:17400, status:"pending", submitted:"5 hours ago" },
  { ref:"MP-5J6K7L", property:"Monolith Modern", guest:"Marcus Chen", dates:"Jul 14–17", nights:3, total:10500, status:"confirmed", submitted:"1 day ago" },
  { ref:"MP-3M4N5O", property:"Desert Glass House", guest:"Isabella Fontaine", dates:"Aug 1–4", nights:3, total:6300, status:"confirmed", submitted:"2 days ago" },
];

const MOCK_MEMBERS = [
  { initials:"VA", name:"Victoria Ashworth", email:"v.ashworth@email.com", tier:"private", since:"Jan 2025", bookings:3 },
  { initials:"JH", name:"James Holloway III", email:"j.holloway@hcapital.com", tier:"founding", since:"Dec 2024", bookings:5 },
  { initials:"SL", name:"Sophia Laurent", email:"s.laurent@email.com", tier:"curated", since:"Feb 2025", bookings:2 },
  { initials:"MC", name:"Marcus Chen", email:"m.chen@prventures.com", tier:"private", since:"Mar 2025", bookings:2 },
  { initials:"IF", name:"Isabella Fontaine", email:"i.fontaine@email.com", tier:"curated", since:"Apr 2025", bookings:1 },
  { initials:"WA", name:"William Ashford", email:"w.ashford@christies.com", tier:"founding", since:"Nov 2024", bookings:7 },
];

export default function AdminHub() {
  const [section, setSection] = useState("overview");
  const [listingTab, setListingTab] = useState("properties");
  const [stats, setStats] = useState({ activeMembers:0, activeProperties:0, activeAgents:0, activeExperiences:0, confirmedBookings:0, pendingProperties:0, pendingAgents:0, pendingExperiences:0 });
  const [loading, setLoading] = useState(true);
  const [pendingListings, setPendingListings] = useState(MOCK_PENDING_LISTINGS);
  const [bookings, setBookings] = useState(MOCK_RECENT_BOOKINGS);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getAdminStats();
      if (data && !data.error) setStats(data);
    } catch (e) {
      // use mock stats
      setStats({ activeMembers:47, activeProperties:6, activeAgents:12, activeExperiences:8, confirmedBookings:23, pendingProperties:3, pendingAgents:2, pendingExperiences:2 });
    }
    setLoading(false);
  };

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApproveListing = async (type, id, name) => {
    try {
      await approveListing(type, id);
      const key = type === "property" ? "properties" : type === "agent" ? "agents" : "experiences";
      setPendingListings(prev => ({ ...prev, [key]: prev[key].filter(i => i.id !== id) }));
      showToast(`✓ ${name} approved and now live`);
    } catch (e) {
      // demo mode: just remove from list
      const key = type === "property" ? "properties" : type === "agent" ? "agents" : "experiences";
      setPendingListings(prev => ({ ...prev, [key]: prev[key].filter(i => i.id !== id) }));
      showToast(`✓ ${name} approved`);
    }
  };

  const handleRejectListing = async (type, id) => {
    const key = type === "property" ? "properties" : type === "agent" ? "agents" : "experiences";
    setPendingListings(prev => ({ ...prev, [key]: prev[key].filter(i => i.id !== id) }));
    showToast(`Listing rejected and notified`, "error");
  };

  const handleApproveBooking = async (ref) => {
    setBookings(prev => prev.map(b => b.ref === ref ? { ...b, status: "confirmed" } : b));
    showToast(`✓ Booking ${ref} approved`);
  };

  const pendingCount = pendingListings.properties.length + pendingListings.agents.length + pendingListings.experiences.length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;

  const NAV = [
    { id:"overview", icon:"◈", label:"Overview" },
    { id:"listings", icon:"◉", label:"Listing Approvals", badge: pendingCount > 0 ? pendingCount : null },
    { id:"bookings", icon:"◌", label:"Bookings", badge: pendingBookings > 0 ? pendingBookings : null, badgeColor:"gold" },
    { id:"members", icon:"◎", label:"Members" },
    { id:"revenue", icon:"◍", label:"Revenue" },
    { id:"agents_ai", icon:"✦", label:"AI Agents" },
  ];

  const totalPendingListings = pendingListings.properties.length + pendingListings.agents.length + pendingListings.experiences.length;

  return (
    <>
      <style>{css}</style>
      <div className="admin">

        {/* ASIDE */}
        <aside className="aside">
          <div className="aside-logo">
            <div className="aside-wordmark">Monarc<span>·</span>Privé</div>
            <div className="aside-sub">Admin Dashboard</div>
          </div>
          <div className="aside-section">
            <div className="aside-label">Navigation</div>
            {NAV.map(n => (
              <div key={n.id} className={`aside-item${section === n.id ? " active" : ""}`} onClick={() => setSection(n.id)}>
                <span className="aside-item-icon">{n.icon}</span>
                <span className="aside-item-text">{n.label}</span>
                {n.badge && <span className={`aside-badge${n.badgeColor === "gold" ? " gold" : ""}`}>{n.badge}</span>}
              </div>
            ))}
          </div>
          <div className="aside-footer">
            <div className="aside-footer-text">System Status<br /><span>● All services operational</span></div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <div className="main-header">
            <div>
              <div className="main-title">
                {section === "overview" && "Command Center"}
                {section === "listings" && "Listing Approvals"}
                {section === "bookings" && "Booking Management"}
                {section === "members" && "Member Management"}
                {section === "revenue" && "Revenue Analytics"}
                {section === "agents_ai" && "AI Agent Center"}
              </div>
              <div className="main-sub">
                {new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric", year:"numeric" })} · Monarc Privé Admin
              </div>
            </div>
            <div className="header-actions">
              {section === "listings" && totalPendingListings > 0 && (
                <button className="hbtn primary" onClick={() => {
                  pendingListings.properties.forEach(p => handleApproveListing("property", p.id, p.title));
                  pendingListings.agents.forEach(a => handleApproveListing("agent", a.id, a.name));
                  pendingListings.experiences.forEach(e => handleApproveListing("experience", e.id, e.name));
                }}>
                  Approve All ({totalPendingListings})
                </button>
              )}
              <button className="hbtn" onClick={() => window.location.href = "/"}>← Back to Site</button>
            </div>
          </div>

          <div className="content">

            {/* ── OVERVIEW ── */}
            {section === "overview" && (
              <>
                <div className="stats-grid">
                  {[
                    { label:"Active Members", value: loading ? "…" : stats.activeMembers || 47, change:"↑ +3 this week", dir:"up" },
                    { label:"Confirmed Bookings", value: loading ? "…" : stats.confirmedBookings || 23, change:"↑ +2 today", dir:"up" },
                    { label:"Monthly MRR", value:"$14,625", change:"↑ +18% vs last mo", dir:"up" },
                    { label:"Pending Reviews", value: loading ? "…" : (pendingCount + pendingBookings), change: pendingCount > 0 ? "Action required" : "All clear", dir: pendingCount > 0 ? "down" : "up" },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.value}</div>
                      <div className={`stat-change ${s.dir}`}>{s.change}</div>
                    </div>
                  ))}
                </div>

                <div className="stats-grid">
                  {[
                    { label:"Active Properties", value: loading ? "…" : stats.activeProperties || 6, change:"+ 3 pending approval", dir:"neutral" },
                    { label:"Agent Advertisers", value: loading ? "…" : stats.activeAgents || 12, change:"+ 2 pending", dir:"neutral" },
                    { label:"Experience Listings", value: loading ? "…" : stats.activeExperiences || 8, change:"+ 2 pending", dir:"neutral" },
                    { label:"YTD Revenue", value:"$84,200", change:"↑ Track for $400K yr", dir:"up" },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.value}</div>
                      <div className={`stat-change ${s.dir}`}>{s.change}</div>
                    </div>
                  ))}
                </div>

                {totalPendingListings > 0 && (
                  <div style={{background:"rgba(232,168,56,.06)",border:"1px solid rgba(232,168,56,.2)",borderRadius:3,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontSize:".72rem",color:"var(--amber)",fontWeight:500,letterSpacing:".08em"}}>⚠ Action Required</div>
                      <div style={{fontSize:".78rem",color:"var(--t2)",fontWeight:300,marginTop:3}}>{totalPendingListings} partner listing{totalPendingListings > 1 ? "s" : ""} waiting for approval ({pendingListings.properties.length} properties, {pendingListings.agents.length} agents, {pendingListings.experiences.length} experiences)</div>
                    </div>
                    <button className="hbtn" onClick={() => setSection("listings")} style={{borderColor:"rgba(232,168,56,.3)",color:"var(--amber)"}}>Review Now →</button>
                  </div>
                )}

                <div className="section-hdr"><div className="section-title">Recent Bookings</div><div className="section-count">{bookings.length} total</div></div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Reference</th><th>Property</th><th>Guest</th><th>Dates</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {bookings.slice(0,5).map(b => (
                        <tr key={b.ref}>
                          <td style={{fontFamily:"monospace",fontSize:".7rem",color:"var(--gold)"}}>{b.ref}</td>
                          <td className="td-name">{b.property}</td>
                          <td>{b.guest}</td>
                          <td>{b.dates} · {b.nights}nt</td>
                          <td style={{fontFamily:"var(--serif)",fontSize:".9rem",color:"var(--t1)"}}>${b.total.toLocaleString()}</td>
                          <td><span className={`td-badge ${b.status}`}>{b.status}</span></td>
                          <td><div className="action-row">
                            {b.status === "pending" && <button className="action-btn approve" onClick={() => handleApproveBooking(b.ref)}>Approve</button>}
                            <button className="action-btn view">View</button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── LISTING APPROVALS ── */}
            {section === "listings" && (
              <>
                <div className="tab-row">
                  {[["properties","Properties",pendingListings.properties.length],["agents","Agents",pendingListings.agents.length],["experiences","Experiences",pendingListings.experiences.length]].map(([id,label,count]) => (
                    <div key={id} className={`tab${listingTab===id?" active":""}`} onClick={() => setListingTab(id)}>
                      {label} {count > 0 && <span style={{marginLeft:6,background:"rgba(232,168,56,.2)",color:"var(--amber)",fontSize:".5rem",padding:"1px 6px",borderRadius:10}}>{count}</span>}
                    </div>
                  ))}
                </div>

                {listingTab === "properties" && (
                  pendingListings.properties.length === 0 ? (
                    <div className="empty"><span className="empty-icon">◈</span><div className="empty-text">No pending property listings</div></div>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Property</th><th>Area</th><th>Host</th><th>Email</th><th>Rate</th><th>Beds</th><th>Submitted</th><th>Actions</th></tr></thead>
                        <tbody>
                          {pendingListings.properties.map(p => (
                            <tr key={p.id}>
                              <td className="td-name">{p.title}</td>
                              <td>{p.area}</td>
                              <td>{p.host}</td>
                              <td style={{fontSize:".65rem",color:"var(--t3)"}}>{p.email}</td>
                              <td style={{color:"var(--gold)",fontFamily:"var(--serif)"}}>{p.rate}</td>
                              <td>{p.beds}bd</td>
                              <td style={{fontSize:".65rem",color:"var(--t3)"}}>{p.submitted}</td>
                              <td><div className="action-row">
                                <button className="action-btn approve" onClick={() => handleApproveListing("property", p.id, p.title)}>Approve</button>
                                <button className="action-btn reject" onClick={() => handleRejectListing("property", p.id)}>Reject</button>
                                <button className="action-btn view">Review</button>
                              </div></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {listingTab === "agents" && (
                  pendingListings.agents.length === 0 ? (
                    <div className="empty"><span className="empty-icon">◉</span><div className="empty-text">No pending agent listings</div></div>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Agent Name</th><th>Agency</th><th>Email</th><th>Sales Volume</th><th>Submitted</th><th>Actions</th></tr></thead>
                        <tbody>
                          {pendingListings.agents.map(a => (
                            <tr key={a.id}>
                              <td className="td-name">{a.name}</td>
                              <td>{a.agency}</td>
                              <td style={{fontSize:".65rem",color:"var(--t3)"}}>{a.email}</td>
                              <td style={{color:"var(--gold)",fontFamily:"var(--serif)"}}>{a.sales}</td>
                              <td style={{fontSize:".65rem",color:"var(--t3)"}}>{a.submitted}</td>
                              <td><div className="action-row">
                                <button className="action-btn approve" onClick={() => handleApproveListing("agent", a.id, a.name)}>Approve</button>
                                <button className="action-btn reject" onClick={() => handleRejectListing("agent", a.id)}>Reject</button>
                                <button className="action-btn view">Review</button>
                              </div></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {listingTab === "experiences" && (
                  pendingListings.experiences.length === 0 ? (
                    <div className="empty"><span className="empty-icon">◌</span><div className="empty-text">No pending experience listings</div></div>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Experience</th><th>Business</th><th>Category</th><th>Email</th><th>Starting Price</th><th>Submitted</th><th>Actions</th></tr></thead>
                        <tbody>
                          {pendingListings.experiences.map(e => (
                            <tr key={e.id}>
                              <td className="td-name">{e.name}</td>
                              <td>{e.business}</td>
                              <td style={{fontSize:".65rem"}}>{e.category}</td>
                              <td style={{fontSize:".65rem",color:"var(--t3)"}}>{e.email}</td>
                              <td style={{color:"var(--gold)",fontFamily:"var(--serif)"}}>{e.price}</td>
                              <td style={{fontSize:".65rem",color:"var(--t3)"}}>{e.submitted}</td>
                              <td><div className="action-row">
                                <button className="action-btn approve" onClick={() => handleApproveListing("experience", e.id, e.name)}>Approve</button>
                                <button className="action-btn reject" onClick={() => handleRejectListing("experience", e.id)}>Reject</button>
                                <button className="action-btn view">Review</button>
                              </div></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </>
            )}

            {/* ── BOOKINGS ── */}
            {section === "bookings" && (
              <>
                <div className="section-hdr"><div className="section-title">All Bookings</div><div className="section-count">{bookings.filter(b=>b.status==="confirmed").length} confirmed · {bookings.filter(b=>b.status==="pending").length} pending</div></div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Reference</th><th>Property</th><th>Guest</th><th>Dates</th><th>Nights</th><th>Total</th><th>Platform Rev</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.ref}>
                          <td style={{fontFamily:"monospace",fontSize:".7rem",color:"var(--gold)"}}>{b.ref}</td>
                          <td className="td-name">{b.property}</td>
                          <td>{b.guest}</td>
                          <td style={{fontSize:".68rem"}}>{b.dates}</td>
                          <td>{b.nights}</td>
                          <td style={{fontFamily:"var(--serif)",color:"var(--t1)"}}>${b.total.toLocaleString()}</td>
                          <td style={{color:"var(--green)",fontFamily:"var(--serif)"}}>${(b.total*0.06).toFixed(0)}</td>
                          <td><span className={`td-badge ${b.status}`}>{b.status}</span></td>
                          <td><div className="action-row">
                            {b.status==="pending" && <button className="action-btn approve" onClick={() => handleApproveBooking(b.ref)}>Approve</button>}
                            {b.status==="pending" && <button className="action-btn reject">Decline</button>}
                            <button className="action-btn view">View</button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── MEMBERS ── */}
            {section === "members" && (
              <>
                <div className="section-hdr"><div className="section-title">Member Roster</div><div className="section-count">{MOCK_MEMBERS.length} active members</div></div>
                <div className="table-wrap">
                  <div style={{padding:"0"}}>
                    {MOCK_MEMBERS.map(m => (
                      <div key={m.email} className="member-row">
                        <div className="member-avatar">{m.initials}</div>
                        <div>
                          <div className="member-name">{m.name}</div>
                          <div className="member-email">{m.email}</div>
                        </div>
                        <div style={{marginLeft:20,fontSize:".68rem",color:"var(--t3)",fontWeight:300}}>Since {m.since}</div>
                        <div style={{marginLeft:16,fontSize:".68rem",color:"var(--t3)"}}>
                          <span style={{color:"var(--gold)",fontFamily:"var(--serif)"}}>{m.bookings}</span> bookings
                        </div>
                        <span className={`member-tier ${m.tier==="founding"?"td-badge curated":m.tier==="private"?"td-badge active":"td-badge pending"}`} style={{marginLeft:16}}>
                          {m.tier}
                        </span>
                        <div style={{marginLeft:auto}} className="action-row">
                          <button className="action-btn view" style={{marginLeft:16}}>View</button>
                          <button className="action-btn">Message</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── REVENUE ── */}
            {section === "revenue" && (
              <>
                <div className="section-hdr" style={{marginBottom:16}}><div className="section-title">Revenue Breakdown</div><div className="section-count">All 5 streams</div></div>
                <div className="rev-grid">
                  {[
                    { icon:"◈", label:"Memberships", amount:"$14,100", sub:"47 × avg $300/yr", mrr:"$1,175/mo" },
                    { icon:"◉", label:"Property Listings", amount:"$150", sub:"6 listings × $25", mrr:"$150/mo" },
                    { icon:"◌", label:"Agent Ads", amount:"$600", sub:"12 agents × $50", mrr:"$600/mo" },
                    { icon:"◎", label:"Experience Listings", amount:"$800", sub:"8 listings × $100", mrr:"$800/mo" },
                    { icon:"✦", label:"Booking Fees 6%", amount:"$9,200", sub:"Est. from confirmed bookings", mrr:"Variable" },
                  ].map(r => (
                    <div key={r.label} className="rev-card">
                      <span className="rev-icon">{r.icon}</span>
                      <div className="rev-amount">{r.amount}</div>
                      <div className="rev-label">{r.label}</div>
                      <div className="rev-sub">{r.sub}</div>
                      <div style={{marginTop:6,fontSize:".55rem",letterSpacing:".15em",textTransform:"uppercase",color:"var(--green)"}}>{r.mrr}</div>
                    </div>
                  ))}
                </div>
                <div className="stats-grid">
                  {[
                    { label:"Total MRR", value:"$2,725", change:"All subscription streams", dir:"up" },
                    { label:"Annual Run Rate", value:"$141K", change:"Subscriptions only", dir:"up" },
                    { label:"Booking GMV (MTD)", value:"$153K", change:"23 confirmed bookings", dir:"up" },
                    { label:"Platform Revenue (MTD)", value:"$9,200+", change:"6% of GMV + subscriptions", dir:"up" },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.value}</div>
                      <div className={`stat-change ${s.dir}`}>{s.change}</div>
                    </div>
                  ))}
                </div>
                <div className="section-hdr"><div className="section-title">Revenue Projection</div></div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Milestone</th><th>Members</th><th>Properties</th><th>Agents</th><th>Experiences</th><th>Booking GMV</th><th>Est. Monthly Revenue</th></tr></thead>
                    <tbody>
                      {[
                        ["Current", 47, 6, 12, 8, "$153K", "$11,925"],
                        ["Month 3", 100, 15, 20, 15, "$320K", "$21,450"],
                        ["Month 6", 200, 30, 30, 25, "$680K", "$42,100"],
                        ["Month 12", 400, 60, 50, 40, "$1.4M", "$85,000"],
                        ["Year 2", 1000, 120, 80, 60, "$3.2M", "$186,000"],
                      ].map(([mil,...rest]) => (
                        <tr key={mil}>
                          <td className="td-name">{mil}</td>
                          {rest.map((v,i) => <td key={i} style={i===5?{color:"var(--green)",fontFamily:"var(--serif)",fontWeight:400}:{}}>{v}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── AI AGENTS ── */}
            {section === "agents_ai" && (
              <>
                <div className="section-hdr"><div className="section-title">AI Agent Fleet</div><div className="section-count">5 agents active · Auto-reports Monday 8am MST</div></div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
                  {[
                    {icon:"◈",name:"Aria",role:"Sales & Revenue",color:"var(--gold)",status:"Active",last:"Weekly report generated Mon"},
                    {icon:"◉",name:"Celeste",role:"Marketing & Brand",color:"var(--taupe,#9E8E78)",status:"Active",last:"Campaign plan created"},
                    {icon:"◌",name:"Sterling",role:"Guest Concierge",color:"var(--gold)",status:"Active · 24/7",last:"Guest inquiry answered 2hr ago"},
                    {icon:"◎",name:"Atlas",role:"Operations",color:"var(--t3)",status:"Active",last:"Property readiness check Mon"},
                    {icon:"◍",name:"Orion",role:"Analytics & Intelligence",color:"var(--t3)",status:"Active",last:"Platform report generated Mon"},
                  ].map(a => (
                    <div key={a.name} className="stat-card" style={{cursor:"pointer"}} onClick={() => window.location.href="/admin/agents"}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                        <span style={{fontSize:"1.2rem",color:a.color}}>{a.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontFamily:"var(--serif)",fontSize:"1rem",color:"var(--t1)",fontWeight:400}}>{a.name}</div>
                          <div style={{fontSize:".58rem",color:"var(--gold)",letterSpacing:".1em"}}>{a.role}</div>
                        </div>
                        <span style={{fontSize:".5rem",letterSpacing:".15em",textTransform:"uppercase",color:"var(--green)",display:"flex",alignItems:"center",gap:4}}>
                          <span style={{width:5,height:5,borderRadius:"50%",background:"var(--green)",display:"inline-block"}}/>
                          {a.status}
                        </span>
                      </div>
                      <div style={{fontSize:".65rem",color:"var(--t3)",fontWeight:300,letterSpacing:".04em"}}>{a.last}</div>
                      <div style={{marginTop:12,display:"flex",gap:6}}>
                        <button className="action-btn view" style={{fontSize:".52rem"}}>Open Chat →</button>
                        <button className="action-btn" style={{fontSize:".52rem",borderColor:"rgba(201,169,110,.2)",color:"var(--gold)"}}>Run Report</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{background:"rgba(201,169,110,.05)",border:"1px solid rgba(201,169,110,.15)",borderRadius:3,padding:"18px 20px",marginBottom:20}}>
                  <div style={{fontFamily:"var(--serif)",fontSize:"1rem",color:"var(--t1)",marginBottom:6}}>Scheduled Reports</div>
                  <div style={{fontSize:".75rem",color:"var(--t2)",fontWeight:300,lineHeight:1.7}}>
                    Every Monday at 8:00 AM MST, Aria (Sales), Celeste (Marketing), Atlas (Operations), and Orion (Analytics) automatically generate comprehensive reports and email them to <strong style={{color:"var(--ivory)"}}>{localStorage.getItem("ownerEmail") || "your configured email"}</strong>.<br />
                    Next reports: <strong style={{color:"var(--gold)"}}>Monday at 8:00 AM MST</strong>
                  </div>
                </div>
                <div style={{textAlign:"center",padding:"20px 0"}}>
                  <button className="hbtn primary" onClick={() => window.location.href="/admin/agents"}>Open Full AI Command Center →</button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,background:"var(--ink-s)",border:`1px solid ${toast.type==="error"?"rgba(224,82,82,.25)":"rgba(91,175,132,.3)"}`,borderRadius:3,padding:"13px 18px",display:"flex",alignItems:"center",gap:10,minWidth:260,animation:"slideDown .25s ease",boxShadow:"0 4px 24px rgba(0,0,0,.3)"}}>
          <span style={{fontSize:"1rem"}}>{toast.type==="error"?"✕":"✓"}</span>
          <span style={{fontSize:".78rem",color:"var(--t1)",fontWeight:300}}>{toast.msg}</span>
        </div>
      )}
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}`}</style>
    </>
  );
}
