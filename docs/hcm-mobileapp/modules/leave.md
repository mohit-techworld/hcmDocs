---
title: Leave
sidebar_position: 3
description: Applying for leave, how working days and notice periods are calculated, balance validation, and the approver queue for subordinate requests.
---

# Leave

Employees apply and track from `LeaveScreen` and `LeaveSubmitScreen`. Approvers
work from `ManageLeaveHistoryScreen`, reachable from the drawer with the
`leave-manage-subordinate` permission.

## Applying

The form collects a leave type, a date range with optional half-day sessions, a
reason, an emergency contact, a work-handover note, one supporting document, and
up to **five CC recipients** chosen from the employee's manager list.

Only leave types **assigned to that employee** are offered. When none are
assigned the form is disabled outright rather than failing on submit.

### The rules the form enforces

| Rule | Behaviour |
| --- | --- |
| Working days | The day count excludes non-working days and company holidays, intersecting the working-day pattern with the holiday list |
| Advance notice | The earliest selectable date shifts by the leave type's notice period |
| Reason | At least 10 characters |
| Emergency contact | Must contain a 10-digit number, and must not be the employee's own |
| Balance | Blocked when the request exceeds the available balance, or when request plus already-pending days exceeds the allowance |

Advance notice is parsed from free text on the leave type — "immediate" or "same
day" becomes zero, and forms like `N days`, `N weeks` and `N months` are
converted to days.

:::note Dates are sent twice under two names
The payload carries `startDate`/`endDate` **and** `leave_From`/`leave_To` with
identical values, for backend compatibility. Keep both if you touch this call.
:::

## Tracking

The list filters by `all`, `pending`, `approved` and `rejected`. A
`partially_approved` request — where the approver granted some of the requested
days — is deliberately shown under **Pending**, because it still needs the
employee's response.

From the detail sheet an employee can delete a request while it is pending, or
accept or decline a partial approval.

## Approving

The approver queue shows counters for pending, approved this month and rejected
this month, then a paginated list of subordinate requests with infinite scroll.
Approving is one tap; rejecting takes an optional reason.

:::caution Only `pending` rows are actionable
Approve and reject buttons render only when the status is exactly `pending`. A
`partially_approved` request opens read-only in this queue — the response to a
partial approval belongs to the employee, not the approver.
:::

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/leaves/employee` | Own leave list, paged |
| `GET` | `/leaves/leaveBalance` | Balance for a leave type |
| `GET` | `/leaves/leavestats` | Counters |
| `GET` | `/leaves/managers` | CC recipients and reporting line |
| `POST` | `/leaves/apply` | Multipart, 30-second timeout |
| `DELETE` | `/leaves/{id}` | Withdraw a pending request |
| `PUT` | `/leaves/respond-partial/{id}` | Accept or decline a partial approval |
| `GET` | `/leaves/subordinate-stats` | Approver counters |
| `GET` | `/leaves/assigned` | Approver queue |
| `PUT` | `/leaves/handle-leave/{id}` | Approve or reject |
| `GET` | `/leaves-types/assigned-leave-type/{code}` | Types assigned to the employee |

Policy context — working days, holidays and monthly paid-leave allowance —
comes from `/company-settings/settings` and
`/company-settings/user-leave-context`.

## Known issues

`LeaveTypeStore.js` exposes eleven actions but only the assigned-types fetch is
used; the administrative half is dead in mobile. That file also calls
`Toast.error(...)` and `Toast.success(...)`, which **do not exist** on the toast
library this app uses — every other call site uses `Toast.show({ type, ... })`.
Any error path through those lines throws a second error on top of the first.

Four modals under `Screen/leave/modal/` — category, delegation, duration and
submit — have no importers.
