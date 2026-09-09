---
title: Bootstrap & Providers
sidebar_position: 1
description: How the app starts — the deliberate import order in index.js, the provider nesting in App.js, and the screens that can pre-empt the whole tree.
---

# Bootstrap & Providers

## The entry file

`index.js` is thirty lines long and every one of them is ordered deliberately:

```js
import "react-native-get-random-values";   // 1. must precede uuid
import { registerGlobals } from "@livekit/react-native";

registerGlobals();                          // 2. installs WebRTC globals
installGlobalHandler();                     // 3. crash handler

const App = require("./App").default;       // 4. require, not import
registerRootComponent(App);
```

Step 4 is the subtle one. ES `import` statements are hoisted, so an
`import App from "./App"` would pull in `livekit-client` **before**
`registerGlobals()` had run, and the WebRTC globals it depends on would not
exist yet. Using `require` defers the module graph until after registration.

:::danger Do not convert that `require` to an import
It looks like an inconsistency worth tidying. It is not — changing it breaks
calling, and the failure appears at runtime rather than at build time.
:::

## Provider nesting

`App.js` builds this tree, outermost first:

```
SafeAreaProvider
└── ErrorBoundary
    └── ForceUpdateBlocker
        └── PermissionManager
            └── SocketProvider          Socket.IO connection
                └── ChatProvider        conversations and messages
                    └── LiveKitCallProvider   call signalling and media
                        └── PunchProvider     attendance engine
                            ├── LanguageProvider
                            │   └── NavigationContainer → RootNavigation
                            ├── Toast
                            ├── LocationPermissionPrompt
                            ├── OEMAutostartGuide
                            └── AppAlert          ← must stay last
```

The order encodes dependencies. `ChatProvider` needs the socket;
`LiveKitCallProvider` signals over that same socket, so it sits inside chat.
`AppAlert` is last because it renders above everything else.

`installAppAlertShim()` runs at **module scope**, before any component is
defined, replacing `Alert.alert` app-wide with the branded dialog. That is why
system alerts look custom without call sites being changed.

:::warning The developer-mode guard is currently disabled
`DevModeGate` is commented out in the JSX, with an in-code warning that this
"also disables the guard in RELEASE builds, so restore both tags before
shipping." The root-detection block described in
[Device Integrity](../security/device-integrity.md) is therefore inactive at
this level, though `DeveloperModeGuard` itself still exists.
:::

## Screens that pre-empt everything

Three conditions short-circuit the tree before navigation renders, checked in
this order:

1. **Fonts not loaded** — renders nothing at all.
2. **A crash was captured** — renders `CrashScreen` with a reload action.
3. **App lock is engaged and the employee is signed in** — renders
   `AppLockScreen`.

`ForceUpdateBlocker` sits outside the crash boundary, so a mandatory update
cannot be dismissed by triggering an error.

## Fonts and splash

Five faces are registered under `MyFont-*` names — Urbanist Regular, Medium and
SemiBold, plus Lexend SemiBold and Bold.

:::note The splash screen hides on its own
`SplashScreen.hideAsync()` is called once fonts load, but
`preventAutoHideAsync()` is never called anywhere in the project. The native
splash therefore disappears on its own schedule and that call has no real
effect. The splash you see while a session is restored is a separate React
screen.
:::

## Update checks

Two independent mechanisms run at startup and are easy to confuse:

| | Over-the-air | Store version |
| --- | --- | --- |
| Source | `expo-updates` | `GET /app/version` |
| Purpose | Ship JS changes | Enforce a minimum build |
| Effect | Downloads and reloads | Full-screen block, no dismiss |
| Guard | 10-minute reload cooldown | Runs once per session |

The OTA guard exists because a broken update that reloads on launch would
otherwise loop forever. It records the last reload time and update ID, and skips
the check inside the cooldown window.

## Notification routing

`App.js` holds a navigation ref so a notification tap can jump into a screen.
Everything routes through the drawer — a chat notification becomes
`DrawerNavigation → Home → Chats`. When navigation is not ready yet, the intent
is written to `pendingNavigation` and replayed later.

A cold-start guard prevents a persisted notification response from re-navigating
on every subsequent launch, which was a real bug.

:::note One dead routing path
Incoming-call notifications write a `pendingIncomingCall` key that **nothing
reads**. It was consumed by the previous WebRTC implementation, which has since
been replaced by LiveKit. Similarly, one fallback path names a route
`ChatListScreen` that is not registered anywhere.
:::
