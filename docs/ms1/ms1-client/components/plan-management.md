---
title: Plan Management Component
sidebar_position: 2
description: "The Plan Management component is a React-based admin interface for creating, managing, and configuring pricing plans with associated permissions. It."
---

# Plan Management Component (MS1 Client)

> **Note:** This is the **client-side React component** documentation. For the server-side API, see [MS1 Server - Plan Management API](../../ms1-server/modules/plan-management).

The Plan Management component is a React-based admin interface for creating, managing, and configuring pricing plans with associated permissions. It provides an intuitive UI for managing subscription plans, assigning permissions, and viewing plan statistics.

## Overview

The `PlanManagement` component (`components/plan-management/PlanManagement.jsx`) provides administrators with a comprehensive interface to:

- Create and edit pricing plans
- Set monthly and yearly pricing
- Configure employee limits
- Assign permissions to plans
- View plan statistics
- Visual plan cards with color themes
- Search and filter permissions

## Component Structure

```
╔═══════════════════════════════════════════════════════════════════════╗
║              PLAN MANAGEMENT COMPONENT STRUCTURE                        ║
╚═══════════════════════════════════════════════════════════════════════╝

PlanManagement Component
│
├── 📊 Header Section
│   ├── Title & Description
│   └── "New Plan" Button
│
├── 📦 Plan Grid Display
│   ├── Plan Cards (Visual)
│   │   ├── Plan Name & Icon
│   │   ├── Pricing (Monthly/Yearly)
│   │   ├── Employee Limit
│   │   ├── Permission Count
│   │   ├── Features List (UI)
│   │   ├── Active/Inactive Badge
│   │   └── Action Buttons
│   │       ├── Edit Plan
│   │       ├── Manage Permissions
│   │       └── Delete Plan
│   │
│   └── Empty State (No plans)
│
├── 📝 Modals
│   ├── Plan Form Modal
│   │   ├── Create/Edit Plan Form
│   │   ├── Fields:
│   │   │   ├── Plan Name
│   │   │   ├── Tagline
│   │   │   ├── Monthly Price
│   │   │   ├── Yearly Price (Optional)
│   │   │   ├── Employee Limit
│   │   │   ├── Features UI (Text List)
│   │   │   ├── CTA Button Text
│   │   │   └── Active Status
│   │   ├── Validation
│   │   └── Save/Cancel Buttons
│   │
│   ├── Permission Management Modal
│   │   ├── Dual-Panel Layout
│   │   │   ├── Left: Available Permissions
│   │   │   │   ├── Grouped by Module
│   │   │   │   ├── Expand/Collapse Modules
│   │   │   │   ├── Search within Modules
│   │   │   │   ├── Select All/Clear per Module
│   │   │   │   └── Permission Checkboxes
│   │   │   │
│   │   │   └── Right: Assigned Permissions
│   │   │       ├── Currently Assigned
│   │   │       └── Newly Selected
│   │   │
│   │   ├── Module Status Indicators
│   │   │   ├── 🟢 Complete (All permissions)
│   │   │   ├── 🔵 Has Existing
│   │   │   ├── 🟡 New Only
│   │   │   └── ⚪ Empty
│   │   │
│   │   ├── Permission Summary
│   │   │   ├── Total Selected
│   │   │   ├── New Permissions
│   │   │   └── Removed Permissions
│   │   │
│   │   └── Save/Cancel Buttons
│   │
│   └── Confirmation Modals
│       ├── Delete Plan Confirmation
│       ├── Clear All Permissions Confirmation
│       └── Save Changes Confirmation (with summary)
│
└── 🔄 State Management
    ├── Plans Data
    ├── Permissions Data
    ├── Selected Plan
    ├── Permission Selection State
    └── UI State (Modals, Expanded Modules)
```

## Key Features

### 1. Plan Cards Display

**Visual Plan Cards:**
- Dynamic color themes based on plan name
- Plan icon/emoji
- Pricing display (monthly and yearly)
- Savings percentage for yearly pricing
- Employee limit display
- Permission count badge
- Features UI list (first 3 + "X more")
- Active/Inactive status indicator
- Hover actions (Edit, Permissions, Delete)

**Color Themes:**
The component automatically assigns color themes based on plan name:
- 🆓 FREE - Green theme
- PREMIUM - Yellow theme
- ENTERPRISE - Purple theme
- STARTER - Blue theme
- DIAMOND - Pink theme
- And more...

### 2. Plan CRUD Operations

**Create Plan:**
- Click "New Plan" button
- Fill out plan form
- Set pricing (monthly required, yearly optional)
- Set employee limit (number or "Unlimited")
- Add features UI list
- Save plan

**Edit Plan:**
- Click "Edit" on plan card
- Modify any field
- Only changed fields are sent to API
- Preserve existing permissions

**Delete Plan:**
- Click "Delete" on plan card
- Confirmation modal
- Plan is permanently deleted
- Cannot delete if plan is assigned to tenants

### 3. Permission Management

**Permission Assignment:**
- Click "Manage Permissions" on plan card
- Dual-panel interface opens
- Left: All available permissions (grouped by module)
- Right: Currently assigned permissions

**Module Organization:**
- Permissions grouped by module (e.g., "User Management", "Task Management")
- Expand/collapse modules
- Search within modules
- Module-level select all/clear

**Visual Indicators:**
- Green: Module has all permissions assigned
- Blue: Module has some existing permissions
- Yellow: Module has only newly selected permissions
- Gray: Module has no permissions

**Bulk Operations:**
- Select all permissions in a module
- Clear all permissions in a module
- Expand/collapse all modules
- Search across all permissions

### 4. Permission Selection

**Selection Process:**
1. View available permissions (left panel)
2. Click to select permissions
3. Selected permissions move to right panel
4. See summary of changes
5. Save to apply to plan

**Change Detection:**
- Tracks initial permissions
- Calculates added permissions
- Calculates removed permissions
- Shows change summary before saving

### 5. Real-time Updates

**Optimistic Updates:**
- UI updates immediately
- API call in background
- Revert on error
- Refresh data on success

**Auto-refresh:**
- Reload plans after create/update
- Reload permissions after assignment
- Update statistics automatically

## Component Flow

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    COMPONENT INTERACTION FLOW                          ║
╚═══════════════════════════════════════════════════════════════════════╝

1. Component Mounts
   │
   ├──► Load All Plans
   │    │
   │    └──► Display Plan Cards
   │
   └──► Load All Permissions
        │
        └──► Group by Module (for permission modal)

2. Create Plan Flow
   │
   ├──► Click "New Plan"
   │    │
   │    └──► Open Plan Form Modal
   │         │
   │         ├──► Fill Form
   │         │
   │         ├──► Click "Save"
   │         │    │
   │         │    ├──► Validate Form
   │         │    │
   │         │    ├──► API Call (Create Plan)
   │         │    │
   │         │    ├──► Success → Close Modal → Refresh Plans
   │         │    │
   │         │    └──► Error → Show Error Message
   │         │
   │         └──► Click "Cancel" → Close Modal

3. Manage Permissions Flow
   │
   ├──► Click "Manage Permissions" on Plan Card
   │    │
   │    └──► Open Permission Management Modal
   │         │
   │         ├──► Load Plan's Current Permissions
   │         │
   │         ├──► Display Available Permissions (Left)
   │         │
   │         ├──► Display Assigned Permissions (Right)
   │         │
   │         ├──► User Selects/Deselects Permissions
   │         │    │
   │         │    └──► Update Selection State
   │         │         │
   │         │         └──► Update Visual Indicators
   │         │
   │         ├──► Click "Save"
   │         │    │
   │         │    ├──► Calculate Changes
   │         │    │
   │         │    ├──► Show Confirmation (with summary)
   │         │    │
   │         │    ├──► API Call (Sync Permissions)
   │         │    │
   │         │    ├──► Success → Close Modal → Refresh Plans
   │         │    │
   │         │    └──► Error → Show Error Message
   │         │
   │         └──► Click "Cancel" → Close Modal (discard changes)
```

## State Management

### Main State Structure

```javascript
{
  plans: [],                  // Array of all plans
  permissions: [],            // Array of all available permissions
  selectedPlan: null,         // Currently selected plan for permission management
  selectedPermissions: {},    // Newly selected permissions (moduleKey → Set)
  existingPermissions: {},    // Already assigned permissions (moduleKey → Set)
  initialExistingPermissions: {},  // Snapshot for change detection
  expandedModules: Set,      // Expanded module keys
  editingPlan: null,         // Plan being edited
  showPermissionModal: false, // Permission modal visibility
  showEditModal: false,      // Edit modal visibility
  loading: false,           // Loading state
  error: null               // Error message
}
```

## API Integration

### Service: `services/planApi.js`

The component uses the `planApi` service to communicate with the backend:

**Key Methods:**

```javascript
// Get all plans
planApi.getAllPlans()

// Get plan by name
planApi.getPlanByName(planName)

// Create or update plan
planApi.upsertPlan(planName, planData)

// Update plan by ID
planApi.updatePlanById(planId, planData)

// Delete plan
planApi.deletePlan(planName)

// Sync features from permissions
planApi.syncFeaturesFromPermissions(planName, permissionNames)

// Get plan permissions
planApi.getPlanPermissions(planName)

// Get plan permissions by ID
planApi.getPlanPermissionsById(planId)
```

### Service: `services/permissionApi.js`

Used to fetch all available permissions:

```javascript
// Get all permissions
permissionApi.getAllPermissions()
```

## UI Components

### 1. Plan Cards

**Features:**
- Dynamic color themes
- Plan icon/emoji
- Pricing display with savings calculation
- Employee limit badge
- Permission count badge
- Features UI preview
- Active/Inactive status
- Hover actions

**Card Actions:**
- Edit Plan
- Manage Permissions
- Delete Plan

### 2. Plan Form Modal

**Form Fields:**
- Plan Name* (required, uppercase)
- Tagline (optional)
- Monthly Price (₹)* (required)
- Yearly Price (₹) (optional)
- Employee Limit (number or "Unlimited")
- Features UI (comma-separated list)
- CTA Button Text (default: "Choose")
- Active Status (checkbox)

**Validation:**
- Plan name required and unique
- Monthly price required and positive
- Employee limit must be number or "Unlimited"
- Real-time validation feedback

### 3. Permission Management Modal

**Left Panel - Available Permissions:**
- Grouped by module
- Expand/collapse modules
- Search within modules
- Select all/clear per module
- Permission checkboxes with labels

**Right Panel - Assigned Permissions:**
- Currently assigned (from plan)
- Newly selected (pending save)
- Visual distinction between existing and new

**Module Status:**
- Color-coded indicators
- Module-level statistics
- Permission counts

**Summary Section:**
- Total selected permissions
- New permissions count
- Removed permissions count
- Change summary

### 4. Confirmation Modals

**Delete Plan:**
- Confirmation message
- Warning about permanent deletion
- Plan name display

**Clear All Permissions:**
- Confirmation before clearing
- Warning about removing all permissions

**Save Changes:**
- Summary of changes
- Added permissions list
- Removed permissions list
- Confirmation to proceed

## Usage Example

```jsx
import PlanManagement from './components/plan-management/PlanManagement';

function App() {
  return (
    <div>
      <PlanManagement />
    </div>
  );
}
```

## Key Functions

### Plan Management

```javascript
// Create new plan
const createPlan = async (planData) => {
  // Validate data
  // API call
  // Refresh plans list
  // Close modal
}

// Update existing plan
const updatePlan = async (planData) => {
  // Only send changed fields
  // API call
  // Refresh plans list
  // Close modal
}

// Delete plan
const deletePlan = async (plan) => {
  // Show confirmation
  // API call
  // Refresh plans list
}
```

### Permission Management

```javascript
// View plan permissions
const viewPlanPermissions = async (plan) => {
  // Load plan permissions
  // Group by module
  // Open permission modal
  // Set selected plan
}

// Toggle permission selection
const togglePermission = (moduleKey, permissionName) => {
  // Add/remove from selection
  // Update visual indicators
  // Recalculate changes
}

// Save permission changes
const attachPermissions = async () => {
  // Calculate permission names
  // Show confirmation
  // API call
  // Refresh plans
  // Close modal
}
```

### Module Operations

```javascript
// Toggle module expansion
const toggleModule = (moduleKey) => {
  // Add/remove from expanded set
}

// Select all permissions in module
const toggleModuleAll = (moduleKey, allSelected) => {
  // Select/deselect all permissions
  // Update visual indicators
}

// Search within modules
const searchPermissions = (query) => {
  // Filter permissions by query
  // Update display
}
```

## Styling

The component uses Tailwind CSS with:
- Dynamic color themes per plan
- Dark mode support
- Responsive grid layout
- Smooth transitions
- Loading states
- Error states
- Modal animations

## Best Practices

1. **Plan Naming:** Use uppercase, descriptive names
2. **Pricing:** Set yearly pricing to show savings
3. **Permissions:** Use module organization for clarity
4. **Validation:** Always validate before saving
5. **Error Handling:** Show clear error messages
6. **Loading States:** Provide feedback during operations
7. **Optimistic Updates:** Update UI immediately, sync in background

## Real-World Example

**Creating a "BASIC" Plan:**

1. Click "New Plan" button
2. Fill form:
   - Name: "BASIC"
   - Monthly Price: ₹999
   - Yearly Price: ₹9999
   - Employee Limit: 50
   - Tagline: "Perfect for small teams"
3. Click "Save"
4. Plan appears in grid
5. Click "Manage Permissions"
6. Select permissions from modules
7. Click "Save"
8. Permissions are assigned to plan

## Related Components

- `Permission` component - Permission management interface

## Related Services

- `planApi` - API service for plans
- `permissionApi` - API service for permissions

---

**Next Steps:**
- [MS1 Server - Plan Management Module](../../ms1-server/modules/plan-management)
- [MS1 Client - Folder Structure](../folder-structure)
- [MS1 Client - Components Overview](../components)

