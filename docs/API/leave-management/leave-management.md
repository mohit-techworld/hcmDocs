---
sidebar_position: 1
---

# Leave Management

<!-- # Leave Management API Documentation -->

## Overview

The Leave Management API provides comprehensive functionality for managing employee leave requests, approvals, and leave type administration. This system supports complex leave policies, carry-forward mechanisms, approval workflows, and detailed reporting for organizational leave management.

### Key Features

- **Leave Application System**: Submit leave requests with document support
- **Approval Workflow**: Multi-level approval system with manager hierarchy
- **Leave Balance Management**: Real-time leave balance tracking with carry-forward
- **Leave Types Administration**: Flexible leave type configuration (paid, unpaid, mixed)
- **Subordinate Management**: Manager dashboard for team leave oversight
- **Advanced Reporting**: Comprehensive analytics and statistics
- **Document Support**: File upload for leave supporting documents
- **Real-time Notifications**: Push notifications for leave status updates

## Base URL

```
https://your-api-domain.com/api
```

## Authentication & Authorization

### Authentication Flow

The API uses JSON Web Tokens (JWT) for authentication with role-based access control for different leave management functions.

#### Authorization Header Format

```http
Authorization: Bearer <your_jwt_token>
```

### Permission System

The API implements permissions for different leave management operations:

#### Leave Permissions
- **leave-apply**: Apply for leave
- **leave-manage-subordinate**: Manage subordinate leave requests
- **leave-admin**: Full leave administration access
- **leave-view**: View leave records
- **leave-reports**: Access to leave reports and analytics

## System Architecture

### Request Flow

```
Client Request → JWT Validation → Permission Check → Controller → Database → Notification → Response
```

### Data Models

#### Leave Model
```javascript
{
  _id: "ObjectId",
  employee: "ObjectId", // User reference
  leaveType: "ObjectId", // LeaveType reference
  leave_From: "Date",
  leave_To: "Date",
  no_Of_Days: "Number", // Can be fractional for half days
  reason_For_Leave: "String",
  emergencyContact: "String",
  workHandover: "String",
  leave_document: "String", // Cloudinary URL
  is_Half_Day: "Boolean",
  half_Day_Session: "String", // morning, afternoon
  half_Day_Position: "String", // first_half, second_half
  leave_Status: "String", // pending, approved, rejected
  approved_By: "ObjectId", // User reference
  rejected_By: "ObjectId", // User reference
  reason_For_Reject: "String",
  approvers: ["ObjectId"], // Array of User references
  currentApproverIndex: "Number",
  is_Paid: "Boolean",
  paidDays: "Number",
  unpaidDays: "Number",
  createdAt: "Date",
  updatedAt: "Date"
}
```

#### LeaveType Model
```javascript
{
  _id: "ObjectId",
  name: "String", // Unique leave type name
  description: "String",
  category: "String", // paid, unpaid, mixed
  maxDays: "Number", // Maximum days allowed
  isCarryForward: "Boolean",
  carryForwardDays: "String", // Reset date (e.g., "Jan-01")
  documentsRequired: "String",
  advanceNotice: "String", // Notice period required
  eligibility: "String", // Eligibility criteria
  policies: ["String"], // Array of policy descriptions
  color: "String", // UI color code
  isActive: "Boolean",
  organization: "String", // Organization identifier
  createdBy: "ObjectId", // User reference
  updatedBy: "ObjectId", // User reference
  createdAt: "Date",
  updatedAt: "Date"
}
```

#### Leave Ledger Model
```javascript
{
  _id: "ObjectId",
  employee: "ObjectId", // User reference
  balances: "Map", // Map of leaveTypeId to balance object
  // Balance object structure:
  // {
  //   monthlyQuota: "Number",
  //   carryForward: "Number",
  //   carryForwardPerMonth: "Map", // month -> carry forward amount
  //   used: "Map", // month -> used amount
  //   futureRequests: "Map" // month -> future requests amount
  // }
  createdAt: "Date",
  updatedAt: "Date"
}
```

## Leave Management API

### Apply for Leave

Submits a new leave application with optional document upload.

**Endpoint**: `POST /v1/leaves/apply`

**Authentication**: Required (JWT)

**Permissions**: `leave-apply`

**Content-Type**: `multipart/form-data`

**Request Body**:
```json
{
  "leaveType": "64a1b2c3d4e5f6789012345",
  "leave_From": "2024-02-15",
  "leave_To": "2024-02-17",
  "no_Of_Days": 3,
  "reason_For_Leave": "Family emergency requiring immediate attention",
  "emergencyContact": "+91-9876543210",
  "workHandover": "All pending tasks handed over to John Doe. Client meetings rescheduled.",
  "isHalfDay": false,
  "halfDayPeriod": null,
  "halfDayPosition": null
}
```

**File Upload**: Document upload via `documents` field (optional)

**Success Response** (201):
```json
{
  "success": true,
  "leave": {
    "_id": "64a1b2c3d4e5f6789012350",
    "employee": "64a1b2c3d4e5f6789012340",
    "leaveType": "64a1b2c3d4e5f6789012345",
    "leave_From": "2024-02-15T00:00:00.000Z",
    "leave_To": "2024-02-17T00:00:00.000Z",
    "no_Of_Days": 3,
    "reason_For_Leave": "Family emergency requiring immediate attention",
    "emergencyContact": "+91-9876543210",
    "workHandover": "All pending tasks handed over to John Doe. Client meetings rescheduled.",
    "leave_document": "https://cloudinary.com/leave_document.pdf",
    "is_Half_Day": false,
    "half_Day_Session": null,
    "half_Day_Position": null,
    "leave_Status": "pending",
    "approvers": ["64a1b2c3d4e5f6789012341"],
    "currentApproverIndex": 0,
    "is_Paid": true,
    "paidDays": 3,
    "unpaidDays": 0,
    "createdAt": "2024-02-10T10:30:00.000Z",
    "updatedAt": "2024-02-10T10:30:00.000Z"
  }
}
```

**Error Responses**:

*400 Bad Request - Invalid leave days*:
```json
{
  "success": false,
  "message": "Invalid leave days"
}
```

*400 Bad Request - Overlapping leave*:
```json
{
  "success": false,
  "message": "You already have a leave that overlaps with these dates."
}
```

*400 Bad Request - Exceeds maximum days*:
```json
{
  "success": false,
  "message": "You can't apply for more than 30 days of paid leave."
}
```

*400 Bad Request - No approvers found*:
```json
{
  "success": false,
  "message": "No approvers found."
}
```

*403 Forbidden - No eligible approvers*:
```json
{
  "success": false,
  "message": "No eligible approvers."
}
```

**Business Rules**:
- Leave days must be positive and in increments of 0.5 (for half days)
- Cannot apply for overlapping leave periods
- Must not exceed maximum days for the leave type
- Requires at least one eligible approver in the hierarchy
- Automatically finds the nearest manager with `leave-manage-subordinate` permission
- Updates leave ledger with future requests
- Supports document upload for leave justification

### Handle Leave Request

Approves or rejects a leave request by an authorized manager.

**Endpoint**: `PUT /v1/leaves/handle-leave/:leaveId`

**Authentication**: Required (JWT)

**Permissions**: `leave-manage-subordinate`

**Path Parameters**:
- `leaveId` (string): MongoDB ObjectId of the leave request

**Request Body**:
```json
{
  "action": "approved",
  "reason_For_Reject": null
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Leave approved successfully.",
  "leave": {
    "_id": "64a1b2c3d4e5f6789012350",
    "employee": {
      "_id": "64a1b2c3d4e5f6789012340",
      "first_Name": "John",
      "last_Name": "Doe",
      "employee_Id": "EMP001"
    },
    "leaveType": "64a1b2c3d4e5f6789012345",
    "leave_From": "2024-02-15T00:00:00.000Z",
    "leave_To": "2024-02-17T00:00:00.000Z",
    "no_Of_Days": 3,
    "leave_Status": "approved",
    "approved_By": "64a1b2c3d4e5f6789012341",
    "reason_For_Leave": "Family emergency requiring immediate attention",
    "updatedAt": "2024-02-10T11:00:00.000Z"
  }
}
```

**Rejection Request Body**:
```json
{
  "action": "rejected",
  "reason_For_Reject": "Insufficient advance notice provided for the requested dates."
}
```

**Rejection Response** (200):
```json
{
  "success": true,
  "message": "Leave rejected successfully.",
  "leave": {
    "_id": "64a1b2c3d4e5f6789012350",
    "leave_Status": "rejected",
    "rejected_By": "64a1b2c3d4e5f6789012341",
    "reason_For_Reject": "Insufficient advance notice provided for the requested dates.",
    "updatedAt": "2024-02-10T11:00:00.000Z"
  }
}
```

**Error Responses**:

*400 Bad Request - Invalid action*:
```json
{
  "message": "Invalid action."
}
```

*400 Bad Request - Missing rejection reason*:
```json
{
  "message": "Rejection reason is required."
}
```

*404 Not Found - Leave not found*:
```json
{
  "message": "Leave not found or already processed."
}
```

*403 Forbidden - Not authorized*:
```json
{
  "message": "Not authorized to handle this leave."
}
```

**Business Rules**:
- Only designated approvers can handle leave requests
- Leave must be in "pending" status
- Rejection requires a reason
- **Approval Process**:
  - Updates leave ledger balances
  - Creates attendance records with "Leave" status
  - Sends notification to employee
  - Triggers push notifications
- **Rejection Process**:
  - Removes future request allocation from ledger
  - Sends notification with rejection reason
- All operations are performed within database transactions

### Get Employee Leaves by Status

Retrieves leave requests for the authenticated employee filtered by status.

**Endpoint**: `GET /v1/leaves/employee`

**Authentication**: Required (JWT)

**Query Parameters**:
- `status` (string, optional): Filter by status (`pending`, `approved`, `rejected`, `all`)

**Success Response** (200):
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012350",
    "employee": {
      "_id": "64a1b2c3d4e5f6789012340",
      "first_Name": "John",
      "last_Name": "Doe",
      "employee_Id": "EMP001",
      "email": "john.doe@company.com"
    },
    "leaveType": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "Sick Leave",
      "category": "paid",
      "color": "bg-red-500"
    },
    "leave_From": "2024-02-15T00:00:00.000Z",
    "leave_To": "2024-02-17T00:00:00.000Z",
    "no_Of_Days": 3,
    "reason_For_Leave": "Family emergency requiring immediate attention",
    "leave_Status": "approved",
    "approved_By": {
      "_id": "64a1b2c3d4e5f6789012341",
      "first_Name": "Jane",
      "last_Name": "Smith"
    },
    "is_Paid": true,
    "paidDays": 3,
    "unpaidDays": 0,
    "createdAt": "2024-02-10T10:30:00.000Z",
    "updatedAt": "2024-02-10T11:00:00.000Z"
  }
]
```

**Error Responses**:

*400 Bad Request - Invalid status*:
```json
{
  "message": "Invalid status provided."
}
```

*401 Unauthorized*:
```json
{
  "message": "Unauthorized. Please log in."
}
```

*404 Not Found - Employee not found*:
```json
{
  "message": "Employee not found."
}
```

**Business Rules**:
- Returns leaves only for the authenticated employee
- Results sorted by creation date (newest first)
- Includes populated employee, leave type, and approver information
- Supports filtering by leave status

### Get Assigned Leave Requests

Retrieves leave requests assigned to the authenticated manager for approval.

**Endpoint**: `GET /v1/leaves/assigned`

**Authentication**: Required (JWT)

**Permissions**: `leave-manage-subordinate`

**Query Parameters**:
- `status` (string, optional): Filter by status (`pending`, `approved`, `rejected`)

**Success Response** (200):
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012350",
    "employee": {
      "_id": "64a1b2c3d4e5f6789012340",
      "first_Name": "John",
      "last_Name": "Doe",
      "employee_Id": "EMP001",
      "email": "john.doe@company.com",
      "assigned_to": [
        {
          "_id": "64a1b2c3d4e5f6789012341",
          "first_Name": "Jane",
          "last_Name": "Smith"
        }
      ]
    },
    "leaveType": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "Annual Leave",
      "category": "paid",
      "color": "bg-blue-500"
    },
    "leave_From": "2024-02-20T00:00:00.000Z",
    "leave_To": "2024-02-22T00:00:00.000Z",
    "no_Of_Days": 3,
    "reason_For_Leave": "Vacation with family",
    "leave_Status": "pending",
    "workHandover": "All tasks assigned to backup team members",
    "emergencyContact": "+91-9876543210",
    "createdAt": "2024-02-15T09:00:00.000Z"
  }
]
```

**Business Rules**:
- Returns leaves where the current user is the designated approver
- For pending leaves, checks if user is the current approver in the workflow
- For approved/rejected leaves, checks if user was the one who approved/rejected
- Includes all subordinates in the hierarchy using graph lookup
- Results sorted by creation date (newest first)

### Get Leave Balance

Retrieves current month's leave balance for a specific leave type.

**Endpoint**: `GET /v1/leaves/leaveBalance`

**Authentication**: Required (JWT)

**Query Parameters**:
- `leaveTypeId` (string, required): MongoDB ObjectId of the leave type

**Success Response** (200):
```json
{
  "success": true,
  "message": "Leave availability fetched successfully",
  "data": {
    "month": "2024-02",
    "monthlyQuota": 3,
    "carryForward": 2,
    "used": 1,
    "future": 0,
    "remainingQuota": 2,
    "totalAvailable": 4
  }
}
```

**Error Responses**:

*400 Bad Request - Missing leave type ID*:
```json
{
  "success": false,
  "message": "Missing leaveTypeId in query params"
}
```

*404 Not Found - Leave ledger not found*:
```json
{
  "success": false,
  "message": "Leave ledger not found."
}
```

*404 Not Found - No balance found*:
```json
{
  "success": false,
  "message": "No leave balance found for this leave type"
}
```

**Business Rules**:
- Calculates balance for the current month
- Includes carry-forward from previous months if applicable
- Accounts for used leaves and future requests
- `totalAvailable` = `monthlyQuota` + `carryForward` - `used` - `future`
- `remainingQuota` = `monthlyQuota` - `used` - `future`
- Carry-forward is applied only if the month has reached

### Get All Approved Leaves

Retrieves all approved leave requests with pagination.

**Endpoint**: `GET /v1/leaves/approved`

**Authentication**: Required (JWT)

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20)

**Success Response** (200):
```json
{
  "success": true,
  "page": 1,
  "totalPages": 5,
  "totalApprovedLeaves": 95,
  "leave": [
    {
      "_id": "64a1b2c3d4e5f6789012350",
      "employee": {
        "_id": "64a1b2c3d4e5f6789012340",
        "first_Name": "John",
        "last_Name": "Doe",
        "employee_Id": "EMP001",
        "working_Email_Id": "john.doe@company.com"
      },
      "leave_From": "2024-02-15T00:00:00.000Z",
      "leave_To": "2024-02-17T00:00:00.000Z",
      "no_Of_Days": 3,
      "leave_Status": "approved",
      "approved_By": {
        "_id": "64a1b2c3d4e5f6789012341",
        "first_Name": "Jane",
        "last_Name": "Smith"
      },
      "approvedAt": "2024-02-10T11:00:00.000Z"
    }
  ]
}
```

**Business Rules**:
- Returns only approved leaves
- Sorted by approval date (newest first)
- Includes pagination information
- Contains populated employee and approver information

### Get Subordinates' Leaves

Retrieves leave requests for all subordinates of the authenticated manager.

**Endpoint**: `GET /v1/leaves/subordinates`

**Authentication**: Required (JWT)

**Permissions**: `leave-manage-subordinate`

**Query Parameters**:
- `status` (string, optional): Filter by status (`pending`, `approved`, `rejected`)

**Success Response** (200):
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012350",
    "employee": {
      "_id": "64a1b2c3d4e5f6789012340",
      "first_Name": "John",
      "last_Name": "Doe",
      "employee_Id": "EMP001",
      "email": "john.doe@company.com"
    },
    "leave_From": "2024-02-20T00:00:00.000Z",
    "leave_To": "2024-02-22T00:00:00.000Z",
    "no_Of_Days": 3,
    "leave_Status": "pending",
    "reason_For_Leave": "Personal work",
    "createdAt": "2024-02-15T09:00:00.000Z"
  }
]
```

**Business Rules**:
- Uses graph lookup to find all subordinates recursively
- Returns empty array if no subordinates found
- Includes all leave statuses if no status filter provided
- Results sorted by creation date (newest first)

### Get Monthly Leave Summary

Retrieves paid/unpaid leave summary for subordinates for a specific month.

**Endpoint**: `GET /v1/leaves/monthly-summary`

**Authentication**: Required (JWT)

**Query Parameters**:
- `month` (string, required): Month in YYYY-MM format

**Success Response** (200):
```json
{
  "success": true,
  "message": "Leave summary for subordinates in 2024-02",
  "data": [
    {
      "employeeId": "64a1b2c3d4e5f6789012340",
      "employee_Id": "EMP001",
      "name": "John Doe",
      "paid": 5,
      "unpaid": 2
    },
    {
      "employeeId": "64a1b2c3d4e5f6789012341",
      "employee_Id": "EMP002",
      "name": "Jane Smith",
      "paid": 3,
      "unpaid": 0
    }
  ]
}
```

**Error Responses**:

*400 Bad Request - Invalid month format*:
```json
{
  "message": "Invalid or missing month. Use YYYY-MM format."
}
```

*404 Not Found - No subordinates*:
```json
{
  "success": false,
  "message": "No subordinates found."
}
```

**Business Rules**:
- Calculates leave days for approved leaves only
- Includes leaves that overlap with the specified month
- Separates paid and unpaid leave counts
- Returns data for all subordinates in the hierarchy

### Get Leave Statistics

Retrieves comprehensive leave statistics for the authenticated user.

**Endpoint**: `GET /v1/leaves/leavestats`

**Authentication**: Required (JWT)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Leave stats retrieved successfully",
  "data": {
    "remainingPaidLeaves": 15,
    "totalLeavesTaken": 8,
    "totalApprovedLeaveDays": 6
  }
}
```

**Error Responses**:

*404 Not Found - Ledger not found*:
```json
{
  "success": false,
  "message": "Leave ledger not found for user."
}
```

**Business Rules**:
- Calculates remaining paid leaves across all leave types
- Includes carry-forward balances where applicable
- Accounts for future requests in availability calculation
- Provides total leaves taken and approved leave days

### Get Subordinate Leave Statistics

Retrieves leave statistics for all subordinates of the authenticated manager.

**Endpoint**: `GET /v1/leaves/subordinate-stats`

**Authentication**: Required (JWT)

**Permissions**: `leave-manage-subordinate`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Subordinate leave stats fetched successfully",
  "data": {
    "pendingRequests": 5,
    "approvedThisMonth": 12,
    "rejectedThisMonth": 2
  }
}
```

**Business Rules**:
- Includes all subordinates in the hierarchy
- Counts pending requests across all subordinates
- Calculates monthly approved and rejected counts
- Uses current month boundaries for monthly statistics

### Get All Leave Counts

Retrieves global leave counts and statistics.

**Endpoint**: `GET /v1/leaves/leave-count`

**Authentication**: Required (JWT)

**Success Response** (200):
```json
{
  "pendingCount": 25,
  "approvedThisMonth": 45,
  "rejectedThisMonth": 8,
  "pendingLast30Days": 30,
  "approvedLast30Days": 50,
  "rejectedLast30Days": 10
}
```

**Business Rules**:
- Provides organization-wide leave statistics
- Includes both current month and last 30 days metrics
- Useful for executive dashboards and reporting

## Leave Type Management API

### Create Leave Type

Creates a new leave type in the system.

**Endpoint**: `POST /v1/leaves-types/create-leave-type`

**Authentication**: Required (JWT)

**Permissions**: `leave-admin`

**Request Body**:
```json
{
  "name": "Paternity Leave",
  "description": "Leave for new fathers to care for newborn",
  "category": "paid",
  "maxDays": 15,
  "isCarryForward": false,
  "documentsRequired": "Birth certificate and hospital discharge summary",
  "advanceNotice": "At least 30 days prior to expected due date",
  "eligibility": "Male employees with newborn children",
  "policies": [
    "Must be taken within 6 months of child's birth",
    "Can be taken in blocks of minimum 3 days",
    "Non-transferable to other employees"
  ],
  "color": "bg-green-500",
  "isActive": true,
  "organization": "tech-company"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Leave type created successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012355",
    "name": "Paternity Leave",
    "description": "Leave for new fathers to care for newborn",
    "category": "paid",
    "maxDays": 15,
    "isCarryForward": false,
    "carryForwardDays": 0,
    "documentsRequired": "Birth certificate and hospital discharge summary",
    "advanceNotice": "At least 30 days prior to expected due date",
    "eligibility": "Male employees with newborn children",
    "policies": [
      "Must be taken within 6 months of child's birth",
      "Can be taken in blocks of minimum 3 days",
      "Non-transferable to other employees"
    ],
    "color": "bg-green-500",
    "isActive": true,
    "organization": "tech-company",
    "createdBy": "64a1b2c3d4e5f6789012341",
    "createdAt": "2024-02-10T10:30:00.000Z",
    "updatedAt": "2024-02-10T10:30:00.000Z"
  }
}
```

**Error Responses**:

*400 Bad Request - Missing required fields*:
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

*400 Bad Request - Missing policies*:
```json
{
  "success": false,
  "message": "At least one policy is required"
}
```

*409 Conflict - Duplicate name*:
```json
{
  "success": false,
  "message": "Leave type with this name already exists"
}
```

*400 Bad Request - Validation failed*:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "maxDays",
      "message": "Maximum days must be a positive number"
    }
  ]
}
```

**Business Rules**:
- Leave type name must be unique within the organization
- At least one policy is required
- `maxDays` must be a positive number
- If `isCarryForward` is true, integrates with company settings for carry-forward rules
- Automatically sets `createdBy` to the authenticated user

### Get All Leave Types

Retrieves all leave types with optional filtering.

**Endpoint**: `GET /v1/leaves-types/leave-type`

**Authentication**: Required (JWT)

**Query Parameters**:
- `active` (boolean, optional): Filter by active status
- `category` (string, optional): Filter by category (`paid`, `unpaid`, `mixed`)
- `organization` (string, optional): Filter by organization

**Success Response** (200):
```json
{
  "success": true,
  "message": "Leave types retrieved successfully",
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012355",
      "name": "Annual Leave",
      "description": "Yearly vacation leave for employees",
      "category": "paid",
      "maxDays": 30,
      "isCarryForward": true,
      "carryForwardDays": "Jan-01",
      "documentsRequired": "Not Required",
      "advanceNotice": "At least 7 days in advance",
      "eligibility": "All permanent employees",
      "policies": [
        "Can be taken in blocks of minimum 2 days",
        "Maximum 10 days can be carried forward to next year"
      ],
      "color": "bg-blue-500",
      "isActive": true,
      "organization": "tech-company",
      "createdBy": {
        "_id": "64a1b2c3d4e5f6789012341",
        "first_Name": "Admin",
        "last_Name": "User",
        "employee_Id": "ADMIN001"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Business Rules**:
- Returns leave types sorted by name
- Includes populated creator and updater information
- Supports multiple filtering options
- Can be filtered by active status, category, and organization

### Get Leave Type by ID

Retrieves a specific leave type by its ID.

**Endpoint**: `GET /v1/leaves-types/leave-type/:id`

**Authentication**: Required (JWT)

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the leave type

**Success Response** (200):
```json
{
  "success": true,
  "message": "Leave type retrieved successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012355",
    "name": "Sick Leave",
    "description": "Medical leave for illness or injury",
    "category": "paid",
    "maxDays": 12,
    "isCarryForward": false,
    "documentsRequired": "Medical certificate for leaves exceeding 3 days",
    "advanceNotice": "Immediate notification, medical certificate within 48 hours",
    "eligibility": "All employees",
    "policies": [
      "Medical certificate required for leaves exceeding 3 days",
      "Can be taken for mental health with proper documentation"
    ],
    "color": "bg-red-500",
    "isActive": true,
    "createdBy": {
      "_id": "64a1b2c3d4e5f6789012341",
      "first_Name": "Admin",
      "last_Name": "User",
      "employee_Id": "ADMIN001"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses**:

*400 Bad Request - Invalid ID format*:
```json
{
  "success": false,
  "message": "Invalid leave type ID format"
}
```

*404 Not Found*:
```json
{
  "success": false,
  "message": "Leave type not found"
}
```

### Get Assigned Leave Types

Retrieves leave types assigned to a specific employee.

**Endpoint**: `GET /v1/leaves-types/assigned-leave-type/:employee_Id`

**Authentication**: Required (JWT)

**Path Parameters**:
- `employee_Id` (string): Employee ID

**Success Response** (200):
```json
{
  "success": true,
  "message": "Assigned leave types retrieved successfully",
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012355",
      "name": "Annual Leave",
      "description": "Yearly vacation leave for employees",
      "category": "paid",
      "maxDays": 30,
      "color": "bg-blue-500",
      "isActive": true
    },
    {
      "_id": "64a1b2c3d4e5f6789012356",
      "name": "Sick Leave",
      "description": "Medical leave for illness or injury",
      "category": "paid",
      "maxDays": 12,
      "color": "bg-red-500",
      "isActive": true
    }
  ],
  "count": 2
}
```

**Error Responses**:

*400 Bad Request - Missing employee ID*:
```json
{
  "success": false,
  "message": "Employee ID is required"
}
```

*404 Not Found - User not found*:
```json
{
  "success": false,
  "message": "User not found"
}
```

*200 OK - No assignments*:
```json
{
  "success": true,
  "message": "No leave types assigned to this user",
  "data": [],
  "count": 0
}
```

**Business Rules**:
- Looks up user by employee_Id
- Returns leave types from user's `assigned_leaves` array
- Returns empty array if no leave types assigned

### Update Leave Type

Updates an existing leave type.

**Endpoint**: `PUT /v1/leaves-types/update/:id`

**Authentication**: Required (JWT)

**Permissions**: `leave-admin`

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the leave type

**Request Body**:
```json
{
  "name": "Annual Leave (Updated)",
  "description": "Updated yearly vacation leave for employees",
  "maxDays": 35,
  "policies": [
    "Can be taken in blocks of minimum 2 days",
    "Maximum 15 days can be carried forward to next year",
    "Must be approved by direct manager"
  ],
  "isActive": true
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Leave type updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012355",
    "name": "Annual Leave (Updated)",
    "description": "Updated yearly vacation leave for employees",
    "category": "paid",
    "maxDays": 35,
    "policies": [
      "Can be taken in blocks of minimum 2 days",
      "Maximum 15 days can be carried forward to next year",
      "Must be approved by direct manager"
    ],
    "isActive": true,
    "updatedBy": {
      "_id": "64a1b2c3d4e5f6789012341",
      "first_Name": "Admin",
      "last_Name": "User",
      "employee_Id": "ADMIN001"
    },
    "updatedAt": "2024-02-10T12:00:00.000Z"
  }
}
```

**Error Responses**:

*404 Not Found*:
```json
{
  "success": false,
  "message": "Leave type not found"
}
```

*409 Conflict - Name already exists*:
```json
{
  "success": false,
  "message": "Leave type with this name already exists"
}
```

*400 Bad Request - Invalid policies*:
```json
{
  "success": false,
  "message": "At least one policy is required"
}
```

**Business Rules**:
- Only updates provided fields
- Validates name uniqueness if name is being updated
- Requires at least one policy if policies are being updated
- Automatically sets `updatedBy` to the authenticated user
- Supports carry-forward configuration updates

### Toggle Active Status

Toggles the active status of a leave type.

**Endpoint**: `PATCH /v1/leaves-types/leave-status/:id`

**Authentication**: Required (JWT)

**Permissions**: `leave-admin`

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the leave type

**Success Response** (200):
```json
{
  "success": true,
  "message": "Leave type deactivated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012355",
    "name": "Annual Leave",
    "isActive": false,
    "updatedBy": "64a1b2c3d4e5f6789012341",
    "updatedAt": "2024-02-10T12:00:00.000Z"
  }
}
```

**Error Responses**:

*404 Not Found*:
```json
{
  "success": false,
  "message": "Leave type not found"
}
```

**Business Rules**:
- Toggles between active and inactive status
- Automatically sets `updatedBy` to the authenticated user
- Deactivated leave types cannot be used for new applications

### Delete Leave Type

Permanently deletes a leave type from the system.

**Endpoint**: `DELETE /v1/leaves-types/delete`

**Authentication**: Required (JWT)

**Permissions**: `leave-admin`

**Request Body**:
```json
{
  "id": "64a1b2c3d4e5f6789012355"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Leave type deleted successfully"
}
```

**Error Responses**:

*404 Not Found*:
```json
{
  "success": false,
  "message": "Leave type not found"
}
```

**Business Rules**:
- Permanently removes the leave type from the system
- Consider impact on existing leave applications before deletion
- Recommended to deactivate instead of delete for historical data integrity

### Get Active Leave Types

Retrieves all active leave types.

**Endpoint**: `GET /v1/leaves-types/active`

**Authentication**: Required (JWT)

**Query Parameters**:
- `organization` (string, optional): Filter by organization

**Success Response** (200):
```json
{
  "success": true,
  "message": "Active leave types retrieved successfully",
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012355",
      "name": "Annual Leave",
      "description": "Yearly vacation leave for employees",
      "category": "paid",
      "maxDays": 30,
      "color": "bg-blue-500"
    },
    {
      "_id": "64a1b2c3d4e5f6789012356",
      "name": "Sick Leave",
      "description": "Medical leave for illness or injury",
      "category": "paid",
      "maxDays": 12,
      "color": "bg-red-500"
    }
  ],
  "count": 2
}
```

**Business Rules**:
- Returns only active leave types
- Includes essential fields for UI display
- Sorted by name for consistent ordering

### Get Leave Types by Category

Retrieves leave types filtered by category.

**Endpoint**: `GET /v1/leaves-types/category/:category`

**Authentication**: Required (JWT)

**Path Parameters**:
- `category` (string): Leave category (`paid`, `unpaid`, `mixed`)

**Query Parameters**:
- `organization` (string, optional): Filter by organization

**Success Response** (200):
```json
{
  "success": true,
  "message": "Leave types in paid category retrieved successfully",
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012355",
      "name": "Annual Leave",
      "description": "Yearly vacation leave for employees",
      "category": "paid",
      "maxDays": 30,
      "color": "bg-blue-500",
      "isActive": true
    }
  ],
  "count": 1
}
```

**Error Responses**:

*400 Bad Request - Invalid category*:
```json
{
  "success": false,
  "message": "Invalid category. Must be paid, unpaid, or mixed"
}
```

**Business Rules**:
- Validates category against allowed values
- Returns only active leave types
- Sorted by name

### Get Leave Type Statistics

Retrieves statistical information about leave types.

**Endpoint**: `GET /v1/leaves-types/stat`

**Authentication**: Required (JWT)

**Query Parameters**:
- `organization` (string, optional): Filter by organization

**Success Response** (200):
```json
{
  "success": true,
  "message": "Leave type statistics retrieved successfully",
  "data": {
    "total": 8,
    "active": 6,
    "inactive": 2,
    "paid": 5,
    "unpaid": 2,
    "mixed": 1
  }
}
```

**Business Rules**:
- Provides aggregate statistics for leave types
- Includes breakdown by status and category
- Useful for administrative dashboards

## Frontend Integration

### JavaScript SDK

```javascript
class LeaveManagementAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        ...options.headers
      },
      ...options
    };

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('Leave API Error:', error);
      throw error;
    }
  }

  // Leave Application
  async applyLeave(leaveData, documents = []) {
    const formData = new FormData();
    
    Object.keys(leaveData).forEach(key => {
      if (leaveData[key] !== null && leaveData[key] !== undefined) {
        formData.append(key, leaveData[key]);
      }
    });

    documents.forEach(file => {
      formData.append('documents', file);
    });

    return this.request('/v1/leaves/apply', {
      method: 'POST',
      body: formData
    });
  }

  // Leave Management
  async getEmployeeLeaves(status = 'all') {
    const params = status !== 'all' ? `?status=${status}` : '';
    return this.request(`/v1/leaves/employee${params}`);
  }

  async getAssignedLeaves(status) {
    const params = status ? `?status=${status}` : '';
    return this.request(`/v1/leaves/assigned${params}`);
  }

  async handleLeaveRequest(leaveId, action, rejectionReason = null) {
    const body = { action };
    if (action === 'rejected' && rejectionReason) {
      body.reason_For_Reject = rejectionReason;
    }

    return this.request(`/v1/leaves/handle-leave/${leaveId}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  async getLeaveBalance(leaveTypeId) {
    return this.request(`/v1/leaves/leaveBalance?leaveTypeId=${leaveTypeId}`);
  }

  async getSubordinateLeaves(status) {
    const params = status ? `?status=${status}` : '';
    return this.request(`/v1/leaves/subordinates${params}`);
  }

  async getMonthlyLeaveSummary(month) {
    return this.request(`/v1/leaves/monthly-summary?month=${month}`);
  }

  // Leave Statistics
  async getLeaveStats() {
    return this.request('/v1/leaves/leavestats');
  }

  async getSubordinateLeaveStats() {
    return this.request('/v1/leaves/subordinate-stats');
  }

  async getAllLeaveCount() {
    return this.request('/v1/leaves/leave-count');
  }

  // Leave Types Management
  async createLeaveType(leaveTypeData) {
    return this.request('/v1/leaves-types/create-leave-type', {
      method: 'POST',
      body: JSON.stringify(leaveTypeData)
    });
  }

  async getAllLeaveTypes(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params.append(key, filters[key]);
      }
    });
    const queryString = params.toString();
    return this.request(`/v1/leaves-types/leave-type${queryString ? '?' + queryString : ''}`);
  }

  async getLeaveTypeById(id) {
    return this.request(`/v1/leaves-types/leave-type/${id}`);
  }

  async updateLeaveType(id, updateData) {
    return this.request(`/v1/leaves-types/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async toggleLeaveTypeStatus(id) {
    return this.request(`/v1/leaves-types/leave-status/${id}`, {
      method: 'PATCH'
    });
  }

  async deleteLeaveType(id) {
    return this.request('/v1/leaves-types/delete', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });
  }

  async getActiveLeaveTypes(organization) {
    const params = organization ? `?organization=${organization}` : '';
    return this.request(`/v1/leaves-types/active${params}`);
  }

  async getLeaveTypesByCategory(category, organization) {
    const params = organization ? `?organization=${organization}` : '';
    return this.request(`/v1/leaves-types/category/${category}${params}`);
  }

  async getLeaveTypeStats(organization) {
    const params = organization ? `?organization=${organization}` : '';
    return this.request(`/v1/leaves-types/stat${params}`);
  }

  // Helper Methods
  formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
  }

  calculateLeaveDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }

  validateLeaveApplication(leaveData) {
    const errors = [];
    
    if (!leaveData.leaveType) errors.push('Leave type is required');
    if (!leaveData.leave_From) errors.push('Start date is required');
    if (!leaveData.leave_To) errors.push('End date is required');
    if (!leaveData.reason_For_Leave) errors.push('Reason is required');
    
    if (leaveData.leave_From && leaveData.leave_To) {
      const startDate = new Date(leaveData.leave_From);
      const endDate = new Date(leaveData.leave_To);
      if (startDate > endDate) {
        errors.push('Start date must be before end date');
      }
    }
    
    return errors;
  }
}

// Usage Example
const api = new LeaveManagementAPI('https://your-api-domain.com/api', 'your-jwt-token');

// Apply for leave
const leaveApplication = {
  leaveType: '64a1b2c3d4e5f6789012345',
  leave_From: '2024-02-20',
  leave_To: '2024-02-22',
  no_Of_Days: 3,
  reason_For_Leave: 'Family vacation',
  emergencyContact: '+91-9876543210',
  workHandover: 'All tasks assigned to backup team',
  isHalfDay: false
};

try {
  const result = await api.applyLeave(leaveApplication);
  console.log('Leave applied successfully:', result.leave);
} catch (error) {
  console.error('Failed to apply leave:', error.message);
}

// Get leave balance
try {
  const balance = await api.getLeaveBalance('64a1b2c3d4e5f6789012345');
  console.log('Available leave days:', balance.data.totalAvailable);
} catch (error) {
  console.error('Failed to get leave balance:', error.message);
}

// Handle leave request (for managers)
try {
  await api.handleLeaveRequest('64a1b2c3d4e5f6789012350', 'approved');
  console.log('Leave request approved successfully');
} catch (error) {
  console.error('Failed to handle leave request:', error.message);
}
```

### React Component Examples

```javascript
import React, { useState, useEffect } from 'react';

const LeaveApplicationForm = ({ onSubmit, leaveTypes = [] }) => {
  const [formData, setFormData] = useState({
    leaveType: '',
    leave_From: '',
    leave_To: '',
    no_Of_Days: 0,
    reason_For_Leave: '',
    emergencyContact: '',
    workHandover: '',
    isHalfDay: false,
    halfDayPeriod: 'morning',
    halfDayPosition: 'first_half'
  });

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const api = new LeaveManagementAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    if (formData.leave_From && formData.leave_To) {
      const days = api.calculateLeaveDays(formData.leave_From, formData.leave_To);
      setFormData(prev => ({
        ...prev,
        no_Of_Days: formData.isHalfDay ? 0.5 : days
      }));
    }
  }, [formData.leave_From, formData.leave_To, formData.isHalfDay]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setDocuments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    // Validate form
    const validationErrors = api.validateLeaveApplication(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const result = await api.applyLeave(formData, documents);
      onSubmit(result);
      // Reset form
      setFormData({
        leaveType: '',
        leave_From: '',
        leave_To: '',
        no_Of_Days: 0,
        reason_For_Leave: '',
        emergencyContact: '',
        workHandover: '',
        isHalfDay: false,
        halfDayPeriod: 'morning',
        halfDayPosition: 'first_half'
      });
      setDocuments([]);
    } catch (error) {
      setErrors([error.message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="leave-application-form">
      <h2>Apply for Leave</h2>
      
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <p key={index} className="error">{error}</p>
          ))}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="leaveType">Leave Type *</label>
        <select
          id="leaveType"
          name="leaveType"
          value={formData.leaveType}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Leave Type</option>
          {leaveTypes.map(type => (
            <option key={type._id} value={type._id}>
              {type.name} (Max: {type.maxDays} days)
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="leave_From">From Date *</label>
          <input
            type="date"
            id="leave_From"
            name="leave_From"
            value={formData.leave_From}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="leave_To">To Date *</label>
          <input
            type="date"
            id="leave_To"
            name="leave_To"
            value={formData.leave_To}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="isHalfDay"
            checked={formData.isHalfDay}
            onChange={handleInputChange}
          />
          Half Day Leave
        </label>
      </div>

      {formData.isHalfDay && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="halfDayPeriod">Half Day Period</label>
            <select
              id="halfDayPeriod"
              name="halfDayPeriod"
              value={formData.halfDayPeriod}
              onChange={handleInputChange}
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="halfDayPosition">Half Day Position</label>
            <select
              id="halfDayPosition"
              name="halfDayPosition"
              value={formData.halfDayPosition}
              onChange={handleInputChange}
            >
              <option value="first_half">First Half</option>
              <option value="second_half">Second Half</option>
            </select>
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="no_Of_Days">Number of Days</label>
        <input
          type="number"
          id="no_Of_Days"
          name="no_Of_Days"
          value={formData.no_Of_Days}
          step="0.5"
          readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="reason_For_Leave">Reason for Leave *</label>
        <textarea
          id="reason_For_Leave"
          name="reason_For_Leave"
          value={formData.reason_For_Leave}
          onChange={handleInputChange}
          placeholder="Please provide detailed reason for leave application"
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="emergencyContact">Emergency Contact</label>
        <input
          type="tel"
          id="emergencyContact"
          name="emergencyContact"
          value={formData.emergencyContact}
          onChange={handleInputChange}
          placeholder="+91-9876543210"
        />
      </div>

      <div className="form-group">
        <label htmlFor="workHandover">Work Handover Details</label>
        <textarea
          id="workHandover"
          name="workHandover"
          value={formData.workHandover}
          onChange={handleInputChange}
          placeholder="Please describe how your work will be handled during your absence"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="documents">Supporting Documents</label>
        <input
          type="file"
          id="documents"
          onChange={handleFileChange}
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <small>Upload supporting documents (PDF, DOC, DOCX, JPG, PNG)</small>
      </div>

      <button type="submit" disabled={loading} className="submit-button">
        {loading ? 'Submitting...' : 'Apply for Leave'}
      </button>
    </form>
  );
};

const LeaveApprovalCard = ({ leave, onApprove, onReject }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await onApprove(leave._id);
    } catch (error) {
      console.error('Failed to approve leave:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);
    try {
      await onReject(leave._id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject leave:', error);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="leave-approval-card">
      <div className="card-header">
        <div className="employee-info">
          <h3>{leave.employee.first_Name} {leave.employee.last_Name}</h3>
          <span className="employee-id">{leave.employee.employee_Id}</span>
        </div>
        <div className="leave-type">
          <span className={`leave-badge ${leave.leaveType.color}`}>
            {leave.leaveType.name}
          </span>
        </div>
      </div>

      <div className="card-body">
        <div className="leave-details">
          <div className="detail-item">
            <label>Duration:</label>
            <span>{formatDate(leave.leave_From)} to {formatDate(leave.leave_To)}</span>
          </div>
          <div className="detail-item">
            <label>Days:</label>
            <span>{leave.no_Of_Days} days</span>
          </div>
          <div className="detail-item">
            <label>Type:</label>
            <span>{leave.is_Half_Day ? 'Half Day' : 'Full Day'}</span>
          </div>
          <div className="detail-item">
            <label>Reason:</label>
            <p>{leave.reason_For_Leave}</p>
          </div>
          {leave.workHandover && (
            <div className="detail-item">
              <label>Work Handover:</label>
              <p>{leave.workHandover}</p>
            </div>
          )}
          {leave.emergencyContact && (
            <div className="detail-item">
              <label>Emergency Contact:</label>
              <span>{leave.emergencyContact}</span>
            </div>
          )}
        </div>

        {leave.leave_document && (
          <div className="document-section">
            <label>Supporting Document:</label>
            <a 
              href={leave.leave_document} 
              target="_blank" 
              rel="noopener noreferrer"
              className="document-link"
            >
              View Document
            </a>
          </div>
        )}
      </div>

      {leave.leave_Status === 'pending' && (
        <div className="card-actions">
          <button 
            onClick={handleApprove}
            disabled={processing}
            className="approve-button"
          >
            {processing ? 'Processing...' : 'Approve'}
          </button>
          <button 
            onClick={() => setShowRejectModal(true)}
            disabled={processing}
            className="reject-button"
          >
            Reject
          </button>
        </div>
      )}

      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reject Leave Request</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide reason for rejection"
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={handleReject} disabled={processing}>
                {processing ? 'Processing...' : 'Confirm Rejection'}
              </button>
              <button onClick={() => setShowRejectModal(false)} disabled={processing}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LeaveBalanceWidget = ({ leaveTypeId }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = new LeaveManagementAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    if (leaveTypeId) {
      fetchBalance();
    }
  }, [leaveTypeId]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await api.getLeaveBalance(leaveTypeId);
      setBalance(response.data);
    } catch (error) {
      console.error('Failed to fetch leave balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="balance-widget loading">Loading...</div>;

  if (!balance) return <div className="balance-widget error">Failed to load balance</div>;

  return (
    <div className="leave-balance-widget">
      <h4>Leave Balance - {balance.month}</h4>
      
      <div className="balance-grid">
        <div className="balance-item">
          <label>Monthly Quota:</label>
          <span>{balance.monthlyQuota}</span>
        </div>
        <div className="balance-item">
          <label>Carry Forward:</label>
          <span>{balance.carryForward}</span>
        </div>
        <div className="balance-item">
          <label>Used:</label>
          <span>{balance.used}</span>
        </div>
        <div className="balance-item">
          <label>Future Requests:</label>
          <span>{balance.future}</span>
        </div>
        <div className="balance-item total">
          <label>Total Available:</label>
          <span>{balance.totalAvailable}</span>
        </div>
      </div>
    </div>
  );
};

export { LeaveApplicationForm, LeaveApprovalCard, LeaveBalanceWidget };
```

## Testing Guide

### Using cURL

#### Authentication Setup
```bash
# Get JWT token (replace with actual auth endpoint)
curl -X POST https://your-api-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Set token variable
export JWT_TOKEN="your-jwt-token-here"
```

#### Leave Application Tests

**Apply for Leave**:
```bash
curl -X POST https://your-api-domain.com/api/v1/leaves/apply \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -F "leaveType=64a1b2c3d4e5f6789012345" \
  -F "leave_From=2024-02-20" \
  -F "leave_To=2024-02-22" \
  -F "no_Of_Days=3" \
  -F "reason_For_Leave=Family vacation" \
  -F "emergencyContact=+91-9876543210" \
  -F "workHandover=Tasks assigned to backup team" \
  -F "isHalfDay=false"
```

**Apply for Leave with Document**:
```bash
curl -X POST https://your-api-domain.com/api/v1/leaves/apply \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -F "leaveType=64a1b2c3d4e5f6789012345" \
  -F "leave_From=2024-02-20" \
  -F "leave_To=2024-02-22" \
  -F "no_Of_Days=3" \
  -F "reason_For_Leave=Medical emergency" \
  -F "documents=@medical_certificate.pdf"
```

**Approve Leave Request**:
```bash
curl -X PUT https://your-api-domain.com/api/v1/leaves/handle-leave/64a1b2c3d4e5f6789012350 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "approved"}'
```

**Reject Leave Request**:
```bash
curl -X PUT https://your-api-domain.com/api/v1/leaves/handle-leave/64a1b2c3d4e5f6789012350 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "rejected",
    "reason_For_Reject": "Insufficient advance notice provided"
  }'
```

#### Leave Information Tests

**Get Employee Leaves**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/leaves/employee?status=pending" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Leave Balance**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/leaves/leaveBalance?leaveTypeId=64a1b2c3d4e5f6789012345" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Assigned Leaves**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/leaves/assigned?status=pending" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Monthly Summary**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/leaves/monthly-summary?month=2024-02" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

#### Leave Type Management Tests

**Create Leave Type**:
```bash
curl -X POST https://your-api-domain.com/api/v1/leaves-types/create-leave-type \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paternity Leave",
    "description": "Leave for new fathers",
    "category": "paid",
    "maxDays": 15,
    "isCarryForward": false,
    "documentsRequired": "Birth certificate required",
    "advanceNotice": "At least 30 days notice",
    "eligibility": "Male employees with newborn children",
    "policies": ["Must be taken within 6 months of birth"],
    "color": "bg-green-500",
    "isActive": true
  }'
```

**Get All Leave Types**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/leaves-types/leave-type?active=true&category=paid" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Update Leave Type**:
```bash
curl -X PUT https://your-api-domain.com/api/v1/leaves-types/update/64a1b2c3d4e5f6789012355 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "maxDays": 20,
    "policies": ["Updated policy text"]
  }'
```

### Testing Scenarios

#### Leave Application Workflow
1. **Apply for Leave**: Test leave application with various scenarios
2. **Manager Approval**: Test approval by assigned manager
3. **Balance Update**: Verify leave balance updates correctly
4. **Attendance Integration**: Check attendance records creation
5. **Notification System**: Verify notifications are sent

#### Leave Balance Management
1. **Monthly Quota**: Test monthly quota calculations
2. **Carry Forward**: Test carry-forward functionality
3. **Future Requests**: Test future request allocations
4. **Balance Validation**: Test balance validation during application

#### Permission Testing
1. **Employee Permissions**: Test employee-level operations
2. **Manager Permissions**: Test manager approval capabilities
3. **Admin Permissions**: Test leave type management
4. **Subordinate Access**: Test subordinate leave visibility

#### Error Handling
1. **Overlapping Leave**: Test overlapping leave detection
2. **Insufficient Balance**: Test insufficient balance handling
3. **Invalid Approvers**: Test approver validation
4. **Document Upload**: Test document upload failures

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details (optional)",
  "errors": [] // Validation errors array (optional)
}
```

### HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data, validation errors, or business rule violations
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (e.g., duplicate leave type name)
- **500 Internal Server Error**: Server error, database issues, or transaction failures

### Common Error Scenarios

#### Authentication Errors
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

#### Permission Errors
```json
{
  "success": false,
  "message": "You do not have permission to manage subordinate leaves"
}
```

#### Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "maxDays",
      "message": "Maximum days must be a positive number"
    }
  ]
}
```

#### Business Rule Violations
```json
{
  "success": false,
  "message": "You already have a leave that overlaps with these dates."
}
```

#### Resource Conflicts
```json
{
  "success": false,
  "message": "Leave type with this name already exists"
}
```

## Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication with expiration
- **Permission Validation**: Role-based access control for different operations
- **Request Validation**: Comprehensive input validation and sanitization

### Data Security
- **Transaction Support**: Database transactions for data consistency
- **File Upload Security**: Secure file handling with Cloudinary integration
- **Access Control**: User-based data access restrictions

### Business Logic Security
- **Approval Workflow**: Secure approval process with proper authorization
- **Balance Validation**: Prevents over-allocation of leave balances
- **Overlap Detection**: Prevents conflicting leave applications

## Performance Optimization

### Database Optimization
- **Indexing**: Proper indexes on employee, date, and status fields
- **Aggregation**: Efficient MongoDB aggregation pipelines for statistics
- **Graph Lookup**: Optimized subordinate hierarchy queries

### Caching Strategy
- **Leave Balance Caching**: Cache frequently accessed balance data
- **Leave Type Caching**: Cache active leave types for quick access
- **Permission Caching**: Cache user permission data

### Transaction Management
- **Atomic Operations**: Use database transactions for critical operations
- **Rollback Support**: Automatic rollback on errors
- **Session Management**: Proper session handling for transactions

## Troubleshooting

### Common Issues

#### 1. Leave Application Failures

**Issue**: Leave application fails with "No eligible approvers"

**Causes**:
- Manager hierarchy not properly configured
- Managers don't have `leave-manage-subordinate` permission
- Circular references in manager assignments

**Solutions**:
- Verify manager hierarchy in user assignments
- Check manager permissions
- Fix circular references in assigned_to fields

#### 2. Leave Balance Calculation Issues

**Issue**: Incorrect leave balance calculations

**Causes**:
- Carry-forward rules not properly applied
- Future requests not accounted for
- Month key calculation errors

**Solutions**:
- Verify carry-forward configuration in company settings
- Check future request allocation logic
- Debug month key generation

#### 3. Document Upload Problems

**Issue**: Document upload fails during leave application

**Causes**:
- Cloudinary configuration issues
- File size limits exceeded
- Invalid file formats

**Solutions**:
- Verify Cloudinary credentials
- Check file size limits
- Validate supported file formats

#### 4. Approval Workflow Issues

**Issue**: Leave requests stuck in pending status

**Causes**:
- Approver not found in hierarchy
- Permission validation failures
- Notification system failures

**Solutions**:
- Verify approver hierarchy
- Check permission assignments
- Debug notification system

#### 5. Leave Type Management Problems

**Issue**: Leave type operations fail

**Causes**:
- Duplicate name conflicts
- Invalid validation rules
- Company settings integration issues

**Solutions**:
- Check name uniqueness constraints
- Verify validation rules
- Debug company settings integration

## Conclusion

The Leave Management API provides a comprehensive solution for organizational leave management with advanced features like hierarchical approval workflows, carry-forward mechanisms, and detailed reporting. The system is designed for scalability and flexibility, supporting complex leave policies and organizational structures.

The API integrates seamlessly with attendance systems, notification services, and file storage, providing a complete leave management ecosystem. The comprehensive testing guide and troubleshooting documentation ensure smooth implementation and operation.

For additional support or feature requests, please contact the development team or refer to the internal documentation system.