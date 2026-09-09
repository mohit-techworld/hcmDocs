---
title: Navigation
sidebar_position: 2
description: The navigator tree — the auth gate, drawer, bottom tabs and feature stacks — plus how menu permissions gate what an employee can reach.
---

# Navigation

Four layers, nested in this order:

```
RootNavigation          auth gate — signed in or not
└── DrawerNavigation    every top-level destination
    └── BottomTab       Home · Synergy · Menu · Chats · Profile
        └── MenuStack, ChatStack, ProfileStack, TaskStack, …
```

## The auth gate

`RootNavigation.js` renders one of two worlds depending on whether `authToken`
exists. Signed in, there is a single screen: `DrawerNavigation`. Signed out, the
authentication screens are registered instead.

The gate deliberately checks `authToken` rather than a broader loading flag:

```js
if (loading && authToken) return <SplashScreen />;
```

Gating on `loading` alone used to bounce OTP errors to the splash screen.

Because a stack navigator uses its first child as the initial route, onboarding
state decides where a new user lands: `CompanyIdScreen` while onboarding is
incomplete, `WelcomeScreen` afterwards.

## The drawer

`DrawerNavigation.js` registers every top-level destination — around twenty-six
routes. Swipe and gesture opening are both disabled, so the drawer opens only
from the menu button.

Many drawer entries do not point at a screen directly. They point at `MenuStack`
with an `initialParams.screen`, which is how one stack serves a dozen drawer
items:

```js
<Drawer.Screen
  name="LeaveScreen"
  component={MenuStack}
  initialParams={{ screen: "LeaveScreen" }}
/>
```

## Bottom tabs

Five tabs, drawn by a fully custom tab bar:

| Tab | Renders |
| --- | --- |
| `HomeTab` | Dashboard, attendance card, leave status, today's tasks |
| `Synergy` | The social feed |
| `Menu` | The feature grid |
| `Chats` | Conversation list |
| `ProfileTab` | Profile and settings |

`Menu` is not drawn as a tab button. Its slot renders an empty spacer, and a
centre floating button navigates there instead.

Tab-bar visibility is an **allow-list**, not a hide-list — the bar renders only
on named screens, so a new screen is hidden by default and must be added
explicitly to show it.

## Permission gating

Two separate maps decide what an employee can reach, and they do not overlap.

**`src/utils/menuAccess.js`** drives the feature grid and `MenuStack`'s initial
route. Permissions are the union of role permissions (`userData.permission`) and
per-user grants (`userData.directPermissions`):

```js
export function getUserPermissions(userData) {
  const rolePerms = Array.isArray(userData?.permission) ? userData.permission : [];
  const directPerms = Array.isArray(userData?.directPermissions) ? userData.directPermissions : [];
  return [...new Set([...rolePerms, ...directPerms])];
}
```

A screen missing from the map is **allowed**. A screen mapped to `null` is
explicitly public.

**`CustomDrawer.js`** carries its own `DRAWER_PERMISSION_MAP` for manager
entries — manage leave, assigned tasks, manage tickets, manage attendance,
regularisation, support, subordinate attendance and loan administration.

:::warning Gating is visibility only
`MenuStack` registers every screen regardless of permission. Only the
drawer-supplied initial route is checked, so navigating directly to a screen
bypasses the check entirely. The server remains the only real boundary — treat
these maps as UI tidiness, not access control.
:::

Two details worth knowing when comparing against the web app: the loan
permission string is `payroll-loan-lequest` (the typo is in the source and must
match the backend), and the drawer gates **Employee Management** on
`dashboard-super` rather than an employee-management permission, which looks
like a copy-paste.

## Duplicate route names

Two drawer routes share a name with the first screen of the stack they render —
`AssignedTaskScreen` and `ManageTicketStack`. React Navigation warns about
screens with the same name nested inside one another. `ChatStack` already avoids
this by naming its inner route `ChatList` rather than `Chats`, and carries a
comment explaining why.
