# Tether — Product Brief
### Version 2.0 | March 2026

---

## The Problem Worth Solving

Kids are communicating digitally earlier than ever, on platforms designed for adults and optimized for engagement, not development. iMessage has no parental visibility. Instagram hides conversations. Snapchat deletes them by design. Parents who care about their children's character are left with a binary choice: give kids unsupervised access, or take the phone entirely.

Neither option is good parenting. Neither teaches responsibility.

Tether is the third option: a supervised communication environment where kids learn digital responsibility inside a trusted community, and parents remain present without being intrusive.

---

## Product Vision

Tether is a family-and-community chat platform built for school-grade cohorts — starting with private and faith-based schools — where kids communicate with each other, parents monitor and guide, and families stay connected to one another across the academic years their children share.

The core design philosophy: **accountability first, communication as the earned benefit.**

---

## Target User

**Primary Community:** Parents at private and faith-based schools whose children share a grade and a values system.

**Initial Focus:** Elementary through middle school (grades 3–8), where the stakes of unsupervised digital communication are highest and parental authority is still fully intact.

**Distribution Model:** Parent-driven, invitation-based. One parent in a grade signs up, creates a cohort, and invites other grade parents. No school administration dependency — though school licensing is a natural growth path.

---

## User Roles

### 1. Child Account
- Created by a parent, linked to that parent's account
- No sign-up access without parent approval
- All messages visible to linked parent(s)
- Communication limited to approved contacts only
- Age-appropriate interface

### 2. Parent Account
- Primary account holder
- Creates and manages child account(s)
- Can view all child messages in real-time or on-demand
- Participates in parent-only communication layer
- Configures content monitoring rules
- Receives alerts and can intervene in conversations

### 3. Cohort Admin (Parent Role Extension)
- One or more parents designated as cohort organizers
- Can invite families to the cohort
- Can set cohort-level content standards (above the app baseline)
- Can message all parents simultaneously
- Can archive or export cohort history

---

## Feature Set

### Core Communication — Kids Layer

**Direct Messaging**
- One-to-one chat between approved contacts
- Text only in MVP; images added later with scan-before-send

**Group Chats**
- Created by parents, not kids (in MVP)
- Later: kids can request a group, parent approves
- All group members visible to all participating parents

**Message Design for Kids**
- Clean, simple interface with no algorithmic feed
- No likes, no reaction counts, no follower metrics
- No profile "status" or activity signals (no "last seen" anxiety loops)
- Customizable display name and avatar (parent-approved)

---

### Core Communication — Parent Layer

**Parent Direct Messaging**
- Separate, fully private channel between parents
- Not visible to kids
- Used for coordinating playdates, carpools, events, parenting discussions

**Cohort Parent Group**
- Group thread for all parents in a grade
- Pinned announcements from cohort admin
- Threaded replies to keep discussions organized

**Cross-Cohort Communication**
- Parents with kids in multiple grades can manage all from one account
- Separate cohort threads per grade, unified inbox view

---

### Safety and Monitoring System

This is the product's defining capability. It should be configurable, transparent to parents, and never punitive to kids by default — the goal is to guide, not surveil punitively.

**Real-Time Message Visibility**
- Parents can open any child conversation at any time
- Option to receive digest (daily summary) vs. real-time stream
- Unread indicator for flagged messages

**Content Monitoring Engine**

Three-tier architecture:

*Tier 1 — App Baseline (always on, not configurable off)*
- Profanity and slurs
- Explicit sexual content
- Self-harm language
- Bullying language patterns
- Adult contact solicitation signals

*Tier 2 — Community Standards (set by cohort admin)*
- Topics outside the cohort's shared values (configurable)
- Specific word or phrase lists
- Discussion of competing apps or circumvention methods

*Tier 3 — Family Rules (set by parent per child)*
- Custom word/phrase blocklist
- Subject categories (politics, violence, romance, etc.)
- Time-of-day messaging windows
- Contact approval per individual

**Alert System — Tiered by Severity**

Not all flags are equal. The delivery mechanism of the alert escalates with the seriousness of the content. Levels 1 through 4 are fully configurable by each parent — they choose how they want to be notified for each severity tier. Level 5 is locked by the platform and cannot be changed by anyone. No exceptions.

| Severity | Trigger Examples | Message Behavior | Default Alert | Parent Can Change? |
|---|---|---|---|---|
| **Level 1 — Soft Flag** | Mild language, off-topic subjects | Message delivered | In-app badge | Yes |
| **Level 2 — Warning** | Stronger language, borderline subjects | Message paused, kid sees review notice | In-app push notification | Yes |
| **Level 3 — Hard Block** | Profanity, bullying, inappropriate content | Message stopped, kid sees explanation | In-app push notification + banner | Yes |
| **Level 4 — High Priority** | Explicit sexual content, violence, predatory contact signals | Message stopped, conversation locked | Push notification + SMS | Yes — can upgrade or downgrade delivery method |
| **Level 5 — Emergency** | Self-harm language, suicide ideation, exploitation, predatory grooming signals | Message stopped, conversation locked, access suspended | **High-priority push notification + SMS + follow-up SMS with message excerpt** | **No — locked. Cannot be reduced or disabled.** |

**Parent configuration for Levels 1–4:**
Each parent sets their preferred alert delivery per severity level. Examples of valid configurations:
- Level 1: badge only (no sound, no notification)
- Level 2: in-app notification
- Level 3: push notification
- Level 4: push notification + SMS
- A parent who wants SMS for Level 3 can enable that. A parent who wants only badges for Level 4 cannot — Level 4 minimum is push notification.

Each level has a configurable floor that cannot be dropped below, to prevent parents from inadvertently disabling meaningful alerts. Parents can always upgrade alert intensity; they cannot reduce it below the platform minimum per level.

**Level 5 is non-negotiable.** Both a high-priority push notification and an SMS are sent to the parent's verified phone number automatically, regardless of app state, device settings, or parent preferences. A follow-up SMS includes the flagged message excerpt so the parent has immediate context without needing to open the app. This level exists outside the configuration system entirely — it is not a preference, it is a platform commitment.

**Kids see appropriate feedback** — not a wall of silence, but age-appropriate language like: *"This message was flagged. Your parent has been notified and will review it."* No shame, no punishment built into the system — parents decide the next step.

**Platform responsibility note:** For Level 5 triggers involving self-harm or exploitation, the platform surfaces crisis resources to the child within the app (e.g., Crisis Text Line) immediately alongside the flag notice. This happens before the parent even responds. It is both the right thing to do and a meaningful legal protection for the platform.

**Content Type Controls — Per Child, Per Parent**

Parents control exactly what types of content their child can send and receive. These settings are independent per child, so a parent with a 7-year-old and a 12-year-old can apply different rules to each.

Configurable content types:

| Content Type | Can Allow | Can Block | Notes |
|---|---|---|---|
| Text messages | Always on | Cannot disable | Core function |
| Voice-to-text | Yes | Yes | Transcribed to text before delivery; same monitoring rules apply |
| Images / photos | Yes | Yes | Blocked by default; must be explicitly enabled |
| Video clips | Yes | Yes | Blocked by default; must be explicitly enabled |
| Audio messages | Yes | Yes | Blocked by default |
| Website links / URLs | Yes | Yes | Blocked by default; must be explicitly enabled |
| App store links | Yes | Yes | Blocked by default |
| File attachments | Yes | Yes | Blocked by default |
| Location sharing | Yes | Yes | Blocked by default |
| GIFs and stickers | Yes | Yes | Enabled by default; sourced from a curated, age-appropriate library only |

A child whose parent has blocked images cannot receive images sent by another child — the message is held before delivery, the sending child sees a notice that the recipient's settings do not allow this content type, and the receiving parent is notified.

**AI Content Scanning — All Permitted Content Is Scanned Before Delivery**

Parental permission to allow a content type is not permission to allow any content of that type. Every image, link, video, file, and audio message passes through a scanning layer before it reaches the recipient, regardless of the parent's content type settings. If content fails the scan, it is blocked and the parent is alerted — even if the parent has that content type enabled.

**Image and Video Scanning**
- AI vision model evaluates every image and video frame before delivery
- Checks for: nudity or sexual content, graphic violence, drug or alcohol imagery, text within images containing flagged language, recognizable harmful symbols
- Images from the camera roll and images sent in-chat are both scanned
- Profile photos submitted by children are scanned before approval
- Flagged images are blocked, logged, and reported to the parent at the appropriate alert level

**Link Scanning**
- Every URL is resolved (including shortened links) before the message is delivered
- Link destination is evaluated for: known harmful domains, adult content, phishing signals, malware indicators, social media platforms (configurable as a block category)
- AI evaluates page content and metadata of unknown links
- Links that cannot be resolved or classified are blocked by default
- A link to Instagram or TikTok can be treated as a blocked category even if the URL itself is not harmful — parent configures which platform categories are off-limits

**File and Audio Scanning**
- Files are scanned for malware before delivery
- Audio messages are transcribed and run through the same text monitoring rules as typed messages
- File types that cannot be safely scanned are blocked by default

**Scanning Transparency**
- Parents can see a log of all scanned and blocked content in their dashboard
- Blocked items include the reason for the block and the alert level triggered
- Scanning happens in milliseconds for text and links; image and video scanning may introduce a short delivery delay (target under 3 seconds) which is communicated to the child as "sending..."
- Parent can pause a specific conversation or all conversations for a period
- Kid sees: "This conversation is paused. Talk to your parent."
- Can be time-limited (e.g., paused until 8 PM) or indefinite

**Parent Control Boundary — Critical Design Principle**
A parent's authority extends only to their own child's account. No parent, including a cohort admin, can restrict, silence, block, or modify the account or permissions of another family's child. If Parent A wants their child to stop communicating with Child B, Parent A restricts their own child — not Child B. This is non-negotiable by design. It protects every family's autonomy, prevents social conflict between parents from becoming a moderation tool, and ensures that no parent can weaponize the platform against another family's child. This boundary should be clearly communicated during onboarding and reflected throughout the UI. Cohort admin controls are limited strictly to cohort-level settings and never extend to individual child accounts outside their own household.

---

### Parent Tools and Controls

**Dashboard**
- Activity summary: messages sent today, any flags, new contacts
- Quick access to any child conversation
- Pending approvals (contact requests, group join requests)
- Alert history log

**Contact Management**
- All contacts must be approved by parent
- Requests show the requesting child's parent name and contact info
- Parent-to-parent introduction flow: before kids can chat, parents see each other's info

**Time Controls**
- Global quiet hours (no messaging outside these times)
- Weekday vs. weekend schedules
- Override mode (parent can unlock for a specific event)

**Content Report Export**
- Parents can export conversation history (PDF or CSV)
- Useful for counseling situations, school conversations, or legal needs

---

### Community and Cohort Features

**Grade Cohort Groups**
- One cohort per grade, administered by volunteering parents
- Multi-year continuity — same cohort carries from 4th to 5th to 6th grade
- Cohort identity: name, optional banner image, pinned mission/values statement

**Event Coordination**
- Simple event posts in parent group (date, location, RSVP)
- No external calendar integration in MVP; export to calendar later

**Resource Sharing**
- Parents can share links, documents, or notes in cohort group
- Examples: prayer requests, school supply lists, volunteer sign-ups

**Directory (Opt-In)**
- Cohort family directory: name, kid's name, grade
- Each family controls what info is visible
- Contact info shared only between connected parent accounts

---

### Onboarding Flow

**Parent Signup**
1. Create account with email and phone (two-factor from day one)
2. Verify identity (email + SMS)
3. Create or join a cohort (via invite link from cohort admin)
4. Add child account(s): name, grade, profile photo (optional)
5. Configure monitoring preferences

**Child Onboarding**
1. Parent generates an invite code
2. Child downloads app and enters code
3. Child creates display name (parent approves)
4. Child sees approved contacts only — empty until parent approves first connections

**Parent-to-Parent Introduction (before kids connect)**
1. Child A requests to add Child B as a contact
2. Parent A sees the request with Parent B's name and cohort association
3. Parent A approves → Parent B receives notification with Parent A's info
4. Parent B approves → kids are connected
5. Both parent pairs are now also connected in the parent layer

---

## Platform Architecture

**iOS — Primary**
- React Native via Expo
- Native App Store distribution
- Full push notification support (critical for the alert system)
- Native device permissions (notifications, camera for future media features)

**Android — Primary**
- Same React Native / Expo codebase as iOS
- Google Play Store distribution
- Built and deployed simultaneously with iOS — not a Phase 2 afterthought

**Web — Secondary (Parent Dashboard)**
- React Native Web using the same codebase
- Optimized for desktop use by parents who want to review conversations on a larger screen
- Not the primary experience — native apps are
- No App Store friction for the parent monitoring layer specifically

**Why React Native + Expo**
- One codebase deploys to all three targets
- Push notifications work natively on both iOS and Android — non-negotiable for the alert system
- App Store and Google Play presence builds parent trust and credibility
- Fully buildable with Claude as coding partner; no need for dedicated native Swift or Kotlin expertise
- Expo handles the build and submission pipeline, reducing DevOps complexity significantly

**Backend**
- Firebase (Firestore for messages, Auth for accounts)
- Firebase Cloud Functions for content monitoring logic and alert dispatch
- Firebase Cloud Messaging (FCM) for push notifications on both platforms
- No message storage on Replit — Firebase handles all data persistence

**AI Content Layer**
- Anthropic Claude API for nuanced content evaluation
- Rule-based filtering for speed (Tier 1 and Tier 2 triggers)
- Claude-powered analysis for ambiguous or context-dependent flags that rules alone cannot catch
- No message content sent to third parties beyond the Anthropic API (disclosed in privacy policy)

---

---


---

## Trust Level System — Privacy That Grows With the Child

Tether does not treat a 7-year-old and a 14-year-old identically. As children mature and earn trust, parents can progressively reduce their monitoring footprint inside the app rather than abandoning it for a platform with no oversight at all. The Trust Level system makes this progression explicit, visible to both parent and child, and tied to character rather than just age.

**The Five Trust Levels**

| Level | Name | Parent Visibility | Child Experience |
|---|---|---|---|
| 1 | Full View | Every message in real time | Knows all messages are visible |
| 2 | Monitored | Every message visible on demand, no real-time stream | Knows messages can be reviewed |
| 3 | Flagged Only | Only flagged messages are visible — everything else is private | Private conversations unless a flag fires |
| 4 | Alerts Only | No message content ever — flag notifications only, no read access | Full privacy except alert triggers |
| 5 | Independent | No monitoring — emergency alerts only | Full independence with safety net |

**Level 5 Emergency Alerts Are Always On**
Regardless of trust level, Level 5 emergency triggers (self-harm, exploitation, predatory contact) always fire an immediate SMS to the parent. This cannot be disabled by the parent, the child, or the trust level setting. It is the permanent floor beneath every level of independence.

**Progression Is Earned, Not Just Age-Gated**
Parents set the trust level manually. They can optionally tie it to age (e.g., auto-advance to Level 3 at age 13) or keep it entirely discretionary. The system supports both approaches. A parent can also move a child back down if trust is broken — the level is not a one-way ratchet.

**Transparency With the Child**
Children can see their current trust level in their app. At ages 10 and under the label is simplified to something like "Your parent keeps you safe." At 11 and above the level is shown explicitly with a description of what it means and what the next level unlocks. Parents can attach a personal note to the child's trust level — e.g., "When you've gone 90 days without a flag, I'll move you to Level 3." This turns the privacy progression into a living conversation about responsibility rather than a silent surveillance decision.

**Suggested Age Defaults (Configurable)**
- Ages 5–10: Level 1 — Full View
- Ages 11–12: Level 2 — Monitored
- Ages 13–14: Level 3 — Flagged Only
- Ages 15–16: Level 4 — Alerts Only
- Ages 17+: Level 5 — Independent

These are defaults only. Parents override them freely in any direction.

## Faith Mode — Optional Community Layer

Tether is built for all families, but its go-to-market begins with private and faith-based schools where parents share values and trust each other. Faith Mode is an optional layer that cohort admins enable for their community. It is never on by default and never required.

**Activation**
Faith Mode is enabled by the cohort admin during community setup. Once enabled, all parents in that cohort see a Faith Mode option in their family settings. Parents can engage fully, partially, or not at all — the community setting opens the door, individual parents decide how far they walk through it.

**Prominence Level — Set by Cohort Admin**
Cohort admins choose one of three levels. Individual parents can adjust downward within their household but cannot exceed what the admin has set.

| Level | Experience |
|---|---|
| **Subtle** | Quiet touches. A verse available on the dashboard, faith-aware content filtering defaults. Easy to miss if you're not looking for it. |
| **Moderate** | Clearly present but never interrupting. Daily Anchor verse displayed prominently, virtue recognition active, optional chat openers available. |
| **Rich** | Faith woven into the full daily experience. All features active, parent community prayer thread, monthly character theme, virtue recognition celebrated visibly. |

**Scripture Translation**
Parents choose their preferred translation during onboarding when Faith Mode is active: NIV, ESV, KJV, NLT, or NKJV. The Daily Anchor verse renders in their chosen translation.

**Feature 1 — The Daily Anchor**
Each morning the parent dashboard opens with a single verse — short, contextual, never preachy. Kids see a simplified, age-appropriate version in their interface. Not a Bible study. A grounding moment before the day begins. Verses are curated by theme: encouragement, kindness, courage, patience, friendship, honesty. The system rotates through themes aligned to the school year calendar where possible.

**Feature 2 — Chat Opening Prompts**
When a child opens a group conversation, an optional prompt appears at the top of the thread — a short prayer for the people in the chat, or a virtue word for the day with a brief definition. The child can engage with it or skip it entirely. No friction, no requirement. At the Rich level the prompt is more prominent. At Subtle it appears as a small icon the child can tap to expand.

**Feature 3 — Virtue Recognition**
The content monitoring engine works in both directions. When it detects encouragement, kindness, support, or uplifting language in a message, it quietly notes it. Parents see a virtue recognition counter on their dashboard alongside the flag count — "3 kind moments today" — reframing the entire monitoring experience. You are not only watching for what goes wrong. You are watching your child grow. At the Rich level, kids receive a small in-app acknowledgment when a kind moment is recognized.

**Feature 4 — Faith-Aligned Content Filtering**
Christian Mode adds a values layer above the standard content rules. Language or topics that conflict with Christian values are flagged at a lower threshold than the secular baseline. This includes content that promotes materialism, disrespect for authority, sexual themes beyond the standard filter, or language that degrades others. Cohort admins configure the specifics; parents adjust within those bounds.

**Faith-Aware Alert Language for Kids**
When a message is blocked in Faith Mode, the explanation the child sees is values-grounded rather than purely mechanical. Instead of "this message was flagged," the child sees: "This message didn't reflect the person you're growing into. Your parent has been notified." Age-appropriate, honest, and connected to character rather than rules.

**Parent Community Faith Features (Rich Level)**
- Shared weekly scripture in the cohort parent group
- Optional prayer request thread (parent-only, not visible to kids)
- Monthly character theme for the whole grade — parents and kids work on the same virtue together
- Cohort admin can post devotional content or discussion prompts


**Emoji Curation — Curated Picker for All Child Accounts**

The standard device emoji keyboard is never exposed to child accounts. Tether replaces it with a curated in-app emoji picker. This applies to all child accounts regardless of faith mode, with additional restrictions layered on top when faith mode is active.

*Platform baseline — blocked for all child accounts:*
Any emoji with widely understood adult or sexual connotations is removed entirely: eggplant, peach, sweat droplets (in suggestive combinations), cherries, banana, and others documented as carrying adult meaning in digital communication. This list is maintained and updated as emoji usage evolves. Children never see these options — they are not present in the picker, not accessible by search, and not deliverable even if typed manually via keyboard.

*Faith mode — additional removals:*
Middle finger and offensive gesture emojis, skull used in a mocking or threatening context, emojis associated with materialism or status signaling (stacks of cash, certain luxury items), and anything that conflicts with the community's values even without explicit adult content.

*What remains:*
A rich, expressive set of faces and emotions, animals, nature, food (actual food), sports and activities, weather, hearts and affection, hands and gestures of encouragement, symbols of celebration and faith. Kids will not feel restricted — the curated set is generous. They simply never encounter the ones that don't belong.

*Emoji search and keyboard bypass:*
The device native keyboard is restricted from emoji input within the Tether chat interface on both iOS and Android. Manual unicode entry is also blocked. The Tether picker is the only path to emoji input for child accounts.

**Faith Traditions Roadmap**
The architecture supports multiple faith traditions. Christian launches first. Catholic, Jewish, and Muslim profiles are planned as subsequent releases, each with appropriate scripture sources, holiday awareness, and values-layer customization.

## Privacy and Trust Architecture

Tether handles children's data. This requires serious intentionality.

- **COPPA compliant** — children under 13 may not have independent accounts; all child accounts are owned by the parent account
- **No ads, ever** — monetization is subscription only
- **No data selling** — ever, to anyone
- **End-to-end visibility for parents** — the design assumption is that parents have full read access to all child messages; this is disclosed to kids during onboarding in age-appropriate language
- **Parent data stays private from kids** — parent-to-parent communication is not visible to children
- **Data retention policy** — message history retained for X days (configurable by parent, with a platform maximum)
- **Account deletion** — full data deletion on request, within 30 days

---

## Monetization

**Subscription Model (Family)**
- Free tier: 1 child account, 1 cohort, basic monitoring
- Family plan ($4.99/month or $49/year): up to 4 children, full monitoring suite, all cohort features

**Cohort Admin Premium (optional)**
- Cohort-level subscription for advanced admin tools
- Event coordination, directory management, announcement pinning

**Future: School License**
- School pays a flat annual fee for all families in a grade band
- Administered through a school admin account layer
- Removes per-family subscription for member families

---

## MVP Scope (Build Phase 1)

The goal of the MVP is a working, safe, deployable app that proves the core loop: kids chat, parents see it, flags work. It ships to both App Store and Google Play from day one.

**MVP includes:**
- Parent account creation and child account linking
- One-to-one kid messaging
- One parent group chat per cohort
- Basic content filtering (keyword/phrase list, Tier 1 and Tier 2)
- Push notification alerts to parents (native, via Firebase Cloud Messaging)
- Contact approval flow with parent-to-parent introduction
- Message visibility dashboard for parents
- Time controls (quiet hours)
- iOS and Android native apps (React Native + Expo)

**MVP excludes (Phase 2+):**
- Group chats initiated by kids
- Image and media messaging
- Claude-powered nuanced content analysis (rule-based filtering first)
- Event coordination features
- Family directory
- Multi-grade cohort management
- Web parent dashboard (desktop companion)

---

## Name and Positioning

**Name:** Tether

**Tagline options:**
- *"Where kids learn to communicate. Where parents stay close."*
- *"Supervised connection. Real responsibility."*
- *"The chat your kids earn. The visibility you keep."*

**Brand feeling:** Warm, trusted, community-first. Not clinical. Not surveillance-branded. The logo and UI should feel like a neighborhood — safe, familiar, human.

---

## What Makes This Different

| Feature | Tether | iMessage | Instagram | Circle/parental controls |
|---|---|---|---|---|
| Full message visibility | ✅ | ❌ | ❌ | ❌ |
| Parent-to-parent layer | ✅ | ❌ | ❌ | ❌ |
| Community cohort model | ✅ | ❌ | ❌ | ❌ |
| Content monitoring + alerts | ✅ | ❌ | Limited | Blocks only |
| Kid-appropriate UX | ✅ | ❌ | ❌ | N/A |
| Subscription, no ads | ✅ | ✅ | ❌ | ✅ |
| Built for values-aligned communities | ✅ | ❌ | ❌ | ❌ |

---

## Next Steps

1. **Validate with 5 parents** in your school cohort — share this brief, collect reactions
2. **Name and domain** — lock in brand before building
3. **Design the core screens** — parent dashboard, kid chat view, alert flow
4. **Build in Replit** — follow the Tether Replit Handoff Guide
5. **Soft launch** — Grace Academy Grade 4 cohort as the first live group

---

*Tether — Product Brief v2.0*
*Prepared for development planning*
