# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

Cross-platform mobile app (React Native + Expo, TypeScript) for tracking wear and
service history of bicycle components. Every ride adds mileage and ride time to a
bike **and** to each component installed on it at that moment. Backend is Firebase
(Auth, Firestore, Storage); rides can be synced from Strava. There is no custom
server — the app talks to Firestore and the Strava API directly.

## Tech stack

- **Runtime:** Expo SDK 51, React Native 0.74.5, React 18.2, TypeScript ~5.3
- **Navigation:** React Navigation v6 (bottom tabs, native stack, material top tabs)
- **Backend/data:** Firebase JS SDK v9 (modular) — Auth, Firestore, Storage; `axios`
- **Auth/Strava:** `expo-auth-session`, `expo-web-browser` (Strava API v3)
- **UI:** React Native Paper v4, vector icons, popup menu, picker, datetimepicker
- **Forms:** `react-hook-form`
- **Monitoring:** `@sentry/react-native`

## Commands

There is **no lint, test, format, or typecheck script** in `package.json`. For a
type check, run `npx tsc --noEmit` manually.

| Command | What it does |
|---|---|
| `npm run dev` | `npx expo start` — start the Metro bundler |
| `npm run android_prebuild` | `eas build --profile development --platform android` — dev-client build |
| `npm run android_apkbuild` | `eas build --platform android --profile preview` — installable APK |
| `npm run android_prodbuild` | `eas build --platform android` — production build (auto-increments version) |

## Layout

Entry: `App.tsx` (wraps `<Root/>` in the auth provider) → `Root.tsx` (auth gate +
navigators) → `context.tsx` (`AuthenticatedUserContext`).

```
App/
  config/     firebase.tsx           Firebase init (guarded with getApps())
  modules/    firestoreActions.ts    central data layer — ALL Firestore access + mileage propagation
              stravaApi.ts           Strava OAuth + API v3
              helpers.ts             formatting/util (activeScreenName)
              bikeIcons.ts, componentIcons.ts
  screens/    ~31 files: screens + per-tab navigators (*Stack.tsx, *Tabs.tsx)
  components/ reusable cards (Card, CardBase, ServiceRecordCard, WearRecordCard, ...)
  assets/     icon/splash/images
```

There is **no `src/`** and no `App/navigation/` folder — navigators are declared
inline in `Root.tsx` and in the `*Stack.tsx` / `*Tabs.tsx` files under `App/screens/`.

## Conventions & rules for agents

- **All Firestore access goes through `App/modules/firestoreActions.ts`.** The
  mileage / ride-time propagation logic (installing backfills history, uninstalling
  subtracts, editing a ride recalculates affected bikes/components/records) lives
  here and must stay centralized here. Do not scatter `getDoc`/`setDoc` calls into
  screens.
- **State:** `context.tsx` holds `{ User, setUser, IsLoggedIn, setIsLoggedIn }`.
  `Root.tsx` subscribes to `auth.onAuthStateChanged`, loads `users/{uid}`, merges it
  into `User`, and gates between the logged-in tab navigator and the login stack.
- **Firebase app** comes from `App/config/firebase.tsx` (`firebaseApp`). Import the
  modular SDK functions directly.
- **Imports are relative** (e.g. `../config/firebase`) — no path aliases configured.
- `tsconfig.json` extends `expo/tsconfig.base`; the codebase is loosely typed in
  practice (`any` is common). Match the surrounding style.

## Environment variables

- Config is loaded via `dotenv/config` in `app.config.js` and read at runtime through
  the **`EXPO_PUBLIC_` prefix** (required to reach the bundle). Copy `envtemplate` →
  `.env` (gitignored).
- **Watch out:** `envtemplate` lists bare names *without* the `EXPO_PUBLIC_` prefix,
  but the code requires the prefix. The real `.env` must use prefixed names:
  `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_AUTH_DOMAIN`, `EXPO_PUBLIC_PROJECT_ID`,
  `EXPO_PUBLIC_STORAGE_BUCKET`, `EXPO_PUBLIC_MESSAGING_SENDER_ID`, `EXPO_PUBLIC_APP_ID`,
  `EXPO_PUBLIC_MEASUREMENT_ID`, `EXPO_PUBLIC_STRAVA_APP_CLIEND_ID`,
  `EXPO_PUBLIC_STRAVA_APP_SEC`.
- **`STRAVA_APP_CLIEND_ID` is a load-bearing typo** ("CLIEND", not "CLIENT"). It is
  spelled that way in both `envtemplate` and `stravaApi.ts`. Do **not** fix one side
  without the other — keep them consistent.

## Gotchas

- **Expo Go will not work.** The app needs native modules and a custom URL scheme, so
  build a dev client once (`npm run android_prebuild`), install the APK, then `npm run dev`.
- **Custom URL scheme** `bikecomponentsmanager`; Strava OAuth redirects to
  `bikecomponentsmanager://redirect` (hardcoded in `stravaApi.ts`).
- **`google-services.json` is committed but unused** by the current JS-SDK build
  (Firebase is initialized from `EXPO_PUBLIC_` env vars). It only matters if native
  Firebase modules are added later; it does not need to be replaced.
- **Firestore composite indexes:** several queries (equality + range/order) fail on
  first run and log a link that creates the required index — open each link once.
- **Firestore security rules are not in this repo** — a deployment supplies its own.
- `metro.config.js` adds `cjs` to `assetExts` (required for the Firebase JS SDK).
- Strava-login users get a derived `<athleteId>@stravauser.com` Firebase account, so
  email/password and Strava share one user model.
- The Strava client secret is bundled into the app — fine for a personal build, not a
  public release.
