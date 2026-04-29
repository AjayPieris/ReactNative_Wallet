# React Native Wallet

A simple wallet/expense tracker built with an Expo (React Native) mobile app and a Node.js (Express) backend API backed by Postgres (Neon).

- Mobile app docs: [mobile/README.md](mobile/README.md)
- Backend code: [backend/](backend/)

## Features

- **Authentication**: Clerk-powered sign in / sign up (mobile)
- **Transactions**: Create, list, and delete transactions (income & expenses)
- **Summary**: Balance, total income, and total expenses per user
- **Rate limiting** (optional): Upstash Redis-based limiter (backend)

## Tech stack

- **Mobile**: Expo + Expo Router, React Native
- **Auth**: Clerk (`@clerk/clerk-expo`)
- **Backend**: Node.js, Express, CORS, dotenv
- **Database**: Postgres (Neon via `@neondatabase/serverless`)
- **Rate limiting**: Upstash (`@upstash/redis`, `@upstash/ratelimit`) — optional

## Repository layout

```
.
├─ backend/                 # Express API + Neon Postgres
└─ mobile/                  # Expo app (Expo Router)
```

## Quick start (local development)

### 1) Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```bash
# Required (choose ONE; the code checks a few common names)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"

# Optional
PORT=3000

# Optional (enables rate limiting when set)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

Run the server:

```bash
npm run dev
```

API will be available at `http://localhost:3000/api/transactions`.

### 2) Mobile

```bash
cd mobile
npm install
```

Create `mobile/.env`:

```bash
# Required
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY="YOUR_CLERK_PUBLISHABLE_KEY"

# Optional routing (defaults shown)
EXPO_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
EXPO_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
EXPO_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
EXPO_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Optional: override API base URL
# - Android Emulator: http://10.0.2.2:3000
# - iOS Simulator: http://localhost:3000
# - Physical device:  http://<YOUR_LAN_IP>:3000
EXPO_PUBLIC_API_BASE_URL="http://localhost:3000"
```

Start Expo:

```bash
npx expo start
```

Notes:

- On **device**, your phone and your backend machine must be on the same network.
- The app can auto-detect the backend host from the Metro bundler, but setting `EXPO_PUBLIC_API_BASE_URL` is the most reliable option (especially for Android emulators).

## API

Base URL: `/api/transactions`

- `GET /api/transactions` — health check
- `POST /api/transactions` — create transaction
- `GET /api/transactions/:userId` — list transactions for a user
- `GET /api/transactions/summary/:userId` — get summary `{ balance, income, expense }`
- `DELETE /api/transactions/:id` — delete transaction by id

### Create transaction

`POST /api/transactions`

Request body:

```json
{
  "user_id": "clerk_user_id",
  "title": "Coffee",
  "amount": -4.5,
  "category": "food"
}
```

- Use a **negative** `amount` for expenses and a **positive** `amount` for income.

## Common issues

- **Mobile can’t reach backend**: set `EXPO_PUBLIC_API_BASE_URL` explicitly.
  - Android emulator: `http://10.0.2.2:3000`
  - Physical device: `http://<your-computer-lan-ip>:3000`
- **Clerk key missing**: Expo will throw on startup until `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is set.
- **Database connection error**: ensure `DATABASE_URL` (or one of the supported aliases) is set in `backend/.env`.

## Scripts

Backend (`backend/package.json`):

- `npm run dev` — start with watch mode
- `npm run start` — start server

Mobile (`mobile/package.json`):

- `npm run start` — start Expo
- `npm run android` / `npm run ios` / `npm run web`
- `npm run lint`

## Contributing

Issues and PRs are welcome. If you’re adding features, please include a short description and how to test.
