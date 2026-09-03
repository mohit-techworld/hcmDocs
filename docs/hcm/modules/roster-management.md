---
title: "Roaster Management Module Documentation"
description: "The Roaster Management Module (also referred to as \"Roster Management\") is a comprehensive shift scheduling and management system designed to efficiently."
---

# Roaster Management Module Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Module Structure](#module-structure)
4. [Components](#components)
5. [User Roles & Permissions](#user-roles--permissions)
6. [API Endpoints](#api-endpoints)
7. [User Flows](#user-flows)
8. [Technical Details](#technical-details)
9. [Usage Guide](#usage-guide)

---

## Overview

The **Roaster Management Module** (also referred to as "Roster Management") is a comprehensive shift scheduling and management system designed to efficiently organize employees' work shifts, duties, and assignments. The module ensures optimal workforce coverage and productivity while minimizing conflicts and overtime.

### Key Objectives
- Enable employees to view their assigned shifts in a calendar format
- Facilitate shift swap requests between employees
- Allow managers to approve/reject swap requests
- Provide managers with tools to manage team rosters
- Support bulk shift assignment via Excel import/export
- Track swap request history

---

## Features

### 1. **My Roster Dashboard** (Employee View)
- **Calendar View**: Monthly calendar displaying assigned shifts
- **Shift Information**: Shows shift name, timing, and status
- **Swap Request**: Ability to request shift swaps with other employees
- **Status Indicators**: Visual indicators for:
  - Assigned shifts (blue)
  - Week off (gray)
  - Pending swap requests (yellow)
  - Approved swaps (green)
  - Rejected swaps (red)
- **Export Functionality**: Download roster schedule as CSV
- **Manager Approval Badge**: Shows count of manager-approved swaps (for managers)

### 2. **Swap Requests Dashboard** (Manager View)
- **Request Management**: View all shift swap requests assigned to the manager
- **Statistics Cards**: 
  - Employee Approved count
  - Pending Requests count
  - Rejected Requests count
- **Request Details**: View requester, target employee, date, department, and status
- **Action Buttons**: 
  - Approve (two-step: Employee Approval → Manager Approval)
  - Reject
  - View reason for swap
- **Export**: Download swap requests as CSV
- **Pagination**: Configurable rows per page (5, 10, 20)

### 3. **My Swap Requests History** (Employee View)
- **Request History**: View all swap requests raised by the logged-in employee
- **Statistics**: 
  - Total Assigned Shifts
  - Pending Swaps
  - Approved Swaps
- **Request Details**: 
  - Requester information
  - Target employee
  - Requested date
  - Approval date
  - Status (Approved/Pending/Rejected)
- **Status Badges**: Color-coded status indicators

### 4. **Team Roster** (Manager View)
- **Calendar Grid**: Monthly calendar view for all team members
- **Employee List**: Displays subordinates with their shift assignments
- **Shift Management**: 
  - Add shifts to specific dates
  - Edit existing shifts
  - Swap shifts between employees
- **Filtering Options**:
  - Search by employee name
  - Filter by department
  - Filter by shift type
- **Bulk Operations**:
  - Download schedule as Excel (.xlsx)
  - Upload Excel file for bulk shift assignment
- **Excel Features**:
  - Data validation for shift timings
  - Template generation with shift options

---

## Module Structure

```
src/components/roaster-management/
├── EmployeeRoasterDashboard.jsx      # Employee's personal roster view
├── ManagerRoasterDashboard.jsx        # Manager's swap request approval dashboard
├── MyRoasterHistory.jsx               # Employee's swap request history
├── ShiftCalanderForManager.jsx        # Manager's team roster calendar
├── SwapRequestModel.jsx               # Modal for creating swap requests
└── ReasonOfSwapModel.jsx              # Modal for viewing swap reasons
```

---

## Components

### 1. EmployeeRoasterDashboard

**Purpose**: Displays the logged-in employee's shift schedule in a monthly calendar format.

**Key Features**:
- Month navigation (previous/next)
- Visual shift indicators with color coding
- Swap request button
- CSV export functionality
- Responsive design (mobile-friendly)

**State Management**:
- `cursor`: Current month being viewed
- `user`: Logged-in user profile
- `shiftsData`: Parsed shift assignments
- `swapRequests`: All related swap requests
- `shiftTimings`: Available shift timing options

**Key Functions**:
- `loadProfileAndShifts()`: Fetches user profile and shift data
- `parseUserShifts()`: Parses shift data from user profile
- `submitSwapRequest()`: Submits a new swap request
- `handleDownload()`: Exports roster to CSV

### 2. ManagerRoasterDashboard

**Purpose**: Allows managers to view and manage shift swap requests from their team members.

**Key Features**:
- Statistics dashboard
- Request filtering and pagination
- Approve/Reject functionality
- Reason viewing modal
- CSV export

**State Management**:
- `requests`: List of swap requests
- `usersCache`: Cached user data for performance
- `processing`: Tracks request processing status
- `rowsPerPage`: Pagination setting

**Key Functions**:
- `loadRequests()`: Fetches swap requests assigned to manager
- `updateStatus()`: Updates request status (Approve/Reject)
- `onApprove()`: Handles approval (two-step process)
- `onReject()`: Handles rejection
- `downloadCSV()`: Exports requests to CSV

**Approval Workflow**:
1. Initial status: `Pending`
2. First approval: `Approved` (employee approval)
3. Final approval: `ManagerApproved` (manager approval)

### 3. MyRoasterHistory

**Purpose**: Displays the history of swap requests raised by the logged-in employee.

**Key Features**:
- Request history table
- Statistics cards
- Status indicators
- Date range display

**State Management**:
- `requests`: List of user's swap requests
- `loggedInUser`: Current user profile
- `targetEmployees`: Cached target employee data

**Key Functions**:
- `fetchHistory()`: Loads user's swap request history
- `fetchTargetEmployees()`: Fetches target employee details
- `formatDate()`: Formats dates for display

### 4. ShiftCalanderForManager

**Purpose**: Comprehensive team roster management interface for managers.

**Key Features**:
- Monthly calendar grid
- Employee shift assignment
- Shift editing
- Direct shift swapping
- Excel import/export
- Advanced filtering

**State Management**:
- `currentMonthDate`: Currently displayed month
- `employees`: List of subordinate employees
- `shiftTimings`: Available shift options
- `rowsToShow`: Pagination setting
- `searchTerm`: Search filter
- `selectedDepartment`: Department filter
- `selectedShiftType`: Shift type filter

**Key Functions**:
- `fetchData()`: Loads employees and shift timings
- `openShiftModal()`: Opens shift assignment modal
- `openManagerSwap()`: Opens swap modal
- `onShiftSave()`: Saves shift assignment
- `onManagerSwapCompleted()`: Handles completed swaps
- `downloadXLSX()`: Exports to Excel
- `handleFileUpload()`: Imports from Excel

### 5. SwapRequestModel

**Purpose**: Modal component for creating shift swap requests.

**Key Features**:
- Date selection
- Employee search and selection
- Department filtering
- Shift type filtering
- Reason input
- Instant swap (for managers)

**State Management**:
- `selectedEmployeeId`: Target employee
- `date`: Swap date
- `reason`: Reason for swap
- `departments`: Available departments
- `employees`: Available employees
- `shiftTimings`: Available shifts

**Key Functions**:
- `handleSubmit()`: Submits swap request
- `performSwapNow()`: Performs instant swap (manager only)
- `getEmployeeTiming()`: Retrieves employee shift timing

### 6. ReasonOfSwapModel

**Purpose**: Modal to display the reason provided for a swap request.

**Key Features**:
- Displays swap reason text
- Responsive modal design
- Dark mode support

---

## User Roles & Permissions

### Permissions Required

1. **my-roaster-dashboard**
   - Access: All employees
   - Function: View personal roster

2. **manager-roaster-dashboard**
   - Access: Managers
   - Function: View and manage swap requests

3. **my-roaster-history**
   - Access: All employees
   - Function: View personal swap request history

4. **shift-calendar-manager**
   - Access: Managers
   - Function: Manage team roster calendar

### Role-Based Features

**Employee**:
- View personal roster
- Create swap requests
- View swap request history
- Export personal roster

**Manager**:
- All employee features
- Approve/reject swap requests
- View team swap requests
- Manage team roster calendar
- Perform instant swaps
- Bulk shift assignment via Excel

---

## API Endpoints

### Base Path: `/roaster-management`

#### 1. Get Shift Swap Requests
```
GET /roaster-management/shift-swap-requests
Query Parameters:
  - raisedBy: Employee ID who raised the request
  - targetTo: Employee ID who is the target
  - assigned_to: Manager ID assigned to the request
```

#### 2. Create Shift Swap Request
```
POST /roaster-management/shift-swap-requests
Body:
{
  raisedBy: string,
  targetTo: string,
  date: string (YYYY-MM-DD),
  shift_raised_by: string,
  shift_target_to: string,
  reason: string,
  assigned_to: string (manager ID)
}
```

#### 3. Update Swap Request Status
```
PUT /roaster-management/shift-swap-requests/:requestId/status
Body:
{
  status: "Approved" | "Rejected" | "ManagerApproved"
}
```

#### 4. Get Shift for Date
```
GET /roaster-management/shift-for-date/:date/:employeeId
```

#### 5. Swap Shifts (Instant)
```
POST /roaster-management/swap-shifts
Body:
{
  employeeA: string,
  employeeB: string,
  date: string
}
```

#### 6. Bulk Assign Shifts
```
POST /roaster-management/assign-shifts-bulk
Content-Type: multipart/form-data
Body:
  excel: File
```

### Supporting Endpoints

#### User Profile
```
GET /user/profile/:employeeId
GET /user/get/:employeeId
GET /user/get-all-active
```

#### Subordinates
```
GET /subordinates
```

#### Shift Timings
```
GET /company-settings/shift-timings
```

#### Departments
```
GET /departments
```

---

## User Flows

### Flow 1: Employee Creating Swap Request

1. Employee navigates to "My Roster"
2. Clicks "Swap Request" button
3. Modal opens with swap request form
4. Employee selects:
   - Date for swap
   - Target employee (with filters)
   - Optional reason
5. Employee submits request
6. Request status: `Pending`
7. Request appears in manager's dashboard

### Flow 2: Manager Approving Swap Request

1. Manager navigates to "Swap Requests"
2. Views pending requests in dashboard
3. Reviews request details (requester, target, date, reason)
4. Clicks "Approve" button
5. First approval: Status changes to `Approved`
6. Second approval: Status changes to `ManagerApproved`
7. Swap is finalized
8. Both employees' rosters are updated

### Flow 3: Manager Managing Team Roster

1. Manager navigates to "Team Roster"
2. Views monthly calendar grid
3. Options:
   - **Add Shift**: Click "+" on empty date cell
   - **Edit Shift**: Click edit icon on assigned shift
   - **Swap Shifts**: Click swap icon to swap between employees
4. Changes are saved immediately
5. Can export to Excel or import from Excel for bulk operations

### Flow 4: Employee Viewing Swap History

1. Employee navigates to "My Swap Requests"
2. Views all historical swap requests
3. Sees status of each request:
   - Pending (yellow)
   - Approved (green)
   - Rejected (red)
4. Can view details including approval dates

---

## Technical Details

### Technologies Used

- **React**: Frontend framework
- **React Router**: Routing
- **Axios**: HTTP client
- **Day.js**: Date manipulation
- **Framer Motion**: Animations
- **React Icons**: Icon library
- **ExcelJS**: Excel file handling
- **FileSaver**: File download
- **React Hot Toast**: Notifications

### Data Structures

#### Shift Swap Request Object
```javascript
{
  _id: string,
  raisedBy: string | object,  // Employee ID or populated object
  targetTo: string | object,   // Employee ID or populated object
  date: string,               // ISO date string
  shift_raised_by: string,     // Shift name/timing
  shift_target_to: string,     // Shift name/timing
  reason: string,              // Optional reason
  status: string,              // "Pending" | "Approved" | "Rejected" | "ManagerApproved"
  assigned_to: string,        // Manager ID
  department: string,          // Department name
  createdAt: string,          // ISO timestamp
  updatedAt: string           // ISO timestamp
}
```

#### User Shift Data Structure
```javascript
{
  shift_Timing_Array: {
    "YYYY-MM-DD": shiftObject | string | null
  },
  shifts: {
    "YYYY-MM-DD": shiftObject | string | null
  },
  shift_Timing: shiftObject | string | null,  // Default shift
  shift_name: string                           // Default shift name
}
```

#### Shift Timing Object
```javascript
{
  _id: string,
  name: string,
  startTime: string,  // HH:mm format
  endTime: string,    // HH:mm format
  id: string
}
```

### State Management Patterns

1. **Local State**: Components use React `useState` for local state
2. **Caching**: User data is cached to reduce API calls
3. **Optimistic Updates**: UI updates immediately, then syncs with server
4. **Error Handling**: Toast notifications for errors

### Performance Optimizations

1. **Memoization**: `useMemo` for expensive calculations
2. **Lazy Loading**: Components loaded on demand
3. **Pagination**: Limits data displayed
4. **Debouncing**: Search inputs debounced (if implemented)
5. **Caching**: User data cached to avoid redundant API calls

### Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- Adaptive layouts for calendar and tables
- Touch-friendly buttons and interactions

### Dark Mode Support

- All components support dark mode
- Uses Tailwind CSS dark mode classes
- Consistent color scheme across components

---

## Usage Guide

### For Employees

#### Viewing Your Roster
1. Navigate to **Dashboard → Roster-Management → My Roster**
2. Use arrow buttons to navigate between months
3. View your assigned shifts with color-coded indicators
4. Click download icon to export your schedule as CSV

#### Creating a Swap Request
1. Click **"Swap Request"** button
2. Select the date you want to swap
3. Use filters to find the employee you want to swap with:
   - Filter by department
   - Filter by shift type
   - Search by name or ID
4. Select the target employee
5. (Optional) Enter a reason for the swap
6. Click **"Request Shift Swap"**
7. Your request will be sent to the manager for approval

#### Viewing Swap History
1. Navigate to **Dashboard → Roster-Management → My Swap Requests**
2. View all your swap requests with their current status
3. See approval dates and target employee details

### For Managers

#### Managing Swap Requests
1. Navigate to **Dashboard → Roster-Management → Swap Requests**
2. Review statistics cards for quick overview
3. View request details:
   - Requester and target employee
   - Date and department
   - Status
4. Click info icon to view reason (if provided)
5. Approve or reject requests:
   - **Approve**: Two-step process (Employee Approval → Manager Approval)
   - **Reject**: Immediately rejects the request
6. Export requests as CSV if needed

#### Managing Team Roster
1. Navigate to **Dashboard → Roster-Management → Team Roster**
2. Use month navigation to view different months
3. **Add Shift**: Click "+" on an empty date cell
4. **Edit Shift**: Click edit icon on an assigned shift
5. **Swap Shifts**: Click swap icon to swap between two employees
6. **Bulk Operations**:
   - Click download icon to export current schedule as Excel
   - Click upload icon to import shifts from Excel file
7. Use filters to narrow down employee list:
   - Search by name
   - Filter by department
   - Filter by shift type

#### Excel Import/Export

**Exporting**:
1. Click download icon in Team Roster
2. Excel file is generated with:
   - Employee ID and Name columns
   - Date columns for each day of the month
   - Data validation for shift timings
3. File is automatically downloaded

**Importing**:
1. Prepare Excel file with format:
   - First row: Headers (employeeId, employeeName, date columns)
   - Subsequent rows: Employee data
2. Click upload icon
3. Select Excel file
4. System processes and assigns shifts
5. Success message shows number of entries processed

---

## Best Practices

### For Employees
- Submit swap requests well in advance
- Provide clear reasons for swap requests
- Check your roster regularly
- Export your schedule for personal records

### For Managers
- Review swap requests promptly
- Consider business needs when approving/rejecting
- Use bulk Excel operations for efficiency
- Keep team roster updated regularly
- Communicate schedule changes to team members

---

## Troubleshooting

### Common Issues

1. **Swap request not appearing**
   - Check if manager ID is correctly assigned
   - Verify request was successfully created
   - Refresh the page

2. **Shift not displaying**
   - Verify shift timing data is available
   - Check user profile for shift assignments
   - Ensure date format is correct (YYYY-MM-DD)

3. **Excel import failing**
   - Verify file format matches expected structure
   - Check for empty cells or invalid data
   - Ensure shift timings match available options

4. **Permission errors**
   - Verify user has required permissions
   - Check role assignments
   - Contact administrator if issues persist

---

## Future Enhancements

Potential improvements for the module:
- Real-time notifications for swap requests
- Shift conflict detection
- Automated shift assignment based on rules
- Integration with attendance system
- Mobile app support
- Shift templates
- Recurring shift patterns
- Shift coverage analytics
- Employee availability calendar
- Shift bidding system

---

## Support

For technical support or questions about the Roaster Management module, please contact:
- **Development Team**: [Contact Information]
- **Documentation**: This file
- **Issue Tracking**: [Issue Tracker URL]

---

**Last Updated**: [Current Date]
**Version**: 1.0
**Module**: Roaster Management

