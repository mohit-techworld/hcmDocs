---
title: Tickets & POSH
sidebar_position: 6
description: Raising and managing internal tickets, and the separate confidential POSH complaint workflow.
---

# Tickets & POSH

Two workflows share one screen with two tabs, but they are entirely separate
systems with different endpoints and different confidentiality expectations.

## Tickets

An employee raises an internal ticket with a title, description, priority
(High, Medium or Low), a target department, and one attachment. New tickets are
always created with status `Pending` — the field is not offered on the form.

The list supports search, status and priority filters, a date filter, and
client-side paging. A stats card summarises total, resolved, pending and
high-priority counts.

Managers with `ticket-manage-department` get `ManageTicketsScreen`: department
tickets filtered by status, priority and department, with comments, editing
(including status), deletion, and ticket creation.

### Endpoints

| Method | Path |
| --- | --- |
| `GET` | `/issues`, `/issues/all`, `/issues/department`, `/issues/assigned` |
| `GET` | `/issues/assignees`, `/issues/issue/{employeeId}`, `/issues/{id}/comments` |
| `POST` | `/issues` (multipart, field `file`), `/issues/{id}/comments` |
| `PUT` | `/issues/{id}` (multipart, field `files`), `/issues/{id}/status`, `/issues/{id}/assign`, `/issues/{id}/reopen` |
| `DELETE` | `/issues/{id}` |

:::note Status changes go through the general update
Despite a header comment describing `PUT /issues/{id}/status`, the app changes
status by sending `issueStatus` inside the multipart body of
`PUT /issues/{id}`. The dedicated status action exists in the store but has no
caller.
:::

## POSH complaints

The Prevention of Sexual Harassment workflow is deliberately separate, with its
own endpoints and its own store.

An employee files a complaint with a type — Sexual Harassment, Abuse,
Discrimination or Other — the accused person selected from the directory, the
date of the incident, a description, and up to **three** attachments. They can
also edit and delete their own cases.

| Method | Path |
| --- | --- |
| `GET` | `/posh/all`, `/posh/user`, `/posh/{id}` |
| `POST` | `/posh` (multipart, field `attachments`), `/posh/{id}/comments` |
| `PUT` | `/posh/{id}`, `/posh/{id}/status` |
| `DELETE` | `/posh/{id}` |

Given the sensitivity of this data, treat the POSH endpoints as confidential
when adding logging or analytics anywhere near this module.

## Known issues

- **`src/store/IssuesContext.js` is dead** — a complete context provider
  duplicating `useIssuesStore`, never mounted and never consumed.
- **`components/tash-and-posh/`** is a misspelling of "ticket" that survives in
  the directory name.
- Very large commented-out predecessors remain: `RaiseTicket.js` (first ~1,000
  lines), `ComplateForm.js` (first ~1,066), `TicketForm.js` (first ~422) and
  `usePoshStore.js` (first ~305, using an older field-naming convention).
- `components/tash-and-posh/RaiseButton.js` has no importers.
