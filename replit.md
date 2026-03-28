# Overview

This project is a pnpm workspace monorepo utilizing TypeScript, aiming to develop **Tether**, a supervised communication application for children. The project encompasses a full-stack solution including an Express API server, a React Native mobile application for parent and child roles, a marketing website, and an admin dashboard for analytics.

Tether's core vision is to provide a safe digital communication environment for children, offering features like AI-powered content filtering (including a unique "Faith Mode" for Christian values analysis), contact approval flows, and COPPA compliant design. The business model is subscription-only, with a focus on family safety and well-being. The project aims to capture the market for secure children's communication tools, offering a robust platform with advanced analytics for parents and administrators.

# User Preferences

I prefer iterative development, with a focus on clear, concise communication. I appreciate detailed explanations when new features or complex architectural decisions are introduced. I expect the agent to ask for confirmation before making any major changes to the codebase or architectural structure.

# System Architecture

## Monorepo Structure

The project is structured as a pnpm workspace monorepo. It is organized into `artifacts/` for deployable applications (API server, mobile, website, admin), `lib/` for shared libraries (database, API specs, generated clients), and `scripts/` for utility scripts.

## Core Technologies

- **Monorepo Tool**: pnpm workspaces
- **Node.js**: Version 24
- **TypeScript**: Version 5.9 (all packages use composite projects)
- **API Framework**: Express 5
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod (v4) and drizzle-zod
- **API Codegen**: Orval (from OpenAPI spec)
- **Build Tool**: esbuild (for CJS bundles)

## Applications

### `api-server` (`@workspace/api-server`)

An Express 5 API server handling all backend logic, data persistence via `@workspace/db`, and request/response validation using `@workspace/api-zod`. It integrates AI-powered content moderation and handles push notifications and SMS.

### `mobile` (`@workspace/mobile`)

An Expo React Native application for parents and children. It features:
- **Roles**: Distinct interfaces for parent and child users.
- **UI/UX**: Uses Fraunces and Nunito fonts, a defined color palette (primary #6B9E8A, accent #7B8EC4), and custom UI components.
- **Authentication**: `AuthContext` with AsyncStorage for token persistence.
- **API Service**: Typed fetch wrapper for all API endpoints.
- **Key Features**: Trust levels (1-5), two-pass content filtering (pattern-based + Claude AI), Faith Mode toggle (per-child), contact approval, anti-addiction controls (daily message limit, cooldown between messages, screen time limit), usage tracking with progress bar, and COPPA compliance.
- **Navigation**: Structured using `expo-router` with separate flows for onboarding, parent, and child roles, including specific screens for conversations, child details, alerts, and add-child (modal).
- **Onboarding**: Full parent/child onboarding flow — discovery slides, role selection, parent signup/login, child join-family/login (via family code or parent email + PIN). After parent signup, dashboard shows family code and "Add Your First Child" empty state.
- **Add Child**: Modal screen (`/add-child`) lets parents add children with name, age, grade, and PIN. Shows family code for sharing. Success screen shows login instructions for the child. Role-guarded (parent-only).

### `website` (`@workspace/website`)

A marketing website for Tether, built with React, Vite, Tailwind CSS v4, and wouter for routing. It includes:
- **Design**: Fraunces (headings) and Nunito (body) fonts, brand-consistent color scheme, custom logo.
- **Content**: Pages for home, features, schools, churches, Faith Mode, pricing, about, waitlist, and a static blog.
- **SEO**: Per-route SEO metadata managed by a `useSEO` hook.
- **Investor Page**: A static HTML page at `/investors` for pitch deck display.

### `admin` (`@workspace/admin`)

An admin intelligence dashboard built with React, Vite, and Tailwind CSS v4, using Recharts for visualizations. It provides comprehensive analytics and operations across 18 distinct pages organized into two sections:
- **Intelligence** (12 pages): Overview, Conversation Intelligence, Safety Center, Demographics & Behavior, Engagement Analytics, Content Research, Website Analytics, Behavioral Intelligence, Network Analysis, Predictive Analytics, AI Research Assistant, and Data Catalog (18 tables, 172+ fields, 56 correlation links across 3 research lenses).
- **Operations** (6 pages): Waitlist Management (search/filter/export), User Management (role toggling, pause/unpause), Product Roadmap (4-phase timeline), System Architecture (5-layer component diagram), Version & Config (feature flags, tech stack, DB schema), and System Status (real-time health monitoring, memory usage, service checks).
- **Authentication**: Firebase Auth with Google sign-in (admin-only). Login page at `/admin` shows Google sign-in button. Users verified against backend via Firebase ID tokens. `requireAdmin` middleware enforces admin-only access on all dashboard API routes.

## Authentication Architecture (Firebase)

### Overview
All auth is handled through Firebase Authentication. The system supports Google sign-in (and can be extended to Apple, email/password, phone, etc.).

### Components
1. **Firebase Client SDK** (`firebase` package) — installed in `admin` dashboard for Google sign-in UI
2. **Firebase Admin SDK** (`firebase-admin` package) — installed in `api-server` for server-side ID token verification
3. **Auth Flow**: Client signs in via Firebase → gets ID token → sends to API server → server verifies with Firebase Admin → looks up/creates user in DB → returns admin user profile

### Database Schema
- `users.firebase_uid` (TEXT, UNIQUE) — links Firebase account to internal user
- `users.is_admin` (BOOLEAN) — controls admin dashboard access
- `ADMIN_EMAILS` env var — comma-separated list of emails auto-granted admin on first login

### Environment Variables Required
**Admin Dashboard (Vite env vars):**
- `VITE_FIREBASE_API_KEY` — Firebase Web API key
- `VITE_FIREBASE_AUTH_DOMAIN` — e.g., `tether-app.firebaseapp.com`
- `VITE_FIREBASE_PROJECT_ID` — e.g., `tether-app`
- `VITE_FIREBASE_STORAGE_BUCKET` (optional)
- `VITE_FIREBASE_MESSAGING_SENDER_ID` (optional)
- `VITE_FIREBASE_APP_ID` (optional)

**API Server:**
- `FIREBASE_SERVICE_ACCOUNT_KEY` — Full service account JSON (stringified)
- `FIREBASE_PROJECT_ID` — Alternative to full service account
- `ADMIN_EMAILS` — Comma-separated admin emails for auto-provisioning

### Auth Middleware
- Shared `requireAdmin` middleware in `api-server/src/lib/require-admin.ts`
- Checks (in order): X-Admin-Key header → Firebase ID token → legacy token
- All three admin route files use the shared middleware

## Firestore Security Rules

Firestore security rules are defined in `firestore.rules` at the project root, with composite indexes in `firestore.indexes.json` and configuration in `firebase.json`.

### Collections & Access Control
- **users/{userId}** — Read: self, parent, admin. Create: authenticated (own doc, no self-admin). Update: self or parent (cannot change role/isAdmin/parentId), admin (unrestricted). Delete: admin only.
- **families/{familyId}** — Read: members only. Create: parents (as owner). Update: owner only. Delete: admin only.
- **conversations/{conversationId}** — Read: participants, parents of participants, admin. Create: authenticated (must be in participants, min 2 participants). Update: participants or parents. Delete: admin only.
- **messages/{messageId}** — Read: conversation participants, parents of participants, admin. Create: sender must be self and in conversation. Update/Delete: admin only.
- **contacts/{contactId}** — Read: involved children, parent of child, admin. Create: child (own contact, unapproved). Update/Delete: parent of child or admin.
- **alerts/{alertId}** — Read: target parent or admin. Update: parent (isRead only). Create: server-side only. Delete: admin only.
- **trust_events/{eventId}** — Read: parent of child, child self, admin. Write: server-side only.
- **presence/{userId}** — Read: any authenticated. Write: self only.
- **Default** — All other documents: deny all.

### Key Security Principles
- No user can self-grant admin privileges
- Children's data is only accessible by their linked parent
- Contacts require parental approval before activation
- Alerts are created server-side only, parents can only mark as read
- Trust events are immutable from the client

## Shared Libraries

### `db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Defines schema models and handles database connections. Production migrations are managed by Replit.

### `api-spec` (`@workspace/api-spec`)

Manages the OpenAPI 3.1 specification and Orval configuration for generating API clients and Zod schemas.

### `api-zod` (`@workspace/api-zod`)

Contains generated Zod schemas from the OpenAPI spec, used for validation.

### `api-client-react` (`@workspace/api-client-react`)

Contains generated React Query hooks and fetch client from the OpenAPI spec.

## Analytics Platform

A research-grade analytics platform integrated into the API server and database.
- **DB Schema**: Includes 12 tables and 4 PostgreSQL enum types for comprehensive data storage.
- **Event Ingestion**: Endpoints for unauthenticated event and session tracking from app/web clients.
- **Admin Endpoints**: Secure endpoints for various analytical views, requiring admin authentication.
- **Advanced Analytics**: Behavioral intelligence, network graph analysis, and churn prediction.
- **Compute Engine**: Regularly computes behavioral metrics, network analysis, and churn prediction for child users.
- **AI Research Assistant**: Natural language to SQL query interface via Claude, ensuring data privacy and integrity.
- **Behavioral Engine**: Computes sentiment volatility, anxiety indicators, cognitive fatigue, social avoidance, response latency patterns, and churn risk.
- **Message Intelligence**: Uses Claude to analyze messages for sentiment, emotional tone, topics, and more.
- **Tracking**: Integrated analytics for both website (page views, sessions, waitlist conversions) and mobile app (screen views, message sends, feature usage).

## Dual-Layer Data Architecture (PII Firewall)

Tether uses a strict two-layer data architecture to ensure PII can never co-mingle with analytics data:

**Layer 1 — PII Layer (Parent-Only Access)**
- Contains identifiable data: names, messages, photos, account details
- Only accessible by the parent of that specific child
- Even Tether founders, engineers, and admins cannot access PII
- Parent can export or delete at any time
- Encrypted with parent-scoped keys

**Layer 2 — Anonymized Intelligence Layer (Analytics Access)**
- Stripped of all PII — no names, no message content, no identifiers
- One-way pipeline: PII is stripped before writing to analytics tables
- No foreign keys, no join paths, no reverse-lookup between layers
- Used for: platform health, safety improvements, research, investor metrics
- Accessible by admins, researchers, intelligence dashboard
- Aggregation threshold: minimum 50 families per cohort
- Differential privacy: calibrated statistical noise added

**PII Firewall Audit System**
- Continuous automated schema scan verifying no cross-layer links
- Query audit: every analytics query scanned for PII patterns
- Any violation blocks deployment and triggers immediate alert
- Parents opt-in to contribute anonymized data; participation is never required

**Messaging Policy**
- Website and investor pages use "No PII sold" instead of "No data sold"
- Always clarify: "Not even Tether's creators can see your child's data"
- Anonymized aggregate data may be used for safety research — this is disclosed transparently

## Family Code Enrollment

A system for child enrollment using unique family codes (`TETHER-XXXXXX`). Parents receive auto-generated family codes upon registration. Child enrollment supports joining via code, or logging in with code/parent email + PIN. All PINs are bcrypt hashed (10 rounds).

## Security Hardening

- **Password Hashing**: bcrypt (10 rounds) replaces SHA-256. Legacy SHA-256 hashes auto-upgrade on login.
- **Auth Tokens**: Opaque tokens via `crypto.randomBytes(48).toString("base64url")` stored in `passwordHash` column. Single-mode lookup only (legacy hex.userId bypass removed).
- **Rate Limiting**: In-memory rate limiting on auth routes (login, register, child-login, forgot-password, reset-password).
- **Account Lifecycle**: Forgot password (email reset code via Resend), reset password, delete account (cascades to children).

## Subscription Feature Gating

- **Hook**: `useSubscriptionGate` in `hooks/useSubscriptionGate.ts`
- **Free Tier**: 1 child, basic messaging
- **Premium Tier**: Unlimited children, anti-addiction controls, Faith Mode, advanced alerts
- **Paywall**: Premium badge on gated features, redirects to `/paywall` (RevenueCat integration)

## EAS Build Configuration

- **eas.json**: Development (simulator), Preview (internal), Production (auto-increment) profiles
- **Bundle ID**: `app.tetherapp.mobile` (iOS + Android)
- **App Slug**: `tether` (changed from `mobile`)
- **Submit**: iOS (Apple ID configured, ASC App ID + Team ID need user input), Android (service account key path needed)
- **Permissions**: Camera, Photo Library, Non-exempt encryption declaration

## Contact System

- `contactChildId` is nullable (was formerly hardcoded to 0)
- Search endpoint: `GET /contacts/search?q=` finds children by name or family code
- Contacts start as pending, require parent approval before conversations are created

# External Dependencies

- **Anthropic AI**: Integrated via Replit AI Integrations proxy for AI-powered content moderation using the `claude-haiku-4-5` model.
- **Expo Notifications**: For push notifications to mobile devices.
- **Twilio**: Via Replit connector (`conn_twilio_01KMC6SHEP3313FJVQE7HJXC92`) for SMS alerts.
- **RevenueCat**: Integrated via Replit connector ("Tether" project `projd5c73dce`) for managing subscriptions (`tether_family_monthly` product for `premium` entitlement). Uses `react-native-purchases` client SDK.
- **Google Fonts**: Used for Fraunces font in the website.