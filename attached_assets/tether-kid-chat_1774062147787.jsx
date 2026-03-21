import { useState, useRef, useEffect } from "react";

const p = {
  primary: "#6B9E8A",
  primaryLight: "#8BBDAA",
  primaryDark: "#4E7D6A",
  accent: "#7B8EC4",
  accentDark: "#5B6EA4",
  background: "#F5F6FA",
  surface: "#ECEEF6",
  white: "#FFFFFF",
  text: "#232535",
  textMid: "#555870",
  border: "#D4D8EA",
  sand: "#C8CCE0",
  alert4: "#C4603A",
  gold: "#B8953A",
  goldLight: "#D4B060",
  goldBg: "#FBF7EE",
  goldBorder: "#E8D8A8",
  virtue: "#7A6EA8",
  virtueBg: "#F2F0FA",
  virtueBorder: "#C8C0E8",
  bubbleOut: "#6B9E8A",
  bubbleIn: "#FFFFFF",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=Nunito:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .root {
    height: 100vh; background: ${p.background};
    font-family: 'Nunito', sans-serif; color: ${p.text};
    max-width: 420px; margin: 0 auto;
    display: flex; flex-direction: column;
    position: relative; overflow: hidden;
  }

  /* ── HEADER ── */
  .header {
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid ${p.border};
    padding: 12px 16px;
    display: flex; align-items: center; gap: 12px;
    position: relative; z-index: 20;
    flex-shrink: 0;
  }
  .back-btn {
    width: 34px; height: 34px; border-radius: 10px;
    border: 1.5px solid ${p.border}; background: ${p.white};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; transition: background 0.15s;
  }
  .back-btn:hover { background: ${p.surface}; }
  .convo-avatar {
    width: 38px; height: 38px; border-radius: 12px;
    background: linear-gradient(135deg, ${p.accent}, ${p.accentDark});
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 13px; font-weight: 700; color: white;
  }
  .convo-info { flex: 1; min-width: 0; }
  .convo-name { font-size: 15px; font-weight: 700; color: ${p.text}; }
  .convo-status { font-size: 11px; color: ${p.primary}; font-weight: 600; }
  .header-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .hdr-btn {
    width: 34px; height: 34px; border-radius: 10px;
    border: 1.5px solid ${p.border}; background: ${p.white};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.15s;
  }
  .hdr-btn:hover { background: ${p.surface}; }

  /* ── FAITH PROMPT BANNER ── */
  .faith-prompt {
    background: ${p.goldBg}; border-bottom: 1px solid ${p.goldBorder};
    padding: 12px 16px; display: flex; gap: 10px;
    align-items: flex-start; position: relative; z-index: 10;
    flex-shrink: 0;
  }
  .fp-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: ${p.gold}18;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .fp-body { flex: 1; }
  .fp-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${p.gold}; margin-bottom: 3px; }
  .fp-text { font-family: 'Fraunces', serif; font-size: 13px; font-style: italic; color: ${p.text}; line-height: 1.5; }
  .fp-dismiss {
    font-size: 11px; font-weight: 700; color: ${p.gold};
    cursor: pointer; flex-shrink: 0; padding: 2px; margin-top: 2px;
  }

  /* ── MESSAGES AREA ── */
  .messages {
    flex: 1; overflow-y: auto; padding: 16px 14px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .messages::-webkit-scrollbar { width: 4px; }
  .messages::-webkit-scrollbar-track { background: transparent; }
  .messages::-webkit-scrollbar-thumb { background: ${p.border}; border-radius: 2px; }

  /* DATE DIVIDER */
  .date-divider {
    display: flex; align-items: center; gap: 10px;
    margin: 10px 0 6px;
  }
  .date-line { flex: 1; height: 1px; background: ${p.border}; }
  .date-text { font-size: 11px; font-weight: 700; color: ${p.sand}; letter-spacing: 0.5px; }

  /* MESSAGE ROWS */
  .msg-row { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 2px; }
  .msg-row.out { flex-direction: row-reverse; }
  .msg-row.in { flex-direction: row; }

  .msg-avatar {
    width: 26px; height: 26px; border-radius: 8px;
    background: linear-gradient(135deg, ${p.accent}, ${p.accentDark});
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; color: white;
    flex-shrink: 0; margin-bottom: 2px;
  }
  .msg-avatar.ghost { background: transparent; }

  .bubble-wrap { max-width: 72%; display: flex; flex-direction: column; }
  .msg-row.out .bubble-wrap { align-items: flex-end; }
  .msg-row.in .bubble-wrap { align-items: flex-start; }

  .bubble {
    padding: 10px 14px; border-radius: 18px;
    font-size: 14px; line-height: 1.5;
    position: relative; word-break: break-word;
  }
  .bubble.out {
    background: ${p.bubbleOut};
    color: white;
    border-bottom-right-radius: 5px;
    box-shadow: 0 2px 8px ${p.primary}44;
  }
  .bubble.in {
    background: ${p.bubbleIn};
    color: ${p.text};
    border: 1.5px solid ${p.border};
    border-bottom-left-radius: 5px;
    box-shadow: 0 2px 6px rgba(35,37,53,0.06);
  }
  .bubble.blocked {
    background: ${p.surface};
    border: 1.5px dashed ${p.border};
    color: ${p.textMid};
    font-style: italic;
    font-size: 13px;
    border-bottom-right-radius: 5px;
  }
  .bubble-time {
    font-size: 10px; color: ${p.sand};
    margin-top: 4px; font-weight: 600;
    padding: 0 2px;
  }

  /* KIND MOMENT BADGE */
  .kind-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: ${p.virtue}12; border: 1px solid ${p.virtue}2A;
    border-radius: 20px; padding: 3px 10px 3px 7px;
    font-size: 11px; font-weight: 700; color: ${p.virtue};
    margin-top: 5px;
  }

  /* BLOCKED MESSAGE */
  .blocked-notice {
    background: ${p.surface}; border: 1.5px solid ${p.border};
    border-left: 3px solid ${p.alert4};
    border-radius: 14px; padding: 12px 14px;
    margin: 8px 0; max-width: 85%; align-self: flex-end;
  }
  .blocked-icon-row { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
  .blocked-title { font-size: 12px; font-weight: 700; color: ${p.alert4}; }
  .blocked-text { font-size: 12px; color: ${p.textMid}; line-height: 1.55; }

  /* VIRTUE MOMENT */
  .virtue-moment {
    background: ${p.virtueBg}; border: 1.5px solid ${p.virtueBorder};
    border-radius: 16px; padding: 13px 15px;
    margin: 10px 0; display: flex; gap: 10px; align-items: center;
    animation: fadeUp 0.4s cubic-bezier(0.4,0,0.2,1);
  }
  .vm-icon { width: 36px; height: 36px; border-radius: 11px; background: ${p.virtue}18; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .vm-body { flex: 1; }
  .vm-label { font-size: 10px; font-weight: 700; letter-spacing: 1.3px; text-transform: uppercase; color: ${p.virtue}; margin-bottom: 2px; }
  .vm-text { font-size: 13px; color: ${p.text}; line-height: 1.45; }

  /* INPUT AREA */
  .input-area {
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(14px);
    border-top: 1px solid ${p.border};
    padding: 10px 12px 24px;
    display: flex; align-items: flex-end; gap: 8px;
    flex-shrink: 0;
  }
  .input-actions { display: flex; gap: 6px; flex-shrink: 0; }
  .input-action-btn {
    width: 36px; height: 36px; border-radius: 11px;
    border: 1.5px solid ${p.border}; background: ${p.white};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s; flex-shrink: 0;
  }
  .input-action-btn:hover { background: ${p.surface}; border-color: ${p.sand}; }
  .input-wrap {
    flex: 1; background: ${p.surface};
    border: 1.5px solid ${p.border}; border-radius: 18px;
    padding: 8px 14px; display: flex; align-items: center; gap: 8px;
    transition: border-color 0.2s;
  }
  .input-wrap:focus-within { border-color: ${p.primary}; }
  .input-field {
    flex: 1; border: none; background: transparent;
    font-family: 'Nunito', sans-serif; font-size: 14px; color: ${p.text};
    outline: none; resize: none; max-height: 80px;
    line-height: 1.4;
  }
  .input-field::placeholder { color: ${p.sand}; }
  .send-btn {
    width: 36px; height: 36px; border-radius: 11px;
    background: ${p.primary}; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0;
    box-shadow: 0 3px 10px ${p.primary}44;
    transition: all 0.15s;
  }
  .send-btn:hover { background: ${p.primaryDark}; transform: scale(1.05); }
  .send-btn:active { transform: scale(0.97); }
  .send-btn.empty { background: ${p.border}; box-shadow: none; cursor: default; }
  .send-btn.empty:hover { transform: none; }

  /* SCAN INDICATOR */
  .scan-indicator {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 14px 0;
    font-size: 11px; color: ${p.sand}; font-weight: 600;
  }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .scan-dot { width: 6px; height: 6px; border-radius: 3px; background: ${p.primary}; animation: blink 1.2s infinite; }

  /* OVERLAY MODAL */
  .overlay {
    position: absolute; inset: 0;
    background: rgba(35,37,53,0.44); backdrop-filter: blur(6px);
    z-index: 100; display: flex; align-items: flex-end; justify-content: center;
  }
  .sheet {
    background: ${p.white}; border-radius: 24px 24px 0 0;
    width: 100%; padding: 20px 22px 44px;
    animation: slideUp 0.28s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .sheet-handle { width: 34px; height: 4px; border-radius: 2px; background: ${p.border}; margin: 0 auto 20px; }
  .sheet-title { font-family: 'Fraunces', serif; font-size: 21px; font-weight: 600; color: ${p.text}; margin-bottom: 6px; }
  .sheet-sub { font-size: 13px; color: ${p.textMid}; line-height: 1.65; margin-bottom: 18px; }
  .sheet-verse {
    background: ${p.goldBg}; border: 1.5px solid ${p.goldBorder};
    border-radius: 14px; padding: 14px 16px; margin-bottom: 18px;
    font-family: 'Fraunces', serif; font-size: 14px; font-style: italic;
    color: ${p.text}; line-height: 1.6;
  }
  .sheet-verse-ref { font-size: 12px; font-weight: 700; color: ${p.gold}; margin-top: 8px; font-style: normal; }
  .sht-btn {
    width: 100%; padding: 13px; border-radius: 13px; border: none;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; margin-bottom: 9px; transition: all 0.15s;
  }
  .sht-primary { background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark}); color: white; box-shadow: 0 4px 14px ${p.primary}44; }
  .sht-ghost { background: ${p.surface}; color: ${p.textMid}; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .in { animation: fadeUp 0.32s cubic-bezier(0.4,0,0.2,1) forwards; }

  /* TYPING INDICATOR */
  .typing { display: flex; gap: 4px; align-items: center; padding: 8px 12px; }
  .typing-dot { width: 7px; height: 7px; border-radius: 4px; background: ${p.sand}; }
  .typing-dot:nth-child(1) { animation: bounce 1.2s infinite 0s; }
  .typing-dot:nth-child(2) { animation: bounce 1.2s infinite 0.2s; }
  .typing-dot:nth-child(3) { animation: bounce 1.2s infinite 0.4s; }
  @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }
`;

// ── ICONS ──
const Ico = ({ children, size = 18, color = p.textMid }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const Icons = {
  Back: ({ color = p.textMid }) => <Ico color={color}><polyline points="15,18 9,12 15,6" /></Ico>,
  Phone: ({ color = p.textMid }) => <Ico color={color}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></Ico>,
  Info: ({ color = p.textMid }) => <Ico color={color}><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5" /></Ico>,
  Cross: ({ color = p.gold }) => <Ico color={color} size={14}><line x1="12" y1="3" x2="12" y2="21" strokeWidth="2.2" /><line x1="5" y1="9" x2="19" y2="9" strokeWidth="2.2" /></Ico>,
  Heart: ({ color = p.virtue, size = 16 }) => <Ico color={color} size={size}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></Ico>,
  Shield: ({ color = p.alert4, size = 14 }) => <Ico color={color} size={size}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" /><circle cx="12" cy="16.5" r="0.5" fill={color} strokeWidth="2" /></Ico>,
  Image: ({ color = p.textMid }) => <Ico color={color}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" /></Ico>,
  Mic: ({ color = p.textMid }) => <Ico color={color}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></Ico>,
  Send: ({ color = "white" }) => <Ico color={color}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9" fill={color} /></Ico>,
  Star: ({ color = p.virtue, size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  ),
};

// ── MESSAGES DATA ──
const initialMessages = [
  { id: 1, type: "in", text: "Hey! Did you study for the math test tomorrow?", time: "3:12 PM", initials: "SM" },
  { id: 2, type: "out", text: "Yeah I went through chapter 8 last night. The fractions part was tricky 😬", time: "3:13 PM" },
  { id: 3, type: "in", text: "Same! My dad helped me though. Want to go over it together at lunch?", time: "3:14 PM", initials: "SM" },
  { id: 4, type: "kind", text: "You always help me understand things better. You're a really good friend.", time: "3:15 PM" },
  { id: 5, type: "in", text: "Aww thank you 🙂 That means a lot!", time: "3:16 PM", initials: "SM" },
  { id: 6, type: "in", text: "Also are you coming to the game on Friday?", time: "3:17 PM", initials: "SM" },
];

export default function KidChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [sheet, setSheet] = useState(null); // "blocked" | "virtue"
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, scanning]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    // Simulate scan
    setScanning(true);
    setTimeout(() => {
      setScanning(false);

      // Simulate blocked message for certain words
      const blocked = text.toLowerCase().includes("bad") || text.toLowerCase().includes("stupid");
      if (blocked) {
        setMessages(m => [...m, {
          id: Date.now(), type: "blocked",
          text: "This message didn't reflect the person you're growing into. Your parent has been notified.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }]);
        setSheet("blocked");
        return;
      }

      // Simulate kind moment detection
      const kind = text.toLowerCase().includes("thank") || text.toLowerCase().includes("love") || text.toLowerCase().includes("great") || text.toLowerCase().includes("proud");
      const newMsg = {
        id: Date.now(), type: kind ? "kind" : "out",
        text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(m => [...m, newMsg]);

      if (kind) {
        setTimeout(() => setSheet("virtue"), 400);
      }

      // Simulate reply
      setTimeout(() => setIsTyping(true), 800);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(m => [...m, {
          id: Date.now() + 1, type: "in", initials: "SM",
          text: "That's so sweet! See you at school tomorrow 😊",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }]);
      }, 2400);
    }, 1200);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="root">

        {/* HEADER */}
        <div className="header">
          <div className="back-btn"><Icons.Back /></div>
          <div className="convo-avatar">SM</div>
          <div className="convo-info">
            <div className="convo-name">Sophie M.</div>
            <div className="convo-status">Active now</div>
          </div>
          <div className="header-actions">
            <div className="hdr-btn"><Icons.Phone /></div>
            <div className="hdr-btn"><Icons.Info /></div>
          </div>
        </div>

        {/* FAITH PROMPT BANNER */}
        {showPrompt && (
          <div className="faith-prompt">
            <div className="fp-icon"><Icons.Cross /></div>
            <div className="fp-body">
              <div className="fp-label">Opening prompt · Today's virtue: Encouragement</div>
              <div className="fp-text">"Help us speak with kindness and build each other up today."</div>
            </div>
            <div className="fp-dismiss" onClick={() => setShowPrompt(false)}>Done</div>
          </div>
        )}

        {/* MESSAGES */}
        <div className="messages">
          <div className="date-divider">
            <div className="date-line" /><div className="date-text">Today</div><div className="date-line" />
          </div>

          {messages.map((msg, idx) => {
            if (msg.type === "blocked") {
              return (
                <div key={msg.id} className="blocked-notice in">
                  <div className="blocked-icon-row">
                    <Icons.Shield size={14} color={p.alert4} />
                    <div className="blocked-title">Message not sent</div>
                  </div>
                  <div className="blocked-text">{msg.text}</div>
                </div>
              );
            }

            if (msg.type === "kind") {
              return (
                <div key={msg.id}>
                  <div className="msg-row out">
                    <div className="msg-avatar ghost" />
                    <div className="bubble-wrap">
                      <div className="bubble out">{msg.text}</div>
                      <div className="kind-badge">
                        <Icons.Star size={11} color={p.virtue} />
                        Kind moment
                      </div>
                      <div className="bubble-time">{msg.time}</div>
                    </div>
                  </div>
                </div>
              );
            }

            const isOut = msg.type === "out";
            const showAvatar = !isOut && (idx === 0 || messages[idx - 1]?.type !== "in");

            return (
              <div key={msg.id} className={`msg-row ${isOut ? "out" : "in"}`}>
                {!isOut && (
                  <div className={`msg-avatar ${showAvatar ? "" : "ghost"}`}>
                    {showAvatar ? msg.initials : ""}
                  </div>
                )}
                <div className="bubble-wrap">
                  <div className={`bubble ${isOut ? "out" : "in"}`}>{msg.text}</div>
                  <div className="bubble-time">{msg.time}</div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="msg-row in">
              <div className="msg-avatar">SM</div>
              <div className="bubble in" style={{ padding: "10px 14px" }}>
                <div className="typing">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          {scanning && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div className="scan-indicator">
                <div className="scan-dot" />
                Checking your message...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="input-area">
          <div className="input-actions">
            <div className="input-action-btn"><Icons.Image /></div>
            <div className="input-action-btn"><Icons.Mic /></div>
          </div>
          <div className="input-wrap">
            <textarea
              ref={inputRef}
              className="input-field"
              placeholder="Message Sophie..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
          </div>
          <div className={`send-btn ${!input.trim() ? "empty" : ""}`} onClick={sendMessage}>
            <Icons.Send color={!input.trim() ? p.sand : "white"} />
          </div>
        </div>

        {/* BLOCKED SHEET */}
        {sheet === "blocked" && (
          <div className="overlay" onClick={() => setSheet(null)}>
            <div className="sheet" onClick={e => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Icons.Shield size={22} color={p.alert4} />
                <div className="sheet-title">Message not sent</div>
              </div>
              <p className="sheet-sub">
                That message didn't reflect the kind of person you're growing into. Your parent has been notified and can help you find better words.
              </p>
              <div className="sheet-verse">
                "Let your conversation be always full of grace, seasoned with salt."
                <div className="sheet-verse-ref">Colossians 4:6 · NIV</div>
              </div>
              <button className="sht-btn sht-primary" onClick={() => setSheet(null)}>Got it</button>
              <button className="sht-btn sht-ghost" onClick={() => setSheet(null)}>Talk to a parent</button>
            </div>
          </div>
        )}

        {/* VIRTUE RECOGNITION SHEET */}
        {sheet === "virtue" && (
          <div className="overlay" onClick={() => setSheet(null)}>
            <div className="sheet" onClick={e => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Icons.Heart size={22} color={p.virtue} />
                <div className="sheet-title" style={{ color: p.virtue }}>Kind moment</div>
              </div>
              <p className="sheet-sub">
                What you just sent was genuinely encouraging. That's the virtue of encouragement in action — and your parent can see it too.
              </p>
              <div style={{
                background: p.virtueBg, border: `1.5px solid ${p.virtueBorder}`,
                borderRadius: 14, padding: "14px 16px", marginBottom: 18,
                display: "flex", alignItems: "center", gap: 12
              }}>
                <Icons.Star size={20} color={p.virtue} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: p.virtue, marginBottom: 2 }}>Today's virtue: Encouragement</div>
                  <div style={{ fontSize: 12, color: p.textMid, lineHeight: 1.5 }}>Building others up with words that give strength and hope.</div>
                </div>
              </div>
              <button className="sht-btn sht-primary" style={{ background: `linear-gradient(135deg, ${p.virtue}, #5A4E88)`, boxShadow: `0 4px 14px ${p.virtue}44` }}
                onClick={() => setSheet(null)}>
                Keep going
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
