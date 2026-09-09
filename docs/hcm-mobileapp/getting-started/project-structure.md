---
title: Project Structure
sidebar_position: 2
description: The folder layout of the mobile app, what belongs in each directory, and the naming traps and dead modules to be aware of before editing.
---

# Project Structure

```
HCM-MobileApp/
├── index.js              bootstrap — order matters, see Architecture
├── App.js                provider tree, update checks, notification routing
├── app.config.js         Expo config, plugins, identifiers, Maps keys
├── eas.json              build and submit profiles
├── plugins/              custom config plugins (withUberLocation)
├── patches/              patch-package output (zustand)
├── android/              committed native project
└── src/
    ├── api/              axios instances and URL builders
    ├── Screen/           screens, grouped by feature
    ├── components/       feature components and shared UI
    ├── navigation/       navigators and the drawer
    ├── roots/            the landing screen behind each tab
    ├── store/            zustand stores (plus two contexts)
    ├── context/          React contexts (socket, chat, calls, language)
    ├── services/         side-effectful modules: push, calls, integrity, uploads
    ├── utils/            pure helpers and rule mirrors
    ├── hooks/            useTranslation, useLogout, useVoiceSearch
    ├── i18n/             en.json, hi.json and the i18n instance
    └── config/           Colors.js
```

## How the layers relate

`Screen/` and `components/` are split by feature, not by type, and the two
mirror each other — `Screen/leave/` holds the leave screens while
`components/leave/` holds the pieces they compose.

`roots/` is easy to misread: these are not navigators but the **landing screen
for each bottom tab** — `Home`, `Synergy`, `Menu`, `Chats`, `Profile`.

`store/` is mostly zustand, but three files in it are not stores at all:
`TaskServices.js` is a set of plain API functions, `useDashboard.js` and
`useTasks.js` are ordinary hooks, and `PunchContext.js` is a React context that
happens to live here.

## Naming traps

This tree has several spellings that look like mistakes and are load-bearing.
Check before you "fix" one.

:::danger Both attendance folders are live
`src/Screen/attendance/` (correct spelling) holds **manager** screens.
`src/Screen/attendence/` (misspelled) holds **employee self-service** screens.
`DrawerNavigation.js` imports from both. The same split exists under
`components/attendance/` and `components/attendanceflow/`.
:::

Other names to expect:

| Path | Note |
| --- | --- |
| `components/employeemanagement/EmployeeManagement .js` | The filename really contains a trailing space, and the import repeats it |
| `Screen/attendence/modal/ReimbursementModal .js` | Same trailing-space problem |
| `components/tash-and-posh/` | Typo for "ticket"; the screens are in `Screen/ticket-and-posh/` |
| `ComplateForm.js` | Registered under the route name `ComplaintForm` |
| `ReferralManagment` | Missing an "e" in both the file and the route name |

## Modules that are not reachable

Several files exist without a live path to them. They are listed here so nobody
spends an afternoon debugging code that never runs.

| Path | Status |
| --- | --- |
| `src/navigation/StackNavigation.js` | Imported by the drawer but never registered as a screen. Also references an undeclared `Myprofile`, which would throw if it ever rendered |
| `src/store/AuthContext.js` | Superseded by `useAuthStore`. Never mounted; its `logout()` calls `AsyncStorage.clear()`, which would wipe the tenant binding |
| `src/store/IssuesContext.js` | No importers; superseded by `useIssuesStore.js` |
| `src/store/useTaskStore.js` | No importers, and imports a path that does not exist. Duplicates `TaskServices.js` |
| `src/utils/rosterStatus.js` | No importers anywhere |
| `src/services/fingerprintPunchService.js` | `submitFingerprintPunch()` is never called |
| `src/services/chatFileUpload.js` | Only reachable through two socket helpers that nothing calls |
| `src/utils/geoUtils.js` | Only `calculateDistance` is used; its location helpers call the browser `navigator.geolocation` API and cannot work here |

:::note Large commented-out implementations remain in the tree
Several files carry a previous version above the live one — `ChatContext.js`
(~1,850 lines), `loanAdvanceStore.js` (~980), `useFeedStore.js` (~436),
`useOwnFullAttendanceStore.js` (~324), and others. When opening one of these
files, scroll to the first uncommented line before reading.
:::

## Assets and configuration files

- `assets/fonts/` — Urbanist and Lexend, registered as `MyFont-*` family names
- `assets/notification.wav`, `assets/ringtone.wav` — registered through the
  `expo-notifications` plugin so they survive a prebuild
- `google-services.json`, `GoogleService-Info.plist` — Firebase messaging config

:::warning Two files need regenerating
Both Firebase config files carry in-file warnings that they still target the
**previous** bundle identifier. Until they are re-downloaded for
`com.razorinfotech.humanmaximizernew`, iOS push delivery will not work.

Separately, `my-upload-key.keystore` is committed at the repository root.
Anyone with repository access can sign builds the Play Store will accept as
authentic updates. Rotating that key and purging it from history is the single
most urgent item in this repository.
:::
