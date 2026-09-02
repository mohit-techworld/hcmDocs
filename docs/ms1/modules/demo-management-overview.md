---
title: Demo Management - Overview
sidebar_position: 1
description: "Demo Management - Complete Guide — HCM platform documentation."
---

# Demo Management - Complete Guide

The Demo Management system allows potential customers to request product demonstrations and enables administrators to manage these requests through a complete workflow from submission to completion.

## How It Works Together

```
╔═══════════════════════════════════════════════════════════════════════╗
║              DEMO MANAGEMENT - SERVER & CLIENT FLOW                    ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  🖥️  MS1 CLIENT (Frontend)                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  📋 DemoEnquiry Component                                   │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • View all demo requests                            │   │   │
│  │  │ • Filter by status, date, search                     │   │   │
│  │  │ • Schedule demos                                     │   │   │
│  │  │ • Update status                                      │   │   │
│  │  │ • Export data                                        │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📡 API Calls via demoApi Service                          │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ GET    /api/v1/demo/demo-requests                   │   │   │
│  │  │ PATCH  /api/v1/demo/demo-requests/:id/schedule      │   │   │
│  │  │ PATCH  /api/v1/demo/demo-requests/:id/status         │   │   │
│  │  │ ...                                                   │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                          ⬇️ HTTP Requests                            │
│                                                                      │
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️  MS1 SERVER (Backend)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🎮 Demo Controller                                         │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • getDemoRequests()                                  │   │   │
│  │  │ • scheduleDemo()                                     │   │   │
│  │  │ • updateDemoRequestStatus()                         │   │   │
│  │  │ • ...                                                │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  💾 Demo Model (MongoDB)                                    │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Stores demo requests                             │   │   │
│  │  │ • Tracks status                                     │   │   │
│  │  │ • Manages OTP                                       │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📧 Email Service                                          │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Sends OTP emails                                   │   │   │
│  │  │ • Sends confirmation emails                          │   │   │
│  │  │ • Sends scheduled emails                             │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow

### 1. Customer Requests Demo (Public Flow)

```
Customer → Landing Page Form → MS1 Server API → OTP Email → Verification → Confirmation
```

**Steps:**
1. Customer fills demo request form on landing page
2. System checks for existing verified requests
3. System generates OTP and sends email
4. Customer verifies OTP
5. System saves verified request
6. System sends confirmation email to customer
7. System sends notification to admin

### 2. Admin Manages Demo (Admin Flow)

```
Admin → MS1 Client UI → API Call → MS1 Server → Database Update → Email Sent → UI Update
```

**Steps:**
1. Admin opens Demo Management page in MS1 Client
2. Views list of demo requests (filtered/searched)
3. Clicks "Schedule Demo" on a request
4. Fills schedule form (date, time, meeting link, notes)
5. MS1 Client sends API request to MS1 Server
6. MS1 Server validates and saves to database
7. MS1 Server sends scheduled email to customer
8. MS1 Client updates UI to show new status

## Documentation Structure

To understand Demo Management completely, read in this order:

### 1. **Start Here** → [Demo Management Overview](./demo-management-overview) (this page)
   - Understand the complete system
   - See how server and client work together
   - Learn the overall workflow

### 2. **Backend Implementation** → [MS1 Server - Demo Management API](../ms1-server/modules/demo-management) *(Server-Side/API)*
   - API endpoints and routes
   - Database models and schemas
   - Business logic and controllers
   - Email services
   - Validation rules
   - **Note:** This is the server-side API that handles all backend operations

### 3. **Frontend Implementation** → [MS1 Client - Demo Management Component](../ms1-client/components/demo-management) *(Client-Side)*
   - React component structure
   - UI components and features
   - State management
   - API integration
   - User interactions
   - **Note:** This is the client-side React component that provides the UI for managing demo requests

## Key Concepts

### Server-Side (MS1 Server)
- **Models**: Database schemas for demo requests
- **Controllers**: Business logic for handling requests
- **Routes**: API endpoints
- **Services**: Email sending, OTP generation
- **Validation**: Input validation and sanitization

### Client-Side (MS1 Client)
- **Components**: React UI components
- **Services**: API service wrappers
- **State**: Component state management
- **UI**: User interface and interactions

## Quick Reference

| Task | Server Side | Client Side |
|------|-------------|------------|
| View demo requests | `getDemoRequests()` controller | `DemoEnquiry` component |
| Schedule demo | `scheduleDemo()` controller | Schedule form in modal |
| Update status | `updateDemoRequestStatus()` controller | Status update buttons |
| Filter/search | Query parameters in API | Filter UI components |
| Export data | `exportDemoRequests()` controller | Export buttons |

## Integration Points

### API Communication
- Client uses `demoApi` service to call server endpoints
- Server responds with JSON data
- Client updates UI based on responses

### Data Flow
```
User Action (Client) → API Call → Server Processing → Database → Response → UI Update (Client)
```

### Real-time Updates
- Client uses optimistic updates for instant feedback
- Server validates and processes requests
- Client refreshes data after successful operations

## Next Steps

1. Read [MS1 Server - Demo Management](../ms1-server/modules/demo-management) for backend details
2. Read [MS1 Client - Demo Management Component](../ms1-client/components/demo-management) for frontend details
3. Check [MS1 Server Folder Structure](../ms1-server/folder-structure) to understand code organization
4. Check [MS1 Client Folder Structure](../ms1-client/folder-structure) to understand component structure

---

**This unified view helps you understand how the server and client work together to provide the complete Demo Management functionality.**

