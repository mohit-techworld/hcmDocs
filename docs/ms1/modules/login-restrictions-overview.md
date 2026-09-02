---
title: Login Restrictions - Overview
sidebar_position: 1
description: "The Login Restrictions module enables administrators to control and restrict user login access. It provides features to block users, limit concurrent."
---

# Login Restrictions - Complete Guide

The Login Restrictions module enables administrators to control and restrict user login access. It provides features to block users, limit concurrent sessions, restrict IP addresses, and manage device access.

## How It Works Together

```
╔═══════════════════════════════════════════════════════════════════════╗
║              LOGIN RESTRICTIONS - SERVER & CLIENT FLOW                  ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  🖥️  MS1 CLIENT (Frontend)                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🔒 Login Restrictions Component                           │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • View User Restrictions                            │   │   │
│  │  │ • Block/Unblock Users                              │   │   │
│  │  │ • Set Concurrent Session Limits                     │   │   │
│  │  │ • Manage IP Restrictions                            │   │   │
│  │  │ • Manage Device Restrictions                        │   │   │
│  │  │ • Logout from All Devices                           │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📡 API Calls via loginRestrictionsApi Service            │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ GET    /api/v1/login-restrictions/restrictions      │   │   │
│  │  │ GET    /api/v1/login-restrictions/users              │   │   │
│  │  │ GET    /api/v1/login-restrictions/restrictions/user/:userId│   │
│  │  │ PUT    /api/v1/login-restrictions/restrictions/user/:userId│   │
│  │  │ DELETE /api/v1/login-restrictions/restrictions/user/:userId│   │
│  │  │ POST   /api/v1/login-restrictions/logout-all-devices/:userId│   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                          ⬇️ HTTP Requests                            │
│                                                                      │
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️  MS1 SERVER (Backend)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🎮 Login Restrictions Controller                           │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • getAllRestrictions()                               │   │   │
│  │  │ • getAllUsersWithRestrictions()                      │   │   │
│  │  │ • getUserRestriction()                              │   │   │
│  │  │ • updateUserRestriction()                           │   │   │
│  │  │ • deleteUserRestriction()                           │   │   │
│  │  │ • logoutAllDevices()                                 │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  💾 Admin User Model (MongoDB)                              │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Stores restriction settings                        │   │   │
│  │  │ • maxConcurrentSessions                             │   │   │
│  │  │ • isBlocked, blockedReason                          │   │   │
│  │  │ • allowedDevices, restrictedIPs                      │   │   │
│  │  │ • loginNotes                                        │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📊 Login History Integration                              │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Checks active sessions                             │   │   │
│  │  │ • Enforces session limits                            │   │   │
│  │  │ • Logs out sessions on block                        │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow

### 1. Block User Flow

```
Admin → Select User → Block User → MS1 Client → API Call → MS1 Server → Update User → Logout All Sessions → Success
```

**Steps:**
1. Admin opens Login Restrictions page
2. Admin selects a user
3. Admin clicks "Block User"
4. Admin enters block reason
5. MS1 Client sends PUT request
6. MS1 Server updates user (isBlocked = true)
7. MS1 Server logs out all active sessions
8. MS1 Server clears access token
9. MS1 Client refreshes restrictions list

### 2. Set Concurrent Session Limit Flow

```
Admin → Select User → Set Session Limit → MS1 Client → API Call → MS1 Server → Update User → Success
```

**Steps:**
1. Admin selects user
2. Admin sets max concurrent sessions (1-10)
3. MS1 Client sends PUT request
4. MS1 Server validates limit (1-10)
5. MS1 Server updates user
6. On next login, system enforces limit
7. MS1 Client refreshes display

### 3. IP Restriction Flow

```
Admin → Select User → Add IP Restriction → MS1 Client → API Call → MS1 Server → Update User → Success
```

**Steps:**
1. Admin selects user
2. Admin adds IP address to restricted list
3. MS1 Client sends PUT request
4. MS1 Server updates restrictedIPs array
5. On login attempt from restricted IP, access denied
6. MS1 Client refreshes restrictions

## Documentation Structure

To understand Login Restrictions completely, read in this order:

### 1. **Start Here** → [Login Restrictions Overview](./login-restrictions-overview) (this page)
   - Understand the complete system
   - See how server and client work together
   - Learn the overall workflow

### 2. **Backend Implementation** → [MS1 Server - Login Restrictions API](../ms1-server/modules/login-restrictions) *(Server-Side/API)*
   - API endpoints and routes
   - Database models and schemas
   - Business logic and controllers
   - Validation rules
   - **Note:** This is the server-side API that handles all backend operations

### 3. **Frontend Implementation** → [MS1 Client - Login Restrictions Component](../ms1-client/components/login-restrictions) *(Client-Side)*
   - React component structure
   - Restriction management UI
   - User blocking interface
   - IP/Device management
   - State management
   - API integration
   - **Note:** This is the client-side React component that provides the UI

## Key Concepts

### Server-Side (MS1 Server)
- **Models**: AdminUser model with restriction fields
- **Controllers**: CRUD operations for login restrictions
- **Validation**: Session limits (1-10), IP format validation
- **Integration**: Login History for session enforcement

### Client-Side (MS1 Client)
- **Components**: Login restrictions management interface
- **Services**: API service wrappers
- **State**: Restrictions list, user data, form state
- **UI**: Tables, forms, toggle switches, IP input

## Quick Reference

| Task | Server Side | Client Side |
|------|-------------|------------|
| View All Restrictions | `getAllRestrictions()` controller | Restrictions list component |
| View Users with Restrictions | `getAllUsersWithRestrictions()` controller | Users table component |
| Get User Restriction | `getUserRestriction()` controller | User detail view |
| Update Restriction | `updateUserRestriction()` controller | Restriction form |
| Delete Restriction | `deleteUserRestriction()` controller | Delete confirmation |
| Logout All Devices | `logoutAllDevices()` controller | Logout button |

---

**Next Steps:**
- Read [MS1 Server - Login Restrictions API](../ms1-server/modules/login-restrictions) for backend details
- Read [MS1 Client - Login Restrictions Component](../ms1-client/components/login-restrictions) for frontend details

