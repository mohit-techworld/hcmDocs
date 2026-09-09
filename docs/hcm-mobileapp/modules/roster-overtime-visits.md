---
title: Roster, Overtime & Field Visits
sidebar_position: 8
description: Shift rosters and swap requests, the overtime request and assignment workflow, and location-based field visit tracking with offline support.
---

# Roster, Overtime & Field Visits

## Roster

`RosterScreen` has three tabs: the weekly view, a swap request form, and the
employee's own swap requests.

The weekly view loads the employee profile and the company's shift timings
together, then resolves each day's assignment. Shifts arrive in several shapes —
an inline object with start and end times, a reference to a shift ID, a
name-only object, or a bare string — and the resolver handles all of them.
Where a date appears more than once, the last entry wins.

Day status is derived from the shift label when the server does not state it
explicitly: anything reading as "week off" becomes a week-off, and pending,
approved and rejected pass through.

**Swap requests** are raised against a colleague filtered by department and
name, for a specific date, carrying both employees' shift windows and an
optional reason.

| Method | Path |
| --- | --- |
| `GET` | `/user/profile/{id}`, `/company-settings/shift-timings`, `/user/get-all-active` |
| `GET` | `/roaster-management/shift-swap-requests` |
| `POST` | `/roaster-management/shift-swap-requests` |

:::note `src/utils/rosterStatus.js` is dead
It has no importers anywhere. Its comment describes a real bug it was written to
fix — thin roster entries making a badge claim `Assigned(N)` while every day
cell rendered "Default shift (no roster)" — so the underlying issue may still be
present.
:::

## Overtime

Two separate things share the word "overtime", and they do not touch the same
endpoints:

- **OT punching** goes through the ordinary punch endpoints. See
  [Attendance](./attendance.md).
- **OT requests and assignments** live in this module.

`OvertimeScreen` has two tabs — overtime assigned to the employee, and overtime
the employee requested — each with its own month filter and row count.

A new request needs a date, the manager it is addressed to, the shift time, a
start and end time, and a non-blank reason. All five are required.

From an assigned overtime entry an employee can **acknowledge** or **decline**
it.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/overtime` | Assigned to me |
| `GET` | `/overtime-requests` | Raised by me |
| `POST` | `/overtime-requests` | New request |
| `PATCH` | `/overtime/{id}/acknowledge` | Accept an assignment |
| `PATCH` | `/overtime/{id}/decline` | Decline an assignment |

:::caution Two rough edges in the request form
The overtime date is serialised with `toISOString().split("T")[0]`, which
converts to UTC first — near midnight this can record the wrong day. And the
decline reason is hard-coded to "Declined by employee" rather than being asked
for.
:::

## Field visits

For employees who travel to client sites. The visit list filters by `pending`,
`reached` and `missed`, and each visit carries its **own** allowed radius from
the server — this is not the office punch radius.

The detail screen polls location every ten seconds, always through the
prominent-disclosure permission gate, and compares the distance against that
visit's radius. Marking arrival is blocked when there is no fix or the employee
is out of range, and requires an explicit confirmation.

### Offline support

This is the one place in the app with a genuine offline queue. Punches are not
queued — a failed punch simply shows an error — but a "mark reached" check-in is
stored and retried.

The queue holds one entry per visit, and distinguishes carefully between "no
network" and "the server said no":

- An offline error queues the check-in and optimistically marks the visit as
  reached, pending sync.
- A server response — including an out-of-radius rejection — surfaces the real
  error instead, with the distance and required radius.

Two server replies are treated as success and drop the entry: a "already marked"
message, and a `404` for a visit that was cancelled or deleted.

The queue flushes when the app becomes active, when connectivity returns, and
after any successful check-in. It is cleared on sign-out so one employee's
queued visits can never be sent under another's session.

| Method | Path |
| --- | --- |
| `GET` | `/location-visits/my-visits` |
| `POST` | `/location-visits/{visitId}/mark-reached` |

:::note The retry cap is not actually enforced
Entries carry an attempt counter and the code logs that they "will not
auto-retry" after ten attempts, but nothing stops them — exhausted entries are
pushed back onto the pending list and tried again on the next flush.
:::
