---
title: Device Integrity & App Lock
sidebar_position: 3
description: Root and hook detection, the developer-mode block, biometric app lock, device identity, and how the app reports crashes and enforces updates.
---

# Device Integrity & App Lock

Because the app records attendance, it treats the device itself as part of the
trust boundary. Two independent mechanisms use `jail-monkey`: one **blocks** the
app outright, the other **reports** a verdict to the server with each punch.

Both import `jail-monkey` dynamically, so the bundle still builds if the module
is absent — and both fail open if that import throws.

## The blocking guard

`src/components/common/DeveloperModeGuard.js` wraps the entire app. When it
detects a problem it replaces the whole UI with a full-screen block.

| Signal | Severity | Employee can resolve? |
| --- | --- | --- |
| Rooted or jailbroken | Unfixable | No — re-check only |
| Frida / Xposed hook detected | Unfixable | No — re-check only |
| Android Developer Options enabled | Fixable | Yes — opens Developer Options |

The fixable case gives step-by-step instructions and a button that launches
`android.settings.APPLICATION_DEVELOPMENT_SETTINGS`. An `AppState` listener
re-runs the check whenever the app returns to the foreground, so turning the
setting off unblocks the app without restarting it.

:::warning The block is Android-only
`detectCompromisedDevice()` returns "not blocked" for every non-Android
platform, so a jailbroken iOS device is never stopped by this guard.
:::

Mock-location capability is detected but deliberately **not** blocked. On
Android, `jail-monkey` reports true if any installed app merely declares the
mock-location permission, which would block innocent users. The authoritative
check is server-side, where a fix reporting `mocked === true` is rejected.

## The reporting service

`src/services/deviceIntegrityService.js` collects a broader set of signals and
reduces them to a verdict, cached for 12 hours:

- **Compromised** — rooted or jailbroken, Frida/Xposed hook, or a mock-location
  app actively selected
- **Flagged** — developer options on, ADB enabled, app on external storage, or a
  debugger attached
- **Trusted** — none of the above
- **Unknown** — detection unavailable

The only caller is the punch-in handler in `src/store/PunchContext.js`, which
attaches the verdict to the punch payload as `deviceIntegrity`. A failed check
sends `null`.

:::info The client never blocks a punch on integrity
The verdict is evidence, not enforcement. Whether a compromised device may
record attendance is a server-side policy decision.
:::

## App lock

`src/services/appLockService.js` provides an optional biometric lock over the
whole app, configured in Settings.

There is **no app-managed PIN**. The only fallback is the device passcode,
offered through `expo-local-authentication`.

Locking is time-based rather than immediate. Sending the app to the background
records the moment; on return, `shouldLockBasedOnTimeout()` decides whether
enough time has passed. Available timeouts are immediate, 1 minute, 5 minutes
and 1 hour.

That function is deliberately fail-secure — it locks when the clock appears to
have moved backwards, when elapsed time is negative, and when the check itself
throws. This is the opposite stance to token validation, and intentionally so:
an unreadable lock state should lock, while an unreachable server should not
sign anyone out.

Toggling the setting in either direction requires a successful biometric prompt
first, so someone holding an unlocked phone cannot quietly disable it.

:::caution No attempt limit, and no way out
`AppLockScreen` retries indefinitely. There is no failure counter, no lockout
and no sign-out escape hatch. If biometrics are removed from the device while
app lock is enabled, the unlock button renders disabled and the only recovery is
reinstalling the app.
:::

## Device identity

`src/services/deviceIdService.js` produces the identifier that binds an account
to a handset. It is the one value stored in `expo-secure-store`.

- **Android** — `ANDROID_ID`, falling back to a stored UUID
- **iOS** — identifier-for-vendor, falling back to a stored UUID

Alongside it, `getDeviceInfo()` reports model, brand, device name, OS version
and app version. This identity is sent on login, on push-token registration, and
on `POST /device/ping`, which runs at most once every 24 hours to keep the
server's record of the device fresh.

:::note A second, unrelated device ID exists
Workspace verification sends its own `x-device-id`, generated in
`CompanyIdScreen` as `hm-device-{timestamp}-{Math.random()}` and stored under a
different key. It is never reconciled with the SecureStore identity used
everywhere else.
:::

## Crash reporting

Crashes are captured by a global handler installed before the app loads
(`src/services/crashGlobalHandler.js`) and reported to the **tenant's own
backend** at `POST /crash-reports` — there is no Sentry, Crashlytics or
Bugsnag in this project.

The report carries the message, the stack, device info and the employee ID. It
is sent with a raw `fetch` so it bypasses the axios interceptors, and it is
unauthenticated by design. If no workspace is bound yet, the report is dropped.

In production the original React Native error handler is not called, so the
in-app crash screen replaces the red box and the app offers a reload.

## Forced updates

Two independent update paths run:

- **Over-the-air**, through `expo-updates`, guarded by a cooldown so a bad
  update cannot cause a reload loop.
- **Store updates**, through `src/services/appUpdateService.js`, which asks
  `GET /app/version` for the minimum acceptable version and build number. If the
  installed build is below the floor, a full-screen blocker appears with no
  "Later" option.

:::caution Two gaps in the store-update path
The iOS App Store ID is `null` with an outstanding `TODO`, so iOS cannot deep-link
to its own listing and falls back to a search URL. And `ForceUpdateBlocker`
clears itself when the app next returns to the foreground, while the check that
raises it runs only once per session — so backgrounding the app dismisses the
block for the rest of that session.
:::
