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
  alert5: "#A03030",
  gold: "#B8953A",
  goldBg: "#FBF7EE",
  goldBorder: "#E8D8A8",
  virtue: "#7A6EA8",
};

const LEVELS = [
  {
    level: 1,
    name: "Full View",
    tagline: "Every message, every conversation",
    parentSees: "All messages in real time as they're sent and received.",
    childKnows: "Their messages are fully visible to you.",
    color: p.primary,
    suggestedAge: "Ages 5–10",
    icon: "eye-full",
  },
  {
    level: 2,
    name: "Monitored",
    tagline: "Full access, not real-time",
    parentSees: "All messages on demand — no live stream, but you can read everything.",
    childKnows: "Their messages can be reviewed at any time.",
    color: p.accent,
    suggestedAge: "Ages 11–12",
    icon: "eye-partial",
  },
  {
    level: 3,
    name: "Flagged Only",
    tagline: "Privacy unless something trips a flag",
    parentSees: "Only messages that trigger a content flag. Everything else is private.",
    childKnows: "Their conversations are private unless something is flagged.",
    color: p.gold,
    suggestedAge: "Ages 13–14",
    icon: "flag",
  },
  {
    level: 4,
    name: "Alerts Only",
    tagline: "No message content — notifications only",
    parentSees: "Flag notifications with no message content. You know something happened, not what was said.",
    childKnows: "Full privacy. You receive alerts only.",
    color: "#7A9090",
    suggestedAge: "Ages 15–16",
    icon: "bell",
  },
  {
    level: 5,
    name: "Independent",
    tagline: "Full independence with a safety net",
    parentSees: "Nothing — except Level 5 emergency alerts which are always on.",
    childKnows: "Complete privacy. Emergency safety alerts always remain active.",
    color: p.textMid,
    suggestedAge: "Ages 17+",
    icon: "shield-check",
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=Nunito:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .root {
    min-height: 100vh; background: ${p.background};
    font-family: 'Nunito', sans-serif; color: ${p.text};
    max-width: 420px; margin: 0 auto;
    display: flex; flex-direction: column;
  }

  .topbar {
    background: rgba(255,255,255,0.96); backdrop-filter: blur(14px);
    border-bottom: 1px solid ${p.border};
    padding: 13px 16px; display: flex; align-items: center;
    gap: 12px; position: sticky; top: 0; z-index: 50; flex-shrink: 0;
  }
  .back-btn {
    width: 34px; height: 34px; border-radius: 10px;
    border: 1.5px solid ${p.border}; background: ${p.white};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0;
  }
  .topbar-info { flex: 1; }
  .topbar-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: ${p.text}; }
  .topbar-sub { font-size: 11px; color: ${p.textMid}; font-weight: 600; }

  .child-switcher {
    display: flex; gap: 8px; padding: 14px 16px 6px;
  }
  .child-chip {
    display: flex; align-items: center; gap: 7px;
    padding: 7px 14px 7px 10px; border-radius: 20px;
    border: 1.5px solid ${p.border}; background: ${p.white};
    cursor: pointer; transition: all 0.15s; font-size: 13px; font-weight: 700;
    color: ${p.textMid};
  }
  .child-chip.on { border-color: ${p.primary}; background: ${p.primary}14; color: ${p.primaryDark}; }
  .child-avatar-sm {
    width: 22px; height: 22px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; color: white;
  }

  .body { padding: 14px 16px 60px; flex: 1; }

  /* CURRENT LEVEL HERO */
  .level-hero {
    border-radius: 22px; padding: 20px;
    margin-bottom: 20px; position: relative; overflow: hidden;
    border: 1.5px solid;
  }
  .hero-glow {
    position: absolute; top: -60px; right: -60px;
    width: 180px; height: 180px; border-radius: 50%;
    pointer-events: none;
  }
  .hero-eyebrow {
    font-size: 10px; font-weight: 700; letter-spacing: 1.8px;
    text-transform: uppercase; margin-bottom: 10px;
    display: flex; align-items: center; gap: 6px;
  }
  .hero-title {
    font-family: 'Fraunces', serif; font-size: 26px;
    font-weight: 600; margin-bottom: 4px;
  }
  .hero-tagline { font-size: 14px; margin-bottom: 14px; opacity: 0.8; }
  .hero-detail-row { display: flex; gap: 10px; }
  .hero-detail {
    flex: 1; border-radius: 13px; padding: 11px 13px;
    background: rgba(255,255,255,0.55);
    border: 1px solid rgba(255,255,255,0.7);
  }
  .hero-detail-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; margin-bottom: 5px; opacity: 0.7;
  }
  .hero-detail-text { font-size: 12px; line-height: 1.5; font-weight: 600; }

  /* LEVEL SELECTOR */
  .level-track {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 22px; overflow: hidden; margin-bottom: 20px;
  }
  .level-track-header {
    padding: 14px 16px 10px;
    border-bottom: 1px solid ${p.border};
    display: flex; justify-content: space-between; align-items: center;
  }
  .track-title { font-size: 13px; font-weight: 700; color: ${p.text}; }
  .track-note { font-size: 11px; color: ${p.textMid}; }

  .level-row {
    padding: 13px 16px; display: flex;
    align-items: center; gap: 12px; cursor: pointer;
    transition: background 0.15s; border-bottom: 1px solid ${p.border};
    position: relative;
  }
  .level-row:last-child { border-bottom: none; }
  .level-row:hover { background: ${p.surface}; }
  .level-row.active { background: ${p.surface}; }

  .level-indicator {
    width: 36px; height: 36px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 13px; font-weight: 700;
    border: 2px solid transparent; transition: all 0.15s;
  }
  .level-body { flex: 1; min-width: 0; }
  .level-name { font-size: 14px; font-weight: 700; color: ${p.text}; margin-bottom: 1px; }
  .level-desc { font-size: 11px; color: ${p.textMid}; line-height: 1.4; }
  .level-age {
    font-size: 10px; font-weight: 700; padding: 3px 8px;
    border-radius: 8px; background: ${p.surface};
    color: ${p.textMid}; flex-shrink: 0; letter-spacing: 0.3px;
    border: 1px solid ${p.border};
  }
  .level-check {
    width: 20px; height: 20px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.15s;
  }

  /* ALWAYS ON BANNER */
  .always-on {
    background: ${p.alert5}08; border: 1.5px solid ${p.alert5}28;
    border-radius: 16px; padding: 14px 16px;
    display: flex; gap: 12px; align-items: flex-start;
    margin-bottom: 20px;
  }
  .ao-icon {
    width: 36px; height: 36px; border-radius: 11px;
    background: ${p.alert5}12;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ao-title { font-size: 13px; font-weight: 700; color: ${p.alert5}; margin-bottom: 3px; }
  .ao-text { font-size: 12px; color: ${p.textMid}; line-height: 1.55; }

  /* PARENT NOTE */
  .parent-note-card {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 18px; overflow: hidden; margin-bottom: 20px;
  }
  .pn-header {
    padding: 13px 16px; border-bottom: 1px solid ${p.border};
    display: flex; justify-content: space-between; align-items: center;
  }
  .pn-title { font-size: 13px; font-weight: 700; color: ${p.text}; }
  .pn-edit { font-size: 12px; font-weight: 700; color: ${p.accent}; cursor: pointer; }
  .pn-body { padding: 14px 16px; }
  .pn-text {
    font-size: 13px; color: ${p.textMid}; line-height: 1.65;
    font-style: italic;
  }
  .pn-empty { font-size: 13px; color: ${p.sand}; }

  /* AUTO ADVANCE */
  .auto-card {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 18px; overflow: hidden; margin-bottom: 20px;
  }
  .auto-row {
    padding: 13px 16px; display: flex;
    align-items: center; gap: 12px; border-bottom: 1px solid ${p.border};
  }
  .auto-row:last-child { border-bottom: none; }
  .auto-label { font-size: 13px; font-weight: 700; color: ${p.text}; flex: 1; }
  .auto-sub { font-size: 11px; color: ${p.textMid}; margin-top: 2px; }
  .toggle {
    width: 42px; height: 24px; border-radius: 12px; position: relative;
    cursor: pointer; flex-shrink: 0; transition: background 0.2s;
  }
  .toggle.on { background: ${p.primary}; }
  .toggle.off { background: ${p.border}; }
  .toggle-knob {
    position: absolute; top: 3px; width: 18px; height: 18px;
    border-radius: 9px; background: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: left 0.2s;
  }
  .toggle.on .toggle-knob { left: 21px; }
  .toggle.off .toggle-knob { left: 3px; }

  /* KID VIEW PREVIEW */
  .kid-preview {
    background: linear-gradient(135deg, ${p.surface}, ${p.white});
    border: 1.5px solid ${p.border}; border-radius: 18px;
    padding: 16px; margin-bottom: 20px;
  }
  .kp-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: ${p.textMid}; margin-bottom: 12px;
  }
  .kp-card {
    background: ${p.white}; border-radius: 14px;
    padding: 14px; border: 1.5px solid ${p.border};
  }
  .kp-level-row {
    display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
  }
  .kp-dot {
    width: 10px; height: 10px; border-radius: 5px; flex-shrink: 0;
  }
  .kp-level-name { font-size: 14px; font-weight: 700; color: ${p.text}; }
  .kp-desc { font-size: 12px; color: ${p.textMid}; line-height: 1.55; margin-bottom: 10px; }
  .kp-progress {
    height: 5px; background: ${p.border}; border-radius: 3px; overflow: hidden;
  }
  .kp-progress-fill { height: 5px; border-radius: 3px; transition: width 0.5s; }
  .kp-progress-label {
    display: flex; justify-content: space-between;
    margin-top: 5px; font-size: 10px; font-weight: 700; color: ${p.sand};
  }
  .kp-note {
    margin-top: 10px; padding: 10px 12px;
    background: ${p.surface}; border-radius: 10px;
    font-size: 12px; color: ${p.textMid}; line-height: 1.55;
    border-left: 3px solid ${p.primary};
    font-style: italic;
  }

  /* SAVE BTN */
  .save-btn {
    width: 100%; padding: 14px; border: none; border-radius: 15px;
    background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark});
    color: white; font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 700; cursor: pointer;
    box-shadow: 0 4px 18px ${p.primary}44; transition: all 0.18s;
  }
  .save-btn:hover { box-shadow: 0 6px 22px ${p.primary}55; transform: translateY(-1px); }

  /* SHEET */
  .overlay {
    position: fixed; inset: 0; background: rgba(35,37,53,0.44);
    backdrop-filter: blur(6px); z-index: 100;
    display: flex; align-items: flex-end; justify-content: center;
  }
  .sheet {
    background: ${p.white}; border-radius: 24px 24px 0 0;
    width: 100%; max-width: 420px; padding: 20px 22px 44px;
    animation: slideUp 0.28s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .sheet-handle { width: 34px; height: 4px; border-radius: 2px; background: ${p.border}; margin: 0 auto 20px; }
  .sheet-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; color: ${p.text}; margin-bottom: 8px; }
  .sheet-sub { font-size: 13px; color: ${p.textMid}; line-height: 1.65; margin-bottom: 14px; }
  .note-input {
    width: 100%; padding: 12px 14px; border-radius: 13px;
    border: 1.5px solid ${p.border}; font-family: 'Nunito', sans-serif;
    font-size: 14px; color: ${p.text}; outline: none; resize: none;
    background: ${p.surface}; margin-bottom: 14px; line-height: 1.5; min-height: 100px;
    transition: border-color 0.2s;
  }
  .note-input:focus { border-color: ${p.primary}; }
  .sht-btn {
    width: 100%; padding: 13px; border-radius: 13px; border: none;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; margin-bottom: 9px; transition: all 0.15s;
  }
  .sht-primary { background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark}); color: white; box-shadow: 0 4px 14px ${p.primary}44; }
  .sht-ghost { background: ${p.surface}; color: ${p.textMid}; }

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
  EyeFull: ({ color }) => <Ico color={color} ch={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>} />,
  EyeOff: ({ color }) => <Ico color={color} ch={<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>} />,
  Flag: ({ color }) => <Ico color={color} ch={<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>} />,
  Bell: ({ color }) => <Ico color={color} ch={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>} />,
  ShieldCheck: ({ color }) => <Ico color={color} ch={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10" strokeWidth="2"/></>} />,
  Check: ({ color = "white", size = 11 }) => <Ico color={color} size={size} ch={<polyline points="20,6 9,17 4,12" strokeWidth="2.5"/>} />,
  Emergency: ({ color = p.alert5 }) => <Ico color={color} ch={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="9" x2="12" y2="13" strokeWidth="2"/><circle cx="12" cy="16.5" r="0.5" fill={color} strokeWidth="2"/></>} />,
  Child: ({ color }) => <Ico color={color} ch={<><circle cx="12" cy="6" r="3.5"/><path d="M5 21v-1a7 7 0 0 1 14 0v1"/></>} />,
  Note: ({ color }) => <Ico color={color} ch={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></>} />,
};

const levelIcon = (iconName, color, size = 18) => {
  if (iconName === "eye-full") return <Icons.EyeFull color={color} />;
  if (iconName === "eye-partial") return <Icons.EyeFull color={color} />;
  if (iconName === "flag") return <Icons.Flag color={color} />;
  if (iconName === "bell") return <Icons.Bell color={color} />;
  if (iconName === "shield-check") return <Icons.ShieldCheck color={color} />;
};

const children = [
  { id: "olivia", name: "Olivia", age: 10, grade: "Grade 4", initials: "OL", color: p.primary, currentLevel: 1 },
  { id: "liam", name: "Liam", age: 8, grade: "Grade 2", initials: "LM", color: p.accent, currentLevel: 1 },
];

const KID_VIEW_DESCRIPTIONS = [
  "Your parent keeps you safe by reading your messages. This helps them guide you and make sure you're okay.",
  "Your parent can review your conversations if needed. They want to make sure you're doing well.",
  "Your conversations are private. Your parent only sees messages that get flagged by the app.",
  "Your parent receives safety notifications but doesn't read your messages.",
  "You have full independence. Emergency safety alerts are always quietly active to keep you safe.",
];

export default function TrustLevel() {
  const [activeChild, setActiveChild] = useState("olivia");
  const [levels, setLevels] = useState({ olivia: 1, liam: 1 });
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [showNoteSheet, setShowNoteSheet] = useState(false);
  const [notes, setNotes] = useState({
    olivia: "When you've gone 90 days without a flag, I'll move you to Level 2.",
    liam: "",
  });
  const [noteText, setNoteText] = useState("");

  const child = children.find(c => c.id === activeChild);
  const currentLevelNum = levels[activeChild];
  const currentLevel = LEVELS[currentLevelNum - 1];

  const heroStyle = {
    background: `linear-gradient(135deg, ${currentLevel.color}22, ${currentLevel.color}0A)`,
    borderColor: `${currentLevel.color}44`,
  };

  const progressPct = ((currentLevelNum - 1) / 4) * 100;

  return (
    <>
      <style>{styles}</style>
      <div className="root">

        {/* TOPBAR */}
        <div className="topbar">
          <div className="back-btn"><Icons.Back /></div>
          <div className="topbar-info">
            <div className="topbar-title">Trust Level</div>
            <div className="topbar-sub">Controls how much you see</div>
          </div>
        </div>

        {/* CHILD SWITCHER */}
        <div className="child-switcher">
          {children.map(c => (
            <div key={c.id}
              className={`child-chip ${activeChild === c.id ? "on" : ""}`}
              onClick={() => setActiveChild(c.id)}>
              <div className="child-avatar-sm" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}BB)` }}>
                {c.initials}
              </div>
              {c.name}
            </div>
          ))}
        </div>

        <div className="body in" key={activeChild}>

          {/* HERO CARD */}
          <div className="level-hero" style={heroStyle}>
            <div className="hero-glow" style={{ background: `radial-gradient(circle, ${currentLevel.color}30 0%, transparent 70%)` }} />
            <div className="hero-eyebrow" style={{ color: currentLevel.color }}>
              {levelIcon(currentLevel.icon, currentLevel.color, 14)}
              Current level — {child.name}
            </div>
            <div className="hero-title" style={{ color: p.text }}>
              Level {currentLevelNum} — {currentLevel.name}
            </div>
            <div className="hero-tagline" style={{ color: p.textMid }}>{currentLevel.tagline}</div>
            <div className="hero-detail-row">
              <div className="hero-detail">
                <div className="hero-detail-label" style={{ color: currentLevel.color }}>You see</div>
                <div className="hero-detail-text">{currentLevel.parentSees}</div>
              </div>
              <div className="hero-detail">
                <div className="hero-detail-label" style={{ color: currentLevel.color }}>Child knows</div>
                <div className="hero-detail-text">{currentLevel.childKnows}</div>
              </div>
            </div>
          </div>

          {/* ALWAYS ON */}
          <div className="always-on">
            <div className="ao-icon"><Icons.Emergency /></div>
            <div>
              <div className="ao-title">Level 5 emergency alerts — always on</div>
              <div className="ao-text">
                Regardless of trust level, self-harm language, exploitation signals, and predatory contact always trigger an immediate SMS to your phone. This cannot be turned off at any trust level.
              </div>
            </div>
          </div>

          {/* LEVEL SELECTOR */}
          <div style={{ fontSize: 13, fontWeight: 700, color: p.text, marginBottom: 10 }}>
            Change trust level
          </div>
          <div className="level-track">
            <div className="level-track-header">
              <span className="track-title">Select a level for {child.name}</span>
              <span className="track-note">Age {child.age} · {child.grade}</span>
            </div>
            {LEVELS.map(lv => {
              const isActive = levels[activeChild] === lv.level;
              return (
                <div key={lv.level}
                  className={`level-row ${isActive ? "active" : ""}`}
                  onClick={() => setLevels(l => ({ ...l, [activeChild]: lv.level }))}>
                  <div className="level-indicator"
                    style={{
                      background: isActive ? `${lv.color}18` : p.surface,
                      borderColor: isActive ? `${lv.color}44` : "transparent",
                    }}>
                    {levelIcon(lv.icon, isActive ? lv.color : p.sand)}
                  </div>
                  <div className="level-body">
                    <div className="level-name">
                      Level {lv.level} — {lv.name}
                    </div>
                    <div className="level-desc">{lv.tagline}</div>
                  </div>
                  <div className="level-age">{lv.suggestedAge}</div>
                  <div className="level-check"
                    style={{
                      background: isActive ? lv.color : p.border,
                      border: `2px solid ${isActive ? lv.color : p.border}`,
                      borderRadius: 10,
                    }}>
                    {isActive && <Icons.Check color="white" size={11} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AUTO ADVANCE */}
          <div className="auto-card">
            <div className="auto-row">
              <div style={{ flex: 1 }}>
                <div className="auto-label">Auto-advance by age</div>
                <div className="auto-sub">Automatically apply suggested level as {child.name} gets older</div>
              </div>
              <div className={`toggle ${autoAdvance ? "on" : "off"}`} onClick={() => setAutoAdvance(v => !v)}>
                <div className="toggle-knob" />
              </div>
            </div>
            {autoAdvance && (
              <div className="auto-row" style={{ background: p.surface }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: p.textMid, lineHeight: 1.55 }}>
                    Next: <strong>Level 2 — Monitored</strong> at age 11. You'll be notified before any auto-advance happens and can approve or override it.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PARENT NOTE FOR CHILD */}
          <div className="parent-note-card">
            <div className="pn-header">
              <div className="pn-title">
                <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <Icons.Note color={p.accent} />
                  Note to {child.name}
                </span>
              </div>
              <div className="pn-edit" onClick={() => { setNoteText(notes[activeChild] || ""); setShowNoteSheet(true); }}>
                {notes[activeChild] ? "Edit" : "Add"}
              </div>
            </div>
            <div className="pn-body">
              {notes[activeChild]
                ? <div className="pn-text">"{notes[activeChild]}"</div>
                : <div className="pn-empty">Add a note to help {child.name} understand how to earn the next level.</div>
              }
            </div>
          </div>

          {/* KID VIEW PREVIEW */}
          <div className="kid-preview">
            <div className="kp-label">What {child.name} sees in their app</div>
            <div className="kp-card">
              <div className="kp-level-row">
                <div className="kp-dot" style={{ background: currentLevel.color }} />
                <div className="kp-level-name">Level {currentLevelNum} — {currentLevel.name}</div>
              </div>
              <div className="kp-desc">{KID_VIEW_DESCRIPTIONS[currentLevelNum - 1]}</div>
              <div className="kp-progress">
                <div className="kp-progress-fill" style={{ width:`${progressPct}%`, background: currentLevel.color }} />
              </div>
              <div className="kp-progress-label">
                <span>Level 1</span>
                <span>Level 5 — Independent</span>
              </div>
              {notes[activeChild] && (
                <div className="kp-note">
                  From your parent: "{notes[activeChild]}"
                </div>
              )}
            </div>
          </div>

          <button className="save-btn">Save trust settings</button>
        </div>

        {/* NOTE SHEET */}
        {showNoteSheet && (
          <div className="overlay" onClick={() => setShowNoteSheet(false)}>
            <div className="sheet" onClick={e => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-title">Note to {child.name}</div>
              <p className="sheet-sub">
                This note appears in {child.name}'s app next to their trust level. Use it to explain what earning the next level looks like — make it a goal, not a rule.
              </p>
              <textarea
                className="note-input"
                placeholder={`e.g. "When you've gone 90 days without a flag, I'll move you to Level 2."`}
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
              />
              <button className="sht-btn sht-primary" onClick={() => {
                setNotes(n => ({ ...n, [activeChild]: noteText.trim() }));
                setShowNoteSheet(false);
              }}>Save note</button>
              <button className="sht-btn sht-ghost" onClick={() => setShowNoteSheet(false)}>Cancel</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
