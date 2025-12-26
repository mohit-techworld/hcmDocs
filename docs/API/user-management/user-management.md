---
sidebar_position: 1
---

# User Management

<!-- # User Management API Documentation -->

## Overview

The User Management API provides comprehensive functionality for retrieving and managing user information within the organization. This system enables secure access to user profiles, employee directories, and organizational hierarchy data with proper authentication and authorization controls.

### Key Features

- **User Profile Access**: Retrieve current user and other user profiles
- **Employee Directory**: Comprehensive employee listing with filtering capabilities
- **Department Filtering**: Filter users by department for organizational views
- **Active User Management**: Separate endpoints for active employee tracking
- **Manager Relationships**: Populated manager/subordinate relationship data
- **Security Controls**: Sensitive data exclusion and proper authentication
- **Flexible Retrieval**: Multiple ways to query user information

## Base URL

```
https://your-api-domain.com/api
```

## Authentication & Authorization

### Authentication Flow

The API uses JSON Web Tokens (JWT) for authentication. All endpoints require valid authentication.

#### Authorization Header Format

```http
Authorization: Bearer <your_jwt_token>
```

### Permission System

The API implements basic authentication requirements:

#### User Access Permissions
- **user-view**: View user profiles and directory information
- **user-manage**: Advanced user management capabilities (implied for certain operations)

## System Architecture

### Request Flow

```
Client Request → JWT Validation → Controller → Database Query → Response Processing → Client Response
```

### Data Model

#### User Model (Response Fields)
```javascript
{
  "_id": "ObjectId",
  "employee_Id": "String", // Unique employee identifier
  "first_Name": "String",
  "last_Name": "String",
  "working_Email_Id": "String",
  "department": "String",
  "designation": "String",
  "user_Avatar": "String", // URL to profile image
  "date_of_Joining": "Date",
  "isActive": "Boolean",
  "assigned_to": {
    "_id": "ObjectId",
    "first_Name": "String",
    "last_Name": "String",
    "employee_Id": "String",
    "designation": "String",
    "department": "String"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
  // Note: Sensitive fields like password, access_Token are excluded
}
```

#### Excluded Sensitive Fields
The following fields are automatically excluded from API responses:
- `password`
- `access_Token`
- `resetPasswordToken`
- `resetPasswordExpires`

## User Management API Endpoints

### Get Current User Profile

Retrieves the profile information for the authenticated user.

**Endpoint**: `GET /v1/user/profile`

**Authentication**: Required (JWT)

**Success Response** (200):
```json
{
  "success": true,
  "message": "User fetched successfully",
  "response": {
    "_id": "64a1b2c3d4e5f6789012340",
    "employee_Id": "EMP001",
    "first_Name": "John",
    "last_Name": "Doe",
    "working_Email_Id": "john.doe@company.com",
    "department": "Engineering",
    "designation": "Senior Software Engineer",
    "user_Avatar": "https://cloudinary.com/avatar/john_doe.jpg",
    "date_of_Joining": "2023-01-15T00:00:00.000Z",
    "isActive": true,
    "assigned_to": [
      {
        "_id": "64a1b2c3d4e5f6789012341",
        "first_Name": "Jane",
        "last_Name": "Smith",
        "employee_Id": "MGR001",
        "designation": "Engineering Manager",
        "department": "Engineering"
      }
    ],
    "phone": "+91-9876543210",
    "address": "123 Tech Street, Bangalore, India",
    "skills": ["JavaScript", "Node.js", "React", "MongoDB"],
    "experience": "5 years",
    "createdAt": "2023-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**:

*401 Unauthorized*:
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

*500 Internal Server Error*:
```json
{
  "success": false,
  "message": "Server error",
  "error": "Database connection failed"
}
```

**Business Rules**:
- Returns complete profile for the authenticated user
- Automatically excludes sensitive fields (password, tokens)
- Includes populated manager information in `assigned_to` field
- No additional permissions required beyond authentication

### Get User Profile by Employee ID

Retrieves profile information for a specific user by their employee ID.

**Endpoint**: `GET /v1/user/profile/:employee_Id`

**Authentication**: Required (JWT)

**Path Parameters**:
- `employee_Id` (string): Unique employee identifier

**Success Response** (200):
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "employee_Id": "EMP002",
    "first_Name": "Jane",
    "last_Name": "Smith",
    "working_Email_Id": "jane.smith@company.com",
    "department": "Engineering",
    "designation": "Engineering Manager",
    "user_Avatar": "https://cloudinary.com/avatar/jane_smith.jpg",
    "date_of_Joining": "2022-03-01T00:00:00.000Z",
    "isActive": true,
    "phone": "+91-9876543211",
    "address": "456 Manager Lane, Bangalore, India",
    "skills": ["Team Leadership", "Node.js", "System Architecture"],
    "experience": "8 years",
    "createdAt": "2022-03-01T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**:

*404 Not Found*:
```json
{
  "success": false,
  "message": "User not found"
}
```

*500 Internal Server Error*:
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

**Business Rules**:
- Queries by `employee_Id` rather than MongoDB `_id`
- Excludes MongoDB `_id` field from response
- Excludes sensitive fields for security
- Returns 404 if employee ID doesn't exist
- No manager information populated in this endpoint

### Get All Users

Retrieves a list of all users in the system with optional department filtering.

**Endpoint**: `GET /v1/user/get-all`

**Authentication**: Required (JWT)

**Query Parameters**:
- `department` (string, optional): Filter users by department

**Success Response** (200):
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012340",
      "employee_Id": "EMP001",
      "first_Name": "John",
      "last_Name": "Doe",
      "working_Email_Id": "john.doe@company.com",
      "department": "Engineering",
      "designation": "Senior Software Engineer",
      "user_Avatar": "https://cloudinary.com/avatar/john_doe.jpg",
      "date_of_Joining": "2023-01-15T00:00:00.000Z",
      "isActive": true,
      "assigned_to": [
        {
          "_id": "64a1b2c3d4e5f6789012341",
          "first_Name": "Jane",
          "last_Name": "Smith",
          "employee_Id": "MGR001",
          "designation": "Engineering Manager",
          "department": "Engineering"
        }
      ]
    },
    {
      "_id": "64a1b2c3d4e5f6789012342",
      "employee_Id": "EMP003",
      "first_Name": "Bob",
      "last_Name": "Johnson",
      "working_Email_Id": "bob.johnson@company.com",
      "department": "Marketing",
      "designation": "Marketing Specialist",
      "user_Avatar": "https://cloudinary.com/avatar/bob_johnson.jpg",
      "date_of_Joining": "2023-06-01T00:00:00.000Z",
      "isActive": true,
      "assigned_to": [
        {
          "_id": "64a1b2c3d4e5f6789012343",
          "first_Name": "Alice",
          "last_Name": "Brown",
          "employee_Id": "MGR002",
          "designation": "Marketing Manager",
          "department": "Marketing"
        }
      ]
    }
  ]
}
```

**Filtered by Department Example**:
```bash
GET /v1/user/get-all?department=Engineering
```

**Department Filter Response** (200):
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "employee_Id": "EMP001",
      "first_Name": "John",
      "last_Name": "Doe",
      "department": "Engineering",
      "designation": "Senior Software Engineer",
      "isActive": true
    }
    // ... other Engineering department employees
  ]
}
```

**Error Responses**:

*500 Internal Server Error*:
```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": "Database query failed"
}
```

**Business Rules**:
- Returns all users (both active and inactive) by default
- Supports optional department filtering via query parameter
- Results sorted by creation date (newest first)
- Includes populated manager information in `assigned_to`
- Returns limited fields for directory/listing purposes
- `count` field indicates total number of users returned

### Get Active Users Only

Retrieves a list of only active users in the system.

**Endpoint**: `GET /v1/user/get-all-active`

**Authentication**: Required (JWT)

**Success Response** (200):
```json
{
  "success": true,
  "count": 18,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012340",
      "employee_Id": "EMP001",
      "first_Name": "John",
      "last_Name": "Doe",
      "working_Email_Id": "john.doe@company.com",
      "department": "Engineering",
      "designation": "Senior Software Engineer",
      "user_Avatar": "https://cloudinary.com/avatar/john_doe.jpg",
      "date_of_Joining": "2023-01-15T00:00:00.000Z",
      "isActive": true,
      "assigned_to": [
        {
          "_id": "64a1b2c3d4e5f6789012341",
          "first_Name": "Jane",
          "last_Name": "Smith",
          "employee_Id": "MGR001",
          "designation": "Engineering Manager",
          "department": "Engineering"
        }
      ]
    }
    // ... other active employees only
  ]
}
```

**Error Responses**:

*500 Internal Server Error*:
```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": "Database query failed"
}
```

**Business Rules**:
- Returns only users where `isActive: true`
- Excludes terminated or inactive employees
- Useful for current employee directory and active team listings
- Same field selection and population as `get-all` endpoint
- Results sorted by creation date (newest first)

### Get User by MongoDB ID

Retrieves detailed user information by MongoDB ObjectId.

**Endpoint**: `GET /v1/user/get/:id`

**Authentication**: Required (JWT)

**Path Parameters**:
- `id` (string): MongoDB ObjectId of the user

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012340",
    "employee_Id": "EMP001",
    "first_Name": "John",
    "last_Name": "Doe",
    "working_Email_Id": "john.doe@company.com",
    "personal_Email_Id": "john.personal@gmail.com",
    "department": "Engineering",
    "designation": "Senior Software Engineer",
    "user_Avatar": "https://cloudinary.com/avatar/john_doe.jpg",
    "date_of_Joining": "2023-01-15T00:00:00.000Z",
    "date_of_Birth": "1990-05-15T00:00:00.000Z",
    "isActive": true,
    "phone": "+91-9876543210",
    "emergency_Contact": "+91-9876543211",
    "address": "123 Tech Street, Bangalore, India",
    "skills": ["JavaScript", "Node.js", "React", "MongoDB"],
    "experience": "5 years",
    "salary": 850000,
    "shift_Timing": "64a1b2c3d4e5f6789012350",
    "assigned_to": [
      {
        "_id": "64a1b2c3d4e5f6789012341",
        "first_Name": "Jane",
        "last_Name": "Smith",
        "employee_Id": "MGR001",
        "designation": "Engineering Manager",
        "department": "Engineering"
      }
    ],
    "permission": ["user-view", "attendance-manage"],
    "departmentAlocated": ["Engineering", "DevOps"],
    "createdAt": "2023-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**:

*400 Bad Request - Invalid ID Format*:
```json
{
  "success": false,
  "message": "Invalid Employee ID"
}
```

*404 Not Found*:
```json
{
  "success": false,
  "message": "Employee not found"
}
```

*500 Internal Server Error*:
```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": "Database query failed"
}
```

**Business Rules**:
- Requires valid MongoDB ObjectId format
- Returns comprehensive user information
- Excludes sensitive fields (password, reset tokens)
- Includes populated manager information
- Validates ObjectId format before database query
- Returns detailed profile suitable for admin/management views

## Frontend Integration

### JavaScript SDK

```javascript
class UserManagementAPI {
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
      console.error('User API Error:', error);
      throw error;
    }
  }

  // User Profile Management
  async getCurrentUserProfile() {
    return this.request('/v1/user/profile');
  }

  async getUserProfileByEmployeeId(employeeId) {
    return this.request(`/v1/user/profile/${employeeId}`);
  }

  async getUserById(id) {
    return this.request(`/v1/user/get/${id}`);
  }

  // User Directory Management
  async getAllUsers(department = null) {
    const params = department ? `?department=${encodeURIComponent(department)}` : '';
    return this.request(`/v1/user/get-all${params}`);
  }

  async getActiveUsers() {
    return this.request('/v1/user/get-all-active');
  }

  // Utility Methods
  async searchUsers(searchTerm, activeOnly = true) {
    const users = activeOnly ? await this.getActiveUsers() : await this.getAllUsers();
    
    if (!searchTerm) return users;

    const filtered = users.data.filter(user => {
      const fullName = `${user.first_Name} ${user.last_Name}`.toLowerCase();
      const employeeId = user.employee_Id.toLowerCase();
      const email = user.working_Email_Id.toLowerCase();
      const department = user.department.toLowerCase();
      const search = searchTerm.toLowerCase();

      return fullName.includes(search) || 
             employeeId.includes(search) || 
             email.includes(search) || 
             department.includes(search);
    });

    return {
      ...users,
      data: filtered,
      count: filtered.length
    };
  }

  async getUsersByDepartment(department) {
    return this.getAllUsers(department);
  }

  async getManagers() {
    const users = await this.getActiveUsers();
    
    // Filter users who have others assigned to them
    const managerIds = new Set();
    users.data.forEach(user => {
      if (user.assigned_to && user.assigned_to.length > 0) {
        user.assigned_to.forEach(manager => {
          managerIds.add(manager._id);
        });
      }
    });

    const managers = users.data.filter(user => managerIds.has(user._id));
    
    return {
      success: true,
      count: managers.length,
      data: managers
    };
  }

  async getSubordinates(managerId) {
    const users = await this.getActiveUsers();
    
    const subordinates = users.data.filter(user => {
      return user.assigned_to && user.assigned_to.some(manager => manager._id === managerId);
    });

    return {
      success: true,
      count: subordinates.length,
      data: subordinates
    };
  }

  // Helper Methods
  formatUserName(user) {
    return `${user.first_Name} ${user.last_Name}`;
  }

  formatUserDisplayName(user) {
    return `${this.formatUserName(user)} (${user.employee_Id})`;
  }

  getUserAvatarUrl(user) {
    return user.user_Avatar || '/default-avatar.png';
  }

  isUserActive(user) {
    return user.isActive === true;
  }

  getUserExperience(user) {
    if (!user.date_of_Joining) return 'N/A';
    
    const joinDate = new Date(user.date_of_Joining);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffYears > 0) {
      return `${diffYears} year${diffYears > 1 ? 's' : ''} ${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    } else {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    }
  }
}

// Usage Example
const api = new UserManagementAPI('https://your-api-domain.com/api', 'your-jwt-token');

// Get current user profile
try {
  const profile = await api.getCurrentUserProfile();
  console.log('Current user:', api.formatUserName(profile.response));
} catch (error) {
  console.error('Failed to get profile:', error.message);
}

// Get all users in Engineering department
try {
  const engineeringUsers = await api.getUsersByDepartment('Engineering');
  console.log(`Found ${engineeringUsers.count} engineers`);
} catch (error) {
  console.error('Failed to get engineering users:', error.message);
}

// Search for users
try {
  const searchResults = await api.searchUsers('john');
  console.log('Search results:', searchResults.data);
} catch (error) {
  console.error('Search failed:', error.message);
}

// Get managers list
try {
  const managers = await api.getManagers();
  console.log('Managers:', managers.data.map(m => api.formatUserDisplayName(m)));
} catch (error) {
  console.error('Failed to get managers:', error.message);
}
```

### React Component Examples

```javascript
import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId, employeeId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = new UserManagementAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    fetchUser();
  }, [userId, employeeId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (userId) {
        response = await api.getUserById(userId);
        setUser(response.data);
      } else if (employeeId) {
        response = await api.getUserProfileByEmployeeId(employeeId);
        setUser(response.data);
      } else {
        response = await api.getCurrentUserProfile();
        setUser(response.response);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="user-profile loading">Loading...</div>;
  if (error) return <div className="user-profile error">Error: {error}</div>;
  if (!user) return <div className="user-profile error">User not found</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img 
          src={api.getUserAvatarUrl(user)} 
          alt={api.formatUserName(user)}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>{api.formatUserName(user)}</h2>
          <p className="employee-id">{user.employee_Id}</p>
          <p className="designation">{user.designation}</p>
          <p className="department">{user.department}</p>
          <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-section">
          <h3>Contact Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Email:</label>
              <span>{user.working_Email_Id}</span>
            </div>
            {user.phone && (
              <div className="detail-item">
                <label>Phone:</label>
                <span>{user.phone}</span>
              </div>
            )}
            {user.address && (
              <div className="detail-item">
                <label>Address:</label>
                <span>{user.address}</span>
              </div>
            )}
          </div>
        </div>

        <div className="detail-section">
          <h3>Employment Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Date of Joining:</label>
              <span>{new Date(user.date_of_Joining).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <label>Experience:</label>
              <span>{api.getUserExperience(user)}</span>
            </div>
            {user.assigned_to && user.assigned_to.length > 0 && (
              <div className="detail-item">
                <label>Reports To:</label>
                <span>
                  {user.assigned_to.map(manager => 
                    `${manager.first_Name} ${manager.last_Name} (${manager.employee_Id})`
                  ).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {user.skills && user.skills.length > 0 && (
          <div className="detail-section">
            <h3>Skills</h3>
            <div className="skills-list">
              {user.skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const UserDirectory = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const api = new UserManagementAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    fetchUsers();
  }, [showActiveOnly]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedDepartment]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = showActiveOnly 
        ? await api.getActiveUsers()
        : await api.getAllUsers();
        
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => {
        const fullName = api.formatUserName(user).toLowerCase();
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || 
               user.employee_Id.toLowerCase().includes(search) ||
               user.working_Email_Id.toLowerCase().includes(search) ||
               user.department.toLowerCase().includes(search);
      });
    }

    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(user => user.department === selectedDepartment);
    }

    setFilteredUsers(filtered);
  };

  const getDepartments = () => {
    const departments = [...new Set(users.map(user => user.department))];
    return departments.sort();
  };

  if (loading) return <div className="user-directory loading">Loading users...</div>;
  if (error) return <div className="user-directory error">Error: {error}</div>;

  return (
    <div className="user-directory">
      <div className="directory-header">
        <h2>Employee Directory ({filteredUsers.length} employees)</h2>
        
        <div className="directory-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {getDepartments().map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <label>
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
              />
              Active Only
            </label>
          </div>
        </div>
      </div>

      <div className="user-grid">
        {filteredUsers.map(user => (
          <div key={user._id} className="user-card">
            <img 
              src={api.getUserAvatarUrl(user)} 
              alt={api.formatUserName(user)}
              className="user-avatar"
            />
            <div className="user-info">
              <h3>{api.formatUserName(user)}</h3>
              <p className="employee-id">{user.employee_Id}</p>
              <p className="designation">{user.designation}</p>
              <p className="department">{user.department}</p>
              <p className="email">{user.working_Email_Id}</p>
              {user.assigned_to && user.assigned_to.length > 0 && (
                <p className="manager">
                  Reports to: {user.assigned_to[0].first_Name} {user.assigned_to[0].last_Name}
                </p>
              )}
              <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-results">
          <p>No employees found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

const OrganizationChart = () => {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [subordinates, setSubordinates] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = new UserManagementAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const response = await api.getManagers();
      setManagers(response.data);
    } catch (error) {
      console.error('Failed to fetch managers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManagerSelect = async (manager) => {
    setSelectedManager(manager);
    try {
      const response = await api.getSubordinates(manager._id);
      setSubordinates(response.data);
    } catch (error) {
      console.error('Failed to fetch subordinates:', error);
      setSubordinates([]);
    }
  };

  if (loading) return <div className="org-chart loading">Loading organization chart...</div>;

  return (
    <div className="organization-chart">
      <h2>Organization Chart</h2>
      
      <div className="managers-list">
        <h3>Managers ({managers.length})</h3>
        <div className="manager-grid">
          {managers.map(manager => (
            <div 
              key={manager._id} 
              className={`manager-card ${selectedManager?._id === manager._id ? 'selected' : ''}`}
              onClick={() => handleManagerSelect(manager)}
            >
              <img 
                src={api.getUserAvatarUrl(manager)} 
                alt={api.formatUserName(manager)}
                className="manager-avatar"
              />
              <div className="manager-info">
                <h4>{api.formatUserName(manager)}</h4>
                <p>{manager.designation}</p>
                <p>{manager.department}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedManager && (
        <div className="subordinates-section">
          <h3>
            Team Members under {api.formatUserName(selectedManager)} ({subordinates.length})
          </h3>
          <div className="subordinates-grid">
            {subordinates.map(subordinate => (
              <div key={subordinate._id} className="subordinate-card">
                <img 
                  src={api.getUserAvatarUrl(subordinate)} 
                  alt={api.formatUserName(subordinate)}
                  className="subordinate-avatar"
                />
                <div className="subordinate-info">
                  <h4>{api.formatUserName(subordinate)}</h4>
                  <p>{subordinate.designation}</p>
                  <p>{subordinate.employee_Id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { UserProfile, UserDirectory, OrganizationChart };
```

### CSS Styling Example

```css
/* User Profile Styles */
.user-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-header {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}

.profile-info h2 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.8em;
}

.employee-id {
  color: #666;
  font-weight: bold;
  margin: 5px 0;
}

.designation {
  color: #4a90e2;
  font-weight: 500;
  margin: 5px 0;
}

.department {
  color: #666;
  margin: 5px 0;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: bold;
  text-transform: uppercase;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.status.inactive {
  background: #f8d7da;
  color: #721c24;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.2em;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 5px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-item label {
  font-weight: bold;
  color: #555;
  min-width: 120px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background: #4a90e2;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 500;
}

/* User Directory Styles */
.user-directory {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.directory-header {
  margin-bottom: 30px;
}

.directory-header h2 {
  color: #333;
  margin-bottom: 20px;
}

.directory-controls {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  font-size: 16px;
}

.filter-controls {
  display: flex;
  gap: 15px;
  align-items: center;
}

.filter-controls select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-controls label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.user-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

.user-info h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.1em;
}

.user-info p {
  margin: 5px 0;
  color: #666;
  font-size: 0.9em;
}

.email {
  word-break: break-all;
}

.manager {
  font-style: italic;
  color: #4a90e2;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* Organization Chart Styles */
.organization-chart {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.managers-list h3 {
  color: #333;
  margin-bottom: 20px;
}

.manager-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.manager-card {
  background: #fff;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 15px;
}

.manager-card:hover {
  border-color: #4a90e2;
  transform: translateY(-2px);
}

.manager-card.selected {
  border-color: #4a90e2;
  background: #f8fbff;
}

.manager-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.manager-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.manager-info p {
  margin: 2px 0;
  color: #666;
  font-size: 0.9em;
}

.subordinates-section {
  border-top: 2px solid #f0f0f0;
  padding-top: 30px;
}

.subordinates-section h3 {
  color: #333;
  margin-bottom: 20px;
}

.subordinates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.subordinate-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.subordinate-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 10px;
  display: block;
}

.subordinate-info h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 1em;
}

.subordinate-info p {
  margin: 2px 0;
  color: #666;
  font-size: 0.85em;
}

/* Loading and Error States */
.loading, .error {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1em;
}

.error {
  color: #d32f2f;
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .directory-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .manager-card {
    flex-direction: column;
    text-align: center;
  }
}
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

#### User Profile Tests

**Get Current User Profile**:
```bash
curl -X GET https://your-api-domain.com/api/v1/user/profile \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get User Profile by Employee ID**:
```bash
curl -X GET https://your-api-domain.com/api/v1/user/profile/EMP001 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get User by MongoDB ID**:
```bash
curl -X GET https://your-api-domain.com/api/v1/user/get/64a1b2c3d4e5f6789012340 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

#### User Directory Tests

**Get All Users**:
```bash
curl -X GET https://your-api-domain.com/api/v1/user/get-all \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Users by Department**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/user/get-all?department=Engineering" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Get Active Users Only**:
```bash
curl -X GET https://your-api-domain.com/api/v1/user/get-all-active \
  -H "Authorization: Bearer $JWT_TOKEN"
```

#### Error Testing

**Test Invalid Employee ID**:
```bash
curl -X GET https://your-api-domain.com/api/v1/user/profile/INVALID_ID \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Test Invalid MongoDB ID**:
```bash
curl -X GET https://your-api-domain.com/api/v1/user/get/invalid-object-id \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Test Unauthorized Access**:
```bash
curl -X GET https://your-api-domain.com/api/v1/user/profile
```

### Testing Scenarios

#### User Profile Access
1. **Current User**: Test authenticated user profile access
2. **Other Users**: Test access to other user profiles by employee ID
3. **Detailed Profile**: Test detailed profile access by MongoDB ID
4. **Invalid IDs**: Test handling of invalid employee IDs and MongoDB IDs

#### Directory Management
1. **All Users**: Test complete user directory retrieval
2. **Department Filter**: Test department-based filtering
3. **Active Users**: Test active-only user filtering
4. **Empty Results**: Test handling when no users match criteria

#### Security Testing
1. **Authentication**: Test endpoint access without valid tokens
2. **Data Exclusion**: Verify sensitive fields are excluded from responses
3. **Permission Validation**: Test access control for different user types

#### Performance Testing
1. **Large Datasets**: Test with large numbers of users
2. **Filtering Performance**: Test department filtering efficiency
3. **Population Performance**: Test manager relationship population

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical error details (optional)"
}
```

### HTTP Status Codes

- **200 OK**: Request successful
- **400 Bad Request**: Invalid request parameters (e.g., invalid MongoDB ObjectId)
- **401 Unauthorized**: Authentication required or invalid token
- **404 Not Found**: User not found
- **500 Internal Server Error**: Server error or database issues

### Common Error Scenarios

#### Authentication Errors
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

#### User Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

#### Invalid ID Format
```json
{
  "success": false,
  "message": "Invalid Employee ID"
}
```

#### Server Errors
```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": "Database connection failed"
}
```

## Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication for all endpoints
- **Token Validation**: Middleware validates tokens on every request

### Data Security
- **Sensitive Field Exclusion**: Automatic exclusion of passwords and tokens
- **Selective Field Return**: Only necessary fields included in responses
- **Input Validation**: MongoDB ObjectId validation before queries

### Access Control
- **User-based Access**: Users can access their own profiles
- **Manager Relationships**: Populated manager information for organizational context
- **Department Filtering**: Filtered access to departmental user data

## Performance Optimization

### Database Optimization
- **Field Selection**: Only required fields selected in database queries
- **Population Efficiency**: Selective population of manager relationships
- **Indexing**: Proper indexes on employee_Id and _id fields

### Query Optimization
- **Lean Queries**: Using `.lean()` for better performance on read operations
- **Filtered Queries**: Department filtering at database level
- **Sorted Results**: Efficient sorting by creation date

### Response Optimization
- **Minimal Data Transfer**: Only necessary fields in responses
- **Consistent Structure**: Standardized response formats
- **Error Handling**: Efficient error processing and logging

## Troubleshooting

### Common Issues

#### 1. User Not Found Errors

**Issue**: "User not found" responses

**Causes**:
- Invalid employee ID format
- User doesn't exist in database
- User has been deleted

**Solutions**:
- Verify employee ID format and existence
- Check database for user records
- Ensure proper employee ID assignment

#### 2. Authentication Failures

**Issue**: Unauthorized access errors

**Causes**:
- Missing JWT token
- Expired or invalid token
- Incorrect Authorization header format

**Solutions**:
- Verify token presence and format
- Check token expiration
- Ensure proper Authorization header: `Bearer <token>`

#### 3. Department Filtering Issues

**Issue**: Department filter not working correctly

**Causes**:
- Inconsistent department naming
- Case sensitivity issues
- URL encoding problems

**Solutions**:
- Standardize department names in database
- Implement case-insensitive filtering
- Ensure proper URL encoding for department names

#### 4. Manager Population Problems

**Issue**: Manager information not populated correctly

**Causes**:
- Invalid manager references in assigned_to field
- Deleted manager accounts
- Circular reference issues

**Solutions**:
- Validate manager references
- Clean up orphaned references
- Implement reference integrity checks

## Conclusion

The User Management API provides essential functionality for accessing and managing user information within the organization. The system is designed with security, performance, and usability in mind, offering flexible ways to retrieve user data while maintaining proper access controls.

The API supports common organizational needs such as employee directories, manager relationships, and departmental filtering, making it suitable for various HR and management applications.

For additional support or feature requests, please contact the development team or refer to the internal documentation system.