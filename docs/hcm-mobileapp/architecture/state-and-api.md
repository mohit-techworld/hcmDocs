---
title: State & API Layer
sidebar_position: 3
description: The zustand stores and React contexts that hold app state, the axios instances, and how tenant resolution and headers work on every request.
---

# State & API Layer

State is split between **zustand stores** for data and **React contexts** for
things with a lifecycle — sockets, calls, the punch engine, language.

## Contexts

| Context | Responsibility |
| --- | --- |
| `SocketProvider` | Owns the single Socket.IO connection and a listener registry |
| `ChatProvider` | Conversations, groups, messages |
| `LiveKitCallProvider` | Call signalling and the LiveKit room |
| `PunchProvider` | The attendance engine — shift state, location, punching |
| `LanguageProvider` | Current locale, persisted under `APP_LANG` |

`SocketProvider` is worth understanding. It does not create the socket —
`src/services/socketService.js` owns that — but it keeps an `event → handlers`
registry and **re-binds every listener when the socket instance is replaced**.
Because reconnects create a new instance, a component that binds directly to the
socket silently stops receiving events after a reconnect. Use `subscribe()` from
this context rather than binding to the socket yourself.

## Stores

| Store | Persisted | Holds |
| --- | --- | --- |
| `useAuthStore` | manual | Token, tenant URL, company ID, profile, session actions |
| `useLeaveStore` | yes | Leave records, balances, types, managers |
| `useCompanySettingsStore` | yes | Attendance and leave policy, company info |
| `useOwnFullAttendanceStore` | yes | Own attendance history and derived rows |
| `useDepartmentStore` | yes | Departments |
| `useFeedStore` | no | Social feed, comments, likes, polls |
| `useLoanAdvanceStore` | no | Loans, advances, reimbursements |
| `useIssuesStore`, `usePoshStore` | no | Tickets and POSH complaints |
| `useLocationVisitMobileStore` | no | Field visits, with an offline queue |
| `useSocketStore` | no | A second socket used only by the feed |

:::note `AuthContext` is dead — use `useAuthStore`
`src/store/AuthContext.js` still exists and is imported in two files, but every
use is commented out and the provider is never mounted. `useAuthStore` is
imported in around sixty files and is the real one. Do not revive `AuthContext`:
its `logout()` calls `AsyncStorage.clear()`, which would erase the tenant
binding along with the session.
:::

## Tenant resolution

There are no base-URL constants. `src/api/BaseUrl.js` only builds paths:

```js
export const buildApiUrl    = (baseUrl) => joinPath(baseUrl, "api/v1");
export const buildSocketUrl = (baseUrl) => joinPath(baseUrl, "chat");
```

The tenant host itself is produced during onboarding and stored as
`companySpecificUrl`. Every request then resolves its own `baseURL` at call
time, which is what lets one binary serve every customer.

`buildEngagementSocketUrl` also returns `/chat`. The name is historical — the
backend has no separate engagement namespace, and returning the bare root landed
events on the default namespace instead.

## The axios instances

| Instance | Auth | Response handling |
| --- | --- | --- |
| `AxiosInstance` | Bearer token | Full refresh, tenant and logout cascade |
| `publicAxios` | None, deliberately | Request interceptor only |

Both attach the same identity headers on every call:

| Header | Value |
| --- | --- |
| `Authorization` | `Bearer <token>` — authenticated instance only |
| `x-device-type` | `android` or `ios` |
| `x-client-app` | `hcm-mobile` |
| `X-Tenant-Subdomain` | The workspace subdomain |

`x-client-app` gives the mobile app its own backend session, separate from other
clients. `X-Tenant-Subdomain` replaced a legacy `companyId` header.

### FormData handling

When the body is `FormData`, the interceptor deletes every `Content-Type` header
and clears `transformRequest`, so React Native can set the multipart boundary
itself. Setting that header manually on an upload is the usual cause of a server
rejecting a file.

The response interceptor's ordering is covered in
[Sessions & Tokens](../security/sessions-and-tokens.md).

## Rules mirrored from the backend

Some client files are deliberate copies of server logic so that the app, the web
app and the backend agree on what a day of attendance means:

- `src/utils/attendancePolicyHours.js` — full-day and half-day hour thresholds,
  declared as a 1:1 mirror with a note to keep all three copies in step
- `src/utils/attendanceUtils.js` — status derivation, ported from the web app

Changing a rule in one place without the others produces an app that disagrees
with payroll. Treat these files as a contract rather than as local helpers.
