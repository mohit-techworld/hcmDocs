---
sidebar_position: 1
---

# Attendance Management

<!-- # Attendance Management API Documentation -->

## Overview

The Attendance Management API provides comprehensive functionality for tracking employee attendance, managing work schedules, monitoring punctuality, and generating detailed attendance reports. This system integrates with payroll calculations, shift management, and employee performance tracking to deliver a complete workforce management solution.

### Key Features

- **Real-time Attendance Tracking**: Punch in/out functionality with location tracking
- **Shift Management**: Flexible shift timings with automated lateness calculations
- **Break Management**: Track break durations with policy enforcement
- **Grace Period System**: Configurable grace periods for late arrivals
- **Missed Punch Requests**: Workflow for handling missed punch-in/out scenarios
- **Department Analytics**: Comprehensive attendance analytics by department
- **Manager Dashboard**: Subordinate attendance monitoring and approval workflows
- **Monthly Summaries**: Detailed monthly attendance reports with payroll integration
- **Absenteeism Analysis**: Trend analysis and reporting for workforce planning

## Base URL

```
https://your-api-domain.com/api
```

## Authentication & Authorization

### Authentication Flow

The API uses JSON Web Tokens (JWT) for authentication with role-based access control for different attendance management functions.

#### Authorization Header Format

```http
Authorization: Bearer <your_jwt_token>
```

### Permission System

The API implements permissions for different attendance management operations:

#### Attendance Permissions
- **attendance-view**: View attendance records
- **attendance-manage**: Manage attendance records
- **attendance-view-subordinate**: View subordinate attendance
- **attendance-approve**: Approve missed punch requests
- **attendance-reports**: Access to attendance reports and analytics

## System Architecture

### Request Flow

```
Client Request → JWT Validation → Permission Check → Controller → Database → Response
```

### Data Models

#### Attendance Model
```javascript
{
  _id: "ObjectId",
  date: "String (YYYY-MM-DD)",
  day: "String", // Day of week
  login: "String", // 12-hour format (e.g., "09:00 AM")
  logout: "String", // 12-hour format (e.g., "06:00 PM")
  shift_Timing: "String", // Reference to shift timing ID
  salary: "Number",
  status: "String", // Present, Leave, Half Day, Absent, Reduced Hours
  minutesLate: "Number", // Minutes late from shift start
  lateCategory: "String", // none, on time, Grace1, Grace2, Late
  employee_Id: "String", // Reference to user
  department: "String",
  attendance_mode: "String", // Mobile, Web, etc.
  punchRecords: ["String"], // Array of all punch times
  breaks: [{
    start: "Date",
    end: "Date",
    duration: "Number", // Minutes
    breakStatus: "String" // Running, Ended
  }],
  createdAt: "Date",
  updatedAt: "Date"
}
```

#### Company Settings Model (Attendance Policies)
```javascript
{
  attendancePolicies: {
    fullDayHours: "Number", // Hours required for full day (default: 9)
    halfDayHours: "Number", // Hours required for half day (default: 5)
    minimumWorkingHours: "Number", // Minimum hours (default: 4.5)
    gracePeriodMinutes: "Number", // Grace period for late arrival (default: 15)
    regularizationCriteria: {
      minHours: "Number", // Minimum hours for regularization
      maxHours: "Number" // Maximum hours for regularization
    },
    calcSalaryBasedOn: "String", // WORKING_DAYS or CALENDAR_DAYS
    regularizationApprovalRequired: "Boolean",
    enableOvertime: "Boolean",
    overtimeEligibilityHours: "Number",
    overtimeRate: "Number",
    maximumLeaveCarryover: "Number",
    autoAbsenceThreshold: "Number",
    enableLateComing: "Boolean",
    lateComingGraceMinutes: "Number",
    lateComingPenaltyType: "String",
    lateComingPenaltyValue: "Number",
    maxMonthlyLatenessAllowed: "Number"
  },
  shiftTimings: [{
    id: "ObjectId",
    name: "String",
    startTime: "String", // 24-hour format (e.g., "09:00")
    endTime: "String" // 24-hour format (e.g., "18:00")
  }]
}
```

#### Payroll Model
```javascript
{
  _id: "ObjectId",
  employeeId: "String",
  firstName: "String",
  lastName: "String",
  department: "String",
  month: "Number", // 1-12
  year: "Number",
  amount: "Number", // Gross salary
  deduction: "Number", // Total deductions
  leaves: "Number",
  halfDays: "Number",
  notEvenHalfDays: "Number",
  totalShifts: "Number",
  remainingPaidLeaves: "Number",
  completedShifts: "Number",
  notLoggedOut: "Number",
  totalLates: "Number",
  regularizations: "Number",
  finalSalary: "Number", // Net salary
  deductionsBreakdown: ["Object"],
  advanceAmount: "Number",
  reimbursementAmount: "Number"
}
```

## Attendance Dashboard API

### Get Overview Statistics

Retrieves key attendance metrics and financial summaries for the current period.

**Endpoint**: `GET /v1/attendance/overview`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "newUsers": 5,
    "totalDeposit": 250000,
    "totalExpense": 15000,
    "totalEarning": 235000
  }
}
```

**Business Rules**:
- `newUsers`: Count of users joined in the last 7 days
- `totalDeposit`: Sum of final salaries for current month
- `totalExpense`: Sum of deductions for current month
- `totalEarning`: Net difference between deposit and expense

### Get Absenteeism Chart

Retrieves monthly absenteeism data by department for chart visualization.

**Endpoint**: `GET /v1/attendance/absenteeism`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "datasets": [
      {
        "label": "Finance",
        "data": [2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 1, 3],
        "backgroundColor": "#FBBF24",
        "stack": "combined"
      },
      {
        "label": "Sales",
        "data": [3, 2, 4, 1, 2, 3, 5, 2, 1, 4, 3, 2],
        "backgroundColor": "#3B82F6",
        "stack": "combined"
      },
      {
        "label": "Marketing",
        "data": [1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 1],
        "backgroundColor": "#A78BFA",
        "stack": "combined"
      },
      {
        "label": "IT",
        "data": [4, 1, 3, 2, 4, 1, 2, 3, 2, 1, 4, 3],
        "backgroundColor": "#14B8A6",
        "stack": "combined"
      }
    ]
  }
}
```

**Business Rules**:
- Shows last 12 months of absenteeism data
- Filters by departments: Finance, Sales, Marketing, IT
- Only includes records with status "Absent"
- Data organized by year-month for trend analysis

### Get Today's Attendance

Retrieves attendance percentage for the current day.

**Endpoint**: `GET /v1/attendance/attendance-today`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "labels": ["Attendance", "Remaining"],
    "datasets": [
      {
        "data": [85, 15],
        "backgroundColor": ["#22c55e", "#e5e7eb"],
        "hoverBackgroundColor": ["#16a34a", "#d1d5db"],
        "borderWidth": 0
      }
    ],
    "meta": {
      "totalActive": 100,
      "presentCount": 85
    }
  }
}
```

**Business Rules**:
- Calculates attendance percentage for current date
- Only includes active employees in calculation
- Present count based on employees with attendance records for today

### Get Employee Overview

Retrieves active vs inactive employee statistics.

**Endpoint**: `GET /v1/attendance/employee-overview`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "labels": ["Active", "Inactive"],
    "datasets": [
      {
        "data": [95, 5],
        "backgroundColor": ["#3b82f6", "#f97316"],
        "hoverBackgroundColor": ["#2563eb", "#ea580c"],
        "borderWidth": 0
      }
    ],
    "meta": {
      "activeCount": 95,
      "inactiveCount": 5
    }
  }
}
```

### Get Today's Late Arrivals

Retrieves list of employees who arrived late today with detailed information.

**Endpoint**: `GET /v1/attendance/late-in-today`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Employees late today (based on attendance records)",
  "count": 3,
  "data": [
    {
      "empName": "John Doe",
      "employee_Id": "EMP001",
      "department": "Engineering",
      "login": "09:30 AM",
      "shiftStart": "09:00",
      "minutesLate": 30,
      "lateCategory": "Late",
      "managerName": "Jane Smith",
      "assigned_to": "64a1b2c3d4e5f6789012340"
    },
    {
      "empName": "Bob Johnson",
      "employee_Id": "EMP002",
      "department": "Marketing",
      "login": "09:20 AM",
      "shiftStart": "09:00",
      "minutesLate": 20,
      "lateCategory": "Late",
      "managerName": "Alice Brown",
      "assigned_to": "64a1b2c3d4e5f6789012341"
    }
  ]
}
```

**Business Rules**:
- Only includes employees with lateCategory "Late"
- Calculates minutes late based on shift timing
- Includes manager information for escalation
- Filters out grace period latecomers

### Get Punch Status Today

Retrieves detailed punch-in status categorized by on-time and late arrivals.

**Endpoint**: `GET /v1/attendance/punch-status-today`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "onTime": [
      {
        "fullName": "John Doe",
        "employeeId": "EMP001",
        "department": "Engineering",
        "designation": "Software Engineer",
        "managerName": "Jane Smith",
        "managerId": "MGR001",
        "shiftStart": "09:00",
        "punchIn": "08:55 AM",
        "date": "2024-01-15"
      }
    ],
    "onTimeCount": 1,
    "late": [
      {
        "fullName": "Bob Johnson",
        "employeeId": "EMP002",
        "department": "Marketing",
        "designation": "Marketing Specialist",
        "managerName": "Alice Brown",
        "managerId": "MGR002",
        "shiftStart": "09:00",
        "punchIn": "09:15 AM",
        "date": "2024-01-15"
      }
    ],
    "lateCount": 1
  }
}
```

**Business Rules**:
- Compares punch-in time with shift start time
- Includes manager information for each employee
- Categorizes based on actual time comparison
- Only includes employees with attendance records for today

### Get Attendance Status Today

Retrieves comprehensive attendance status including present, absent, late, and on-leave counts.

**Endpoint**: `GET /v1/attendance/attendance-status-today`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "totalEmployees": 100,
    "presentCount": 85,
    "onLeaveCount": 8,
    "absentCount": 7,
    "onTimeCount": 70,
    "lateCount": 15
  }
}
```

**Business Rules**:
- `presentCount`: Employees with Present, Reduced Hours, or Half Day status
- `onLeaveCount`: Employees with Leave status
- `absentCount`: Employees without attendance records and not on leave
- `onTimeCount`: Present employees who arrived on time
- `lateCount`: Present employees who arrived late

### Get Department Attendance Status

Retrieves attendance status filtered by department and date.

**Endpoint**: `GET /v1/attendance/department-attendance`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view`

**Query Parameters**:
- `department` (string, optional): Filter by specific department
- `date` (string, required): Date in YYYY-MM-DD format

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "department": "Engineering",
    "totalEmployees": 25,
    "presentCount": 22,
    "onLeaveCount": 2,
    "absentCount": 1,
    "onTimeCount": 18,
    "lateCount": 4
  }
}
```

**Error Responses**:

*400 Bad Request - Missing date*:
```json
{
  "success": false,
  "message": "Date is required in YYYY-MM-DD format"
}
```

*400 Bad Request - Invalid date format*:
```json
{
  "success": false,
  "message": "Invalid date format. Use YYYY-MM-DD"
}
```

*404 Not Found - Department not found*:
```json
{
  "success": false,
  "message": "No active users found in department \"NonExistentDept\""
}
```

### Get Monthly Attendance Summary

Retrieves weekly attendance percentages for a specific month.

**Endpoint**: `GET /v1/attendance/month-attendance`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view`

**Query Parameters**:
- `year` (integer, optional): Year (default: current year)
- `month` (integer, optional): Month 1-12 (default: current month)

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "totalEmployees": 100,
    "weekLabels": ["1 Week", "2 Week", "3 Week", "4 Week"],
    "present": [85.5, 87.2, 83.1, 88.9],
    "absent": [14.5, 12.8, 16.9, 11.1]
  }
}
```

**Business Rules**:
- Divides month into 4 weekly periods
- Calculates attendance percentage for each week
- Excludes employees on leave from absence calculation
- Percentages based on total active employees

### Get Department Attendance Summary

Retrieves attendance summary for all departments for the current day.

**Endpoint**: `GET /v1/attendance/getDepartmentAttendanceSummary`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view`

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "department": "Engineering",
      "present": 22,
      "absent": 3,
      "totalEmployees": 25
    },
    {
      "department": "Marketing",
      "present": 15,
      "absent": 2,
      "totalEmployees": 17
    },
    {
      "department": "Finance",
      "present": 8,
      "absent": 1,
      "totalEmployees": 9
    }
  ]
}
```

**Business Rules**:
- Includes all departments from department master
- Present count based on "Present" status in attendance
- Absent count based on "Absent" status in attendance
- Only includes active employees in calculations

### Get Subordinate Statistics

Retrieves attendance statistics for all subordinates of the current user (manager).

**Endpoint**: `GET /v1/attendance/getSubordinateStats`

**Authentication**: Required (JWT)

**Permissions**: Manager access required

**Success Response** (200):
```json
{
  "success": true,
  "message": "Subordinate stats with shift-based late detection",
  "data": {
    "totalSubordinates": 15,
    "presentCount": 12,
    "lateCount": 3,
    "onLeaveCount": 2,
    "absentCount": 1
  }
}
```

**Business Rules**:
- Uses GraphQL-style lookup to find all subordinates (recursive)
- Includes direct and indirect reports
- Status based on today's attendance records
- Late detection based on shift timing and grace periods

## Attendance User Management API

### Get User Attendance Records

Retrieves attendance records for the authenticated user with monthly summaries.

**Endpoint**: `GET /v1/attendance-user/`

**Authentication**: Required (JWT)

**Query Parameters**:
- `month` (string, optional): Month in YYYY-MM format (default: current month)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Attendance records retrieved successfully",
  "totalCount": 22,
  "monthSummary": {
    "totalLateDays": 3,
    "totalGraceUsed": 2,
    "totalHalfDays": 1,
    "totalAbsents": 0,
    "completeDays": 18,
    "lessThanHalfDays": 1,
    "totalLeavesUsed": 2,
    "graceRemaining": 1
  },
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "date": "2024-01-15",
      "day": "Monday",
      "login": "09:15 AM",
      "logout": "06:30 PM",
      "shift_Timing": "64a1b2c3d4e5f6789012350",
      "status": "Present",
      "minutesLate": 15,
      "lateCategory": "Grace1",
      "workedHours": 8.75,
      "breaks": [
        {
          "start": "2024-01-15T12:00:00.000Z",
          "end": "2024-01-15T13:00:00.000Z",
          "duration": 60,
          "breakStatus": "Ended"
        }
      ],
      "department": "Engineering",
      "createdAt": "2024-01-15T09:15:00.000Z"
    }
  ]
}
```

**Business Rules**:
- Calculates worked hours based on login/logout times minus breaks
- Applies grace period logic for late arrivals
- Integrates with leave ledger for accurate leave counting
- Tracks grace period usage across the month

### Get Employee Attendance Records

Retrieves attendance records for a specific employee (admin/manager access).

**Endpoint**: `GET /v1/attendance-user/employee`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view-subordinate`

**Query Parameters**:
- `employee_Id` (string, required): Employee ID to query
- `selectedMonth` (string, optional): Month in YYYY-MM format

**Success Response** (200):
```json
{
  "success": true,
  "message": "Attendance records retrieved successfully",
  "totalCount": 20,
  "monthSummary": {
    "totalGraceUsed": 1,
    "totalLateDays": 2,
    "totalHalfDays": 0,
    "totalAbsents": 1,
    "completeDays": 17,
    "lessThanHalfDays": 0,
    "graceRemaining": 2
  },
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012346",
      "date": "2024-01-15",
      "day": "Monday",
      "login": "09:05 AM",
      "logout": "06:15 PM",
      "status": "Present",
      "minutesLate": 5,
      "lateCategory": "Grace1",
      "workedHours": 9.17,
      "employee_Id": "EMP001",
      "department": "Engineering"
    }
  ]
}
```

**Error Responses**:

*400 Bad Request - Missing employee ID*:
```json
{
  "success": false,
  "message": "employee_Id query parameter is required"
}
```

### Get Today's Punch Times

Retrieves punch-in and punch-out times for all employees for the current day.

**Endpoint**: `GET /v1/attendance-user/today`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Today's punch in/out fetched successfully",
  "data": [
    {
      "empName": "John Doe",
      "employee_Id": "EMP001",
      "department": "Engineering",
      "login": "09:00 AM",
      "logout": "06:30 PM",
      "status": "Present"
    },
    {
      "empName": "Jane Smith",
      "employee_Id": "EMP002",
      "department": "Marketing",
      "login": "09:15 AM",
      "logout": "",
      "status": "Partial"
    },
    {
      "empName": "Bob Johnson",
      "employee_Id": "EMP003",
      "department": "Finance",
      "login": "",
      "logout": "",
      "status": "Absent"
    }
  ]
}
```

**Business Rules**:
- `Present`: Both login and logout times recorded
- `Partial`: Only login time recorded
- `Absent`: No login time recorded
- Includes all active employees regardless of attendance status

### Get Punch Time Configuration

Retrieves user-specific punch time configuration including shift timing and location.

**Endpoint**: `GET /v1/attendance-user/punchtime`

**Authentication**: Required (JWT)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Punch time retrieved successfully",
  "data": {
    "employee_Id": "EMP001",
    "latitude": 28.4595,
    "longitude": 77.0266,
    "shift_Timing": {
      "id": "64a1b2c3d4e5f6789012350",
      "name": "Day Shift",
      "startTime": "09:00",
      "endTime": "18:00"
    },
    "salary": 50000
  }
}
```

**Business Rules**:
- Returns user's assigned shift timing details
- Includes location coordinates for geo-fencing
- Provides salary information for attendance calculations

### Get User Break Type

Retrieves break type configuration for a specific employee.

**Endpoint**: `GET /v1/attendance-user/break-type/:employeeId`

**Authentication**: Required (JWT)

**Path Parameters**:
- `employeeId` (string): Employee ID to query

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "break_Type": {
      "_id": "64a1b2c3d4e5f6789012355",
      "name": "Standard Break",
      "breakHours": 1,
      "description": "Standard 1-hour break"
    },
    "shift_Timing": {
      "id": "64a1b2c3d4e5f6789012350",
      "name": "Day Shift",
      "startTime": "09:00",
      "endTime": "18:00"
    }
  }
}
```

**Error Responses**:

*404 Not Found - User not found*:
```json
{
  "success": false,
  "message": "User not found"
}
```

### Punch In (Login Attendance)

Records employee punch-in time with automatic lateness calculation.

**Endpoint**: `POST /v1/attendance-user/punchin`

**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "date": "2024-01-15",
  "day": "Monday",
  "login": "09:15 AM",
  "attendance_mode": "Mobile"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Attendance recorded successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "date": "2024-01-15",
    "day": "Monday",
    "login": "09:15 AM",
    "shift_Timing": "64a1b2c3d4e5f6789012350",
    "salary": 50000,
    "attendance_mode": "Mobile",
    "status": "Present",
    "employee_Id": "EMP001",
    "department": "Engineering",
    "minutesLate": 15,
    "lateCategory": "Grace1",
    "punchRecords": ["09:15 AM"],
    "createdAt": "2024-01-15T09:15:00.000Z"
  }
}
```

**Error Responses**:

*400 Bad Request - Attendance already exists*:
```json
{
  "success": false,
  "message": "Attendance already exists. Please use the logout endpoint."
}
```

*400 Bad Request - Invalid shift timing*:
```json
{
  "success": false,
  "message": "Invalid shift timing for user."
}
```

*400 Bad Request - Invalid time format*:
```json
{
  "success": false,
  "message": "Unable to determine late status. Invalid time format."
}
```

**Business Rules**:
- Calculates lateness based on shift start time
- Applies grace period logic with monthly limits
- Automatically sets status to "Present"
- Prevents duplicate punch-in for the same date
- Tracks grace period usage across the month

### Punch Out (Logout Attendance)

Records employee punch-out time and calculates final attendance status.

**Endpoint**: `POST /v1/attendance-user/punchout`

**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "date": "2024-01-15",
  "logout": "06:30 PM"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Attendance record updated with logout time and status",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "date": "2024-01-15",
    "login": "09:15 AM",
    "logout": "06:30 PM",
    "status": "Present",
    "minutesLate": 15,
    "lateCategory": "Grace1",
    "breaks": [
      {
        "start": "2024-01-15T12:00:00.000Z",
        "end": "2024-01-15T13:00:00.000Z",
        "duration": 60,
        "breakStatus": "Ended"
      }
    ],
    "employee_Id": "EMP001",
    "updatedAt": "2024-01-15T18:30:00.000Z"
  }
}
```

**Error Responses**:

*400 Bad Request - No attendance record*:
```json
{
  "success": false,
  "message": "No attendance record found for this date. Please log in first."
}
```

*400 Bad Request - Already logged out*:
```json
{
  "success": false,
  "message": "Attendance record already has a logout time."
}
```

**Business Rules**:
- Requires existing punch-in record
- Calculates total worked hours minus break time
- Determines final status based on worked hours:
  - `Present`: >= fullDayHours (default 9 hours)
  - `Half Day`: >= halfDayHours (default 5 hours)
  - `Reduced Hours`: < halfDayHours but > 0
  - `Absent`: No worked hours
- Prevents duplicate punch-out

### Start Break

Initiates a break period for an employee.

**Endpoint**: `POST /v1/attendance-user/start-break`

**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "employeeId": "EMP001"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Break started",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "employee_Id": "EMP001",
    "date": "2024-01-15",
    "breaks": [
      {
        "start": "2024-01-15T12:00:00.000Z",
        "end": null,
        "duration": 0,
        "breakStatus": "Running"
      }
    ],
    "status": "Present"
  }
}
```

**Business Rules**:
- Creates attendance record if doesn't exist for the day
- Adds new break entry with "Running" status
- Multiple breaks can be started and ended throughout the day
- Break start time recorded as current timestamp

### End Break

Terminates the current active break and calculates duration.

**Endpoint**: `POST /v1/attendance-user/end-break`

**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "employeeId": "EMP001"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Break ended",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "employee_Id": "EMP001",
    "date": "2024-01-15",
    "breaks": [
      {
        "start": "2024-01-15T12:00:00.000Z",
        "end": "2024-01-15T13:00:00.000Z",
        "duration": 60,
        "breakStatus": "Ended"
      }
    ]
  }
}
```

**Error Responses**:

*404 Not Found - No attendance record*:
```json
{
  "success": false,
  "message": "No attendance for today"
}
```

*400 Bad Request - No active break*:
```json
{
  "success": false,
  "message": "No active break to end"
}
```

**Business Rules**:
- Finds the most recent break without end time
- Calculates duration in minutes
- Sets break status to "Ended"
- Triggers notifications if break exceeds allowed duration
- Notifies employee and manager if break limit exceeded

### Request Missed Punch Time

Creates a request for missed punch-in or punch-out approval.

**Endpoint**: `POST /v1/attendance-user/missed-punch-request`

**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "date": "2024-01-15",
  "punchIn": "09:00 AM",
  "punchOut": "06:00 PM",
  "reason": "Forgot to punch in due to urgent meeting"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Missed punch request created",
  "data": {
    "_id": "64a1b2c3d4e5f6789012360",
    "employeeId": "64a1b2c3d4e5f6789012340",
    "managerId": "64a1b2c3d4e5f6789012341",
    "date": "2024-01-15",
    "punchIn": "09:00 AM",
    "punchOut": "06:00 PM",
    "reason": "Forgot to punch in due to urgent meeting",
    "status": "Pending",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Business Rules**:
- Automatically finds the closest manager with attendance permissions
- Creates request with "Pending" status
- Requires both punch-in and punch-out times
- Reason is mandatory for approval workflow

### Get Missed Punch Requests

Retrieves all pending missed punch requests for manager approval.

**Endpoint**: `GET /v1/attendance-user/missed-punch-request`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view-subordinate`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Pending missed punch requests fetched",
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012360",
      "employeeId": {
        "_id": "64a1b2c3d4e5f6789012340",
        "first_Name": "John",
        "last_Name": "Doe",
        "employee_Id": "EMP001"
      },
      "managerId": "64a1b2c3d4e5f6789012341",
      "date": "2024-01-15",
      "punchIn": "09:00 AM",
      "punchOut": "06:00 PM",
      "reason": "Forgot to punch in due to urgent meeting",
      "status": "Pending",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**Error Responses**:

*403 Forbidden - Insufficient permissions*:
```json
{
  "success": false,
  "message": "You do not have permission to view subordinate requests"
}
```

**Business Rules**:
- Only shows requests assigned to the current manager
- Filters to show only "Pending" status requests
- Includes populated employee information
- Sorted by creation date (newest first)

### Handle Missed Punch Request

Approves or rejects a missed punch request.

**Endpoint**: `PATCH /v1/attendance-user/missed-punch-request/:requestId`

**Authentication**: Required (JWT)

**Permissions**: `attendance-view-subordinate`

**Path Parameters**:
- `requestId` (string): MongoDB ObjectId of the request

**Request Body**:
```json
{
  "action": "approve"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Missed punch request approved and attendance updated"
}
```

**Error Responses**:

*404 Not Found - Request not found*:
```json
{
  "success": false,
  "message": "Missed punch request not found"
}
```

*400 Bad Request - Already handled*:
```json
{
  "success": false,
  "message": "Request is already handled"
}
```

*403 Forbidden - Not assigned to manager*:
```json
{
  "success": false,
  "message": "This request is not assigned to you"
}
```

*400 Bad Request - Invalid action*:
```json
{
  "success": false,
  "message": "Invalid action. Must be 'approve' or 'reject'."
}
```

**Business Rules**:
- Only the assigned manager can approve/reject
- Request must be in "Pending" status
- **Approve action**:
  - Creates or updates attendance record with requested punch times
  - Sets status to "Present"
  - Marks request as "Approved"
- **Reject action**:
  - Creates or updates attendance record with "Leave" status
  - Marks request as "Rejected"
- Prevents duplicate handling of the same request

## Frontend Integration

### JavaScript SDK

```javascript
class AttendanceAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Dashboard Analytics
  async getOverview() {
    return this.request('/v1/attendance/overview');
  }

  async getAbsenteeismChart() {
    return this.request('/v1/attendance/absenteeism');
  }

  async getTodayAttendance() {
    return this.request('/v1/attendance/attendance-today');
  }

  async getEmployeeOverview() {
    return this.request('/v1/attendance/employee-overview');
  }

  async getTodayLateIns() {
    return this.request('/v1/attendance/late-in-today');
  }

  async getPunchStatusToday() {
    return this.request('/v1/attendance/punch-status-today');
  }

  async getAttendanceStatusToday() {
    return this.request('/v1/attendance/attendance-status-today');
  }

  async getDepartmentAttendance(department, date) {
    const params = new URLSearchParams();
    if (department) params.append('department', department);
    if (date) params.append('date', date);
    return this.request(`/v1/attendance/department-attendance?${params}`);
  }

  async getMonthlyAttendance(year, month) {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (month) params.append('month', month);
    return this.request(`/v1/attendance/month-attendance?${params}`);
  }

  async getDepartmentSummary() {
    return this.request('/v1/attendance/getDepartmentAttendanceSummary');
  }

  async getSubordinateStats() {
    return this.request('/v1/attendance/getSubordinateStats');
  }

  // User Attendance Management
  async getUserAttendance(month) {
    const params = month ? `?month=${month}` : '';
    return this.request(`/v1/attendance-user/${params}`);
  }

  async getEmployeeAttendance(employeeId, selectedMonth) {
    const params = new URLSearchParams();
    params.append('employee_Id', employeeId);
    if (selectedMonth) params.append('selectedMonth', selectedMonth);
    return this.request(`/v1/attendance-user/employee?${params}`);
  }

  async getTodayPunchTimes() {
    return this.request('/v1/attendance-user/today');
  }

  async getPunchTimeConfig() {
    return this.request('/v1/attendance-user/punchtime');
  }

  async getUserBreakType(employeeId) {
    return this.request(`/v1/attendance-user/break-type/${employeeId}`);
  }

  // Punch In/Out Operations
  async punchIn(date, day, login, attendanceMode = 'Web') {
    return this.request('/v1/attendance-user/punchin', {
      method: 'POST',
      body: JSON.stringify({
        date,
        day,
        login,
        attendance_mode: attendanceMode
      })
    });
  }

  async punchOut(date, logout) {
    return this.request('/v1/attendance-user/punchout', {
      method: 'POST',
      body: JSON.stringify({
        date,
        logout
      })
    });
  }

  // Break Management
  async startBreak(employeeId) {
    return this.request('/v1/attendance-user/start-break', {
      method: 'POST',
      body: JSON.stringify({ employeeId })
    });
  }

  async endBreak(employeeId) {
    return this.request('/v1/attendance-user/end-break', {
      method: 'POST',
      body: JSON.stringify({ employeeId })
    });
  }

  // Missed Punch Requests
  async createMissedPunchRequest(date, punchIn, punchOut, reason) {
    return this.request('/v1/attendance-user/missed-punch-request', {
      method: 'POST',
      body: JSON.stringify({
        date,
        punchIn,
        punchOut,
        reason
      })
    });
  }

  async getMissedPunchRequests() {
    return this.request('/v1/attendance-user/missed-punch-request');
  }

  async handleMissedPunchRequest(requestId, action) {
    return this.request(`/v1/attendance-user/missed-punch-request/${requestId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action })
    });
  }
}

// Usage Example
const api = new AttendanceAPI('https://your-api-domain.com/api', 'your-jwt-token');

// Get dashboard overview
try {
  const overview = await api.getOverview();
  console.log('Dashboard Overview:', overview.data);
} catch (error) {
  console.error('Failed to get overview:', error.message);
}

// Punch in
try {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const dayStr = today.toLocaleDateString('en-US', { weekday: 'long' });
  const timeStr = today.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  const result = await api.punchIn(dateStr, dayStr, timeStr, 'Web');
  console.log('Punch in successful:', result.data);
} catch (error) {
  console.error('Punch in failed:', error.message);
}

// Handle missed punch request
try {
  await api.handleMissedPunchRequest('64a1b2c3d4e5f6789012360', 'approve');
  console.log('Missed punch request approved');
} catch (error) {
  console.error('Failed to handle request:', error.message);
}
```

### React Component Examples

```javascript
import React, { useState, useEffect } from 'react';

const AttendanceDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [lateEmployees, setLateEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = new AttendanceAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [overviewData, attendanceData, lateData] = await Promise.all([
        api.getOverview(),
        api.getTodayAttendance(),
        api.getTodayLateIns()
      ]);

      setOverview(overviewData.data);
      setTodayAttendance(attendanceData.data);
      setLateEmployees(lateData.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="attendance-dashboard">
      <h1>Attendance Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="overview-cards">
        <div className="card">
          <h3>New Employees</h3>
          <p>{overview?.newUsers || 0}</p>
        </div>
        <div className="card">
          <h3>Total Payroll</h3>
          <p>${overview?.totalDeposit?.toLocaleString() || 0}</p>
        </div>
        <div className="card">
          <h3>Total Deductions</h3>
          <p>${overview?.totalExpense?.toLocaleString() || 0}</p>
        </div>
        <div className="card">
          <h3>Net Earnings</h3>
          <p>${overview?.totalEarning?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Today's Attendance */}
      <div className="attendance-chart">
        <h3>Today's Attendance</h3>
        <div className="chart-container">
          <div className="attendance-stat">
            <span>Present: {todayAttendance?.meta?.presentCount || 0}</span>
            <span>Total: {todayAttendance?.meta?.totalActive || 0}</span>
          </div>
          {/* Add chart visualization here */}
        </div>
      </div>

      {/* Late Employees */}
      <div className="late-employees">
        <h3>Late Arrivals Today ({lateEmployees.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Shift Start</th>
              <th>Actual Login</th>
              <th>Minutes Late</th>
              <th>Manager</th>
            </tr>
          </thead>
          <tbody>
            {lateEmployees.map((emp) => (
              <tr key={emp.employee_Id}>
                <td>{emp.empName}</td>
                <td>{emp.department}</td>
                <td>{emp.shiftStart}</td>
                <td>{emp.login}</td>
                <td>{emp.minutesLate}</td>
                <td>{emp.managerName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PunchInOut = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);

  const api = new AttendanceAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    checkTodayAttendance();

    return () => clearInterval(timer);
  }, []);

  const checkTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.getUserAttendance(today.slice(0, 7));
      const todayRecord = response.data.find(record => record.date === today);
      
      if (todayRecord) {
        setAttendanceData(todayRecord);
        setIsPunchedIn(!!todayRecord.login && !todayRecord.logout);
      }
    } catch (error) {
      console.error('Failed to check attendance:', error);
    }
  };

  const handlePunchIn = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const dayStr = today.toLocaleDateString('en-US', { weekday: 'long' });
      const timeStr = today.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });

      const result = await api.punchIn(dateStr, dayStr, timeStr, 'Web');
      setAttendanceData(result.data);
      setIsPunchedIn(true);
      alert('Punch in successful!');
    } catch (error) {
      alert('Punch in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const timeStr = today.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });

      const result = await api.punchOut(dateStr, timeStr);
      setAttendanceData(result.data);
      setIsPunchedIn(false);
      alert('Punch out successful!');
    } catch (error) {
      alert('Punch out failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="punch-in-out">
      <h2>Attendance Tracker</h2>
      
      <div className="current-time">
        <h3>{formatTime(currentTime)}</h3>
        <p>{currentTime.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>

      <div className="punch-buttons">
        {!isPunchedIn ? (
          <button 
            onClick={handlePunchIn}
            disabled={loading}
            className="punch-in-btn"
          >
            {loading ? 'Processing...' : 'Punch In'}
          </button>
        ) : (
          <button 
            onClick={handlePunchOut}
            disabled={loading}
            className="punch-out-btn"
          >
            {loading ? 'Processing...' : 'Punch Out'}
          </button>
        )}
      </div>

      {attendanceData && (
        <div className="attendance-info">
          <h4>Today's Attendance</h4>
          <div className="info-grid">
            <div className="info-item">
              <label>Punch In:</label>
              <span>{attendanceData.login || 'Not recorded'}</span>
            </div>
            <div className="info-item">
              <label>Punch Out:</label>
              <span>{attendanceData.logout || 'Not recorded'}</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={`status ${attendanceData.status?.toLowerCase()}`}>
                {attendanceData.status}
              </span>
            </div>
            <div className="info-item">
              <label>Late Category:</label>
              <span className={`late-category ${attendanceData.lateCategory?.toLowerCase()}`}>
                {attendanceData.lateCategory}
              </span>
            </div>
            {attendanceData.minutesLate > 0 && (
              <div className="info-item">
                <label>Minutes Late:</label>
                <span>{attendanceData.minutesLate}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MissedPunchRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = new AttendanceAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.getMissedPunchRequests();
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId, action) => {
    try {
      await api.handleMissedPunchRequest(requestId, action);
      alert(`Request ${action}d successfully!`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      alert(`Failed to ${action} request: ${error.message}`);
    }
  };

  if (loading) return <div>Loading requests...</div>;

  return (
    <div className="missed-punch-requests">
      <h2>Missed Punch Requests ({requests.length})</h2>
      
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <h4>{request.employeeId.first_Name} {request.employeeId.last_Name}</h4>
                <span className="employee-id">{request.employeeId.employee_Id}</span>
              </div>
              
              <div className="request-details">
                <div className="detail-item">
                  <label>Date:</label>
                  <span>{request.date}</span>
                </div>
                <div className="detail-item">
                  <label>Punch In:</label>
                  <span>{request.punchIn}</span>
                </div>
                <div className="detail-item">
                  <label>Punch Out:</label>
                  <span>{request.punchOut}</span>
                </div>
                <div className="detail-item">
                  <label>Reason:</label>
                  <span>{request.reason}</span>
                </div>
              </div>
              
              <div className="request-actions">
                <button 
                  onClick={() => handleRequest(request._id, 'approve')}
                  className="approve-btn"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleRequest(request._id, 'reject')}
                  className="reject-btn"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { AttendanceDashboard, PunchInOut, MissedPunchRequests };
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

#### Dashboard Analytics Tests

**Get Overview Statistics**:
```bash
curl -X GET https://your-api-domain.com/api/v1/attendance/overview \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Absenteeism Chart**:
```bash
curl -X GET https://your-api-domain.com/api/v1/attendance/absenteeism \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Today's Attendance**:
```bash
curl -X GET https://your-api-domain.com/api/v1/attendance/attendance-today \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Late Arrivals**:
```bash
curl -X GET https://your-api-domain.com/api/v1/attendance/late-in-today \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Department Attendance**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/attendance/department-attendance?department=Engineering&date=2024-01-15" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Monthly Summary**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/attendance/month-attendance?year=2024&month=1" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

#### User Attendance Tests

**Get User Attendance**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/attendance-user/?month=2024-01" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Employee Attendance**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/attendance-user/employee?employee_Id=EMP001&selectedMonth=2024-01" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Punch Time Config**:
```bash
curl -X GET https://your-api-domain.com/api/v1/attendance-user/punchtime \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Punch In**:
```bash
curl -X POST https://your-api-domain.com/api/v1/attendance-user/punchin \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "day": "Monday",
    "login": "09:15 AM",
    "attendance_mode": "Web"
  }'
```

**Punch Out**:
```bash
curl -X POST https://your-api-domain.com/api/v1/attendance-user/punchout \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "logout": "06:30 PM"
  }'
```

#### Break Management Tests

**Start Break**:
```bash
curl -X POST https://your-api-domain.com/api/v1/attendance-user/start-break \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001"
  }'
```

**End Break**:
```bash
curl -X POST https://your-api-domain.com/api/v1/attendance-user/end-break \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001"
  }'
```

#### Missed Punch Request Tests

**Create Missed Punch Request**:
```bash
curl -X POST https://your-api-domain.com/api/v1/attendance-user/missed-punch-request \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "punchIn": "09:00 AM",
    "punchOut": "06:00 PM",
    "reason": "Forgot to punch in due to urgent meeting"
  }'
```

**Get Missed Punch Requests**:
```bash
curl -X GET https://your-api-domain.com/api/v1/attendance-user/missed-punch-request \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Approve Missed Punch Request**:
```bash
curl -X PATCH https://your-api-domain.com/api/v1/attendance-user/missed-punch-request/64a1b2c3d4e5f6789012360 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve"
  }'
```

**Reject Missed Punch Request**:
```bash
curl -X PATCH https://your-api-domain.com/api/v1/attendance-user/missed-punch-request/64a1b2c3d4e5f6789012360 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "reject"
  }'
```

### Testing Scenarios

#### Daily Attendance Workflow
1. **Morning**: Test punch-in with various times (on-time, grace period, late)
2. **Breaks**: Test start/end break functionality
3. **Evening**: Test punch-out with different work hour scenarios
4. **Status Calculation**: Verify status calculation based on hours worked

#### Grace Period Testing
1. **Within Grace**: Test punch-in within grace period (should use grace)
2. **Grace Exhausted**: Test when monthly grace limit is reached
3. **Late Arrival**: Test punch-in beyond grace period (should mark as late)

#### Manager Approval Workflow
1. **Create Request**: Employee creates missed punch request
2. **Manager Review**: Manager views pending requests
3. **Approval**: Test approval flow with attendance record creation
4. **Rejection**: Test rejection flow with leave status assignment

#### Department Analytics
1. **Department Filter**: Test department-specific attendance data
2. **Date Range**: Test different date ranges for attendance analysis
3. **Monthly Reports**: Test monthly summary generation

#### Error Handling
1. **Duplicate Punch**: Test duplicate punch-in/out prevention
2. **Invalid Times**: Test with invalid time formats
3. **Missing Data**: Test with missing shift timings or settings
4. **Permission Denied**: Test endpoints without proper permissions

## Error Handling

### Standard Error Response Format

All API errors follow a consistent format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details (optional)"
}
```

### HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data, validation errors, or business rule violations
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error, database issues, or external service failures

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
  "message": "You do not have permission to view subordinate requests"
}
```

#### Validation Errors
```json
{
  "success": false,
  "message": "Date is required in YYYY-MM-DD format"
}
```

#### Business Rule Violations
```json
{
  "success": false,
  "message": "Attendance already exists. Please use the logout endpoint."
}
```

#### Resource Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

## Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication with expiration
- **Permission Validation**: Role-based access control for different operations
- **Request Validation**: Comprehensive input validation and sanitization

### Data Security
- **Attendance Integrity**: Prevents duplicate records and ensures data consistency
- **Time Validation**: Validates time formats and logical time sequences
- **Geolocation**: Optional location tracking for punch-in/out verification

### Business Logic Security
- **Grace Period Enforcement**: Strict enforcement of monthly grace limits
- **Status Calculation**: Secure calculation of attendance status based on worked hours
- **Approval Workflow**: Secure manager approval process for missed punch requests

## Performance Optimization

### Database Optimization
- **Indexing**: Proper indexes on employee_Id, date, and createdAt fields
- **Aggregation**: Efficient MongoDB aggregation pipelines for analytics
- **Pagination**: Consistent pagination for large datasets

### Caching Strategy
- **Shift Mapping**: Caching of shift timing configurations
- **Company Settings**: Caching of attendance policies and settings
- **User Permissions**: Caching of user permission data

### Query Optimization
- **Selective Fields**: Only fetching required fields to minimize data transfer
- **Batch Operations**: Efficient batch processing for multiple employees
- **Date Range Queries**: Optimized date range queries for monthly reports

## Troubleshooting

### Common Issues

#### 1. Punch-in/out Time Calculation Issues

**Issue**: Incorrect lateness calculation or status determination

**Causes**:
- Incorrect shift timing configuration
- Invalid time format in request
- Missing company settings

**Solutions**:
- Verify shift timings in company settings
- Ensure time format is consistent (12-hour format for punch times)
- Check attendance policy configuration

#### 2. Grace Period Not Applied

**Issue**: Grace period not being applied to late arrivals

**Causes**:
- Monthly grace limit already reached
- Incorrect grace period configuration
- Time calculation errors

**Solutions**:
- Check monthly grace usage for the employee
- Verify `lateComingGraceMinutes` and `maxMonthlyLatenessAllowed` settings
- Debug time difference calculation

#### 3. Break Duration Tracking Issues

**Issue**: Incorrect break duration calculation

**Causes**:
- Missing break end time
- Multiple active breaks
- Timezone conversion issues

**Solutions**:
- Ensure all breaks have proper end times
- Check for orphaned break records
- Verify server timezone configuration

#### 4. Missed Punch Request Approval Problems

**Issue**: Approval not updating attendance records

**Causes**:
- Permission validation failures
- Incorrect request status
- Database update errors

**Solutions**:
- Verify manager permissions
- Check request status before approval
- Review database transaction logs

#### 5. Dashboard Analytics Discrepancies

**Issue**: Inconsistent counts between different dashboard endpoints

**Causes**:
- Different date range calculations
- Timezone differences
- Caching issues

**Solutions**:
- Standardize date range calculations
- Use consistent timezone handling
- Clear cache and recalculate metrics

### Debugging Tips

#### Time-Related Issues
1. **Timezone Consistency**: Ensure all time calculations use consistent timezone
2. **Format Validation**: Verify time format parsing for both 12-hour and 24-hour formats
3. **Date Boundaries**: Check date boundary handling for midnight calculations

#### Permission Issues
1. **Role Assignment**: Verify user role and permission assignment
2. **Hierarchy Check**: Ensure manager-subordinate relationships are correct
3. **Permission Caching**: Clear permission cache if changes don't take effect

#### Data Consistency
1. **Duplicate Prevention**: Check unique constraints on employee_Id and date
2. **Status Calculation**: Verify attendance status calculation logic
3. **Aggregation Accuracy**: Validate aggregation pipeline results

## Conclusion

The Attendance Management API provides a comprehensive solution for workforce attendance tracking with advanced features like grace period management, break tracking, and manager approval workflows. The system integrates seamlessly with payroll calculations and provides detailed analytics for workforce planning.

The API is designed for scalability and reliability, with proper error handling, security measures, and performance optimization. The comprehensive testing guide and troubleshooting documentation ensure smooth implementation and maintenance.

For additional support or feature requests, please contact the development team or refer to the internal documentation system.