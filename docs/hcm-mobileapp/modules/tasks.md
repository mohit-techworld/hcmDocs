---
title: Tasks
sidebar_position: 5
description: The four separate task systems in the app — daily tasks, manager-assigned tasks, team tasks with subtasks, and the personal to-do list.
---

# Tasks

:::warning Four task systems coexist
This module is the most fragmented part of the app. Four independent task
subsystems live side by side with different endpoints, different data shapes and
different screens. Identify which one you are working in before changing
anything.
:::

| System | Endpoint family | Purpose |
| --- | --- | --- |
| Daily tasks | `/task/add-task`, `/task/all-task` | Free-text lines an employee logs per day |
| Assigned tasks | `/task/assign*` | Manager assigns work to an employee |
| Team tasks | `/task/team*`, `/task/{id}/*` | Structured tasks with subtasks and time logs |
| Personal to-do | `/todo/tasks` | Private checklist on the dashboard |

## Daily tasks

An employee records what they did on a given date as a list of free-text lines,
optionally with attachments. The payload is a string array plus a date.

## Assigned tasks

Managers assign from `CreateTaskManagerScreen`: title, description, one or more
assignees, due date, priority (High, Medium or Low) and attachments. The queue
lives behind the `task-assign-subordinates` permission.

Employees acknowledge a task and update its status. When completion includes
media, the update routes to a different endpoint
(`POST /task/assign/emp/{id}/complete`) rather than the plain status update.

The detail view separates attachments by who uploaded them, so manager-provided
briefs and employee-provided completion evidence appear apart.

:::note "Pending" is sent as "Not Started"
The UI shows `Pending`, but the value is translated before the request:
`viewStatus === "Pending" ? "Not Started" : viewStatus`. Sending `Pending`
directly will not match the backend's vocabulary.
:::

## Team tasks

The richest of the four, reached from `TaskManagement` with three tabs — assign,
daily and team. `TeamTaskList` handles per-task detail: status and progress
updates, acknowledgement, comments, time logging, and toggling individual
subtasks and sub-points.

## Personal to-do

A private checklist rendered on the home dashboard, backed by `/todo/tasks`. It
uses a plain `useState` hook rather than a store, despite living in `src/store/`.

## Attachments

`TaskServices.js` decides the transport per request: when files are present it
switches to multipart and raises the timeout to **five minutes**; otherwise it
sends plain JSON. Large uploads on mobile networks are the reason for the long
timeout.

## Known issues

- **`src/store/useTaskStore.js` is dead and would crash if used.** It has no
  importers, and imports `./axiosInstance` — a file that does not exist in that
  directory. It is a stale near-duplicate of `TaskServices.js`.
- **`src/Screen/task/DailyTask.js` is a mock.** All state is local, there are no
  API calls, and nothing navigates to it. The menu tile routes to `CreateTask`
  instead.
- Several task components have no importers: `TeamTask`, `TaskHistory`,
  `MarketingTeamCard`, `TeamBigCard`, `CommentCard`, and `GroupMemberModal`.
- `TaskServices.js` exports a function named `TaskServices` that fetches
  subordinates — a confusing collision with the module name.
