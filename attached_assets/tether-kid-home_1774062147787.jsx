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
  gold: "#B8953A",
  goldBg: "#FBF7EE",
  goldBorder: "#E8D8A8",
  virtue: "#7A6EA8",
  virtueBg: "#F2F0FA",
  alert4: "#C4603A",
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
    padding: 14px 18px 12px; flex-shrink: 0;
  }
  .header-row {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 14px;
  }
  .kid-profile {
    display: flex; align-items: center; gap: 10px; cursor: pointer;
  }
  .kid-av {
    width: 38px; height: 38px; border-radius: 12px;
    background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark});
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: white;
    box-shadow: 0 3px 10px ${p.primary}44;
  }
  .kid-name {
    font-family: 'Fraunces', serif; font-size: 18px;
    font-weight: 600; color: ${p.text};
  }
  .kid-grade { font-size: 11px; color: ${p.textMid}; font-weight: 600; }
  .header-icons { display: flex; gap: 8px; }
  .hdr-btn {
    width: 36px; height: 36px; border-radius: 11px;
    border: 1.5px solid ${p.border}; background: ${p.white};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.15s; position: relative;
  }
  .hdr-btn:hover { background: ${p.surface}; }
  .notif-dot {
    position: absolute; top: -3px; right: -3px;
    width: 10px; height: 10px; border-radius: 5px;
    background: ${p.primary}; border: 2px solid ${p.white};
  }

  /* SEARCH BAR */
  .search-bar {
    display: flex; align-items: center; gap: 8px;
    background: ${p.surface}; border: 1.5px solid ${p.border};
    border-radius: 13px; padding: 9px 13px;
    transition: border-color 0.2s;
  }
  .search-bar:focus-within { border-color: ${p.primary}; }
  .search-input {
    flex: 1; border: none; background: transparent;
    font-family: 'Nunito', sans-serif; font-size: 14px;
    color: ${p.text}; outline: none;
  }
  .search-input::placeholder { color: ${p.sand}; }

  /* ── SCROLL BODY ── */
  .body {
    flex: 1; overflow-y: auto; padding: 14px 0 90px;
  }
  .body::-webkit-scrollbar { width: 4px; }
  .body::-webkit-scrollbar-thumb { background: ${p.border}; border-radius: 2px; }

  /* ── ANCHOR STRIP ── */
  .anchor-strip {
    margin: 0 14px 16px;
    background: ${p.goldBg}; border: 1.5px solid ${p.goldBorder};
    border-radius: 16px; padding: 13px 15px;
    display: flex; gap: 11px; align-items: flex-start; cursor: pointer;
    transition: background 0.15s;
  }
  .anchor-strip:hover { background: #F5EFE0; }
  .as-icon {
    width: 34px; height: 34px; border-radius: 10px;
    background: ${p.gold}18; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0;
  }
  .as-body { flex: 1; min-width: 0; }
  .as-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: ${p.gold}; margin-bottom: 3px;
  }
  .as-verse {
    font-family: 'Fraunces', serif; font-size: 13px;
    font-style: italic; color: ${p.text}; line-height: 1.45;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .as-ref { font-size: 11px; font-weight: 700; color: ${p.gold}; margin-top: 2px; }

  /* ── VIRTUE CHIP ── */
  .virtue-chip {
    margin: 0 14px 16px;
    background: ${p.virtueBg}; border: 1.5px solid ${p.virtueBorder};
    border-radius: 14px; padding: 10px 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .vc-icon {
    width: 30px; height: 30px; border-radius: 9px;
    background: ${p.virtue}16; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0;
  }
  .vc-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1.3px;
    text-transform: uppercase; color: ${p.virtue};
  }
  .vc-word {
    font-family: 'Fraunces', serif; font-size: 16px;
    font-weight: 600; color: ${p.text};
  }
  .vc-count {
    margin-left: auto; text-align: right; flex-shrink: 0;
  }
  .vc-num {
    font-family: 'Fraunces', serif; font-size: 22px;
    font-weight: 600; color: ${p.virtue}; line-height: 1;
  }
  .vc-num-label { font-size: 10px; font-weight: 700; color: ${p.virtue}88; }

  /* ── SECTION ── */
  .sec-head {
    display: flex; justify-content: space-between;
    align-items: center; padding: 0 16px; margin-bottom: 8px;
  }
  .sec-title { font-size: 12px; font-weight: 700; letter-spacing: 0.4px; color: ${p.textMid}; text-transform: uppercase; }
  .sec-link { font-size: 12px; font-weight: 700; color: ${p.accent}; cursor: pointer; }

  /* ── PINNED GROUP CHATS ── */
  .groups-row {
    display: flex; gap: 10px; padding: 0 14px 4px;
    overflow-x: auto; margin-bottom: 18px;
  }
  .groups-row::-webkit-scrollbar { display: none; }
  .group-card {
    flex-shrink: 0; width: 82px;
    display: flex; flex-direction: column; align-items: center; gap: 7px;
    cursor: pointer;
  }
  .group-av {
    width: 58px; height: 58px; border-radius: 19px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; position: relative;
    border: 2px solid ${p.border};
    transition: transform 0.15s;
  }
  .group-av:hover { transform: scale(1.05); }
  .group-av.has-unread { border-color: ${p.primary}; }
  .group-unread {
    position: absolute; top: -3px; right: -3px;
    width: 18px; height: 18px; border-radius: 9px;
    background: ${p.primary}; border: 2px solid ${p.white};
    font-size: 10px; font-weight: 700; color: white;
    display: flex; align-items: center; justify-content: center;
  }
  .group-name {
    font-size: 11px; font-weight: 700; color: ${p.text};
    text-align: center; line-height: 1.3;
  }

  /* ── CONVERSATIONS ── */
  .conv-list { display: flex; flex-direction: column; }
  .conv-item {
    display: flex; gap: 12px; align-items: center;
    padding: 12px 16px; cursor: pointer;
    transition: background 0.15s; position: relative;
  }
  .conv-item:hover { background: rgba(107,158,138,0.05); }
  .conv-item.unread { background: ${p.primary}05; }
  .conv-av-wrap { position: relative; flex-shrink: 0; }
  .conv-av {
    width: 48px; height: 48px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 700; color: white;
  }
  .conv-online {
    position: absolute; bottom: 1px; right: 1px;
    width: 12px; height: 12px; border-radius: 6px;
    background: ${p.primary}; border: 2px solid ${p.white};
  }
  .conv-body { flex: 1; min-width: 0; }
  .conv-row1 {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 3px;
  }
  .conv-name { font-size: 15px; font-weight: 700; color: ${p.text}; }
  .conv-time { font-size: 11px; color: ${p.sand}; font-weight: 600; flex-shrink: 0; }
  .conv-preview {
    font-size: 13px; color: ${p.textMid}; line-height: 1.35;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .conv-preview.unread-text { color: ${p.text}; font-weight: 600; }
  .unread-badge {
    width: 20px; height: 20px; border-radius: 10px;
    background: ${p.primary}; color: white;
    font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .kind-chip {
    display: inline-flex; align-items: center; gap: 4px;
    background: ${p.virtue}10; border: 1px solid ${p.virtue}28;
    border-radius: 6px; padding: 2px 7px;
    font-size: 10px; font-weight: 700; color: ${p.virtue};
    margin-top: 3px;
  }
  .conv-divider { height: 1px; background: ${p.border}; margin: 0 16px; opacity: 0.6; }

  /* ── PAUSED CONVERSATION ── */
  .conv-item.paused { opacity: 0.6; }
  .paused-badge {
    display: inline-flex; align-items: center; gap: 4px;
    background: ${p.sand}20; border: 1px solid ${p.border};
    border-radius: 6px; padding: 2px 7px;
    font-size: 10px; font-weight: 700; color: ${p.textMid};
    margin-top: 3px;
  }

  /* ── BOTTOM NAV ── */
  .bottomnav {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 420px;
    background: rgba(255,255,255,0.97); backdrop-filter: blur(14px);
    border-top: 1px solid ${p.border};
    display: flex; padding: 10px 0 20px; z-index: 50;
  }
  .nav-item {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; gap: 4px; cursor: pointer;
    padding: 2px 0; transition: opacity 0.15s;
  }
  .nav-item:hover { opacity: 0.7; }
  .nav-icon-wrap { position: relative; }
  .nav-label { font-size: 10px; font-weight: 700; letter-spacing: 0.2px; }
  .nav-item.on .nav-label { color: ${p.primary}; }
  .nav-item:not(.on) .nav-label { color: ${p.sand}; }

  /* ── NEW CHAT SHEET ── */
  .overlay {
    position: fixed; inset: 0; background: rgba(35,37,53,0.44);
    backdrop-filter: blur(6px); z-index: 100;
    display: flex; align-items: flex-end; justify-content: center;
  }
  .sheet {
    background: ${p.white}; border-radius: 24px 24px 0 0;
    width: 100%; max-width: 420px; padding: 20px 20px 44px;
    animation: slideUp 0.28s cubic-bezier(0.4,0,0.2,1);
    max-height: 80vh; overflow-y: auto;
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .sheet-handle { width: 34px; height: 4px; border-radius: 2px; background: ${p.border}; margin: 0 auto 18px; }
  .sheet-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; color: ${p.text}; margin-bottom: 4px; }
  .sheet-sub { font-size: 13px; color: ${p.textMid}; line-height: 1.6; margin-bottom: 16px; }

  .contact-row {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 4px; cursor: pointer; border-radius: 14px;
    transition: background 0.15s;
  }
  .contact-row:hover { background: ${p.surface}; padding-left: 10px; }
  .cr-av {
    width: 42px; height: 42px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: white; flex-shrink: 0;
  }
  .cr-name { font-size: 14px; font-weight: 700; color: ${p.text}; }
  .cr-school { font-size: 12px; color: ${p.textMid}; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .in { animation: fadeUp 0.32s cubic-bezier(0.4,0,0.2,1) forwards; }
`;

// ── ICONS ──
const Ico = ({ ch, size = 20, color = p.textMid }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {ch}
  </svg>
);

const Icons = {
  Search: ({ color = p.sand }) => <Ico color={color} size={16} ch={<><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.65" y2="16.65"/></>} />,
  Bell: ({ color = p.textMid }) => <Ico color={color} size={18} ch={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>} />,
  Settings: ({ color = p.textMid }) => <Ico color={color} size={18} ch={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>} />,
  Message: ({ color = p.textMid }) => <Ico color={color} size={20} ch={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>} />,
  Home: ({ color = p.textMid }) => <Ico color={color} size={20} ch={<><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H15v-5h-6v5H4a1 1 0 0 1-1-1V10.5z"/></>} />,
  Plus: ({ color = p.white }) => <Ico color={color} size={20} ch={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />,
  Book: ({ color = p.gold, size = 16 }) => <Ico color={color} size={size} ch={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>} />,
  Heart: ({ color = p.virtue, size = 14 }) => <Ico color={color} size={size} ch={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>} />,
  Star: ({ color = p.virtue, size = 11 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  ),
  Pause: ({ color = p.textMid, size = 14 }) => <Ico color={color} size={size} ch={<><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></>} />,
  Users: ({ color = p.textMid }) => <Ico color={color} size={20} ch={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
};

const groups = [
  { id:1, name:"Grade 4 Class", emoji:"📚", unread: 3, color: p.primary },
  { id:2, name:"Soccer Team", emoji:"⚽", unread: 0, color: p.accent },
  { id:3, name:"Bible Study", emoji:"✝️", unread: 1, color: p.gold },
  { id:4, name:"Science Fair", emoji:"🔭", unread: 0, color: p.virtue },
];

const conversations = [
  {
    id:1, name:"Sophie M.", initials:"SM", color: p.accent,
    preview:"You always help me understand things better!", time:"2m",
    unread: true, unreadCount: 2, online: true, kindMoment: true,
  },
  {
    id:2, name:"Emma K.", initials:"EK", color:"#C49A6A",
    preview:"Are you coming to the game on Friday?", time:"18m",
    unread: true, unreadCount: 1, online: false,
  },
  {
    id:3, name:"Lily T.", initials:"LT", color:"#7A9E7E",
    preview:"Did you finish reading chapter 5?", time:"1h",
    unread: false, online: false,
  },
  {
    id:4, name:"Ava R.", initials:"AR", color:"#9A7EC4",
    preview:"This conversation is paused.", time:"2h",
    unread: false, online: false, paused: true,
  },
  {
    id:5, name:"Grace H.", initials:"GH", color:"#C47A6A",
    preview:"I love that song too! 🎵", time:"Yesterday",
    unread: false, online: false,
  },
];

const allContacts = [
  { initials:"EK", name:"Emma K.", school:"Grace Academy · Grade 4", color:"#C49A6A" },
  { initials:"LT", name:"Lily T.", school:"Grace Academy · Grade 4", color:"#7A9E7E" },
  { initials:"GH", name:"Grace H.", school:"Grace Academy · Grade 4", color:"#C47A6A" },
  { initials:"MJ", name:"Mia J.", school:"Grace Academy · Grade 4", color:"#9BAAD8" },
];

export default function KidHome() {
  const [activeNav, setActiveNav] = useState("home");
  const [search, setSearch] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className="root">

        {/* HEADER */}
        <div className="header">
          <div className="header-row">
            <div className="kid-profile">
              <div className="kid-av">OL</div>
              <div>
                <div className="kid-name">Olivia</div>
                <div className="kid-grade">Grade 4 · Grace Academy</div>
              </div>
            </div>
            <div className="header-icons">
              <div className="hdr-btn">
                <Icons.Bell color={p.textMid} />
                <div className="notif-dot" />
              </div>
              <div className="hdr-btn">
                <Icons.Settings color={p.textMid} />
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="search-bar">
            <Icons.Search color={p.sand} />
            <input
              className="search-input"
              placeholder="Search conversations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* SCROLL BODY */}
        <div className="body">

          {/* DAILY ANCHOR */}
          {!search && (
            <div className="anchor-strip">
              <div className="as-icon"><Icons.Book size={16} color={p.gold} /></div>
              <div className="as-body">
                <div className="as-label">Today's verse</div>
                <div className="as-verse">"Do not be anxious about anything, but in every situation..."</div>
                <div className="as-ref">Philippians 4:6 · NIV</div>
              </div>
            </div>
          )}

          {/* VIRTUE CHIP */}
          {!search && (
            <div className="virtue-chip">
              <div className="vc-icon"><Icons.Heart size={16} color={p.virtue} /></div>
              <div>
                <div className="vc-label">Today's virtue</div>
                <div className="vc-word">Encouragement</div>
              </div>
              <div className="vc-count">
                <div className="vc-num">5</div>
                <div className="vc-num-label">kind moments</div>
              </div>
            </div>
          )}

          {/* GROUP CHATS */}
          {!search && (
            <>
              <div className="sec-head">
                <span className="sec-title">Groups</span>
                <span className="sec-link">See all</span>
              </div>
              <div className="groups-row">
                {groups.map(g => (
                  <div key={g.id} className="group-card">
                    <div className={`group-av ${g.unread > 0 ? "has-unread" : ""}`}
                      style={{ background: `${g.color}18` }}>
                      <span style={{ fontSize: 26 }}>{g.emoji}</span>
                      {g.unread > 0 && <div className="group-unread">{g.unread}</div>}
                    </div>
                    <div className="group-name">{g.name}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* DIRECT MESSAGES */}
          <div className="sec-head" style={{ marginBottom: 4 }}>
            <span className="sec-title">Messages</span>
          </div>

          <div className="conv-list">
            {filtered.map((conv, idx) => (
              <div key={conv.id}>
                <div className={`conv-item ${conv.unread ? "unread" : ""} ${conv.paused ? "paused" : ""}`}>
                  <div className="conv-av-wrap">
                    <div className="conv-av"
                      style={{ background: `linear-gradient(135deg, ${conv.color}, ${conv.color}BB)` }}>
                      {conv.initials}
                    </div>
                    {conv.online && <div className="conv-online" />}
                  </div>
                  <div className="conv-body">
                    <div className="conv-row1">
                      <div className="conv-name">{conv.name}</div>
                      <div className="conv-time">{conv.time}</div>
                    </div>
                    <div className={`conv-preview ${conv.unread ? "unread-text" : ""}`}>
                      {conv.preview}
                    </div>
                    {conv.kindMoment && (
                      <div className="kind-chip">
                        <Icons.Star size={10} color={p.virtue} />
                        Kind moment
                      </div>
                    )}
                    {conv.paused && (
                      <div className="paused-badge">
                        <Icons.Pause size={10} color={p.textMid} />
                        Paused by parent
                      </div>
                    )}
                  </div>
                  {conv.unread && conv.unreadCount > 0 && (
                    <div className="unread-badge">{conv.unreadCount}</div>
                  )}
                </div>
                {idx < filtered.length - 1 && <div className="conv-divider" />}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"40px 20px" }}>
              <div style={{ fontSize:14, color:p.textMid }}>No conversations match "{search}"</div>
            </div>
          )}
        </div>

        {/* FLOATING NEW CHAT BTN */}
        <div
          onClick={() => setNewChatOpen(true)}
          style={{
            position:"fixed", bottom:84, right:"calc(50% - 195px)",
            width:52, height:52, borderRadius:17,
            background:`linear-gradient(135deg, ${p.primary}, ${p.primaryDark})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 6px 20px ${p.primary}55`, cursor:"pointer",
            transition:"all 0.18s", zIndex:40,
          }}
          onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px) scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform="none"}
        >
          <Icons.Plus />
        </div>

        {/* BOTTOM NAV */}
        <div className="bottomnav">
          {[
            { id:"home", label:"Home", icon: (on) => <Icons.Home color={on ? p.primary : p.sand} /> },
            { id:"messages", label:"Messages", icon: (on) => <Icons.Message color={on ? p.primary : p.sand} /> },
            { id:"groups", label:"Groups", icon: (on) => <Icons.Users color={on ? p.primary : p.sand} /> },
            { id:"settings", label:"Settings", icon: (on) => <Icons.Settings color={on ? p.primary : p.sand} /> },
          ].map(n => (
            <div key={n.id} className={`nav-item ${activeNav === n.id ? "on" : ""}`}
              onClick={() => setActiveNav(n.id)}>
              <div className="nav-icon-wrap">{n.icon(activeNav === n.id)}</div>
              <div className="nav-label">{n.label}</div>
            </div>
          ))}
        </div>

        {/* NEW CHAT SHEET */}
        {newChatOpen && (
          <div className="overlay" onClick={() => setNewChatOpen(false)}>
            <div className="sheet" onClick={e => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-title">New message</div>
              <div className="sheet-sub">You can only message friends your parent has approved.</div>
              {allContacts.map(c => (
                <div key={c.initials} className="contact-row" onClick={() => setNewChatOpen(false)}>
                  <div className="cr-av" style={{ background:`linear-gradient(135deg, ${c.color}, ${c.color}BB)` }}>
                    {c.initials}
                  </div>
                  <div>
                    <div className="cr-name">{c.name}</div>
                    <div className="cr-school">{c.school}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
