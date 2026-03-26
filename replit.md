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
- **Key Features**: Trust levels (1-5), two-pass content filtering (pattern-based + Claude AI), Faith Mode toggle (per-child), contact approval, and COPPA compliance.
- **Navigation**: Structured using `expo-router` with separate flows for onboarding, parent, and child roles, including specific screens for conversations, child details, and alerts.

### `website` (`@workspace/website`)

A marketing website for Tether, built with React, Vite, Tailwind CSS v4, and wouter for routing. It includes:
- **Design**: Fraunces (headings) and Nunito (body) fonts, brand-consistent color scheme, custom logo.
- **Content**: Pages for home, features, schools, churches, Faith Mode, pricing, about, waitlist, and a static blog.
- **SEO**: Per-route SEO metadata managed by a `useSEO` hook.
- **Investor Page**: A static HTML page at `/investors` for pitch deck display.

### `admin` (`@workspace/admin`)

An admin intelligence dashboard built with React, Vite, and Tailwind CSS v4, using Recharts for visualizations. It provides comprehensive analytics and insights across 11 distinct pages, including:
- Overview, Conversation Intelligence, Safety Center, Demographics & Behavior, Engagement Analytics, Content Research, Website Analytics, Behavioral Intelligence, Network Analysis, Predictive Analytics, AI Research Assistant, and Data Catalog (18 tables, 172+ fields, 56 correlation links across 3 research lenses).
- **Authentication**: Uses an `X-Admin-Key` header for API access.

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

## Family Code Enrollment

A system for child enrollment using unique family codes (`TETHER-XXXXXX`). Parents receive auto-generated family codes upon registration. Child enrollment supports joining via code, or logging in with code/parent email + PIN. All PINs are SHA-256 hashed.

# External Dependencies

- **Anthropic AI**: Integrated via Replit AI Integrations proxy for AI-powered content moderation using the `claude-haiku-4-5` model.
- **Expo Notifications**: For push notifications to mobile devices.
- **Twilio**: Via Replit connector (`conn_twilio_01KMC6SHEP3313FJVQE7HJXC92`) for SMS alerts.
- **RevenueCat**: Integrated via Replit connector ("Tether" project `projd5c73dce`) for managing subscriptions (`tether_family_monthly` product for `premium` entitlement). Uses `react-native-purchases` client SDK.
- **Google Fonts**: Used for Fraunces font in the website.