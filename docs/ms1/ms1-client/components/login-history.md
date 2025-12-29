---
title: Login History Component
sidebar_position: 1
---

# Login History Component (MS1 Client)

> **Note:** This is the **client-side React component** documentation. For the server-side API, see [MS1 Server - Login History API](../../ms1-server/modules/login-history).

The Login History component (`components/active-sessions/ActiveSessions.jsx`) displays and manages user login sessions.

## Overview

Features:
- View active sessions
- View login history
- Device information display
- IP address tracking
- Logout from sessions
- Session duration calculation

## Component Structure

- **Active Sessions List** – Currently logged-in sessions
- **Login History Table** – Paginated history
- **Device Information** – Browser, OS, device badges
- **Session Actions** – Logout buttons
- **Session Details** – Expanded session information

## API Integration

Uses login history API services:
- `getActiveSessions()` – Get active sessions
- `getLoginHistory(params)` – Get paginated history
- `logoutSession(sessionId)` – Logout specific session
- `logoutAllSessions()` – Logout all sessions

## State Management

- Active sessions list
- Login history
- Pagination state
- Loading/error states

---

**Next Steps:**
- Read [MS1 Server - Login History API](../../ms1-server/modules/login-history) for backend details
- See [Login History Overview](../modules/login-history-overview) for complete system understanding

