# CarbonTrace

A full-stack carbon footprint tracking web application. Log daily activities, visualise emissions trends, set reduction goals, and join community challenges — all backed by science-based emission factors.

**Live URL:** https://carbontrace-956621523535.us-central1.run.app

---

## What it does

- **Activity logging** — track transport, diet, energy, shopping, and waste with real emission factors
- **Dashboard** — daily carbon score, 7-day trend chart, and smart reduction tips
- **Insights** — period-based trend analysis, category breakdown, and activity heatmap
- **Goals** — set CO₂ reduction targets with deadline tracking and milestone notifications
- **Community** — join monthly challenges and compete on leaderboards
- **Learn** — articles, videos, glossary, and myth vs fact cards
- **CSV import** — bulk log activities from a CSV file
- **Google Maps integration** — auto-calculate route distance for transport activities
- **GDPR export** — download your data as JSON

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Backend | Node.js, Express 4 |
| Database | PostgreSQL via [Neon](https://neon.tech) (serverless) |
| Auth | Firebase Authentication |
| Charts | Recharts |
| Deployment | Google Cloud Run (single container) |

---

## Project structure

```
CarbonTrace/
├── frontend/               ← React SPA (Vite)
│   ├── src/
│   │   ├── components/     ← Atoms (Button, Badge, InputField) + Layout
│   │   ├── context/        ← AuthContext (Firebase session)
│   │   ├── pages/          ← One file per route
│   │   ├── services/       ← api.js (HTTP client) + Firebase config
│   │   ├── utils/          ← constants.js, helpers.js
│   │   └── test/           ← Vitest + React Testing Library
│   ├── .env.production     ← Production env vars (not committed)
│   └── dist/               ← Pre-built output (committed for deployment)
│
├── backend/                ← Express REST API
│   ├── src/
│   │   ├── db/             ← Pool, migrations, seed
│   │   ├── middleware/     ← Auth, validation, error handling
│   │   ├── routes/         ← One file per resource
│   │   └── server.js       ← Entry point
│   └── .env                ← Secrets (not committed)
│
├── Dockerfile              ← Single-container build (frontend pre-built, served by Express)
├── .dockerignore
└── .gcloudignore
```

---

## Local development

### Prerequisites
- Node.js 20+
- A [Neon](https://neon.tech) database
- A [Firebase](https://console.firebase.google.com) project with Authentication enabled

### Backend

```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, FIREBASE_PROJECT_ID, FRONTEND_URL
npm install
npm run db:migrate   # Create tables
npm run db:seed      # Seed challenge data
npm run dev          # Starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Fill in VITE_FIREBASE_* and VITE_GOOGLE_MAPS_API_KEY
npm install
npm run dev          # Starts on http://localhost:5173
```

---

## Running tests

```bash
# Backend (Jest + Supertest)
cd backend
npm test

# Frontend (Vitest + React Testing Library)
cd frontend
npm test
```

---

## Deployment to Cloud Run

The app deploys as a **single Cloud Run service** — Express serves both the API and the pre-built React frontend.

### 1. Build the frontend locally

```bash
cd frontend
npm run build
```

### 2. Deploy

```bash
cd ..
gcloud run deploy carbontrace \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --project YOUR_PROJECT_ID \
  --update-env-vars NODE_ENV=production \
  --update-env-vars DATABASE_URL=YOUR_NEON_URL \
  --update-env-vars JWT_SECRET=YOUR_SECRET \
  --update-env-vars FIREBASE_PROJECT_ID=YOUR_FIREBASE_ID \
  --update-env-vars FRONTEND_URL=https://YOUR-SERVICE.run.app
```

> The `frontend/dist/` folder must exist before deploying. The Dockerfile copies it directly — no Vite build happens inside Docker.

### After deploy — update FRONTEND_URL

```bash
gcloud run services update carbontrace \
  --region us-central1 \
  --update-env-vars FRONTEND_URL=https://YOUR-ACTUAL-URL.run.app
```

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (Cloud Run injects `8080`) |
| `NODE_ENV` | `development` or `production` |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWTs (min 64 chars in production) |
| `JWT_EXPIRES_IN` | Token expiry, e.g. `7d` |
| `FIREBASE_PROJECT_ID` | Firebase project for verifying ID tokens |
| `FRONTEND_URL` | Allowed CORS origin |

### Frontend (`frontend/.env.production`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL — use `/api` for production |
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps Platform (Places API + Routes API) |

---

## API overview

| Resource | Base path |
|----------|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Activities | `GET/POST /api/activities`, `GET /api/activities/summary`, `GET /api/activities/trend` |
| Goals | `GET/POST /api/goals`, `PATCH/DELETE /api/goals/:id` |
| Challenges | `GET /api/challenges`, `POST /api/challenges/:id/join`, `GET /api/challenges/:id/leaderboard` |
| Recommendations | `GET /api/recommendations`, `PATCH /api/recommendations/:id` |
| Users | `GET/PATCH /api/users/profile`, `GET /api/users/dashboard`, `DELETE /api/users/account` |
| Health | `GET /health` |

Full API reference in [`backend/README.md`](./backend/README.md).

---

## Database schema

```
users               — account, profile, streak, onboarding status
activities          — carbon log entries (category, subtype, quantity, carbon_kg)
goals               — reduction goals with progress tracking
challenges          — platform-wide monthly challenges
challenge_members   — user ↔ challenge participation + score_kg
recommendations     — AI/static tips per user per day
```

Run `npm run db:migrate` in the backend directory to create or update tables.

---

## License

MIT
