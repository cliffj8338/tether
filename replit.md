# Overview

This project, **Tether**, is a pnpm workspace monorepo using TypeScript to develop a supervised communication application for children. It includes an Express API server, a React Native mobile application for parent and child roles, a marketing website, and an admin dashboard for analytics. Tether aims to create a safe digital communication environment for children through features like AI-powered content filtering (including "Faith Mode"), contact approval flows, and COPPA compliant design. The business model is subscription-based, targeting the market for secure children's communication tools with advanced analytics for parents and administrators.

# User Preferences

I prefer iterative development, with a focus on clear, concise communication. I appreciate detailed explanations when new features or complex architectural decisions are introduced. I expect the agent to ask for confirmation before making any major changes to the codebase or architectural structure.

# System Architecture

## Monorepo Structure

The project uses a pnpm workspace monorepo, separating deployable applications (`artifacts/`), shared libraries (`lib/`), and utility scripts (`scripts/`).

## Core Technologies

- **Monorepo Tool**: pnpm workspaces
- **Node.js**: Version 24
- **TypeScript**: Version 5.9 (composite projects)
- **API Framework**: Express 5
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod (v4) and drizzle-zod
- **API Codegen**: Orval (from OpenAPI spec)
- **Build Tool**: esbuild

## Applications

### `api-server`

An Express 5 API server managing backend logic, data persistence, AI content moderation, push notifications, and SMS.

### `mobile`

An Expo React Native application for parents and children with distinct roles and UIs. Key features include trust levels, two-pass content filtering (pattern-based + Claude AI), Faith Mode, anti-addiction controls, usage tracking, and COPPA compliance. Navigation is structured with `expo-router` for onboarding, parent, and child flows.

### `website`

A marketing website built with React, Vite, Tailwind CSS v4, and wouter. It features a brand-consistent design, essential content pages (home, features, pricing, etc.), SEO, and a static investor page.

### `admin`

An admin intelligence dashboard built with React, Vite, and Tailwind CSS v4, using Recharts for visualizations. It offers extensive analytics across 12 intelligence pages and 6 operational pages (e.g., waitlist, user management). Authentication is handled via Firebase Auth with Google sign-in for admin-only access. A **Showcase Login** mode allows view-only access with an access code (`SHOWCASE_ACCESS_CODE` env var), disabling all write operations and hiding sensitive nav items (Demo Data, Users). Showcase sessions use a server-generated token via `x-showcase-token` header and `blockShowcaseWrites` middleware enforces read-only access on all admin mutation routes.

## Authentication Architecture (Firebase)

Authentication across the system uses Firebase Authentication, supporting Google sign-in. The `admin` dashboard uses the Firebase Client SDK for UI, while the `api-server` uses the Firebase Admin SDK for server-side ID token verification. The database schema includes `users.firebase_uid` and `users.is_admin` for access control, with `ADMIN_EMAILS` environment variable for auto-provisioning. A shared `requireAdmin` middleware enforces admin access on API routes.

## Firestore Security Rules

Firestore security rules, defined in `firestore.rules`, control access to collections like `users`, `families`, `conversations`, `messages`, `contacts`, `alerts`, `trust_events`, and `presence`. Key principles include preventing self-granted admin privileges, parental control over child data, and server-side creation for critical data like alerts and trust events.

## Shared Libraries

- **`db`**: Drizzle ORM with PostgreSQL for database schema and connections.
- **`api-spec`**: Manages OpenAPI 3.1 specification and Orval configuration.
- **`api-zod`**: Contains generated Zod schemas for validation.
- **`api-client-react`**: Contains generated React Query hooks and fetch client.

## Analytics Platform

A research-grade analytics platform integrated into the API server. It includes 12 database tables, event ingestion for tracking, secure admin endpoints, and advanced analytics like behavioral intelligence and churn prediction. A compute engine regularly processes metrics, and an AI Research Assistant provides a natural language to SQL interface. Messaging intelligence uses Claude for sentiment analysis.

## Dual-Layer Data Architecture (PII Firewall)

Tether employs a dual-layer data architecture to prevent PII co-mingling with analytics data. The **PII Layer** contains identifiable data, accessible only by the child's parent, with strong encryption and no admin access. The **Anonymized Intelligence Layer** strips all PII, ensuring no foreign keys or reverse-lookups to the PII layer, and is used for platform health and research. An automated PII firewall audit system verifies no cross-layer links and blocks violations. Parents can opt-in to contribute anonymized data.

## Family Code Enrollment

A system for child enrollment using unique `TETHER-XXXXXX` family codes. Parents receive codes upon registration, and children can join via code or parent email + PIN (bcrypt hashed).

## Security Hardening

Security measures include bcrypt hashing for passwords (10 rounds), opaque auth tokens, in-memory rate limiting on authentication routes, and comprehensive account lifecycle management (forgot password, reset password, delete account).

## Subscription Feature Gating

A `useSubscriptionGate` hook manages access to features based on subscription tiers. A free tier offers basic messaging for one child, while a premium tier provides unlimited children, anti-addiction controls, Faith Mode, and advanced alerts. Gated features redirect to a paywall integrated with RevenueCat.

## EAS Build Configuration

The `eas.json` configuration supports Development, Preview, and Production profiles for the mobile app, with specific bundle IDs and app slugs. Required permissions include Camera and Photo Library access.

## Contact System

The contact system allows children to have contacts that are initially pending and require parent approval before conversations can be created. A search endpoint allows finding children by name or family code.

# External Dependencies

- **Anthropic AI**: Via Replit AI Integrations proxy, using `claude-haiku-4-5` for content moderation.
- **Expo Notifications**: For push notifications to mobile devices.
- **Twilio**: Via Replit connector (`conn_twilio_01KMC6SHEP3313FJVQE7HJXC92`) for SMS alerts.
- **RevenueCat**: Via Replit connector ("Tether" project `projd5c73dce`) for subscription management, utilizing `react-native-purchases`.
- **Google Fonts**: Used for Fraunces font in the website.