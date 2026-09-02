---
title: Login Restrictions API
sidebar_position: 1
description: "The Login Restrictions module enables administrators to control user login access through blocking, session limits, IP restrictions, and device management."
---

# Login Restrictions API (Server-Side)

> **Note:** This is the **server-side API documentation** for Login Restrictions. For the client-side React component, see [MS1 Client - Login Restrictions Component](../../ms1-client/components/login-restrictions).

The Login Restrictions module enables administrators to control user login access through blocking, session limits, IP restrictions, and device management.

## Overview

This module enables:
- Block/unblock user accounts
- Set concurrent session limits (1-10)
- Restrict access by IP address
- Restrict access by device
- Logout users from all devices
- View all restrictions with user details

## Core Features

- **User Blocking** – Block users with reason tracking
- **Session Limits** – Control concurrent login sessions
- **IP Restrictions** – Block specific IP addresses
- **Device Restrictions** – Allow only specific devices
- **Bulk Operations** – View all users with restrictions
- **Session Management** – Logout from all devices

## API Reference

### 1. Get All Restrictions

**Endpoint:** `GET /api/v1/login-restrictions/restrictions`

**Description:** Get all login restrictions with user details.

**Query Parameters:**
- `page` (number, optional, default: 1) – Page number
- `limit` (number, optional, default: 10) – Results per page
- `search` (string, optional) – Search by notes, name, or email

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login restrictions retrieved successfully",
  "data": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "maxConcurrentSessions": 3,
      "isBlocked": false,
      "blockedReason": null,
      "blockedAt": null,
      "blockedBy": null,
      "allowedDevices": [],
      "restrictedIPs": [],
      "lastLoginRestriction": null,
      "notes": null
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### 2. Get All Users with Restrictions

**Endpoint:** `GET /api/v1/login-restrictions/users`

**Description:** Get all users with their restriction details and active session counts.

**Query Parameters:**
- `page` (number, optional, default: 1) – Page number
- `limit` (number, optional, default: 20) – Results per page
- `search` (string, optional) – Search by name, email, or mobile
- `isBlocked` (boolean, optional) – Filter by blocked status

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Users with restrictions retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "restriction": {
        "maxConcurrentSessions": 3,
        "isBlocked": false,
        "blockedReason": null,
        "blockedAt": null,
        "allowedDevices": [],
        "restrictedIPs": [],
        "activeSessions": 2,
        "canLoginMore": true
      }
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

### 3. Get User Restriction

**Endpoint:** `GET /api/v1/login-restrictions/restrictions/user/:userId`

**Description:** Get restriction details for a specific user.

**Path Parameters:**
- `userId` (string, required) – User MongoDB ObjectId

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User restriction retrieved successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "maxConcurrentSessions": 3,
    "isBlocked": false,
    "blockedReason": null,
    "blockedAt": null,
    "blockedBy": null,
    "allowedDevices": [],
    "restrictedIPs": [],
    "lastLoginRestriction": null,
    "notes": null
  }
}
```

### 4. Update User Restriction

**Endpoint:** `PUT /api/v1/login-restrictions/restrictions/user/:userId`

**Description:** Create or update login restriction for a user.

**Path Parameters:**
- `userId` (string, required) – User MongoDB ObjectId

**Request Body:**
```json
{
  "maxConcurrentSessions": 5,
  "isBlocked": false,
  "blockedReason": "Security concern",
  "allowedDevices": ["device-id-1", "device-id-2"],
  "restrictedIPs": ["192.168.1.100"],
  "notes": "User notes here"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User restriction updated successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "maxConcurrentSessions": 5,
    "isBlocked": false,
    "blockedReason": null,
    "blockedAt": null,
    "blockedBy": null,
    "allowedDevices": ["device-id-1", "device-id-2"],
    "restrictedIPs": ["192.168.1.100"],
    "lastLoginRestriction": "2024-01-15T10:30:00.000Z",
    "notes": "User notes here"
  }
}
```

**Note:** If `isBlocked` is set to `true`, all active sessions are automatically logged out.

### 5. Delete User Restriction

**Endpoint:** `DELETE /api/v1/login-restrictions/restrictions/user/:userId`

**Description:** Remove all restrictions for a user (reset to defaults).

**Path Parameters:**
- `userId` (string, required) – User MongoDB ObjectId

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User restriction deleted successfully"
}
```

### 6. Logout All Devices

**Endpoint:** `POST /api/v1/login-restrictions/logout-all-devices/:userId`

**Description:** Logout user from all active sessions.

**Path Parameters:**
- `userId` (string, required) – User MongoDB ObjectId

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Successfully logged out user from 3 device(s)",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "loggedOutSessions": 3,
    "loggedOutAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Models

### `model/adminUser.model.js` – Restriction Fields

Restriction fields stored in AdminUser model:
- `maxConcurrentSessions` (Number, default: 3, min: 1, max: 10)
- `isBlocked` (Boolean, default: false)
- `blockedReason` (String)
- `blockedAt` (Date)
- `blockedBy` (ObjectId, ref: AdminUser)
- `allowedDevices` ([String]) – Array of allowed device IDs
- `restrictedIPs` ([String]) – Array of blocked IP addresses
- `lastLoginRestriction` (Date) – Last restriction update
- `loginNotes` (String) – Admin notes

## Validation

- **maxConcurrentSessions**: Must be between 1 and 10
- **IP Addresses**: Valid IP format (validated on login)
- **Device IDs**: String identifiers

## Integration

### With Login Process
- Login controller checks restrictions before allowing login
- Enforces concurrent session limits
- Validates IP restrictions
- Validates device restrictions
- Blocks login if user is blocked

### With Login History
- Tracks active sessions for limit enforcement
- Logs out sessions when user is blocked
- Provides session counts for restriction display

---

**Next Steps:**
- Read [MS1 Client - Login Restrictions Component](../../ms1-client/components/login-restrictions) for frontend details
- See [Login Restrictions Overview](../../modules/login-restrictions-overview) for complete system understanding

