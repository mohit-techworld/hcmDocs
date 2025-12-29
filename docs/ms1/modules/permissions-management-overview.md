---
title: Permissions Management - Overview
sidebar_position: 1
---

# Permissions Management - Complete Guide

The Permissions Management system provides a centralized way to define, manage, and assign granular permissions to users and plans. It enables role-based access control (RBAC) throughout the MS1 system.

## How It Works Together

```
╔═══════════════════════════════════════════════════════════════════════╗
║        PERMISSIONS MANAGEMENT - SERVER & CLIENT FLOW                   ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  🖥️  MS1 CLIENT (Frontend)                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🔐 Permission Component                                    │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • View all permissions                                │   │   │
│  │  │ • Filter by module                                    │   │   │
│  │  │ • Create new permissions                              │   │   │
│  │  │ • Edit permissions                                    │   │   │
│  │  │ • Delete permissions                                  │   │   │
│  │  │ • Assign to plans                                     │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📡 API Calls via permissionApi Service                    │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ GET    /api/v1/permissions                            │   │   │
│  │  │ GET    /api/v1/permissions/module/:moduleKey          │   │   │
│  │  │ POST   /api/v1/permissions                            │   │   │
│  │  │ PUT    /api/v1/permissions/:id                        │   │   │
│  │  │ DELETE /api/v1/permissions/:id                         │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                          ⬇️ HTTP Requests                            │
│                                                                      │
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️  MS1 SERVER (Backend)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🎮 Permissions Controller                                   │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • getPermissions()                                  │   │   │
│  │  │ • getPermissionsByModule()                          │   │   │
│  │  │ • getPermissionById()                               │   │   │
│  │  │ • createPermission()                                │   │   │
│  │  │ • updatePermission()                                │   │   │
│  │  │ • deletePermission()                                │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  💾 Permission Model (MongoDB)                              │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Stores permission definitions                      │   │   │
│  │  │ • Module-based organization                          │   │   │
│  │  │ • Unique permission names                            │   │   │
│  │  │ • Labels and descriptions                            │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  🔗 Integration with Plans                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Permissions assigned to pricing plans             │   │   │
│  │  │ • Plan permissions synced to companies              │   │   │
│  │  │ • Access control based on permissions               │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow

### 1. Create Permission Flow

```
Admin → Permission Form → MS1 Client → API Call → MS1 Server → Validation → Save to Database → Success
```

**Steps:**
1. Admin opens Permissions Management page
2. Clicks "Create New Permission"
3. Fills form (permissionName, label, description, moduleKey)
4. MS1 Client sends POST request to MS1 Server
5. MS1 Server validates input and checks for duplicates
6. MS1 Server creates permission in database
7. MS1 Client refreshes permission list

### 2. Assign Permissions to Plan Flow

```
Admin → Plan Management → Select Plan → Manage Permissions → Select Permissions → Save → Plan Updated
```

**Steps:**
1. Admin opens Plan Management
2. Selects a plan
3. Clicks "Manage Permissions"
4. MS1 Client loads all available permissions (grouped by module)
5. Admin selects/deselects permissions
6. MS1 Client sends update request
7. MS1 Server syncs permissions to plan
8. Plan is updated with new permissions

### 3. Permission-Based Access Control Flow

```
User → Request Resource → Check User Permissions → Allow/Deny Access → Return Response
```

**Steps:**
1. User makes request to protected resource
2. System checks user's plan permissions
3. System verifies required permission exists
4. If allowed, request proceeds
5. If denied, returns 403 Forbidden

## Documentation Structure

To understand Permissions Management completely, read in this order:

### 1. **Start Here** → [Permissions Management Overview](./permissions-management-overview) (this page)
   - Understand the complete system
   - See how server and client work together
   - Learn the overall workflow

### 2. **Backend Implementation** → [MS1 Server - Permissions Management API](../ms1-server/modules/permissions-management) *(Server-Side/API)*
   - API endpoints and routes
   - Database models and schemas
   - Business logic and controllers
   - Validation rules
   - **Note:** This is the server-side API that handles all backend operations

### 3. **Frontend Implementation** → [MS1 Client - Permissions Management Component](../ms1-client/components/permissions-management) *(Client-Side)*
   - React component structure
   - Permission management UI
   - Module-based filtering
   - CRUD operations interface
   - State management
   - API integration
   - **Note:** This is the client-side React component that provides the UI for managing permissions

## Key Concepts

### Server-Side (MS1 Server)
- **Models**: Permission schema with moduleKey, permissionName, label, description
- **Controllers**: CRUD operations for permissions
- **Routes**: RESTful API endpoints
- **Validation**: Input validation and duplicate checking
- **Integration**: Connected to Plan Management for permission assignment

### Client-Side (MS1 Client)
- **Components**: Permission management component with CRUD interface
- **Services**: API service wrappers
- **State**: Permission list, filters, form state
- **UI**: Table/list view, forms, module grouping

## Quick Reference

| Task | Server Side | Client Side |
|------|-------------|------------|
| View all permissions | `getPermissions()` controller | Permission list component |
| Filter by module | `getPermissionsByModule()` controller | Module filter dropdown |
| Create permission | `createPermission()` controller | Create permission form |
| Update permission | `updatePermission()` controller | Edit permission form |
| Delete permission | `deletePermission()` controller | Delete confirmation modal |
| Get permission by ID | `getPermissionById()` controller | Permission detail view |

---

**Next Steps:**
- Read [MS1 Server - Permissions Management API](../ms1-server/modules/permissions-management) for backend details
- Read [MS1 Client - Permissions Management Component](../ms1-client/components/permissions-management) for frontend details

