---
title: Sessions & Tokens
sidebar_position: 2
description: How the mobile app stores, refreshes and revokes access tokens — silent refresh, the axios interceptor chain, and what happens when a session expires.
---

# Sessions & Tokens

A session is an access token plus a refresh token, both held on the device and
renewed in the background. Three pieces of code own this between them:

| Concern | File |
| --- | --- |
| Scheduled renewal before expiry | `src/services/silentRefreshService.js` |
| Renewal after a rejected request | `src/api/AxiosInstance.js` |
| Periodic validity checks | `src/utils/tokenValidator.js` |

## Where session data is stored

All session state lives in `AsyncStorage`:

| Key | Contents |
| --- | --- |
| `accessToken` | Bearer token sent on every request |
| `refreshToken` | Rotated on each refresh |
| `tokenExpiresAt` | Access-token expiry |
| `refreshTokenExpiresAt` | Refresh-token expiry |
| `tokenSilentRefreshAt` | Server-chosen moment to refresh early |
| `cachedUserData` | Last known profile, used offline |
| `employeeId` | Employee code |

:::warning Tokens are not encrypted at rest
`expo-secure-store` is a dependency but is used only for the device identifier
(`src/services/deviceIdService.js`). Access and refresh tokens, and the cached
profile, are stored as plain `AsyncStorage` entries. Moving them into
`SecureStore` would be the single highest-value hardening change to this app.

Related: `src/store/useSocketStore.js` tries `SecureStore.getItemAsync("accessToken")`
before falling back to `AsyncStorage`. Nothing ever writes that key, so the
first read always misses.
:::

## Silent refresh

`initializeSilentRefresh()` schedules a timer for whichever comes first: the
server-provided `tokenSilentRefreshAt`, or five minutes before expiry. When it
fires, `performSilentRefresh()` posts to `/auth/refresh-token`.

That call deliberately uses a bare axios instance rather than the shared one, so
a failing refresh cannot trigger the interceptor that would try to refresh
again. On success it writes the new access token, the rotated refresh token and
all three timestamps, then hands the new token to the socket layer via
`updateSocketAuth()` and re-arms the timer.

Signing out calls `stopSilentRefresh()`, which clears both the timer and the
timestamp keys.

## The interceptor chain

`src/api/AxiosInstance.js` attaches the bearer token and tenant headers to every
request. Its response handler resolves failures in a fixed order, and the order
is what makes the behaviour predictable:

1. **Network errors** — surfaced as a toast and rejected. Never refreshes, never
   signs out. A connectivity blip must not end a session.
2. **Tenant errors** — `TENANT_HEADER_REQUIRED`, `TENANT_REQUIRED`,
   `TENANT_MISMATCH`, `COMPANY_NOT_FOUND`, `MOBILE_ACCESS_DISABLED`,
   `TRIAL_EXPIRED`, `USER_INACTIVE`. The first four force re-onboarding, since
   the device's tenant binding is no longer valid.
3. **Self-authenticating endpoints** — anything under `/attendance/biometric` or
   `/face-v2/` is rejected without refresh, because those endpoints carry their
   own verification.
4. **Already-retried `401`** — sign out with a "Session expired" alert. A `403`
   is explicitly excluded here; treating it as expiry once signed users out
   during payslip downloads.
5. **Auth endpoints** — a `401` from `/auth/login`, `/auth/logout`,
   `/auth/refresh-token`, `/auth/verify-otp` or `/auth/resend-otp` is returned
   as-is rather than triggering a refresh loop.
6. **Everything else with a `401`** — refresh once and replay the request.
   Concurrent failures queue behind the single refresh rather than each starting
   their own.

If that refresh fails while the network is up, the app prompts for biometric
confirmation and retries once more before signing the employee out. The
intention is that a recoverable session is never dropped silently.

## Periodic validation

`checkTokenAndLogoutIfExpired()` runs the same idea on a coarser schedule:

1. Offline? Do nothing.
2. Refresh if the token is close to expiry.
3. Otherwise verify by calling `GET /user/profile` with a five-second timeout.
4. If that says the token is invalid, prompt for biometrics and try one more
   refresh before signing out.

:::caution Validation fails open, including on 5xx
The network-error branch of `validateToken()` returns "valid" for any transport
failure — and its predicate also matches HTTP `500`–`599`. A backend outage will
therefore leave sessions intact rather than signing everyone out. That is
deliberate for availability, but it does mean a server that is failing rather
than rejecting cannot end a session.
:::

## Signing out

`useAuthStore.logout()` unwinds the session in a fixed order: disconnect the
socket, stop location tracking, tell the backend to drop the push token, clear
the app lock, clear chat caches and the pending visit queue, stop silent
refresh, and finally remove the token and profile keys.

Two behaviours are worth knowing:

- **The workspace survives sign-out.** `companySpecificUrl`, `companyId` and
  `tenantSubdomain` are left in place on purpose, so the next employee to sign
  in on that device does not re-enter the workspace. "Change workspace" is the
  action that clears them.
- **Server-side revocation depends on a cached push token.** The only call to
  `POST /auth/logout` happens inside `removeTokenFromBackend(pushToken)`. If no
  push token is stored — for example when notification permission was declined —
  the tokens are cleared locally but the server is never told, and the refresh
  token remains valid until it expires on its own.

:::note Navigation reset target does not exist
`src/hooks/useLogout.js` resets navigation to a route named `LoginScreen`, which
is not registered in `RootNavigation`. Sign-out still works, but only because
clearing `authToken` re-renders the navigator into the authentication stack —
not because the reset succeeds.
:::

## Token decoding

`src/utils/jwtDecoder.js` decodes tokens on the client for expiry checks only.
It does **not** verify signatures, and says so in its own header comment. Its
helpers (`isTokenExpired`, `shouldRefreshToken`) deliberately fail *towards*
refreshing when a token cannot be decoded, so a malformed token produces a
refresh attempt rather than silent breakage. `shouldRefreshToken` returns true
when five minutes or less remain.
