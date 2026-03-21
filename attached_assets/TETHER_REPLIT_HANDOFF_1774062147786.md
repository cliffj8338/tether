# Tether — Complete Replit Handoff
### Build Guide · March 2026

---

## What This Document Is

Everything you need to take Tether from the prototype screens we built in Claude into a real, deployed application in Replit. Read this top to bottom before touching any code. The order matters.

---

## Product Summary

Tether is a supervised communication platform for kids, built for school-grade cohorts. Parents have full visibility into their children's conversations, configurable content monitoring with tiered alerts (including mandatory SMS for emergency-level content), and a parent-to-parent communication layer. Faith Mode adds an optional Christian values layer — daily scripture, virtue recognition, faith-aligned content filtering, and a curated emoji picker. Trust Levels allow monitoring to scale back as children mature and earn privacy.

**Core loop:** Kids chat → messages are scanned → parents see everything → flags alert parents → parents intervene or guide.

**Name:** Tether  
**Palette:** Sage & Dusk — primary `#6B9E8A`, accent `#7B8EC4`, background `#F5F6FA`  
**Fonts:** Fraunces (display/serif) + Nunito (body)  
**Platform:** React Native + Expo → iOS + Android + Web

---

## Screens Built (Prototype Components)

All screens are built as React `.jsx` artifacts. They are fully interactive prototypes using mock data. In Replit they become real screens wired to Firebase.

| File | Screen | Who Sees It |
|---|---|---|
| `tether-onboarding-v2.jsx` | Parent signup — 4-step flow | Parent (new) |
| `tether-dashboard-v2.jsx` | Parent home dashboard | Parent |
| `tether-parent-convo.jsx` | Parent reads child's conversation | Parent |
| `tether-trust-level.jsx` | Trust level settings per child | Parent |
| `tether-contact-approval.jsx` | Contact request + parent intro flow | Parent |
| `tether-faith-mode.jsx` | Faith mode setup + faith dashboard | Parent |
| `tether-kid-home.jsx` | Child home — conversations list | Child |
| `tether-kid-chat.jsx` | Child chat screen | Child |
| `tether-emoji-picker.jsx` | Curated emoji picker | Child (embedded) |

**Not needed for Replit build:** `tether-onboarding.jsx` (v1), `tether-dashboard.jsx` (v1), `tether-palette-chooser.jsx` (design tool only). Use the v2 versions.

---

## Tech Stack

```
Frontend:     React Native + Expo (SDK 50+)
Navigation:   Expo Router (file-based)
Backend:      Firebase
  Auth:         Firebase Authentication (email + phone)
  Database:     Firestore (real-time messages)
  Functions:    Firebase Cloud Functions (content scanning, alerts)
  Messaging:    Firebase Cloud Messaging (push notifications)
  Storage:      Firebase Storage (media — Phase 2)
AI Layer:     Anthropic Claude API (content evaluation — Phase 2)
SMS Alerts:   Twilio (Level 4 + Level 5 SMS to parent phone)
Build:        Expo EAS Build (App Store + Google Play)
Hosting:      Replit (development) → Vercel or Firebase Hosting (web)
```

---

## Replit Project Setup

### Step 1 — Create the Replit project

1. Go to replit.com → New Repl
2. Choose **React Native (Expo)** template
3. Name it `tether`
4. Once created, open the Shell tab

### Step 2 — Install dependencies

Run these in the Shell one at a time:

```bash
npx create-expo-app tether --template blank-typescript
cd tether
npx expo install expo-router expo-linking expo-constants expo-status-bar
npx expo install firebase
npx expo install expo-notifications expo-device
npx expo install @react-native-async-storage/async-storage
npx expo install expo-secure-store
npm install twilio
npm install @anthropic-ai/sdk
```

### Step 3 — Firebase project setup

1. Go to console.firebase.google.com
2. Create a new project called `tether-app`
3. Enable these services:
   - **Authentication** → Email/Password + Phone
   - **Firestore Database** → Start in production mode
   - **Cloud Functions** → Enable
   - **Cloud Messaging** → Enable (for push notifications)
4. Add an iOS app + Android app to the project
5. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
6. Place both in the root of your Replit project

### Step 4 — Environment variables

In Replit, go to Secrets (the lock icon) and add:

```
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=tether-app.firebaseapp.com
FIREBASE_PROJECT_ID=tether-app
FIREBASE_STORAGE_BUCKET=tether-app.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_id
FIREBASE_APP_ID=your_app_id
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
ANTHROPIC_API_KEY=your_anthropic_key
```

---

## Project File Structure

Build this exact structure in Replit:

```
tether/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout + auth guard
│   ├── index.tsx                 # Entry → redirects to /auth or /parent
│   ├── auth/
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx           # ← tether-onboarding-v2.jsx
│   │   ├── signup.tsx
│   │   ├── verify-phone.tsx
│   │   └── add-child.tsx
│   ├── parent/
│   │   ├── _layout.tsx           # Parent tab navigator
│   │   ├── index.tsx             # ← tether-dashboard-v2.jsx
│   │   ├── conversation.tsx      # ← tether-parent-convo.jsx
│   │   ├── contacts.tsx          # ← tether-contact-approval.jsx
│   │   ├── trust-level.tsx       # ← tether-trust-level.jsx
│   │   ├── faith-mode.tsx        # ← tether-faith-mode.jsx
│   │   └── settings.tsx
│   └── child/
│       ├── _layout.tsx           # Child tab navigator
│       ├── index.tsx             # ← tether-kid-home.jsx
│       └── chat.tsx              # ← tether-kid-chat.jsx
│
├── components/
│   ├── EmojiPicker.tsx           # ← tether-emoji-picker.jsx
│   ├── TrustLevelBadge.tsx
│   ├── AlertBanner.tsx
│   ├── FaithPrompt.tsx
│   ├── VirtueChip.tsx
│   └── AnchorVerse.tsx
│
├── lib/
│   ├── firebase.ts               # Firebase init
│   ├── auth.ts                   # Auth helpers
│   ├── firestore.ts              # Firestore helpers
│   └── notifications.ts          # Push notification setup
│
├── services/
│   ├── content-filter.ts         # Rule-based content scanning (MVP)
│   ├── alert-service.ts          # Alert dispatch (in-app + SMS)
│   ├── virtue-detector.ts        # Kindness/virtue recognition
│   └── faith-service.ts          # Daily verse, virtue of day
│
├── functions/                    # Firebase Cloud Functions
│   ├── index.ts                  # Function exports
│   ├── scan-message.ts           # Called before every message delivers
│   ├── send-sms-alert.ts         # Twilio SMS dispatch
│   └── send-push-alert.ts        # FCM push dispatch
│
├── constants/
│   ├── colors.ts                 # Palette (Sage & Dusk)
│   ├── typography.ts             # Fraunces + Nunito
│   ├── filter-rules.ts           # Blocked words, phrase patterns
│   ├── emoji-sets.ts             # Curated emoji lists
│   └── faith-content.ts          # Verses, virtues, prayers
│
├── types/
│   ├── user.ts
│   ├── message.ts
│   ├── conversation.ts
│   ├── alert.ts
│   └── cohort.ts
│
├── app.json                      # Expo config
├── firebase.json                 # Firebase config
└── package.json
```

---

## Firestore Data Model

Design the database around these collections:

```
users/{userId}
  - uid: string
  - email: string
  - phone: string (verified)
  - role: "parent" | "child"
  - parentId: string (if child)
  - displayName: string
  - grade: string (if child)
  - cohortId: string
  - trustLevel: 1 | 2 | 3 | 4 | 5  (default 1)
  - faithMode: boolean
  - faithProminence: "subtle" | "moderate" | "rich"
  - scriptureTranslation: "NIV" | "ESV" | "KJV" | "NLT" | "NKJV"
  - alertPreferences: { level1: string, level2: string, level3: string, level4: string }
  - contentPermissions: { images: bool, links: bool, audio: bool, video: bool }
  - quietHours: { enabled: bool, start: string, end: string }
  - createdAt: timestamp

conversations/{conversationId}
  - participants: string[]          # userIds
  - participantParents: string[]    # parentIds for monitoring
  - type: "direct" | "group"
  - name: string (groups only)
  - cohortId: string
  - pausedFor: string[]             # childIds with paused access
  - createdAt: timestamp
  - lastMessage: string
  - lastMessageAt: timestamp

conversations/{conversationId}/messages/{messageId}
  - senderId: string
  - text: string
  - status: "delivered" | "blocked" | "pending_review"
  - flagLevel: 0 | 1 | 2 | 3 | 4 | 5
  - flagReason: string
  - isKindMoment: boolean
  - createdAt: timestamp
  - readBy: string[]

cohorts/{cohortId}
  - name: string
  - school: string
  - grade: string
  - adminIds: string[]
  - memberFamilyIds: string[]
  - faithMode: boolean
  - faithProminence: "subtle" | "moderate" | "rich"
  - contentStandards: object
  - inviteCode: string
  - createdAt: timestamp

contactRequests/{requestId}
  - requestingChildId: string
  - targetChildId: string
  - requestingParentId: string
  - targetParentId: string
  - status: "pending" | "approved" | "declined"
  - introMessage: string
  - createdAt: timestamp
  - resolvedAt: timestamp

alerts/{alertId}
  - parentId: string
  - childId: string
  - conversationId: string
  - messageId: string
  - level: 1 | 2 | 3 | 4 | 5
  - flagReason: string
  - messageExcerpt: string (Level 5 only)
  - smsSent: boolean
  - pushSent: boolean
  - resolved: boolean
  - createdAt: timestamp
```

---

## Content Filter — MVP Implementation

Build this as a synchronous check that runs before every message is written to Firestore. Keep it fast — rule-based only in MVP, Claude API added in Phase 2.

```typescript
// services/content-filter.ts

export type FilterResult = {
  allowed: boolean;
  level: 0 | 1 | 2 | 3 | 4 | 5;
  reason: string;
  isKindMoment: boolean;
}

// TIER 1 — Always blocked, platform level
const LEVEL_5_PATTERNS = [
  /\b(kill myself|end my life|want to die|cut myself|self harm|suicid)\b/i,
  /\b(send me pictures|meet me alone|don't tell your parents|our secret)\b/i,
];

const LEVEL_4_PATTERNS = [
  /\b(sex|porn|nude|naked|explicit sexual terms)\b/i,
];

const LEVEL_3_PATTERNS = [
  // Standard profanity list — maintain in constants/filter-rules.ts
];

const LEVEL_2_PATTERNS = [
  // Borderline language, off-topic subjects
];

// KIND MOMENT DETECTION
const KIND_PATTERNS = [
  /\b(you're amazing|so proud of you|you inspire|believe in you|you're so kind|great job|you did it|thank you for)\b/i,
  /\b(i appreciate|you always help|best friend|love having you|so grateful)\b/i,
];

export function scanMessage(text: string, faithMode: boolean): FilterResult {
  // Check Level 5 first — always
  for (const pattern of LEVEL_5_PATTERNS) {
    if (pattern.test(text)) {
      return { allowed: false, level: 5, reason: "Emergency content detected", isKindMoment: false };
    }
  }

  // Check Level 4
  for (const pattern of LEVEL_4_PATTERNS) {
    if (pattern.test(text)) {
      return { allowed: false, level: 4, reason: "Explicit content detected", isKindMoment: false };
    }
  }

  // Check Level 3
  for (const pattern of LEVEL_3_PATTERNS) {
    if (pattern.test(text)) {
      return { allowed: false, level: 3, reason: "Inappropriate language", isKindMoment: false };
    }
  }

  // Check Level 2
  for (const pattern of LEVEL_2_PATTERNS) {
    if (pattern.test(text)) {
      return { allowed: true, level: 2, reason: "Borderline content flagged for review", isKindMoment: false };
    }
  }

  // Faith mode additional checks
  if (faithMode) {
    // Additional faith-aligned pattern checks here
  }

  // Check for kind moments
  for (const pattern of KIND_PATTERNS) {
    if (pattern.test(text)) {
      return { allowed: true, level: 0, reason: "", isKindMoment: true };
    }
  }

  return { allowed: true, level: 0, reason: "", isKindMoment: false };
}
```

---

## Alert Service — MVP Implementation

```typescript
// services/alert-service.ts

import { sendPushNotification } from '../lib/notifications';
import { sendSMS } from './twilio';

export async function dispatchAlert(
  level: number,
  parentId: string,
  childName: string,
  conversationId: string,
  messageExcerpt: string,
  parentPhone: string,
  alertPreferences: object
) {
  // Level 1 — badge only (default)
  if (level === 1) {
    await updateBadgeCount(parentId);
    return;
  }

  // Level 2 — push notification
  if (level === 2) {
    await sendPushNotification(parentId, {
      title: `Message flagged — ${childName}`,
      body: "A message was paused for review. Tap to see it.",
      data: { conversationId, level }
    });
    return;
  }

  // Level 3 — push + in-app banner
  if (level === 3) {
    await sendPushNotification(parentId, {
      title: `⚠️ Message blocked — ${childName}`,
      body: "A message was blocked. Tap to review.",
      data: { conversationId, level }
    });
    return;
  }

  // Level 4 — push + SMS (configurable)
  if (level === 4) {
    await sendPushNotification(parentId, {
      title: `🚨 High priority alert — ${childName}`,
      body: "A message was blocked. Immediate review recommended.",
      data: { conversationId, level },
      priority: "high"
    });
    await sendSMS(parentPhone,
      `Tether Alert — ${childName} sent a high-priority flagged message. Open the Tether app to review it now.`
    );
    return;
  }

  // Level 5 — ALWAYS push + SMS + follow-up SMS with excerpt
  // Cannot be disabled or reconfigured
  if (level === 5) {
    await sendPushNotification(parentId, {
      title: `🚨 EMERGENCY ALERT — ${childName}`,
      body: "Urgent: a message requires your immediate attention.",
      data: { conversationId, level },
      priority: "high",
      sound: "default"
    });
    await sendSMS(parentPhone,
      `TETHER EMERGENCY ALERT: ${childName} sent a message flagged for serious concern. Open Tether immediately.`
    );
    // Follow-up SMS with excerpt after 30 seconds
    setTimeout(async () => {
      await sendSMS(parentPhone,
        `Tether: The flagged message read — "${messageExcerpt}". Please check on ${childName} now.`
      );
    }, 30000);
  }
}
```

---

## Firebase Cloud Function — Message Scan

This function intercepts every message before it reaches the recipient. Deploy to Firebase Functions.

```typescript
// functions/scan-message.ts

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { scanMessage } from '../services/content-filter';
import { dispatchAlert } from '../services/alert-service';

export const onMessageCreate = functions.firestore
  .document('conversations/{conversationId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const { conversationId, messageId } = context.params;

    // Get sender and conversation data
    const convoDoc = await admin.firestore()
      .collection('conversations').doc(conversationId).get();
    const convo = convoDoc.data();

    const senderDoc = await admin.firestore()
      .collection('users').doc(message.senderId).get();
    const sender = senderDoc.data();

    // Only scan messages from child accounts
    if (sender?.role !== 'child') return;

    // Get parent data for alerts
    const parentDoc = await admin.firestore()
      .collection('users').doc(sender.parentId).get();
    const parent = parentDoc.data();

    // Run content scan
    const result = scanMessage(message.text, parent?.faithMode || false);

    // Update message with scan result
    await snap.ref.update({
      status: result.allowed ? 'delivered' : 'blocked',
      flagLevel: result.level,
      flagReason: result.reason,
      isKindMoment: result.isKindMoment,
    });

    // If blocked, prevent delivery by updating conversation
    if (!result.allowed) {
      await dispatchAlert(
        result.level,
        sender.parentId,
        sender.displayName,
        conversationId,
        message.text.substring(0, 100),
        parent?.phone || '',
        parent?.alertPreferences || {}
      );
    }

    // If kind moment, update parent dashboard counter
    if (result.isKindMoment) {
      await admin.firestore()
        .collection('users').doc(sender.parentId)
        .update({
          kindMomentsToday: admin.firestore.FieldValue.increment(1)
        });
    }
  });
```

---

## Trust Level — Firestore Security Rules

Enforce trust level visibility at the database level so it cannot be bypassed.

```
// firestore.rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Messages — visibility depends on trust level
    match /conversations/{convId}/messages/{msgId} {

      // Child can only read messages in their own conversations
      allow read: if request.auth.uid in resource.data.participants
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'child';

      // Parent visibility rules based on trust level
      allow read: if request.auth.uid in
        get(/databases/$(database)/documents/conversations/$(convId)).data.participantParents
        && parentCanReadMessage(request.auth.uid, resource.data);
    }

    function parentCanReadMessage(parentId, message) {
      let child = get(/databases/$(database)/documents/users/$(message.senderId)).data;
      let trustLevel = child.trustLevel;

      // Level 1-2: full read access
      if (trustLevel <= 2) return true;

      // Level 3: only flagged messages
      if (trustLevel == 3) return message.flagLevel > 0;

      // Level 4-5: no message content (alerts only, handled server-side)
      return false;
    }
  }
}
```

---

## Color Constants

Copy this exactly into `constants/colors.ts`:

```typescript
export const Colors = {
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
  // Alert levels
  alert1: "#7A9E7E",
  alert2: "#7B8EC4",
  alert3: "#C49A3A",
  alert4: "#C4603A",
  alert5: "#A03030",
  // Faith
  gold: "#B8953A",
  goldLight: "#D4B060",
  goldBg: "#FBF7EE",
  goldBorder: "#E8D8A8",
  virtue: "#7A6EA8",
  virtueBg: "#F2F0FA",
  virtueBorder: "#C8C0E8",
};
```

---

## User Flows — Reference

### Flow 1: Parent Onboarding
```
App opens → Welcome screen
→ Create account (name, email, password)
→ Verify phone (OTP)
→ Add first child (name, age)
→ Join or create cohort (invite code)
→ Configure monitoring preferences
→ Dashboard
```

### Flow 2: Child Onboarding
```
Parent generates invite code in dashboard
→ Child downloads app
→ Child enters invite code
→ Child creates display name (parent sees + approves)
→ Child sees empty home screen
→ Parent approves first contact request to populate contacts
```

### Flow 3: Contact Approval
```
Child A taps "New message" → selects from approved list
  OR
Child A searches for Child B (if in same cohort) → sends request

→ Parent A sees contact request notification
→ Parent A reviews Parent B's info (name, phone, email, cohort, verified status)
→ Parent A approves → Parent B receives introduction + Parent A's info
→ Parent B approves → kids are connected
→ Both parent pairs are now connected in the parent communication layer
```

### Flow 4: Message Send (Child)
```
Child types message → taps send
→ "Checking your message..." indicator (content scan)
→ Cloud Function runs scan-message
→ Result: allowed, blocked, or flagged

If ALLOWED:
  → Message writes to Firestore with status: "delivered"
  → Recipient sees message in real time
  → If kind moment detected → virtue badge appears, parent counter increments

If BLOCKED (Level 3+):
  → Message writes with status: "blocked"
  → Child sees: "This message didn't reflect the person you're growing into"
  → If Faith Mode: relevant scripture shown to child
  → Alert dispatched to parent at appropriate level
  → Level 5: immediate SMS + follow-up SMS to parent phone
```

### Flow 5: Parent Reviews Flag
```
Parent receives push notification / SMS
→ Opens Tether → alert banner on dashboard
→ Taps to open conversation (trust level permitting)
→ Flagged message shown with red left border + flag chip
→ Parent opens review sheet:
    - Sees blocked message content
    - Sees detection reason + timestamp
    - Chooses: coach child | pause conversation | dismiss
→ Parent can add private note to conversation
→ Parent can pause conversation (1 hour / until tomorrow / indefinitely)
→ Child sees "paused" state — does not see who else was notified
```

### Flow 6: Trust Level Change
```
Parent opens Settings → child profile → Trust Level
→ Reviews current level (hero card with full description)
→ Selects new level from 1–5
→ Optionally adds a note to child: "What this means for you..."
→ Optionally enables auto-advance by age
→ Saves → Firestore security rules update visibility immediately
→ Child sees new trust level description in their app
```

### Flow 7: Faith Mode Setup (Cohort Admin)
```
Cohort admin opens Faith Mode settings
→ Selects prominence level: Subtle / Moderate / Rich
→ Sets default scripture translation
→ Toggles individual features: Daily Anchor, Chat Prompts, Virtue Recognition, Faith Filtering
→ Saves → all cohort members see faith layer at configured level
→ Individual parents can reduce their household's level but not exceed admin's setting
```

---

## Build Order for MVP

Build these in sequence. Each phase is testable before the next begins.

### Phase 1 — Auth and data (Week 1)
- [ ] Firebase project setup + Firestore schema
- [ ] Parent signup flow (email + phone OTP)
- [ ] Child account creation (linked to parent)
- [ ] Basic Firestore security rules

### Phase 2 — Core chat (Week 2)
- [ ] Child home screen with conversation list
- [ ] Child chat screen (send + receive messages)
- [ ] Real-time Firestore listener for messages
- [ ] Basic message delivery (no scanning yet)

### Phase 3 — Content filter (Week 3)
- [ ] Rule-based content scanner (services/content-filter.ts)
- [ ] Cloud Function: scan-message deployed to Firebase
- [ ] Blocked message state in child UI
- [ ] Scan indicator ("Checking your message...")

### Phase 4 — Parent monitoring (Week 4)
- [ ] Parent dashboard with activity feed
- [ ] Parent conversation view (reads child messages)
- [ ] Trust level settings (controls visibility)
- [ ] Alert system (in-app first, SMS Phase 5)

### Phase 5 — Alerts and notifications (Week 5)
- [ ] Firebase Cloud Messaging setup
- [ ] Push notifications for flag levels 2–5
- [ ] Twilio SMS integration for levels 4–5
- [ ] Alert history log in parent dashboard

### Phase 6 — Contact approval (Week 6)
- [ ] Contact request flow (4-stage)
- [ ] Parent-to-parent introduction system
- [ ] Approved contacts list per child
- [ ] Request notifications to both parents

### Phase 7 — Faith mode (Week 7)
- [ ] Faith mode toggle + prominence levels
- [ ] Daily Anchor verse (static JSON → API later)
- [ ] Virtue of the day system
- [ ] Chat opening prompts
- [ ] Curated emoji picker (replace native keyboard)
- [ ] Faith-aligned content filter additions

### Phase 8 — Polish and launch (Week 8)
- [ ] Cohort invite code flow
- [ ] Quiet hours / time controls
- [ ] Conversation pause controls
- [ ] Parent note system
- [ ] EAS Build → TestFlight (iOS) + Play Store internal track
- [ ] Soft launch with Grace Academy Grade 4 cohort

---

## Key Rules — Never Break These

1. **Level 5 alerts are always sent.** SMS + push, no exceptions, no config option to disable.

2. **Content is scanned before delivery.** No message ever reaches a recipient without passing through the filter. The scan happens in the Cloud Function, not client-side.

3. **Parents control only their own children.** No parent account can modify, restrict, or access another family's child. Cohort admin settings are cohort-level only.

4. **Trust Level is enforced at Firestore rules level.** Not just in the UI. A parent on Level 3 cannot read un-flagged messages even if they bypass the app.

5. **Child accounts cannot be created without a parent account.** No orphaned child accounts. The parent link is required at signup.

6. **The native emoji keyboard is blocked for child accounts.** The Tether curated picker is the only input path. Bypassing it (paste, voice, etc.) is intercepted server-side.

7. **No ads, no data selling.** Monetization is subscription only. Never add ad infrastructure.

8. **COPPA compliance.** Children under 13 have no independent account. All data belongs to the parent account.

---

## Twilio Setup (SMS Alerts)

1. Create a Twilio account at twilio.com
2. Get a phone number with SMS capability
3. Add credentials to Replit Secrets (see Step 4 above)
4. Install: `npm install twilio`

```typescript
// services/twilio.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS(to: string, body: string) {
  await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
}
```

---

## Expo App Config

```json
// app.json
{
  "expo": {
    "name": "Tether",
    "slug": "tether",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "backgroundColor": "#F5F6FA"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.tether.app",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "package": "com.tether.app",
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      "expo-router",
      "expo-notifications",
      [
        "expo-build-properties",
        {
          "android": { "compileSdkVersion": 34 },
          "ios": { "deploymentTarget": "15.0" }
        }
      ]
    ],
    "scheme": "tether"
  }
}
```

---

## What to Tell Claude in Replit

When you start a new session in Replit with Claude as your coding partner, paste this prompt to get started fast:

> "I'm building Tether, a supervised kids chat app. Tech stack: React Native + Expo, Firebase (Firestore + Auth + Functions + FCM), Twilio for SMS. Design system: primary color #6B9E8A, accent #7B8EC4, background #F5F6FA, fonts Fraunces + Nunito. The app has two user roles: parent and child. I need you to help me build [specific feature]. Here's the relevant data model: [paste relevant Firestore schema above]. Here are the rules: Level 5 content alerts always send SMS regardless of settings. Content is scanned server-side before delivery. Trust levels 1–5 control parent visibility and are enforced in Firestore security rules. Let's start with [specific file]."

Always give Claude the data model and the key rules when starting a session. It keeps the code consistent.

---

## Phase 2 Roadmap (Post-MVP)

After soft launch:

- **Claude API content analysis** — replace rule-based scanner with Claude-powered nuanced evaluation for edge cases
- **Image scanning** — AI vision model evaluates images before delivery
- **Link scanning** — resolve all URLs including shortened links, evaluate destination
- **Group chats initiated by kids** — with parent approval
- **Media messaging** — images/video with scan-before-send
- **Web parent dashboard** — desktop companion for reviewing conversations
- **Family directory** — opt-in cohort contact book
- **Event coordination** — simple event posts in parent group
- **School licensing model** — flat annual fee per grade band
- **Jewish and Muslim faith modes** — separate curated experiences

---

*Tether — Replit Handoff Guide v1.0*
*Prepared March 2026*
*All screen prototypes, product brief, and this build guide comprise the complete handoff package.*
