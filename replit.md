# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `artifacts/mobile` (`@workspace/mobile`)

Expo React Native mobile app for **Tether** — a supervised kids communication app. Two roles: parent and child.

- **Framework**: Expo SDK 53, expo-router (file-based routing)
- **Fonts**: Fraunces (headings) + Nunito (body) via expo-font
- **Colors/Theme**: `constants/colors.ts` (primary #6B9E8A, accent #7B8EC4, 5 alert levels, faith gold)
- **Typography**: `constants/typography.ts` (Fonts.heading, body, bodyBold, bodySemiBold)
- **Auth**: `context/AuthContext.tsx` with real API auth + AsyncStorage token persistence
- **API Service**: `services/api.ts` — typed fetch wrapper for all API endpoints (auth, children, conversations, messages, contacts, alerts, dashboard)
- **API Hooks**: `hooks/useApiData.ts` — React hooks (useDashboard, useConversations, useMessages, useContacts, useAlerts, useChildDetail) for live data
- **Demo Data**: `hooks/useDemoData.ts` (legacy, no longer imported — kept for reference)

Navigation structure:
- `/index` — splash screen → redirect to `/onboarding`
- `/onboarding` — slides, role selection, parent signup/login, child enrollment (family code join, family code login, email login)
- `/(parent)/` — tab layout: dashboard, messages, alerts, community, settings
- `/(child)/` — tab layout: home (chat list), profile
- `/conversation/[id]` — chat screen with emoji picker (child) or shield button (parent)
- `/child-detail/[id]` — parent view of child: trust level slider, faith mode toggle, contacts, conversations
- `/alert-detail/[id]` — alert detail with flagged message, level tag, and navigation to conversation

Shared UI components in `components/ui/`: Avatar, Badge, AlertLevelTag, StatCard, TetherButton, TetherInput
Custom EmojiPicker in `components/EmojiPicker.tsx` — 5 categories, replaces native keyboard for child accounts

Key features:
- Trust levels 1–5 with color-coded dots and descriptions
- Two-pass content filtering: pattern-based (instant) + Claude AI (contextual) with 5 alert levels
- Faith Mode toggle (Christian values layer, per-child setting) — AI filter adds faith-aware analysis when enabled
- Contact approval flow (parent approves contacts)
- COPPA compliant design: no ads, subscription-only model

### `lib/integrations-anthropic-ai` (`@workspace/integrations-anthropic-ai`)

Anthropic Claude SDK client configured via Replit AI Integrations proxy. Used by the API server for AI-powered content moderation. No API key required — charges billed to Replit credits.

- Uses `claude-haiku-4-5` model for fast, low-cost content analysis
- `ai-content-filter.ts` in `api-server/src/lib/` implements the second-pass filter
- Catches subtle bullying, grooming, peer pressure, social manipulation that pattern matching misses
- Faith Mode adds Christian values analysis when enabled per-child

### Push Notifications & SMS

- **Push**: `expo-notifications` + `expo-device` for Expo push tokens. `pushToken` column in users table. `lib/push-notifications.ts` sends via Expo Push API. All alert levels trigger push to parent.
- **SMS**: Twilio via Replit connector (`conn_twilio_01KMC6SHEP3313FJVQE7HJXC92`). `lib/sms.ts` fetches credentials at runtime. Only Level 4-5 alerts trigger SMS to parent's `phone` column.
- **Settings**: Parent can add/update phone number in settings screen. `PATCH /users/me` endpoint.

### RevenueCat Subscriptions

- **Integration**: RevenueCat connected via Replit connector
- **Project**: "Tether" (projd5c73dce)
- **Product**: `tether_family_monthly` — $9.99/mo monthly subscription
- **Entitlement**: `premium` — gates app access
- **Client SDK**: `react-native-purchases` initialized in `_layout.tsx`, `SubscriptionProvider` wraps app
- **Client lib**: `artifacts/mobile/lib/revenuecat.tsx` — `useSubscription()` hook provides `isSubscribed`, `purchase`, `restore`, `offerings`
- **Paywall**: `/paywall` screen with feature list, price card, confirm modal
- **Settings**: Subscription status shown in parent settings, "Subscribe Now" button if not subscribed, "Restore Purchases" option
- **Seed script**: `scripts/src/seedRevenueCat.ts` — creates project, apps, products, entitlements, offerings, packages
- **Env vars**: `EXPO_PUBLIC_REVENUECAT_TEST_API_KEY`, `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`, `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`, `REVENUECAT_PROJECT_ID`, `REVENUECAT_TEST_STORE_APP_ID`, `REVENUECAT_APPLE_APP_STORE_APP_ID`, `REVENUECAT_GOOGLE_PLAY_STORE_APP_ID`

### Family Code Enrollment

- **Family code format**: `TETHER-XXXXXX` (6 chars from unambiguous charset ABCDEFGHJKLMNPQRSTUVWXYZ23456789), generated with crypto.randomBytes
- **DB column**: `family_code` on users table (partial unique index WHERE NOT NULL), auto-generated for parents on registration
- **Endpoints**: `POST /auth/join-family` (new child + family code), `POST /auth/child-login` (accepts familyCode or parentEmail)
- **Child enrollment 3 paths**: join family (new account via code), login with code + PIN, login with parent email + PIN
- **PIN security**: All PINs hashed with SHA-256 (parent passwords + child PINs), validated as 4-6 digits on client and server
- **Parent settings**: Family code displayed prominently for sharing with kids

### `artifacts/website` (`@workspace/website`)

Marketing website for Tether (tetherapp.app). React + Vite, client-side SPA.

- **Framework**: React + Vite with Tailwind CSS v4 + wouter routing
- **Fonts**: Fraunces (headings, Google Fonts) + Nunito (body)
- **Colors**: Brand colors in CSS custom properties — primary #6B9E8A, accent #7B8EC4, background #F5F6FA
- **Logo**: `TetherLogo` component (`src/components/TetherLogo.tsx`) — SVG cross/connection mark matching the investor site logo. Used in Navbar and Footer.
- **Pages**: Home (`/`), How It Works (`/how-it-works`), For Schools (`/for-schools`), For Churches (`/for-churches`), Faith Mode (`/faith-mode`), Pricing (`/pricing`), About (`/about`), Waitlist (`/waitlist`), Blog (`/blog`), Blog Post (`/blog/:slug`)
- **Investor Page**: Static HTML at `/investors` (served via Vite middleware rewrite from `public/investors.html`). Self-contained 5,600-line pitch deck with `noindex, nofollow`. Not part of the React SPA.
- **Layout**: Shared Navbar (sticky, scroll-aware, mobile hamburger, Solutions dropdown for institutional pages) + Footer with Solutions column
- **Features**: Waitlist modal + dedicated page (role selection: parent/school/church, API submission to POST /api/waitlist), animated sections (framer-motion), per-route SEO metadata
- **Blog**: Static blog with 4 seed articles in `src/lib/blog.ts`, index page + individual post pages
- **Waitlist DB**: `waitlist` table with `waitlist_role` enum (parent/school/church), unique email constraint. API routes: `POST /api/waitlist`, `GET /api/waitlist/count`
- **SEO**: `useSEO` hook sets document.title + meta description + OG/Twitter tags per route
- **Preview path**: `/` (root)
- **Key dependencies**: framer-motion, clsx, tailwind-merge, lucide-react

### `artifacts/admin` (`@workspace/admin`)

Admin intelligence dashboard for Tether. React + Vite, Recharts visualizations.

- **Framework**: React + Vite with Tailwind CSS v4
- **Pages**: Overview, Conversation Intelligence, Safety Center, Demographics & Behavior, Engagement Analytics, Content Research, Website Analytics, Behavioral Intelligence, Network Analysis, Predictive Analytics, AI Research Assistant (11 total)
- **API Client**: `src/lib/api.ts` — typed fetch client with admin key auth, 10 query endpoints + compute + AI query
- **Auth**: Uses `X-Admin-Key` header (dev default: `tether-admin-dev`; production: `ADMIN_API_KEY` env var)
- **Preview path**: `/admin`
- **Key dependencies**: recharts, lucide-react

### Analytics Platform

Research-grade analytics covering both mobile app and website:

- **DB Schema**: `lib/db/src/schema/analytics.ts` — 12 tables (7 original + 5 new: `behavioral_metrics`, `network_graph`, `churn_predictions`, `temporal_anomalies`, `interest_graph`) + 4 PG enum types
- **Event Ingestion**: `POST /api/analytics/events` (unauthenticated, for app/web clients), `POST /api/analytics/sessions`
- **Admin Endpoints**: `GET /api/admin/analytics/{overview,conversations,safety,demographics,engagement,content,website}` — all require admin auth (X-Admin-Key or parent user token)
- **Advanced Analytics Endpoints**: `GET /api/admin/analytics/{behavioral,network,predictions}` — behavioral intelligence, network graph analysis, churn predictions with risk factors
- **Compute Engine**: `POST /api/admin/analytics/compute` — runs behavioral metrics, network analysis, and churn prediction for all child users. Uses upsert (ON CONFLICT) to prevent duplicate rows.
- **AI Research Assistant**: `POST /api/admin/analytics/query` — natural language to SQL via Claude claude-haiku-4-5. Strips comments, blocks PII columns (email, password, content, ip_hash), forbids mutations, enforces LIMIT 100.
- **Behavioral Engine**: `artifacts/api-server/src/lib/behavioral-engine.ts` — computes sentiment volatility, anxiety indicators, cognitive fatigue, social avoidance, response latency patterns, churn risk (Silence Gradient model), network influence/reciprocity/roles
- **Message Intelligence**: `artifacts/api-server/src/lib/message-intelligence.ts` — Claude claude-haiku-4-5 analyzes every message for sentiment, emotional tone, topic category, keywords, vocabulary complexity, emoji/slang usage, interest nouns/verbs, interaction depth (fire-and-forget)
- **Website Tracking**: `artifacts/website/src/lib/analytics.ts` — page views, session tracking, waitlist conversions; integrated into App.tsx via AnalyticsTracker component
- **Mobile Tracking**: `artifacts/mobile/services/analytics.ts` — screen views, message sends, feature usage, session management

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts exec tsx src/<script>.ts`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
