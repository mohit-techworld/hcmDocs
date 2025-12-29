---
title: Permissions Management Component
sidebar_position: 1
---

# Permissions Management Component (MS1 Client)

> **Note:** This is the **client-side React component** documentation. For the server-side API, see [MS1 Server - Permissions Management API](../../ms1-server/modules/permissions-management).

The Permissions Management component provides a React-based interface for managing system permissions. It allows administrators to create, view, edit, and delete permissions organized by modules.

## Overview

The `Permission` component (`components/permission/Permission.jsx`) provides administrators with a comprehensive interface to:

- 📋 View all permissions in a table/list
- 🔍 Filter permissions by module
- ➕ Create new permissions
- ✏️ Edit existing permissions
- 🗑️ Delete permissions
- 📊 View permission details

## Component Structure

```
╔═══════════════════════════════════════════════════════════════════════╗
║        PERMISSIONS MANAGEMENT COMPONENT STRUCTURE                     ║
╚═══════════════════════════════════════════════════════════════════════╝

Permission Component
│
├── 📊 Header Section
│   ├── Title & Description
│   └── "New Permission" Button
│
├── 🔍 Filters Section
│   ├── Module Filter Dropdown
│   └── Search Input
│
├── 📋 Permissions Table/List
│   ├── Table Headers
│   │   ├── Module
│   │   ├── Permission Name
│   │   ├── Label
│   │   ├── Description
│   │   ├── Status
│   │   └── Actions
│   │
│   ├── Permission Rows
│   │   ├── Module Badge
│   │   ├── Permission Name (code)
│   │   ├── Human-readable Label
│   │   ├── Description
│   │   ├── Active/Inactive Badge
│   │   └── Action Buttons
│   │       ├── Edit
│   │       └── Delete
│   │
│   └── Empty State
│
├── 📝 Modals
│   ├── Create/Edit Permission Modal
│   │   ├── Form Fields:
│   │   │   ├── Module Key (dropdown/input)
│   │   │   ├── Permission Name (input)
│   │   │   ├── Label (input)
│   │   │   ├── Description (textarea)
│   │   │   └── Active Status (toggle)
│   │   ├── Validation
│   │   └── Save/Cancel Buttons
│   │
│   └── Delete Confirmation Modal
│       ├── Warning Message
│       └── Confirm/Cancel Buttons
│
└── 🔌 API Integration
    └── permissionApi Service
```

## Features

### View Permissions
- Display all permissions in a sortable table
- Group by module for better organization
- Show permission details (name, label, description)
- Display active/inactive status

### Filter by Module
- Dropdown to filter permissions by module key
- "All Modules" option to show everything
- Real-time filtering

### Create Permission
- Modal form for creating new permissions
- Validation for required fields
- Duplicate name checking
- Automatic lowercase conversion of permissionName

### Edit Permission
- Pre-filled form with existing data
- Update permission details
- Validation and duplicate checking

### Delete Permission
- Confirmation modal before deletion
- Warning about potential impact
- Remove permission from system

## State Management

```javascript
{
  permissions: Array, // All permissions
  filteredPermissions: Array, // Filtered by module
  selectedModule: string, // Current module filter
  searchTerm: string, // Search input
  isModalOpen: boolean, // Create/Edit modal state
  editingPermission: Object | null, // Permission being edited
  isDeleteModalOpen: boolean, // Delete confirmation modal
  permissionToDelete: Object | null, // Permission to delete
  loading: boolean, // Loading state
  error: string | null // Error message
}
```

## API Integration

### permissionApi.js

**Location:** `services/permissionApi.js`

**Functions:**
- `getPermissions()` – Get all permissions
- `getPermissionsByModule(moduleKey)` – Get permissions by module
- `getPermissionById(id)` – Get single permission
- `createPermission(data)` – Create new permission
- `updatePermission(id, data)` – Update permission
- `deletePermission(id)` – Delete permission

**Example Usage:**
```javascript
import permissionApi from '../services/permissionApi'

// Get all permissions
const permissions = await permissionApi.getPermissions()

// Filter by module
const taskPermissions = await permissionApi.getPermissionsByModule('task')

// Create permission
const newPermission = await permissionApi.createPermission({
  permissionName: 'task_create',
  label: 'Create Task',
  description: 'Allows user to create new tasks',
  moduleKey: 'task'
})
```

## User Flows

### Creating a Permission

```
1. Admin clicks "New Permission" button
2. Modal opens with empty form
3. Admin fills in:
   - Module Key (e.g., "task")
   - Permission Name (e.g., "task_create")
   - Label (e.g., "Create Task")
   - Description
4. Admin clicks "Save"
5. Component validates input
6. API call to create permission
7. On success: Modal closes, list refreshes
8. On error: Show error message
```

### Editing a Permission

```
1. Admin clicks "Edit" on a permission row
2. Modal opens with pre-filled form
3. Admin modifies fields
4. Admin clicks "Save"
5. Component validates input
6. API call to update permission
7. On success: Modal closes, list refreshes
8. On error: Show error message
```

### Filtering by Module

```
1. Admin selects module from dropdown
2. Component filters permissions array
3. Table updates to show only matching permissions
4. "All Modules" option shows everything
```

## Error Handling

### Form Validation
- Required fields highlighted if empty
- Duplicate permission names detected
- Invalid module keys rejected

### API Errors
- Network errors displayed as toast notifications
- Validation errors shown inline in form
- 404 errors for not found permissions
- 500 errors with generic error message

## Styling

Components use:
- **Tailwind CSS** for styling
- **Responsive Design** for mobile/desktop
- **Dark Mode Support** via ThemeContext
- **Table Styling** with hover effects
- **Modal Overlays** with backdrop blur

## Integration Points

### With Plan Management
- Permissions created here are available in Plan Management
- Permissions assigned to plans control feature access
- Changes to permissions affect plan configurations

### With Access Control
- Permissions defined here are checked in middleware
- User access based on plan permissions
- Feature visibility controlled by permissions

---

**Next Steps:**
- Read [MS1 Server - Permissions Management API](../../ms1-server/modules/permissions-management) for backend details
- See [Permissions Management Overview](../modules/permissions-management-overview) for complete system understanding

