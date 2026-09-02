---
sidebar_position: 1
title: "Subordinates Management"
description: "Subordinates Management — HCM platform documentation."
---

# Subordinates Management

{/* # Subordinates Management API Documentation */}

## Overview

The Subordinates Management API provides comprehensive functionality for managing organizational hierarchies, retrieving subordinate employee information, and accessing company-wide holiday data. This system enables managers to view their entire reporting structure with multi-level hierarchy support and advanced search capabilities.

### Key Features

- **Hierarchical Subordinate Retrieval**: Get all direct and indirect reports up to 10 levels deep
- **Advanced Search**: Search subordinates by name, employee ID, or department
- **Multi-level Hierarchy**: Support for complex organizational structures
- **Real-time Data**: Live subordinate information with current status
- **Holiday Management**: Access to company-wide holiday calendar
- **Permission-based Access**: Secure access based on user roles and permissions

## Base URL

```
https://your-api-domain.com/api
```

## Authentication & Authorization

### Authentication Flow

The API uses JSON Web Tokens (JWT) for authentication with role-based access control for subordinate management functions.

#### Authorization Header Format

```http
Authorization: Bearer <your_jwt_token>
```

### Permission System

The API implements permissions for different subordinate management operations:

#### Subordinate Management Permissions
- **subordinate-view**: View subordinate information
- **subordinate-manage**: Manage subordinate assignments
- **hierarchy-view**: View organizational hierarchy
- **holiday-view**: Access company holiday information

## System Architecture

### Request Flow

```
Client Request → JWT Validation → Permission Check → Controller → Database → Response
```

### Data Models

#### User Model (Subordinate Context)
```javascript
{
  _id: "ObjectId",
  first_Name: "String",
  last_Name: "String",
  designation: "String",
  employee_Id: "String", // Unique employee identifier
  isActive: "Boolean",
  department: "String",
  working_Email_Id: "String",
  user_Avatar: "String", // URL to profile image
  assigned_to: "ObjectId", // Reference to manager
  level: "Number" // Hierarchy level (from GraphLookup)
}
```

#### Hierarchy Structure
```javascript
{
  managerId: "ObjectId",
  subordinates: [{
    _id: "ObjectId",
    first_Name: "String",
    last_Name: "String",
    designation: "String",
    employee_Id: "String",
    isActive: "Boolean",
    department: "String",
    working_Email_Id: "String",
    user_Avatar: "String",
    assigned_to: "ObjectId",
    level: "Number" // 0 = direct report, 1 = second level, etc.
  }]
}
```

#### Holiday Model
```javascript
{
  _id: "ObjectId",
  name: "String",
  date: "Date",
  type: "String", // public, optional, etc.
  description: "String",
  recurring: "Boolean",
  createdAt: "Date",
  updatedAt: "Date"
}
```

## Subordinates Management API

### Get All Subordinates

Retrieves all subordinates in the organizational hierarchy with optional search functionality.

**Endpoint**: `GET /v1/subordinates/`

**Authentication**: Required (JWT)

**Permissions**: Manager access or `subordinate-view`

**Query Parameters**:
- `search` (string, optional): Search term to filter subordinates by name or employee ID

**Success Response** (200):
```json
{
  "success": true,
  "message": "Subordinates fetched successfully",
  "count": 15,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "first_Name": "John",
      "last_Name": "Doe",
      "designation": "Software Engineer",
      "employee_Id": "EMP001",
      "isActive": true,
      "department": "Engineering",
      "working_Email_Id": "john.doe@company.com",
      "user_Avatar": "https://cloudinary.com/avatar1.jpg",
      "assigned_to": "64a1b2c3d4e5f6789012340",
      "level": 0
    },
    {
      "_id": "64a1b2c3d4e5f6789012346",
      "first_Name": "Jane",
      "last_Name": "Smith",
      "designation": "Junior Developer",
      "employee_Id": "EMP002",
      "isActive": true,
      "department": "Engineering",
      "working_Email_Id": "jane.smith@company.com",
      "user_Avatar": "https://cloudinary.com/avatar2.jpg",
      "assigned_to": "64a1b2c3d4e5f6789012345",
      "level": 1
    },
    {
      "_id": "64a1b2c3d4e5f6789012347",
      "first_Name": "Bob",
      "last_Name": "Johnson",
      "designation": "Marketing Specialist",
      "employee_Id": "EMP003",
      "isActive": true,
      "department": "Marketing",
      "working_Email_Id": "bob.johnson@company.com",
      "user_Avatar": "https://cloudinary.com/avatar3.jpg",
      "assigned_to": "64a1b2c3d4e5f6789012340",
      "level": 0
    }
  ]
}
```

**Search Examples**:

*Search by first name*:
```bash
GET /v1/subordinates/?search=John
```

*Search by employee ID*:
```bash
GET /v1/subordinates/?search=EMP001
```

*Search by last name*:
```bash
GET /v1/subordinates/?search=Smith
```

**Error Responses**:

*401 Unauthorized - Missing or invalid token*:
```json
{
  "success": false,
  "message": "Authentication required"
}
```

*403 Forbidden - Insufficient permissions*:
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

*500 Internal Server Error*:
```json
{
  "success": false,
  "message": "Server error",
  "error": "Detailed error message"
}
```

**Business Rules**:
- Uses MongoDB GraphLookup for hierarchical data retrieval
- Supports up to 10 levels of organizational hierarchy
- Search is case-insensitive and supports partial matches
- Returns all subordinates regardless of their status (active/inactive)
- Level 0 = direct reports, Level 1 = second-level reports, etc.
- Automatically filters based on current user's position in hierarchy

**Technical Implementation**:
- Uses MongoDB aggregation pipeline with `$graphLookup`
- Recursive traversal of organizational structure
- Efficient querying with proper indexing
- Search functionality across multiple fields simultaneously

### Get Company Holidays

Retrieves the company-wide holiday calendar information.

**Endpoint**: `GET /v1/subordinates/holidays`

**Authentication**: Required (JWT)

**Permissions**: `holiday-view` (all authenticated users typically have this)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Holidays fetched successfully",
  "count": 12,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012350",
      "name": "New Year's Day",
      "date": "2024-01-01T00:00:00.000Z",
      "type": "public",
      "description": "New Year celebration",
      "recurring": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6789012351",
      "name": "Independence Day",
      "date": "2024-07-04T00:00:00.000Z",
      "type": "public",
      "description": "Independence Day celebration",
      "recurring": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6789012352",
      "name": "Christmas Day",
      "date": "2024-12-25T00:00:00.000Z",
      "type": "public",
      "description": "Christmas celebration",
      "recurring": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6789012353",
      "name": "Company Retreat",
      "date": "2024-06-15T00:00:00.000Z",
      "type": "company",
      "description": "Annual company retreat",
      "recurring": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Holiday Types**:
- `public`: National or regional public holidays
- `company`: Company-specific holidays
- `optional`: Optional holidays that employees can choose to observe
- `floating`: Floating holidays that can be used at employee's discretion

**Business Rules**:
- Returns all holidays for the current year by default
- Includes both recurring and one-time holidays
- Sorted by date in ascending order
- Accessible to all authenticated users
- Used for leave planning and payroll calculations

## Frontend Integration

### JavaScript SDK

```javascript
class SubordinatesAPI {
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

  // Subordinate Management
  async getSubordinates(searchQuery = '') {
    const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
    return this.request(`/v1/subordinates/${params}`);
  }

  async getHolidays() {
    return this.request('/v1/subordinates/holidays');
  }

  // Helper methods for data processing
  groupSubordinatesByLevel(subordinates) {
    return subordinates.reduce((groups, subordinate) => {
      const level = subordinate.level || 0;
      if (!groups[level]) {
        groups[level] = [];
      }
      groups[level].push(subordinate);
      return groups;
    }, {});
  }

  groupSubordinatesByDepartment(subordinates) {
    return subordinates.reduce((groups, subordinate) => {
      const dept = subordinate.department || 'Unknown';
      if (!groups[dept]) {
        groups[dept] = [];
      }
      groups[dept].push(subordinate);
      return groups;
    }, {});
  }

  buildHierarchyTree(subordinates) {
    const subordinateMap = new Map();
    const tree = [];

    // Create a map of all subordinates
    subordinates.forEach(sub => {
      subordinateMap.set(sub._id, { ...sub, children: [] });
    });

    // Build the tree structure
    subordinates.forEach(sub => {
      const subordinate = subordinateMap.get(sub._id);
      if (sub.assigned_to && subordinateMap.has(sub.assigned_to)) {
        subordinateMap.get(sub.assigned_to).children.push(subordinate);
      } else {
        tree.push(subordinate);
      }
    });

    return tree;
  }

  filterActiveSubordinates(subordinates) {
    return subordinates.filter(sub => sub.isActive);
  }

  searchSubordinates(subordinates, query) {
    if (!query) return subordinates;
    
    const searchLower = query.toLowerCase();
    return subordinates.filter(sub => 
      sub.first_Name.toLowerCase().includes(searchLower) ||
      sub.last_Name.toLowerCase().includes(searchLower) ||
      sub.employee_Id.toLowerCase().includes(searchLower) ||
      sub.designation.toLowerCase().includes(searchLower) ||
      sub.department.toLowerCase().includes(searchLower)
    );
  }
}

// Usage Examples
const api = new SubordinatesAPI('https://your-api-domain.com/api', 'your-jwt-token');

// Get all subordinates
try {
  const response = await api.getSubordinates();
  console.log('All subordinates:', response.data);
  console.log('Total count:', response.count);
} catch (error) {
  console.error('Failed to fetch subordinates:', error.message);
}

// Search subordinates
try {
  const response = await api.getSubordinates('John');
  console.log('Search results:', response.data);
} catch (error) {
  console.error('Search failed:', error.message);
}

// Get holidays
try {
  const holidays = await api.getHolidays();
  console.log('Company holidays:', holidays.data);
} catch (error) {
  console.error('Failed to fetch holidays:', error.message);
}

// Process subordinates data
const processSubordinates = async () => {
  try {
    const response = await api.getSubordinates();
    const subordinates = response.data;

    // Group by hierarchy level
    const byLevel = api.groupSubordinatesByLevel(subordinates);
    console.log('Direct reports:', byLevel[0] || []);
    console.log('Second level:', byLevel[1] || []);

    // Group by department
    const byDepartment = api.groupSubordinatesByDepartment(subordinates);
    console.log('Engineering team:', byDepartment['Engineering'] || []);

    // Build hierarchy tree
    const tree = api.buildHierarchyTree(subordinates);
    console.log('Hierarchy tree:', tree);

    // Filter active only
    const activeSubordinates = api.filterActiveSubordinates(subordinates);
    console.log('Active subordinates:', activeSubordinates);

  } catch (error) {
    console.error('Error processing subordinates:', error);
  }
};

processSubordinates();
```

### React Component Examples

```javascript
import React, { useState, useEffect } from 'react';

const SubordinatesManager = () => {
  const [subordinates, setSubordinates] = useState([]);
  const [filteredSubordinates, setFilteredSubordinates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const api = new SubordinatesAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    fetchSubordinates();
  }, []);

  useEffect(() => {
    filterSubordinates();
  }, [subordinates, searchQuery, selectedDepartment, selectedLevel]);

  const fetchSubordinates = async () => {
    try {
      setLoading(true);
      const response = await api.getSubordinates();
      setSubordinates(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch subordinates');
      console.error('Error fetching subordinates:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterSubordinates = () => {
    let filtered = subordinates;

    // Apply search filter
    if (searchQuery) {
      filtered = api.searchSubordinates(filtered, searchQuery);
    }

    // Apply department filter
    if (selectedDepartment) {
      filtered = filtered.filter(sub => sub.department === selectedDepartment);
    }

    // Apply level filter
    if (selectedLevel !== '') {
      filtered = filtered.filter(sub => sub.level === parseInt(selectedLevel));
    }

    setFilteredSubordinates(filtered);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const getDepartments = () => {
    return [...new Set(subordinates.map(sub => sub.department))].filter(Boolean);
  };

  const getLevels = () => {
    return [...new Set(subordinates.map(sub => sub.level))].sort((a, b) => a - b);
  };

  if (loading) return <div className="loading">Loading subordinates...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="subordinates-manager">
      <h2>Team Management</h2>
      
      {/* Search and Filter Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name or employee ID..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
        
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="department-filter"
        >
          <option value="">All Departments</option>
          {getDepartments().map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="level-filter"
        >
          <option value="">All Levels</option>
          {getLevels().map(level => (
            <option key={level} value={level}>
              Level {level} {level === 0 ? '(Direct Reports)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>Showing {filteredSubordinates.length} of {subordinates.length} subordinates</p>
      </div>

      {/* Subordinates List */}
      <div className="subordinates-list">
        {filteredSubordinates.length === 0 ? (
          <p>No subordinates found matching your criteria.</p>
        ) : (
          filteredSubordinates.map((subordinate) => (
            <SubordinateCard key={subordinate._id} subordinate={subordinate} />
          ))
        )}
      </div>
    </div>
  );
};

const SubordinateCard = ({ subordinate }) => {
  const getLevelLabel = (level) => {
    if (level === 0) return 'Direct Report';
    if (level === 1) return '2nd Level';
    if (level === 2) return '3rd Level';
    return `${level + 1}th Level`;
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'green' : 'red';
  };

  return (
    <div className="subordinate-card">
      <div className="subordinate-avatar">
        <img 
          src={subordinate.user_Avatar || '/default-avatar.png'} 
          alt={`${subordinate.first_Name} ${subordinate.last_Name}`}
          onError={(e) => {
            e.target.src = '/default-avatar.png';
          }}
        />
      </div>
      
      <div className="subordinate-info">
        <h3>{subordinate.first_Name} {subordinate.last_Name}</h3>
        <p className="designation">{subordinate.designation}</p>
        <p className="department">{subordinate.department}</p>
        <p className="employee-id">ID: {subordinate.employee_Id}</p>
        <p className="email">{subordinate.working_Email_Id}</p>
      </div>
      
      <div className="subordinate-meta">
        <span className={`status ${subordinate.isActive ? 'active' : 'inactive'}`}>
          {subordinate.isActive ? 'Active' : 'Inactive'}
        </span>
        <span className="level">{getLevelLabel(subordinate.level)}</span>
      </div>
      
      <div className="subordinate-actions">
        <button 
          onClick={() => console.log('View profile:', subordinate._id)}
          className="view-profile-btn"
        >
          View Profile
        </button>
        <button 
          onClick={() => console.log('Send message:', subordinate._id)}
          className="send-message-btn"
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

const HierarchyTree = () => {
  const [subordinates, setSubordinates] = useState([]);
  const [hierarchyTree, setHierarchyTree] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = new SubordinatesAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    fetchAndBuildTree();
  }, []);

  const fetchAndBuildTree = async () => {
    try {
      setLoading(true);
      const response = await api.getSubordinates();
      const subordinates = response.data;
      setSubordinates(subordinates);
      
      const tree = api.buildHierarchyTree(subordinates);
      setHierarchyTree(tree);
    } catch (error) {
      console.error('Error building hierarchy tree:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTreeNode = (node, level = 0) => {
    return (
      <div key={node._id} className={`tree-node level-${level}`}>
        <div className="node-content">
          <img 
            src={node.user_Avatar || '/default-avatar.png'} 
            alt={`${node.first_Name} ${node.last_Name}`}
            className="node-avatar"
          />
          <div className="node-info">
            <h4>{node.first_Name} {node.last_Name}</h4>
            <p>{node.designation}</p>
            <p>{node.department}</p>
          </div>
        </div>
        
        {node.children && node.children.length > 0 && (
          <div className="node-children">
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div>Loading hierarchy...</div>;

  return (
    <div className="hierarchy-tree">
      <h2>Organizational Hierarchy</h2>
      <div className="tree-container">
        {hierarchyTree.map(node => renderTreeNode(node))}
      </div>
    </div>
  );
};

const HolidayCalendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = new SubordinatesAPI('https://your-api-domain.com/api', 'your-jwt-token');

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await api.getHolidays();
      setHolidays(response.data);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHolidayTypeColor = (type) => {
    const colors = {
      'public': '#e74c3c',
      'company': '#3498db',
      'optional': '#f39c12',
      'floating': '#9b59b6'
    };
    return colors[type] || '#95a5a6';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const groupHolidaysByMonth = (holidays) => {
    return holidays.reduce((groups, holiday) => {
      const month = new Date(holiday.date).toLocaleDateString('en-US', { month: 'long' });
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(holiday);
      return groups;
    }, {});
  };

  if (loading) return <div>Loading holidays...</div>;

  const holidaysByMonth = groupHolidaysByMonth(holidays);

  return (
    <div className="holiday-calendar">
      <h2>Company Holidays</h2>
      
      {Object.entries(holidaysByMonth).map(([month, monthHolidays]) => (
        <div key={month} className="month-group">
          <h3>{month}</h3>
          <div className="holidays-list">
            {monthHolidays.map((holiday) => (
              <div key={holiday._id} className="holiday-item">
                <div 
                  className="holiday-indicator"
                  style={{ backgroundColor: getHolidayTypeColor(holiday.type) }}
                />
                <div className="holiday-info">
                  <h4>{holiday.name}</h4>
                  <p className="holiday-date">{formatDate(holiday.date)}</p>
                  <p className="holiday-description">{holiday.description}</p>
                  <span className={`holiday-type ${holiday.type}`}>
                    {holiday.type}
                  </span>
                  {holiday.recurring && (
                    <span className="recurring-indicator">Recurring</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export { SubordinatesManager, HierarchyTree, HolidayCalendar };
```

## Testing Guide

### Using cURL

#### Authentication Setup
```bash
# Get JWT token (replace with actual auth endpoint)
curl -X POST https://your-api-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "manager", "password": "password"}'

# Set token variable
export JWT_TOKEN="your-jwt-token-here"
```

#### Subordinate Management Tests

**Get All Subordinates**:
```bash
curl -X GET https://your-api-domain.com/api/v1/subordinates/ \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Search Subordinates by Name**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/subordinates/?search=John" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Search Subordinates by Employee ID**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/subordinates/?search=EMP001" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Search Subordinates by Partial Name**:
```bash
curl -X GET "https://your-api-domain.com/api/v1/subordinates/?search=Sm" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

#### Holiday Management Tests

**Get Company Holidays**:
```bash
curl -X GET https://your-api-domain.com/api/v1/subordinates/holidays \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### Testing Scenarios

#### Hierarchy Testing
1. **Single Level**: Test with manager having only direct reports
2. **Multi-Level**: Test with complex hierarchy (manager → senior → junior)
3. **Cross-Department**: Test with subordinates across different departments
4. **Mixed Status**: Test with both active and inactive subordinates

#### Search Functionality Testing
1. **Exact Match**: Search with exact employee ID or name
2. **Partial Match**: Search with partial strings
3. **Case Sensitivity**: Test case-insensitive search
4. **Empty Results**: Search with non-existent terms
5. **Special Characters**: Test search with special characters

#### Permission Testing
1. **Manager Access**: Test with manager-level permissions
2. **HR Access**: Test with HR-level permissions
3. **Employee Access**: Test with regular employee (should have limited access)
4. **Admin Access**: Test with admin-level permissions

#### Performance Testing
1. **Large Hierarchy**: Test with deep organizational structures
2. **Many Subordinates**: Test with managers having many direct reports
3. **Search Performance**: Test search with large datasets
4. **Concurrent Requests**: Test multiple simultaneous requests

### Error Handling Testing

#### Authentication Tests
```bash
# Test without token
curl -X GET https://your-api-domain.com/api/v1/subordinates/

# Test with invalid token
curl -X GET https://your-api-domain.com/api/v1/subordinates/ \
  -H "Authorization: Bearer invalid-token"

# Test with expired token
curl -X GET https://your-api-domain.com/api/v1/subordinates/ \
  -H "Authorization: Bearer expired-token"
```

#### Search Parameter Tests
```bash
# Test with very long search string
curl -X GET "https://your-api-domain.com/api/v1/subordinates/?search=$(printf 'a%.0s' {1..1000})" \
  -H "Authorization: Bearer $JWT_TOKEN"

# Test with special characters
curl -X GET "https://your-api-domain.com/api/v1/subordinates/?search=%3Cscript%3E" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

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
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error or database issues

### Common Error Scenarios

#### Authentication Errors
```json
{
  "success": false,
  "message": "Authentication required"
}
```

#### Permission Errors
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

#### Search Parameter Errors
```json
{
  "success": false,
  "message": "Invalid search parameters"
}
```

#### Database Connection Errors
```json
{
  "success": false,
  "message": "Server error",
  "error": "Database connection failed"
}
```

## Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Token Validation**: Middleware validates tokens on every request
- **Permission Checks**: Role-based access control for sensitive operations

### Data Security
- **Hierarchical Access**: Users can only see their subordinates
- **Search Sanitization**: Input sanitization to prevent injection attacks
- **Data Filtering**: Sensitive information filtered based on user permissions

### Query Security
- **MongoDB Injection Prevention**: Parameterized queries and input validation
- **Search Limits**: Query optimization to prevent resource exhaustion
- **Rate Limiting**: Protection against abuse and DoS attacks

## Performance Optimization

### Database Optimization
- **GraphLookup Efficiency**: Optimized MongoDB aggregation pipeline
- **Index Strategy**: Proper indexing on key fields (employee_Id, assigned_to)
- **Query Limits**: Reasonable limits on hierarchy depth and result size

### Caching Strategy
- **Hierarchy Caching**: Cache organizational structure for frequently accessed data
- **Search Results**: Cache common search queries
- **User Permissions**: Cache user permission data

### Memory Management
- **Pagination**: Implement pagination for large result sets
- **Lazy Loading**: Load subordinate details on demand
- **Resource Cleanup**: Proper cleanup of database connections

## Troubleshooting

### Common Issues

#### 1. Empty Subordinates List

**Issue**: API returns empty array despite having subordinates

**Causes**:
- Incorrect `assigned_to` field values
- User not in manager role
- Database relationship issues

**Solutions**:
- Verify `assigned_to` field points to correct manager ID
- Check user's role and permissions
- Validate database relationships

#### 2. Search Not Working

**Issue**: Search functionality returns no results

**Causes**:
- Case sensitivity issues
- Incorrect field mapping
- Index problems

**Solutions**:
- Verify search is case-insensitive
- Check field names in aggregation pipeline
- Rebuild database indexes

#### 3. Performance Issues

**Issue**: Slow response times with large hierarchies

**Causes**:
- Missing database indexes
- Inefficient aggregation pipeline
- Large result sets

**Solutions**:
- Add indexes on `assigned_to` and `employee_Id`
- Optimize aggregation pipeline
- Implement pagination

#### 4. Permission Errors

**Issue**: Users cannot access subordinate data

**Causes**:
- Incorrect permission configuration
- Missing role assignments
- Authentication issues

**Solutions**:
- Verify user permissions
- Check role assignments
- Validate JWT token

### Debugging Tips

#### Database Queries
1. **Aggregation Pipeline**: Use MongoDB Compass to test aggregation queries
2. **Index Usage**: Check query execution plans
3. **Performance Metrics**: Monitor query performance

#### Authentication Issues
1. **Token Validation**: Verify JWT token structure and expiration
2. **Permission Mapping**: Check user permission assignments
3. **Role Hierarchy**: Validate organizational structure

#### Search Problems
1. **Query Parameters**: Log search parameters and results
2. **Field Mapping**: Verify field names in search queries
3. **Result Filtering**: Check search result filtering logic

## Best Practices

### API Usage
- **Implement Search Debouncing**: Prevent excessive API calls during search
- **Cache Results**: Cache frequently accessed subordinate data
- **Error Handling**: Implement proper error handling and user feedback
- **Loading States**: Show loading indicators during API calls

### Data Management
- **Regular Sync**: Keep organizational hierarchy data up to date
- **Validation**: Validate data integrity regularly
- **Backup Strategy**: Maintain proper backup of hierarchical data

### Performance
- **Pagination**: Implement pagination for large teams
- **Lazy Loading**: Load details on demand
- **Caching**: Cache search results and hierarchy data
- **Monitoring**: Monitor API performance and usage

## Conclusion

The Subordinates Management API provides a robust solution for managing organizational hierarchies with advanced search capabilities and multi-level hierarchy support. The system is designed for scalability and performance, with proper security measures and comprehensive error handling.

The API enables managers to efficiently view and manage their teams, search for specific subordinates, and access company-wide holiday information. The comprehensive testing guide and troubleshooting documentation ensure smooth implementation and maintenance.

For additional support or feature requests, please contact the development team or refer to the internal documentation system.