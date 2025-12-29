---
title: Demo Management Component
sidebar_position: 1
---

# Demo Management Component (MS1 Client)

> **Note:** This is the **client-side React component** documentation. For the server-side API, see [MS1 Server - Demo Management API](../../ms1-server/modules/demo-management).

The Demo Management component is a React-based admin interface for managing demo requests. It provides a comprehensive dashboard for viewing, filtering, scheduling, and managing customer demo requests with real-time updates and advanced filtering capabilities.

## Overview

The `DemoEnquiry` component (`components/demo-enquiry/DemoEnquiry.jsx`) provides administrators with a powerful interface to:

- 📋 View all demo requests in a searchable, filterable table
- 🔍 Filter by status, date range, and search terms
- 📅 Schedule and reschedule demo meetings
- ✅ Update demo request statuses
- 📧 Manage email notifications
- 📊 Export data to CSV/Excel
- 💬 Add meeting notes and track history

## Component Structure

```
╔═══════════════════════════════════════════════════════════════════════╗
║              DEMO MANAGEMENT COMPONENT STRUCTURE                       ║
╚═══════════════════════════════════════════════════════════════════════╝

DemoEnquiry Component
│
├── 📊 Header Section
│   ├── Title & Description
│   ├── Total Count Badge
│   ├── Cache Indicator
│   ├── Export Dropdown (CSV/Excel)
│   └── Notification Email Manager Button
│
├── 🔍 Filters & Search Section
│   ├── Status Filter Buttons (All, Pending, Scheduled, etc.)
│   ├── Search Input (Name, Email, Company)
│   ├── Sort Options (Date, Name, Company, Status)
│   └── Date Range Filter
│
├── 📋 Demo Requests Table
│   ├── Expandable Rows
│   ├── Status Badges (Color-coded)
│   ├── Action Buttons (Schedule, Complete, Cancel, etc.)
│   ├── Quick Actions (View Details, Contact)
│   └── Loading States
│
├── 📝 Modals
│   ├── DemoRequestDetailsModal
│   │   ├── Full Request Details
│   │   ├── Schedule/Reschedule Form
│   │   ├── Status Update Form
│   │   └── Meeting Notes History
│   │
│   └── NotificationEmailManager
│       ├── Email Status Overview
│       ├── Resend Failed Emails
│       └── Email Delivery Status
│
└── 🔄 State Management
    ├── Demo Requests Data
    ├── Filters & Search State
    ├── UI State (Modals, Expanded Rows)
    └── Loading & Error States
```

## Key Features

### 1. Advanced Filtering & Search

**Status Filtering:**
- Filter by: All, Pending, Scheduled, Completed, Cancelled, Rescheduled
- Color-coded status badges
- Real-time filter updates

**Search Functionality:**
- Search across: Name, Email, Company Name
- Debounced search (300ms delay)
- Search result caching for performance
- Instant results from cache when available

**Sorting:**
- Sort by: Date, Name, Company, Status
- Ascending/Descending order
- Client-side sorting for fast updates

**Date Range Filter:**
- Filter requests by submission date
- Start and end date selection
- Clear date range option

### 2. Demo Request Management

**View Request Details:**
- Click on any request to view full details
- Modal shows:
  - Contact information
  - Company details
  - Selected features
  - Status history
  - Meeting notes
  - Email delivery status

**Schedule Demo:**
- Select date and time
- Add meeting link (Zoom, Google Meet, etc.)
- Add notes for the meeting
- System automatically sends scheduled email

**Update Status:**
- Quick status updates (Complete, Cancel)
- Add notes with status change
- Optimistic UI updates (instant feedback)
- Automatic email notifications

**Reschedule Demo:**
- Change existing demo date/time
- Update meeting link
- Add reschedule notes
- System sends rescheduled email

### 3. Export Functionality

**CSV Export:**
- Export filtered results to CSV
- Includes all request fields
- Formatted for Excel compatibility

**Excel Export:**
- Export to .xlsx format
- Formatted columns with proper widths
- Includes all request details
- Ready for analysis

### 4. Email Notification Management

**Notification Email Manager:**
- View email delivery status for all requests
- Resend failed emails
- Track email delivery attempts
- Monitor email queue status

**Email Types Tracked:**
- OTP Email
- Confirmation Email
- Scheduled Email
- Rescheduled Email
- Completed Email
- Cancelled Email
- Admin Notification

### 5. Performance Optimizations

**Search Caching:**
- Caches search results for instant display
- Limits cache size to 50 entries
- Shows cache indicator when using cached data

**Optimistic Updates:**
- UI updates instantly before API response
- Reverts on error
- Provides immediate feedback

**Debounced Search:**
- Reduces API calls
- 300ms delay before search
- Prevents excessive requests

## Component Flow

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    COMPONENT INTERACTION FLOW                          ║
╚═══════════════════════════════════════════════════════════════════════╝

1. Component Mounts
   │
   ├──► Load Configuration (Features, Status Config, Sort Options)
   │
   └──► Load Demo Requests (with current filters)
        │
        ├──► Check Cache First
        │    │
        │    ├──► Cache Hit → Display Cached Data
        │    │
        │    └──► Cache Miss → API Call
        │         │
        │         └──► Cache Response
        │
        └──► Display Requests in Table

2. User Interaction
   │
   ├──► Filter Change
   │    │
   │    └──► Update Filters → Reload Requests
   │
   ├──► Search Input
   │    │
   │    └──► Debounce → Search → Update Results
   │
   ├──► Schedule Demo
   │    │
   │    ├──► Optimistic UI Update
   │    ├──► API Call
   │    ├──► Success → Refresh Data
   │    └──► Error → Revert UI
   │
   └──► Export
        │
        └──► Generate File → Download
```

## State Management

### Main State Structure

```javascript
{
  demoRequests: [],           // Array of demo requests
  filters: {
    status: 'all',            // Status filter
    search: '',                // Search query
    sortBy: 'submittedAt',    // Sort field
    sortOrder: 'desc',        // Sort direction
    dateRange: {              // Date range filter
      start: '',
      end: ''
    }
  },
  ui: {
    expandedRows: Set,         // Expanded row IDs
    selectedRequest: null,     // Currently selected request
    showDetailsModal: false,   // Details modal visibility
    showNotificationEmailManager: false  // Email manager visibility
  },
  loading: false,             // Loading state
  error: null,                // Error message
  actionLoading: Set          // Loading states for individual actions
}
```

### Configuration State

```javascript
{
  features: [],              // Available features list
  statusConfig: {},          // Status configuration with colors
  sortOptions: [],           // Sort option definitions
  loading: true              // Config loading state
}
```

## API Integration

### Service: `services/demoApi.js`

The component uses the `demoApi` service to communicate with the backend:

**Key Methods:**

```javascript
// Get all demo requests with filters
demoApi.getDemoRequests(filters)

// Get single demo request
demoApi.getDemoRequestById(id)

// Update demo request status
demoApi.updateDemoRequestStatus(id, status, note)

// Schedule demo
demoApi.scheduleDemo(id, scheduledDateTime, notes, meetingLink)

// Reschedule demo
demoApi.rescheduleDemo(id, scheduledDateTime, notes, meetingLink)

// Add meeting note
demoApi.addMeetingNote(id, note, type)

// Export to CSV
demoApi.exportDemoRequests(filters)

// Get configuration
demoApi.getFeatures()
demoApi.getStatusConfig()
demoApi.getSortOptions()
```

## UI Components

### 1. Demo Request Table

**Features:**
- Expandable rows for quick details
- Color-coded status badges
- Action buttons per row
- Responsive design
- Loading skeletons

**Row Actions:**
- 📅 Schedule Demo
- ✅ Mark Complete
- ❌ Mark Cancelled
- 🔄 Reschedule
- 👁️ View Details
- 📧 Contact

### 2. Demo Request Details Modal

**Sections:**
- Contact Information
- Company Details
- Selected Features
- Status History
- Scheduled Meeting Info
- Meeting Notes
- Email Delivery Status

**Actions:**
- Schedule/Reschedule Demo
- Update Status
- Add Meeting Note
- Resend Emails

### 3. Notification Email Manager

**Features:**
- Email delivery status overview
- Failed email list
- Resend functionality
- Email queue status
- Delivery attempt tracking

## Usage Example

```jsx
import DemoEnquiry from './components/demo-enquiry/DemoEnquiry';

function App() {
  return (
    <div>
      <DemoEnquiry />
    </div>
  );
}
```

## Key Functions

### Data Loading

```javascript
// Load demo requests with current filters
const loadDemoRequests = async () => {
  // Check cache first
  // If cache miss, call API
  // Cache response
  // Update state
}

// Refresh data after action
const refreshData = async () => {
  // Clear cache for current filters
  // Reload data
}
```

### Filtering & Search

```javascript
// Update filters
const updateFilters = (updates) => {
  // Update filter state
  // Reload requests
}

// Handle search with debounce
const handleSearch = (value) => {
  // Clear previous timer
  // Set new timer (300ms)
  // Update search filter
  // Reload requests
}
```

### Actions

```javascript
// Schedule demo with optimistic update
const handleScheduleDemo = async (request, dateTime, notes, link) => {
  // Optimistic UI update
  // API call
  // Refresh on success
  // Revert on error
}

// Update status with optimistic update
const handleUpdateStatus = async (request, newStatus, note) => {
  // Optimistic UI update
  // API call
  // Refresh on success
  // Revert on error
}
```

## Styling

The component uses Tailwind CSS with:
- Dark mode support
- Responsive design
- Color-coded status badges
- Smooth transitions
- Loading states
- Error states

## Best Practices

1. **Use Caching:** Search results are cached for better performance
2. **Optimistic Updates:** Provide instant feedback before API response
3. **Error Handling:** Always handle errors and revert optimistic updates
4. **Loading States:** Show loading indicators for better UX
5. **Debounce Search:** Prevent excessive API calls
6. **Responsive Design:** Works on all screen sizes

## Related Components

- `DemoRequestDetailsModal` - Detailed view and actions modal
- `NotificationEmailManager` - Email management interface

## Related Services

- `demoApi` - API service for demo requests
- `emailService` - Email-related operations

---

**Next Steps:**
- 📖 [MS1 Server - Demo Management Module](../ms1-server/modules/demo-management)
- 🔧 [MS1 Client - Folder Structure](../folder-structure)
- 🎨 [MS1 Client - Components Overview](./overview)

