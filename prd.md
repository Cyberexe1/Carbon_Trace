# Product Requirements Document (PRD)
## Carbon Footprint Awareness Platform

---

**Document Version:** 1.0.0  
**Date:** June 10, 2026  
**Status:** Draft  
**Platform:** Web (React Frontend) + Firebase / Google Cloud Backend  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision & Goals](#3-product-vision--goals)
4. [Target Audience](#4-target-audience)
5. [Google Firebase / GCP Services Architecture](#5-google-firebase--gcp-services-architecture)
6. [Feature Requirements](#6-feature-requirements)
7. [Frontend Architecture (React)](#7-frontend-architecture-react)
8. [File Structure](#8-file-structure)
9. [Code Quality Standards](#9-code-quality-standards)
10. [Security Requirements](#10-security-requirements)
11. [Efficiency & Performance](#11-efficiency--performance)
12. [Testing Strategy](#12-testing-strategy)
13. [Accessibility Standards](#13-accessibility-standards)
14. [Additional Quality Parameters](#14-additional-quality-parameters)
15. [Non-Functional Requirements](#15-non-functional-requirements)
16. [Milestones & Timeline](#16-milestones--timeline)
17. [Success Metrics](#17-success-metrics)

---

## 1. Executive Summary

The **Carbon Footprint Awareness Platform** is a web-based application built with React that empowers individuals to understand, track, and actively reduce their personal carbon emissions. Users log daily activities across categories like transportation, diet, energy usage, and shopping. The platform computes real-time carbon scores, delivers AI-powered personalized reduction recommendations, and provides gamified challenges to sustain behavioral change.

The platform leverages **Google Firebase** and **Google Cloud Platform (GCP)** services as its backbone — ensuring scalability, real-time data sync, secure authentication, and intelligent analytics at minimal operational overhead.

---

## 2. Problem Statement

### The Core Gap
Individuals produce an average of **4–16 tons of CO₂ equivalent per year** (source: EPA / World Bank). Yet:

- **73% of people** do not know their personal carbon footprint (Yale Program on Climate Change Communication, 2024)
- Existing tools are either too technical, too vague, or fail to sustain user engagement beyond initial curiosity
- There is no single platform that combines **tracking + education + actionable nudges + community accountability** in an accessible, inclusive UI

### What Is Being Solved
This platform bridges the awareness-to-action gap by making carbon tracking:
- **Simple** — log in under 2 minutes per day
- **Personal** — insights tailored to your habits and geography
- **Actionable** — concrete steps ranked by impact and feasibility
- **Engaging** — streaks, badges, challenges, and leaderboards

---

## 3. Product Vision & Goals

### Vision
> "Make every individual's environmental impact visible, measurable, and improvable — one action at a time."

### Goals

| Priority | Goal | KPI |
|----------|------|-----|
| P0 | Users can log daily carbon-producing activities | DAU log completion rate ≥ 70% |
| P0 | Platform computes accurate carbon scores | Calculation error < 2% vs. IPCC benchmarks |
| P1 | Personalized reduction suggestions surfaced | CTR on suggestions ≥ 25% |
| P1 | Users can track historical trends | Retention D30 ≥ 40% |
| P2 | Community challenges and leaderboards | Challenge participation ≥ 30% of active users |
| P2 | Carbon offset marketplace integration | 15% of users initiate an offset action |

---

## 4. Target Audience

### Primary Users
- **Eco-conscious millennials and Gen Z** (18–35), digitally native, motivated by social accountability
- **Corporate employees** participating in company sustainability programs
- **Students** researching or actively tracking environmental impact

### Secondary Users
- **Educators** using the platform for classroom climate modules
- **NGOs and sustainability advocates** looking for data-driven community engagement tools

### User Personas

#### Persona 1 — "The Beginner"
- Name: Priya, 24, student
- Motivation: Learned about climate change, wants to understand personal impact
- Pain: Doesn't know where to start, overwhelmed by complexity
- Need: Simple onboarding, guided first-week experience

#### Persona 2 — "The Committed Reducer"
- Name: Marcus, 34, software engineer
- Motivation: Has been tracking for 6 months, wants deeper insights
- Pain: Current spreadsheet is manual and boring
- Need: Automation, trend analysis, peer comparison

#### Persona 3 — "The Community Champion"
- Name: Aisha, 29, sustainability coordinator at a company
- Motivation: Wants to run team challenges and see group impact
- Pain: No existing tool supports team-level tracking
- Need: Group dashboards, shareable reports, leaderboard

---

## 5. Google Firebase / GCP Services Architecture

### Firebase Services Used

#### 5.1 Firebase Authentication
- **Purpose:** Secure user identity management
- **Implementation:**
  - Google Sign-In (OAuth 2.0) as primary auth method
  - Email/Password as fallback
  - Anonymous sessions for onboarding demo mode
- **Security Rules:** Role-based — `user`, `admin`, `org_admin`
- **Why Firebase Auth:** Zero-cost for under 10K MAU, built-in session management, seamless integration with Firestore security rules

#### 5.2 Cloud Firestore
- **Purpose:** Primary NoSQL database for user profiles, activity logs, goals, and leaderboard data
- **Data Model:**

```
/users/{userId}
  - displayName: string
  - email: string
  - location: string (country/region for emission factor lookup)
  - createdAt: timestamp
  - totalScore: number (lifetime kg CO₂e)
  - streak: number

/users/{userId}/activities/{activityId}
  - category: enum [transport, diet, energy, shopping, waste]
  - subtype: string (e.g., "car_petrol_medium")
  - quantity: number
  - unit: string
  - carbonKg: number (calculated)
  - date: timestamp
  - notes: string

/users/{userId}/goals/{goalId}
  - title: string
  - targetReduction: number (kg CO₂e)
  - deadline: timestamp
  - progress: number
  - status: enum [active, completed, failed]

/challenges/{challengeId}
  - title: string
  - description: string
  - startDate: timestamp
  - endDate: timestamp
  - category: string
  - participants: array<userId>
  - leaderboard: map<userId, score>

/emissionFactors/{category}/{subtype}
  - factor: number (kg CO₂e per unit)
  - unit: string
  - source: string (IPCC / EPA)
  - lastUpdated: timestamp
```

- **Firestore Security Rules:** Users can only read/write their own documents. Public challenges are read-only for all authenticated users.

#### 5.3 Firebase Cloud Functions (Gen 2)
- **Purpose:** Server-side logic without managing infrastructure
- **Functions Implemented:**

| Function | Trigger | Purpose |
|----------|---------|---------|
| `calculateCarbonScore` | Firestore onWrite (activity doc) | Recalculates total and category scores |
| `generateRecommendations` | Scheduled (daily, per user) | Calls Vertex AI to produce personalized tips |
| `updateLeaderboard` | Firestore onWrite (activity doc) | Updates challenge leaderboard in real-time |
| `sendWeeklyDigest` | Scheduled (weekly) | Sends email summary via Firebase Extensions |
| `onUserCreate` | Auth onCreate | Initializes user profile and default goals |

#### 5.4 Firebase Hosting
- **Purpose:** Host the React SPA with global CDN
- **Configuration:**
  - Custom domain support
  - HTTPS enforced (HTTP → HTTPS redirect)
  - Cache-Control headers for static assets
  - `firebase.json` rewrites for SPA routing
- **Performance:** Firebase Hosting serves from Google's edge network — sub-100ms TTFB in most regions

#### 5.5 Google Analytics 4 (GA4)
- **Purpose:** User behavior analytics, funnel analysis, and retention tracking
- **Events Tracked:**

| Event Name | Parameters | Purpose |
|------------|-----------|---------|
| `activity_logged` | `category`, `carbon_kg` | Track logging engagement |
| `recommendation_clicked` | `recommendation_id`, `type` | Measure suggestion CTR |
| `challenge_joined` | `challenge_id` | Track community engagement |
| `goal_created` | `target_kg`, `deadline_days` | Goal-setting behavior |
| `offset_initiated` | `provider`, `amount_kg` | Conversion tracking |
| `onboarding_completed` | `steps_completed` | Funnel drop-off analysis |

- **GA4 Integration:** Firebase SDK auto-collects screen views. Custom events sent via `logEvent()`.
- **Audiences:** Custom audiences for "Active Reducers" (logged ≥ 5 activities/week), "At Risk" (no log in 7 days) — used for re-engagement push notifications

#### 5.6 Firebase Cloud Messaging (FCM)
- **Purpose:** Push notifications for streaks, challenge reminders, weekly summaries
- **Notification Types:**
  - Streak maintenance reminders (daily if user hasn't logged)
  - Challenge milestone alerts ("You're in the top 10!")
  - Weekly carbon report ready
  - New community challenge available

#### 5.7 Vertex AI (Google Cloud)
- **Purpose:** AI-powered personalized recommendations
- **Implementation:**
  - Model: Gemini 1.5 Flash (cost-optimized for per-user inference)
  - Input: User's 30-day activity history, location, stated goals
  - Output: 3–5 ranked actionable recommendations with estimated CO₂ savings
  - Invoked via Cloud Function — never directly from client (prevents key exposure)
- **Prompt Engineering:**
  ```
  Given user profile: [location], [top 3 emission categories], [weekly trend],
  generate 3 specific, measurable, actionable carbon reduction tips.
  Each tip must include: estimated weekly CO₂ saving in kg, difficulty level (1-5),
  and a single concrete first step. Format as JSON.
  ```

#### 5.8 Firebase Remote Config
- **Purpose:** Feature flags and A/B testing without redeployment
- **Use Cases:**
  - Toggle experimental UI features per user segment
  - A/B test recommendation card designs
  - Gradually roll out new emission categories

---

## 6. Feature Requirements

### 6.1 Onboarding Flow
- **FR-001:** New users complete a 3-step onboarding quiz (location, lifestyle type, top concern area)
- **FR-002:** System generates an estimated baseline carbon score from quiz answers
- **FR-003:** Onboarding ends with a personalized "Your First Goal" suggestion
- **FR-004:** Anonymous/demo mode available without account creation (data stored locally for 24h)

### 6.2 Activity Logging
- **FR-010:** Users log activities across 5 categories: Transport, Diet, Energy, Shopping, Waste
- **FR-011:** Each category has predefined subtypes with emission factors from IPCC/EPA databases
- **FR-012:** Quick-log mode: one-tap logging for frequent activities (user-defined favorites)
- **FR-013:** Bulk import via CSV for power users
- **FR-014:** Voice-to-text logging on mobile browsers using Web Speech API
- **FR-015:** Activities editable and deletable within 24 hours of logging

### 6.3 Dashboard & Analytics
- **FR-020:** Real-time carbon score (kg CO₂e today, this week, this month, this year)
- **FR-021:** Category breakdown donut chart (% by transport, diet, etc.)
- **FR-022:** Historical trend line chart (daily/weekly/monthly toggle)
- **FR-023:** Comparison to national and global averages (pulled from static dataset)
- **FR-024:** "Carbon Equivalents" display (e.g., "Your weekly emissions = driving 847 km")
- **FR-025:** Streak counter and longest streak badge

### 6.4 Personalized Recommendations
- **FR-030:** AI-generated recommendations refreshed daily via Vertex AI
- **FR-031:** Each recommendation shows: action, estimated CO₂ saving, difficulty rating
- **FR-032:** Users can mark recommendations as "Done", "Saved", or "Not for me"
- **FR-033:** "Not for me" feedback used to improve future suggestions (stored in Firestore)
- **FR-034:** Static fallback recommendations if AI inference fails (pre-curated list)

### 6.5 Goal Setting
- **FR-040:** Users set reduction goals with target (kg CO₂e), category, and deadline
- **FR-041:** Progress tracked automatically as activities are logged
- **FR-042:** Milestone notifications at 25%, 50%, 75%, 100% completion
- **FR-043:** Completed goals archived with celebration animation

### 6.6 Community & Challenges
- **FR-050:** Monthly platform-wide challenges (e.g., "Meatless March")
- **FR-051:** Users join challenges and see a leaderboard (opt-in, pseudonymous option)
- **FR-052:** Team challenges: users invite friends/colleagues to a private group
- **FR-053:** Challenge completion earns badges displayed on profile

### 6.7 Carbon Offset Marketplace
- **FR-060:** Curated list of verified offset projects (Gold Standard / VCS certified)
- **FR-061:** Users can calculate offset cost for their monthly emissions
- **FR-062:** External link to offset purchase (affiliate/partner integration — no in-app payments in V1)
- **FR-063:** Purchased offsets logged and reflected in net carbon score

### 6.8 Educational Hub
- **FR-070:** Article library on climate science, emission categories, reduction strategies
- **FR-071:** Embedded short videos (YouTube embed via iframe)
- **FR-072:** Glossary of carbon/climate terms (searchable)
- **FR-073:** "Myth vs. Fact" interactive cards

### 6.9 Settings & Profile
- **FR-080:** Update location, display name, notification preferences
- **FR-081:** Export personal data as JSON (GDPR compliance)
- **FR-082:** Delete account with full data removal (Cloud Function + Firestore cascade delete)
- **FR-083:** Dark mode toggle (persisted in localStorage + Firebase Remote Config default)

---

## 7. Frontend Architecture (React)

### Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Framework | React 18 + Vite | Fast HMR, modern React features (Suspense, concurrent) |
| Language | TypeScript | Type safety reduces runtime errors; improves maintainability |
| State Management | Zustand | Lightweight, no boilerplate, works well with Firebase real-time |
| Routing | React Router v6 | Declarative, nested routing support |
| UI Components | shadcn/ui + Tailwind CSS | Accessible by default, fully customizable |
| Charts | Recharts | React-native, accessible, lightweight |
| Forms | React Hook Form + Zod | Schema validation, minimal re-renders |
| Firebase SDK | Firebase JS SDK v10 | Modular imports (tree-shakeable) |
| Testing | Vitest + React Testing Library | Fast, Jest-compatible, native Vite integration |
| E2E Testing | Playwright | Cross-browser, reliable E2E |
| Linting | ESLint + Prettier | Consistent code style |
| Accessibility | axe-core (dev), ARIA patterns | WCAG 2.1 AA compliance |

### Component Design Principles
1. **Atomic Design** — Atoms → Molecules → Organisms → Pages → Templates
2. **Single Responsibility** — Each component has one clear purpose
3. **Composition over Inheritance** — Prefer composable component APIs
4. **Accessibility-First** — ARIA attributes and keyboard navigation built in from the start
5. **Performance by Default** — `React.memo`, `useMemo`, `useCallback` applied where profiling justifies it

---

## 8. File Structure

```
carbon-footprint-platform/
│
├── public/
│   ├── favicon.ico
│   ├── manifest.json               # PWA manifest
│   └── robots.txt
│
├── src/
│   ├── main.tsx                    # App entry point — mounts React root
│   ├── App.tsx                     # Root component — router + providers setup
│   ├── vite-env.d.ts               # Vite TypeScript environment types
│   │
│   ├── assets/                     # Static assets (images, icons, fonts)
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/                 # Reusable UI components (Atomic Design)
│   │   ├── atoms/                  # Smallest building blocks
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Badge/
│   │   │   ├── Icon/
│   │   │   ├── Spinner/
│   │   │   └── Typography/
│   │   │
│   │   ├── molecules/              # Composed from atoms
│   │   │   ├── ActivityCard/
│   │   │   ├── CarbonMeter/
│   │   │   ├── GoalProgressBar/
│   │   │   ├── RecommendationCard/
│   │   │   ├── StatWidget/
│   │   │   └── NotificationBell/
│   │   │
│   │   ├── organisms/              # Complex UI sections
│   │   │   ├── ActivityLogger/
│   │   │   ├── DashboardHeader/
│   │   │   ├── CategoryBreakdown/
│   │   │   ├── ChallengeLeaderboard/
│   │   │   ├── RecommendationList/
│   │   │   └── NavigationSidebar/
│   │   │
│   │   └── layout/                 # Page layout wrappers
│   │       ├── AppLayout.tsx
│   │       ├── AuthLayout.tsx
│   │       └── DashboardLayout.tsx
│   │
│   ├── pages/                      # Route-level page components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── OnboardingPage.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   │
│   │   ├── log/
│   │   │   └── ActivityLogPage.tsx
│   │   │
│   │   ├── insights/
│   │   │   └── InsightsPage.tsx
│   │   │
│   │   ├── goals/
│   │   │   └── GoalsPage.tsx
│   │   │
│   │   ├── community/
│   │   │   └── CommunityPage.tsx
│   │   │
│   │   ├── learn/
│   │   │   └── LearnPage.tsx
│   │   │
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx
│   │   │
│   │   └── NotFoundPage.tsx
│   │
│   ├── features/                   # Feature-specific logic (co-located with UI)
│   │   ├── auth/
│   │   │   ├── useAuth.ts          # Auth hook — wraps Firebase Auth
│   │   │   ├── AuthProvider.tsx    # Context provider for auth state
│   │   │   └── authUtils.ts        # Token refresh, session helpers
│   │   │
│   │   ├── activities/
│   │   │   ├── useActivities.ts    # CRUD hooks for activity logs
│   │   │   ├── activitySchema.ts   # Zod schemas for activity forms
│   │   │   ├── emissionFactors.ts  # Static emission factor lookup table
│   │   │   └── carbonCalculator.ts # Pure function: quantity × factor → kg CO₂e
│   │   │
│   │   ├── dashboard/
│   │   │   ├── useDashboardData.ts # Aggregation hook — reads Firestore
│   │   │   └── chartDataTransformers.ts # Transform raw logs → chart-ready data
│   │   │
│   │   ├── recommendations/
│   │   │   ├── useRecommendations.ts
│   │   │   └── fallbackRecommendations.ts # Static list when AI is unavailable
│   │   │
│   │   ├── goals/
│   │   │   ├── useGoals.ts
│   │   │   └── goalCalculations.ts
│   │   │
│   │   └── community/
│   │       ├── useChallenges.ts
│   │       └── leaderboardHelpers.ts
│   │
│   ├── hooks/                      # Global reusable hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useOnlineStatus.ts      # Detect offline state for PWA
│   │   └── useAccessibilityAnnouncer.ts  # Screen reader live region hook
│   │
│   ├── services/                   # External service integrations
│   │   ├── firebase/
│   │   │   ├── config.ts           # Firebase app initialization (env vars only)
│   │   │   ├── auth.ts             # Auth service functions
│   │   │   ├── firestore.ts        # Firestore service functions
│   │   │   ├── functions.ts        # Cloud Functions caller wrappers
│   │   │   ├── messaging.ts        # FCM token management
│   │   │   └── analytics.ts        # GA4 event logging helpers
│   │   │
│   │   └── api/
│   │       └── offsetMarketplace.ts # External offset API integration
│   │
│   ├── store/                      # Zustand global state
│   │   ├── authStore.ts            # User session state
│   │   ├── uiStore.ts              # Theme, sidebar, modal state
│   │   ├── activityStore.ts        # Cached activity logs
│   │   └── notificationStore.ts    # In-app notification queue
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── activity.types.ts
│   │   ├── user.types.ts
│   │   ├── challenge.types.ts
│   │   ├── recommendation.types.ts
│   │   └── firebase.types.ts
│   │
│   ├── utils/                      # Pure utility functions
│   │   ├── formatters.ts           # Date, number, CO₂ unit formatters
│   │   ├── validators.ts           # Input validation helpers
│   │   ├── constants.ts            # App-wide constants (categories, colors)
│   │   ├── carbonEquivalents.ts    # CO₂ → human-readable equivalents
│   │   └── errorHandlers.ts        # Centralized error parsing/logging
│   │
│   ├── styles/                     # Global styles
│   │   ├── globals.css             # Tailwind base + custom CSS variables
│   │   └── themes.css              # Light/dark theme tokens
│   │
│   └── config/                     # App configuration
│       ├── routes.ts               # Centralized route constants
│       └── featureFlags.ts         # Remote Config keys and defaults
│
├── functions/                      # Firebase Cloud Functions (Node.js)
│   ├── src/
│   │   ├── index.ts                # Function exports entry point
│   │   ├── calculateCarbonScore.ts
│   │   ├── generateRecommendations.ts
│   │   ├── updateLeaderboard.ts
│   │   ├── sendWeeklyDigest.ts
│   │   └── onUserCreate.ts
│   ├── package.json
│   └── tsconfig.json
│
├── tests/                          # E2E and integration tests
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   ├── activity-logging.spec.ts
│   │   └── dashboard.spec.ts
│   └── integration/
│       ├── carbonCalculator.test.ts
│       └── firestore.test.ts
│
├── .env.example                    # Environment variable template (no secrets)
├── .env.local                      # Local secrets — NEVER committed
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── firebase.json                   # Firebase hosting + functions config
├── firestore.rules                 # Firestore security rules
├── firestore.indexes.json          # Composite index definitions
├── storage.rules                   # Firebase Storage security rules
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── playwright.config.ts
└── README.md
```

---

## 9. Code Quality Standards

### 9.1 Structure & Organization
- **Feature-based co-location:** Logic, components, and tests live together in `/features/`
- **Barrel exports:** Each directory exposes a clean `index.ts` — internal structure is hidden
- **No circular dependencies:** Enforced via ESLint `import/no-cycle` rule
- **Strict TypeScript:** `"strict": true` in `tsconfig.json` — no implicit `any`

### 9.2 Readability & Naming
- Components: `PascalCase` (e.g., `ActivityCard.tsx`)
- Hooks: `camelCase` prefixed with `use` (e.g., `useActivities.ts`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `EMISSION_CATEGORIES`)
- Types/Interfaces: `PascalCase` prefixed with `I` for interfaces (e.g., `IActivity`)
- Files: `kebab-case` for non-component files (e.g., `carbon-calculator.ts`)

### 9.3 Inline & Section Comments
Every file includes structured comments marking major sections:

```tsx
// =============================================================================
// SECTION: Imports & Dependencies
// =============================================================================
import React, { useState, useCallback } from 'react';
import { useActivities } from '@/features/activities/useActivities';

// =============================================================================
// SECTION: Type Definitions
// =============================================================================
interface ActivityLoggerProps {
  userId: string;
  onSuccess?: () => void;
}

// =============================================================================
// SECTION: Component — ActivityLogger
// Allows users to log a new carbon-producing activity.
// Renders a form with category selection, subtype, and quantity input.
// On submit: calls useActivities.addActivity() which writes to Firestore
// and triggers the calculateCarbonScore Cloud Function.
// =============================================================================
export const ActivityLogger: React.FC<ActivityLoggerProps> = ({ userId, onSuccess }) => {

  // --- Local State ---
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // --- Custom Hook: activity CRUD operations ---
  const { addActivity, isLoading } = useActivities(userId);

  // --- Handler: form submission ---
  // Validates input via Zod schema before sending to Firestore
  const handleSubmit = useCallback(async (data: ActivityFormData) => {
    // ... implementation
  }, [addActivity]);

  // --- Render ---
  return (
    // JSX here
  );
};
```

### 9.4 Error Handling
- All async operations wrapped in `try/catch` with centralized error parsing via `errorHandlers.ts`
- Firebase errors mapped to user-friendly messages (never expose raw error codes to UI)
- Error boundaries at the page level (`React.ErrorBoundary`) to prevent full app crashes
- Offline state handled gracefully with `useOnlineStatus` hook and queued writes

### 9.5 Code Review Checklist
Before every merge, reviewers verify:
- [ ] TypeScript strict compliance — no `any` escapes
- [ ] All new components have corresponding unit tests
- [ ] No hardcoded secrets or API keys
- [ ] All user-facing strings support i18n (wrapped in translation function)
- [ ] New Firestore queries have matching index definitions
- [ ] Accessibility — semantic HTML and ARIA attributes present
- [ ] Performance — no unnecessary re-renders in hot paths
- [ ] Section comments present on files > 50 lines

---

## 10. Security Requirements

### 10.1 Authentication Security
- Firebase Auth enforces email verification before access to core features
- Session tokens auto-expire; refresh tokens rotated on suspicious activity
- `httpOnly` cookies not applicable (SPA) — tokens stored in memory, not `localStorage`
- CSRF protection: Firebase ID tokens are short-lived (1 hour) and verified server-side in Cloud Functions

### 10.2 Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Activities sub-collection — same ownership rule
      match /activities/{activityId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Emission factors — public read, admin-only write
    match /emissionFactors/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
    
    // Challenges — authenticated read, Cloud Function write only
    match /challenges/{challengeId} {
      allow read: if request.auth != null;
      allow write: if false; // Only Cloud Functions write via Admin SDK
    }
  }
}
```

### 10.3 Environment Variables
- All Firebase config values stored in `.env.local` — never committed
- Vite exposes only `VITE_` prefixed variables to the client
- Sensitive keys (Vertex AI, admin credentials) stored in **Cloud Secret Manager** — accessed only by Cloud Functions
- `.env.example` template committed with placeholder values for developer onboarding

### 10.4 Input Validation & Sanitization
- All form inputs validated client-side with Zod schemas before submission
- Firestore rules enforce data types and ranges server-side as second layer
- No direct user-controlled strings passed to Firestore queries without sanitization
- XSS prevention: React's JSX escaping + Content Security Policy header via Firebase Hosting

### 10.5 Data Privacy
- Location data stored at country/region level only — never GPS coordinates
- GDPR compliant: data export (FR-081) and deletion (FR-082) implemented
- Analytics data anonymized — no PII in GA4 events
- Firebase App Check enforced to prevent unauthorized API access from non-app clients

---

## 11. Efficiency & Performance

### 11.1 Frontend Performance
- **Code splitting:** React Router + dynamic `import()` for each route — initial bundle < 150KB gzipped
- **Tree shaking:** Firebase SDK v10 modular imports — only used modules included
- **Image optimization:** WebP format, `loading="lazy"` on all below-fold images
- **Memoization:** `React.memo` on list items, `useMemo` on expensive chart data transformations
- **Virtualization:** `react-window` for activity log lists > 100 items

### 11.2 Firestore Query Optimization
- Pagination with `limit()` + `startAfter()` cursors — never fetch unbounded collections
- Composite indexes defined in `firestore.indexes.json` for multi-field queries
- Client-side caching with Firestore's built-in offline persistence enabled
- Aggregate totals (monthly score) stored as denormalized fields — updated by Cloud Functions to avoid expensive client-side aggregations

### 11.3 Cloud Functions Efficiency
- Cold start mitigation: Functions deployed with minimum 1 instance for critical paths
- `generateRecommendations` runs on a schedule (not on every write) to control Vertex AI costs
- Batched Firestore writes in leaderboard updates using `WriteBatch`

### 11.4 Network Efficiency
- Firebase Hosting: static assets cached with `Cache-Control: max-age=31536000, immutable`
- Firestore real-time listeners used only on the dashboard — other pages use one-time reads
- Debounced search inputs (300ms) to prevent excessive Firestore reads

### 11.5 PWA & Offline Support
- Service Worker (Workbox via Vite PWA plugin) caches shell + emission factor data
- Offline activity logging queued in localStorage and synced on reconnect
- Background sync for deferred writes (where supported)

---

## 12. Testing Strategy

### 12.1 Unit Tests (Vitest + React Testing Library)

| What to Test | Coverage Target | Example |
|-------------|----------------|---------|
| Carbon calculator pure functions | 100% | `carbonCalculator.test.ts` |
| Zod validation schemas | 100% | All edge cases — negative quantity, invalid category |
| Zustand store actions | 90%+ | State transitions after add/remove activity |
| React components (rendering) | 80%+ | Button states, form validation messages |
| Utility formatters | 100% | Date format edge cases, large number formatting |

### 12.2 Integration Tests (Vitest + Firebase Emulator)
- Test Firestore security rules using Firebase Emulator Suite
- Test Cloud Functions with emulated Firestore and Auth
- Cover: correct score calculation on activity write, leaderboard update correctness

### 12.3 End-to-End Tests (Playwright)

| Scenario | Priority |
|----------|---------|
| Complete onboarding flow | P0 |
| Log an activity and verify dashboard score updates | P0 |
| Create and complete a goal | P1 |
| Join a challenge and verify leaderboard | P1 |
| Export user data | P2 |
| Delete account and verify data removal | P2 |

### 12.4 Accessibility Testing
- **Automated:** `axe-core` integrated into Vitest via `jest-axe` — runs on every component render test
- **Automated E2E:** Playwright + `@axe-core/playwright` scans each page in E2E suite
- **Manual:** Screen reader testing with NVDA (Windows) and VoiceOver (macOS) on critical paths

### 12.5 Performance Testing
- Lighthouse CI integrated into CI/CD pipeline — fails build if Performance score < 90
- Core Web Vitals thresholds: LCP < 2.5s, FID < 100ms, CLS < 0.1

### 12.6 Security Testing
- OWASP ZAP scan on staging environment before each release
- Firestore security rules tested exhaustively via Firebase Emulator with positive and negative cases
- Dependency audit: `npm audit` in CI, blocks on high/critical vulnerabilities

---

## 13. Accessibility Standards

### 13.1 WCAG 2.1 AA Compliance
All features meet or exceed WCAG 2.1 AA guidelines:

- **1.1.1 Non-text Content:** All icons have `aria-label` or `aria-hidden="true"` if decorative
- **1.3.1 Info and Relationships:** Semantic HTML (`<main>`, `<nav>`, `<article>`, `<section>`, headings hierarchy)
- **1.4.3 Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text — verified with Figma contrast checker
- **1.4.4 Resize Text:** UI functional and readable at 200% browser zoom
- **2.1.1 Keyboard:** All interactive elements reachable and operable via keyboard alone
- **2.4.3 Focus Order:** Logical tab order maintained throughout application
- **2.4.7 Focus Visible:** Custom focus ring styles using Tailwind `focus-visible:ring`
- **3.2.2 On Input:** No unexpected context changes on form field focus
- **4.1.2 Name, Role, Value:** All form controls have labels; dynamic state exposed via ARIA

### 13.2 Component-Level Accessibility

```tsx
// ✅ Good: Accessible activity category selector
<fieldset>
  <legend className="sr-only">Select activity category</legend>
  {EMISSION_CATEGORIES.map((category) => (
    <label key={category.id} className="...">
      <input
        type="radio"
        name="category"
        value={category.id}
        aria-describedby={`category-desc-${category.id}`}
      />
      <span>{category.label}</span>
      <span id={`category-desc-${category.id}`} className="sr-only">
        {category.description}
      </span>
    </label>
  ))}
</fieldset>
```

### 13.3 Color & Visual Design
- Color is never the sole means of conveying information (error states use icon + text + color)
- Charts include pattern fills in addition to color for colorblind users
- Dark mode tested for WCAG contrast compliance independently of light mode

### 13.4 Internationalization (i18n) Foundation
- All user-facing strings extracted to locale files (`en.json`, extensible)
- `react-i18next` used for translation hooks
- RTL layout support via Tailwind `rtl:` prefix utilities (preparatory)
- Number and date formatting via `Intl` API — locale-aware

### 13.5 Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all non-essential animations */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 14. Additional Quality Parameters

### 14.1 Maintainability
- **Dependency management:** Exact version pinning in `package.json` — no `^` or `~` ranges on critical deps
- **Deprecation policy:** Dependencies reviewed quarterly; deprecated packages replaced within 1 sprint
- **Documentation:** Each `/features/` module includes a `README.md` explaining its purpose, API, and usage examples
- **ADRs (Architecture Decision Records):** Stored in `/docs/decisions/` — document why key architectural choices were made

### 14.2 Observability
- **Error monitoring:** Firebase Crashlytics equivalent via custom Cloud Function + GA4 exception events
- **Performance monitoring:** Firebase Performance Monitoring SDK for real-user metrics (page load, network)
- **Logging:** Structured JSON logs in Cloud Functions via `firebase-functions/logger`
- **Alerting:** Cloud Monitoring alerts on Cloud Function error rate > 1% and p99 latency > 5s

### 14.3 Scalability
- Firestore handles millions of documents natively — no architectural changes needed up to 100K MAU
- Firebase Hosting CDN scales automatically — no server capacity planning for static assets
- Cloud Functions scale to 1000+ concurrent instances by default
- Leaderboard architecture uses server-side aggregation (not client-side joins) to remain O(1) read regardless of participant count

### 14.4 DevOps & CI/CD
- **GitHub Actions pipeline:**
  1. Lint (ESLint + Prettier check)
  2. Type check (`tsc --noEmit`)
  3. Unit tests (Vitest)
  4. Build (`vite build`)
  5. Lighthouse CI
  6. E2E tests (Playwright, on staging)
  7. Security audit (`npm audit --audit-level=high`)
  8. Deploy to Firebase Hosting (main branch → production)
- **Branch strategy:** `main` (production), `develop` (integration), feature branches
- **Environment parity:** Firebase Emulator Suite mirrors production for local development

### 14.5 Internationalization & Localization
- Phase 1 ships in English only — i18n infrastructure in place
- Phase 2 targets: Spanish, French, German, Hindi (by user geography data from GA4)
- Emission factors localized by country (UK/EU/US grids have different electricity emission factors)

### 14.6 Documentation
- **Storybook:** Component library documented with interactive examples — deployed to staging subdomain
- **API docs:** Cloud Functions documented with JSDoc + auto-generated markdown
- **Onboarding guide:** `/docs/CONTRIBUTING.md` covers local setup in < 10 minutes
- **Changelogs:** `CHANGELOG.md` maintained in Keep a Changelog format

---

## 15. Non-Functional Requirements

| NFR | Requirement | Measurement |
|-----|-------------|-------------|
| Performance | Page load (LCP) < 2.5s on 4G | Lighthouse CI, Firebase Performance |
| Availability | 99.9% uptime | Firebase SLA + Cloud Monitoring |
| Data Freshness | Dashboard score updates within 5s of log | Firestore real-time listener |
| Error Rate | Cloud Function errors < 0.5% | Cloud Monitoring |
| Bundle Size | Initial JS bundle < 150KB gzipped | `vite-bundle-analyzer` |
| Accessibility | WCAG 2.1 AA | axe-core automated + manual audit |
| Security | No high/critical CVEs in dependencies | `npm audit` in CI |
| Browser Support | Last 2 versions of Chrome, Firefox, Safari, Edge | Browserslist config |
| Mobile Responsive | Fully functional on 375px viewport | Manual + Playwright |

---

## 16. Milestones & Timeline

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| **Phase 0 — Foundation** | Week 1–2 | Firebase setup, auth, CI/CD pipeline, design system tokens |
| **Phase 1 — Core MVP** | Week 3–6 | Activity logging, carbon calculator, basic dashboard, onboarding |
| **Phase 2 — Intelligence** | Week 7–9 | Vertex AI recommendations, goal tracking, historical charts |
| **Phase 3 — Community** | Week 10–12 | Challenges, leaderboards, team features |
| **Phase 4 — Polish** | Week 13–14 | PWA, accessibility audit, performance optimization, offset marketplace |
| **Phase 5 — Launch** | Week 15 | Production deploy, monitoring setup, public beta |

---

## 17. Success Metrics

### User Engagement
- **D1 Retention:** ≥ 60% (users return day after signup)
- **D30 Retention:** ≥ 35%
- **DAU/MAU Ratio:** ≥ 30% (indicates habitual use)
- **Average activities logged per user per week:** ≥ 5

### Impact Metrics
- **Average carbon reduction** among active users after 90 days: ≥ 10% vs. baseline
- **Recommendation action rate:** ≥ 25% of shown recommendations acted on
- **Goals completed rate:** ≥ 50% of created goals reach 100%

### Technical Metrics
- **Lighthouse Performance Score:** ≥ 90
- **Crash-free sessions:** ≥ 99.5%
- **p99 API response time:** < 3s
- **Test coverage:** ≥ 80% lines

---

*Document maintained by the Platform Engineering Team. For questions, open a GitHub Discussion.*
