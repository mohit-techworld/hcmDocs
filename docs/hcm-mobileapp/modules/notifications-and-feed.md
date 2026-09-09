---
title: Notifications & Social Feed
sidebar_position: 9
description: Push notification registration and channels, the in-app notification centre and preferences, and the Synergy social feed with its live updates.
---

# Notifications & Social Feed

## Push notifications

The app registers a **native device token** (APNs or FCM) rather than an Expo
push token, caches it, and syncs it to `POST /push-token` when it changes or
every 30 days. Removal happens through sign-out, which is why signing out
without a cached token never reaches the server — see
[Sessions & Tokens](../security/sessions-and-tokens.md).

Nine Android channels are declared so that different notification types can be
tuned independently:

`default`, `critical`, `tasks`, `leave`, `attendance`, `tickets`, `chat`,
`break`, and `incoming_calls`.

All use the standard notification sound except `incoming_calls`, which uses the
ringtone, maximum importance, public lock-screen visibility, do-not-disturb
bypass, and a ten-step vibration pattern.

The foreground handler applies three rules:

| Condition | Behaviour |
| --- | --- |
| `data.silent === "true"` | Show nothing — used for backend watchdog pings |
| Incoming call | Show everything at maximum priority |
| Everything else | Banner and list, no alert |

Tapping a notification routes through the drawer — chat notifications land on
the Chats tab, everything else on the notification centre. When navigation is
not ready the intent is stored and replayed. A cold-start guard stops a
persisted notification response from re-navigating on every launch.

:::warning Call notifications are not connected
The `accept_call` and `decline_call` actions write to a `pendingIncomingCall`
key that nothing reads — it belonged to the WebRTC implementation replaced by
LiveKit. Acting on a call notification therefore does not accept or decline the
call. See [Chat & Calls](./chat-and-calls.md).
:::

## Notification centre

`GET /notifications` with paging, grouped into Today, This week and Older.
Tabs filter to alerts (missed punch, break exceeded, meetings, task
assignments), birthdays, and announcements. Reading one calls
`PUT /notifications/mark-as-read`.

Preferences live under Settings, grouped by category, with each toggle applied
optimistically and reverted if the request fails
(`GET`/`PUT /notifications/preferences`).

:::note The centre does not update live
It fetches over HTTP only. The `notification` and `notificationRead` socket
events exist in the feed socket store but are not connected to this screen.
:::

## Synergy — the social feed

An internal feed of posts and polls, rendered as a virtualised list.

Employees can post (with images and a department audience), create polls, like,
comment, like comments, vote in polls, and delete their own content. The list
filters by department client-side and sorts newest or oldest.

The feed tolerates **four different response shapes** from `GET /feed` — a
wrapped `{success, feed}`, a bare array, a `{data}` envelope, and
`{posts | feed}` — which suggests the endpoint's contract has changed more than
once.

| Method | Path |
| --- | --- |
| `GET` | `/feed` |
| `POST` | `/posts`, `/posts/{id}/comments`, `/posts/{id}/like`, `/comments/{id}/like`, `/polls`, `/polls/{id}/vote` |
| `PUT` | `/posts/{id}` |
| `DELETE` | `/posts/{id}`, `/comments/{id}`, `/polls/{id}` |

### Live updates

The feed opens its own socket connection — separate from the chat socket — and
listens for new posts and polls, edits and deletions, comments, likes and poll
votes, applying each to the store.

:::note Two loose ends in the feed
The store maintains an unread counter that nothing displays, and a local
notifications array that nothing renders. The feed socket is also never
disconnected, including on sign-out.
:::
