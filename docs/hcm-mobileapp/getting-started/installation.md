---
title: Installation & Running
sidebar_position: 1
description: Prerequisites, local development with a dev client, native prebuild steps, and the EAS build and submit commands for the mobile app.
---

# Installation & Running

## Prerequisites

- **Node.js 20+** and npm
- **EAS CLI** ≥ 16 (`npm install -g eas-cli`) for native builds
- **Android Studio** or **Xcode** for local native runs
- An account with access to the Expo project and, for releases, the Razor
  Infotech Apple and Play Console accounts

## Install

```bash
npm install
```

`postinstall` runs `patch-package`, which applies the one patch this project
carries (`patches/zustand+5.0.8.patch`). If you install with `--ignore-scripts`,
apply it manually.

## Running locally

This app **cannot run in Expo Go**. It depends on native modules — LiveKit
WebRTC, Vision Camera, local authentication, a custom location module — so it
needs a development client.

```bash
npx expo start --dev-client
```

To build and install that client on a connected device:

```bash
npx expo run:android
npx expo run:ios
```

### Regenerating native projects

`android/` is committed, so a config change is not picked up until you prebuild:

```bash
npx expo prebuild --clean -p android
```

:::warning Always prebuild after touching `app.config.js`
The Google Maps key is injected into `AndroidManifest.xml` by a custom config
plugin (`withGoogleMapsApiKey`). Without a prebuild, maps silently fail to
render — the app still runs, so the failure is easy to misread.
:::

## Pointing at a backend

There is nothing to configure. The app has **no environment variables and no
build-time API URL**: the employee enters a workspace and company ID on first
launch, and the resolved host is stored on the device.

For local backend work, `src/Screen/authentication/CompanyIdScreen.js` contains
a development switch:

```js
const USE_LOCAL_MS2 = false;
const LOCAL_MS2_PORT = 6030;
const LOCAL_MS2_HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";
```

Set `USE_LOCAL_MS2 = true` to point onboarding at a local tenant service. Android
emulators reach the host machine at `10.0.2.2`, never `localhost`.

## Builds

Three EAS profiles are defined in `eas.json`:

| Profile | Channel | Android output | Notes |
| --- | --- | --- | --- |
| `development` | `development` | dev client | Internal distribution |
| `preview` | `preview` | APK | Internal distribution, iOS simulator build |
| `production` | `production` | App Bundle | Store distribution |

```bash
eas build --platform android --profile production
eas build --platform ios --profile production

eas build --platform android --profile preview          # shareable APK
eas build --platform android --profile preview --local  # build on your machine
```

Submitting to the stores:

```bash
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

Android submission expects `service-account-key.json` in the project root; it is
not committed.

:::caution `autoIncrement` is off in production
The production profile does not bump the build number. Raise `versionCode` and
the iOS build number yourself, or the store will reject the upload as a
duplicate.
:::

## Over-the-air updates

JavaScript-only changes can ship without a store release:

```bash
eas update --channel production --message "Fix UI bug and improvements"
```

An OTA update only reaches builds with a matching `runtimeVersion` (currently
`1.0.0`). Anything touching native code or the plugin list needs a new binary.

The client applies updates on launch behind a ten-minute cooldown guard, so a
bad update cannot put the app into a reload loop.

## Switching Expo accounts

Builds are tied to whichever account is logged in:

```bash
eas logout
eas login
```
