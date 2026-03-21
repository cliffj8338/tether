import { useState } from "react";

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
  alert1: "#7A9E7E",
  alert3: "#C49A3A",
  alert4: "#C4603A",
  gold: "#B8953A",
  goldBg: "#FBF7EE",
  goldBorder: "#E8D8A8",
  virtue: "#7A6EA8",
  virtueBg: "#F2F0FA",
  virtueBorder: "#C8C0E8",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=Nunito:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .root {
    height: 100vh; background: ${p.background};
    font-family: 'Nunito', sans-serif; color: ${p.text};
    max-width: 420px; margin: 0 auto;
    display: flex; flex-direction: column; overflow: hidden;
  }

  /* ── HEADER ── */
  .header {
    background: rgba(255,255,255,0.96); backdrop-filter: blur(14px);
    border-bottom: 1px solid ${p.border};
    padding: 12px 16px; flex-shrink: 0;
    position: relative; z-index: 20;
  }
  .header-row1 {
    display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
  }
  .back-btn {
    width: 34px; height: 34px; border-radius: 10px;
    border: 1.5px solid ${p.border}; background: ${p.white};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; transition: background 0.15s;
  }
  .back-btn:hover { background: ${p.surface}; }
  .header-avatars { display: flex; flex-shrink: 0; }
  .h-avatar {
    width: 36px; height: 36px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: white; border: 2px solid white;
  }
  .h-avatar-2 { margin-left: -8px; }
  .header-info { flex: 1; min-width: 0; }
  .header-names { font-size: 15px; font-weight: 700; color: ${p.text}; }
  .header-meta { font-size: 11px; color: ${p.textMid}; font-weight: 600; }
  .header-actions { display: flex; gap: 7px; flex-shrink: 0; }
  .hdr-btn {
    width: 34px; height: 34px; border-radius: 10px;
    border: 1.5px solid ${p.border}; background: ${p.white};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s;
  }
  .hdr-btn:hover { background: ${p.surface}; }
  .hdr-btn.danger { border-color: ${p.alert4}30; background: ${p.alert4}08; }
  .hdr-btn.danger:hover { background: ${p.alert4}14; }

  /* PARENT CONTEXT BANNER */
  .parent-banner {
    background: ${p.primary}0E; border: 1.5px solid ${p.primary}28;
    border-radius: 12px; padding: 8px 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .parent-banner-text { font-size: 11px; font-weight: 700; color: ${p.primaryDark}; }
  .parent-banner-sub { font-size: 11px; color: ${p.textMid}; }

  /* ── FILTER BAR ── */
  .filter-bar {
    background: ${p.white}; border-bottom: 1px solid ${p.border};
    padding: 8px 14px; display: flex; gap: 7px;
    overflow-x: auto; flex-shrink: 0;
  }
  .filter-bar::-webkit-scrollbar { display: none; }
  .filter-pill {
    flex-shrink: 0; padding: 6px 12px; border-radius: 20px;
    font-size: 11px; font-weight: 700; cursor: pointer;
    border: 1.5px solid ${p.border}; background: ${p.white};
    color: ${p.textMid}; transition: all 0.15s; white-space: nowrap;
  }
  .filter-pill.on { border-color: ${p.primary}; background: ${p.primary}14; color: ${p.primaryDark}; }
  .filter-pill.flag { border-color: ${p.alert4}30; }
  .filter-pill.flag.on { border-color: ${p.alert4}; background: ${p.alert4}12; color: ${p.alert4}; }
  .filter-pill.kind { border-color: ${p.virtue}30; }
  .filter-pill.kind.on { border-color: ${p.virtue}; background: ${p.virtue}12; color: ${p.virtue}; }

  /* ── MESSAGES ── */
  .messages {
    flex: 1; overflow-y: auto; padding: 14px 14px 16px;
    display: flex; flex-direction: column; gap: 3px;
  }
  .messages::-webkit-scrollbar { width: 4px; }
  .messages::-webkit-scrollbar-thumb { background: ${p.border}; border-radius: 2px; }

  .date-div {
    display: flex; align-items: center; gap: 10px; margin: 10px 0 6px;
  }
  .date-line { flex: 1; height: 1px; background: ${p.border}; }
  .date-text { font-size: 11px; font-weight: 700; color: ${p.sand}; letter-spacing: 0.5px; }

  .msg-row { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 2px; position: relative; }
  .msg-row.child { flex-direction: row-reverse; }
  .msg-row.other { flex-direction: row; }

  .msg-avatar {
    width: 24px; height: 24px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; color: white; flex-shrink: 0;
  }
  .msg-avatar.ghost { background: transparent; }

  .bubble-col { max-width: 70%; display: flex; flex-direction: column; }
  .msg-row.child .bubble-col { align-items: flex-end; }
  .msg-row.other .bubble-col { align-items: flex-start; }

  .bubble {
    padding: 9px 13px; border-radius: 17px;
    font-size: 14px; line-height: 1.5; word-break: break-word;
    position: relative;
  }
  .bubble.child-b {
    background: ${p.primary}; color: white;
    border-bottom-right-radius: 5px;
    box-shadow: 0 2px 8px ${p.primary}44;
  }
  .bubble.other-b {
    background: ${p.white}; color: ${p.text};
    border: 1.5px solid ${p.border};
    border-bottom-left-radius: 5px;
    box-shadow: 0 2px 6px rgba(35,37,53,0.06);
  }
  .bubble.blocked-b {
    background: ${p.surface}; color: ${p.textMid};
    border: 1.5px dashed ${p.border};
    font-style: italic; font-size: 13px;
    border-bottom-right-radius: 5px;
  }
  .bubble.flagged-b {
    background: ${p.alert4}0A; color: ${p.text};
    border: 1.5px solid ${p.alert4}40;
    border-bottom-right-radius: 5px;
  }
  .bubble.kind-b {
    background: ${p.primary}; color: white;
    border-bottom-right-radius: 5px;
    box-shadow: 0 2px 8px ${p.primary}44;
  }

  .bubble-time { font-size: 10px; color: ${p.sand}; margin-top: 3px; padding: 0 2px; font-weight: 600; }

  /* FLAG ANNOTATION */
  .flag-annotation {
    display: flex; align-items: center; gap: 5px;
    margin-top: 4px; padding: 0 2px;
  }
  .flag-chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
    text-transform: uppercase; padding: 2px 8px; border-radius: 6px;
    cursor: pointer; transition: opacity 0.15s;
  }
  .flag-chip:hover { opacity: 0.75; }
  .chip-blocked { background: ${p.alert4}12; color: ${p.alert4}; }
  .chip-kind { background: ${p.virtue}12; color: ${p.virtue}; }
  .chip-flag { background: ${p.alert3}14; color: #8A6010; }

  /* PARENT HIGHLIGHT */
  .parent-note {
    background: ${p.accent}0A; border: 1px solid ${p.accent}28;
    border-radius: 10px; padding: 7px 11px;
    font-size: 11px; color: ${p.accentDark}; line-height: 1.5;
    margin-top: 5px; max-width: 70%; align-self: flex-end;
    display: flex; gap: 6px; align-items: flex-start;
  }

  /* ── BOTTOM ACTION BAR ── */
  .action-bar {
    background: rgba(255,255,255,0.96); backdrop-filter: blur(14px);
    border-top: 1px solid ${p.border};
    padding: 12px 14px 24px; flex-shrink: 0;
  }
  .action-bar-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1.2px;
    text-transform: uppercase; color: ${p.textMid}; margin-bottom: 10px;
  }
  .action-row { display: flex; gap: 8px; }
  .action-btn {
    flex: 1; padding: 11px 8px; border-radius: 13px;
    border: 1.5px solid ${p.border}; background: ${p.white};
    font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; transition: all 0.15s;
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    color: ${p.textMid};
  }
  .action-btn:hover { background: ${p.surface}; transform: translateY(-1px); }
  .action-btn.primary-action {
    background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark});
    color: white; border-color: transparent;
    box-shadow: 0 4px 14px ${p.primary}44;
  }
  .action-btn.danger-action {
    background: ${p.alert4}0C; color: ${p.alert4};
    border-color: ${p.alert4}30;
  }
  .action-btn.danger-action:hover { background: ${p.alert4}18; }

  /* ── OVERLAY ── */
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
  .sheet-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${p.textMid}; margin-bottom: 6px; }
  .sheet-title { font-family: 'Fraunces', serif; font-size: 21px; font-weight: 600; color: ${p.text}; margin-bottom: 8px; }
  .sheet-sub { font-size: 13px; color: ${p.textMid}; line-height: 1.65; margin-bottom: 18px; }
  .sheet-msg {
    background: ${p.alert4}08; border: 1.5px solid ${p.alert4}28;
    border-radius: 13px; padding: 13px 15px;
    font-size: 13px; color: ${p.text}; line-height: 1.6;
    margin-bottom: 8px; font-style: italic;
  }
  .sheet-context {
    font-size: 11px; color: ${p.textMid}; margin-bottom: 18px; padding: 0 2px;
  }
  .sht-btn {
    width: 100%; padding: 13px; border-radius: 13px; border: none;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; margin-bottom: 9px; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .sht-primary { background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark}); color: white; box-shadow: 0 4px 14px ${p.primary}44; }
  .sht-danger { background: ${p.alert4}10; color: ${p.alert4}; border: 1.5px solid ${p.alert4}28; }
  .sht-warn { background: ${p.alert3}10; color: #8A6010; border: 1.5px solid ${p.alert3}30; }
  .sht-ghost { background: ${p.surface}; color: ${p.textMid}; }

  /* PAUSE CONFIRMATION */
  .pause-options { display: flex; flex-direction: column; gap: 9px; margin-bottom: 14px; }
  .pause-opt {
    padding: 13px 15px; border-radius: 13px;
    border: 1.5px solid ${p.border}; background: ${p.white};
    cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; gap: 12px;
  }
  .pause-opt:hover { border-color: ${p.alert4}44; background: ${p.alert4}06; }
  .pause-opt.on { border-color: ${p.alert4}; background: ${p.alert4}0A; }
  .pause-opt-label { font-size: 14px; font-weight: 700; color: ${p.text}; }
  .pause-opt-sub { font-size: 12px; color: ${p.textMid}; margin-top: 1px; }
  .pause-radio {
    width: 20px; height: 20px; border-radius: 10px;
    border: 2px solid ${p.border}; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .pause-opt.on .pause-radio { border-color: ${p.alert4}; background: ${p.alert4}; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .in { animation: fadeUp 0.32s cubic-bezier(0.4,0,0.2,1) forwards; }
`;

// ── ICONS ──
const Ico = ({ ch, size = 18, color = p.textMid }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {ch}
  </svg>
);

const Icons = {
  Back: () => <Ico ch={<polyline points="15,18 9,12 15,6" />} />,
  Eye: ({ color = p.textMid }) => <Ico color={color} ch={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>} />,
  Pause: ({ color = p.textMid }) => <Ico color={color} ch={<><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></>} />,
  Flag: ({ color = p.alert4, size = 18 }) => <Ico color={color} size={size} ch={<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>} />,
  Shield: ({ color = p.alert4, size = 16 }) => <Ico color={color} size={size} ch={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="9" x2="12" y2="13" strokeWidth="2"/><circle cx="12" cy="16.5" r="0.5" fill={color} strokeWidth="2"/></>} />,
  Heart: ({ color = p.virtue, size = 14 }) => <Ico color={color} size={size} ch={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>} />,
  Message: ({ color = p.textMid }) => <Ico color={color} ch={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>} />,
  Lock: ({ color = p.textMid }) => <Ico color={color} ch={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>} />,
  Check: ({ color = "white", size = 11 }) => <Ico color={color} size={size} ch={<polyline points="20,6 9,17 4,12" strokeWidth="2.5"/>} />,
  Info: ({ color = p.accent }) => <Ico color={color} ch={<><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5"/></>} />,
  Note: ({ color = p.accent }) => <Ico color={color} ch={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></>} />,
  Star: ({ color = p.virtue, size = 11 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  ),
};

// ── CONVERSATION DATA ──
const messages = [
  { id:1,  who:"other", text:"Hey Olivia! Are you studying for the math test?", time:"3:10 PM" },
  { id:2,  who:"child", text:"Yes!! I went through chapter 8 last night. The fractions part was so hard 😬", time:"3:11 PM" },
  { id:3,  who:"other", text:"Same! My mom helped me. Want to go over it together at lunch tomorrow?", time:"3:12 PM" },
  { id:4,  who:"child", text:"You always help me understand things better. You're a really good friend.", time:"3:13 PM", kind: true },
  { id:5,  who:"other", text:"Aww that's so sweet 🙂 you too!", time:"3:14 PM" },
  { id:6,  who:"child", text:"Are you coming to the game on Friday?", time:"3:15 PM" },
  { id:7,  who:"other", text:"Yes!! My dad is taking me. It's going to be so fun", time:"3:16 PM" },
  { id:8,  who:"child", text:"[Message blocked — explicit language detected]", time:"3:18 PM", blocked: true },
  { id:9,  who:"other", text:"Wait what happened? Did your message not send?", time:"3:19 PM" },
  { id:10, who:"child", text:"Oh sorry, it got blocked lol. Anyway are you bringing snacks?", time:"3:20 PM" },
  { id:11, who:"other", text:"Haha yes my mom is making those chocolate chip cookies 🍪", time:"3:21 PM" },
  { id:12, who:"child", text:"YESSS those are the best!! I'll bring chips", time:"3:22 PM" },
];

const PAUSE_OPTIONS = [
  { id:"1h", label:"Pause for 1 hour", sub:"Resumes automatically" },
  { id:"tonight", label:"Pause until tomorrow", sub:"Resumes at 7:00 AM" },
  { id:"indefinite", label:"Pause indefinitely", sub:"You manually resume when ready" },
];

export default function ParentConvoView() {
  const [filter, setFilter] = useState("all");
  const [sheet, setSheet] = useState(null);
  const [pauseOption, setPauseOption] = useState("1h");
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState({});

  const filtered = messages.filter(m => {
    if (filter === "all") return true;
    if (filter === "flags") return m.blocked;
    if (filter === "kind") return m.kind;
    return true;
  });

  const flagCount = messages.filter(m => m.blocked).length;
  const kindCount = messages.filter(m => m.kind).length;

  return (
    <>
      <style>{styles}</style>
      <div className="root">

        {/* HEADER */}
        <div className="header">
          <div className="header-row1">
            <div className="back-btn"><Icons.Back /></div>
            <div className="header-avatars">
              <div className="h-avatar" style={{ background: `linear-gradient(135deg, ${p.primary}, ${p.primaryDark})` }}>OL</div>
              <div className="h-avatar h-avatar-2" style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accentDark})` }}>SM</div>
            </div>
            <div className="header-info">
              <div className="header-names">Olivia & Sophie M.</div>
              <div className="header-meta">
                {flagCount > 0 && <span style={{ color: p.alert4 }}>{flagCount} flag · </span>}
                {kindCount > 0 && <span style={{ color: p.virtue }}>{kindCount} kind moment · </span>}
                <span>{messages.length} messages today</span>
              </div>
            </div>
            <div className="header-actions">
              <div className="hdr-btn danger" onClick={() => setSheet("pause")}>
                <Icons.Pause color={p.alert4} />
              </div>
              <div className="hdr-btn" onClick={() => setSheet("flag")}>
                <Icons.Flag color={p.alert4} />
              </div>
            </div>
          </div>

          {/* PARENT CONTEXT BANNER */}
          <div className="parent-banner">
            <Icons.Eye color={p.primaryDark} />
            <span className="parent-banner-text">Parent view — </span>
            <span className="parent-banner-sub">Olivia cannot see that you are reading this conversation</span>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="filter-bar">
          {[
            { id:"all", label:`All messages (${messages.length})`, cls:"" },
            { id:"flags", label:`Flags (${flagCount})`, cls:"flag" },
            { id:"kind", label:`Kind moments (${kindCount})`, cls:"kind" },
          ].map(f => (
            <div key={f.id}
              className={`filter-pill ${f.cls} ${filter === f.id ? "on" : ""}`}
              onClick={() => setFilter(f.id)}>
              {f.label}
            </div>
          ))}
        </div>

        {/* MESSAGES */}
        <div className="messages">
          <div className="date-div">
            <div className="date-line"/><div className="date-text">Today</div><div className="date-line"/>
          </div>

          {filtered.map((msg, idx) => {
            const isChild = msg.who === "child";
            const showAvatar = !isChild && (idx === 0 || filtered[idx-1]?.who !== "other");

            return (
              <div key={msg.id}>
                <div className={`msg-row ${isChild ? "child" : "other"}`}>
                  {!isChild && (
                    <div className={`msg-avatar ${showAvatar ? "" : "ghost"}`}
                      style={showAvatar ? { background:`linear-gradient(135deg, ${p.accent}, ${p.accentDark})` } : {}}>
                      {showAvatar ? "SM" : ""}
                    </div>
                  )}
                  <div className="bubble-col">
                    <div className={`bubble ${
                      msg.blocked ? "blocked-b" :
                      msg.kind ? "kind-b" :
                      isChild ? "child-b" : "other-b"
                    }`}>
                      {msg.text}
                    </div>

                    {/* FLAG CHIPS */}
                    {msg.blocked && (
                      <div className="flag-annotation">
                        <div className="flag-chip chip-blocked" onClick={() => setSheet("flag")}>
                          <Icons.Shield size={10} color={p.alert4} />
                          Blocked · Tap to review
                        </div>
                      </div>
                    )}
                    {msg.kind && (
                      <div className="flag-annotation">
                        <div className="flag-chip chip-kind">
                          <Icons.Star size={10} />
                          Kind moment
                        </div>
                      </div>
                    )}

                    {/* PARENT NOTE */}
                    {notes[msg.id] && (
                      <div className="parent-note">
                        <Icons.Note color={p.accent} />
                        <span>{notes[msg.id]}</span>
                      </div>
                    )}

                    <div className="bubble-time">{msg.time}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ACTION BAR */}
        <div className="action-bar">
          <div className="action-bar-label">Parent actions</div>
          <div className="action-row">
            <div className="action-btn" onClick={() => setSheet("pause")}>
              <Icons.Pause color={p.alert4} />
              <span>Pause</span>
            </div>
            <div className="action-btn" onClick={() => { setNoteOpen(true); }}>
              <Icons.Note color={p.accent} />
              <span>Add note</span>
            </div>
            <div className="action-btn primary-action" onClick={() => setSheet("flag")}>
              <Icons.Flag color="white" size={16} />
              <span>Review flag</span>
            </div>
          </div>
        </div>

        {/* ── FLAG REVIEW SHEET ── */}
        {sheet === "flag" && (
          <div className="overlay" onClick={() => setSheet(null)}>
            <div className="sheet" onClick={e => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-eyebrow">Level 3 — Hard block</div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <Icons.Shield color={p.alert4} size={22} />
                <div className="sheet-title">Message blocked</div>
              </div>
              <p className="sheet-sub">
                Olivia's message was stopped before Sophie received it. Review the content below and decide how to respond.
              </p>
              <div className="sheet-msg">
                "omg that test is going to be so [explicit word removed] hard"
              </div>
              <div className="sheet-context">
                Detected: profanity · Sent at 3:18 PM · Blocked automatically · SMS sent to your phone
              </div>
              <button className="sht-btn sht-warn" onClick={() => setSheet(null)}>
                <Icons.Message color="#8A6010" />
                Send Olivia a coaching message
              </button>
              <button className="sht-btn sht-danger" onClick={() => setSheet("pause")}>
                <Icons.Pause color={p.alert4} />
                Pause this conversation
              </button>
              <button className="sht-btn sht-ghost" onClick={() => setSheet(null)}>
                Dismiss — I'll address it in person
              </button>
            </div>
          </div>
        )}

        {/* ── PAUSE SHEET ── */}
        {sheet === "pause" && (
          <div className="overlay" onClick={() => setSheet(null)}>
            <div className="sheet" onClick={e => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <Icons.Pause color={p.alert4} />
                <div className="sheet-title">Pause conversation</div>
              </div>
              <p className="sheet-sub">
                Olivia won't be able to send or receive messages in this conversation. Sophie will not be notified. Only Olivia sees a pause notice.
              </p>
              <div className="pause-options">
                {PAUSE_OPTIONS.map(opt => (
                  <div key={opt.id}
                    className={`pause-opt ${pauseOption === opt.id ? "on" : ""}`}
                    onClick={() => setPauseOption(opt.id)}>
                    <div className="pause-radio">
                      {pauseOption === opt.id && <Icons.Check color="white" size={11} />}
                    </div>
                    <div>
                      <div className="pause-opt-label">{opt.label}</div>
                      <div className="pause-opt-sub">{opt.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="sht-btn sht-danger" onClick={() => setSheet(null)}>
                <Icons.Lock color={p.alert4} />
                Pause conversation
              </button>
              <button className="sht-btn sht-ghost" onClick={() => setSheet(null)}>Cancel</button>
            </div>
          </div>
        )}

        {/* ── ADD NOTE SHEET ── */}
        {noteOpen && (
          <div className="overlay" onClick={() => setNoteOpen(false)}>
            <div className="sheet" onClick={e => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <Icons.Note color={p.accent} />
                <div className="sheet-title">Add a parent note</div>
              </div>
              <p className="sheet-sub">
                Notes are visible only to you. They attach to the conversation as a private reminder — useful for follow-up conversations with Olivia.
              </p>
              <textarea
                style={{
                  width:"100%", padding:"12px 14px", borderRadius:13,
                  border:`1.5px solid ${p.border}`, fontFamily:"'Nunito', sans-serif",
                  fontSize:14, color:p.text, outline:"none", resize:"none",
                  background:p.surface, marginBottom:16, lineHeight:1.5, minHeight:90
                }}
                placeholder="e.g. Talk to Olivia about language choices tonight..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
              />
              <button className="sht-btn sht-primary" onClick={() => {
                if (noteText.trim()) {
                  setNotes(n => ({ ...n, 8: noteText.trim() }));
                  setNoteText("");
                }
                setNoteOpen(false);
              }}>
                Save note
              </button>
              <button className="sht-btn sht-ghost" onClick={() => setNoteOpen(false)}>Cancel</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
