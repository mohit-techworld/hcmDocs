---
title: Attendance & Punching
sidebar_position: 1
description: The two punch pipelines, the checks a punch must pass, shift and overtime state rules, geofencing, face verification, and regularisation requests.
---

# Attendance & Punching

Attendance is the app's most involved subsystem. Two independent pipelines can
record a punch, and both are live.

| Pipeline | Entry point | How the punch is recorded |
| --- | --- | --- |
| **Geofence map** | Check-in button on the dashboard | `POST /attendance-user/punchin` / `punchout` |
| **Step verification** | Floating check-in button on Home | The face-match call records it |

The geofence pipeline lives in `src/store/PunchContext.js`. The step flow lives
in `src/Screen/attendence/AttendanceVerificationScreen.js`.

:::note Two attendance folders, both real
`src/Screen/attendence/` (misspelled) holds **employee self-service** screens —
own history and the verification flow. `src/Screen/attendance/` holds
**manager** screens — manage attendance, regularisation, subordinates. Neither
is dead code.
:::

## Pipeline A — geofence map punch

```
handlePunchIn()
  └─ getUserLocation()            network gate → permission → GPS sampling
  └─ fetchTargetCoordinates()     GET /attendance-user/punchtime
  └─ calculateDistance()          Haversine
  └─ GeofenceMapModal             employee confirms on a map
     └─ proceedWithPunchIn()      POST /attendance-user/punchin
```

Punching out follows the same path. If the employee has already checked out, a
confirmation modal appears first and the request is flagged with
`isReCheckout: true`.

### What a punch must satisfy

Nine checks run before the request is sent:

1. **Network** — blocked only when connectivity is explicitly `false`. Unknown
   counts as online.
2. **Location permission** — always requested through the prominent-disclosure
   gate (see below).
3. **GPS accuracy** — the fix is rejected above **500 m**.
4. **Mock GPS** — a location flagged as mocked throws "Fake GPS detected".
5. **Office coordinates resolvable** — required when the company enforces a
   radius.
6. **Geofence** — distance must be within the punch radius (default **200 m**).
7. **Device clock** — compared against server time; more than **5 minutes** of
   drift blocks the punch.
8. **Device integrity** — the verdict is attached to the payload.
9. **Selfie** — only for field workers with `requireSelfieOnPunch`. Cancelling
   aborts the punch.

:::caution Two of these checks fail open
Both clock validation and device integrity proceed when the check itself errors.
Only an explicit `isValid: false` blocks a punch; an unreachable server does
not. This keeps a backend problem from stopping the workforce clocking in, and
means neither can be treated as a hard guarantee.
:::

### What gets sent

```js
{
  date: "YYYY-MM-DD",
  day: "Monday",
  status: "Present",
  attendance_mode: "MobileApp",
  deviceType: "android" | "ios",
  latitude, longitude, locationAccuracyMeters,
  clientTimestamp: "<ISO>",
  deviceIntegrity                    // null if the check failed
}
```

Location is recorded on **every** punch regardless of whether a radius is
enforced — the radius rules only decide whether the punch is accepted, not
whether coordinates are stored. When a selfie is required the same fields are
sent as `multipart/form-data`.

## Pipeline B — step verification

```js
const FLOW = ["location", "face", "fingerprint", "success"];
```

The important detail is that **the face step is what records the punch**. A
single call to `POST /face-v2/match-face` both identifies the employee and
writes the attendance row. The fingerprint step that follows is a local
`expo-local-authentication` gate with no network call at all.

Face capture only fires when the camera sees exactly one face with all three
head angles under 15°, with a four-second cooldown between attempts. Five failed
attempts end the flow.

:::warning The identity guard runs after the punch is written
If the matched employee is not the signed-in employee, the app refuses to treat
it as success — but the backend has already recorded the punch by then. The
client cannot undo it, and the code says so in its own comment. Closing this
properly requires a server-side change.
:::

Failures are mapped to specific messages rather than a generic error:
`no_face`, `multi_face`, `low_quality`, `liveness`, `wrong_identity`,
`not_enrolled`, `no_match`. On failure the employee can retry, defer, or request
a manager override — though the override is currently a stub that only shows a
toast.

## Punch state rules

`decidePunchState()` derives four flags from today's record. The timestamps it
reads are `shiftInTs`, `shiftOutTs`, `otInTs`, `otOutTs`, `preOtInTs` and
`preOtOutTs`.

| Flag | Condition |
| --- | --- |
| `canPunchIn` | Not yet checked in, and now is at or after the early window |
| `canPunchOut` | Checked in and not checked out — or a re-checkout before OT starts |
| `canOtPunchIn` | Checked in and out, no OT yet, and now is at or after shift end |
| `canOtPunchOut` | OT started, and now is before the next shift's early window |

Two subtleties matter:

- A `shiftOutTs` equal to `shiftInTs`, or a record with a single punch row, does
  **not** count as checked out.
- When overtime is allowed and the shift has ended, the ordinary checkout button
  is hidden until OT check-in happens (`awaitingOtCheckIn`).

Overtime punching reuses the ordinary punch endpoints — the backend decides
whether a punch is shift or OT from the existing record. This is separate from
**overtime requests**, which use a different API entirely.

### Work date and night shifts

`calculateWorkDateToday()` decides which calendar date a punch belongs to. A
shift whose end time is earlier than its start is treated as crossing midnight,
so a punch at 01:00 belongs to the previous day's record.

:::note The timezone is hard-coded
Work-date calculation converts to **`Asia/Kolkata`** explicitly. Deployments
outside India would need this changed.
:::

## Location capture

Location is never requested directly. Every call site goes through
`requestForegroundLocationWithDisclosure()`, which shows an in-app explanation
first and only then touches the OS permission dialog — the sequence Google Play
requires. Declining is recorded and the OS prompt is never shown.

Capture itself prefers a native Android module when present, and otherwise takes
**three Expo samples 500 ms apart**, discards any sample more than 100 m from
the median, and averages the survivors. Reported accuracy is the worst of the
accepted samples. Timeouts extend automatically on cellular connections.

Office coordinates come from `GET /attendance-user/punchtime`. Two defensive
behaviours are worth knowing:

- Coordinates that look transposed are **swapped automatically** using an India
  bounding-box heuristic.
- `requireOfficeRadiusForPunch` is coerced permissively — anything that is not
  literally `false` enables enforcement.

## Breaks

Breaks are separate from punches, using `POST /attendance-user/start-break` and
`end-break`. A break is refused when one is already running, when the remaining
allowance has run out, or when the employee has not checked in. The allowance
comes from the employee's break type and is counted down locally.

## Regularisation and missed punches

Employees raise corrections from `MissedPunchScreen`, choosing a request type:
`missed_punch`, `incorrect_time`, `technical_issue`, `emergency`, `week-off` or
`other`, with a priority. Every type except `week-off` requires at least one
punch time.

Each entry becomes a `POST /regularization/missed-punch-request`. Managers
review them through `GET /regularization/missed-punch-request` and act with
`PUT /regularization/{id}/approve`, `/reject` or `/edit`.

## Status display rules

Displayed status is not simply whatever the server sent. `attendanceUtils.js`
mirrors the backend and web rules so all three agree:

- With no meaningful punch evidence, `half day`, `reduced hours`, `present` and
  `work from home` are all forced to **Absent**. Leave, week-off and holiday
  statuses pass through untouched.
- Approved half-day leave collapses a morning/afternoon pair into one status —
  any Present-plus-Leave or Present-plus-Absent combination becomes **Half Day**.
- Half-day reasons are labelled by cause: approved leave, late penalty, late
  threshold policy, or short hours — and the short-hours label is suppressed when
  the employee actually worked a full day.

Individual punch rows are labelled by matching their timestamp against the day
record within a five-second tolerance, so labels follow the backend's own
timestamps rather than list order: Pre-OT In/Out, Check In, Check Out, OT
In/Out, or a generic punch.

Working-hour thresholds default to **9 hours** for a full day and **5 hours**
for a half day, overridable per weekday by company policy. That file is a
deliberate 1:1 mirror of the backend's — the three copies must be kept in step.
