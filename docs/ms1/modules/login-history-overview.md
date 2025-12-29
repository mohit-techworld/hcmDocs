---
title: Login History - Overview
sidebar_position: 1
---

# Login History - Complete Guide

The Login History module tracks and manages user login sessions. It records login attempts, device information, IP addresses, and session activity, enabling administrators to monitor and manage active sessions.

## How It Works Together

```
╔═══════════════════════════════════════════════════════════════════════╗
║                LOGIN HISTORY - SERVER & CLIENT FLOW                    ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  🖥️  MS1 CLIENT (Frontend)                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  📊 Active Sessions Component                               │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • View Active Sessions                               │   │   │
│  │  │ • View Login History                                 │   │   │
│  │  │ • Device Information                                 │   │   │
│  │  │ • IP Address Display                                 │   │   │
│  │  │ • Logout from Session                                 │   │   │
│  │  │ • Logout from All Sessions                            │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📡 API Calls via loginHistoryApi Service                  │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ GET    /api/v1/login-history/active                  │   │   │
│  │  │ GET    /api/v1/login-history                         │   │   │
│  │  │ POST   /api/v1/login-history/logout/:sessionId       │   │   │
│  │  │ POST   /api/v1/login-history/logout-all              │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                          ⬇️ HTTP Requests                            │
│                                                                      │
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️  MS1 SERVER (Backend)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🎮 Login History Controller                                │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • getActiveSessions()                                │   │   │
│  │  │ • getLoginHistory()                                  │   │   │
│  │  │ • logoutSession()                                    │   │   │
│  │  │ • logoutAllSessions()                               │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  💾 Login History Model (MongoDB)                           │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Stores login sessions                             │   │   │
│  │  │ • Tracks device info                                │   │   │
│  │  │ • Records IP addresses                              │   │   │
│  │  │ • Manages session tokens                            │   │   │
│  │  │ • Tracks activity timestamps                        │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow

### 1. Track Login Flow

```
User → Login → MS1 Server → Create Login History Record → Save Session Info → Return Token
```

**Steps:**
1. User logs in successfully
2. MS1 Server generates JWT token
3. MS1 Server creates LoginHistory record with:
   - User ID, email, name
   - Login timestamp
   - IP address
   - Device information (browser, OS, device)
   - User agent string
   - Session token
4. MS1 Server marks session as active
5. MS1 Server returns token to client

### 2. View Active Sessions Flow

```
Admin → Active Sessions Page → MS1 Client → API Call → MS1 Server → Query Active Sessions → Return List → Display
```

**Steps:**
1. Admin opens Active Sessions page
2. MS1 Client sends GET request
3. MS1 Server queries LoginHistory for active sessions
4. MS1 Server populates user information
5. MS1 Server formats session data
6. MS1 Client displays active sessions with device info

### 3. Logout Session Flow

```
Admin → Logout Session → MS1 Client → API Call → MS1 Server → Update Session → Mark Inactive → Success
```

**Steps:**
1. Admin clicks logout on a session
2. MS1 Client sends POST request with sessionId
3. MS1 Server finds session by ID
4. MS1 Server updates logoutTime
5. MS1 Server marks session as inactive
6. MS1 Server invalidates session token
7. MS1 Client refreshes active sessions list

## Documentation Structure

To understand Login History completely, read in this order:

### 1. **Start Here** → [Login History Overview](./login-history-overview) (this page)
   - Understand the complete system
   - See how server and client work together
   - Learn the overall workflow

### 2. **Backend Implementation** → [MS1 Server - Login History API](../ms1-server/modules/login-history) *(Server-Side/API)*
   - API endpoints and routes
   - Database models and schemas
   - Business logic and controllers
   - Session management
   - **Note:** This is the server-side API that handles all backend operations

### 3. **Frontend Implementation** → [MS1 Client - Login History Component](../ms1-client/components/login-history) *(Client-Side)*
   - React component structure
   - Active sessions display
   - Login history table
   - Session management UI
   - State management
   - API integration
   - **Note:** This is the client-side React component that provides the UI

## Key Concepts

### Server-Side (MS1 Server)
- **Models**: LoginHistory schema with session tracking
- **Controllers**: Active sessions retrieval, login history, session logout
- **Tracking**: Device parsing, IP extraction, user agent analysis
- **Security**: Session token management, concurrent session limits

### Client-Side (MS1 Client)
- **Components**: ActiveSessions component, login history display
- **Services**: API service wrappers
- **State**: Active sessions list, login history
- **UI**: Tables, device badges, logout buttons

## Quick Reference

| Task | Server Side | Client Side |
|------|-------------|------------|
| View Active Sessions | `getActiveSessions()` controller | ActiveSessions component |
| View Login History | `getLoginHistory()` controller | Login history table |
| Logout Session | `logoutSession()` controller | Logout button |
| Logout All Sessions | `logoutAllSessions()` controller | Logout all button |

---

**Next Steps:**
- Read [MS1 Server - Login History API](../ms1-server/modules/login-history) for backend details
- Read [MS1 Client - Login History Component](../ms1-client/components/login-history) for frontend details

