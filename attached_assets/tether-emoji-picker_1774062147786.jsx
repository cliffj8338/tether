import { useState } from "react";

const p = {
  primary: "#6B9E8A",
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
  virtueBg: "#F2F0FA",
};

// ── CURATED EMOJI SETS ─────────────────────────────────────

// Blocked at platform level regardless of mode (adult/suggestive connotations)
const ALWAYS_BLOCKED = ["🍆","🍑","💦","🍒","🍌","🌮","🍪","🥒","🍭","🍡","🎷","👅","💋","🫦"];

// Blocked additionally in faith mode
const FAITH_BLOCKED = ["🖕","💀","☠️","🤑","💸","💰","🤮","🤬","😈","👿","🃏","🎰","🍺","🍻","🥂","🍾","🍷","🍸","🍹","🚬"];

const CATEGORIES = [
  {
    id: "recent", label: "Recent", icon: "🕐",
    emojis: ["😊","❤️","🙏","✨","😂","👍","🎉","💙","🌟","😄","🙌","💪"],
  },
  {
    id: "faces", label: "Faces", icon: "😊",
    emojis: [
      "😊","😄","😁","😆","😅","😂","🤣","😇","🥰","😍","🤩","😘",
      "😌","😏","🙂","🤗","🤔","😐","😑","😶","🙄","😬","😴","🥱",
      "😯","😲","😳","🥺","😢","😭","😤","😠","😟","😔","😕","🫤",
      "🥲","😮‍💨","😪","🤧","🥴","😵","🤯","😱","🫣","🫡","🤫","🤭",
    ],
  },
  {
    id: "hearts", label: "Hearts", icon: "❤️",
    emojis: [
      "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💕","💞","💓",
      "💗","💖","💘","💝","💟","❣️","♥️","💔","❤️‍🔥","❤️‍🩹","🩷","🩵",
    ],
  },
  {
    id: "hands", label: "Hands", icon: "🙌",
    emojis: [
      "👍","👎","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","☝️",
      "👋","🤚","🖐️","✋","🖖","🤜","🤛","👊","🤝","🙌","👐","🫶",
      "🙏","💪","🦾","✍️","🫰","🤌","🫵","🫱","🫲",
    ],
  },
  {
    id: "nature", label: "Nature", icon: "🌿",
    emojis: [
      "🌸","🌺","🌻","🌹","🌷","🌼","🍀","🌿","🍃","🌱","🌲","🌳",
      "🌴","🍂","🍁","☀️","🌤️","⛅","🌦️","🌈","⭐","🌟","✨","💫",
      "🌙","🌊","🏔️","🌋","🌅","🌄","🦋","🐝","🌺","🕊️","🐾","🌏",
    ],
  },
  {
    id: "animals", label: "Animals", icon: "🐶",
    emojis: [
      "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮",
      "🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦅","🦉","🦇","🐺","🐗",
      "🦋","🐛","🐌","🐜","🐞","🦗","🦟","🐢","🐍","🦎","🦕","🐬",
      "🐳","🐋","🦈","🐙","🦀","🦞","🐡","🐠","🐟","🦭","🦦","🦥",
    ],
  },
  {
    id: "food", label: "Food", icon: "🍎",
    emojis: [
      "🍎","🍊","🍋","🍇","🍓","🫐","🍈","🍉","🍐","🍏","🍑","🍍",
      "🥭","🥝","🍅","🥦","🥕","🌽","🍄","🧅","🥔","🌰","🍞","🥐",
      "🧀","🥚","🍳","🥞","🧇","🥗","🍲","🍜","🍝","🍛","🍱","🍣",
      "🍕","🌮","🌯","🥙","🫔","🥪","🍔","🍟","🌭","🍦","🍧","🎂",
    ],
  },
  {
    id: "activities", label: "Activities", icon: "⚽",
    emojis: [
      "⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🏓","🏸",
      "🥊","🥋","🎽","🛹","🛼","🛷","⛸️","🎣","🤿","🎽","🏋️","🤸",
      "🏊","🚴","🏄","🧗","🏇","⛷️","🏂","🪂","🎯","🎮","🎲","🎨",
      "🎭","🎪","🎤","🎵","🎶","🎸","🎹","🥁","📚","✏️","📐","🔭",
    ],
  },
  {
    id: "symbols", label: "Symbols", icon: "✨",
    emojis: [
      "✨","🌟","⭐","💫","🎯","🔑","🗝️","🔒","🛡️","⚡","🔥","💧",
      "🌈","☁️","🌙","☀️","❄️","🌊","🎉","🎊","🎈","🎁","🏆","🥇",
      "🎗️","🏅","✅","☑️","💯","🔔","📣","💡","🕯️","🪄","🌍","🕊️",
    ],
  },
  {
    id: "faith", label: "Faith", icon: "✝️",
    emojis: [
      // Worship & Prayer
      "🙏","🤲","👐","🙌","✝️","☦️","⛪","📖",
      // Symbols of Faith
      "🕊️","📿","🪔","🕯️","🔔","⭐","🌟","✨","💫",
      // Virtues & Character
      "❤️","💛","💚","💙","💜","🤍","💝","💖","💗","🫶","❣️","💞",
      // Nature as Creation
      "🌈","☀️","🌤️","🌅","🌄","🌌","🌙","⭐","🌊","🏔️","🌋","🌍",
      // Biblical Animals & Symbols
      "🦁","🐑","🕊️","🦅","🐟","🐋","🦋","🐝","🌿","🍀","🌾","🍞",
      // Light & Hope
      "🕯️","💡","🔆","🌠","🌟","⚡","🔥","🌸","🌺","🌻","🌹","🌷",
      // Community & Service
      "🤝","🫂","👨‍👩‍👧","👨‍👩‍👦","👪","🏠","🏡","🎒","📚","✏️","🎓","🏅",
      // Celebration & Gratitude
      "🎉","🎊","🎈","🎁","🏆","🥇","🎗️","🎵","🎶","🎼","🎤","🎹",
      // Fruits of the Spirit
      "🍎","🍇","🍓","🫐","🍊","🍋","🌰","🌱","🌲","🌳","🍃","🍂",
    ],
    faithOnly: true,
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=Nunito:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .root {
    min-height: 100vh; background: ${p.background};
    font-family: 'Nunito', sans-serif; color: ${p.text};
    max-width: 420px; margin: 0 auto; padding: 0 0 40px;
  }

  .topbar {
    background: rgba(255,255,255,0.96); backdrop-filter: blur(14px);
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

  .mode-toggle {
    display: flex; background: ${p.surface};
    border: 1.5px solid ${p.border}; border-radius: 12px; padding: 3px;
  }
  .mode-btn {
    padding: 6px 14px; border-radius: 9px; font-size: 12px;
    font-weight: 700; cursor: pointer; transition: all 0.18s;
    border: none; background: none; font-family: 'Nunito', sans-serif;
    color: ${p.textMid};
  }
  .mode-btn.on.standard { background: ${p.primary}; color: white; box-shadow: 0 2px 8px ${p.primary}44; }
  .mode-btn.on.faith { background: ${p.gold}; color: white; box-shadow: 0 2px 8px ${p.gold}44; }

  .body { padding: 20px 16px; }

  .intro-card {
    border-radius: 18px; padding: 18px;
    margin-bottom: 22px; border: 1.5px solid;
  }
  .intro-card.standard { background: ${p.surface}; border-color: ${p.border}; }
  .intro-card.faith { background: ${p.goldBg}; border-color: ${p.goldBorder}; }
  .intro-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: ${p.text}; margin-bottom: 6px; }
  .intro-title em { font-style: italic; }
  .intro-title.faith em { color: ${p.gold}; }
  .intro-title.standard em { color: ${p.primary}; }
  .intro-text { font-size: 13px; color: ${p.textMid}; line-height: 1.6; }

  /* ── BLOCKED PREVIEW ── */
  .blocked-section { margin-bottom: 24px; }
  .sec-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .sec-title { font-size: 13px; font-weight: 700; color: ${p.text}; }
  .sec-badge {
    font-size: 10px; font-weight: 700; padding: 3px 9px;
    border-radius: 8px; letter-spacing: 0.5px;
  }
  .sec-badge.blocked { background: ${p.alert4}12; color: ${p.alert4}; border: 1px solid ${p.alert4}28; }
  .sec-badge.faith-only { background: ${p.gold}12; color: ${p.gold}; border: 1px solid ${p.gold}28; }

  .blocked-grid {
    display: flex; flex-wrap: wrap; gap: 6px;
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 16px; padding: 14px;
  }
  .blocked-emoji {
    position: relative; width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; border-radius: 10px;
    background: ${p.surface};
  }
  .blocked-x {
    position: absolute; inset: 0; border-radius: 10px;
    background: ${p.alert4}18;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── PICKER ── */
  .picker {
    background: ${p.white}; border: 1.5px solid ${p.border};
    border-radius: 22px; overflow: hidden;
    box-shadow: 0 8px 32px rgba(35,37,53,0.10);
  }

  .picker-search {
    padding: 12px 14px 10px;
    border-bottom: 1px solid ${p.border};
    display: flex; gap: 8px; align-items: center;
  }
  .search-input {
    flex: 1; border: 1.5px solid ${p.border}; border-radius: 10px;
    padding: 8px 12px; font-family: 'Nunito', sans-serif;
    font-size: 13px; color: ${p.text}; outline: none;
    background: ${p.surface}; transition: border-color 0.2s;
  }
  .search-input:focus { border-color: ${p.primary}; }
  .search-input::placeholder { color: ${p.sand}; }

  .cat-tabs {
    display: flex; overflow-x: auto; padding: 8px 10px;
    gap: 4px; border-bottom: 1px solid ${p.border};
  }
  .cat-tabs::-webkit-scrollbar { display: none; }
  .cat-tab {
    flex-shrink: 0; width: 36px; height: 34px; border-radius: 9px;
    border: 1.5px solid transparent; background: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 18px; transition: all 0.15s;
  }
  .cat-tab:hover { background: ${p.surface}; }
  .cat-tab.on { background: ${p.surface}; border-color: ${p.border}; }
  .cat-tab.faith-tab.on { background: ${p.goldBg}; border-color: ${p.goldBorder}; }

  .emoji-grid {
    display: grid; grid-template-columns: repeat(8, 1fr);
    padding: 10px 10px 14px; gap: 2px;
    max-height: 260px; overflow-y: auto;
  }
  .emoji-grid::-webkit-scrollbar { width: 4px; }
  .emoji-grid::-webkit-scrollbar-thumb { background: ${p.border}; border-radius: 2px; }

  .emoji-cell {
    width: 38px; height: 38px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; cursor: pointer; transition: all 0.12s;
    position: relative;
  }
  .emoji-cell:hover { background: ${p.surface}; transform: scale(1.18); }
  .emoji-cell:active { transform: scale(0.95); }
  .emoji-cell.blocked-cell {
    opacity: 0.2; cursor: not-allowed; filter: grayscale(1);
  }
  .emoji-cell.blocked-cell:hover { transform: none; background: none; }

  .picker-footer {
    padding: 10px 14px 12px;
    border-top: 1px solid ${p.border};
    display: flex; align-items: center; gap: 8px;
  }
  .footer-label { font-size: 11px; font-weight: 700; color: ${p.textMid}; }
  .footer-tag {
    font-size: 10px; font-weight: 700; padding: 3px 9px;
    border-radius: 8px; letter-spacing: 0.4px;
  }
  .footer-tag.standard { background: ${p.primary}14; color: ${p.primaryDark}; }
  .footer-tag.faith { background: ${p.gold}12; color: ${p.gold}; }

  /* SELECTED PREVIEW */
  .selected-preview {
    margin-top: 16px;
    background: ${p.surface}; border: 1.5px solid ${p.border};
    border-radius: 16px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
    min-height: 56px;
  }
  .selected-emoji { font-size: 32px; }
  .selected-text { font-size: 13px; color: ${p.textMid}; }
  .selected-name { font-size: 14px; font-weight: 700; color: ${p.text}; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .in { animation: fadeUp 0.32s cubic-bezier(0.4,0,0.2,1) forwards; }
`;

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

const BlockX = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <line x1="5" y1="5" x2="15" y2="15" stroke={p.alert4} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="15" y1="5" x2="5" y2="15" stroke={p.alert4} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const EMOJI_NAMES = {
  "😊":"Smiling face","😄":"Grinning face","😁":"Beaming face","🥰":"Loved",
  "❤️":"Red heart","💙":"Blue heart","💛":"Yellow heart","💚":"Green heart",
  "💜":"Purple heart","🤍":"White heart","💝":"Heart with ribbon","💖":"Sparkling heart",
  "🫶":"Heart hands","💞":"Revolving hearts",
  "🙏":"Prayer / Gratitude","🤲":"Open hands","👐":"Open hands","🙌":"Praise hands",
  "✝️":"Cross","☦️":"Orthodox cross",
  "⛪":"Church","📖":"Open Bible",
  "🕊️":"Dove of peace","📿":"Prayer beads","🪔":"Diya lamp",
  "🕯️":"Candle — light in darkness","🔔":"Bell","⭐":"Star","🌟":"Glowing star",
  "✨":"Sparkles","💫":"Dizzy star",
  "🌈":"Rainbow — God's promise","☀️":"Sun — light and warmth","🌅":"Sunrise",
  "🌄":"Mountain sunrise","🌌":"Night sky","🌙":"Moon","🌊":"Ocean",
  "🏔️":"Mountain","🌍":"The earth","🌸":"Cherry blossom","🌺":"Hibiscus",
  "🌻":"Sunflower","🌹":"Rose","🌷":"Tulip",
  "🦁":"Lion — courage and strength","🐑":"Lamb — gentleness","🦅":"Eagle — rising on wings",
  "🐟":"Fish — early Christian symbol","🦋":"Butterfly — transformation",
  "🐝":"Bee — community and diligence","🌿":"Branch — growth","🍀":"Four-leaf clover",
  "🌾":"Wheat — harvest","🍞":"Bread — nourishment",
  "💡":"Light","🌠":"Shooting star","⚡":"Lightning — power","🔥":"Fire — passion",
  "🤝":"Handshake — covenant","🫂":"Embrace","👨‍👩‍👧":"Family","👪":"Family",
  "🏠":"Home","🏡":"Home with garden","📚":"Learning","✏️":"Study","🎓":"Graduation",
  "🎉":"Celebration","🎊":"Party","🎈":"Balloon","🎁":"Gift","🏆":"Trophy",
  "🎵":"Music note","🎶":"Musical notes","🎼":"Musical score","🎤":"Singing",
  "🍎":"Apple","🍇":"Grapes — fruit of the Spirit","🍓":"Strawberry",
  "🫐":"Blueberry","🍊":"Orange","🌱":"Seedling — growth","🌲":"Tree — strong roots",
  "🍃":"Leaves — new life",
};

export default function EmojiPicker() {
  const [faithMode, setFaithMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState("recent");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const blockedSet = new Set([
    ...ALWAYS_BLOCKED,
    ...(faithMode ? FAITH_BLOCKED : []),
  ]);

  const visibleCategories = CATEGORIES.filter(c => !c.faithOnly || faithMode);

  const activeCat = visibleCategories.find(c => c.id === activeCategory) || visibleCategories[0];

  const filteredEmojis = search.trim()
    ? visibleCategories.flatMap(c => c.emojis).filter((e, i, arr) =>
        arr.indexOf(e) === i &&
        (EMOJI_NAMES[e]?.toLowerCase().includes(search.toLowerCase()) || true)
      ).slice(0, 40)
    : activeCat?.emojis || [];

  return (
    <>
      <style>{styles}</style>
      <div className="root">

        <div className="topbar">
          <div className="logorow">
            <div className="logobox"><TetherLogo /></div>
            <span className="logotext">Tether</span>
          </div>
          <div className="mode-toggle">
            <button className={`mode-btn standard ${!faithMode ? "on" : ""}`}
              onClick={() => { setFaithMode(false); setActiveCategory("recent"); }}>
              Standard
            </button>
            <button className={`mode-btn faith ${faithMode ? "on" : ""}`}
              onClick={() => { setFaithMode(true); setActiveCategory("recent"); }}>
              ✝ Faith
            </button>
          </div>
        </div>

        <div className="body in" key={faithMode ? "faith" : "standard"}>

          {/* INTRO */}
          <div className={`intro-card ${faithMode ? "faith" : "standard"}`}>
            <div className={`intro-title ${faithMode ? "faith" : "standard"}`}>
              {faithMode
                ? <><em>Faith Mode</em> — values-aligned emoji picker</>
                : <><em>Standard Mode</em> — curated for kids</>
              }
            </div>
            <div className="intro-text">
              {faithMode
                ? "Adult-content emojis are blocked for all children. Faith Mode additionally removes emojis that conflict with Christian values. A Faith category is added with faith-appropriate symbols."
                : "The standard device keyboard is never shown to children. Tether's curated picker blocks all emojis with adult or suggestive meanings, regardless of faith settings."
              }
            </div>
          </div>

          {/* BLOCKED PREVIEW */}
          <div className="blocked-section">
            <div className="sec-head">
              <span className="sec-title">Always blocked — all child accounts</span>
              <span className="sec-badge blocked">Platform rule</span>
            </div>
            <div className="blocked-grid">
              {ALWAYS_BLOCKED.map(e => (
                <div key={e} className="blocked-emoji">
                  <span style={{ fontSize: 22 }}>{e}</span>
                  <div className="blocked-x"><BlockX /></div>
                </div>
              ))}
            </div>
          </div>

          {faithMode && (
            <div className="blocked-section">
              <div className="sec-head">
                <span className="sec-title">Additionally blocked in Faith Mode</span>
                <span className="sec-badge faith-only">Faith rule</span>
              </div>
              <div className="blocked-grid">
                {FAITH_BLOCKED.map(e => (
                  <div key={e} className="blocked-emoji">
                    <span style={{ fontSize: 22 }}>{e}</span>
                    <div className="blocked-x"><BlockX /></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PICKER */}
          <div className="sec-head" style={{ marginBottom: 12 }}>
            <span className="sec-title">Available emoji picker</span>
            <span style={{ fontSize: 12, color: p.textMid, fontWeight: 600 }}>
              {faithMode ? "Faith Mode" : "Standard"} — tap any emoji
            </span>
          </div>

          <div className="picker">
            <div className="picker-search">
              <input
                className="search-input"
                placeholder="Search emojis..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {!search && (
              <div className="cat-tabs">
                {visibleCategories.map(cat => (
                  <div key={cat.id}
                    className={`cat-tab ${cat.faithOnly ? "faith-tab" : ""} ${activeCategory === cat.id ? "on" : ""}`}
                    onClick={() => setActiveCategory(cat.id)}
                    title={cat.label}>
                    {cat.icon}
                  </div>
                ))}
              </div>
            )}

            <div className="emoji-grid">
              {filteredEmojis.map((emoji, i) => {
                const isBlocked = blockedSet.has(emoji);
                return (
                  <div key={`${emoji}-${i}`}
                    className={`emoji-cell ${isBlocked ? "blocked-cell" : ""}`}
                    onClick={() => !isBlocked && setSelected(emoji)}
                    title={isBlocked ? "Not available" : EMOJI_NAMES[emoji] || ""}>
                    {emoji}
                  </div>
                );
              })}
            </div>

            <div className="picker-footer">
              <div className="footer-label">Mode:</div>
              <div className={`footer-tag ${faithMode ? "faith" : "standard"}`}>
                {faithMode ? "✝ Faith Mode active" : "Standard Mode"}
              </div>
              {faithMode && (
                <div style={{ fontSize: 11, color: p.textMid, marginLeft: "auto" }}>
                  +Faith category enabled
                </div>
              )}
            </div>
          </div>

          {/* SELECTION PREVIEW */}
          <div className="selected-preview">
            {selected ? (
              <>
                <div className="selected-emoji">{selected}</div>
                <div>
                  <div className="selected-name">{EMOJI_NAMES[selected] || "Emoji selected"}</div>
                  <div className="selected-text">Approved for {faithMode ? "Faith Mode" : "Standard Mode"}</div>
                </div>
              </>
            ) : (
              <div className="selected-text">Tap an emoji to select it</div>
            )}
          </div>

          <div style={{ marginTop: 20, padding: "14px 16px", background: p.surface, borderRadius: 16, border: `1px solid ${p.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: p.text, marginBottom: 5 }}>How this works in the app</div>
            <div style={{ fontSize: 12, color: p.textMid, lineHeight: 1.65 }}>
              Child accounts never see the device's native emoji keyboard. Tether's picker is the only input path. Emojis typed manually via external keyboard or pasted from outside the app are intercepted and removed before delivery. The blocked list is maintained by Tether and updated as emoji usage evolves.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
