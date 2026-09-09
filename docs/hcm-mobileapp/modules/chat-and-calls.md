---
title: Chat & Calls
sidebar_position: 2
description: Socket.IO messaging, direct and group conversations, presence and read receipts, and LiveKit audio/video calling with its signalling over the chat socket.
---

# Chat & Calls

Messaging and calling share one Socket.IO connection to the tenant's `/chat`
namespace. LiveKit handles call **media** only — every ring, accept and decline
travels over the same socket the chat uses.

## The socket

`src/services/socketService.js` owns the connection. Its URL is derived from the
workspace, never configured:

```js
buildSocketUrl(baseUrl)  // → {companySpecificUrl}/chat
```

The handshake carries the access token, the employee ID, the platform and the
tenant subdomain. On connect the client joins its personal room; opening a
conversation joins a direct-message or group room on top.

Two behaviours are deliberate and worth knowing before changing anything:

- **Socket.IO's own reconnection is disabled** in favour of a hand-rolled
  exponential backoff, capped at five attempts.
- **The socket drops when the app is backgrounded** and reconnects with a fresh
  token on return — unless a call is active, which suppresses the teardown.

Because reconnects create a *new* socket instance, always bind through
`subscribe()` from `SocketContext` rather than attaching to the socket directly.
The context re-binds every registered listener when the instance is replaced;
direct listeners silently go deaf after a reconnect.

:::note A second socket exists
`useSocketStore` opens its own connection for the social feed. Despite the name
`buildEngagementSocketUrl`, it points at the same `/chat` namespace — the
backend has no separate engagement namespace. Nothing ever disconnects it.
:::

## Messaging

| Concern | Where |
| --- | --- |
| Socket primitives, subscriptions | `src/services/socketService.js` |
| Group and message state, send handlers | `src/context/ChatContext.js` |
| Conversation list | `src/components/chat/ChatListScreen.js` |
| Direct thread | `src/Screen/chat/PrivateChat.js` |
| Group thread | `src/components/chat/group/GroupChat.js` |

**History comes over HTTP, not the socket.** `GET /chat/messages` pages backwards
50 messages at a time. This is a deliberate choice: a socket handler cannot know
which conversation is currently open, so history arrives through a request that
carries a ticket, letting a stale response be discarded when the user has already
moved to another thread.

Direct-message threads keep a local cache in `AsyncStorage` — up to 200 messages
per room, written on a debounce — so a thread renders instantly before the
network responds. Group threads have no cache. All caches are cleared on
sign-out.

**Presence** arrives as a full snapshot on connect and deltas afterwards.
**Read receipts** are emitted when a conversation opens and rendered as a single
or double check.

:::caution Duplicate detection is fuzzy
Incoming direct messages are de-duplicated by matching sender, content and a
timestamp within five seconds. Sending the same short message twice in quick
succession will drop the second copy. The intended fix — a client-generated
message ID reconciled on echo — was planned but never implemented.
:::

There are **no typing indicators** in this app.

## Attachments

The live upload path presigns an S3 URL over the socket, uploads with `axios`,
then confirms. A second, better-documented implementation exists in
`chatFileUpload.js` with 20 MB and 10-file limits, per-file progress and
acknowledgement timeouts — but nothing calls it.

:::warning File limits are not enforced
Because the live path is not the one carrying the guards, the 20 MB and
ten-file limits do not apply in practice.
:::

## Calls

Signalling rides the chat socket:

```
caller  ──"lk:invite"──▶  server  ──"lk:incoming"──▶  callee
callee  ──"lk:accept"──▶  server  ──"lk:accepted"──▶  caller
callee  ──"lk:decline"─▶  server  ──"lk:declined"──▶  caller
caller  ──"lk:cancel"──▶  server  ──"lk:cancelled"─▶  callee
```

The client never sends its own identity — the server stamps it from the
authenticated socket.

Starting a call runs in a fixed order: **permissions are requested before the
invite** (a denied camera downgrades a video call to audio; a denied microphone
aborts), the pre-join screen holds while devices are checked, the invite goes
out, and a join link is posted into the conversation. Ringing times out after
45 seconds.

Media then follows a strict sequence — fetch a token from `POST /calls/token`,
stop the ringtone, start the audio session, build room options, connect. That
ordering is required; starting the audio session before stopping the ringtone
produces no audio.

Video quality adapts to the connection, chosen from NetInfo: 720p on Wi-Fi,
540p on 4G, 360p on 3G or slower.

In-call features that are fully wired: a participant grid, screen sharing, mute
and camera controls, audio-route selection, camera flip, a side panel with
people and chat, host moderation (mute, mute-all, remove), reactions and raised
hands over LiveKit data channels, recording with consent, add-people mid-call,
and guest invites.

:::danger A backgrounded phone will not ring
`lk:invite` does not trigger a push notification server-side. The incoming-call
sheet is foreground-only, and the native call-screen work (CallKit on iOS,
ConnectionService on Android, full-screen intents, notification accept/decline
actions) is not implemented. In practice a call only reaches someone with the
app open.

The notification actions that exist write to a `pendingIncomingCall` key that
nothing reads — it belonged to the previous WebRTC implementation.
:::

Calls can be started from exactly two places: a direct-message thread and a
group thread. There is no call history screen, and the deep-link join URL the
app posts into conversations cannot be opened by the app itself — the parser
exists but no link handler is registered.

## Group event-name drift

`socketService.js` was corrected to listen for `groupInfoUpdated`,
`addedToGroup` and `removedFromGroup`. `ChatContext` still registers the older
names — `groupUpdated`, `memberAddedToGroup`, `memberRemovedFromGroup` — and
runs afterwards. Those three handlers can never fire against the current server
contract, so group membership changes may not appear live.
