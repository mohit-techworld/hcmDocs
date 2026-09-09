---
sidebar_position: 1
title: Overview
description: The Human Maximizer employee mobile app — an Expo/React Native client covering attendance, leave, payroll, tasks, chat and calls for every tenant of the HCM platform.
---

# HCM Mobile App

The employee-facing mobile client for the Human Maximizer HRMS. It is a
full employee **and** manager portal rather than a companion app: attendance and
punching, leave, payroll, tasks, tickets, loans and advances, roster, a social
feed, and real-time chat with video calling.

| | |
| --- | --- |
| Platform | React Native 0.81.4 on Expo SDK 54, New Architecture enabled |
| Package | `com.razorinfotech.humanmaximizernew` |
| Distribution | EAS Build and Submit, with over-the-air updates |
| Languages | English and Hindi (~2,860 translated keys) |
| Scale | ~330 source files |

## How it fits the platform

The app is **multi-tenant, with one backend per tenant**. A device is bound to a
workspace during onboarding, and that workspace's host becomes the base URL for
every request afterwards. There is no shared gateway and no build-time API
configuration — a single binary serves every customer.

```
Employee's phone
      │  workspace + company ID
      ▼
https://<subdomain>v2.humanmaximizer.in
      │  X-Tenant-Subdomain on every request
      ▼
Tenant backend  ──  /api/v1  REST
                ──  /chat    Socket.IO (messaging and call signalling)
                ──  LiveKit  media, via a token minted by the backend
```

## Where to start

- **[Installation](./getting-started/installation.md)** — prerequisites, running
  the app locally, and the native build steps.
- **[Project Structure](./getting-started/project-structure.md)** — what lives
  where, including the traps in this tree.
- **[Architecture](./architecture/overview.md)** — bootstrap order, providers,
  and why `index.js` uses `require` instead of `import`.
- **[Attendance & Punching](./modules/attendance.md)** — the largest and most
  rule-dense subsystem.
- **[Authentication](./security/authentication.md)** — how an employee gets in.

## What makes this app unusual

**The device is part of the trust boundary.** Because attendance is recorded
here, the app carries an anti-fraud layer most HR apps do not: root and hook
detection that blocks the app outright, mock-location detection, a device clock
compared against server time before every punch, one-account-per-device
enforcement, and a device integrity verdict attached to each punch.

**Two punch pipelines coexist.** A geofence-map flow and a step-by-step
verification flow (location → face → fingerprint) both record attendance
through different endpoints. Both are live.

**Nothing is configured at build time.** There are no environment variables
anywhere in the project. Base URLs arrive at runtime from the workspace the
employee selected.

:::note About this documentation
This documents the app **as it is**, not as it is planned to be. Where behaviour
is surprising, incomplete, or contradicts a nearby comment, it is written down
rather than tidied away — including features that exist in the tree but are not
reachable from the UI. A separate `PROJECT_REVIEW_AND_AUDIT.md` in the app
repository covers code quality and security posture in judgemental terms; this
section stays descriptive.
:::
