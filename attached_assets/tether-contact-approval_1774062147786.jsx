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
  goldBg: "#FBF7EE",
  goldBorder: "#E8D8A8",
  virtue: "#7A6EA8",
};

// The four stages of the contact approval flow
const STAGES = ["requests", "review", "introduce", "connected"];

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
    gap: 11px; position: sticky; top: 0; z-index: 50; flex-shrink: 0;
  }
  .back-btn {
    width: 34px; height: 34px; border-radius: 10px;
    border: 1.5px solid ${p.border}; background: ${p.white};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; transition: background 0.15s;
  }
  .back-btn:hover { background: ${p.surface}; }
  .topbar-info { flex: 1; }
  .topbar-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: ${p.text}; }
  .topbar-sub { font-size: 11px; color: ${p.textMid}; font-weight: 600; }
  .topbar-badge {
    background: ${p.alert4}; color: white; border-radius: 10px;
    padding: 4px 10px; font-size: 11px; font-weight: 700;
  }

  .body { padding: 16px 16px 60px; flex: 1; }

  /* ── STAGE INDICATOR ── */
  .stage-track {
    display: flex; align-items: center;
    margin-bottom: 20px; padding: 0 4px;
  }
  .stage-step {
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    flex: 1;
  }
  .stage-dot {
    width: 28px; height: 28px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; transition: all 0.3s;
  }
  .stage-dot.done { background: ${p.primary}; color: white; }
  .stage-dot.active { background: ${p.primary}18; border: 2px solid ${p.primary}; color: ${p.primaryDark}; }
  .stage-dot.pending { background: ${p.surface}; border: 2px solid ${p.border}; color: ${p.sand}; }
  .stage-label { font-size: 10px; font-weight: 700; letter-spacing: 0.3px; text-align: center; }
  .stage-label.done { color: ${p.primary}; }
  .stage-label.active { color: ${p.primaryDark}; }
  .stage-label.pending { color: ${p.sand}; }
  .stage-line { flex: 1; height: 2px; background: ${p.border}; margin: 0 4px; margin-bottom: 16px; transition: background 0.3s; }
  .stage-line.done { background: ${p.primary}; }

  /* ── REQUEST CARDS ── */
  .request-card {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 20px; margin-bottom: 12px; overflow: hidden;
    transition: all 0.18s;
  }
  .request-card:hover { box-shadow: 0 4px 16px rgba(35,37,53,0.08); }
  .rc-header {
    padding: 16px 16px 12px;
    display: flex; gap: 12px; align-items: flex-start;
  }
  .kids-avatars { display: flex; flex-shrink: 0; }
  .kid-av {
    width: 40px; height: 40px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: white; border: 2px solid white;
  }
  .kid-av-2 { margin-left: -10px; }
  .rc-info { flex: 1; }
  .rc-names { font-size: 15px; font-weight: 700; color: ${p.text}; margin-bottom: 2px; }
  .rc-meta { font-size: 12px; color: ${p.textMid}; line-height: 1.4; }
  .rc-time { font-size: 11px; color: ${p.sand}; font-weight: 600; flex-shrink: 0; }

  .rc-context {
    margin: 0 16px 14px;
    background: ${p.surface}; border-radius: 12px; padding: 10px 13px;
    font-size: 12px; color: ${p.textMid}; line-height: 1.55;
    display: flex; gap: 8px; align-items: flex-start;
  }

  .rc-actions {
    display: flex; gap: 8px; padding: 12px 16px;
    border-top: 1px solid ${p.border}; background: ${p.surface}50;
  }
  .rc-btn {
    flex: 1; padding: 10px; border-radius: 12px;
    font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.15s; border: none;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .rc-approve { background: ${p.primary}; color: white; box-shadow: 0 3px 10px ${p.primary}44; }
  .rc-approve:hover { background: ${p.primaryDark}; }
  .rc-review { background: ${p.white}; color: ${p.text}; border: 1.5px solid ${p.border}; }
  .rc-review:hover { background: ${p.surface}; }
  .rc-decline { background: ${p.white}; color: ${p.alert4}; border: 1.5px solid ${p.alert4}28; }
  .rc-decline:hover { background: ${p.alert4}08; }

  /* ── REVIEW DETAIL ── */
  .review-screen { display: flex; flex-direction: column; gap: 14px; }

  .connection-visual {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 20px; padding: 20px;
    display: flex; align-items: center; gap: 0;
  }
  .cv-side {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .cv-avatar {
    width: 56px; height: 56px; border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 700; color: white;
    box-shadow: 0 4px 14px rgba(35,37,53,0.15);
  }
  .cv-name { font-size: 15px; font-weight: 700; color: ${p.text}; }
  .cv-sub { font-size: 11px; color: ${p.textMid}; font-weight: 600; }
  .cv-connector {
    display: flex; flex-direction: column; align-items: center;
    gap: 4px; padding: 0 10px; flex-shrink: 0;
  }
  .cv-line { width: 2px; height: 18px; background: ${p.border}; border-radius: 1px; }
  .cv-icon {
    width: 32px; height: 32px; border-radius: 10px;
    background: ${p.surface}; border: 1.5px solid ${p.border};
    display: flex; align-items: center; justify-content: center;
  }
  .cv-line-h { height: 2px; width: 100%; background: ${p.border}; margin: 8px 0; }

  .info-card {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 18px; overflow: hidden;
  }
  .ic-header {
    padding: 12px 16px; border-bottom: 1px solid ${p.border};
    font-size: 12px; font-weight: 700; color: ${p.textMid};
    letter-spacing: 0.5px; text-transform: uppercase;
    display: flex; align-items: center; gap: 6px;
  }
  .ic-row {
    padding: 12px 16px; display: flex; gap: 12px;
    align-items: flex-start; border-bottom: 1px solid ${p.border};
  }
  .ic-row:last-child { border-bottom: none; }
  .ic-icon-wrap {
    width: 32px; height: 32px; border-radius: 9px;
    background: ${p.surface}; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0;
  }
  .ic-label { font-size: 11px; font-weight: 700; color: ${p.textMid}; margin-bottom: 2px; }
  .ic-value { font-size: 14px; font-weight: 600; color: ${p.text}; }

  .cohort-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: ${p.primary}12; border: 1px solid ${p.primary}30;
    border-radius: 20px; padding: 5px 12px;
    font-size: 12px; font-weight: 700; color: ${p.primaryDark};
  }

  .action-footer {
    position: sticky; bottom: 0;
    background: rgba(255,255,255,0.96); backdrop-filter: blur(14px);
    border-top: 1px solid ${p.border};
    padding: 12px 16px 28px;
    display: flex; flex-direction: column; gap: 9px;
  }
  .af-btn {
    width: 100%; padding: 14px; border-radius: 14px; border: none;
    font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.18s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .af-primary { background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark}); color: white; box-shadow: 0 4px 16px ${p.primary}44; }
  .af-primary:hover { box-shadow: 0 6px 20px ${p.primary}55; transform: translateY(-1px); }
  .af-ghost { background: ${p.surface}; color: ${p.textMid}; }
  .af-danger { background: ${p.alert4}0C; color: ${p.alert4}; border: 1.5px solid ${p.alert4}28; }

  /* ── INTRODUCE STAGE ── */
  .intro-stage { display: flex; flex-direction: column; gap: 14px; }

  .intro-hero {
    background: ${p.primary}0C; border: 1.5px solid ${p.primary}28;
    border-radius: 20px; padding: 18px;
    text-align: center;
  }
  .ih-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 600; color: ${p.text}; margin-bottom: 6px; }
  .ih-title em { font-style: italic; color: ${p.primary}; }
  .ih-sub { font-size: 13px; color: ${p.textMid}; line-height: 1.6; }

  .intro-msg-card {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 18px; overflow: hidden;
  }
  .imc-header { padding: 12px 16px; border-bottom: 1px solid ${p.border}; display: flex; justify-content: space-between; align-items: center; }
  .imc-label { font-size: 12px; font-weight: 700; color: ${p.textMid}; text-transform: uppercase; letter-spacing: 0.5px; }
  .imc-edit { font-size: 12px; font-weight: 700; color: ${p.accent}; cursor: pointer; }
  .imc-body { padding: 14px 16px; }
  .imc-text {
    width: 100%; border: none; background: transparent; resize: none;
    font-family: 'Nunito', sans-serif; font-size: 14px; color: ${p.text};
    line-height: 1.65; outline: none; min-height: 80px;
  }

  .parent-b-preview {
    background: ${p.surface}; border: 1.5px solid ${p.border};
    border-radius: 18px; padding: 16px;
  }
  .pbp-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${p.textMid}; margin-bottom: 12px; }
  .pbp-card {
    background: ${p.white}; border-radius: 14px; padding: 14px;
    border: 1.5px solid ${p.border};
  }
  .pbp-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .pbp-av {
    width: 38px; height: 38px; border-radius: 12px;
    background: linear-gradient(135deg, ${p.accent}, ${p.accentDark});
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: white;
  }
  .pbp-name { font-size: 14px; font-weight: 700; color: ${p.text}; }
  .pbp-from { font-size: 11px; color: ${p.textMid}; }
  .pbp-msg { font-size: 13px; color: ${p.textMid}; line-height: 1.6; font-style: italic; }

  /* ── CONNECTED ── */
  .connected-screen { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 16px 0; }
  .success-ring {
    width: 80px; height: 80px; border-radius: 50%;
    background: ${p.primary}14; border: 2px solid ${p.primary}44;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
    animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes popIn { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .success-title { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 600; color: ${p.text}; margin-bottom: 8px; }
  .success-title em { font-style: italic; color: ${p.primary}; }
  .success-sub { font-size: 14px; color: ${p.textMid}; line-height: 1.65; max-width: 300px; margin-bottom: 24px; }

  .connected-pair {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 20px; padding: 18px; width: 100%; margin-bottom: 16px;
    display: flex; align-items: center; gap: 14px;
  }
  .cp-kids { display: flex; flex-shrink: 0; }
  .cp-kid {
    width: 44px; height: 44px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: white; border: 2.5px solid white;
  }
  .cp-kid-2 { margin-left: -12px; }
  .cp-info { flex: 1; }
  .cp-names { font-size: 15px; font-weight: 700; color: ${p.text}; margin-bottom: 3px; }
  .cp-meta { font-size: 12px; color: ${p.textMid}; }

  .parent-pair {
    background: ${p.primary}08; border: 1.5px solid ${p.primary}28;
    border-radius: 16px; padding: 14px 16px; width: 100%;
    margin-bottom: 20px; display: flex; gap: 10px; align-items: center;
  }
  .pp-text { font-size: 13px; color: ${p.primaryDark}; line-height: 1.5; font-weight: 600; }

  .full-btn {
    width: 100%; padding: 14px; border-radius: 15px; border: none;
    font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.18s; margin-bottom: 10px;
  }
  .full-primary { background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark}); color: white; box-shadow: 0 4px 16px ${p.primary}44; }
  .full-ghost { background: ${p.surface}; color: ${p.textMid}; }

  /* EMPTY STATE */
  .empty-state {
    text-align: center; padding: 40px 20px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .empty-icon {
    width: 60px; height: 60px; border-radius: 20px;
    background: ${p.surface}; border: 1.5px solid ${p.border};
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .empty-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: ${p.text}; }
  .empty-sub { font-size: 13px; color: ${p.textMid}; line-height: 1.6; max-width: 260px; }

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
  Check: ({ color = "white", size = 14 }) => <Ico color={color} size={size} ch={<polyline points="20,6 9,17 4,12" strokeWidth="2.5" />} />,
  X: ({ color = p.alert4, size = 14 }) => <Ico color={color} size={size} ch={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} />,
  Users: ({ color = p.primary }) => <Ico color={color} ch={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>} />,
  Shield: ({ color = p.primary, size = 18 }) => <Ico color={color} size={size} ch={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9,12 11,14 15,10" strokeWidth="2" /></>} />,
  School: ({ color = p.textMid }) => <Ico color={color} ch={<><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>} />,
  Phone: ({ color = p.textMid }) => <Ico color={color} ch={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />} />,
  Mail: ({ color = p.textMid }) => <Ico color={color} ch={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>} />,
  Child: ({ color = p.textMid }) => <Ico color={color} ch={<><circle cx="12" cy="6" r="3.5" /><path d="M5 21v-1a7 7 0 0 1 14 0v1" /></>} />,
  Message: ({ color = p.primary }) => <Ico color={color} ch={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />} />,
  Link: ({ color = p.primary }) => <Ico color={color} ch={<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>} />,
  Bell: ({ color = p.primary }) => <Ico color={color} ch={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>} />,
};

const TetherMark = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" fill={p.primary} />
    <line x1="12" y1="2" x2="12" y2="9" stroke={p.primary} strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="15" x2="12" y2="22" stroke={p.primary} strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="12" x2="9" y2="12" stroke={p.primary} strokeWidth="2" strokeLinecap="round" />
    <line x1="15" y1="12" x2="22" y2="12" stroke={p.primary} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const REQUESTS = [
  {
    id: 1,
    childA: { name: "Olivia", initials: "OL", color: p.primary, parent: "Cliff J.", grade: "Grade 4" },
    childB: { name: "Emma K.", initials: "EK", color: p.accent, parent: "Sarah K.", grade: "Grade 4" },
    cohort: "Grace Academy · Grade 4",
    requestedAt: "2 hours ago",
    context: "Emma sent Olivia a friend request after school. Both are in the Grade 4 cohort.",
    parentB: {
      name: "Sarah K.",
      initials: "SK",
      phone: "(555) 412-8830",
      email: "sarah.k@family.com",
      child: "Emma K., Age 10",
      cohort: "Grace Academy · Grade 4",
      memberSince: "Member since Sep 2024",
    },
  },
];

const DEFAULT_INTRO = `Hi Sarah! I'm Cliff, Olivia's dad. Emma and Olivia seem to have hit it off — I'd love to connect. I'm happy to approve the girls chatting on Tether. Feel free to reach out anytime.`;

export default function ContactApproval() {
  const [stage, setStage] = useState("requests");
  const [selected, setSelected] = useState(null);
  const [introMsg, setIntroMsg] = useState(DEFAULT_INTRO);
  const [declined, setDeclined] = useState(false);

  const req = REQUESTS[0];

  const stageIndex = STAGES.indexOf(stage);

  const stageStatus = (s) => {
    const idx = STAGES.indexOf(s);
    if (idx < stageIndex) return "done";
    if (idx === stageIndex) return "active";
    return "pending";
  };

  const stageLabels = ["Requests", "Review", "Introduce", "Connected"];

  return (
    <>
      <style>{styles}</style>
      <div className="root">

        {/* TOPBAR */}
        <div className="topbar">
          <div className="back-btn" onClick={() => {
            if (stage !== "requests") {
              setStage(STAGES[STAGES.indexOf(stage) - 1]);
            }
          }}><Icons.Back /></div>
          <div className="topbar-info">
            <div className="topbar-title">Contact Requests</div>
            <div className="topbar-sub">Parent approval required before kids connect</div>
          </div>
          {stage === "requests" && <div className="topbar-badge">1 pending</div>}
        </div>

        <div className="body">

          {/* STAGE TRACK — shown after requests stage */}
          {stage !== "requests" && (
            <div className="stage-track">
              {STAGES.filter(s => s !== "requests").map((s, i, arr) => (
                <>
                  <div key={s} className="stage-step">
                    <div className={`stage-dot ${stageStatus(s)}`}>
                      {stageStatus(s) === "done" ? <Icons.Check color="white" size={12} /> : i + 1}
                    </div>
                    <div className={`stage-label ${stageStatus(s)}`}>{stageLabels[i + 1]}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div key={`line-${i}`} className={`stage-line ${stageStatus(arr[i + 1]) !== "pending" || stageStatus(s) === "done" ? "done" : ""}`} />
                  )}
                </>
              ))}
            </div>
          )}

          {/* ── STAGE: REQUESTS ── */}
          {stage === "requests" && (
            <div className="in" key="requests">
              {declined ? (
                <div className="empty-state">
                  <div className="empty-icon"><Icons.Check color={p.primary} size={28} /></div>
                  <div className="empty-title">All caught up</div>
                  <div className="empty-sub">No pending contact requests. When a child requests to connect with Olivia or Liam, it will appear here first.</div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 13, color: p.textMid, lineHeight: 1.6, marginBottom: 16, background: p.primary + "0C", border: `1px solid ${p.primary}28`, borderRadius: 14, padding: "11px 14px", display: "flex", gap: 8 }}>
                    <TetherMark />
                    <span>Before kids can chat, both parents must approve the connection and introduce themselves to each other.</span>
                  </div>

                  <div className="request-card">
                    <div className="rc-header">
                      <div className="kids-avatars">
                        <div className="kid-av" style={{ background: `linear-gradient(135deg, ${req.childA.color}, ${req.childA.color}BB)` }}>{req.childA.initials}</div>
                        <div className="kid-av kid-av-2" style={{ background: `linear-gradient(135deg, ${req.childB.color}, ${req.childB.color}BB)` }}>{req.childB.initials}</div>
                      </div>
                      <div className="rc-info">
                        <div className="rc-names">{req.childA.name} + {req.childB.name}</div>
                        <div className="rc-meta">{req.cohort}</div>
                      </div>
                      <div className="rc-time">{req.requestedAt}</div>
                    </div>

                    <div className="rc-context">
                      <Icons.School color={p.textMid} />
                      <span>{req.context}</span>
                    </div>

                    <div className="rc-actions">
                      <button className="rc-btn rc-review" onClick={() => { setSelected(req); setStage("review"); }}>
                        <Icons.Users color={p.text} />
                        Review
                      </button>
                      <button className="rc-btn rc-approve" onClick={() => { setSelected(req); setStage("introduce"); }}>
                        <Icons.Check color="white" size={13} />
                        Approve
                      </button>
                      <button className="rc-btn rc-decline" onClick={() => setDeclined(true)}>
                        <Icons.X color={p.alert4} size={13} />
                        Decline
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── STAGE: REVIEW ── */}
          {stage === "review" && selected && (
            <div className="review-screen in" key="review">

              {/* CONNECTION VISUAL */}
              <div className="connection-visual">
                <div className="cv-side">
                  <div className="cv-avatar" style={{ background: `linear-gradient(135deg, ${p.primary}, ${p.primaryDark})` }}>OL</div>
                  <div className="cv-name">Olivia</div>
                  <div className="cv-sub">Your child · Grade 4</div>
                </div>
                <div className="cv-connector">
                  <div className="cv-line" />
                  <div className="cv-icon"><Icons.Link color={p.textMid} /></div>
                  <div className="cv-line" />
                </div>
                <div className="cv-side">
                  <div className="cv-avatar" style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accentDark})` }}>EK</div>
                  <div className="cv-name">Emma K.</div>
                  <div className="cv-sub">Grade 4 · Cohort</div>
                </div>
              </div>

              {/* PARENT B INFO */}
              <div className="info-card">
                <div className="ic-header">
                  <Icons.Users color={p.textMid} />
                  Emma's parent — Sarah K.
                </div>
                <div className="ic-row">
                  <div className="ic-icon-wrap"><Icons.Child color={p.textMid} /></div>
                  <div>
                    <div className="ic-label">Child</div>
                    <div className="ic-value">{selected.parentB.child}</div>
                  </div>
                </div>
                <div className="ic-row">
                  <div className="ic-icon-wrap"><Icons.School color={p.textMid} /></div>
                  <div>
                    <div className="ic-label">Community</div>
                    <div className="ic-value">
                      <span className="cohort-badge"><TetherMark />{selected.parentB.cohort}</span>
                    </div>
                  </div>
                </div>
                <div className="ic-row">
                  <div className="ic-icon-wrap"><Icons.Phone color={p.textMid} /></div>
                  <div>
                    <div className="ic-label">Phone</div>
                    <div className="ic-value">{selected.parentB.phone}</div>
                  </div>
                </div>
                <div className="ic-row">
                  <div className="ic-icon-wrap"><Icons.Mail color={p.textMid} /></div>
                  <div>
                    <div className="ic-label">Email</div>
                    <div className="ic-value">{selected.parentB.email}</div>
                  </div>
                </div>
                <div className="ic-row">
                  <div className="ic-icon-wrap"><Icons.Shield color={p.primary} /></div>
                  <div>
                    <div className="ic-label">Tether status</div>
                    <div className="ic-value" style={{ color: p.primaryDark }}>{selected.parentB.memberSince} · Verified</div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: p.textMid, lineHeight: 1.6, padding: "0 2px" }}>
                This information is shared with you because Sarah approved the contact request from her side. Your contact details are visible to Sarah in the same way.
              </div>
            </div>
          )}

          {/* ── STAGE: INTRODUCE ── */}
          {stage === "introduce" && (
            <div className="intro-stage in" key="introduce">
              <div className="intro-hero">
                <div className="ih-title">Introduce <em>yourself</em></div>
                <div className="ih-sub">
                  A short message goes to Sarah K. along with your contact info. Once she receives it, both kids are connected and you two are connected as parents.
                </div>
              </div>

              <div className="intro-msg-card">
                <div className="imc-header">
                  <span className="imc-label">Your intro message</span>
                  <span className="imc-edit">Reset</span>
                </div>
                <div className="imc-body">
                  <textarea
                    className="imc-text"
                    value={introMsg}
                    onChange={e => setIntroMsg(e.target.value)}
                  />
                </div>
              </div>

              <div className="parent-b-preview">
                <div className="pbp-label">Preview — what Sarah receives</div>
                <div className="pbp-card">
                  <div className="pbp-header">
                    <div className="pbp-av">CJ</div>
                    <div>
                      <div className="pbp-name">Cliff J.</div>
                      <div className="pbp-from">Olivia's parent · Grace Academy Grade 4</div>
                    </div>
                  </div>
                  <div className="pbp-msg">"{introMsg}"</div>
                </div>
              </div>

              <div style={{ background: p.surface, border: `1.5px solid ${p.border}`, borderRadius: 14, padding: "12px 14px", fontSize: 12, color: p.textMid, lineHeight: 1.6 }}>
                Along with this message, Sarah will receive your name, your verified phone number, and your email. You'll receive the same from her.
              </div>
            </div>
          )}

          {/* ── STAGE: CONNECTED ── */}
          {stage === "connected" && (
            <div className="connected-screen in" key="connected">
              <div className="success-ring">
                <Icons.Check color={p.primary} size={32} />
              </div>
              <div className="success-title">Olivia & Emma are <em>connected</em></div>
              <div className="success-sub">
                Both parents have approved. The girls can now message each other on Tether. You and Sarah are also connected as parents.
              </div>

              <div className="connected-pair">
                <div className="cp-kids">
                  <div className="cp-kid" style={{ background: `linear-gradient(135deg, ${p.primary}, ${p.primaryDark})` }}>OL</div>
                  <div className="cp-kid cp-kid-2" style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accentDark})` }}>EK</div>
                </div>
                <div className="cp-info">
                  <div className="cp-names">Olivia · Emma K.</div>
                  <div className="cp-meta">Connected · Tether chat active</div>
                </div>
                <Icons.Check color={p.primary} size={20} />
              </div>

              <div className="parent-pair">
                <Icons.Users color={p.primaryDark} />
                <div className="pp-text">
                  You and Sarah K. are now connected as parents. You can message each other directly in the parent layer.
                </div>
              </div>

              <button className="full-btn full-primary" onClick={() => setStage("requests")}>
                Back to requests
              </button>
              <button className="full-btn full-ghost">
                Message Sarah K.
              </button>
            </div>
          )}

        </div>

        {/* ── STICKY FOOTER ACTIONS ── */}
        {stage === "review" && (
          <div className="action-footer">
            <button className="af-btn af-primary" onClick={() => setStage("introduce")}>
              <Icons.Check color="white" size={16} />
              Looks good — approve connection
            </button>
            <button className="af-btn af-danger" onClick={() => { setDeclined(true); setStage("requests"); }}>
              <Icons.X color={p.alert4} size={16} />
              Decline this request
            </button>
          </div>
        )}

        {stage === "introduce" && (
          <div className="action-footer">
            <button className="af-btn af-primary" onClick={() => setStage("connected")}>
              <Icons.Message color="white" />
              Send intro and connect
            </button>
            <button className="af-btn af-ghost" onClick={() => setStage("connected")}>
              Skip message — just connect
            </button>
          </div>
        )}

      </div>
    </>
  );
}
