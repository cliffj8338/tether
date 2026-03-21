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
  alert4: "#C4603A",
  gold: "#B8953A",
  goldLight: "#D4B060",
  goldBg: "#FBF7EE",
  goldBorder: "#E8D8A8",
  virtue: "#7A6EA8",
  virtueBg: "#F2F0FA",
  virtueBorder: "#C8C0E8",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400;1,600&family=Nunito:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .root {
    min-height: 100vh; background: ${p.background};
    font-family: 'Nunito', sans-serif; color: ${p.text};
    max-width: 420px; margin: 0 auto;
  }

  /* ── SHARED ── */
  .topbar {
    background: rgba(255,255,255,0.94); backdrop-filter: blur(14px);
    border-bottom: 1px solid ${p.border};
    padding: 14px 20px; display: flex; align-items: center;
    justify-content: space-between; position: sticky; top: 0; z-index: 50;
  }
  .logorow { display: flex; align-items: center; gap: 9px; }
  .logobox {
    width: 32px; height: 32px; border-radius: 9px;
    background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark});
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 10px ${p.primary}44;
  }
  .logotext { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 600; color: ${p.text}; }
  .tab-row {
    display: flex; background: ${p.surface};
    border-bottom: 1px solid ${p.border};
  }
  .tab {
    flex: 1; padding: 11px 8px; text-align: center;
    font-size: 12px; font-weight: 700; cursor: pointer;
    color: ${p.sand}; border-bottom: 2px solid transparent;
    transition: all 0.2s; letter-spacing: 0.3px;
  }
  .tab.on { color: ${p.primary}; border-bottom-color: ${p.primary}; }

  .body { padding: 20px 16px 60px; }

  .sec-head {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 11px;
  }
  .sec-title { font-size: 13px; font-weight: 700; color: ${p.text}; }
  .sec-link { font-size: 12px; font-weight: 700; color: ${p.accent}; cursor: pointer; }

  .greeting { margin-bottom: 18px; }
  .greeting-sub { font-size: 12px; font-weight: 600; color: ${p.textMid}; margin-bottom: 3px; }
  .greeting-name { font-family: 'Fraunces', serif; font-size: 23px; font-weight: 600; color: ${p.text}; }
  .greeting-name em { font-style: italic; color: ${p.primary}; }

  /* ── DAILY ANCHOR ── */
  .anchor-card {
    background: ${p.goldBg};
    border: 1.5px solid ${p.goldBorder};
    border-radius: 20px; padding: 20px;
    margin-bottom: 18px; position: relative;
    overflow: hidden;
  }
  .anchor-glow {
    position: absolute; top: -40px; right: -40px;
    width: 140px; height: 140px; border-radius: 50%;
    background: radial-gradient(circle, ${p.gold}22 0%, transparent 70%);
    pointer-events: none;
  }
  .anchor-header {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 14px;
  }
  .anchor-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1.8px;
    text-transform: uppercase; color: ${p.gold};
  }
  .anchor-verse {
    font-family: 'Fraunces', serif; font-size: 17px;
    font-weight: 400; font-style: italic;
    color: ${p.text}; line-height: 1.55;
    margin-bottom: 10px;
  }
  .anchor-ref {
    font-size: 12px; font-weight: 700;
    color: ${p.gold}; letter-spacing: 0.3px;
  }
  .anchor-theme {
    display: inline-flex; align-items: center; gap: 5px;
    margin-top: 12px; background: ${p.gold}14;
    border: 1px solid ${p.gold}30; border-radius: 20px;
    padding: 4px 10px; font-size: 11px; font-weight: 700; color: ${p.gold};
  }

  /* ── VIRTUE BANNER ── */
  .virtue-card {
    background: ${p.virtueBg}; border: 1.5px solid ${p.virtueBorder};
    border-radius: 16px; padding: 15px 16px;
    margin-bottom: 18px; display: flex; gap: 12px; align-items: center;
  }
  .virtue-icon-wrap {
    width: 42px; height: 42px; border-radius: 13px;
    background: ${p.virtue}18;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .virtue-body { flex: 1; }
  .virtue-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: ${p.virtue}; margin-bottom: 3px;
  }
  .virtue-title {
    font-family: 'Fraunces', serif; font-size: 18px;
    font-weight: 600; color: ${p.text}; margin-bottom: 2px;
  }
  .virtue-def { font-size: 12px; color: ${p.textMid}; line-height: 1.45; }
  .virtue-count {
    text-align: right; flex-shrink: 0;
  }
  .virtue-num {
    font-family: 'Fraunces', serif; font-size: 26px;
    font-weight: 600; color: ${p.virtue}; line-height: 1;
  }
  .virtue-num-label { font-size: 10px; font-weight: 700; color: ${p.virtue}88; }

  /* ── STATS ── */
  .stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 9px; margin-bottom: 20px;
  }
  .stat-card {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 15px; padding: 13px 10px; text-align: center;
  }
  .stat-num { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 600; line-height: 1; margin-bottom: 4px; }
  .stat-num.g { color: ${p.primary}; }
  .stat-num.b { color: ${p.accent}; }
  .stat-num.v { color: ${p.virtue}; }
  .stat-label { font-size: 11px; font-weight: 600; color: ${p.textMid}; line-height: 1.3; }

  /* ── FEED ── */
  .feed { display: flex; flex-direction: column; gap: 9px; margin-bottom: 20px; }
  .feed-item {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 16px; padding: 13px 15px;
    display: flex; gap: 11px; cursor: pointer;
    transition: all 0.15s; position: relative; overflow: hidden;
  }
  .feed-item:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(35,37,53,0.07); }
  .feed-item::before {
    content: ''; position: absolute;
    left: 0; top: 0; bottom: 0; width: 3px; border-radius: 3px 0 0 3px;
  }
  .feed-item.ok::before { background: ${p.border}; }
  .feed-item.kind::before { background: ${p.virtue}; }
  .feed-item.l4::before { background: ${p.alert4}; }
  .feed-icon-wrap {
    width: 38px; height: 38px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .feed-body { flex: 1; min-width: 0; }
  .feed-row1 { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3px; }
  .feed-who { font-size: 13px; font-weight: 700; color: ${p.text}; }
  .feed-with { font-weight: 500; color: ${p.textMid}; }
  .feed-time { font-size: 11px; color: ${p.sand}; flex-shrink: 0; margin-left: 6px; }
  .feed-preview { font-size: 12px; color: ${p.textMid}; line-height: 1.45; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .feed-tag {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.6px;
    text-transform: uppercase; padding: 2px 8px; border-radius: 6px;
  }
  .tag-ok { background: ${p.primary}12; color: ${p.primaryDark}; }
  .tag-kind { background: ${p.virtue}14; color: ${p.virtue}; }
  .tag-l4 { background: ${p.alert4}14; color: #9A3818; }

  /* ── FAITH SETUP SCREEN ── */
  .setup-hero {
    text-align: center; padding: 32px 20px 24px;
    border-bottom: 1px solid ${p.border}; margin-bottom: 24px;
  }
  .setup-cross {
    width: 56px; height: 56px; border-radius: 18px;
    background: linear-gradient(135deg, ${p.gold}, ${p.goldLight});
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
    box-shadow: 0 6px 20px ${p.gold}44;
  }
  .setup-title {
    font-family: 'Fraunces', serif; font-size: 24px;
    font-weight: 600; color: ${p.text}; margin-bottom: 8px;
  }
  .setup-title em { font-style: italic; color: ${p.gold}; }
  .setup-sub { font-size: 14px; color: ${p.textMid}; line-height: 1.6; max-width: 300px; margin: 0 auto; }

  .prominence-cards { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
  .prominence-card {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 18px; padding: 16px 18px;
    cursor: pointer; transition: all 0.18s;
    display: flex; gap: 14px; align-items: flex-start;
  }
  .prominence-card:hover { border-color: ${p.gold}44; background: ${p.goldBg}; }
  .prominence-card.on {
    border-color: ${p.gold};
    background: ${p.goldBg};
    box-shadow: 0 4px 16px ${p.gold}28;
  }
  .prom-indicator {
    width: 20px; height: 20px; border-radius: 10px;
    border: 2px solid ${p.border}; flex-shrink: 0;
    margin-top: 2px; display: flex; align-items: center;
    justify-content: center; transition: all 0.15s;
  }
  .prominence-card.on .prom-indicator {
    border-color: ${p.gold}; background: ${p.gold};
  }
  .prom-body { flex: 1; }
  .prom-name { font-size: 15px; font-weight: 700; color: ${p.text}; margin-bottom: 3px; }
  .prom-desc { font-size: 12px; color: ${p.textMid}; line-height: 1.55; }
  .prom-features {
    display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px;
  }
  .prom-feat {
    font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
    padding: 3px 8px; border-radius: 6px;
    background: ${p.gold}12; color: ${p.gold}; border: 1px solid ${p.gold}28;
  }

  .translation-row {
    display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;
  }
  .trans-btn {
    padding: 9px 16px; border-radius: 12px;
    border: 1.5px solid ${p.border}; background: ${p.white};
    font-family: 'Nunito', sans-serif; font-size: 13px;
    font-weight: 700; color: ${p.textMid}; cursor: pointer;
    transition: all 0.15s;
  }
  .trans-btn.on {
    border-color: ${p.gold}; background: ${p.goldBg}; color: ${p.gold};
  }
  .trans-btn:hover:not(.on) { background: ${p.surface}; }

  .feature-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
  .feature-row {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 16px; padding: 14px 16px;
    display: flex; gap: 12px; align-items: flex-start;
  }
  .feature-icon {
    width: 38px; height: 38px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .feature-body { flex: 1; }
  .feature-name { font-size: 14px; font-weight: 700; color: ${p.text}; margin-bottom: 3px; }
  .feature-desc { font-size: 12px; color: ${p.textMid}; line-height: 1.5; }
  .toggle {
    width: 42px; height: 24px; border-radius: 12px;
    position: relative; cursor: pointer; flex-shrink: 0;
    margin-top: 2px; transition: background 0.2s;
  }
  .toggle.on { background: ${p.primary}; }
  .toggle.off { background: ${p.border}; }
  .toggle-knob {
    position: absolute; top: 3px;
    width: 18px; height: 18px; border-radius: 9px;
    background: white; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    transition: left 0.2s;
  }
  .toggle.on .toggle-knob { left: 21px; }
  .toggle.off .toggle-knob { left: 3px; }

  .btn {
    width: 100%; padding: 14px; border: none; border-radius: 15px;
    font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.18s;
  }
  .btn-gold {
    background: linear-gradient(135deg, ${p.gold}, ${p.goldLight});
    color: white; box-shadow: 0 4px 18px ${p.gold}44;
  }
  .btn-gold:hover { box-shadow: 0 6px 22px ${p.gold}55; transform: translateY(-1px); }

  /* ── CHAT PROMPT MODAL ── */
  .overlay {
    position: fixed; inset: 0;
    background: rgba(35,37,53,0.42); backdrop-filter: blur(5px);
    z-index: 100; display: flex; align-items: flex-end; justify-content: center;
  }
  .sheet {
    background: ${p.white}; border-radius: 24px 24px 0 0;
    width: 100%; max-width: 420px; padding: 20px 22px 44px;
    animation: slideUp 0.28s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .sheet-handle { width: 34px; height: 4px; border-radius: 2px; background: ${p.border}; margin: 0 auto 20px; }

  .prayer-card {
    background: ${p.goldBg}; border: 1.5px solid ${p.goldBorder};
    border-radius: 16px; padding: 18px; margin-bottom: 16px; text-align: center;
  }
  .prayer-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1.8px;
    text-transform: uppercase; color: ${p.gold}; margin-bottom: 12px;
  }
  .prayer-text {
    font-family: 'Fraunces', serif; font-size: 16px;
    font-style: italic; color: ${p.text}; line-height: 1.65;
  }
  .virtue-today {
    background: ${p.virtueBg}; border: 1.5px solid ${p.virtueBorder};
    border-radius: 14px; padding: 14px 16px; margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .vt-word {
    font-family: 'Fraunces', serif; font-size: 20px;
    font-weight: 600; color: ${p.virtue};
  }
  .vt-def { font-size: 12px; color: ${p.textMid}; line-height: 1.45; }
  .sheet-actions { display: flex; flex-direction: column; gap: 9px; }
  .sht-btn {
    width: 100%; padding: 13px; border-radius: 13px; border: none;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.15s;
  }
  .sht-gold { background: linear-gradient(135deg, ${p.gold}, ${p.goldLight}); color: white; box-shadow: 0 4px 14px ${p.gold}44; }
  .sht-ghost { background: ${p.surface}; color: ${p.textMid}; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .in { animation: fadeUp 0.32s cubic-bezier(0.4,0,0.2,1) forwards; }
`;

// ── ICONS ──
const I = ({ d, size = 20, color = p.textMid, fill = "none", extra = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...extra}>
    {d}
  </svg>
);

const TetherLogo = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" fill="white" />
    <line x1="12" y1="2" x2="12" y2="9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="12" y1="15" x2="12" y2="22" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="2" y1="12" x2="9" y2="12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="15" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="2" r="1.3" fill="white" opacity="0.5" />
    <circle cx="12" cy="22" r="1.3" fill="white" opacity="0.5" />
    <circle cx="2" cy="12" r="1.3" fill="white" opacity="0.5" />
    <circle cx="22" cy="12" r="1.3" fill="white" opacity="0.5" />
  </svg>
);

const CrossIcon = ({ size = 26, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="5" y1="9" x2="19" y2="9" />
  </svg>
);

const BookIcon = ({ size = 18, color = p.gold }) => (
  <I size={size} color={color}
    d={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>} />
);

const StarIcon = ({ size = 18, color = p.virtue }) => (
  <I size={size} color={color} fill={color}
    d={<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />} />
);

const HeartIcon = ({ size = 18, color = p.virtue }) => (
  <I size={size} color={color}
    d={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />} />
);

const ShieldIcon = ({ size = 18, color = p.alert4 }) => (
  <I size={size} color={color}
    d={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" /><circle cx="12" cy="16.5" r="0.5" fill={color} strokeWidth="2" /></>} />
);

const MessageIcon = ({ size = 18, color = p.primary }) => (
  <I size={size} color={color}
    d={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />} />
);

const CheckSmall = ({ color = "white" }) => (
  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

// ── DATA ──
const prominenceLevels = [
  {
    id: "subtle", name: "Subtle",
    desc: "Quiet touches only. A verse available when sought, faith-aware filtering in the background.",
    features: ["Daily verse (optional)", "Faith filtering"],
  },
  {
    id: "moderate", name: "Moderate",
    desc: "Clearly present, never interrupting. Verse on the dashboard, virtue recognition active, chat prompts available.",
    features: ["Daily Anchor", "Virtue recognition", "Chat prompts", "Faith filtering"],
  },
  {
    id: "rich", name: "Rich",
    desc: "Faith woven into the full daily experience. All features active, prayer threads, monthly character theme.",
    features: ["Daily Anchor", "Virtue recognition", "Chat prompts", "Faith filtering", "Prayer thread", "Character theme"],
  },
];

const translations = ["NIV", "ESV", "KJV", "NLT", "NKJV"];

const features = [
  {
    name: "The Daily Anchor",
    desc: "A morning verse on the dashboard — grounding, not instructing. Kids see an age-appropriate version.",
    iconBg: `${p.gold}16`, icon: <BookIcon size={18} color={p.gold} />,
  },
  {
    name: "Chat Opening Prompts",
    desc: "An optional prayer or virtue word at the start of group conversations. Kids can engage or skip — no pressure.",
    iconBg: `${p.primary}14`, icon: <MessageIcon size={18} color={p.primary} />,
  },
  {
    name: "Virtue Recognition",
    desc: "When kindness, encouragement, or uplifting language is detected, it's noted. You watch them grow, not just guard them.",
    iconBg: `${p.virtue}14`, icon: <HeartIcon size={18} color={p.virtue} />,
  },
  {
    name: "Faith-Aligned Filtering",
    desc: "A values layer above standard content rules, aligned to Christian principles. Cohort admins set the baseline.",
    iconBg: `${p.alert4}12`, icon: <ShieldIcon size={18} color={p.alert4} />,
  },
];

const feedData = [
  { id:1, child:"Olivia", level:"kind", tag:"tag-kind", tagLabel:"Kind moment",
    iconBg:`${p.virtue}14`, preview:"You're going to do great — I know you can do it!", time:"14m ago", partner:"Sophie M." },
  { id:2, child:"Liam", level:"ok", tag:"tag-ok", tagLabel:"Conversation",
    iconBg:`${p.primary}12`, preview:"Hey want to work on the project after school?", time:"32m ago", partner:"Noah T." },
  { id:3, child:"Olivia", level:"l4", tag:"tag-l4", tagLabel:"Level 4 — Blocked",
    iconBg:`${p.alert4}12`, preview:"Flagged message blocked — explicit content detected.", time:"1h ago", partner:"Emma K." },
];

// ── COMPONENT ──
export default function FaithMode() {
  const [tab, setTab] = useState("dashboard");
  const [prominence, setProminence] = useState("moderate");
  const [translation, setTranslation] = useState("NIV");
  const [toggles, setToggles] = useState({ anchor: true, prompts: true, virtue: true, filter: true });
  const [promptOpen, setPromptOpen] = useState(false);

  const tog = (k) => setToggles(t => ({ ...t, [k]: !t[k] }));

  return (
    <>
      <style>{styles}</style>
      <div className="root">

        {/* TOP BAR */}
        <div className="topbar">
          <div className="logorow">
            <div className="logobox"><TetherLogo /></div>
            <span className="logotext">Tether</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            background: `${p.gold}14`, border: `1px solid ${p.gold}38`,
            borderRadius: 20, padding: "5px 12px",
          }}>
            <CrossIcon size={12} color={p.gold} />
            <span style={{ fontSize: 11, fontWeight: 700, color: p.gold, letterSpacing: 0.5 }}>Faith Mode · Moderate</span>
          </div>
        </div>

        {/* TABS */}
        <div className="tab-row">
          {[["dashboard","Dashboard"],["setup","Faith Setup"]].map(([id, label]) => (
            <div key={id} className={`tab ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>{label}</div>
          ))}
        </div>

        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <div className="body in">
            <div className="greeting">
              <div className="greeting-sub">Good morning, Cliff</div>
              <div className="greeting-name">Here's what's <em>happening</em></div>
            </div>

            {/* DAILY ANCHOR */}
            <div className="anchor-card">
              <div className="anchor-glow" />
              <div className="anchor-header">
                <BookIcon size={14} color={p.gold} />
                <span className="anchor-label">Daily Anchor · {translation}</span>
              </div>
              <div className="anchor-verse">
                "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
              </div>
              <div className="anchor-ref">Philippians 4:6</div>
              <div className="anchor-theme">
                <StarIcon size={11} color={p.gold} />
                Today's theme: Peace
              </div>
            </div>

            {/* VIRTUE OF THE DAY */}
            <div className="virtue-card">
              <div className="virtue-icon-wrap">
                <HeartIcon size={20} color={p.virtue} />
              </div>
              <div className="virtue-body">
                <div className="virtue-label">Virtue of the Day</div>
                <div className="virtue-title">Encouragement</div>
                <div className="virtue-def">Building others up with words that give strength and hope.</div>
              </div>
              <div className="virtue-count">
                <div className="virtue-num">5</div>
                <div className="virtue-num-label">kind moments</div>
              </div>
            </div>

            {/* STATS */}
            <div className="sec-head">
              <span className="sec-title">Today's activity</span>
              <span className="sec-link">Full report</span>
            </div>
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-num g">23</div>
                <div className="stat-label">Messages sent</div>
              </div>
              <div className="stat-card">
                <div className="stat-num v">5</div>
                <div className="stat-label">Kind moments</div>
              </div>
              <div className="stat-card">
                <div className="stat-num b">1</div>
                <div className="stat-label">Flag today</div>
              </div>
            </div>

            {/* ACTIVITY FEED */}
            <div className="sec-head">
              <span className="sec-title">Recent activity</span>
              <span className="sec-link">See all</span>
            </div>
            <div className="feed">
              {feedData.map(item => (
                <div key={item.id} className={`feed-item ${item.level}`}
                  onClick={() => item.level === "ok" && setPromptOpen(true)}>
                  <div className="feed-icon-wrap" style={{ background: item.iconBg }}>
                    {item.level === "kind" ? <HeartIcon size={17} color={p.virtue} />
                      : item.level === "l4" ? <ShieldIcon size={17} color={p.alert4} />
                      : <MessageIcon size={17} color={p.primary} />}
                  </div>
                  <div className="feed-body">
                    <div className="feed-row1">
                      <div className="feed-who">{item.child} <span className="feed-with">· {item.partner}</span></div>
                      <div className="feed-time">{item.time}</div>
                    </div>
                    <div className="feed-preview">{item.preview}</div>
                    <div className={`feed-tag ${item.tag}`}>{item.tagLabel}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: p.goldBg, border: `1.5px solid ${p.goldBorder}`,
              borderRadius: 16, padding: "14px 16px",
              display: "flex", gap: 10, alignItems: "center", cursor: "pointer"
            }} onClick={() => setPromptOpen(true)}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: `${p.gold}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MessageIcon size={17} color={p.gold} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: p.text, marginBottom: 2 }}>Today's chat opening prompt</div>
                <div style={{ fontSize: 12, color: p.textMid }}>Tap to preview what your kids see when they open a group chat.</div>
              </div>
            </div>
          </div>
        )}

        {/* ── SETUP TAB ── */}
        {tab === "setup" && (
          <div className="body in">
            <div className="setup-hero">
              <div className="setup-cross"><CrossIcon size={26} /></div>
              <div className="setup-title">Faith <em>Mode</em></div>
              <div className="setup-sub">
                Layer Christian values and community into the Tether experience. You set the tone for your cohort.
              </div>
            </div>

            {/* PROMINENCE */}
            <div className="sec-head">
              <span className="sec-title">Community prominence level</span>
            </div>
            <div style={{ fontSize: 12, color: p.textMid, marginBottom: 14, lineHeight: 1.6 }}>
              As cohort admin, you set the level for your community. Individual parents can adjust downward within their household.
            </div>
            <div className="prominence-cards">
              {prominenceLevels.map(lv => (
                <div key={lv.id} className={`prominence-card ${prominence === lv.id ? "on" : ""}`}
                  onClick={() => setProminence(lv.id)}>
                  <div className="prom-indicator">
                    {prominence === lv.id && <CheckSmall />}
                  </div>
                  <div className="prom-body">
                    <div className="prom-name">{lv.name}</div>
                    <div className="prom-desc">{lv.desc}</div>
                    <div className="prom-features">
                      {lv.features.map(f => <span key={f} className="prom-feat">{f}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TRANSLATION */}
            <div className="sec-head">
              <span className="sec-title">Scripture translation</span>
            </div>
            <div style={{ fontSize: 12, color: p.textMid, marginBottom: 12, lineHeight: 1.6 }}>
              Parents each choose their preferred translation. This sets the default for new members.
            </div>
            <div className="translation-row">
              {translations.map(t => (
                <button key={t} className={`trans-btn ${translation === t ? "on" : ""}`}
                  onClick={() => setTranslation(t)}>{t}</button>
              ))}
            </div>

            {/* FEATURES */}
            <div className="sec-head">
              <span className="sec-title">Faith features</span>
            </div>
            <div className="feature-list">
              {features.map((f, i) => {
                const keys = ["anchor","prompts","virtue","filter"];
                const k = keys[i];
                return (
                  <div key={i} className="feature-row">
                    <div className="feature-icon" style={{ background: f.iconBg }}>{f.icon}</div>
                    <div className="feature-body">
                      <div className="feature-name">{f.name}</div>
                      <div className="feature-desc">{f.desc}</div>
                    </div>
                    <div className={`toggle ${toggles[k] ? "on" : "off"}`} onClick={() => tog(k)}>
                      <div className="toggle-knob" />
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="btn btn-gold">Save faith settings</button>
          </div>
        )}

        {/* CHAT PROMPT SHEET */}
        {promptOpen && (
          <div className="overlay" onClick={() => setPromptOpen(false)}>
            <div className="sheet" onClick={e => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.8, textTransform: "uppercase", color: p.gold, marginBottom: 14 }}>
                Chat opening prompt preview
              </div>
              <div className="prayer-card">
                <div className="prayer-label">Opening Prayer</div>
                <div className="prayer-text">
                  "Lord, thank you for the friends in this conversation. Help us to speak with kindness, listen with patience, and build each other up today. Amen."
                </div>
              </div>
              <div className="virtue-today">
                <div style={{ width: 38, height: 38, borderRadius: 12, background: `${p.virtue}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <HeartIcon size={20} color={p.virtue} />
                </div>
                <div>
                  <div className="vt-word">Encouragement</div>
                  <div className="vt-def">Building others up with words that give strength and hope.</div>
                </div>
              </div>
              <div className="sheet-actions">
                <button className="sht-btn sht-gold" onClick={() => setPromptOpen(false)}>Looks great</button>
                <button className="sht-btn sht-ghost" onClick={() => setPromptOpen(false)}>Dismiss</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
