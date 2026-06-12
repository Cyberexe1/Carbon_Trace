# CarbonTrace — Backend API

Express.js REST API connected to **Neon PostgreSQL** (serverless Postgres).

---

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | PostgreSQL via [Neon](https://neon.tech) |
| DB Driver | `pg` (node-postgres) |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Validation | `express-validator` |
| Security | `helmet` + `cors` |
| Logging | `morgan` |
| Dev server | `nodemon` |

---

## Folder Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── pool.js          ← Neon pg Pool singleton
│   │   ├── migrate.js       ← CREATE TABLE IF NOT EXISTS for all tables
│   │   └── seed.js          ← Seed platform challenges
│   ├── middleware/
│   │   ├── auth.js          ← JWT Bearer token verification
│   │   ├── errorHandler.js  ← Global error handler (last middleware)
│   │   └── validate.js      ← express-validator result checker
│   ├── routes/
│   │   ├── auth.routes.js          ← /api/auth/*
│   │   ├── activities.routes.js    ← /api/activities/*
│   │   ├── goals.routes.js         ← /api/goals/*
│   │   ├── challenges.routes.js    ← /api/challenges/*
│   │   ├── users.routes.js         ← /api/users/*
│   │   └── recommendations.routes.js ← /api/recommendations/*
│   └── server.js            ← Entry point
├── .env                     ← Secrets (never committed)
├── .env.example             ← Template
└── package.json
```

---

## Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
The `.env` file is already present with the Neon connection string.  
Never commit `.env` — it is in `.gitignore`.

### 3. Run migrations (creates all tables)
```bash
npm run db:migrate
```

### 4. Seed initial data (challenges)
```bash
npm run db:seed
```

Or do both in one command:
```bash
npm run db:setup
```

### 5. Start the dev server
```bash
npm run dev
```

Server runs on **http://localhost:5000**

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account, returns JWT |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✓ | Get current user profile |
| PATCH | `/api/auth/onboard` | ✓ | Complete onboarding |

### Activities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | Paginated list (`?page&limit&category&date_from&date_to`) |
| POST | `/api/activities` | Log new activity |
| GET | `/api/activities/summary` | Totals by category (`?period=today\|week\|month\|year`) |
| GET | `/api/activities/trend` | Daily totals for sparkline (`?days=7`) |
| PUT | `/api/activities/:id` | Update activity |
| DELETE | `/api/activities/:id` | Delete activity |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/goals` | List goals (`?status=active\|completed\|all`) |
| POST | `/api/goals` | Create goal |
| PATCH | `/api/goals/:id` | Update progress/status |
| DELETE | `/api/goals/:id` | Delete goal |

### Challenges
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/challenges` | All active challenges + join status |
| POST | `/api/challenges/:id/join` | Join a challenge |
| GET | `/api/challenges/:id/leaderboard` | Top 20 participants |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recommendations` | Today's tips (auto-seeded if empty) |
| PATCH | `/api/recommendations/:id` | Mark done or skip |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Full profile |
| PATCH | `/api/users/profile` | Update profile |
| GET | `/api/users/dashboard` | All dashboard stats in one request |
| DELETE | `/api/users/account` | Delete account + all data |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server status check |

---

## Database Schema

```
users               — account + profile
activities          — carbon log entries per user
goals               — reduction goals per user
challenges          — platform-wide monthly challenges
challenge_members   — user ↔ challenge join table (with score_kg)
recommendations     — AI/static tips per user per day
```

All tables use `SERIAL PRIMARY KEY` and `TIMESTAMPTZ` timestamps.  
`activities.user_id`, `goals.user_id` etc. cascade-delete when a user is removed.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `DATABASE_URL` | Neon PostgreSQL connection string | — |
| `JWT_SECRET` | Secret for signing JWTs | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
