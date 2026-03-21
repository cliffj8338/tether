import { useState } from "react";

const p = {
  primary: "#6B9E8A",
  primaryLight: "#8BBDAA",
  primaryDark: "#4E7D6A",
  accent: "#7B8EC4",
  accentLight: "#9BAAD8",
  accentDark: "#5B6EA4",
  background: "#F5F6FA",
  surface: "#ECEEF6",
  white: "#FFFFFF",
  text: "#232535",
  textMid: "#555870",
  border: "#D4D8EA",
  sand: "#C8CCE0",
  alert1: "#7A9E7E",
  alert2: "#7B8EC4",
  alert3: "#C49A3A",
  alert4: "#C4603A",
  alert5: "#A03030",
};

// ── ICON SYSTEM ──────────────────────────────────────────────
// Consistent: 1.7px stroke, round caps/joins, optical balance

const Icon = ({ children, size = 20, color = p.textMid, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
    style={style}>
    {children}
  </svg>
);

const Icons = {
  Tether: ({ size = 18, color = "white" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill={color} />
      <line x1="12" y1="2" x2="12" y2="9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="15" x2="12" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="2" y1="12" x2="9" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="15" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="2" r="1.3" fill={color} opacity="0.5" />
      <circle cx="12" cy="22" r="1.3" fill={color} opacity="0.5" />
      <circle cx="2" cy="12" r="1.3" fill={color} opacity="0.5" />
      <circle cx="22" cy="12" r="1.3" fill={color} opacity="0.5" />
    </svg>
  ),

  Home: ({ size = 20, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H15v-5h-6v5H4a1 1 0 0 1-1-1V10.5z" />
    </Icon>
  ),

  Message: ({ size = 20, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Icon>
  ),

  Bell: ({ size = 20, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Icon>
  ),

  Community: ({ size = 20, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
    </Icon>
  ),

  Settings: ({ size = 20, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Icon>
  ),

  Search: ({ size = 20, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.65" y2="16.65" />
    </Icon>
  ),

  Shield: ({ size = 20, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Icon>
  ),

  ShieldAlert: ({ size = 20, color = p.alert4 }) => (
    <Icon size={size} color={color}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" />
      <circle cx="12" cy="16.5" r="0.5" fill={color} strokeWidth="2" />
    </Icon>
  ),

  Lock: ({ size = 20, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icon>
  ),

  Users: ({ size = 20, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  ),

  FileText: ({ size = 20, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </Icon>
  ),

  Filter: ({ size = 20, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
    </Icon>
  ),

  ChevronRight: ({ size = 16, color = p.sand }) => (
    <Icon size={size} color={color}>
      <polyline points="9,18 15,12 9,6" />
    </Icon>
  ),

  Plus: ({ size = 20, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Icon>
  ),

  Check: ({ size = 16, color = p.primaryDark }) => (
    <Icon size={size} color={color}>
      <polyline points="20,6 9,17 4,12" strokeWidth="2.2" />
    </Icon>
  ),

  AlertTriangle: ({ size = 20, color = p.alert4 }) => (
    <Icon size={size} color={color}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
    </Icon>
  ),

  Info: ({ size = 16, color = p.accent }) => (
    <Icon size={size} color={color}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5" />
    </Icon>
  ),

  Eye: ({ size = 18, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  ),

  Pause: ({ size = 18, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </Icon>
  ),

  Child: ({ size = 20, color = p.textMid }) => (
    <Icon size={size} color={color}>
      <circle cx="12" cy="6" r="3.5" />
      <path d="M5 21v-1a7 7 0 0 1 14 0v1" />
      <path d="M9 14l1.5 3.5L12 16l1.5 1.5L15 14" strokeWidth="1.4" />
    </Icon>
  ),

  Dot: ({ size = 8, color = p.primary }) => (
    <svg width={size} height={size} viewBox="0 0 8 8">
      <circle cx="4" cy="4" r="4" fill={color} />
    </svg>
  ),
};

// ── STYLES ─────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=Nunito:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .root {
    min-height: 100vh;
    background: ${p.background};
    font-family: 'Nunito', sans-serif;
    color: ${p.text};
    display: flex; flex-direction: column;
    max-width: 420px; margin: 0 auto;
    position: relative;
  }

  .topbar {
    background: rgba(255,255,255,0.94);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid ${p.border};
    padding: 14px 20px;
    display: flex; align-items: center;
    justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .topbar-left { display: flex; align-items: center; gap: 9px; }
  .logobox {
    width: 32px; height: 32px; border-radius: 9px;
    background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark});
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 10px ${p.primary}44;
  }
  .logotext {
    font-family: 'Fraunces', serif; font-size: 19px;
    font-weight: 600; color: ${p.text};
  }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .icon-btn {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1.5px solid ${p.border}; background: ${p.white};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; position: relative;
    transition: background 0.15s, border-color 0.15s;
  }
  .icon-btn:hover { background: ${p.surface}; border-color: ${p.sand}; }
  .badge {
    position: absolute; top: -5px; right: -5px;
    width: 17px; height: 17px; border-radius: 9px;
    background: ${p.alert4}; border: 2px solid ${p.white};
    font-size: 9px; font-weight: 700; color: white;
    display: flex; align-items: center; justify-content: center;
  }
  .avatar {
    width: 34px; height: 34px; border-radius: 10px;
    background: linear-gradient(135deg, ${p.accent}, ${p.accentDark});
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: white; cursor: pointer;
    letter-spacing: 0.5px;
  }

  .body { flex: 1; overflow-y: auto; padding: 20px 16px 100px; }

  .greeting { margin-bottom: 20px; }
  .greeting-sub {
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.3px; color: ${p.textMid}; margin-bottom: 3px;
  }
  .greeting-name {
    font-family: 'Fraunces', serif;
    font-size: 24px; font-weight: 600; color: ${p.text};
  }
  .greeting-name em { font-style: italic; color: ${p.primary}; }

  .alert-banner {
    background: ${p.alert4}0D;
    border: 1.5px solid ${p.alert4}38;
    border-radius: 16px; padding: 14px 16px;
    margin-bottom: 18px;
    display: flex; gap: 12px; align-items: flex-start;
    cursor: pointer; transition: background 0.15s;
  }
  .alert-banner:hover { background: ${p.alert4}18; }
  .alert-icon-wrap {
    width: 36px; height: 36px; border-radius: 10px;
    background: ${p.alert4}16;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .alert-body { flex: 1; }
  .alert-title {
    font-size: 13px; font-weight: 700;
    color: ${p.alert4}; margin-bottom: 3px;
  }
  .alert-desc { font-size: 12px; color: ${p.textMid}; line-height: 1.5; }
  .alert-time {
    font-size: 11px; color: ${p.sand};
    flex-shrink: 0; margin-top: 2px;
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 ${p.alert4}50; }
    70% { box-shadow: 0 0 0 7px ${p.alert4}00; }
    100% { box-shadow: 0 0 0 0 ${p.alert4}00; }
  }
  .pulse { animation: pulse 2s infinite; border-radius: 50%; }

  .sec-head {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 11px;
  }
  .sec-title {
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.2px; color: ${p.text};
  }
  .sec-link {
    font-size: 12px; font-weight: 700;
    color: ${p.accent}; cursor: pointer;
  }

  .stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 9px; margin-bottom: 22px;
  }
  .stat-card {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 15px; padding: 14px 12px; text-align: center;
  }
  .stat-num {
    font-family: 'Fraunces', serif; font-size: 26px;
    font-weight: 600; line-height: 1; margin-bottom: 5px;
  }
  .stat-num.g { color: ${p.primary}; }
  .stat-num.b { color: ${p.accent}; }
  .stat-num.o { color: ${p.alert3}; }
  .stat-label { font-size: 11px; font-weight: 600; color: ${p.textMid}; line-height: 1.3; }

  .children-row {
    display: flex; gap: 10px; margin-bottom: 22px;
    overflow-x: auto; padding-bottom: 4px;
  }
  .children-row::-webkit-scrollbar { display: none; }
  .child-card {
    flex-shrink: 0; width: 128px;
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 18px; padding: 15px 13px;
    cursor: pointer; transition: all 0.18s;
    position: relative;
  }
  .child-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(35,37,53,0.08); }
  .child-card.on { border-color: ${p.primary}; box-shadow: 0 4px 16px ${p.primary}26; }
  .child-avatar-wrap {
    width: 42px; height: 42px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 10px;
  }
  .child-name { font-size: 14px; font-weight: 700; color: ${p.text}; margin-bottom: 1px; }
  .child-grade { font-size: 11px; color: ${p.textMid}; margin-bottom: 9px; }
  .child-stat {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; color: ${p.textMid};
  }
  .child-flag-badge {
    position: absolute; top: 9px; right: 9px;
    width: 20px; height: 20px; border-radius: 7px;
    background: ${p.alert4};
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; color: white;
  }
  .add-child-card {
    flex-shrink: 0; width: 128px;
    background: ${p.white}; border: 1.5px dashed ${p.border};
    border-radius: 18px; padding: 15px 13px;
    cursor: pointer; transition: all 0.18s;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 8px; min-height: 130px;
  }
  .add-child-card:hover { background: ${p.surface}; }
  .add-child-label { font-size: 12px; font-weight: 700; color: ${p.textMid}; }

  .feed { display: flex; flex-direction: column; gap: 9px; margin-bottom: 22px; }
  .feed-item {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 16px; padding: 13px 15px;
    display: flex; gap: 11px; cursor: pointer;
    transition: all 0.15s; position: relative;
    overflow: hidden;
  }
  .feed-item:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(35,37,53,0.07); }
  .feed-item::before {
    content: ''; position: absolute;
    left: 0; top: 0; bottom: 0; width: 3px;
    border-radius: 3px 0 0 3px;
  }
  .feed-item.ok::before { background: ${p.border}; }
  .feed-item.l1::before { background: ${p.alert1}; }
  .feed-item.l2::before { background: ${p.alert2}; }
  .feed-item.l3::before { background: ${p.alert3}; }
  .feed-item.l4::before { background: ${p.alert4}; }

  .feed-icon-wrap {
    width: 38px; height: 38px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .feed-body { flex: 1; min-width: 0; }
  .feed-row1 { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3px; }
  .feed-who { font-size: 13px; font-weight: 700; color: ${p.text}; }
  .feed-with { font-weight: 500; color: ${p.textMid}; }
  .feed-time { font-size: 11px; color: ${p.sand}; flex-shrink: 0; margin-left: 6px; }
  .feed-preview {
    font-size: 12px; color: ${p.textMid}; line-height: 1.45;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 5px;
  }
  .feed-tag {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.6px;
    text-transform: uppercase; padding: 2px 8px;
    border-radius: 6px;
  }
  .tag-ok { background: ${p.primary}12; color: ${p.primaryDark}; }
  .tag-l1 { background: ${p.alert1}20; color: #3A6040; }
  .tag-l2 { background: ${p.alert2}18; color: ${p.accentDark}; }
  .tag-l3 { background: ${p.alert3}18; color: #8A6010; }
  .tag-l4 { background: ${p.alert4}16; color: #9A3818; }

  .actions-grid {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 9px; margin-bottom: 22px;
  }
  .action-btn {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 16px; padding: 15px 13px;
    display: flex; flex-direction: column;
    align-items: flex-start; gap: 9px;
    cursor: pointer; transition: all 0.15s; text-align: left;
  }
  .action-btn:hover { background: ${p.surface}; transform: translateY(-1px); }
  .action-icon-wrap {
    width: 36px; height: 36px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
  }
  .action-label { font-size: 13px; font-weight: 700; color: ${p.text}; }
  .action-sub { font-size: 11px; color: ${p.textMid}; line-height: 1.4; }

  .bottomnav {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 420px;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(14px);
    border-top: 1px solid ${p.border};
    display: flex; padding: 10px 0 18px;
    z-index: 50;
  }
  .nav-item {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; gap: 4px; cursor: pointer;
    padding: 3px 0; transition: opacity 0.15s;
  }
  .nav-item:hover { opacity: 0.7; }
  .nav-icon-wrap { position: relative; }
  .nav-label { font-size: 10px; font-weight: 700; letter-spacing: 0.2px; }
  .nav-item.on .nav-label { color: ${p.primary}; }
  .nav-item:not(.on) .nav-label { color: ${p.sand}; }

  .overlay {
    position: fixed; inset: 0;
    background: rgba(35,37,53,0.42);
    backdrop-filter: blur(5px);
    z-index: 100; display: flex;
    align-items: flex-end; justify-content: center;
  }
  .sheet {
    background: ${p.white}; border-radius: 24px 24px 0 0;
    width: 100%; max-width: 420px;
    padding: 20px 22px 40px;
    animation: slideUp 0.28s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  .sheet-handle {
    width: 34px; height: 4px; border-radius: 2px;
    background: ${p.border}; margin: 0 auto 20px;
  }
  .sheet-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .sheet-title {
    font-family: 'Fraunces', serif;
    font-size: 21px; font-weight: 600; color: ${p.text};
  }
  .sheet-sub { font-size: 13px; color: ${p.textMid}; line-height: 1.6; margin-bottom: 16px; }
  .sheet-msg {
    background: ${p.surface}; border: 1.5px solid ${p.border};
    border-radius: 13px; padding: 13px 15px;
    font-size: 13px; color: ${p.text};
    line-height: 1.65; margin-bottom: 16px;
    font-style: italic;
  }
  .sheet-level {
    display: inline-flex; align-items: center; gap: 6px;
    background: ${p.alert4}12; border: 1px solid ${p.alert4}30;
    border-radius: 8px; padding: 4px 10px;
    font-size: 11px; font-weight: 700;
    color: ${p.alert4}; margin-bottom: 18px;
    letter-spacing: 0.4px;
  }
  .sheet-actions { display: flex; flex-direction: column; gap: 9px; }
  .sht-btn {
    width: 100%; padding: 13px 16px;
    border-radius: 13px; border: none;
    font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center;
    justify-content: center; gap: 8px;
  }
  .sht-primary {
    background: linear-gradient(135deg, ${p.primary}, ${p.primaryDark});
    color: white; box-shadow: 0 4px 14px ${p.primary}44;
  }
  .sht-danger {
    background: ${p.alert4}10; color: ${p.alert4};
    border: 1.5px solid ${p.alert4}2A;
  }
  .sht-ghost { background: ${p.surface}; color: ${p.textMid}; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .in { animation: fadeUp 0.32s cubic-bezier(0.4,0,0.2,1) forwards; }
`;

// ── DATA ──────────────────────────────────────────────────
const feedData = [
  { id:1, child:"Olivia", level:"l4", tag:"tag-l4", tagLabel:"Level 4 — High Priority",
    iconColor:`${p.alert4}14`, iconStroke: p.alert4,
    preview:"Flagged message blocked — explicit link detected.", time:"2m ago", partner:"Emma K." },
  { id:2, child:"Liam", level:"l2", tag:"tag-l2", tagLabel:"Level 2 — Warning",
    iconColor:`${p.accent}14`, iconStroke: p.accent,
    preview:"Message paused — off-topic subject flagged for review.", time:"21m ago", partner:"Noah T." },
  { id:3, child:"Olivia", level:"ok", tag:"tag-ok", tagLabel:"Conversation",
    iconColor:`${p.primary}12`, iconStroke: p.primary,
    preview:"Hey can you come to practice tomorrow after school?", time:"38m ago", partner:"Sophie M." },
  { id:4, child:"Liam", level:"l1", tag:"tag-l1", tagLabel:"Level 1 — Soft flag",
    iconColor:`${p.alert1}20`, iconStroke: p.alert1,
    preview:"Mild language noted. Message delivered.", time:"1h ago", partner:"Jack R." },
  { id:5, child:"Olivia", level:"ok", tag:"tag-ok", tagLabel:"Conversation",
    iconColor:`${p.primary}12`, iconStroke: p.primary,
    preview:"Did you finish the reading for tomorrow?", time:"2h ago", partner:"Emma K." },
];

const childrenData = [
  { name:"Olivia", grade:"Grade 4 · Age 10", flags:1, msgs:14, color: p.primary },
  { name:"Liam", grade:"Grade 2 · Age 8", flags:0, msgs:9, color: p.accent },
];

const quickActions = [
  { iconEl: <Icons.Lock size={18} color={p.primary} />, iconBg:`${p.primary}16`,
    label:"Pause conversations", sub:"Temporarily pause all chats" },
  { iconEl: <Icons.Filter size={18} color={p.accent} />, iconBg:`${p.accent}14`,
    label:"Content settings", sub:"Manage filters and rules" },
  { iconEl: <Icons.Users size={18} color={p.textMid} />, iconBg:`${p.border}`,
    label:"Manage contacts", sub:"Approve or remove contacts" },
  { iconEl: <Icons.FileText size={18} color={p.alert3} />, iconBg:`${p.alert3}14`,
    label:"Export history", sub:"Download conversation logs" },
];

const navItems = [
  { id:"home", label:"Home", icon: (on) => <Icons.Home size={20} color={on ? p.primary : p.sand} /> },
  { id:"messages", label:"Messages", icon: (on) => <Icons.Message size={20} color={on ? p.primary : p.sand} /> },
  { id:"alerts", label:"Alerts", icon: (on) => <Icons.Bell size={20} color={on ? p.primary : p.sand} />, badge: 2 },
  { id:"community", label:"Community", icon: (on) => <Icons.Community size={20} color={on ? p.primary : p.sand} /> },
  { id:"settings", label:"Settings", icon: (on) => <Icons.Settings size={20} color={on ? p.primary : p.sand} /> },
];

// ── COMPONENT ─────────────────────────────────────────────
export default function Dashboard() {
  const [activeChild, setActiveChild] = useState(0);
  const [activeNav, setActiveNav] = useState("home");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const openSheet = (item) => {
    if (item.level === "l4" || item.level === "l3") {
      setSelected(item); setSheetOpen(true);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="root">

        {/* TOP BAR */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="logobox"><Icons.Tether size={18} /></div>
            <span className="logotext">Tether</span>
          </div>
          <div className="topbar-right">
            <div className="icon-btn" onClick={() => setSheetOpen(true)}>
              <Icons.Bell size={18} />
              <div className="badge">2</div>
            </div>
            <div className="icon-btn"><Icons.Search size={17} /></div>
            <div className="avatar">CJ</div>
          </div>
        </div>

        {/* BODY */}
        <div className="body in">

          <div className="greeting">
            <div className="greeting-sub">{greet}, Cliff</div>
            <div className="greeting-name">Here's what's <em>happening</em></div>
          </div>

          {/* ALERT BANNER */}
          <div className="alert-banner" onClick={() => { setSelected(feedData[0]); setSheetOpen(true); }}>
            <div className="alert-icon-wrap">
              <span className="pulse">
                <Icons.ShieldAlert size={19} color={p.alert4} />
              </span>
            </div>
            <div className="alert-body">
              <div className="alert-title">High Priority Alert — Olivia</div>
              <div className="alert-desc">A message was blocked in Olivia's chat with Emma K. Tap to review.</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0, marginTop:2 }}>
              <div className="alert-time">2m</div>
              <Icons.ChevronRight size={14} color={p.sand} />
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
              <div className="stat-num b">4</div>
              <div className="stat-label">Active chats</div>
            </div>
            <div className="stat-card">
              <div className="stat-num o">2</div>
              <div className="stat-label">Flags today</div>
            </div>
          </div>

          {/* CHILDREN */}
          <div className="sec-head">
            <span className="sec-title">Your children</span>
            <span className="sec-link">Manage</span>
          </div>
          <div className="children-row">
            {childrenData.map((c, i) => (
              <div key={i} className={`child-card ${activeChild === i ? "on" : ""}`}
                onClick={() => setActiveChild(i)}>
                {c.flags > 0 && <div className="child-flag-badge">{c.flags}</div>}
                <div className="child-avatar-wrap" style={{ background:`${c.color}18` }}>
                  <Icons.Child size={22} color={c.color} />
                </div>
                <div className="child-name">{c.name}</div>
                <div className="child-grade">{c.grade}</div>
                <div className="child-stat">
                  <Icons.Message size={12} color={p.sand} />
                  <span>{c.msgs} messages</span>
                </div>
              </div>
            ))}
            <div className="add-child-card" onClick={() => {}}>
              <div style={{ width:36, height:36, borderRadius:11, background:p.surface, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icons.Plus size={18} color={p.textMid} />
              </div>
              <div className="add-child-label">Add a child</div>
            </div>
          </div>

          {/* ACTIVITY FEED */}
          <div className="sec-head">
            <span className="sec-title">Recent activity</span>
            <span className="sec-link">See all</span>
          </div>
          <div className="feed">
            {feedData.map(item => (
              <div key={item.id} className={`feed-item ${item.level}`} onClick={() => openSheet(item)}>
                <div className="feed-icon-wrap" style={{ background: item.iconColor }}>
                  {item.level === "ok"
                    ? <Icons.Message size={17} color={item.iconStroke} />
                    : item.level === "l4"
                    ? <Icons.ShieldAlert size={17} color={item.iconStroke} />
                    : item.level === "l3"
                    ? <Icons.AlertTriangle size={17} color={item.iconStroke} />
                    : item.level === "l2"
                    ? <Icons.Info size={17} color={item.iconStroke} />
                    : <Icons.Dot size={8} color={item.iconStroke} />
                  }
                </div>
                <div className="feed-body">
                  <div className="feed-row1">
                    <div className="feed-who">
                      {item.child} <span className="feed-with">· {item.partner}</span>
                    </div>
                    <div className="feed-time">{item.time}</div>
                  </div>
                  <div className="feed-preview">{item.preview}</div>
                  <div className={`feed-tag ${item.tag}`}>
                    {(item.level === "l4" || item.level === "l3") && <Icons.AlertTriangle size={10} color="currentColor" />}
                    {item.tagLabel}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="sec-head">
            <span className="sec-title">Quick actions</span>
          </div>
          <div className="actions-grid">
            {quickActions.map((a, i) => (
              <div key={i} className="action-btn">
                <div className="action-icon-wrap" style={{ background: a.iconBg }}>{a.iconEl}</div>
                <div>
                  <div className="action-label">{a.label}</div>
                  <div className="action-sub">{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div className="bottomnav">
          {navItems.map(n => (
            <div key={n.id} className={`nav-item ${activeNav === n.id ? "on" : ""}`}
              onClick={() => setActiveNav(n.id)}>
              <div className="nav-icon-wrap">
                {n.icon(activeNav === n.id)}
                {n.badge && (
                  <div style={{
                    position:"absolute", top:-4, right:-6,
                    width:15, height:15, borderRadius:8,
                    background: p.alert4, border:`2px solid white`,
                    fontSize:8, fontWeight:700, color:"white",
                    display:"flex", alignItems:"center", justifyContent:"center"
                  }}>{n.badge}</div>
                )}
              </div>
              <div className="nav-label">{n.label}</div>
            </div>
          ))}
        </div>

        {/* BOTTOM SHEET */}
        {sheetOpen && (
          <div className="overlay" onClick={() => setSheetOpen(false)}>
            <div className="sheet" onClick={e => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-header">
                <Icons.ShieldAlert size={22} color={p.alert4} />
                <div className="sheet-title">Message Blocked</div>
              </div>
              <p className="sheet-sub">
                {selected?.child}'s message to {selected?.partner} was stopped before delivery. Review below and decide how to respond.
              </p>
              <div className="sheet-msg">
                "hey want to see something funny [explicit link removed]"
              </div>
              <div className="sheet-level">
                <Icons.AlertTriangle size={12} color={p.alert4} />
                Level 4 — High Priority · SMS sent to your phone
              </div>
              <div className="sheet-actions">
                <button className="sht-btn sht-primary" onClick={() => setSheetOpen(false)}>
                  <Icons.Eye size={16} color="white" />
                  Open full conversation
                </button>
                <button className="sht-btn sht-danger" onClick={() => setSheetOpen(false)}>
                  <Icons.Pause size={16} color={p.alert4} />
                  Pause this conversation
                </button>
                <button className="sht-btn sht-ghost" onClick={() => setSheetOpen(false)}>
                  Dismiss alert
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
