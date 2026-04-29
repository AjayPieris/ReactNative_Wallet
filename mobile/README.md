# Mobile (Expo)

This folder contains the Expo (React Native) client for the React Native Wallet project.

For the full monorepo overview (backend + mobile), see the root README: [../README.md](../README.md).

## Requirements

- Node.js (LTS recommended)
- Expo tooling (Expo Go or a simulator/emulator)

## Setup

Install dependencies:

```bash
npm install
```

Create `mobile/.env` (required for Clerk):

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY="YOUR_CLERK_PUBLISHABLE_KEY"

# Optional routing (defaults shown)
EXPO_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
EXPO_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
EXPO_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
EXPO_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Optional API override
EXPO_PUBLIC_API_BASE_URL="http://localhost:3000"
```

## Run

Start Expo:

```bash
npx expo start
```

Run on a specific platform:

```bash
npm run android
npm run ios
npm run web
```

## Backend connectivity

By default the app tries to infer the backend host from Metro, but if you have connectivity issues, set `EXPO_PUBLIC_API_BASE_URL` explicitly.

- Android emulator: `http://10.0.2.2:3000`
- iOS simulator: `http://localhost:3000`
- Physical device: `http://<your-computer-lan-ip>:3000`

## Lint

```bash
npm run lint
```
