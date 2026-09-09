---
title: Tenancy & Configuration
sidebar_position: 1
description: How one binary serves every tenant, where configuration actually lives, and the hardcoded values and domain mismatches to be aware of when deploying.
---

# Tenancy & Configuration

## One binary, every tenant

There is no per-customer build. A device becomes a tenant's device at
onboarding, when the employee enters a workspace and company ID. From that point
three values in `AsyncStorage` drive everything:

| Key | Role |
| --- | --- |
| `companySpecificUrl` | The tenant's host — the base for every request |
| `companyId` | Used at onboarding and by chat |
| `tenantSubdomain` | Sent as `X-Tenant-Subdomain` on every request |

The host is derived from the subdomain the employee typed:

```js
`https://${subdomain}v2.humanmaximizer.in`
```

Every request resolves its base URL at call time from that stored value, then
appends `/api/v1`. The socket connection uses the same host with `/chat`.

All three values **survive sign-out** by design, so the next employee on a
shared device does not re-enter the workspace. Only "Change workspace", or a
tenant error from the server, clears them.

## Tenant errors

The server can tell the app that its tenant binding is no longer valid. Four
codes force the device back through onboarding:

`TENANT_HEADER_REQUIRED`, `TENANT_REQUIRED`, `TENANT_MISMATCH`,
`COMPANY_NOT_FOUND`

Three more are surfaced as explanations without unbinding the device:
`MOBILE_ACCESS_DISABLED`, `TRIAL_EXPIRED`, `USER_INACTIVE`.

## There are no environment variables

Not one. A search for `process.env` or `EXPO_PUBLIC_` across the entire project
returns nothing. This is a deliberate consequence of runtime tenancy — there is
no build-time API URL to configure — but it also means everything else that
*would* be configuration is hardcoded in source.

:::danger Google Maps API keys are committed in plaintext
Both the Android and iOS Maps keys appear literally in `app.config.js`, in three
places including a fallback inside the custom config plugin. They are in git
history and in every distributed build. Rotate them, restrict them by
application and API in the Google Cloud console, and move them out of source.
:::

Other hardcoded values worth knowing about:

| Value | Where | Note |
| --- | --- | --- |
| `https://demo.humanmaximizer.in/api/v1` | Three token-refresh paths | Development fallback, correctly gated behind `__DEV__` with a production abort |
| `https://razorv2.humanmaximizer.in` | Feed socket store | Development fallback |
| Local tenant host and port `6030` | `CompanyIdScreen.js` | Behind a `USE_LOCAL_MS2` switch, currently off |
| `Asia/Kolkata` | Attendance work-date logic | Would need changing for deployments outside India |
| India bounding box | Office coordinate validation | Used to auto-correct transposed latitude and longitude |

## A domain mismatch to be careful of

Two different domains are in play, and they are not interchangeable:

- **`humanmaximizer.in`** — tenant API hosts, built from the workspace subdomain
- **`humanmaximizer.com`** — deep links, associated domains, privacy policy,
  terms, support and website URLs in `app.config.js`

A comment in `CompanyIdScreen.js` still refers to `.com` while the code builds
`.in`. When adding a URL, check which of the two you actually need.

## Identity headers

Every request carries these, whether authenticated or not:

| Header | Value | Purpose |
| --- | --- | --- |
| `x-device-type` | `android` or `ios` | Platform |
| `x-client-app` | `hcm-mobile` | Gives this app its own backend session, distinct from other clients |
| `X-Tenant-Subdomain` | The workspace | Tenant resolution; replaced a legacy `companyId` header |

Four code paths bypass the axios interceptors and re-add these headers manually:
the interceptor's own refresh, the post-biometric refresh retry, silent refresh,
and the app-version check. If you add another raw request, add the headers too —
a request without `X-Tenant-Subdomain` will be rejected.

## Firebase configuration

Both `google-services.json` and `GoogleService-Info.plist` carry in-file
warnings that they still target the **previous** bundle identifier. Until they
are regenerated for `com.razorinfotech.humanmaximizernew`, iOS push delivery
will not work.

## Release identifiers

| Field | Value |
| --- | --- |
| Bundle / package | `com.razorinfotech.humanmaximizernew` |
| Scheme | `humanmaximizernew` |
| Runtime version | `1.0.0` |
| Minimum Android SDK | 26 |
| Target Android SDK | 35 |
| New Architecture | Enabled |

Build and submit commands are in
[Installation & Running](../getting-started/installation.md).
