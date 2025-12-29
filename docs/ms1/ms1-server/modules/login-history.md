---
title: Login History API
sidebar_position: 1
---

# Login History API (Server-Side)

> **Note:** This is the **server-side API documentation** for Login History. For the client-side React component, see [MS1 Client - Login History Component](../../ms1-client/components/login-history).

The Login History module tracks and manages user login sessions, device information, and session activity.

## Overview

This module enables:
- Track all user login sessions
- View active sessions
- View login history with pagination
- Logout from specific sessions
- Logout from all sessions

## Core Features

- **Session Tracking** – Record login attempts with device info
- **Active Sessions** – View currently logged-in users
- **Login History** – Paginated history of all logins
- **Session Management** – Logout from remote sessions
- **Device Information** – Browser, OS, device tracking

## API Reference

### 1. Get Active Sessions

**Endpoint:** `GET /api/v1/login-history/active`

**Description:** Get all currently active login sessions.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Active sessions retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "loginTime": "2024-01-15T10:00:00.000Z",
      "lastActivity": "2024-01-15T11:30:00.000Z",
      "ipAddress": "192.168.1.1",
      "device": "Desktop",
      "browser": "Chrome",
      "os": "Windows",
      "sessionDuration": 90
    }
  ],
  "count": 1
}
```

### 2. Get Login History

**Endpoint:** `GET /api/v1/login-history`

**Description:** Get paginated login history.

**Query Parameters:**
- `userId` (string, optional) – Filter by user ID
- `limit` (number, optional, default: 50) – Results per page
- `page` (number, optional, default: 1) – Page number

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 50,
    "pages": 2
  }
}
```

### 3. Logout Session

**Endpoint:** `POST /api/v1/login-history/logout/:sessionId`

**Description:** Logout from a specific session.

**Path Parameters:**
- `sessionId` (string, required) – Session ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Session logged out successfully"
}
```

### 4. Logout All Sessions

**Endpoint:** `POST /api/v1/login-history/logout-all`

**Description:** Logout from all sessions for current user.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "All sessions logged out successfully",
  "count": 3
}
```

## Models

### `model/loginHistory.model.js` – Login History Schema

```javascript
{
  userId: ObjectId (ref: AdminUser),
  email: String,
  name: String,
  loginTime: Date,
  logoutTime: Date,
  ipAddress: String,
  userAgent: String,
  device: String,
  browser: String,
  os: String,
  isActive: Boolean,
  sessionToken: String,
  lastActivity: Date
}
```

## Device Parsing

Uses `utils/userAgentParser.js` to extract:
- Device type (Desktop, Mobile, Tablet)
- Browser name and version
- Operating system
- IP address from request

---

**Next Steps:**
- Read [MS1 Client - Login History Component](../../ms1-client/components/login-history) for frontend details
- See [Login History Overview](../modules/login-history-overview) for complete system understanding

