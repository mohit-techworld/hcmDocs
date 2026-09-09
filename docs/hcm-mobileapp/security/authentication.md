---
title: Authentication & Onboarding
sidebar_position: 1
description: How an employee signs in to the mobile app — workspace onboarding, employee ID and password, OTP verification, password reset, and device registration.
---

# Authentication & Onboarding

Signing in happens in two distinct stages. First the device is bound to a
**workspace** (a tenant), which decides which backend every later request talks
to. Only then can an employee authenticate against that workspace.

The whole authenticated area of the app is gated on one value: the presence of
`authToken` in the auth store. `src/navigation/RootNavigation.js` renders the
drawer navigator when a token exists and the sign-in stack when it does not, so
clearing the token is what returns a user to the login screens.

## Stage 1 — Workspace onboarding

`src/Screen/authentication/CompanyIdScreen.js` is the app's first screen until
onboarding completes. The employee enters two things:

| Field | Format | Example |
| --- | --- | --- |
| Workspace | subdomain, up to 50 characters | `razor` |
| Company ID | 10 digits | `1506491936` |

A full host may be pasted — `razor.humanmaximizer.com` is reduced to `razor`
before use.

The screen then calls `POST /api/v1/tenant/verify` on the tenant's own host,
built as:

```js
`https://${subdomain}v2.humanmaximizer.in`
```

On success three values are persisted and become the foundation of every later
request: `companySpecificUrl` (that base URL), `companyId`, and
`tenantSubdomain`. Onboarding is then marked complete, and the entry screen
becomes `WelcomeScreen`.

Verification failures are mapped to specific outcomes rather than a generic
error:

| Server condition | What the employee sees |
| --- | --- |
| `404` | Workspace not found |
| `TRIAL_EXPIRED` | Trial-ended screen linking to pricing |
| `USER_INACTIVE` | Account inactive — contact HR |
| `403` + `MOBILE_ACCESS_DISABLED` | Mobile access not included in the plan |

:::note Attempt limiting is local only
The five-attempt limit and 30-second cooldown on this screen are React state.
Restarting the app resets them. Treat rate limiting on workspace verification as
a server-side responsibility.
:::

## Stage 2 — Employee sign-in

`src/Screen/authentication/SignInScreen.js` handles both sign-in steps in one
screen.

**Step 1 — credentials.** The employee enters their **Employee ID** and
password, which are sent to `POST /auth/login` along with the device identity
(`device_id` plus model, brand, name, OS version and app version).

The response decides what happens next:

- If it contains `requiresOtp`, no token is issued yet and the screen advances
  to step 2.
- Otherwise the access token is stored immediately and the profile is fetched.

**Step 2 — OTP.** A six-digit code is entered and verified through
`POST /auth/verify-otp`. A 59-second timer gates `POST /auth/resend-otp`.

A pending OTP survives the app being closed: if `otpPending` was set less than
**five minutes** ago, reopening the app returns the employee to step 2 rather
than the password form. Older pending states are cleared.

### Device registration conflicts

An employee account is bound to one device. When the server reports a mismatch —
`requiresDeregistration`, or a `403` naming the registered device — the app
shows the brand, model and registration date of the device currently holding the
account, and directs the employee to contact HR. This is the expected path when
someone changes phones.

## Password reset

`src/Screen/authentication/ForgotPassword.js` collects the Employee ID only and
calls `POST /auth/password-reset-request`. If the account has no work email on
file, the server returns `WORK_EMAIL_NOT_AVAILABLE` and the app explains that HR
must set one.

:::info Reset completes on the web, not in the app
The emailed reset link cannot open the app — no deep-link configuration is
registered on the navigation container. Employees finish the reset in a browser
and then sign in normally.
:::

## Changing workspace

"Change workspace" clears the tenant binding together with the session:
`companySpecificUrl`, `companyId`, `tenantSubdomain`, `onboarding`,
`accessToken`, `refreshToken` and `employeeId` are all removed, and navigation
resets to `CompanyIdScreen`. This is the only routine action that unbinds a
device from its tenant — a normal sign-out deliberately keeps the workspace
selected.

## Screens that are registered but unreachable

Several authentication screens exist in the navigator without a live path to
them. They are noted here so that nobody mistakes them for the active flow:

| Screen | Status |
| --- | --- |
| `LoginScreen.js` | Static mock UI, not registered in any navigator |
| `EnterOtp.js` | Standalone OTP screen; every `navigate` call to it is commented out — OTP is handled inline in `SignInScreen` |
| `ResetPassword.js`, `PasswordChanged.js` | Registered but never navigated to; reset finishes on the web |
| `SplashScreen.js` | Used only as the loading placeholder while a session is restored |
