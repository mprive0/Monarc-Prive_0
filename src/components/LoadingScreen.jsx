/* Loading Screen Component */
export default function LoadingScreen() {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#161412",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .mp-logo { font-size:1.6rem;font-weight:300;letter-spacing:.25em;text-transform:uppercase;color:#F8F5F0;animation:fadeUp .8s ease; }
        .mp-logo span { color:#C9A96E; }
        .mp-line { width:40px;height:1px;background:linear-gradient(90deg,transparent,#C9A96E,transparent);margin:14px auto;animation:fadeUp .8s .2s ease both; }
        .mp-sub { font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;color:#9E8E78;animation:fadeUp .8s .4s ease both; }
        .mp-spinner { width:20px;height:20px;border:1px solid rgba(201,169,110,.2);border-top-color:#C9A96E;border-radius:50%;animation:spin 1s linear infinite;margin:20px auto 0; }
      `}</style>
      <div className="mp-logo">Monarc<span>·</span>Privé</div>
      <div className="mp-line" />
      <div className="mp-sub">Private Estates · Scottsdale</div>
      <div className="mp-spinner" />
    </div>
  );
}
