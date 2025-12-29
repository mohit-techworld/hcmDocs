---
title: Permissions Management API
sidebar_position: 1
---

# Permissions Management API (Server-Side)

> **Note:** This is the **server-side API documentation** for Permissions Management. For the client-side React component, see [MS1 Client - Permissions Management Component](../../ms1-client/components/permissions-management).

The Permissions Management module provides a centralized system for defining, managing, and organizing granular permissions that control access to features and resources throughout the MS1 system.

## Overview

The Permissions Management module enables role-based access control (RBAC) by allowing administrators to:
- Create and manage permission definitions
- Organize permissions by modules (e.g., "task", "payroll", "attendance")
- Assign permissions to pricing plans
- Control feature access based on user subscriptions

## Core Features

- **Permission CRUD Operations** – Create, read, update, and delete permissions
- **Module-Based Organization** – Group permissions by functional modules
- **Unique Permission Names** – Enforce unique permission identifiers
- **Descriptive Labels** – Human-readable permission names
- **Integration with Plans** – Permissions assigned to pricing plans
- **Active/Inactive Status** – Enable or disable permissions

## Backend Components

### Models

#### `model/permission.model.js` – Permission Schema

The Permission model stores all permission definitions:

```javascript
{
  moduleKey: String (required, indexed), // e.g., "task", "payroll"
  permissionName: String (required, unique, lowercase), // e.g., "task_create", "task_read"
  label: String (required), // Human-readable name
  description: String (required), // Detailed description
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Controllers

#### `controller/permissionsController.js`

**Main Functions:**

1. **`getPermissions`** – Get all permissions
2. **`getPermissionsByModule`** – Get permissions filtered by module
3. **`getPermissionById`** – Get single permission by ID
4. **`createPermission`** – Create new permission
5. **`updatePermission`** – Update existing permission
6. **`deletePermission`** – Delete permission

### Routes

#### `routes/permissionsRoutes.js`

**Base URL:** `/api/v1/permissions`

**Authentication:**
- All endpoints require admin authentication

## API Reference

### 1. Get All Permissions

**Endpoint:** `GET /api/v1/permissions`

**Description:** Retrieve all permissions in the system, sorted by creation date (newest first).

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "moduleKey": "task",
      "permissionName": "task_create",
      "label": "Create Task",
      "description": "Allows user to create new tasks",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "moduleKey": "task",
      "permissionName": "task_read",
      "label": "View Tasks",
      "description": "Allows user to view tasks",
      "isActive": true,
      "createdAt": "2024-01-15T10:31:00.000Z",
      "updatedAt": "2024-01-15T10:31:00.000Z"
    }
  ],
  "message": "Permissions retrieved successfully"
}
```

### 2. Get Permissions by Module

**Endpoint:** `GET /api/v1/permissions/module/:moduleKey`

**Description:** Retrieve all permissions for a specific module.

**Path Parameters:**
- `moduleKey` (string, required) – The module identifier (e.g., "task", "payroll")

**Example:** `GET /api/v1/permissions/module/task`

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "moduleKey": "task",
      "permissionName": "task_create",
      "label": "Create Task",
      "description": "Allows user to create new tasks",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "message": "Module permissions retrieved successfully"
}
```

### 3. Get Permission by ID

**Endpoint:** `GET /api/v1/permissions/:id`

**Description:** Retrieve a single permission by its ID.

**Path Parameters:**
- `id` (string, required) – The permission MongoDB ObjectId

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "moduleKey": "task",
    "permissionName": "task_create",
    "label": "Create Task",
    "description": "Allows user to create new tasks",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Permission retrieved successfully"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "error": "Permission not found"
}
```

### 4. Create Permission

**Endpoint:** `POST /api/v1/permissions`

**Description:** Create a new permission.

**Request Body:**
```json
{
  "permissionName": "task_create",
  "label": "Create Task",
  "description": "Allows user to create new tasks",
  "moduleKey": "task"
}
```

**Validation:**
- `permissionName` (required) – Must be unique, will be converted to lowercase
- `label` (required) – Human-readable name
- `description` (required) – Detailed description
- `moduleKey` (required) – Module identifier

**Response (Success - 201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "moduleKey": "task",
    "permissionName": "task_create",
    "label": "Create Task",
    "description": "Allows user to create new tasks",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Permission created successfully"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "Permission with this name already exists"
}
```

### 5. Update Permission

**Endpoint:** `PUT /api/v1/permissions/:id`

**Description:** Update an existing permission.

**Path Parameters:**
- `id` (string, required) – The permission MongoDB ObjectId

**Request Body:**
```json
{
  "permissionName": "task_create",
  "label": "Create New Task",
  "description": "Allows user to create and manage new tasks",
  "moduleKey": "task"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "moduleKey": "task",
    "permissionName": "task_create",
    "label": "Create New Task",
    "description": "Allows user to create and manage new tasks",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Permission updated successfully"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "error": "Permission not found"
}
```

### 6. Delete Permission

**Endpoint:** `DELETE /api/v1/permissions/:id`

**Description:** Delete a permission from the system.

**Path Parameters:**
- `id` (string, required) – The permission MongoDB ObjectId

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Permission deleted successfully"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "error": "Permission not found"
}
```

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

### Common Error Codes

| HTTP Status | Error | Description |
|-------------|-------|-------------|
| 400 | Validation Error | Missing required fields or invalid input |
| 400 | Duplicate Permission | Permission name already exists |
| 404 | Not Found | Permission not found |
| 500 | Server Error | Internal server error |

## Permission Naming Convention

**Format:** `{moduleKey}_{action}`

**Examples:**
- `task_create` – Create tasks
- `task_read` – View tasks
- `task_update` – Update tasks
- `task_delete` – Delete tasks
- `payroll_view` – View payroll
- `payroll_edit` – Edit payroll
- `attendance_mark` – Mark attendance

## Integration with Plans

Permissions are assigned to pricing plans through the Plan Management module:

1. Permissions are created in Permissions Management
2. Permissions are assigned to plans in Plan Management
3. When a company subscribes to a plan, they receive all plan permissions
4. Permissions are synced to tenant databases
5. Access control checks user's plan permissions

## Workflow Examples

### Creating a New Permission

```
1. Admin → POST /api/v1/permissions
2. Server validates required fields
3. Server checks for duplicate permissionName
4. Server creates permission (lowercases permissionName)
5. Server saves to database
6. Server returns created permission
```

### Updating a Permission

```
1. Admin → PUT /api/v1/permissions/:id
2. Server finds permission by ID
3. Server validates input
4. Server checks for duplicate if permissionName changed
5. Server updates permission
6. Server returns updated permission
```

---

**Next Steps:**
- Read [MS1 Client - Permissions Management Component](../../ms1-client/components/permissions-management) for frontend implementation
- See [Permissions Management Overview](../modules/permissions-management-overview) for complete system understanding

