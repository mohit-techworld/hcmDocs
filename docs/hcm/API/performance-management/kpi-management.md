---
sidebar_position: 1
title: "KPI Management"
description: "The KPI Set Management API allows organizations to define, manage, and track sets of Key Performance Indicators (KPIs) by designation (job role) and frequency (e.g."
---

# KPI Management


{/* # KPI Set Management API Documentation */}

## System Overview

The **KPI Set Management API** allows organizations to define, manage, and track sets of Key Performance Indicators (KPIs) by **designation** (job role) and **frequency** (e.g., monthly, quarterly, yearly). Each set version is immutable—new versions are created for changes, preserving historical records. This forms the foundation for structured performance evaluation systems across the organization.

## Base URL
```
/v1/kpis
```

## Authentication

- **All endpoints** require JWT authentication via the `verifyJWT` middleware.
- **Superadmin/Admin access** typically required for creation, update, and deletion.

## KPI Set Structure

Each KPI set contains:
- **Designation**: The job role/title this template applies to (e.g., "Sales Manager")
- **Frequency**: The evaluation interval (e.g., "monthly", "quarterly", "yearly")
- **Version**: Auto-incremented integer (unique per designation-frequency)
- **KPI List**: Array of KPI definitions (name, type, marks, target for quantitative KPIs)
- **Total Marks**: Sum total of marks (must match sum of all KPI marks)
- **Created/Updated By**: User identifier for audit purposes

### Example KPI Set
```json
{
  "_id": "64f8b2a1c4d5e6f7g8h9i0j1",
  "designation": "Sales Manager",
  "frequency": "monthly",
  "version": 2,
  "kpis": [
    {
      "kpiName": "Number of Sales",
      "type": "quantitative",
      "marks": 60,
      "target": 60
    },
    {
      "kpiName": "Product Knowledge",
      "type": "qualitative",
      "marks": 40
    }
  ],
  "totalMarks": 100,
  "createdBy": "admin",
  "updatedBy": "admin",
  "createdAt": "2024-01-25T10:30:00.000Z",
  "updatedAt": "2024-01-27T12:00:00.000Z"
}
```

## API Endpoints

### Create KPI Set

**POST** `/create`

Create a new KPI set for a specific designation and frequency. If no `version` is provided, it automatically increments the latest version.

**Request Body:**
```json
{
  "designation": "Sales Manager",
  "frequency": "monthly",
  "kpis": [
    {
      "kpiName": "Number of Sales",
      "type": "quantitative",
      "marks": 60,
      "target": 60
    },
    {
      "kpiName": "Product Knowledge",
      "type": "qualitative",
      "marks": 40
    }
  ],
  "totalMarks": 100,
  "createdBy": "admin",
  "version": 2 // Optional: Will auto-increment if not provided
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "KPI Set created successfully with version 2",
  "data": {
    "_id": "64f8b2a1c4d5e6f7g8h9i0j1",
    "designation": "Sales Manager",
    "frequency": "monthly",
    "version": 2,
    "kpis": [...],
    "totalMarks": 100,
    "createdBy": "admin",
    "createdAt": "2024-01-25T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// Duplicate version for designation/frequency
{
  "success": false,
  "message": "A KPI set with this (designation, frequency, version) already exists."
}

// Server error
{
  "success": false,
  "message": "Server Error"
}
```

### Get KPI Set

**GET** `/`

Fetch a specific KPI set by `designation`, `frequency`, and optionally `version`. If `version` is not specified, returns the latest version.

**Query Parameters:**
- `designation` (string, required) – Job role/title
- `frequency` (string, required) – Evaluation interval
- `version` (number, optional) – Set version (defaults to latest)

**Example:**
```
GET /v1/kpis?designation=Sales%20Manager&frequency=monthly&version=2
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8b2a1c4d5e6f7g8h9i0j1",
    "designation": "Sales Manager",
    "frequency": "monthly",
    "version": 2,
    "kpis": [...],
    "totalMarks": 100,
    "createdAt": "2024-01-25T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// Missing required parameters
{
  "success": false,
  "message": "designation and frequency are required."
}

// KPI set not found
{
  "success": false,
  "message": "KPI Set not found."
}

// Server error
{
  "success": false,
  "message": "Server Error"
}
```

### Get All KPI Sets

**GET** `/all`

Retrieve all KPI sets (full history), optionally filtered by `designation` and/or `frequency`. Returns an array sorted by creation date (newest first).

**Query Parameters:**
- `designation` (string, optional) – Filter by job role
- `frequency` (string, optional) – Filter by evaluation interval

**Example:**
```
GET /v1/kpis/all?designation=Sales%20Manager
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64f8b2a1c4d5e6f7g8h9i0j3",
      "designation": "Sales Manager",
      "frequency": "monthly",
      "version": 3,
      "kpis": [...],
      "totalMarks": 100,
      "createdAt": "2024-02-20T11:45:00.000Z"
    },
    {
      "_id": "64f8b2a1c4d5e6f7g8h9i0j2",
      "designation": "Sales Manager",
      "frequency": "monthly",
      "version": 2,
      "kpis": [...],
      "totalMarks": 100,
      "createdAt": "2024-01-25T10:30:00.000Z"
    },
    {
      "_id": "64f8b2a1c4d5e6f7g8h9i0j1",
      "designation": "Sales Manager",
      "frequency": "monthly",
      "version": 1,
      "kpis": [...],
      "totalMarks": 100,
      "createdAt": "2023-12-15T09:15:00.000Z"
    }
  ]
}
```

### Update KPI Set

**PUT** `/update/:id`

Update an existing KPI set by `id`. Only mutable fields (`designation`, `frequency`, `kpis`, `totalMarks`, `version`, `updatedBy`) are updated.  
Any change that would cause a duplicate (designation, frequency, version) will be rejected.

**Request Body:**
```json
{
  "designation": "Sales Manager",
  "frequency": "monthly",
  "kpis": [...],
  "totalMarks": 100,
  "version": 2,
  "updatedBy": "admin"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "KPI Set updated successfully",
  "data": {
    "_id": "64f8b2a1c4d5e6f7g8h9i0j1",
    "designation": "Sales Manager",
    "frequency": "monthly",
    "version": 2,
    "kpis": [...],
    "totalMarks": 100,
    "updatedAt": "2024-01-27T12:00:00.000Z",
    "updatedBy": "admin"
  }
}
```

**Error Responses:**
```json
// KPI Set not found
{
  "success": false,
  "message": "KPI Set not found."
}

// Duplicate version for designation/frequency
{
  "success": false,
  "message": "Another KPI set already has the same (designation, frequency, version)."
}

// Server error
{
  "success": false,
  "message": "Server Error"
}
```

### Delete KPI Set

**DELETE** `/delete/:id`

Permanently delete a KPI set by `id`.

**Success Response (200):**
```json
{
  "success": true,
  "message": "KPI Set permanently deleted."
}
```

**Error Responses:**
```json
// KPI Set not found
{
  "success": false,
  "message": "KPI Set not found."
}

// Server error
{
  "success": false,
  "message": "Server Error"
}
```

## Error Handling

| Status | Error Message                                      | Description                               |
|--------|-----------------------------------------------------|-------------------------------------------|
| 400    | `designation and frequency are required.`           | Missing required query parameters         |
| 400    | `A KPI set with this (designation, frequency, version) already exists.` | Duplicate set attempted      |
| 404    | `KPI Set not found.`                                | No matching KPI set found                 |
| 500    | `Server Error`                                      | Internal server error                     |

## Best Practices

- **Immutability**: Each version of a KPI set is preserved for historical reference. Always create a new version for changes, do not edit existing versions.
- **Validation**: Ensure the sum of KPI marks equals `totalMarks` before saving.
- **Uniqueness**: The combination of `designation`, `frequency`, and `version` must be unique.
- **Audit Trail**: Track `createdBy` and `updatedBy` for accountability.
- **Lifecycle**: Use the latest version for active evaluations; retain older versions for historical analysis.

## Frontend Integration Example (JavaScript/React)

```javascript
const API_BASE = 'https://your-api-domain.com/v1/kpis';

// Create a new KPI Set
async function createKpiSet(setData) {
  const response = await fetch(`${API_BASE}/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(setData)
  });
  return await response.json();
}

// Get the latest KPI Set for a designation and frequency
async function getLatestKpiSet(designation, frequency) {
  const response = await fetch(`${API_BASE}/?designation=${encodeURIComponent(designation)}&frequency=${encodeURIComponent(frequency)}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  return await response.json();
}

// Get all KPI Sets, optionally filtered
async function getAllKpiSets({ designation, frequency } = {}) {
  const params = new URLSearchParams();
  if (designation) params.append('designation', designation);
  if (frequency) params.append('frequency', frequency);
  const response = await fetch(`${API_BASE}/all?${params}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  return await response.json();
}

// Usage in a React component
function KpiSetManager() {
  const [kpiSets, setKpiSets] = useState([]);

  useEffect(() => {
    getAllKpiSets({ designation: 'Sales Manager' })
      .then(res => res.success && setKpiSets(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    
      KPI Sets for Sales Manager
      
        {kpiSets.map(set => (
          
            {set.designation} ({set.frequency}) v{set.version}
          
        ))}
      
    
  );
}
```

## Summary Table

| Endpoint                | Method | Auth | Description                                 | Parameters                       | Success Response         | Error Responses                        |
|-------------------------|--------|------|---------------------------------------------|-----------------------------------|-------------------------|----------------------------------------|
| `/create`               | POST   | JWT  | Create new KPI set                          | Body: `designation`, `frequency`, `kpis`, `totalMarks`, `createdBy`, `version` (optional) | 201: Created set        | 400: Validation/duplicate, 500: Server |
| `/`                     | GET    | JWT  | Get specific/latest KPI set                 | Query: `designation`, `frequency`, `version` (optional) | 200: KPI set data       | 400: Missing params, 404: Not found, 500: Server |
| `/all`                  | GET    | JWT  | Get all KPI sets (filtered)                 | Query: `designation` (optional), `frequency` (optional) | 200: List of sets       | 500: Server                            |
| `/update/:id`           | PUT    | JWT  | Update existing KPI set                     | Path: `id`, Body: fields to update | 200: Updated set        | 400: Validation/duplicate, 404: Not found, 500: Server |
| `/delete/:id`           | DELETE | JWT  | Delete KPI set                              | Path: `id`                       | 200: Deletion success   | 404: Not found, 500: Server            |

## Example Workflow

1. **Create a new KPI set** for "Sales Manager" (monthly) with version 1.
2. **Evaluate performance** using this set for a period.
3. **Update requirements**: Create version 2 with revised KPIs.
4. **Continue evaluations** using version 2; version 1 remains for historical reference.
5. **Audit/analyze**: Retrieve all versions for trend analysis or reporting.

## Security

- **Authentication**: All endpoints require valid JWT; typically restricted to HR/admins.
- **Data Integrity**: Input validation ensures only valid, non-duplicate sets are saved.
- **Audit**: `createdBy` and `updatedBy` track all changes.

This API provides a robust, versioned foundation for organizational performance management, enabling structured, auditable, and scalable KPI-based evaluations.