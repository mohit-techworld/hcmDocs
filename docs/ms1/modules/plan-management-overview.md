---
title: Plan Management - Overview
sidebar_position: 1
---

# Plan Management - Complete Guide

The Plan Management system allows administrators to create, manage, and configure pricing plans with associated permissions. It provides a complete solution for subscription plan management with both server-side API and client-side UI.

## How It Works Together

```
╔═══════════════════════════════════════════════════════════════════════╗
║              PLAN MANAGEMENT - SERVER & CLIENT FLOW                     ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  🖥️  MS1 CLIENT (Frontend)                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  📦 PlanManagement Component                                │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • View all plans in grid                             │   │   │
│  │  │ • Create new plans                                   │   │   │
│  │  │ • Edit existing plans                                │   │   │
│  │  │ • Manage permissions                                 │   │   │
│  │  │ • Delete plans                                       │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📡 API Calls via planApi Service                          │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ GET    /api/v1/plans                                 │   │   │
│  │  │ PUT    /api/v1/plans/:name                           │   │   │
│  │  │ POST   /api/v1/plans/:name/features                  │   │   │
│  │  │ GET    /api/v1/plans/:name/permissions               │   │   │
│  │  │ DELETE /api/v1/plans/:name                           │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                          ⬇️ HTTP Requests                            │
│                                                                      │
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️  MS1 SERVER (Backend)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🎮 Plan Controller                                         │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • getAllPlans()                                     │   │   │
│  │  │ • upsertPlan()                                      │   │   │
│  │  │ • syncFeaturesFromPermissions()                     │   │   │
│  │  │ • getPlanPermissions()                              │   │   │
│  │  │ • deletePlan()                                      │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  💾 PricingPlan Model (MongoDB)                            │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Stores plan details                               │   │   │
│  │  │ • Stores pricing (monthly/yearly)                  │   │   │
│  │  │ • Stores employee limits                            │   │   │
│  │  │ • Links to permissions                              │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  🔗 Permission Model Integration                           │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Validates permission names                        │   │   │
│  │  │ • Hydrates permission details                       │   │   │
│  │  │ • Organizes by module                               │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow

### 1. Create a New Plan

```
Admin → MS1 Client UI → Fill Form → API Call → MS1 Server → Validate → Save to DB → Return Plan → UI Update
```

**Steps:**
1. Admin clicks "New Plan" in MS1 Client
2. Fills plan form (name, pricing, limits, etc.)
3. MS1 Client sends API request to MS1 Server
4. MS1 Server validates data (name uniqueness, pricing, etc.)
5. MS1 Server saves plan to database
6. MS1 Server returns created plan
7. MS1 Client updates UI to show new plan

### 2. Assign Permissions to Plan

```
Admin → Select Plan → Manage Permissions → Select Permissions → API Call → MS1 Server → Sync Permissions → Update Plan → UI Update
```

**Steps:**
1. Admin clicks "Manage Permissions" on a plan
2. MS1 Client loads plan's current permissions
3. MS1 Client loads all available permissions (grouped by module)
4. Admin selects/deselects permissions
5. MS1 Client sends API request with permission names
6. MS1 Server validates permissions exist
7. MS1 Server syncs permissions to plan
8. MS1 Server updates plan in database
9. MS1 Client refreshes plan display

## Documentation Structure

To understand Plan Management completely, read in this order:

### 1. **Start Here** → [Plan Management Overview](./plan-management-overview) (this page)
   - Understand the complete system
   - See how server and client work together
   - Learn the overall workflow

### 2. **Backend Implementation** → [MS1 Server - Plan Management API](../ms1-server/modules/plan-management) *(Server-Side/API)*
   - API endpoints and routes
   - Database models and schemas
   - Business logic and controllers
   - Permission integration
   - Validation rules
   - **Note:** This is the server-side API that handles all backend operations

### 3. **Frontend Implementation** → [MS1 Client - Plan Management Component](../ms1-client/components/plan-management) *(Client-Side)*
   - React component structure
   - Plan cards and UI components
   - Permission management interface
   - State management
   - User interactions
   - **Note:** This is the client-side React component that provides the UI for managing plans

## Key Concepts

### Server-Side (MS1 Server)
- **Models**: PricingPlan schema, Permission integration
- **Controllers**: Plan CRUD operations, permission syncing
- **Routes**: RESTful API endpoints
- **Validation**: Plan name uniqueness, pricing validation
- **Integration**: Permission model hydration

### Client-Side (MS1 Client)
- **Components**: PlanManagement component with modals
- **Services**: planApi service wrapper
- **State**: Plans, permissions, selection state
- **UI**: Plan cards, permission management modal

## Quick Reference

| Task | Server Side | Client Side |
|------|-------------|------------|
| View all plans | `getAllPlans()` controller | Plan grid display |
| Create plan | `upsertPlan()` controller | Plan form modal |
| Edit plan | `updatePlanById()` controller | Edit form modal |
| Manage permissions | `syncFeaturesFromPermissions()` controller | Permission management modal |
| Delete plan | `deletePlan()` controller | Delete confirmation |

## Integration Points

### API Communication
- Client uses `planApi` service to call server endpoints
- Server responds with plan data and permissions
- Client updates UI based on responses

### Permission Integration
- Server validates permissions against Permission model
- Server hydrates permission details (label, description, moduleKey)
- Client displays permissions grouped by module
- Client allows selecting permissions to assign to plans

### Data Flow
```
User Action (Client) → API Call → Server Processing → Database → Permission Sync → Response → UI Update (Client)
```

## Real-World Example

**Creating a "BASIC" Plan with Permissions:**

1. **Admin opens MS1 Client** → Plan Management page
2. **Clicks "New Plan"** → Plan form modal opens
3. **Fills form:**
   - Name: "BASIC"
   - Monthly Price: ₹999
   - Yearly Price: ₹9999
   - Employee Limit: 50
4. **Clicks "Save"** → Plan created in database
5. **Clicks "Manage Permissions"** → Permission modal opens
6. **Selects permissions** from modules (e.g., "User Management", "Task Management")
7. **Clicks "Save"** → Permissions synced to plan
8. **Plan is ready** → Companies can subscribe to this plan

## Next Steps

1. 📖 Read [MS1 Server - Plan Management](../ms1-server/modules/plan-management) for backend details
2. 🎨 Read [MS1 Client - Plan Management Component](../ms1-client/components/plan-management) for frontend details
3. 🔧 Check [MS1 Server Folder Structure](../ms1-server/folder-structure) to understand code organization
4. 🖥️ Check [MS1 Client Folder Structure](../ms1-client/folder-structure) to understand component structure

---

**This unified view helps you understand how the server and client work together to provide the complete Plan Management functionality.**

