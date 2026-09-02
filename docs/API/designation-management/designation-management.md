---
sidebar_position: 1
title: "Designation Management"
description: "The Designation Management API provides a simple yet robust system for managing job designations (job titles/roles) within an organization."
---

# Designation Management

{/* # Designation Management API Documentation */}

## System Overview

The Designation Management API provides a simple yet robust system for managing job designations (job titles/roles) within an organization. It allows administrators to create, read, update, and delete designations, each with an associated notice period. This system is typically used as part of a larger HR management platform and supports organizational structure management.

## Base URL
```
/v1/designation
```

## Authentication Requirements

- **All Routes**: JWT authentication required via `verifyJWT` middleware
- **Admin Access**: Typically restricted to HR administrators or super admins
- **Validation**: Strict input validation using Joi schema validation

## API Endpoints

### Create Designation
**POST** `/add`

Creates a new designation with a default notice period.

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "designation_name": "Senior Software Engineer",
  "notice_period": 30
}
```

**Field Descriptions:**
- `designation_name`: (Required) Name of the job designation (e.g., "Software Engineer", "Product Manager")
- `notice_period`: (Required) Number of days for the notice period (must be ≥ 0)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8b2a1c4d5e6f7g8h9i0j1",
    "designation_name": "Senior Software Engineer",
    "notice_period": 30,
    "createdAt": "2024-01-25T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// Missing required fields (400)
{
  "success": false,
  "message": "designation_name is required"
}

// Invalid notice period (400)
{
  "success": false,
  "message": "notice_period must be greater than or equal to 0"
}

// Duplicate designation (400)
{
  "success": false,
  "message": "Designation already exists"
}

// Server error (500)
{
  "success": false,
  "message": "Server Error"
}
```

### Get All Designations
**GET** `/get`

Retrieves all designations in alphabetical order.

**Authentication:** Required (JWT)

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "64f8b2a1c4d5e6f7g8h9i0j1",
      "designation": "Product Manager",
      "notice_period": 30,
      "createdAt": "2024-01-23T09:15:00.000Z"
    },
    {
      "id": "64f8b2a1c4d5e6f7g8h9i0j2",
      "designation": "Senior Software Engineer",
      "notice_period": 30,
      "createdAt": "2024-01-25T10:30:00.000Z"
    },
    {
      "id": "64f8b2a1c4d5e6f7g8h9i0j3",
      "designation": "Software Engineer",
      "notice_period": 30,
      "createdAt": "2024-01-20T14:45:00.000Z"
    }
  ]
}
```

### Get Designations (Filter by Name)
**GET** `/:designation`

Retrieves designations filtered by exact name match.

**Authentication:** Required (JWT)

**Request Parameters:**
- `designation` (string): (Required) Exact designation name to filter by

**Example:**
```
GET /v1/designation/Senior%20Software%20Engineer
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "64f8b2a1c4d5e6f7g8h9i0j2",
      "designation": "Senior Software Engineer",
      "notice_period": 30,
      "createdAt": "2024-01-25T10:30:00.000Z"
    }
  ]
}
```

### Update Designation
**PUT** `/:id`

Updates an existing designation by ID.

**Authentication:** Required (JWT)

**Request Parameters:**
- `id` (string): (Required) Designation ID

**Request Body:**
```json
{
  "designation_name": "Lead Software Engineer",
  "notice_period": 60
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64f8b2a1c4d5e6f7g8h9i0j2",
    "designation": "Lead Software Engineer",
    "notice_period": 60,
    "createdAt": "2024-01-25T10:30:00.000Z",
    "updatedAt": "2024-01-27T11:45:00.000Z"
  }
}
```

**Error Responses:**
```json
// Invalid ID (400)
{
  "success": false,
  "message": "Invalid designation ID"
}

// Designation not found (404)
{
  "success": false,
  "message": "Designation not found"
}

// Duplicate name (400)
{
  "success": false,
  "message": "Designation name already exists"
}

// Validation error (400)
{
  "success": false,
  "message": "notice_period must be greater than or equal to 0"
}
```

### Delete Designation
**DELETE** `/:id`

Deletes a designation by ID.

**Authentication:** Required (JWT)

**Request Parameters:**
- `id` (string): (Required) Designation ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Designation deleted successfully"
}
```

**Error Responses:**
```json
// Invalid ID (400)
{
  "success": false,
  "message": "Invalid designation ID"
}

// Designation not found (404)
{
  "success": false,
  "message": "Designation not found"
}

// Server error (500)
{
  "success": false,
  "message": "Server Error"
}
```

## Data Model

```javascript
// Designation Schema Structure
{
  _id: ObjectId,
  designation_name: String,    // Unique, e.g., "Software Engineer", "Product Manager"
  notice_period: Number,      // In days, default varies by organization
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Integration Example (React/JavaScript)

```javascript
// API Configuration
const API_BASE_URL = 'https://your-api-domain.com/v1/designation';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
});

// Designation Service Class
class DesignationService {
  // Create new designation
  async createDesignation(designation, noticePeriod) {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        designation_name: designation,
        notice_period: noticePeriod
      })
    });
    return await response.json();
  }

  // Get all designations
  async getDesignations() {
    const response = await fetch(`${API_BASE_URL}/get`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await response.json();
  }

  // Update designation
  async updateDesignation(id, designation, noticePeriod) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        designation_name: designation,
        notice_period: noticePeriod
      })
    });
    return await response.json();
  }

  // Delete designation
  async deleteDesignation(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await response.json();
  }
}

// React Hook Example
const useDesignations = () => {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const service = new DesignationService();

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const response = await service.getDesignations();
      if (response.success) {
        setDesignations(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createDesignation = async (designation, noticePeriod) => {
    setLoading(true);
    try {
      const response = await service.createDesignation(designation, noticePeriod);
      await fetchDesignations(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  return { designations, loading, error, fetchDesignations, createDesignation };
};
```

## Error Handling

### Common Error Responses

| HTTP Status | Response Body Example                          | Description                                      |
|-------------|-----------------------------------------------|--------------------------------------------------|
| 400         | `{"success":false,"message":"Validation error"}` | Input validation failed (missing/invalid fields) |
| 400         | `{"success":false,"message":"Designation already exists"}` | Duplicate designation name                      |
| 400         | `{"success":false,"message":"Invalid designation ID"}` | Malformed or invalid ID provided                |
| 404         | `{"success":false,"message":"Designation not found"}` | Specified designation does not exist            |
| 500         | `{"success":false,"message":"Server Error"}`   | Internal server error                            |

## Security Features

- **Authentication**: All routes require a valid JWT
- **Validation**: Strict input validation using Joi schemas
- **Idempotency**: Prevents duplicate designation names
- **Audit Trail**: Created/updated timestamps on each record

## Best Practices

- **Uniqueness**: Designation names must be unique across the organization
- **Non-Negative Notice Period**: Notice period must be zero or positive
- **Consistent Case**: Consider case normalization for designation names
- **Dependency Check**: (Not enforced in this API) Consider dependencies before deletion (e.g., linked employees)
- **Regular Review**: Review and update designations periodically to match organizational changes

## Testing Guide

### cURL Examples

#### Create Designation
```bash
curl -X POST "http://localhost:3000/v1/designation/add" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"designation_name":"Technical Lead","notice_period":60}'
```

#### Get All Designations
```bash
curl -X GET "http://localhost:3000/v1/designation/get" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Specific Designation
```bash
curl -X GET "http://localhost:3000/v1/designation/Senior%20Software%20Engineer" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Designation
```bash
curl -X PUT "http://localhost:3000/v1/designation/64f8b2a1c4d5e6f7g8h9i0j1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"designation_name":"Lead Engineer","notice_period":90}'
```

#### Delete Designation
```bash
curl -X DELETE "http://localhost:3000/v1/designation/64f8b2a1c4d5e6f7g8h9i0j1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

- **Designation Not Found**: Check that the ID or name is correct and the designation exists
- **Duplicate Designation**: Ensure each designation name is unique (case-sensitive)
- **Validation Errors**: Verify all required fields are provided and notice period is non-negative
- **Server Errors**: Check server logs for detailed error information

This documentation provides a complete reference for implementing and integrating with the Designation Management API, including endpoint details, request/response examples, error handling, and frontend integration guidance.