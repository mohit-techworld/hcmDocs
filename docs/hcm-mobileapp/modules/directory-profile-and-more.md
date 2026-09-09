---
title: Directory, Profile & Other Modules
sidebar_position: 10
description: The two employee directories, profile and settings, ID card, referrals, resignation, support, dashboards, and the modules that are stubs.
---

# Directory, Profile & Other Modules

## Two employee directories

:::danger These are different systems with confusingly similar names
`Screen/employee/` is a **read-only org directory**.
`components/employeemanagement/` is **face-enrollment management**.
They use different services whose filenames differ by a single letter.
:::

| Concern | Screens | Service | API |
| --- | --- | --- | --- |
| Org directory | `EmployeeDetails`, `EmployeeScreen` | `employeeServices.js` (plural) | `GET /user/get-all` |
| Face enrollment | `EmployeeDirectoryScreen`, `EmployeeProfileScreen`, `EmployeeEnrollmentScreen` | `employeeService.js` (singular) | `/face-v2/*` |

The org directory lists colleagues with search and department tabs, and opens a
read-only profile card with contact details, reporting line and quick actions.

Face enrollment lists employees with their enrollment state, supports export and
bulk deletion of enrollments, and runs a capture-and-enroll wizard: capture a
photo, request a presigned URL, upload to S3, then enroll.

That module is reached from the drawer gated on `dashboard-super` — the
super-dashboard permission rather than an employee-management one, which looks
like a copy-paste.

:::note The plural service is mostly dead
`employeeServices.js` exposes employment types, permission roles, designations,
employee creation and update, and subordinate filters — **none of which are
called**. Only `fetchEmployee` is live. Its first line is even a comment naming
the *other* file, so it was copied. Treat the singular file as the face API and
the plural one as legacy.
:::

## Profile and settings

Employees can change their avatar and view their personal and professional
details. Reporting managers come from `GET /leaves/managers`.

Settings covers language, app lock and biometrics, shortcuts into OS permission
screens, app version, the privacy policy and terms, and sign-out.

:::warning Profile editing does not persist
Every field in the personal profile is `editable={false}`, and
`useAuthStore.updateUserProfile` only merges into local state and writes the
cache — it makes **no HTTP request** while returning `{ success: true }`. The
save paths are unreachable dead code, and would silently do nothing if reached.
:::

## ID card

Renders a digital ID card from the employee profile and company details, and
exports it by capturing the view as a PNG and opening the share sheet. Sharing
rather than saving avoids needing storage permission.

## Referral

Employees browse open vacancies — filtered client-side to those with an open
status — view details, copy or share the apply link, and refer a candidate with
name, contact, email, source, address and a résumé document.

| Method | Path |
| --- | --- |
| `GET` | `/recruitment/jobs` |
| `POST` | `/recruitment/public/jobs/{id}/apply` |

There is no approval or referral-tracking surface in mobile.

:::note The referral form exists twice
`ReferralScreen` and `ReferralModal` post the same payload to the same endpoint,
and both are reachable. The modal keeps hardcoded English strings while the
screen is translated.
:::

## Resignation

Behind the `resignation-submit` permission. The employee sees their current
resignation and full-and-final status, then submits a resignation date, an
optional preferred last working day, a reason, and comments, confirmed through a
modal.

The notice period comes from the employee's designation, falling back to a
default, and the company last working day is computed from it. Resubmission is
allowed only when there is no active resignation, or the previous one was
rejected or completed.

A watchdog clears the loading state if the status calls are slow, showing "you
can submit below" rather than blocking on a request that may never return. A
`404` from either status endpoint is treated as "no record", not an error.

| Method | Path |
| --- | --- |
| `GET` | `/resignation/status`, `/fnf/status`, `/designation/{designation}` |
| `POST` | `/resignation/submit` |

## Support

Behind `support-access`. The dashboard offers three routes: raise a support
ticket, call support, or email support. Tickets support paginated listing with
status, priority and debounced search filters, a detail view, and replies.

All support endpoints sit under `/hcm-support/`.

:::caution The live-chat feature is unreachable
`SupportChatScreen` is registered and whitelisted in the tab bar, but nothing
navigates to it — eleven chat endpoints (start, message, end, rate, history) are
dead in the shipped navigation graph.
:::

## Dashboards

**Employee home** composes the calendar strip, an overview card, the attendance
card, recent leave, today's tasks, birthdays and anniversaries, and a personal
to-do list, with a floating check-in button.

**Super dashboard**, behind `dashboard-super`, filters by date and office and
fires five calls in parallel — four of them individually guarded so a partial
failure degrades rather than blanking the screen.

:::warning Two dashboard defects
The super dashboard buckets tickets on a field named `status`, but that payload
uses `issueStatus`. Every ticket therefore falls through to the resolved
counter, leaving Open and In-Progress permanently at zero.

Separately, the holiday call in `useDashboard` is never destructured by its only
consumer, so the dashboard calendar never loads holidays.
:::

## Performance

`PerformanceScreen` is a stub. It renders a hardcoded, untranslated line — "This
section is under development. Check back later." — with no store and no API
calls. It is registered in two navigators but appears in neither the menu grid
nor the drawer, so there is no way to reach it.
