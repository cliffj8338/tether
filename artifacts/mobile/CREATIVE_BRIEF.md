# Tether — Creative Brief
### Brand Identity · March 2026

---

## Brand Essence

**Tether** connects children to their friends and families to each other — inside a boundary of safety and trust. The name does the work: a tether keeps something close without caging it. That tension between freedom and safety is the entire product.

The brand must feel like a place parents trust and kids actually want to use. Not clinical. Not juvenile. Not surveillance-branded. Warm, grounded, and quietly confident.

**One sentence:** Tether is the app that gives kids a real place to communicate and parents the peace of mind to let them.

---

## Brand Voice

**Tone:** Warm authority. Like a good pediatrician — knowledgeable, calm, completely trustworthy, never talking down to you.

**Writing principles:**
- Say exactly what you mean. No hedging.
- Use plain language. No tech jargon.
- Respect both audiences equally — parents and kids.
- Warmth over formality. Confidence over excitement.
- Never use surveillance language ("monitor," "track," "spy"). Use visibility, awareness, connection.

**What Tether sounds like:**
> "Your kids are talking. You can be part of it."
> "Connection you can feel good about."
> "The chat they'll use. The visibility you'll keep."

**What Tether never sounds like:**
- "Powerful parental controls" (sounds punitive)
- "Monitor every message" (sounds invasive)
- "Keep your kids safe online!" (sounds fearful)
- Exclamation points in general

---

## Logo System

### The Mark

The Tether mark is a center node with four equal spokes radiating outward, each ending in a smaller dot. It is a connection symbol — a hub with four tethered points. It reads as a network, a family, a community. It does not read as a cross (the spokes are equal length and the endpoint dots break the geometry). It is faith-safe and universally legible.

**Construction rules:**
- Center circle diameter: 26% of mark width
- Spoke length: 36% of mark width (from center dot edge)
- Gap between center dot edge and spoke start: 15% of mark width
- Endpoint dot diameter: 11% of mark width
- Endpoint dot opacity: 55% (creates visual hierarchy — center is dominant)
- Stroke weight on spokes: 5.5% of mark width
- All elements: same color, no outlines

**Clear space:** Minimum clear space around the mark equals the diameter of one endpoint dot on all sides.

**Minimum size:** 20px rendered. Below this the endpoint dots disappear — acceptable.

### The Wordmark

**Typeface:** Fraunces — italic weight, tracked at -20  
**Case:** Sentence case ("Tether" not "TETHER")  
**Pairing:** Mark sits to the left of the wordmark, vertically centered, separated by 0.5× the mark height

### Lockup Variations

| Lockup | Usage |
|---|---|
| Mark + Wordmark (horizontal) | Primary — app headers, marketing |
| Mark only | App icon, favicon, small placements |
| Wordmark only | Long-form documents, legal |
| Stacked (mark above wordmark) | Square placements, social |

### What Never Changes

- The mark is never rotated
- The mark is never stretched or distorted
- The wordmark is always Fraunces italic — never bold, never all-caps
- The mark and wordmark are never separated by more than 1× the mark height
- The mark is never placed on a background that reduces contrast below 4.5:1

---

## Color System

### Primary Palette

| Name | Hex | RGB | Usage |
|---|---|---|---|
| **Sage** | `#6B9E8A` | 107, 158, 138 | Primary brand color, CTAs, active states |
| **Sage Dark** | `#4E7D6A` | 78, 125, 106 | Gradient end, hover states, text on light |
| **Sage Light** | `#8BBDAA` | 139, 189, 170 | Supporting tints, backgrounds |
| **Periwinkle** | `#7B8EC4` | 123, 142, 196 | Accent, secondary actions, links |
| **Periwinkle Dark** | `#5B6EA4` | 91, 110, 164 | Accent hover, active accent |
| **Periwinkle Light** | `#9BAAD8` | 155, 170, 216 | Accent tints |

### Neutral Palette

| Name | Hex | RGB | Usage |
|---|---|---|---|
| **Background** | `#F5F6FA` | 245, 246, 250 | App background |
| **Surface** | `#ECEEF6` | 236, 238, 246 | Cards, input backgrounds |
| **White** | `#FFFFFF` | 255, 255, 255 | Elevated surfaces, bubbles |
| **Text** | `#232535` | 35, 37, 53 | Primary text |
| **Text Mid** | `#555870` | 85, 88, 112 | Secondary text, labels |
| **Border** | `#D4D8EA` | 212, 216, 234 | Dividers, card borders |
| **Sand** | `#C8CCE0` | 200, 204, 224 | Placeholder text, timestamps |

### Alert Palette

| Level | Hex | Usage |
|---|---|---|
| Level 1 — Soft | `#7A9E7E` | Mild flag indicator |
| Level 2 — Warning | `#7B8EC4` | Warning state (same as accent) |
| Level 3 — Block | `#C49A3A` | Amber — blocked content |
| Level 4 — High | `#C4603A` | Orange-red — high priority |
| Level 5 — Emergency | `#A03030` | Deep red — emergency only |

### Faith Mode Palette

| Name | Hex | Usage |
|---|---|---|
| **Gold** | `#B8953A` | Faith mode primary |
| **Gold Light** | `#D4B060` | Gold gradient end |
| **Gold Bg** | `#FBF7EE` | Faith card backgrounds |
| **Gold Border** | `#E8D8A8` | Faith card borders |
| **Virtue** | `#7A6EA8` | Virtue recognition, kind moments |
| **Virtue Bg** | `#F2F0FA` | Virtue card backgrounds |
| **Virtue Border** | `#C8C0E8` | Virtue card borders |

### Color Rules

1. **Never use purple gradients on white.** It is the most overused AI-app aesthetic and directly contradicts Tether's warmth positioning.
2. **Sage is the hero.** Every screen should lead with sage green. Periwinkle supports, never competes.
3. **Gradients go vertical, dark-to-light or light-to-dark within the same hue family.** Never rainbow or multi-hue gradients in functional UI.
4. **Alert colors are earned.** Do not use Level 4 or Level 5 red for anything other than genuine alerts. The color must retain its meaning.
5. **Faith gold is sacred.** Only use the gold palette for Faith Mode elements. Do not bleed it into standard UI.

---

## Typography

### Display / Brand Font

**Fraunces**  
*Available free on Google Fonts*  
`https://fonts.google.com/specimen/Fraunces`

- A variable font with optical size, weight, and "wonk" axes
- Use: italic at regular weight (400) for headlines and the wordmark
- Use: semi-bold (600) for large numbers, screen titles
- Character: soft, literary, warm — unlike any other app in this category
- Tracking: -20 to -40 for display sizes. 0 for body use.

**Usage:**
```css
font-family: 'Fraunces', serif;
font-style: italic;
font-weight: 400;  /* headlines */
font-weight: 600;  /* display numbers, screen titles */
```

### Body / UI Font

**Nunito**  
*Available free on Google Fonts*  
`https://fonts.google.com/specimen/Nunito`

- Rounded terminals, highly legible at small sizes
- Warm without being childish — works for both parent and child interfaces
- Use: 400 (regular), 600 (medium), 700 (bold)
- Never use 800 or 900 weights — too aggressive for Tether's tone

**Usage:**
```css
font-family: 'Nunito', sans-serif;
font-weight: 400;  /* body text */
font-weight: 600;  /* labels, secondary UI */
font-weight: 700;  /* buttons, names, primary UI labels */
```

### Type Scale

| Name | Size | Weight | Font | Usage |
|---|---|---|---|---|
| Display XL | 30px | 600 | Fraunces italic | Onboarding headlines |
| Display L | 26px | 600 | Fraunces italic | Screen titles |
| Display M | 22px | 400 | Fraunces italic | Card headlines |
| Display S | 18px | 600 | Fraunces | Section headers |
| Body L | 16px | 700 | Nunito | Buttons, primary labels |
| Body M | 14px | 400–700 | Nunito | Body text, list items |
| Body S | 13px | 400–600 | Nunito | Secondary text, previews |
| Label | 11px | 700 | Nunito | Caps labels, tags |
| Micro | 10px | 700 | Nunito | Timestamps, tiny badges |

### Type Rules

1. **Fraunces italic is for moments of meaning.** Headlines, names, key phrases. Not UI labels.
2. **Nunito 700 is for actions and names.** The user's eye should land there first.
3. **Never mix fonts in a single sentence.** The Fraunces italic headline, then Nunito body below it.
4. **Line height:** 1.5 for body, 1.2 for display. No tighter.
5. **Never use system fonts** in production. Always load Fraunces + Nunito.

---

## Iconography

### Icon System Principles

Tether uses a fully custom icon set. No third-party icon libraries. Every icon is drawn to the same specification:

- **Stroke weight:** 1.7px at 20px viewport (scales proportionally)
- **Cap style:** Round
- **Join style:** Round
- **Fill:** None (outline icons only, except the Tether mark itself)
- **Viewport:** 24 × 24
- **Optical weight:** Icons should feel the same visual weight as Nunito 600 at the same size

### Icon Categories

**Navigation:** Home, Message, Bell, Users (community), Settings  
**Actions:** Back (chevron), Search, Plus, Filter, Lock, Pause, Eye, Eye-off, Flag  
**Content:** File, Shield, Shield-alert, Alert-triangle, Info, Check, Heart, Star  
**Communication:** Message, Phone, Mail, Link, Send  
**Faith:** Cross, Book (open), Candle, Dove  
**People:** Child, User, Users  

### Icon Rules

1. **Never use emoji as icons in UI chrome.** Emoji are for message content only, via the curated picker.
2. **Never use third-party icon packs** (Heroicons, Lucide, etc.). The custom set maintains visual consistency.
3. **Active state:** Icon color changes to primary sage. No weight change.
4. **Destructive state:** Icon color changes to Level 4 alert color `#C4603A`.
5. **Disabled state:** Icon color changes to sand `#C8CCE0`.

---

## App Icon Specification

### iOS Requirements

| Size | Usage |
|---|---|
| 1024 × 1024 | App Store submission (no alpha) |
| 180 × 180 | iPhone @3x |
| 167 × 167 | iPad Pro @2x |
| 152 × 152 | iPad @2x |
| 120 × 120 | iPhone @2x |
| 87 × 87 | iPhone Settings @3x |
| 80 × 80 | Spotlight @2x |
| 76 × 76 | iPad @1x |
| 60 × 60 | iPhone @1x |
| 58 × 58 | iPhone Settings @2x |
| 40 × 40 | Spotlight @1x |
| 29 × 29 | Settings @1x |
| 20 × 20 | Notification @1x |

**iOS icon design:**
- Background: vertical gradient `#6B9E8A` → `#4E7D6A`
- Mark: white, centered, 52% of icon width
- Corner radius: applied by iOS automatically — submit as square
- No alpha channel on the 1024 App Store submission

### Android Requirements

| File | Usage |
|---|---|
| `android-fg.png` | Adaptive icon foreground — Tether mark, white on transparent |
| `android-bg.png` | Adaptive icon background — sage gradient |
| `icon-512.png` | Google Play Store listing |

**Android adaptive icon:**
- Foreground: white Tether mark, centered, on transparent background
- Background: sage gradient (same as iOS)
- Safe zone: mark fits within 66% of the canvas (Android clips adaptive icons)

### Expo Config Reference

```json
{
  "expo": {
    "icon": "./assets/icons/icon-1024.png",
    "ios": {
      "icon": "./assets/icons/icon-1024.png"
    },
    "android": {
      "icon": "./assets/icons/icon-512.png",
      "adaptiveIcon": {
        "foregroundImage": "./assets/icons/android-fg.png",
        "backgroundImage": "./assets/icons/android-bg.png"
      }
    }
  }
}
```

---

## Splash Screen

**Size:** 2732 × 2732 (Expo universal splash)  
**Background:** `#F5F6FA` (app background color)  
**Mark:** Sage primary `#6B9E8A`, centered, 18% of canvas width  
**Effect:** Subtle radial glow behind the mark (sage tint, 18% opacity)  
**No wordmark on splash** — the mark alone is sufficient and loads faster  

```json
"splash": {
  "image": "./assets/splash.png",
  "resizeMode": "contain",
  "backgroundColor": "#F5F6FA"
}
```

---

## Asset File Index

Place all assets in `assets/` within your Expo project:

```
assets/
├── icons/
│   ├── icon-1024.png     ← App Store master (iOS)
│   ├── icon-512.png      ← Google Play (Android)
│   ├── icon-256.png      ← Desktop / general use
│   ├── icon-180.png      ← iPhone @3x
│   ├── icon-167.png      ← iPad Pro @2x
│   ├── icon-152.png      ← iPad @2x
│   ├── icon-120.png      ← iPhone @2x
│   ├── icon-87.png       ← iPhone Settings @3x
│   ├── icon-80.png       ← Spotlight @2x
│   ├── icon-76.png       ← iPad @1x
│   ├── icon-60.png       ← iPhone @1x
│   ├── icon-58.png       ← iPhone Settings @2x
│   ├── icon-40.png       ← Spotlight @1x
│   ├── icon-29.png       ← Settings @1x
│   ├── icon-20.png       ← Notification @1x
│   ├── android-fg.png    ← Android adaptive foreground
│   └── android-bg.png    ← Android adaptive background
├── splash.png            ← Universal splash screen
├── favicon-32.png        ← Web favicon
└── wordmark.png          ← Horizontal lockup (for marketing use)
```

---

## UI Patterns

### Elevation and Shadow

Tether uses three shadow levels:

```css
/* Level 1 — Cards, subtle lift */
box-shadow: 0 2px 8px rgba(35, 37, 53, 0.06);

/* Level 2 — Modals, dropdowns */
box-shadow: 0 8px 32px rgba(35, 37, 53, 0.10), 0 2px 8px rgba(35, 37, 53, 0.05);

/* Level 3 — Primary buttons, high emphasis */
box-shadow: 0 4px 18px rgba(107, 158, 138, 0.44);
```

### Border Radius

| Element | Radius |
|---|---|
| App icon | 22% of size (applied by OS) |
| Large cards | 20–22px |
| Standard cards | 16–18px |
| Buttons | 13–16px |
| Input fields | 12–14px |
| Tags / chips | 6–8px |
| Avatars | 11–16px (never circular for app avatars) |
| Message bubbles | 17px, 5px on the corner toward the tail |

### Motion Principles

- **Entrance:** `fadeUp` — opacity 0→1, translateY 12px→0, 320ms, cubic-bezier(0.4, 0, 0.2, 1)
- **Sheets:** `slideUp` — translateY 100%→0, 280ms, cubic-bezier(0.4, 0, 0.2, 1)
- **Toggles:** background color, 200ms linear
- **Progress bars:** width, 500ms cubic-bezier(0.4, 0, 0.2, 1)
- **No bounce animations** — they feel juvenile for this product
- **No rotation animations** — except the Tether mark loading state (spin, 22s, linear, infinite)

### Grain Texture

A subtle film grain overlay (opacity 3–4%) is applied to backgrounds on key screens (onboarding, faith mode) to add warmth and prevent the UI from reading as sterile.

```css
background-image: url("data:image/svg+xml,...fractalNoise...");
opacity: 0.03;
pointer-events: none;
position: fixed;
inset: 0;
```

---

## What Tether Is Not

These constraints are as important as the positive direction.

- **Not a surveillance app.** Never use security camera imagery, lock iconography as a primary brand element, or red/warning colors outside the alert system.
- **Not a kids app.** The UI does not use rounded bubbly type, primary colors, cartoon characters, or playful animation. It is designed for adults first, accessible to children, not the reverse.
- **Not a church app.** Faith Mode is warm and present but never leads with religious iconography in the main app chrome. The cross appears in faith-specific contexts only.
- **Not a tech startup.** No purple gradients, no glassmorphism excess, no neon accents, no dark mode as the primary experience.
- **Not clinical.** No cold blues, no hospital whites, no sans-serif brutalism.

---

## Competitive Differentiation — Visual

| Brand | Feeling | Why Tether Is Different |
|---|---|---|
| Life360 | Surveillance, tracking | Tether is warm and community-first |
| Bark | Clinical, alert-focused | Tether is positive and developmental |
| iMessage | Neutral, adult | Tether is purpose-built for this use case |
| Circle | Router-level, technical | Tether is human and relationship-focused |
| Instagram | Engagement, dopamine | Tether is anti-engagement by design |

---

## Design Handoff Checklist

Before moving into Replit build:

- [ ] Fraunces and Nunito confirmed in `app.json` font config
- [ ] All icon PNGs placed in `assets/icons/`
- [ ] `splash.png` placed in `assets/`
- [ ] `favicon-32.png` placed in `assets/` (web)
- [ ] Color constants copied into `constants/colors.ts`
- [ ] Typography scale documented in `constants/typography.ts`
- [ ] Icon components built as custom SVGs in `components/icons/`
- [ ] Gradient helper function available in `utils/gradient.ts`
- [ ] Shadow constants in `constants/shadows.ts`

---

*Tether — Creative Brief v1.0*
*March 2026*
