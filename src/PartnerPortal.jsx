import { useState, useRef, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = "https://vgmxzkedexjxdtjtbbok.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbXh6a2VkZXhqeGR0anRiYm9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjQ1NjUsImV4cCI6MjA5MjIwMDU2NX0.zbCmIPOvIzFRFYTdVsjp1UTFEDl6x1CwqxfaizmwSkw";
const supabase = createClient(SUPA_URL, SUPA_KEY);

const MAX_FILE_MB = 20;

const CATEGORIES = [
  { id: "property",   label: "Estate / Property",       icon: "◈", price: "$250/mo", table: "host_listings",       bucket: "property-images" },
  { id: "agent",      label: "Real Estate Agent",        icon: "◉", price: "$350/mo", table: "agent_listings",      bucket: "agent-images" },
  { id: "restaurant", label: "Restaurant / Dining",      icon: "🍽", price: "$350/mo", table: "restaurant_listings", bucket: "restaurant-images" },
  { id: "golf",       label: "Golf Club / Course",       icon: "⛳", price: "$599/mo", table: "golf_listings",       bucket: "golf-images" },
  { id: "cars",       label: "Luxury Car Rental",        icon: "🚗", price: "$250/mo", table: "car_listings",        bucket: "car-images" },
  { id: "medspa",     label: "Med Spa & Wellness",       icon: "💆", price: "$250/mo", table: "medspa_listings",     bucket: "medspa-images" },
  { id: "aviation",   label: "Private Aviation",         icon: "✈",  price: "$499/mo", table: "aviation_listings",   bucket: "aviation-images" },
  { id: "yacht",      label: "Yacht & Charters",         icon: "🛥", price: "$499/mo", table: "yacht_listings",      bucket: "yacht-images" },
  { id: "shopping",   label: "Luxury Shopping",          icon: "💎", price: "$250/mo", table: "shopping_listings",   bucket: "shopping-images" },
  { id: "wine",       label: "Wine & Spirits",           icon: "🍷", price: "$350/mo", table: "wine_listings",       bucket: "wine-images" },
  { id: "events",     label: "Private Events",           icon: "🎪", price: "$250/mo", table: "events_listings",     bucket: "events-images" },
  { id: "experience", label: "Experiences & Activities", icon: "◌", price: "$250/mo", table: "experience_listings", bucket: "experience-images" },
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
html,body{min-height:100%;font-family:var(--sans);background:var(--ink);color:var(--t1);-webkit-font-smoothing:antialiased}
.pp-nav{height:56px;background:rgba(22,20,18,.97);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 36px;position:sticky;top:0;z-index:100;backdrop-filter:blur(20px)}
.pp-logo{font-family:var(--serif);font-size:1.1rem;font-weight:300;letter-spacing:.18em;text-transform:uppercase;color:var(--t1);cursor:pointer}
.pp-logo span{color:var(--gold)}
.pp-subnav{font-size:.52rem;letter-spacing:.22em;text-transform:uppercase;color:var(--taupe);margin-left:18px;padding-left:18px;border-left:1px solid var(--border)}
.pp-nav-right{margin-left:auto;display:flex;align-items:center;gap:12px}
.pp-nav-user{font-size:.6rem;color:var(--taupe);font-weight:300}
.pp-nav-signout{background:none;border:1px solid var(--border);color:var(--t3);font-size:.52rem;letter-spacing:.14em;text-transform:uppercase;font-family:var(--sans);padding:6px 12px;cursor:pointer;border-radius:2px;transition:all .15s}
.pp-nav-signout:hover{border-color:var(--red);color:var(--red)}
.pp-hero{background:var(--ink-m);border-bottom:1px solid var(--border);padding:52px 56px 44px;position:relative;overflow:hidden}
.pp-hero::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.pp-hero-e{font-size:.52rem;letter-spacing:.38em;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
.pp-hero-h{font-family:var(--serif);font-size:clamp(2rem,4vw,3.2rem);font-weight:300;color:var(--t1);line-height:1.1;margin-bottom:14px}
.pp-hero-h em{font-style:italic;color:var(--gold-l)}
.pp-hero-sub{font-size:.82rem;color:var(--t3);font-weight:300;line-height:1.8;max-width:580px}
.pp-body{display:grid;grid-template-columns:260px 1fr;min-height:calc(100vh - 56px - 200px);gap:0}
.pp-sidebar{background:var(--ink-m);border-right:1px solid var(--border);padding:24px 0;position:sticky;top:56px;height:calc(100vh - 56px);overflow-y:auto}
.pp-sidebar-label{font-size:.46rem;letter-spacing:.28em;text-transform:uppercase;color:var(--taupe);padding:0 20px 10px;font-weight:500}
.pp-cat{display:flex;align-items:center;gap:10px;padding:10px 20px;cursor:pointer;transition:all .15s;border-left:2px solid transparent}
.pp-cat:hover{background:rgba(212,201,181,.04)}
.pp-cat.on{background:rgba(201,169,110,.07);border-left-color:var(--gold)}
.pp-cat-icon{font-size:.9rem;width:16px;text-align:center;flex-shrink:0}
.pp-cat-info{flex:1}
.pp-cat-name{font-size:.7rem;font-weight:400;color:var(--t2)}
.pp-cat.on .pp-cat-name{color:var(--gold-l)}
.pp-cat-price{font-size:.54rem;color:var(--taupe);font-weight:300}
.pp-main{padding:36px 44px;overflow-y:auto}
.pp-form-title{font-family:var(--serif);font-size:1.8rem;font-weight:300;color:var(--t1);margin-bottom:4px}
.pp-form-sub{font-size:.72rem;color:var(--taupe);font-weight:300;margin-bottom:28px}
.pp-section{margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid var(--border)}
.pp-section:last-child{border-bottom:none}
.pp-section-title{font-size:.54rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;font-weight:500}
.fg{margin-bottom:14px}
.fl{font-size:.52rem;letter-spacing:.18em;text-transform:uppercase;color:var(--taupe);display:block;margin-bottom:6px;font-weight:500}
.fi{width:100%;background:rgba(248,245,240,.04);border:1px solid var(--border);border-radius:2px;padding:11px 13px;font-family:var(--sans);font-size:.8rem;color:var(--t1);font-weight:300;outline:none;transition:border-color .18s}
.fi:focus{border-color:var(--bh)}
.fi::placeholder{color:var(--t3)}
.fis{width:100%;background:rgba(248,245,240,.04);border:1px solid var(--border);border-radius:2px;padding:11px 13px;font-family:var(--sans);font-size:.8rem;color:var(--t1);font-weight:300;outline:none;-webkit-appearance:none;cursor:pointer}
.fis:focus{border-color:var(--bh)}
.fit{width:100%;background:rgba(248,245,240,.04);border:1px solid var(--border);border-radius:2px;padding:11px 13px;font-family:var(--sans);font-size:.8rem;color:var(--t1);font-weight:300;outline:none;resize:vertical;min-height:90px;line-height:1.6}
.fit:focus{border-color:var(--bh)}
.fit::placeholder{color:var(--t3)}
.r2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.r3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.photo-drop{border:2px dashed rgba(201,169,110,.25);border-radius:3px;padding:36px 24px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(201,169,110,.03)}
.photo-drop:hover,.photo-drop.drag{border-color:rgba(201,169,110,.5);background:rgba(201,169,110,.06)}
.photo-drop-icon{font-size:2rem;color:var(--gold);margin-bottom:12px;opacity:.7}
.photo-drop-title{font-family:var(--serif);font-size:1.1rem;color:var(--t1);margin-bottom:6px}
.photo-drop-sub{font-size:.68rem;color:var(--taupe);font-weight:300;line-height:1.7}
.photo-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-top:16px}
.photo-thumb{position:relative;padding-top:100%;border-radius:2px;overflow:hidden;border:1px solid var(--border)}
.photo-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.photo-thumb-del{position:absolute;top:4px;right:4px;background:rgba(22,20,18,.85);border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;color:var(--t1);font-size:.6rem;display:flex;align-items:center;justify-content:center}
.photo-thumb-del:hover{background:var(--red)}
.photo-primary{position:absolute;bottom:4px;left:4px;background:rgba(201,169,110,.9);border-radius:2px;font-size:.46rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);padding:2px 5px;font-weight:600}
.photo-count{font-size:.64rem;color:var(--taupe);margin-top:10px;text-align:center}
.upload-progress{background:rgba(201,169,110,.1);border:1px solid rgba(201,169,110,.2);border-radius:2px;padding:10px 14px;margin-top:10px;font-size:.7rem;color:var(--gold)}
.amenity-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}
.amenity-chip{border:1px solid var(--border);border-radius:2px;padding:7px 10px;font-size:.62rem;color:var(--t3);cursor:pointer;transition:all .15s;text-align:center}
.amenity-chip:hover{border-color:rgba(201,169,110,.3);color:var(--t2)}
.amenity-chip.on{border-color:var(--gold);background:rgba(201,169,110,.1);color:var(--gold)}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(212,201,181,.07)}
.toggle-label{font-size:.74rem;color:var(--t2);font-weight:300}
.toggle-sub{font-size:.6rem;color:var(--taupe);margin-top:2px;font-weight:300}
.toggle{width:36px;height:20px;background:rgba(212,201,181,.1);border-radius:10px;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0}
.toggle.on{background:var(--gold)}
.toggle::after{content:'';position:absolute;top:3px;left:3px;width:14px;height:14px;background:var(--t1);border-radius:50%;transition:transform .2s}
.toggle.on::after{transform:translateX(16px)}
.price-note{background:rgba(201,169,110,.06);border:1px solid rgba(201,169,110,.15);border-radius:2px;padding:14px 16px;margin-bottom:20px}
.price-note-val{font-family:var(--serif);font-size:1.4rem;color:var(--gold);font-weight:300}
.price-note-sub{font-size:.62rem;color:var(--taupe);font-weight:300;margin-top:3px}
.submit-btn{width:100%;background:var(--gold);color:var(--ink);font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;font-weight:600;font-family:var(--sans);padding:16px;border:none;cursor:pointer;transition:background .18s;border-radius:2px;margin-top:8px}
.submit-btn:hover{background:var(--gold-l)}
.submit-btn:disabled{opacity:.5;cursor:not-allowed}
.success-box{background:var(--ink-m);border:1px solid rgba(91,175,132,.3);border-radius:3px;padding:36px;text-align:center;position:relative;overflow:hidden}
.success-box::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#5BAF84,transparent)}
.error-box{background:rgba(224,82,82,.06);border:1px solid rgba(224,82,82,.25);border-radius:2px;padding:12px 16px;font-size:.72rem;color:var(--red);margin-bottom:14px}
.pp-pick{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:36px 44px}
.pp-pick-card{background:var(--ink-m);border:1px solid var(--border);border-radius:3px;padding:22px;cursor:pointer;transition:all .2s;text-align:center}
.pp-pick-card:hover{border-color:var(--bh);transform:translateY(-2px)}
.pp-pick-icon{font-size:1.6rem;margin-bottom:10px;display:block}
.pp-pick-name{font-family:var(--serif);font-size:1rem;color:var(--t1);margin-bottom:4px}
.pp-pick-price{font-size:.58rem;letter-spacing:.12em;color:var(--gold);font-weight:500}
.pp-pick-desc{font-size:.64rem;color:var(--t3);font-weight:300;margin-top:6px;line-height:1.5}
.auth-input{width:100%;background:rgba(248,245,240,.04);border:1px solid rgba(212,201,181,.11);border-radius:2px;padding:11px 13px;font-family:'Jost',system-ui,sans-serif;font-size:.8rem;color:#F8F5F0;font-weight:300;outline:none;transition:border-color .18s;margin-bottom:0}
.auth-input:focus{border-color:rgba(201,169,110,.32)}
.auth-input::placeholder{color:rgba(248,245,240,.38)}
@media(max-width:900px){.pp-body{grid-template-columns:1fr}.pp-sidebar{position:static;height:auto;display:flex;overflow-x:auto;padding:12px 0;border-right:none;border-bottom:1px solid var(--border)}.pp-cat{flex-shrink:0;min-width:140px}.pp-pick{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.r2,.r3{grid-template-columns:1fr}.photo-grid{grid-template-columns:repeat(4,1fr)}.pp-pick{grid-template-columns:1fr}.pp-main{padding:24px 20px}.pp-hero{padding:36px 22px 28px}}
@keyframes spin{to{transform:rotate(360deg)}}
`;

// ── PHOTO UPLOAD ──────────────────────────────────────────────
function PhotoUploader({ bucket, listingId, photos, setPhotos, max = 30 }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const inputRef = useRef(null);

  const uploadFiles = async (files) => {
    const remaining = max - photos.length;
    if (remaining <= 0) return;
    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    const uploaded = [];
    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i];
      setUploadMsg(`Uploading ${i + 1} of ${toUpload.length}...`);
      if (file.size > MAX_FILE_MB * 1024 * 1024) { setUploadMsg(`${file.name} exceeds ${MAX_FILE_MB}MB — skipped`); continue; }
      const ext = file.name.split('.').pop();
      const path = `${listingId}/${Date.now()}-${i}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (!error) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
        uploaded.push({ path, url: urlData.publicUrl, name: file.name });
      }
    }
    setPhotos(prev => [...prev, ...uploaded]);
    setUploading(false);
    setUploadMsg(`${uploaded.length} photo${uploaded.length !== 1 ? 's' : ''} uploaded`);
    setTimeout(() => setUploadMsg(""), 3000);
  };

  const removePhoto = async (idx) => {
    const photo = photos[idx];
    await supabase.storage.from(bucket).remove([photo.path]);
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const onDrop = useCallback((e) => { e.preventDefault(); setDragging(false); uploadFiles(e.dataTransfer.files); }, [photos]);

  return (
    <div>
      <div className={`photo-drop${dragging ? " drag" : ""}`} onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
        <div className="photo-drop-icon">📷</div>
        <div className="photo-drop-title">Drop photos here or click to upload</div>
        <div className="photo-drop-sub">JPG, PNG, WEBP · Max {MAX_FILE_MB}MB each · Up to {max} photos<br /><strong style={{ color: "var(--gold-l)" }}>First photo becomes your cover image</strong></div>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => uploadFiles(e.target.files)} />
      </div>
      {uploading && <div className="upload-progress">⬆ {uploadMsg}</div>}
      {!uploading && uploadMsg && <div className="upload-progress" style={{ color: "var(--green)" }}>✓ {uploadMsg}</div>}
      {photos.length > 0 && (
        <>
          <div className="photo-grid">
            {photos.map((p, i) => (
              <div key={p.path} className="photo-thumb">
                <img src={p.url} alt={p.name} />
                {i === 0 && <span className="photo-primary">Cover</span>}
                <button className="photo-thumb-del" onClick={() => removePhoto(i)}>✕</button>
              </div>
            ))}
          </div>
          <div className="photo-count">{photos.length} / {max} photos</div>
        </>
      )}
    </div>
  );
}

function AmenityPicker({ options, selected, onChange }) {
  return (
    <div className="amenity-grid">
      {options.map(o => (
        <div key={o} className={`amenity-chip${selected.includes(o) ? " on" : ""}`}
          onClick={() => onChange(selected.includes(o) ? selected.filter(x => x !== o) : [...selected, o])}>{o}</div>
      ))}
    </div>
  );
}

function Toggle({ label, sub, value, onChange }) {
  return (
    <div className="toggle-row">
      <div><div className="toggle-label">{label}</div>{sub && <div className="toggle-sub">{sub}</div>}</div>
      <div className={`toggle${value ? " on" : ""}`} onClick={() => onChange(!value)} />
    </div>
  );
}

function Field({ label, children }) {
  return <div className="fg"><label className="fl">{label}</label>{children}</div>;
}

// ── CATEGORY FORMS ────────────────────────────────────────────
function PropertyForm({ fv, setFv, photos, setPhotos, listingId }) {
  const f = k => e => setFv(p => ({ ...p, [k]: e.target.value }));
  const [amenities, setAmenities] = useState([]);
  const AMENITIES = ["Pool","Heated Pool","Hot Tub","Sauna","Steam Room","Home Theater","Chef Kitchen","Wine Cellar","Game Room","Gym / Fitness","Golf Simulator","Tennis Court","Putting Green","Fire Pit","Outdoor Kitchen","BBQ / Grill","Cabana","Casita / Guest House","Mountain View","City View","Golf View","Desert View","Smart Home","EV Charging","Gated Entry","Security System","Elevator","Pet Friendly","Wheelchair Accessible","Event Ready","Catering Kitchen","Dance Floor","AV System","Piano","Billiards","Arcade"];
  return (
    <>
      <div className="pp-section">
        <div className="pp-section-title">Property Details</div>
        <Field label="Property / Estate Name *"><input className="fi" placeholder="e.g. Villa Dorada at Paradise Valley" onChange={f("property_title")} /></Field>
        <div className="r2">
          <Field label="Area *">
            <select className="fis" onChange={f("area")}>
              <option value="">Select area</option>
              {["Paradise Valley","North Scottsdale","Old Town Scottsdale","Scottsdale","DC Ranch","Troon","Arcadia","Gainey Ranch","McCormick Ranch","Desert Mountain","Silverleaf","Camelback Mountain"].map(a => <option key={a}>{a}</option>)}
            </select>
          </Field>
          <Field label="Nightly Rate ($) *"><input className="fi" type="number" placeholder="2500" onChange={f("nightly_rate")} /></Field>
        </div>
        <div className="r3">
          <Field label="Bedrooms *"><input className="fi" type="number" placeholder="6" onChange={f("bedrooms")} /></Field>
          <Field label="Bathrooms *"><input className="fi" type="number" placeholder="7" step="0.5" onChange={f("bathrooms")} /></Field>
          <Field label="Max Guests *"><input className="fi" type="number" placeholder="14" onChange={f("max_guests")} /></Field>
        </div>
        <div className="r3">
          <Field label="Cleaning Fee ($)"><input className="fi" type="number" placeholder="500" onChange={f("cleaning_fee")} /></Field>
          <Field label="Security Deposit ($)"><input className="fi" type="number" placeholder="2000" onChange={f("security_deposit")} /></Field>
          <Field label="Min. Night Stay"><input className="fi" type="number" placeholder="2" onChange={f("min_nights")} /></Field>
        </div>
        <div className="r2">
          <Field label="Check-in Time"><input className="fi" placeholder="4:00 PM" onChange={f("check_in_time")} /></Field>
          <Field label="Check-out Time"><input className="fi" placeholder="11:00 AM" onChange={f("check_out_time")} /></Field>
        </div>
        <Field label="Property Description *"><textarea className="fit" rows={5} placeholder="Describe your estate in rich, editorial detail..." onChange={f("description")} /></Field>
        <Field label="House Rules / Additional Notes"><textarea className="fit" rows={3} placeholder="Quiet hours, parking rules, pool policies, smoking policy..." onChange={f("additional_rules")} /></Field>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Amenities & Features</div>
        <AmenityPicker options={AMENITIES} selected={amenities} onChange={v => { setAmenities(v); setFv(p => ({ ...p, amenities: v })); }} />
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Property Options</div>
        <Toggle label="Event Ready" sub="Allow corporate retreats, celebrations, and private events" value={fv.event_ready} onChange={v => setFv(p => ({ ...p, event_ready: v }))} />
        <Toggle label="Pet Friendly" sub="Guests may bring pets" value={fv.pet_friendly} onChange={v => setFv(p => ({ ...p, pet_friendly: v }))} />
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Contact Information</div>
        <Field label="Your Name / Company *"><input className="fi" placeholder="Full name or property management company" onChange={f("host_name")} /></Field>
        <div className="r2">
          <Field label="Email Address *"><input className="fi" type="email" placeholder="your@email.com" onChange={f("host_email")} /></Field>
          <Field label="Phone Number *"><input className="fi" type="tel" placeholder="(480) 555-0000" onChange={f("host_phone")} /></Field>
        </div>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Photos (Up to 30)</div>
        <PhotoUploader bucket="property-images" listingId={listingId} photos={photos} setPhotos={setPhotos} max={30} />
      </div>
    </>
  );
}

function AgentForm({ fv, setFv, photos, setPhotos, listingId }) {
  const f = k => e => setFv(p => ({ ...p, [k]: e.target.value }));
  const [specialties, setSpecialties] = useState([]);
  const SPECIALTIES = ["Luxury Estates","New Construction","Investment Properties","Relocation","1031 Exchange","Land & Lots","Short-Term Rentals","Commercial","International Buyers","Architectural Homes","Golf Communities","Equestrian Properties"];
  return (
    <>
      <div className="pp-section">
        <div className="pp-section-title">Agent Profile</div>
        <div className="r2">
          <Field label="Full Name *"><input className="fi" placeholder="Your full name" onChange={f("agent_name")} /></Field>
          <Field label="Title / Designation *"><input className="fi" placeholder="Luxury Estate Specialist" onChange={f("agent_title")} /></Field>
        </div>
        <Field label="Brokerage / Agency *"><input className="fi" placeholder="e.g. Russ Lyon Sotheby's International Realty" onChange={f("agency")} /></Field>
        <div className="r2">
          <Field label="Years in Luxury RE *"><input className="fi" type="number" placeholder="14" onChange={f("years_experience")} /></Field>
          <Field label="Career Sales Volume *"><input className="fi" placeholder="$280M+" onChange={f("career_sales_volume")} /></Field>
        </div>
        <Field label="AZ Real Estate License # *"><input className="fi" placeholder="SA12345678" onChange={f("license_number")} /></Field>
        <Field label="Areas Served"><input className="fi" placeholder="Paradise Valley, North Scottsdale, Arcadia..." onChange={f("areas_served")} /></Field>
        <Field label="Professional Bio *"><textarea className="fit" rows={5} placeholder="2-4 sentences on your expertise and what sets you apart..." onChange={f("bio")} /></Field>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Specialties</div>
        <AmenityPicker options={SPECIALTIES} selected={specialties} onChange={v => { setSpecialties(v); setFv(p => ({ ...p, specialties: v })); }} />
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Contact</div>
        <div className="r2">
          <Field label="Email *"><input className="fi" type="email" placeholder="you@agency.com" onChange={f("email")} /></Field>
          <Field label="Phone *"><input className="fi" type="tel" onChange={f("phone")} /></Field>
        </div>
        <Field label="Website / Profile URL"><input className="fi" placeholder="https://youragentprofile.com" onChange={f("website_url")} /></Field>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Headshot & Portfolio (Up to 10)</div>
        <PhotoUploader bucket="agent-images" listingId={listingId} photos={photos} setPhotos={setPhotos} max={10} />
      </div>
    </>
  );
}

function RestaurantForm({ fv, setFv, photos, setPhotos, listingId }) {
  const f = k => e => setFv(p => ({ ...p, [k]: e.target.value }));
  const [features, setFeatures] = useState([]);
  const FEATURES = ["Private Dining Room","Chef's Table","Omakase","Wine Cellar","Patio / Outdoor","Live Music","Valet Parking","Full Bar","Tasting Menu","Catering Available","On-Site Sommelier","Event Hosting","Kosher","Vegan Menu","Gluten-Free Options"];
  return (
    <>
      <div className="pp-section">
        <div className="pp-section-title">Restaurant Details</div>
        <Field label="Restaurant Name *"><input className="fi" placeholder="Your restaurant name" onChange={f("restaurant_name")} /></Field>
        <div className="r2">
          <Field label="Cuisine Type *"><input className="fi" placeholder="e.g. Japanese · Contemporary" onChange={f("cuisine_type")} /></Field>
          <Field label="Price Range *">
            <select className="fis" onChange={f("price_range")}>
              <option value="">Select</option>
              <option value="$$">$$ — Casual Upscale</option>
              <option value="$$$">$$$ — Fine Dining</option>
              <option value="$$$$">$$$$ — Ultra Luxury</option>
            </select>
          </Field>
        </div>
        <div className="r2">
          <Field label="Executive Chef *"><input className="fi" placeholder="Chef's full name" onChange={f("chef_name")} /></Field>
          <Field label="Neighborhood / Area *"><input className="fi" placeholder="Old Town Scottsdale" onChange={f("area")} /></Field>
        </div>
        <Field label="Signature Dishes (3–5) *"><input className="fi" placeholder="e.g. Black Cod Miso, Wagyu Tomahawk" onChange={f("signature_dishes")} /></Field>
        <Field label="Restaurant Description *"><textarea className="fit" rows={5} placeholder="Describe your restaurant, ambiance, and what makes it exceptional..." onChange={f("description")} /></Field>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Private Dining</div>
        <Toggle label="Private Dining Room Available" sub="Dedicated private space for groups" value={fv.private_dining} onChange={v => setFv(p => ({ ...p, private_dining: v }))} />
        {fv.private_dining && <Field label="Max Private Dining Guests"><input className="fi" type="number" placeholder="20" onChange={f("max_private_guests")} /></Field>}
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Features</div>
        <AmenityPicker options={FEATURES} selected={features} onChange={v => { setFeatures(v); setFv(p => ({ ...p, features: v })); }} />
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Contact & Reservations</div>
        <div className="r2">
          <Field label="Reservation Phone *"><input className="fi" type="tel" placeholder="(480) 555-0000" onChange={f("reservation_phone")} /></Field>
          <Field label="Email *"><input className="fi" type="email" onChange={f("email")} /></Field>
        </div>
        <div className="r2">
          <Field label="Website"><input className="fi" placeholder="https://" onChange={f("website_url")} /></Field>
          <Field label="Online Reservation Link"><input className="fi" placeholder="https://resy.com/..." onChange={f("reservation_url")} /></Field>
        </div>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Photos (Up to 20)</div>
        <PhotoUploader bucket="restaurant-images" listingId={listingId} photos={photos} setPhotos={setPhotos} max={20} />
      </div>
    </>
  );
}

function GolfForm({ fv, setFv, photos, setPhotos, listingId }) {
  const f = k => e => setFv(p => ({ ...p, [k]: e.target.value }));
  const [features, setFeatures] = useState([]);
  const FEATURES = ["18-Hole Championship","9-Hole Course","Driving Range","Putting Green","Short Game Area","Pro Shop","Club Rental","Caddie Service","Golf Instruction","Golf Cart Included","Scenic Desert Course","Mountain Views","Tournament Venue","Private Club Access","19th Hole Bar","On-Course Dining","Event Hosting","Corporate Outings"];
  return (
    <>
      <div className="pp-section">
        <div className="pp-section-title">Club / Course Details</div>
        <Field label="Club / Course Name *"><input className="fi" placeholder="Your club or course name" onChange={f("club_name")} /></Field>
        <div className="r2">
          <Field label="Course Type *">
            <select className="fis" onChange={f("course_type")}>
              <option value="">Select type</option>
              {["Championship Course","Private Club","Semi-Private","Resort Course","Public Premium","Desert Course"].map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Location / Area *"><input className="fi" placeholder="North Scottsdale" onChange={f("area")} /></Field>
        </div>
        <div className="r2">
          <Field label="Green Fee Range *"><input className="fi" placeholder="$350–750/round" onChange={f("green_fee_range")} /></Field>
          <Field label="Course Designer"><input className="fi" placeholder="e.g. Tom Weiskopf, Jack Nicklaus" onChange={f("course_designer")} /></Field>
        </div>
        <Field label="Course Description *"><textarea className="fit" rows={5} placeholder="Describe the course, signature holes, scenery..." onChange={f("description")} /></Field>
        <Field label="Accolades"><input className="fi" placeholder="e.g. Top 100 US Courses, PGA Tour Venue" onChange={f("accolades")} /></Field>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Facilities & Features</div>
        <AmenityPicker options={FEATURES} selected={features} onChange={v => { setFeatures(v); setFv(p => ({ ...p, features: v })); }} />
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Access Options</div>
        <Toggle label="Guest Access Available" sub="Non-members can book tee times" value={fv.guest_access} onChange={v => setFv(p => ({ ...p, guest_access: v }))} />
        <Toggle label="Corporate Outings Welcome" value={fv.corporate_events} onChange={v => setFv(p => ({ ...p, corporate_events: v }))} />
        <Toggle label="Caddie Service Available" value={fv.caddie_service} onChange={v => setFv(p => ({ ...p, caddie_service: v }))} />
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Contact</div>
        <div className="r2">
          <Field label="Contact Name *"><input className="fi" placeholder="Director of Golf" onChange={f("contact_name")} /></Field>
          <Field label="Email *"><input className="fi" type="email" onChange={f("email")} /></Field>
        </div>
        <Field label="Phone *"><input className="fi" type="tel" onChange={f("phone")} /></Field>
        <Field label="Booking Website"><input className="fi" placeholder="https://" onChange={f("booking_url")} /></Field>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Photos (Up to 20)</div>
        <PhotoUploader bucket="golf-images" listingId={listingId} photos={photos} setPhotos={setPhotos} max={20} />
      </div>
    </>
  );
}

function CarForm({ fv, setFv, photos, setPhotos, listingId }) {
  const f = k => e => setFv(p => ({ ...p, [k]: e.target.value }));
  const [fleet, setFleet] = useState([]);
  const [services, setServices] = useState([]);
  const FLEET = ["Ferrari","Lamborghini","Rolls-Royce","Bentley","McLaren","Porsche","Maserati","Aston Martin","Mercedes S-Class","Mercedes G-Wagon","Range Rover","BMW M Series","Tesla Model S Plaid","Cadillac Escalade","Lincoln Navigator","Sprinter Van"];
  const SERVICES = ["Estate Delivery","Airport Pickup / Drop","Chauffeur Available","24/7 Support","Insurance Included","Unlimited Miles","Child Seat Available","Concierge Pairing"];
  return (
    <>
      <div className="pp-section">
        <div className="pp-section-title">Business Details</div>
        <Field label="Company / Business Name *"><input className="fi" placeholder="Your luxury rental company name" onChange={f("business_name")} /></Field>
        <div className="r2">
          <Field label="Starting Daily Rate ($) *"><input className="fi" type="number" placeholder="1800" onChange={f("starting_daily_rate")} /></Field>
          <Field label="Years in Business"><input className="fi" type="number" placeholder="8" onChange={f("years_in_business")} /></Field>
        </div>
        <Field label="Fleet Overview *"><textarea className="fit" rows={4} placeholder="Describe your fleet and the experience you deliver..." onChange={f("description")} /></Field>
        <Field label="Specific Models"><input className="fi" placeholder="2024 Ferrari Roma Spider, 2024 Lamborghini Urus..." onChange={f("fleet_description")} /></Field>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Brands Available</div>
        <AmenityPicker options={FLEET} selected={fleet} onChange={v => { setFleet(v); setFv(p => ({ ...p, fleet_brands: v })); }} />
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Services</div>
        <AmenityPicker options={SERVICES} selected={services} onChange={v => { setServices(v); setFv(p => ({ ...p, services_included: v })); }} />
        <div style={{ marginTop: 12 }}>
          <Toggle label="Estate Delivery Available" sub="Deliver directly to guest estate" value={fv.estate_delivery} onChange={v => setFv(p => ({ ...p, estate_delivery: v }))} />
        </div>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Contact</div>
        <div className="r2">
          <Field label="Email *"><input className="fi" type="email" onChange={f("email")} /></Field>
          <Field label="Phone *"><input className="fi" type="tel" onChange={f("phone")} /></Field>
        </div>
        <Field label="Website"><input className="fi" placeholder="https://" onChange={f("website_url")} /></Field>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Fleet Photos (Up to 30)</div>
        <PhotoUploader bucket="car-images" listingId={listingId} photos={photos} setPhotos={setPhotos} max={30} />
      </div>
    </>
  );
}

function MedSpaForm({ fv, setFv, photos, setPhotos, listingId }) {
  const f = k => e => setFv(p => ({ ...p, [k]: e.target.value }));
  const [services, setServices] = useState([]);
  const SERVICES = ["IV Therapy","NAD+ Infusion","Myers Cocktail","Vitamin C Drip","Glutathione","Hangover Recovery","Botox","Dysport","Fillers","Sculptra","Microneedling","PRP Facial","Laser Resurfacing","Chemical Peels","HydraFacial","Body Sculpting","Cryotherapy","Infrared Sauna","Massage Therapy","Deep Tissue","Hot Stone","Couples Massage","Facials","Hormone Therapy","Peptide Therapy"];
  return (
    <>
      <div className="pp-section">
        <div className="pp-section-title">Business Details</div>
        <Field label="Business / Spa Name *"><input className="fi" placeholder="Your spa or clinic name" onChange={f("business_name")} /></Field>
        <div className="r2">
          <Field label="Location / Area *"><input className="fi" placeholder="Old Town Scottsdale" onChange={f("area")} /></Field>
          <Field label="Starting Price *"><input className="fi" placeholder="From $195" onChange={f("starting_price")} /></Field>
        </div>
        <Field label="Description *"><textarea className="fit" rows={5} placeholder="Describe your services, credentials, and approach..." onChange={f("description")} /></Field>
        <Field label="Credentials / Certifications"><input className="fi" placeholder="Board-certified physicians, RN, NP..." onChange={f("credentials")} /></Field>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Services Offered</div>
        <AmenityPicker options={SERVICES} selected={services} onChange={v => { setServices(v); setFv(p => ({ ...p, services_offered: v.join(", ") })); }} />
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Service Options</div>
        <Toggle label="In-Villa Service Available" sub="Travel to guest estates for treatments" value={fv.in_villa_service} onChange={v => setFv(p => ({ ...p, in_villa_service: v }))} />
        <Toggle label="Same-Day Appointments" value={fv.same_day} onChange={v => setFv(p => ({ ...p, same_day: v }))} />
        <Toggle label="Couples / Group Sessions" value={fv.group_sessions} onChange={v => setFv(p => ({ ...p, group_sessions: v }))} />
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Contact</div>
        <div className="r2">
          <Field label="Email *"><input className="fi" type="email" onChange={f("email")} /></Field>
          <Field label="Phone *"><input className="fi" type="tel" onChange={f("phone")} /></Field>
        </div>
        <Field label="Booking Website"><input className="fi" placeholder="https://" onChange={f("website_url")} /></Field>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Photos (Up to 20)</div>
        <PhotoUploader bucket="medspa-images" listingId={listingId} photos={photos} setPhotos={setPhotos} max={20} />
      </div>
    </>
  );
}

function AviationForm({ fv, setFv, photos, setPhotos, listingId }) {
  const f = k => e => setFv(p => ({ ...p, [k]: e.target.value }));
  const [aircraft, setAircraft] = useState([]);
  const [services, setServices] = useState([]);
  const AIRCRAFT = ["Very Light Jet","Light Jet","Midsize Jet","Super Midsize Jet","Heavy Jet","Ultra Long Range","Turboprop","Helicopter — Light","Helicopter — Medium","Helicopter — Heavy","Gulfstream G650","Bombardier Global","Dassault Falcon","Cessna Citation","Bell 407","Sikorsky S-76"];
  const SERVICES_LIST = ["On-Demand Charter","Jet Card Program","Fractional Ownership","Empty Leg Deals","Grand Canyon Tours","Sedona Tours","Airport Transfers","Catering Service","Pet Friendly","International Flights","Ground Transportation"];
  return (
    <>
      <div className="pp-section">
        <div className="pp-section-title">Company Details</div>
        <Field label="Company Name *"><input className="fi" placeholder="Your aviation company name" onChange={f("company_name")} /></Field>
        <div className="r2">
          <Field label="Service Type *">
            <select className="fis" onChange={f("service_type")}>
              <option value="">Select primary service</option>
              {["On-Demand Charter","Jet Card","Fractional Ownership","Helicopter Tours","Airport Transfers","Scenic Tours","Multi-service Operator"].map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Base Airport *"><input className="fi" placeholder="Scottsdale Airport (SDL)" onChange={f("base_airport")} /></Field>
        </div>
        <Field label="Starting Rate *"><input className="fi" placeholder="From $8,500/hr" onChange={f("starting_rate")} /></Field>
        <Field label="Company Description *"><textarea className="fit" rows={5} placeholder="Describe your service, safety record, destinations, fleet..." onChange={f("description")} /></Field>
        <Field label="FAA Certificate Number"><input className="fi" placeholder="ATCO12345" onChange={f("faa_cert")} /></Field>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Aircraft / Fleet</div>
        <AmenityPicker options={AIRCRAFT} selected={aircraft} onChange={v => { setAircraft(v); setFv(p => ({ ...p, aircraft_available: v.join(", ") })); }} />
        <div style={{ marginTop: 12 }}>
          <Field label="Specific Aircraft Details"><input className="fi" placeholder="e.g. 2023 Gulfstream G650, 2022 Citation Longitude" onChange={f("aircraft_details")} /></Field>
        </div>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Services</div>
        <AmenityPicker options={SERVICES_LIST} selected={services} onChange={v => { setServices(v); setFv(p => ({ ...p, services_list: v })); }} />
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Contact</div>
        <div className="r2">
          <Field label="Email *"><input className="fi" type="email" onChange={f("email")} /></Field>
          <Field label="Phone (24/7) *"><input className="fi" type="tel" onChange={f("phone")} /></Field>
        </div>
        <Field label="Website"><input className="fi" placeholder="https://" onChange={f("website_url")} /></Field>
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Photos (Up to 20)</div>
        <PhotoUploader bucket="aviation-images" listingId={listingId} photos={photos} setPhotos={setPhotos} max={20} />
      </div>
    </>
  );
}

function GenericForm({ category, fv, setFv, photos, setPhotos, listingId }) {
  const f = k => e => setFv(p => ({ ...p, [k]: e.target.value }));
  const configs = {
    yacht:    { fields: [{ key:"business_name",label:"Company Name *",placeholder:"Your charter company"},{key:"fleet_vessels",label:"Fleet / Vessels",placeholder:"e.g. 50ft Sunseeker, 65ft Azimut"},{key:"area",label:"Service Area",placeholder:"Lake Pleasant, San Diego, Cabo..."},{key:"starting_rate",label:"Starting Rate",placeholder:"From $2,500/half day"},{key:"description",label:"Description *",textarea:true,placeholder:"Describe your fleet, services, destinations..."},{key:"email",label:"Email *",type:"email"},{key:"phone",label:"Phone *",type:"tel"},{key:"website_url",label:"Website",placeholder:"https://"}] },
    shopping: { fields: [{ key:"business_name",label:"Business Name *",placeholder:"Your boutique or service"},{key:"business_type",label:"Business Type",placeholder:"e.g. Personal Stylist, Fine Jeweler, Art Gallery"},{key:"area",label:"Location",placeholder:"Scottsdale Fashion Square..."},{key:"starting_price",label:"Starting Price",placeholder:"From $500/session"},{key:"brands",label:"Brands Carried",placeholder:"Hermès, Chanel, Louis Vuitton..."},{key:"description",label:"Description *",textarea:true,placeholder:"Describe your experience and what makes it exceptional..."},{key:"email",label:"Email *",type:"email"},{key:"phone",label:"Phone *",type:"tel"},{key:"website_url",label:"Website",placeholder:"https://"}] },
    wine:     { fields: [{ key:"business_name",label:"Business Name *",placeholder:"Your wine or spirits business"},{key:"business_type",label:"Type",placeholder:"e.g. Private Sommelier, Rare Bottle Retailer"},{key:"area",label:"Service Area",placeholder:"Scottsdale and surrounding areas"},{key:"starting_price",label:"Starting Price",placeholder:"From $350/tasting"},{key:"specialties",label:"Specialties",placeholder:"e.g. Burgundy, Napa Cult Wines, Rare Bourbon"},{key:"description",label:"Description *",textarea:true,placeholder:"Describe your offerings..."},{key:"email",label:"Email *",type:"email"},{key:"phone",label:"Phone *",type:"tel"}] },
    events:   { fields: [{ key:"business_name",label:"Company Name *",placeholder:"Your event company"},{key:"business_type",label:"Specialty",placeholder:"e.g. Corporate Events, Celebrations, Production"},{key:"max_capacity",label:"Max Capacity",type:"number",placeholder:"500"},{key:"area",label:"Service Area",placeholder:"Scottsdale Metro"},{key:"starting_price",label:"Starting Price",placeholder:"From $5,000"},{key:"description",label:"Description *",textarea:true,placeholder:"Describe your event capabilities..."},{key:"email",label:"Email *",type:"email"},{key:"phone",label:"Phone *",type:"tel"},{key:"website_url",label:"Website / Portfolio",placeholder:"https://"}] },
    experience:{ fields:[{ key:"experience_name",label:"Experience Name *",placeholder:"e.g. Desert Sunrise Horseback Ride"},{key:"category",label:"Category",placeholder:"e.g. Outdoor, Wellness, Culinary, Equestrian"},{key:"host_business",label:"Host Business *",placeholder:"Your company name"},{key:"starting_price",label:"Starting Price ($) *",type:"number",placeholder:"350"},{key:"price_per",label:"Price Per",placeholder:"person, group, event"},{key:"duration",label:"Duration",placeholder:"3 hrs, Full Day..."},{key:"group_min",label:"Min Group Size",type:"number",placeholder:"2"},{key:"group_max",label:"Max Group Size",type:"number",placeholder:"12"},{key:"description",label:"Description *",textarea:true,placeholder:"Describe the full experience..."},{key:"contact_email",label:"Email *",type:"email"},{key:"contact_phone",label:"Phone *",type:"tel"},{key:"website_url",label:"Website",placeholder:"https://"}] },
  };
  const config = configs[category.id] || configs.experience;
  return (
    <>
      <div className="pp-section">
        <div className="pp-section-title">Listing Details</div>
        {config.fields.map(field => (
          <Field key={field.key} label={field.label}>
            {field.textarea
              ? <textarea className="fit" rows={5} placeholder={field.placeholder} onChange={f(field.key)} />
              : <input className="fi" type={field.type || "text"} placeholder={field.placeholder} onChange={f(field.key)} />}
          </Field>
        ))}
      </div>
      <div className="pp-section">
        <div className="pp-section-title">Photos (Up to 20)</div>
        <PhotoUploader bucket={category.bucket} listingId={listingId} photos={photos} setPhotos={setPhotos} max={20} />
      </div>
    </>
  );
}

// ── PARTNER AUTH GATE ─────────────────────────────────────────
function PartnerAuthScreen({ onAuth }) {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const inp = { width:"100%", background:"rgba(248,245,240,.04)", border:"1px solid rgba(212,201,181,.11)", borderRadius:2, padding:"11px 13px", fontFamily:"'Jost',system-ui,sans-serif", fontSize:".8rem", color:"#F8F5F0", fontWeight:300, outline:"none", marginBottom:0 };

  const handleAuth = async () => {
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        if (!form.name || !form.company || !form.email || !form.password) throw new Error("All fields are required.");
        if (form.password.length < 8) throw new Error("Password must be at least 8 characters.");
        const { error: err } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.name, role: "partner", company: form.company } }
        });
        if (err) throw err;
        setError("✓ Account created! Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        if (!form.email || !form.password) throw new Error("Email and password are required.");
        const { data, error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (err) throw err;
        onAuth(data.user);
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "var(--ink-m)", border: "1px solid var(--border)", borderRadius: 4, width: "100%", maxWidth: 440, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
        <div style={{ padding: "40px 36px 36px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: ".52rem", letterSpacing: ".36em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>Monarc Privé · Partner Portal</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 300, color: "var(--t1)", marginBottom: 8 }}>
              {mode === "signup" ? "Create Partner Account" : "Partner Sign In"}
            </div>
            <div style={{ fontSize: ".7rem", color: "var(--taupe)", fontWeight: 300, lineHeight: 1.6 }}>
              {mode === "signup"
                ? "Create a free partner account. Once verified, submit your listing for review."
                : "Sign in to access your partner dashboard and submit listings."}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "signup" && (
              <>
                <div>
                  <label style={{ fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--taupe)", display: "block", marginBottom: 6, fontWeight: 500 }}>Full Name *</label>
                  <input style={inp} placeholder="Your full name" onChange={f("name")} onKeyDown={e => e.key === "Enter" && handleAuth()} />
                </div>
                <div>
                  <label style={{ fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--taupe)", display: "block", marginBottom: 6, fontWeight: 500 }}>Business / Company Name *</label>
                  <input style={inp} placeholder="Your business name" onChange={f("company")} onKeyDown={e => e.key === "Enter" && handleAuth()} />
                </div>
              </>
            )}
            <div>
              <label style={{ fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--taupe)", display: "block", marginBottom: 6, fontWeight: 500 }}>Email Address *</label>
              <input style={inp} type="email" placeholder="your@business.com" onChange={f("email")} onKeyDown={e => e.key === "Enter" && handleAuth()} />
            </div>
            <div>
              <label style={{ fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--taupe)", display: "block", marginBottom: 6, fontWeight: 500 }}>Password *</label>
              <input style={inp} type="password" placeholder={mode === "signup" ? "Min. 8 characters" : "Your password"} onChange={f("password")} onKeyDown={e => e.key === "Enter" && handleAuth()} />
            </div>
          </div>

          {error && (
            <div style={{ fontSize: ".68rem", padding: "10px 14px", borderRadius: 2, marginTop: 14, background: error.startsWith("✓") ? "rgba(91,175,132,.08)" : "rgba(224,82,82,.08)", border: `1px solid ${error.startsWith("✓") ? "rgba(91,175,132,.25)" : "rgba(224,82,82,.2)"}`, color: error.startsWith("✓") ? "var(--green)" : "var(--red)", lineHeight: 1.5 }}>
              {error}
            </div>
          )}

          <button onClick={handleAuth} disabled={loading}
            style={{ width: "100%", background: "var(--gold)", color: "var(--ink)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--sans)", padding: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", borderRadius: 2, marginTop: 20, opacity: loading ? .6 : 1, transition: "background .18s" }}>
            {loading ? "Please wait..." : mode === "signup" ? "Create Partner Account →" : "Sign In →"}
          </button>

          <div style={{ textAlign: "center", marginTop: 18, fontSize: ".7rem", color: "var(--taupe)", fontWeight: 300 }}>
            {mode === "signup" ? (
              <>Already have an account?{" "}<span style={{ color: "var(--gold)", cursor: "pointer" }} onClick={() => { setMode("signin"); setError(""); }}>Sign in</span></>
            ) : (
              <>New partner?{" "}<span style={{ color: "var(--gold)", cursor: "pointer" }} onClick={() => { setMode("signup"); setError(""); }}>Create a free account</span></>
            )}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", textAlign: "center" }}>
            <span style={{ fontSize: ".62rem", color: "var(--taupe)", cursor: "pointer" }} onClick={() => window.location.href = "/"}>← Return to main site</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────
export default function PartnerPortal() {
  const [partnerUser, setPartnerUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [selected, setSelected] = useState(null);
  const [fv, setFv] = useState({});
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [listingId] = useState(() => `listing-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setPartnerUser(session?.user || null);
      setAuthChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setPartnerUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setPartnerUser(null);
    setSelected(null);
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError("");
    try {
      const photoUrls = photos.map(p => p.url);
      const record = { ...fv, status: "pending", photo_url: photoUrls[0] || null, photos: photoUrls, monthly_fee: parseFloat(selected.price.replace(/[^0-9.]/g, "")), partner_user_id: partnerUser?.id || null };
      const { error: dbErr } = await supabase.from(selected.table).insert(record);
      if (dbErr) throw new Error(dbErr.message);
      setSubmitted(true);
    } catch (e) { setError(e.message || "Something went wrong. Please try again."); }
    setSubmitting(false);
  };

  const resetForm = () => { setSelected(null); setFv({}); setPhotos([]); setSubmitted(false); setError(""); };

  const renderForm = () => {
    if (!selected) return null;
    const props = { fv, setFv, photos, setPhotos, listingId };
    switch (selected.id) {
      case "property":   return <PropertyForm {...props} />;
      case "agent":      return <AgentForm {...props} />;
      case "restaurant": return <RestaurantForm {...props} />;
      case "golf":       return <GolfForm {...props} />;
      case "cars":       return <CarForm {...props} />;
      case "medspa":     return <MedSpaForm {...props} />;
      case "aviation":   return <AviationForm {...props} />;
      default:           return <GenericForm category={selected} {...props} />;
    }
  };

  // ── Loading ──
  if (!authChecked) return (
    <div style={{ minHeight: "100vh", background: "#161412", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, border: "1px solid rgba(201,169,110,.2)", borderTopColor: "#C9A96E", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── Not signed in → Auth screen ──
  if (!partnerUser) return (
    <>
      <style>{CSS}</style>
      <nav className="pp-nav">
        <div className="pp-logo" onClick={() => window.location.href = "/"}>Monarc<span>·</span>Prive</div>
        <div className="pp-subnav">Partner Portal</div>
      </nav>
      <PartnerAuthScreen onAuth={setPartnerUser} />
    </>
  );

  // ── Signed in → Listing Portal ──
  return (
    <>
      <style>{CSS}</style>
      <nav className="pp-nav">
        <div className="pp-logo" onClick={() => window.location.href = "/"}>Monarc<span>·</span>Prive</div>
        <div className="pp-subnav">Partner Portal</div>
        <div className="pp-nav-right">
          <span className="pp-nav-user">{partnerUser.email}</span>
          <button className="pp-nav-signout" onClick={signOut}>Sign Out</button>
        </div>
      </nav>

      <div className="pp-hero">
        <div className="pp-hero-e">Partner Hub · Submit Your Listing</div>
        <h1 className="pp-hero-h">List your business.<br /><em>Reach the right people.</em></h1>
        <p className="pp-hero-sub">Submit your listing to appear in front of Monarc Privé members — UHNW travelers spending $2,000–$6,000/night on private estates in Scottsdale. Every listing is personally reviewed within 24–48 hours.</p>
      </div>

      {!selected ? (
        <div style={{ padding: "36px 44px" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", color: "var(--t1)", marginBottom: 6 }}>Choose your listing category</div>
          <div style={{ fontSize: ".72rem", color: "var(--taupe)", marginBottom: 24, fontWeight: 300 }}>Select the category that best describes your business.</div>
          <div className="pp-pick">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="pp-pick-card" onClick={() => { setSelected(cat); setFv({}); setPhotos([]); setSubmitted(false); }}>
                <span className="pp-pick-icon">{cat.icon}</span>
                <div className="pp-pick-name">{cat.label}</div>
                <div className="pp-pick-price">{cat.price}</div>
                <div className="pp-pick-desc">{{
                  property:"Full Airbnb-style listing with up to 30 photos, amenities, pricing, and house rules",
                  agent:"Agent profile with headshot, bio, specialties, and sales credentials",
                  restaurant:"Dining listing with menu details, private dining info, and up to 20 photos",
                  golf:"Course listing with facilities, green fees, and access info",
                  cars:"Fleet listing with vehicle details, services, and up to 30 photos",
                  medspa:"Spa listing with services menu, in-villa options, and credentials",
                  aviation:"Charter listing with fleet details, service types, and FAA credentials",
                  yacht:"Charter company with fleet, destinations, and packages",
                  shopping:"Boutique or stylist with brands, services, and portfolio",
                  wine:"Wine or spirits service with specialties and tasting options",
                  events:"Event company with capacity, specialty, and portfolio",
                  experience:"Activity listing with full details, pricing, and group size",
                }[cat.id]}</div>
              </div>
            ))}
          </div>
        </div>
      ) : submitted ? (
        <div style={{ padding: "44px" }}>
          <div className="success-box">
            <span style={{ fontSize: "2.4rem", color: "var(--green)", display: "block", marginBottom: 14 }}>✓</span>
            <div style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", fontWeight: 300, color: "var(--t1)", marginBottom: 10 }}>Application Submitted</div>
            <p style={{ fontSize: ".8rem", color: "var(--t2)", fontWeight: 300, lineHeight: 1.8, maxWidth: 480, margin: "0 auto 20px" }}>
              Your <strong style={{ color: "var(--t1)" }}>{selected.label}</strong> listing has been received. Our curation team will review within 24–48 hours and contact you at {partnerUser.email}.
            </p>
            <p style={{ fontSize: ".7rem", color: "var(--taupe)", fontWeight: 300, marginBottom: 24 }}>Billing of <strong style={{ color: "var(--gold)" }}>{selected.price}</strong> begins only upon approval.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="submit-btn" style={{ width: "auto", padding: "12px 28px" }} onClick={resetForm}>Submit Another Listing</button>
              <button onClick={() => window.location.href = "/"} style={{ background: "none", border: "1px solid var(--border)", color: "var(--t2)", fontFamily: "var(--sans)", fontSize: ".58rem", letterSpacing: ".18em", textTransform: "uppercase", padding: "12px 28px", cursor: "pointer", borderRadius: 2 }}>Return to Site</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="pp-body">
          <div className="pp-sidebar">
            <div className="pp-sidebar-label">Categories</div>
            {CATEGORIES.map(cat => (
              <div key={cat.id} className={`pp-cat${selected?.id === cat.id ? " on" : ""}`} onClick={() => { setSelected(cat); setFv({}); setPhotos([]); setSubmitted(false); }}>
                <span className="pp-cat-icon">{cat.icon}</span>
                <div className="pp-cat-info">
                  <div className="pp-cat-name">{cat.label}</div>
                  <div className="pp-cat-price">{cat.price}</div>
                </div>
              </div>
            ))}
            <div style={{ padding: "20px 20px 0", borderTop: "1px solid var(--border)", marginTop: 12 }}>
              <div style={{ fontSize: ".6rem", color: "var(--taupe)", lineHeight: 1.7, fontWeight: 300 }}>
                <div style={{ color: "var(--gold)", marginBottom: 4 }}>● Reviewed in 24–48hrs</div>
                <div>Billing starts on approval</div>
                <div>Cancel anytime · No hidden fees</div>
              </div>
            </div>
          </div>

          <div className="pp-main">
            <div className="pp-form-title">{selected.icon} {selected.label}</div>
            <div className="pp-form-sub">Complete all required fields (*) and upload photos. Our team will review within 24–48 hours.</div>
            <div className="price-note">
              <div className="price-note-val">{selected.price}</div>
              <div className="price-note-sub">Monthly flat fee · Billed only after approval · Cancel anytime</div>
            </div>
            {error && <div className="error-box">⚠ {error}</div>}
            {renderForm()}
            <div style={{ marginTop: 24, padding: "20px 0", borderTop: "1px solid var(--border)" }}>
              <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : `Submit ${selected.label} Application →`}
              </button>
              <div style={{ fontSize: ".6rem", color: "var(--taupe)", textAlign: "center", marginTop: 10, lineHeight: 1.7 }}>
                By submitting you agree to our Partner Terms. Billing of {selected.price} begins only after approval.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
