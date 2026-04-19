import { useState, useRef, useEffect } from "react";

// ============================================================
// Monarc Privé — Sterling Concierge Chat Widget
// File: src/components/ConciergeWidget.jsx
// Embed on any page: <ConciergeWidget guestName="..." bookingId="..." />
// ============================================================

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Jost:wght@300;400;500&display=swap');

.sterling-fab {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  width: 56px; height: 56px;
  background: #1A1917;
  border: 1px solid rgba(201,169,110,0.4);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 0 0 rgba(201,169,110,0.2);
  animation: fabPulse 3s infinite;
  transition: transform 0.2s;
  font-size: 1.2rem;
}
.sterling-fab:hover { transform: scale(1.08); }
@keyframes fabPulse {
  0%, 100% { box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 0 0 rgba(201,169,110,0.15); }
  50% { box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 0 10px rgba(201,169,110,0); }
}
.sterling-badge {
  position: absolute; top: -3px; right: -3px;
  width: 18px; height: 18px;
  background: #C9A96E; border-radius: 50%;
  border: 2px solid #F7F4EF;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.55rem; font-weight: 700; color: #1A1917;
}

.sterling-window {
  position: fixed; bottom: 92px; right: 24px; z-index: 9998;
  width: 360px; height: 520px;
  background: #1A1917;
  border: 1px solid rgba(212,201,181,0.15);
  border-radius: 6px;
  display: flex; flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  font-family: 'Jost', system-ui, sans-serif;
  overflow: hidden;
  animation: slideUp 0.25s ease;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@media (max-width: 480px) {
  .sterling-window {
    width: calc(100vw - 24px); right: 12px; bottom: 84px;
    height: 70vh;
  }
}

.sterling-header {
  padding: 16px 18px;
  background: #2C2A27;
  border-bottom: 1px solid rgba(212,201,181,0.1);
  display: flex; align-items: center; gap: 12px;
  flex-shrink: 0;
}
.sterling-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: rgba(201,169,110,0.15);
  border: 1px solid rgba(201,169,110,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; color: #C9A96E;
  flex-shrink: 0;
}
.sterling-header-info { flex: 1; }
.sterling-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem; font-weight: 400;
  color: #F7F4EF; letter-spacing: 0.04em;
}
.sterling-status {
  font-size: 0.58rem; letter-spacing: 0.15em;
  text-transform: uppercase; color: #4CAF7D;
  display: flex; align-items: center; gap: 4px;
}
.sterling-status-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #4CAF7D;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%, 100% { opacity:1; } 50% { opacity:0.4; } }
.sterling-close {
  background: none; border: none;
  color: #9E8E78; cursor: pointer;
  font-size: 1rem; padding: 4px;
  transition: color 0.15s;
}
.sterling-close:hover { color: #F7F4EF; }

.sterling-messages {
  flex: 1; overflow-y: auto; padding: 16px;
  display: flex; flex-direction: column; gap: 14px;
  scrollbar-width: thin;
  scrollbar-color: rgba(212,201,181,0.1) transparent;
}
.sterling-msg { display: flex; gap: 8px; align-items: flex-end; }
.sterling-msg.user { flex-direction: row-reverse; }
.sterling-msg-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(201,169,110,0.1); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; color: #C9A96E;
}
.sterling-bubble {
  max-width: 78%; padding: 10px 14px;
  border-radius: 3px;
  font-size: 0.78rem; line-height: 1.65; font-weight: 300;
}
.sterling-bubble.agent {
  background: #2C2A27;
  border: 1px solid rgba(212,201,181,0.1);
  color: #EDE8DF; border-radius: 3px 12px 12px 3px;
}
.sterling-bubble.user {
  background: rgba(201,169,110,0.15);
  border: 1px solid rgba(201,169,110,0.2);
  color: #F7F4EF; border-radius: 12px 3px 3px 12px;
}
.sterling-typing {
  display: flex; gap: 4px; padding: 10px 14px;
  background: #2C2A27; border: 1px solid rgba(212,201,181,0.1);
  border-radius: 3px 12px 12px 3px; width: fit-content;
}
.sterling-dot {
  width: 5px; height: 5px; background: #9E8E78;
  border-radius: 50%; animation: bounce 1.2s infinite;
}
.sterling-dot:nth-child(2) { animation-delay: 0.2s; }
.sterling-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-4px);opacity:1} }

.sterling-quick-replies {
  padding: 8px 12px;
  display: flex; gap: 6px; flex-wrap: wrap;
  border-top: 1px solid rgba(212,201,181,0.08);
  flex-shrink: 0;
}
.sterling-qr {
  font-size: 0.6rem; letter-spacing: 0.08em;
  color: #9E8E78; border: 1px solid rgba(212,201,181,0.12);
  padding: 4px 10px; border-radius: 2px;
  cursor: pointer; transition: all 0.15s; white-space: nowrap;
}
.sterling-qr:hover { color: #C9A96E; border-color: rgba(201,169,110,0.3); }

.sterling-input-area {
  padding: 10px 14px 14px;
  display: flex; gap: 8px; align-items: center;
  border-top: 1px solid rgba(212,201,181,0.1);
  flex-shrink: 0;
}
.sterling-input {
  flex: 1; background: rgba(44,42,39,0.8);
  border: 1px solid rgba(212,201,181,0.12);
  border-radius: 3px; padding: 9px 12px;
  font-family: 'Jost', sans-serif; font-size: 0.78rem;
  color: #F7F4EF; font-weight: 300; outline: none;
  transition: border-color 0.2s;
}
.sterling-input:focus { border-color: rgba(201,169,110,0.3); }
.sterling-input::placeholder { color: rgba(158,142,120,0.5); }
.sterling-send {
  width: 32px; height: 32px;
  background: #C9A96E; border: none; border-radius: 2px;
  cursor: pointer; display: flex; align-items: center;
  justify-content: center; font-size: 0.85rem;
  color: #1A1917; flex-shrink: 0;
  transition: background 0.2s; font-weight: 700;
}
.sterling-send:hover { background: #E2C896; }
.sterling-send:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const QUICK_REPLIES = [
  "What properties fit 10 guests?",
  "Tell me about concierge services",
  "Do you allow events?",
  "What's available this weekend?",
];

export default function ConciergeWidget({ guestName, bookingId, apiUrl }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: `Good ${getTimeOfDay()}${guestName ? `, ${guestName}` : ""}. I'm Sterling, your Monarc Privé concierge.\n\nWhether you're looking for the perfect estate, planning an event, or need anything arranged — I'm here for you. How may I assist?`,
  }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const endRef = useRef(null);
  const BASE_URL = apiUrl || "https://your-backend.onrender.com";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  function getTimeOfDay() {
    const h = new Date().getHours();
    return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  }

  const send = async (text) => {
    if (!text.trim() || typing) return;
    const userMsg = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const history = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch(`${BASE_URL}/api/concierge/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, guestName, bookingId }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize for the interruption. Please call us directly at (480) 555-0100 and we'll assist you immediately.",
      }]);
    }
    setTyping(false);
  };

  return (
    <>
      <style>{css}</style>

      {/* FAB */}
      <div className="sterling-fab" onClick={() => setOpen(!open)}>
        {open ? "✕" : "◌"}
        {!open && unread > 0 && <span className="sterling-badge">{unread}</span>}
      </div>

      {/* Chat Window */}
      {open && (
        <div className="sterling-window">
          <div className="sterling-header">
            <div className="sterling-avatar">◌</div>
            <div className="sterling-header-info">
              <div className="sterling-name">Sterling</div>
              <div className="sterling-status">
                <div className="sterling-status-dot" />
                Monarc Privé Concierge
              </div>
            </div>
            <button className="sterling-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="sterling-messages">
            {messages.map((m, i) => (
              <div key={i} className={`sterling-msg ${m.role === "user" ? "user" : ""}`}>
                {m.role === "assistant" && (
                  <div className="sterling-msg-avatar">◌</div>
                )}
                <div className={`sterling-bubble ${m.role === "assistant" ? "agent" : "user"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="sterling-msg">
                <div className="sterling-msg-avatar">◌</div>
                <div className="sterling-typing">
                  <div className="sterling-dot" />
                  <div className="sterling-dot" />
                  <div className="sterling-dot" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="sterling-quick-replies">
              {QUICK_REPLIES.map(q => (
                <div key={q} className="sterling-qr" onClick={() => send(q)}>{q}</div>
              ))}
            </div>
          )}

          <div className="sterling-input-area">
            <input
              className="sterling-input"
              placeholder="Ask Sterling anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
            />
            <button className="sterling-send" onClick={() => send(input)} disabled={!input.trim() || typing}>
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
