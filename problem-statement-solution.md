# Carbon Footprint Awareness Platform
## Problem Statement & Solution Document

---

**Document Version:** 1.0.0  
**Date:** June 10, 2026  
**Evaluation Parameters:** Code Quality · Security · Efficiency · Testing · Accessibility

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Root Cause Analysis](#2-root-cause-analysis)
3. [Proposed Solution](#3-proposed-solution)
4. [Parameter 1 — Code Quality](#4-parameter-1--code-quality)
5. [Parameter 2 — Security](#5-parameter-2--security)
6. [Parameter 3 — Efficiency](#6-parameter-3--efficiency)
7. [Parameter 4 — Testing](#7-parameter-4--testing)
8. [Parameter 5 — Accessibility](#8-parameter-5--accessibility)
9. [Additional Factors](#9-additional-factors)
10. [How the Solution Maps to Each Parameter](#10-how-the-solution-maps-to-each-parameter)

---

## 1. Problem Statement

### The Global Reality
Climate change is the defining crisis of this generation. Personal carbon emissions from individuals account for approximately **72% of global greenhouse gas emissions** when supply chains are traced back to consumption (Carbon Disclosure Project, 2024). Yet behavioral change at the individual level remains minimal, not due to lack of concern, but due to **lack of actionable awareness**.

### The Specific Gap
Despite widespread awareness of climate change:

1. **Visibility Gap:** The average person cannot estimate their own carbon footprint within an order of magnitude. CO₂ is invisible, odorless, and its effects are temporally and geographically displaced from the actions that produce it.

2. **Complexity Barrier:** Existing carbon calculators require detailed knowledge of emission factors, energy bills, and fuel types. Most users abandon the process within 2–3 minutes due to cognitive overload.

3. **Engagement Failure:** One-time carbon calculators produce a number but provide no framework for ongoing behavior change. Without feedback loops, the initial motivation dissolves within days.

4. **Action Gap:** Even motivated users face a gap between understanding their footprint and knowing *which specific action* to take first. Generic advice ("eat less meat, drive less") is too broad to trigger behavior change.

5. **Accountability Void:** Individual behavior change is significantly more durable when tied to social accountability. Current tools are entirely solitary.

6. **Equity Blind Spot:** Most tools are designed for high-income, English-speaking users in Western countries, ignoring the 4+ billion people in the Global South who are most affected by climate change yet have lower individual footprints.

### Who Is Affected
- **Individuals** who want to reduce their footprint but don't know how
- **Organizations** trying to run employee sustainability programs without the right tools
- **Educators** needing accessible, data-driven climate tools for students
- **Policymakers** who lack granular behavioral data to design effective interventions

### The Cost of Inaction
If individual behavioral change remains inaccessible:
- The 1.5°C Paris Agreement target becomes mathematically impossible without concurrent individual demand-side reductions
- Corporate net-zero pledges that rely on scope 3 (customer) emissions reductions will fail
- A generation of climate-motivated youth will experience learned helplessness from lack of tangible impact feedback

---

## 2. Root Cause Analysis

Using a **5-Why framework** on the core problem ("individuals don't reduce their carbon footprint"):

```
Why 1: Why don't individuals reduce their carbon footprint?
→ They don't know what actions have meaningful impact

Why 2: Why don't they know which actions matter?
→ Carbon data is not presented in personal, contextualized terms

Why 3: Why is carbon data not personalized?
→ Existing tools require manual data entry of technical details users don't have

Why 4: Why do tools require technical data entry?
→ They were designed by engineers/researchers for researchers, not for behavioral change

Why 5: Why were they designed this way?
→ No product-led, user-centered platform existed that combined tracking + AI personalization + social mechanics
```

**Root Cause:** The absence of a user-centered, behaviorally-informed, AI-powered platform that makes carbon tracking as simple and habitual as logging a workout or a meal.

---

## 3. Proposed Solution

### The Platform
A **web-based Carbon Footprint Awareness Platform** built with React and Firebase that turns carbon tracking into a daily habit through:

1. **Simple Activity Logging** — 5 categories, pre-loaded emission factors, under 2 minutes per day
2. **Real-Time Personalized Scores** — Immediate feedback loop after each log
3. **AI-Powered Recommendations** — Vertex AI generates ranked, specific action plans tailored to the user's actual behavior patterns
4. **Goal-Setting Framework** — Users commit to measurable reductions with progress tracking
5. **Community Accountability** — Challenges, leaderboards, and team features create social proof and peer pressure
6. **Education Integration** — Contextual learning woven into the experience, not siloed

### The Core Loop

```
Log Activity → See Impact Score → Receive Personalized Tip → Take Action → Log Reduced Activity → See Score Improve → Repeat
```

This creates a **positive reinforcement cycle** grounded in behavioral science (BJ Fogg's Tiny Habits model + Variable Reward mechanics).

### Technology Choice Rationale

| Decision | Choice | Why |
|----------|--------|-----|
| Frontend | React + TypeScript | Component reusability, type safety, massive ecosystem, accessibility tooling |
| Backend | Firebase (BaaS) | Real-time sync, zero DevOps overhead, auth + database + hosting integrated |
| AI | Vertex AI (Gemini) | Google ecosystem integration, powerful reasoning for personalized recommendations |
| Analytics | Google Analytics 4 | Behavioral funnel analysis, audience segmentation for re-engagement |
| Hosting | Firebase Hosting | Global CDN, automatic HTTPS, instant deploy pipeline |

---

## 4. Parameter 1 — Code Quality

### What Code Quality Means Here
Code quality is not just "clean code." It is the aggregate of practices that determine how long the codebase remains maintainable, extensible, and comprehensible — by the original author or anyone who joins later.

### How We Achieve It

#### 4.1 File Structure — Feature-Based Architecture
The project uses **feature-based co-location** rather than type-based structure. This means:

```
❌ Type-based (fragile — change to one feature touches multiple top-level folders):
/components/ActivityCard.tsx
/hooks/useActivities.ts
/types/activity.types.ts
/utils/carbonCalculator.ts

✅ Feature-based (cohesive — all activity logic lives together):
/features/activities/
  ├── useActivities.ts        ← Logic
  ├── activitySchema.ts       ← Validation
  ├── carbonCalculator.ts     ← Business logic
  ├── emissionFactors.ts      ← Data
  └── ActivityCard/           ← UI
      ├── ActivityCard.tsx
      └── ActivityCard.test.tsx
```

This structure scales without cognitive overload. When a developer touches "activities," they go to one place.

#### 4.2 Section Comments — A Non-Negotiable Standard
Every file over 50 lines uses structured section comments:

```tsx
// =============================================================================
// SECTION: Imports & Dependencies
// Purpose: External libraries and internal module imports
// =============================================================================

// =============================================================================
// SECTION: Type Definitions
// Purpose: Define component props and local types
// =============================================================================

// =============================================================================
// SECTION: Component — [ComponentName]
// Purpose: [What this component renders]
// Data Flow: [Where data comes from and where it goes]
// Side Effects: [Firestore reads/writes, analytics events]
// =============================================================================

// =============================================================================
// SECTION: Exports
// =============================================================================
```

This is not optional documentation — it is a PR requirement. A reviewer will reject a PR with a file > 50 lines that lacks this structure.

#### 4.3 TypeScript Strict Mode
`tsconfig.json` enforces:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

Every type is explicit. `any` is banned via ESLint rule `@typescript-eslint/no-explicit-any`. This eliminates an entire category of runtime bugs at compile time.

#### 4.4 Carbon Calculator — Pure Function Design
The core business logic is a **pure function** — no side effects, no external dependencies:

```typescript
// =============================================================================
// SECTION: Core Carbon Calculation Engine
// Pure function: input × emission factor = kg CO₂ equivalent
// Sources: IPCC AR6 emission factors (2021), EPA eGRID 2023
// Unit tested at 100% coverage — this is the financial calculation of the app
// =============================================================================

/**
 * Calculates CO₂ equivalent emissions for a given activity.
 * @param quantity - Amount of the activity (e.g., 50 for 50km)
 * @param emissionFactor - kg CO₂e per unit (from IPCC/EPA database)
 * @param unit - Unit of measurement for documentation purposes
 * @returns kg CO₂e rounded to 3 decimal places
 */
export function calculateCarbonKg(
  quantity: number,
  emissionFactor: number,
  unit: string
): number {
  // Validate inputs — never trust caller to provide positive numbers
  if (quantity < 0) throw new RangeError(`Quantity must be non-negative, got ${quantity}`);
  if (emissionFactor < 0) throw new RangeError(`Emission factor must be non-negative`);
  
  // Core calculation: multiply activity quantity by emission factor
  const rawCarbon = quantity * emissionFactor;
  
  // Round to 3 decimal places — sufficient precision for individual activity tracking
  return Math.round(rawCarbon * 1000) / 1000;
}
```

Pure functions are:
- Trivially testable (no mocks needed)
- Completely predictable
- Composable — you can combine them without fear
- Portable — can be moved to Cloud Functions without refactoring

#### 4.5 Naming Conventions

| Artifact | Convention | Example |
|----------|-----------|---------|
| React Components | `PascalCase` | `ActivityLogger.tsx` |
| Custom Hooks | `camelCase`, `use` prefix | `useActivities.ts` |
| Constants | `SCREAMING_SNAKE_CASE` | `EMISSION_CATEGORIES` |
| TypeScript Interfaces | `PascalCase`, `I` prefix | `IActivity` |
| TypeScript Types | `PascalCase`, `T` suffix | `ActivityCategoryT` |
| Enums | `PascalCase` | `ActivityCategory.Transport` |
| Utility functions | `camelCase` | `formatCarbonKg()` |
| Test files | Same name + `.test.ts` | `carbonCalculator.test.ts` |

#### 4.6 ESLint Configuration
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "import/no-cycle": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-console": "warn",
    "prefer-const": "error"
  }
}
```

#### 4.7 Error Boundary Pattern
```tsx
// =============================================================================
// SECTION: Error Boundary — Page-Level Crash Protection
// Catches runtime errors in child component trees.
// Displays a graceful fallback instead of a blank white screen.
// Logs error details to Firebase Analytics for monitoring.
// =============================================================================
class PageErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    // Update state so the fallback UI renders on the next render cycle
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Firebase Analytics for error monitoring
    logEvent(analytics, 'exception', {
      description: error.message,
      fatal: false,
      component_stack: errorInfo.componentStack
    });
  }
  // ... render fallback UI
}
```

---

## 5. Parameter 2 — Security

### Threat Model
Before defining security controls, we identify threats:

| Threat | Attack Vector | Impact | Mitigation |
|--------|-------------|--------|-----------|
| Unauthorized data access | Direct Firestore API call | High — user data exposure | Firestore security rules |
| Token theft | XSS | High — account takeover | CSP headers, short token TTL |
| API key exposure | Client-side bundle inspection | Medium — quota abuse | Firebase App Check, env vars |
| Injection attacks | Malicious form input | Medium — data corruption | Zod validation + Firestore type rules |
| GDPR violation | Data retention without consent | High — regulatory fine | Data export/delete features |
| Brute force login | Automated credential stuffing | Medium | Firebase Auth rate limiting |

### Security Controls Implemented

#### 5.1 Firebase App Check
Prevents unauthorized clients (scripts, bots) from accessing Firebase services:
```typescript
// =============================================================================
// SECTION: Firebase App Check Initialization
// Verifies requests originate from the genuine app, not bots or scrapers.
// Uses reCAPTCHA v3 for web (invisible to users with score-based detection).
// =============================================================================
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true
});
```

#### 5.2 Content Security Policy (Firebase Hosting Headers)
```json
{
  "headers": [{
    "source": "**",
    "headers": [
      {
        "key": "Content-Security-Policy",
        "value": "default-src 'self'; script-src 'self' https://www.gstatic.com https://www.google.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com; img-src 'self' data: https:; frame-src https://www.youtube.com"
      },
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
    ]
  }]
}
```

#### 5.3 Firestore Security Rules — Defense in Depth
Security rules act as the **server-side authorization layer** — even if client-side code is bypassed:

```javascript
// =============================================================================
// SECTION: Firestore Security Rules
// These rules are the final line of defense against unauthorized data access.
// They run server-side on every Firestore request regardless of client state.
// Principle: Deny by default, allow explicitly with minimum permissions.
// =============================================================================

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function: verify the requesting user owns the document
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // Helper function: validate activity document structure
    function isValidActivity() {
      return request.resource.data.keys().hasAll(['category', 'quantity', 'carbonKg', 'date'])
        && request.resource.data.quantity is number
        && request.resource.data.quantity > 0
        && request.resource.data.quantity < 100000; // Sanity bound
    }
    
    match /users/{userId} {
      allow read, update: if isOwner(userId);
      allow create: if isOwner(userId) && request.resource.data.keys().size() <= 10;
      allow delete: if isOwner(userId);
      
      match /activities/{activityId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && isValidActivity();
        allow update: if isOwner(userId) && isValidActivity();
        // Can only delete activities created in the last 24 hours
        allow delete: if isOwner(userId) 
          && resource.data.createdAt > request.time - duration.value(86400, 's');
      }
    }
  }
}
```

#### 5.4 Environment Variable Management
```
# .env.local (NEVER committed — in .gitignore)
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here

# .env.example (COMMITTED — shows structure without values)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_RECAPTCHA_SITE_KEY=
```

Sensitive server-side keys (Vertex AI, admin SDK) are stored exclusively in **Google Cloud Secret Manager** and injected at Cloud Function runtime — never in client bundles.

#### 5.5 Input Validation with Zod
```typescript
// =============================================================================
// SECTION: Activity Form Validation Schema
// Zod provides runtime type validation at the form boundary.
// This runs before any data reaches Firestore, catching malformed input early.
// Note: Firestore security rules provide a second validation layer server-side.
// =============================================================================
import { z } from 'zod';

export const activitySchema = z.object({
  category: z.enum(['transport', 'diet', 'energy', 'shopping', 'waste'], {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
  subtype: z.string().min(1, 'Please select an activity type').max(100),
  quantity: z
    .number()
    .positive('Quantity must be greater than 0')
    .max(99999, 'Value seems unrealistically high — please check your input'),
  date: z.date().max(new Date(), 'Cannot log activities in the future'),
  notes: z.string().max(500, 'Notes must be under 500 characters').optional()
});

export type ActivityFormData = z.infer<typeof activitySchema>;
```

---

## 6. Parameter 3 — Efficiency

### What Efficiency Means in This Context
Efficiency covers three distinct but related dimensions:
1. **Frontend performance** — How fast the UI loads and responds
2. **Resource efficiency** — How much compute, bandwidth, and cost the system consumes
3. **Developer efficiency** — How quickly new features can be built and shipped

### 6.1 Bundle Size Strategy
The React app is split at the route level so users never download code for pages they don't visit:

```typescript
// =============================================================================
// SECTION: Route-Level Code Splitting
// Each page is loaded on-demand via dynamic import.
// The initial bundle contains only the shell (auth check + routing logic).
// This keeps first-load JS under 150KB gzipped.
// =============================================================================
const DashboardPage = React.lazy(() => import('@/pages/dashboard/DashboardPage'));
const InsightsPage = React.lazy(() => import('@/pages/insights/InsightsPage'));
const CommunityPage = React.lazy(() => import('@/pages/community/CommunityPage'));

// Suspense boundary shows skeleton UI while the chunk loads
<React.Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/insights" element={<InsightsPage />} />
    <Route path="/community" element={<CommunityPage />} />
  </Routes>
</React.Suspense>
```

### 6.2 Firebase SDK Tree Shaking
Firebase v10's modular API ensures only used code is bundled:

```typescript
// ✅ Efficient — only imports getDoc and doc functions (~5KB)
import { getDoc, doc } from 'firebase/firestore';

// ❌ Inefficient — imports entire Firestore SDK (~200KB)
import firebase from 'firebase/app';
firebase.firestore().collection('users').doc(userId).get();
```

### 6.3 Memoization of Expensive Computations
```typescript
// =============================================================================
// SECTION: Chart Data Transformation
// Transforms raw Firestore activity documents into chart-ready data structure.
// Wrapped in useMemo because:
//   1. activities array is large (30+ items)
//   2. This transform runs on every render without memoization
//   3. Recharts re-renders whenever data reference changes
// Dependency: only recompute when activities array changes (not on every render)
// =============================================================================
const chartData = useMemo(() => {
  return transformActivitiesToChartData(activities, selectedPeriod);
}, [activities, selectedPeriod]);
```

### 6.4 Firestore Read Optimization
```typescript
// =============================================================================
// SECTION: Paginated Activity Fetch
// NEVER fetch unbounded collections — this will cause performance degradation
// and unexpectedly high Firestore read costs at scale.
// Uses cursor-based pagination: last document of current page becomes
// the start cursor for the next page.
// =============================================================================
const fetchActivitiesPage = async (
  userId: string,
  pageSize: number = 20,
  lastDoc?: DocumentSnapshot
) => {
  let query = firestoreQuery(
    collection(db, `users/${userId}/activities`),
    orderBy('date', 'desc'),
    limit(pageSize)
  );
  
  // If loading subsequent pages, start after the last document
  if (lastDoc) {
    query = firestoreQuery(query, startAfter(lastDoc));
  }
  
  return getDocs(query);
};
```

### 6.5 Denormalized Score Storage
Instead of computing the total carbon score by summing all activities on every dashboard load (O(n) reads), we maintain a denormalized `totalScore` field on the user document, updated by a Cloud Function on each activity write:

```
Dashboard Load Cost with aggregation: 1 read per activity × (potentially 1000+ activities)
Dashboard Load Cost with denormalization: 1 read (user document contains pre-computed total)
```

This is a **1000x+ read reduction** for users with long histories.

### 6.6 Vertex AI Cost Control
```typescript
// =============================================================================
// SECTION: Scheduled AI Recommendation Generation
// Recommendations are generated ONCE per day per user via a scheduled function,
// NOT on every page load. This controls Vertex AI inference costs.
// 
// Cost model: 1000 active users × 1 inference/day × $0.00015/1K tokens ≈ $0.15/day
// vs. on-demand: same 1000 users × 5 page loads/day × same cost = $0.75/day (5x higher)
// =============================================================================
export const generateDailyRecommendations = onSchedule('every 24 hours', async () => {
  const activeUsers = await getActiveUsersFromLastDay();
  
  // Process in batches of 10 to avoid Vertex AI rate limits
  for (const batch of chunk(activeUsers, 10)) {
    await Promise.all(batch.map(userId => generateRecommendationsForUser(userId)));
  }
});
```

---

## 7. Parameter 4 — Testing

### Testing Philosophy
Tests are not a checkbox. They are **executable documentation** that prove the system behaves correctly and provide a safety net for future changes. A feature without tests is a feature that cannot be safely refactored.

### Test Pyramid

```
         /\
        /E2E\          ← Few, slow, high-confidence (Playwright)
       /------\
      /  Integ  \      ← Some, medium speed (Firebase Emulator + Vitest)
     /------------\
    /   Unit Tests  \  ← Many, fast, isolated (Vitest + RTL)
   /________________\
```

### 7.1 Unit Tests — Carbon Calculator (Critical Path)
```typescript
// =============================================================================
// FILE: carbonCalculator.test.ts
// SECTION: Unit Tests for Core Emission Calculation
// 
// This is the most critical test file in the project.
// The carbon calculator is the financial engine of the platform —
// incorrect calculations directly damage user trust and data integrity.
// Target: 100% line + branch coverage.
// =============================================================================

import { describe, it, expect } from 'vitest';
import { calculateCarbonKg } from './carbonCalculator';

describe('calculateCarbonKg', () => {
  // --- Happy Path Tests ---
  describe('correct calculations', () => {
    it('calculates car emissions correctly', () => {
      // 100km in a medium petrol car at 0.21 kg CO₂e/km = 21kg
      expect(calculateCarbonKg(100, 0.21, 'km')).toBe(21);
    });

    it('calculates diet emissions correctly', () => {
      // 1kg beef at 27kg CO₂e/kg = 27kg
      expect(calculateCarbonKg(1, 27, 'kg')).toBe(27);
    });

    it('rounds to 3 decimal places', () => {
      expect(calculateCarbonKg(1, 0.3333333, 'unit')).toBe(0.333);
    });
  });

  // --- Edge Cases ---
  describe('edge cases', () => {
    it('returns 0 for zero quantity', () => {
      expect(calculateCarbonKg(0, 0.21, 'km')).toBe(0);
    });

    it('handles very small quantities', () => {
      expect(calculateCarbonKg(0.001, 27, 'kg')).toBe(0.027);
    });
  });

  // --- Error Cases ---
  describe('input validation', () => {
    it('throws RangeError for negative quantity', () => {
      expect(() => calculateCarbonKg(-1, 0.21, 'km')).toThrow(RangeError);
    });

    it('throws RangeError for negative emission factor', () => {
      expect(() => calculateCarbonKg(100, -0.21, 'km')).toThrow(RangeError);
    });
  });
});
```

### 7.2 Component Tests — React Testing Library
```typescript
// =============================================================================
// FILE: ActivityLogger.test.tsx
// SECTION: Component Integration Test — Activity Logging Form
//
// Tests user interactions, not implementation details.
// Queries by accessible roles and labels (as a screen reader would).
// =============================================================================

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActivityLogger } from './ActivityLogger';

describe('ActivityLogger', () => {
  it('shows validation error for negative quantity', async () => {
    render(<ActivityLogger userId="test-user" />);
    
    // Select transport category
    await userEvent.click(screen.getByRole('radio', { name: /transport/i }));
    
    // Enter invalid quantity
    await userEvent.type(screen.getByLabelText(/quantity/i), '-5');
    
    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /log activity/i }));
    
    // Error message should be visible
    expect(screen.getByRole('alert')).toHaveTextContent(/quantity must be greater than 0/i);
  });

  it('calls addActivity with correct carbon calculation', async () => {
    const mockAddActivity = vi.fn().mockResolvedValue(undefined);
    // ... test setup and assertions
  });
});
```

### 7.3 Firestore Security Rules Tests (Firebase Emulator)
```typescript
// =============================================================================
// FILE: firestore.security.test.ts  
// SECTION: Firestore Security Rules Validation
//
// Tests run against Firebase Emulator — no production data is touched.
// Covers both positive (allowed) and negative (denied) cases.
// Security rules must be tested exhaustively — a gap here is a data breach.
// =============================================================================

import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

describe('Firestore Security Rules', () => {
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'carbon-platform-test',
      firestore: { rules: readFileSync('firestore.rules', 'utf8') }
    });
  });

  describe('user document access', () => {
    it('allows user to read their own document', async () => {
      const userDb = testEnv.authenticatedContext('user-123').firestore();
      await assertSucceeds(getDoc(doc(userDb, 'users/user-123')));
    });

    it('denies user from reading another user document', async () => {
      const userDb = testEnv.authenticatedContext('user-123').firestore();
      await assertFails(getDoc(doc(userDb, 'users/user-456')));
    });

    it('denies unauthenticated reads', async () => {
      const anonDb = testEnv.unauthenticatedContext().firestore();
      await assertFails(getDoc(doc(anonDb, 'users/user-123')));
    });
  });
});
```

### 7.4 E2E Tests — Critical User Journeys (Playwright)
```typescript
// =============================================================================
// FILE: activity-logging.spec.ts
// SECTION: End-to-End Test — Core Activity Logging Flow
//
// Tests the complete user journey from login to logged activity to score update.
// Runs in a staging environment with a seeded test user account.
// This is the most important E2E test — it covers the app's core value proposition.
// =============================================================================

import { test, expect } from '@playwright/test';

test('user can log activity and see updated carbon score', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', 'e2e-test@carbonapp.dev');
  await page.fill('[data-testid="password-input"]', process.env.E2E_TEST_PASSWORD!);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');

  // Record current score before logging
  const scoreBefore = await page.locator('[data-testid="carbon-score"]').textContent();

  // Log a transport activity
  await page.click('[data-testid="log-activity-button"]');
  await page.click('[data-testid="category-transport"]');
  await page.selectOption('[data-testid="subtype-select"]', 'car_petrol_medium');
  await page.fill('[data-testid="quantity-input"]', '50');
  await page.click('[data-testid="submit-activity"]');

  // Score should update within 5 seconds (Firestore real-time listener)
  await expect(page.locator('[data-testid="carbon-score"]')).not.toHaveText(scoreBefore!, {
    timeout: 5000
  });

  // Success toast should appear
  await expect(page.locator('[role="status"]')).toContainText('Activity logged');
});
```

### 7.5 CI/CD Test Enforcement
```yaml
# .github/workflows/ci.yml
# =============================================================================
# SECTION: Continuous Integration Pipeline
# Every PR must pass ALL checks before merge is permitted.
# No exceptions — a failing test blocks the merge.
# =============================================================================
jobs:
  quality:
    steps:
      - name: Type Check
        run: npx tsc --noEmit
      
      - name: Lint
        run: npx eslint src --max-warnings=0
      
      - name: Unit & Integration Tests
        run: npx vitest run --coverage
      
      - name: Coverage Gate
        run: npx vitest run --coverage --coverage.thresholds.lines=80
      
      - name: Build
        run: npx vite build
      
      - name: Lighthouse CI
        run: npx lhci autorun
      
      - name: E2E Tests
        run: npx playwright test
      
      - name: Security Audit
        run: npm audit --audit-level=high
```

---

## 8. Parameter 5 — Accessibility

### Why Accessibility Is Non-Negotiable Here
Carbon awareness is a public good. If the platform is inaccessible to users with disabilities, we are saying environmental education is only for people without visual, motor, or cognitive impairments. That is ethically indefensible and legally problematic in many jurisdictions (ADA, EN 301 549, EAA 2025).

### 8.1 Semantic HTML Foundation
```tsx
{/* ============================================================
    SECTION: Dashboard Layout — Semantic Structure
    Uses landmark elements to allow screen reader users to
    navigate directly to sections without reading every element.
    ============================================================ */}
<div className="app-layout">
  <header role="banner">
    <nav aria-label="Main navigation">
      {/* Navigation items */}
    </nav>
  </header>
  
  <main id="main-content" aria-label="Carbon dashboard">
    <section aria-labelledby="score-heading">
      <h1 id="score-heading">Your Carbon Score</h1>
      {/* Score content */}
    </section>
    
    <section aria-labelledby="activities-heading">
      <h2 id="activities-heading">Recent Activities</h2>
      {/* Activity list */}
    </section>
  </main>
  
  <aside aria-label="Recommendations">
    {/* Recommendation panel */}
  </aside>
</div>
```

### 8.2 Keyboard Navigation
Every interactive element is reachable and operable via keyboard:

```tsx
{/* ============================================================
    SECTION: Accessible Icon Button
    Many icon-only buttons fail accessibility because they lack
    visible or programmatic labels.
    This pattern provides:
    - aria-label for screen readers
    - focus-visible ring for keyboard users
    - adequate touch target size (44x44px minimum per WCAG 2.5.5)
    ============================================================ */}
<button
  type="button"
  aria-label="Delete activity: Drove 50km to work"
  className="p-2 min-w-[44px] min-h-[44px] rounded focus-visible:ring-2 focus-visible:ring-green-500"
  onClick={() => deleteActivity(activityId)}
>
  <TrashIcon aria-hidden="true" className="h-5 w-5" />
</button>
```

### 8.3 Accessible Charts
Charts present a major accessibility challenge — most chart libraries render SVGs that are invisible to screen readers:

```tsx
{/* ============================================================
    SECTION: Accessible Carbon Breakdown Chart
    Problem: Pie/donut charts are visually informative but
    completely opaque to screen reader users.
    Solution: Provide a visually-hidden data table as an
    accessible alternative. Screen readers navigate the table
    while sighted users see the chart.
    ============================================================ */}
<div role="img" aria-labelledby="chart-title" aria-describedby="chart-desc">
  <h3 id="chart-title">Carbon Breakdown by Category</h3>
  <p id="chart-desc">
    Donut chart showing your carbon emissions split across 5 categories this month.
  </p>
  
  {/* Visual chart for sighted users */}
  <PieChart data={categoryData} />
  
  {/* Accessible data table — visually hidden but available to screen readers */}
  <table className="sr-only">
    <caption>Carbon emissions by category — {currentMonth}</caption>
    <thead>
      <tr>
        <th scope="col">Category</th>
        <th scope="col">Emissions (kg CO₂e)</th>
        <th scope="col">Percentage</th>
      </tr>
    </thead>
    <tbody>
      {categoryData.map(({ name, value, percentage }) => (
        <tr key={name}>
          <td>{name}</td>
          <td>{value} kg CO₂e</td>
          <td>{percentage}%</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### 8.4 Live Regions for Dynamic Updates
```tsx
{/* ============================================================
    SECTION: Screen Reader Live Region
    When the carbon score updates after logging an activity,
    sighted users see the number change.
    Screen reader users would miss this unless we announce it.
    aria-live="polite" announces after the current speech completes.
    aria-live="assertive" interrupts immediately (for errors only).
    ============================================================ */}
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
  role="status"
>
  {lastActivityMessage}
  {/* e.g., "Activity logged. Your score increased by 10.5 kg CO₂e. New total: 245 kg." */}
</div>
```

### 8.5 Color Accessibility
```css
/* ============================================================
   SECTION: Accessible Color System
   All color pairs verified at 4.5:1 contrast ratio (WCAG AA).
   Carbon score severity uses BOTH color AND icon to communicate
   status — never color alone (WCAG 1.4.1).
   ============================================================ */

:root {
  /* Green — good score */
  --color-score-good: #166534;        /* on white: 7.2:1 ✅ */
  --color-score-good-bg: #dcfce7;
  
  /* Amber — moderate score */
  --color-score-moderate: #92400e;    /* on white: 7.1:1 ✅ */
  --color-score-moderate-bg: #fef3c7;
  
  /* Red — high score */
  --color-score-high: #991b1b;        /* on white: 7.2:1 ✅ */
  --color-score-high-bg: #fee2e2;
}
```

### 8.6 Reduced Motion Support
```css
/* ============================================================
   SECTION: Reduced Motion Media Query
   Users who have vestibular disorders or motion sensitivity
   can set "Reduce Motion" in their OS accessibility settings.
   This query respects that preference by removing all
   non-essential animations. Core functionality is unaffected.
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 9. Additional Factors

### 9.1 Maintainability

**The Problem:** Code that works today but cannot be changed tomorrow is a liability. Technical debt compounds faster than financial debt.

**Our Approach:**
- **Architecture Decision Records (ADRs):** Every significant technical choice is documented in `/docs/decisions/`. Future developers understand not just *what* was decided but *why*, preventing well-intentioned reversions of deliberate tradeoffs.
- **Dependency pinning:** Exact versions in `package.json`. No `^` or `~` — dependency updates are deliberate, tested decisions.
- **Feature flags via Firebase Remote Config:** New features are deployed behind flags and gradually rolled out. This decouples deployment from release, reducing rollback risk.
- **CHANGELOG.md:** Every release is documented in Keep a Changelog format. Developers can trace when and why any behavior changed.

### 9.2 Scalability

**The Problem:** A system designed for 100 users may collapse under 10,000. Architecture decisions made early are expensive to reverse.

**Our Approach:**
- **Firestore** handles millions of documents natively. No sharding required up to multi-million user scale.
- **Denormalized aggregates** (score totals stored on user doc, updated by Cloud Function) mean dashboard read cost is O(1) regardless of history length.
- **Firebase Hosting CDN** auto-scales. Static asset delivery never becomes a bottleneck.
- **Cloud Functions** scale from 0 to 1000+ concurrent instances automatically.
- The only scale concern worth addressing in Phase 1: **leaderboard write contention**. Solved by using server-side aggregation in Cloud Functions with a fan-out pattern for large challenges.

### 9.3 Observability

**The Problem:** You cannot fix what you cannot see. In production, invisible errors destroy user trust silently.

**Our Approach:**
```
Logs      → Cloud Functions structured JSON → Cloud Logging → Dashboards
Errors    → Custom GA4 exception events + Cloud Function error reports → Alerting
Perf      → Firebase Performance Monitoring → Real User Metrics
Business  → GA4 custom events → Retention, funnel, engagement metrics
```

Alerts configured for:
- Cloud Function error rate > 1% (pages on-call)
- Dashboard load p99 > 5s (non-urgent notification)
- Zero activity logs for > 24h by an active user (trigger re-engagement FCM)

### 9.4 Internationalization (i18n)

**The Problem:** Carbon emissions are a global issue. An English-only platform is a Western-only platform.

**Our Approach:**
- `react-i18next` with `en.json` base locale — all user-facing strings are keys, not hardcoded text
- Emission factors **localized by country**: UK grid electricity ≠ US grid ≠ India grid (wildly different CO₂ intensity)
- `Intl.NumberFormat` and `Intl.DateTimeFormat` for locale-aware number/date display
- Phase 2 target languages driven by GA4 geography data: Spanish, French, German, Hindi

### 9.5 Developer Experience (DX)

**The Problem:** A platform that is hard to develop on will accumulate shortcuts and workarounds that degrade quality over time.

**Our Approach:**
- **Firebase Emulator Suite** mirrors production locally — no shared dev database, no risk of corrupting production data during development
- **Storybook** documents every component with interactive examples and accessibility annotations
- **`/docs/CONTRIBUTING.md`** gets a new developer from zero to running locally in < 10 minutes (verified by timing new team member onboarding)
- **Vite HMR** — sub-100ms code change → browser update cycle during development
- **TypeScript IntelliSense** on all Firebase types — no guessing Firestore document shapes

### 9.6 Environmental Impact of the Platform Itself

**The Meta-Problem:** A carbon awareness platform that runs inefficiently would be ironic.

**Our Approach:**
- Firebase Hosting and Google Cloud infrastructure runs on **carbon-neutral energy** (Google has matched 100% of electricity consumption with renewables since 2017)
- Efficient Firestore queries reduce server-side compute
- Code splitting and caching reduce data transfer
- Scheduled (not reactive) AI inference reduces Vertex AI compute cycles
- **We will measure and publish the platform's own carbon footprint** in the about/settings page — practicing what we preach

---

## 10. How the Solution Maps to Each Parameter

| Parameter | Key Design Decisions | Measurable Outcome |
|-----------|--------------------|--------------------|
| **Code Quality** | Feature-based architecture, TypeScript strict, section comments standard, pure function business logic, ESLint enforcement | < 2 hours to onboard a new developer; PRs reviewable without codebase knowledge |
| **Security** | Firebase App Check, Firestore rules as server-side auth, Zod validation, CSP headers, Secret Manager for keys, GDPR data controls | 0 unauthorized data access incidents; passes OWASP ZAP scan |
| **Efficiency** | Route-level code splitting, denormalized Firestore scores, scheduled AI inference, Firebase modular SDK, paginated queries | Lighthouse Performance ≥ 90; initial bundle < 150KB; dashboard load < 2s |
| **Testing** | 100% calculator coverage, component tests via RTL, Firestore rules tested in Emulator, E2E critical journeys in Playwright, CI gates | ≥ 80% overall line coverage; 0 regressions shipped to production |
| **Accessibility** | WCAG 2.1 AA, semantic HTML, keyboard navigation, accessible charts with data tables, ARIA live regions, color + icon (not color alone), reduced motion | axe-core 0 violations in automated scan; navigable via keyboard only; screen reader compatible |
| **Maintainability** | ADRs, dependency pinning, feature flags, CHANGELOG, Storybook | < 10 min onboarding; safe refactoring with test coverage |
| **Scalability** | O(1) dashboard reads, Firestore native scale, CDN hosting, async aggregation | Handles 100K MAU without architectural changes |
| **Observability** | Structured logs, GA4 events, performance monitoring, alerting | All production errors detected within 5 minutes of occurrence |
| **i18n** | `react-i18next`, locale-aware formatting, country-specific emission factors | Expandable to any language/region without code changes |
| **DX** | Firebase Emulator, Storybook, Vite HMR, TypeScript IntelliSense | New developer productive within 1 day |

---

*This document is the companion to `prd.md`. Together they define the complete scope, technical approach, and quality standards for the Carbon Footprint Awareness Platform.*
