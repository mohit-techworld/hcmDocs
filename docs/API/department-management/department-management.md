---
sidebar_position: 1
---

# Department Management

<!-- # Department Management API Documentation -->

## Overview

The Department Management API provides comprehensive functionality for managing organizational departments and their allocations to employees. This system enables administrators to create, manage, and assign departments while maintaining proper access control and data integrity.

### Key Features

- **Department CRUD Operations**: Create, read, update, and delete departments
- **Department Allocation Management**: Assign departments to employees
- **Permission-Based Access Control**: Role-based security for sensitive operations
- **JWT Authentication**: Secure token-based authentication
- **Data Validation**: Comprehensive input validation and error handling

## Base URL

```
https://your-api-domain.com/api
```

## Authentication

### Authentication Flow

The API uses JSON Web Tokens (JWT) for authentication. All endpoints require a valid JWT token except for login/registration endpoints.

#### Authentication Process

1. **Login**: Obtain JWT token from authentication endpoint
2. **Token Usage**: Include token in Authorization header for all requests
3. **Token Validation**: Server validates token on each request
4. **Permission Check**: Additional permission validation for restricted operations

#### Authorization Header Format

```http
Authorization: Bearer <your_jwt_token>
```

### Permission System

The API implements a role-based permission system:

- **company-hierarchy**: Required for creating, updating, and deleting departments
- **Standard Access**: Default permission for read operations

## System Architecture

### Request Flow

```
Client Request → JWT Validation → Permission Check → Controller → Database → Response
```

### Data Models

#### Department Model
```javascript
{
  _id: "ObjectId",
  department: "String (required, unique)",
  createdAt: "Date",
  updatedAt: "Date"
}
```

#### User Model (Department Allocation)
```javascript
{
  _id: "ObjectId",
  employee_Id: "String (required, unique)",
  departmentAlocated: ["String"], // Array of department names
  permission: ["String"], // Array of user permissions
  // ... other user fields
}
```

## Department Management API

### Create Department

Creates a new department in the system.

**Endpoint**: `POST /v1/departments`

**Authentication**: Required (JWT)

**Permissions**: `company-hierarchy`

**Request Body**:
```json
{
  "department": "Human Resources"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "department": "Human Resources",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**:

*400 Bad Request - Missing department name*:
```json
{
  "success": false,
  "message": "Department name is required"
}
```

*400 Bad Request - Department already exists*:
```json
{
  "success": false,
  "message": "Department already exists"
}
```

*401 Unauthorized - Missing or invalid token*:
```json
{
  "success": false,
  "message": "Unauthorized. User or permission data missing."
}
```

*403 Forbidden - Insufficient permissions*:
```json
{
  "success": false,
  "message": "Access denied. Missing required permission(s): Contact your administrator."
}
```

**Business Rules**:
- Department name must be unique
- Department name is required and cannot be empty
- User must have `company-hierarchy` permission

### Get All Departments

Retrieves all departments in the system.

**Endpoint**: `GET /v1/departments`

**Authentication**: Required (JWT)

**Permissions**: None (authenticated users only)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Departments retrieved successfully",
  "totalCount": 3,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "department": "Human Resources",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6789012346",
      "department": "Engineering",
      "createdAt": "2024-01-14T09:15:00.000Z",
      "updatedAt": "2024-01-14T09:15:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6789012347",
      "department": "Marketing",
      "createdAt": "2024-01-13T14:45:00.000Z",
      "updatedAt": "2024-01-13T14:45:00.000Z"
    }
  ]
}
```

**Business Rules**:
- Results are sorted by creation date (newest first)
- Returns empty array if no departments exist
- Includes total count for pagination purposes

### Get Department by ID

Retrieves a specific department by its unique identifier.

**Endpoint**: `GET /v1/departments/:id`

**Authentication**: Required (JWT)

**Permissions**: None (authenticated users only)

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the department

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "department": "Human Resources",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Department retrieved successfully"
}
```

**Error Responses**:

*404 Not Found - Department not found*:
```json
{
  "success": false,
  "message": "Department not found"
}
```

*500 Internal Server Error - Invalid ObjectId format*:
```json
{
  "success": false,
  "message": "Cast to ObjectId failed for value \"invalid-id\" (type string) at path \"_id\""
}
```

### Update Department

Updates an existing department's information.

**Endpoint**: `PUT /v1/departments/:id`

**Authentication**: Required (JWT)

**Permissions**: `company-hierarchy`

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the department

**Request Body**:
```json
{
  "department": "Human Resources & Talent Management"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "department": "Human Resources & Talent Management",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  },
  "message": "Department updated successfully"
}
```

**Error Responses**:

*400 Bad Request - Missing department name*:
```json
{
  "success": false,
  "message": "Department name is required"
}
```

*404 Not Found - Department not found*:
```json
{
  "success": false,
  "message": "Department not found"
}
```

**Business Rules**:
- Department must exist before updating
- New department name is required
- User must have `company-hierarchy` permission

### Delete Department

Removes a department from the system.

**Endpoint**: `DELETE /v1/departments/:id`

**Authentication**: Required (JWT)

**Permissions**: `company-hierarchy`

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the department

**Success Response** (200):
```json
{
  "success": true,
  "message": "Department deleted successfully"
}
```

**Error Responses**:

*404 Not Found - Department not found*:
```json
{
  "success": false,
  "message": "Department not found"
}
```

**Business Rules**:
- Department must exist before deletion
- User must have `company-hierarchy` permission
- Consider impact on allocated users before deletion

## Department Allocation Management API

### Get User's Allocated Departments

Retrieves all departments allocated to a specific employee.

**Endpoint**: `GET /v1/department-allocations/users/:employee_Id`

**Authentication**: Required (JWT)

**Permissions**: None (authenticated users only)

**Path Parameters**:
- `employee_Id` (string): Unique employee identifier

**Success Response** (200):
```json
{
  "success": true,
  "message": "Allocated departments fetched successfully",
  "totalCount": 2,
  "departmentAlocated": [
    "Human Resources",
    "Engineering"
  ]
}
```

**Error Responses**:

*400 Bad Request - Missing employee_Id*:
```json
{
  "success": false,
  "message": "employee_Id is required"
}
```

*404 Not Found - User not found*:
```json
{
  "success": false,
  "message": "User not found"
}
```

**Business Rules**:
- Returns empty array if no departments are allocated
- Employee must exist in the system
- Returns actual department names, not IDs

### Add Department Allocation

Assigns one or more departments to an employee.

**Endpoint**: `POST /v1/department-allocations/users`

**Authentication**: Required (JWT)

**Permissions**: None (authenticated users only)

**Request Body**:
```json
{
  "employee_Id": "EMP001",
  "departmentNames": [
    "Human Resources",
    "Engineering",
    "Marketing"
  ]
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "3 department(s) added successfully to employee EMP001.",
  "departmentAlocated": [
    "Human Resources",
    "Engineering",
    "Marketing"
  ]
}
```

**Error Responses**:

*400 Bad Request - Missing employee_Id*:
```json
{
  "success": false,
  "message": "Employee_Id is required."
}
```

*400 Bad Request - Missing or invalid department names*:
```json
{
  "success": false,
  "message": "At least one department name is required."
}
```

*400 Bad Request - All departments already allocated*:
```json
{
  "success": false,
  "message": "All provided departments are already allocated."
}
```

*404 Not Found - User not found*:
```json
{
  "success": false,
  "message": "User not found."
}
```

**Business Rules**:
- Employee must exist in the system
- Duplicate departments are automatically filtered out
- At least one new department must be provided
- Operation is additive (doesn't remove existing allocations)

## Frontend Integration

### JavaScript SDK Example

```javascript
class DepartmentAPI {
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

  // Department Management
  async createDepartment(departmentName) {
    return this.request('/v1/departments', {
      method: 'POST',
      body: JSON.stringify({ department: departmentName })
    });
  }

  async getAllDepartments() {
    return this.request('/v1/departments');
  }

  async getDepartmentById(id) {
    return this.request(`/v1/departments/${id}`);
  }

  async updateDepartment(id, departmentName) {
    return this.request(`/v1/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ department: departmentName })
    });
  }

  async deleteDepartment(id) {
    return this.request(`/v1/departments/${id}`, {
      method: 'DELETE'
    });
  }

  // Department Allocation
  async getUserDepartments(employeeId) {
    return this.request(`/v1/department-allocations/users/${employeeId}`);
  }

  async addDepartmentAllocation(employeeId, departmentNames) {
    return this.request('/v1/department-allocations/users', {
      method: 'POST',
      body: JSON.stringify({
        employee_Id: employeeId,
        departmentNames: departmentNames
      })
    });
  }
}

// Usage Example
const api = new DepartmentAPI('https://your-api-domain.com/api', 'your-jwt-token');

// Create department
try {
  const result = await api.createDepartment('Digital Marketing');
  console.log('Department created:', result.data);
} catch (error) {
  console.error('Failed to create department:', error.message);
}

// Get all departments
try {
  const departments = await api.getAllDepartments();
  console.log('All departments:', departments.data);
} catch (error) {
  console.error('Failed to fetch departments:', error.message);
}

// Allocate departments to user
try {
  const allocation = await api.addDepartmentAllocation('EMP001', [
    'Human Resources',
    'Engineering'
  ]);
  console.log('Allocation successful:', allocation.departmentAlocated);
} catch (error) {
  console.error('Failed to allocate departments:', error.message);
}
```

### React Component Example

```javascript
import React, { useState, useEffect } from 'react';

const DepartmentManager = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDepartment, setNewDepartment] = useState('');

  const api = new DepartmentAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.getAllDepartments();
      setDepartments(response.data);
    } catch (err) {
      setError('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await api.createDepartment(newDepartment);
      setNewDepartment('');
      fetchDepartments(); // Refresh list
    } catch (err) {
      setError('Failed to create department');
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await api.deleteDepartment(id);
      fetchDepartments(); // Refresh list
    } catch (err) {
      setError('Failed to delete department');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Department Management</h2>
      
      <form onSubmit={handleCreateDepartment}>
        <input
          type="text"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          placeholder="Department name"
          required
        />
        <button type="submit">Create Department</button>
      </form>

      <ul>
        {departments.map((dept) => (
          <li key={dept._id}>
            {dept.department}
            <button onClick={() => handleDeleteDepartment(dept._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentManager;
```

## Testing Guide

### Using cURL

#### Test Authentication
```bash
# Get JWT token (replace with actual auth endpoint)
curl -X POST https://your-api-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Set token variable
export JWT_TOKEN="your-jwt-token-here"
```

#### Department Management Tests

**Create Department**:
```bash
curl -X POST https://your-api-domain.com/api/v1/departments \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"department": "Quality Assurance"}'
```

**Get All Departments**:
```bash
curl -X GET https://your-api-domain.com/api/v1/departments \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Department by ID**:
```bash
curl -X GET https://your-api-domain.com/api/v1/departments/64a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Update Department**:
```bash
curl -X PUT https://your-api-domain.com/api/v1/departments/64a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"department": "Quality Assurance & Testing"}'
```

**Delete Department**:
```bash
curl -X DELETE https://your-api-domain.com/api/v1/departments/64a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

#### Department Allocation Tests

**Get User's Allocated Departments**:
```bash
curl -X GET https://your-api-domain.com/api/v1/department-allocations/users/EMP001 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Add Department Allocation**:
```bash
curl -X POST https://your-api-domain.com/api/v1/department-allocations/users \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_Id": "EMP001",
    "departmentNames": ["Human Resources", "Engineering"]
  }'
```

### Testing Scenarios

#### Happy Path Testing
1. **Create Department**: Test successful department creation
2. **List Departments**: Verify department appears in list
3. **Get Department**: Retrieve specific department by ID
4. **Update Department**: Modify department name
5. **Allocate Department**: Assign department to user
6. **Verify Allocation**: Check user's allocated departments

#### Error Handling Testing
1. **Duplicate Department**: Try creating department with existing name
2. **Missing Fields**: Send requests without required fields
3. **Invalid IDs**: Test with malformed ObjectIds
4. **Permission Denied**: Test operations without proper permissions
5. **Non-existent Resources**: Test operations on non-existent departments/users

#### Security Testing
1. **No Token**: Test endpoints without authentication
2. **Invalid Token**: Test with malformed or expired tokens
3. **Insufficient Permissions**: Test restricted operations with basic user
4. **Token Expiry**: Test behavior when token expires

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
- **400 Bad Request**: Invalid request data or missing required fields
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error or database connection issues

### Common Error Scenarios

#### Authentication Errors
```json
{
  "success": false,
  "message": "Unauthorized. User or permission data missing."
}
```

#### Permission Errors
```json
{
  "success": false,
  "message": "Access denied. Missing required permission(s): Contact your administrator."
}
```

#### Validation Errors
```json
{
  "success": false,
  "message": "Department name is required"
}
```

#### Resource Not Found
```json
{
  "success": false,
  "message": "Department not found"
}
```

#### Duplicate Resource
```json
{
  "success": false,
  "message": "Department already exists"
}
```

## Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Token Expiry**: Automatic token expiration for security
- **Header-based Auth**: Tokens sent in Authorization header

### Authorization Security
- **Role-based Access**: Permission-based operation control
- **Granular Permissions**: Specific permissions for different operations
- **Middleware Protection**: Authentication and authorization middleware

### Data Security
- **Input Validation**: Comprehensive request validation
- **Duplicate Prevention**: Automatic duplicate detection
- **Error Handling**: Secure error responses without sensitive data exposure

### API Security Best Practices
- **HTTPS Only**: All communication over encrypted connections
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Input Sanitization**: Validate and sanitize all user inputs
- **Error Logging**: Comprehensive error logging without exposing sensitive data

## Troubleshooting

### Common Issues

#### 1. Authentication Failures

**Issue**: "Unauthorized. User or permission data missing."

**Causes**:
- Missing Authorization header
- Invalid JWT token format
- Expired token
- Malformed token

**Solutions**:
- Ensure Authorization header is present: `Authorization: Bearer <token>`
- Verify token is valid and not expired
- Re-authenticate to get new token
- Check token format (should be JWT)

#### 2. Permission Denied

**Issue**: "Access denied. Missing required permission(s):"

**Causes**:
- User lacks required permissions
- Incorrect role assignment
- Permission system misconfiguration

**Solutions**:
- Contact administrator for permission assignment
- Verify user has `company-hierarchy` permission for write operations
- Check user's role and permission configuration

#### 3. Department Already Exists

**Issue**: "Department already exists"

**Causes**:
- Attempting to create duplicate department
- Case-sensitive name conflicts

**Solutions**:
- Check existing departments before creating
- Use unique department names
- Consider updating existing department instead

#### 4. Department Not Found

**Issue**: "Department not found"

**Causes**:
- Invalid department ID
- Department was deleted
- Database connection issues

**Solutions**:
- Verify department ID is correct
- Check if department exists in system
- Use valid MongoDB ObjectId format

#### 5. User Not Found

**Issue**: "User not found"

**Causes**:
- Invalid employee_Id
- User not in system
- Database synchronization issues

**Solutions**:
- Verify employee_Id is correct
- Ensure user exists in the system
- Check user creation process

### Debugging Tips

#### API Request Debugging
1. **Check Headers**: Verify all required headers are present
2. **Validate Token**: Ensure JWT token is valid and not expired
3. **Request Format**: Verify JSON request format is correct
4. **URL Format**: Check endpoint URLs are correctly formatted

#### Response Debugging
1. **Status Codes**: Pay attention to HTTP status codes
2. **Error Messages**: Read error messages carefully
3. **Response Format**: Verify response structure matches expectations
4. **Data Validation**: Check if response data is in expected format

#### Network Debugging
1. **CORS Issues**: Ensure proper CORS configuration
2. **Network Connectivity**: Verify API server is accessible
3. **SSL/TLS**: Check certificate validity for HTTPS
4. **DNS Resolution**: Verify domain name resolution

### Performance Considerations

#### API Optimization
- **Pagination**: Implement pagination for large datasets
- **Caching**: Use appropriate caching strategies
- **Database Indexes**: Ensure proper database indexing
- **Connection Pooling**: Use database connection pooling

#### Rate Limiting
- **Request Limits**: Implement appropriate rate limits
- **Throttling**: Use request throttling for high-traffic endpoints
- **Monitoring**: Monitor API usage patterns

#### Error Monitoring
- **Logging**: Implement comprehensive error logging
- **Alerting**: Set up alerts for critical errors
- **Monitoring**: Use APM tools for performance monitoring

## Conclusion

This API provides a robust foundation for department management with proper authentication, authorization, and error handling. The system is designed to be scalable, secure, and maintainable while providing comprehensive functionality for organizational department management.

For additional support or questions, please contact the development team or refer to the internal documentation system.