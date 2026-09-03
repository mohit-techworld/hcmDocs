---
title: "Performance Management - Part 6: API Reference"
sidebar_position: 12
description: "Performance Management Module - Part 6: API Reference — HCM platform documentation."
---

# Performance Management Module - Part 6: API Reference

This document provides a complete API reference for the Performance Management module, including all endpoints, request/response formats, error codes, and usage examples.

## Table of Contents

1. [Base URLs](#base-urls)
2. [Authentication](#authentication)
3. [KPI Set API](#kpi-set-api)
4. [Rating API](#rating-api)
5. [Analytics API](#get-manager-team-analytics)
6. [Error Codes](#error-codes)
7. [Rate Limiting](#rate-limiting)

## Base URLs

### KPI Management

```
Base URL: /api/v1/kpis
```

### Rating Management

```
Base URL: /api/v1/ratings
```

## Authentication

All endpoints require JWT authentication via the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

**Token Format:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGY4YjJhMWM0ZDVlNmY3ZzhoOWkwajEiLCJpYXQiOjE3MDYxMjM0NTZ9...
```

## KPI Set API

### Create KPI Set

**POST** `/api/v1/kpis/create`

Creates a new KPI set for a designation and frequency. Version is auto-incremented if not provided.

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
      "target": 50,
      "category": "Sales"
    },
    {
      "kpiName": "Product Knowledge",
      "type": "qualitative",
      "marks": 40,
      "category": "Skills"
    }
  ],
  "totalMarks": 100,
  "createdBy": "admin123",
  "version": 2 // Optional: Auto-incremented if not provided
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
    "kpis": [
      {
        "kpiName": "Number of Sales",
        "type": "quantitative",
        "marks": 60,
        "target": 50,
        "category": "Sales"
      },
      {
        "kpiName": "Product Knowledge",
        "type": "qualitative",
        "marks": 40,
        "category": "Skills"
      }
    ],
    "totalMarks": 100,
    "createdBy": "admin123",
    "createdAt": "2024-01-25T10:30:00.000Z",
    "updatedAt": "2024-01-25T10:30:00.000Z"
  }
}
```

**Error Responses:**

```json
// 400 - Duplicate version
{
  "success": false,
  "message": "A KPI set with this (designation, frequency, version) already exists."
}

// 400 - Validation error
{
  "success": false,
  "message": "Sum of KPI marks must equal totalMarks"
}

// 500 - Server error
{
  "success": false,
  "message": "Server Error"
}
```

### Get KPI Set

**GET** `/api/v1/kpis`

Fetches a KPI set by designation, frequency, and optionally version. Returns latest version if version not specified.

**Query Parameters:**

- `designation` (string, required) - Job role
- `frequency` (string, required) - "daily" | "weekly" | "monthly" | "yearly"
- `version` (number, optional) - Specific version (defaults to latest)

**Example Request:**

```http
GET /api/v1/kpis?designation=Sales%20Manager&frequency=monthly&version=2
Authorization: Bearer <token>
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
    "createdBy": "admin123",
    "createdAt": "2024-01-25T10:30:00.000Z",
    "updatedAt": "2024-01-25T10:30:00.000Z"
  }
}
```

**Error Responses:**

```json
// 400 - Missing parameters
{
  "success": false,
  "message": "designation and frequency are required."
}

// 404 - Not found
{
  "success": false,
  "message": "KPI Set not found."
}
```

### Get All KPI Sets

**GET** `/api/v1/kpis/all`

Fetches all KPI sets, optionally filtered by designation and/or frequency.

**Query Parameters:**

- `designation` (string, optional) - Filter by designation
- `frequency` (string, optional) - Filter by frequency

**Example Request:**

```http
GET /api/v1/kpis/all?designation=Sales%20Manager
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "designation": "Sales Manager",
      "frequency": "monthly",
      "version": 1,
      ...
    },
    ...
  ]
}
```

### Update KPI Set

**PUT** `/api/v1/kpis/update/:id`

Updates an existing KPI set. Note: For immutable versioning, create a new KPI set instead.

**Path Parameters:**

- `id` (string, required) - KPI set MongoDB \_id

**Request Body:**

```json
{
  "designation": "Sales Manager",
  "frequency": "monthly",
  "kpis": [...],
  "totalMarks": 100,
  "updatedBy": "admin123",
  "version": 2  // Optional
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "KPI Set updated successfully",
  "data": {
    "_id": "...",
    ...
  }
}
```

### Delete KPI Set

**DELETE** `/api/v1/kpis/delete/:id`

Permanently deletes a KPI set.

**Path Parameters:**

- `id` (string, required) - KPI set MongoDB \_id

**Success Response (200):**

```json
{
  "success": true,
  "message": "KPI Set permanently deleted."
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "KPI Set not found."
}
```

## Rating API

### Create/Update Rating

**POST** `/api/v1/ratings/create`

Creates a new rating or updates an existing one (upsert logic).

**Request Body:**

```json
{
  "employeeId": "64f8b2a1c4d5e6f7g8h9i0j1",
  "frequency": "monthly",
  "version": 2,
  "year": 2024,
  "month": 3,
  "kpis": [
    {
      "kpiName": "Number of Sales",
      "type": "quantitative",
      "marks": 60,
      "target": 50,
      "achieved": 45,
      "score": 54,
      "comment": "Slightly below target"
    },
    {
      "kpiName": "Product Knowledge",
      "type": "qualitative",
      "marks": 40,
      "score": 36,
      "comment": "Excellent knowledge"
    }
  ],
  "totalScore": 90,
  "comment": "Good performance overall"
}
```

**Period Fields by Frequency:**

**Daily:**

```json
{
  "frequency": "daily",
  "date": "2024-03-15"
}
```

**Weekly:**

```json
{
  "frequency": "weekly",
  "year": 2024,
  "month": 3,
  "week": 12
}
```

**Monthly:**

```json
{
  "frequency": "monthly",
  "year": 2024,
  "month": 3
}
```

**Yearly:**

```json
{
  "frequency": "yearly",
  "year": 2024
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Rating upserted successfully.",
  "data": {
    "_id": "64f8b2a1c4d5e6f7g8h9i0j2",
    "employeeId": "64f8b2a1c4d5e6f7g8h9i0j1",
    "ratedBy": "64f8b2a1c4d5e6f7g8h9i0j3",
    "frequency": "monthly",
    "version": 2,
    "year": 2024,
    "month": 3,
    "kpis": [...],
    "totalScore": 90,
    "comment": "Good performance overall",
    "createdAt": "2024-03-15T10:30:00.000Z",
    "updatedAt": "2024-03-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

```json
// 400 - Missing required fields
{
  "success": false,
  "message": "employeeId & frequency are required."
}

// 404 - Employee not found
{
  "success": false,
  "message": "Employee not found."
}

// 400 - KPI set not found
{
  "success": false,
  "message": "No KPI set found for designation=Sales Manager, freq=monthly, version=2"
}
```

### Generate Bulk Template

**GET** `/api/v1/ratings/template`

Generates an Excel template for bulk rating uploads.

**Query Parameters:**

- `frequency` (string, required) - "daily" | "weekly" | "monthly" | "yearly"
- `date` (string, optional) - For daily frequency (YYYY-MM-DD)
- `year` (number, optional) - Required for weekly/monthly/yearly
- `month` (number, optional) - Required for weekly/monthly (1-12)
- `week` (number, optional) - Required for weekly (1-53)
- `designation` (string, optional) - Filter subordinates by designation

**Example Request:**

```http
GET /api/v1/ratings/template?frequency=monthly&year=2024&month=3&designation=Sales%20Manager
Authorization: Bearer <token>
```

**Success Response (200):**

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="bulk_rating_template.xlsx"`
- Body: Excel file binary data

**Error Responses:**

```json
// 200 - No subordinates
{
  "success": true,
  "message": "No subordinates found for this manager or no matching designation.",
  "file": null
}

// 200 - No KPI sets
{
  "success": true,
  "message": "No KPI sets found for these subordinates.",
  "file": null
}
```

### Generate Past Ratings Template

**GET** `/api/v1/ratings/past-template`

Generates an Excel template for past ratings upload with date ranges.

**Query Parameters:**

- `frequency` (string, required) - Rating frequency
- `employeeId` (string, optional) - Specific employee (or all if omitted)
- `startDate` (string) - For daily frequency
- `endDate` (string) - For daily frequency
- `startYear`, `startMonth`, `startWeek` - For weekly/monthly/yearly
- `endYear`, `endMonth`, `endWeek` - For weekly/monthly/yearly

**Example Request:**

```http
GET /api/v1/ratings/past-template?frequency=monthly&startYear=2024&startMonth=1&endYear=2024&endMonth=3&employeeId=emp123
Authorization: Bearer <token>
```

**Success Response (200):**

- Excel file download with pre-filled existing ratings

### Upload Bulk Ratings

**POST** `/api/v1/ratings/bulk-upload`

Uploads and processes bulk ratings from Excel file.

**Request:**

- Content-Type: `multipart/form-data`
- Body: FormData with `file` field containing Excel file

**Example Request:**

```http
POST /api/v1/ratings/bulk-upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- file: [Excel file]
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Bulk ratings processed successfully",
  "data": {
    "newCount": 5,
    "updatedCount": 2,
    "errorCount": 1,
    "errors": [
      {
        "rowNumber": 8,
        "errors": ["Score cannot exceed Max Marks"]
      }
    ]
  }
}
```

**Error Responses:**

```json
// 400 - No file
{
  "success": false,
  "message": "No file uploaded."
}

// 400 - Empty file
{
  "success": false,
  "message": "Uploaded Excel is empty or invalid."
}
```

### Upload Past Ratings

**POST** `/api/v1/ratings/bulk-upload-past`

Uploads past ratings from Excel file.

**Request:** Same as bulk upload

**Response:** Same format as bulk upload

### Get Team Ratings (Advanced)

**GET** `/api/v1/ratings/team-advanced`

Fetches team ratings with advanced filtering.

**Query Parameters:**

- `frequency` (string, required)
- `startDate`, `endDate` (for daily)
- `startYear`, `endYear`, `startMonth`, `endMonth`, `startWeek`, `endWeek` (for other frequencies)
- `department` (string, optional)
- `designation` (string, optional)

**Example Request:**

```http
GET /api/v1/ratings/team-advanced?frequency=daily&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "employee": {
        "_id": "...",
        "first_Name": "John",
        "last_Name": "Doe",
        "designation": "Sales Manager"
      },
      "frequency": "daily",
      "date": "2024-01-01T00:00:00Z",
      "totalScore": 85,
      "hasRating": true,
      "kpis": [...]
    },
    ...
  ]
}
```

### Get Team Ratings (Aggregated)

**GET** `/api/v1/ratings/team-advanced/aggregated`

Fetches aggregated team ratings by period.

**Query Parameters:** Same as team-advanced

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "period": "2024-01-01",
      "averageScore": 85,
      "ratingCount": 10,
      "employees": [...]
    },
    ...
  ]
}
```

### Get Employee Ratings (Advanced)

**GET** `/api/v1/ratings/employee-advanced/:employeeId`

Fetches detailed ratings for a specific employee.

**Path Parameters:**

- `employeeId` (string, required) - Employee MongoDB \_id

**Query Parameters:** Same filtering as team-advanced

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "employee": {...},
    "filteredRatings": [...],
    "averageRating": 85,
    "ratingCount": 10
  }
}
```

### Get My Ratings (Advanced)

**GET** `/api/v1/ratings/my-advanced`

Fetches current user's own ratings.

**Query Parameters:** Same as team-advanced

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "employee": {...},
    "filteredRatings": [...],
    "averageRating": 85,
    "ratingCount": 10
  }
}
```

### Get Organization Ratings (Advanced)

**GET** `/api/v1/ratings/organization-advanced`

Fetches organization-wide ratings (super admin only).

**Query Parameters:** Same as team-advanced

**Success Response (200):**

```json
{
  "success": true,
  "data": [...]
}
```

### Get Organization Ratings (Aggregated)

**GET** `/api/v1/ratings/organization-advanced/aggregated`

Fetches aggregated organization ratings.

**Query Parameters:** Same as team-advanced

**Success Response (200):**

```json
{
  "success": true,
  "data": [...]
}
```

### Get Employee Aggregated Ratings

**GET** `/api/v1/ratings/employee/:employeeId/aggregate`

Fetches aggregated ratings for a specific employee by period.

**Path Parameters:**

- `employeeId` (string, required)

**Query Parameters:**

- `periodType` (string, required) - "daily" | "weekly" | "monthly" | "yearly"
- Period range parameters based on periodType

**Success Response (200):**

```json
{
  "success": true,
  "employee": {...},
  "aggregatedBy": "daily",
  "data": [
    {
      "period": "2024-01-01",
      "averageScore": 85,
      "kpis": [
        {
          "kpiName": "Number of Sales",
          "avgScore": 54,
          "marks": 60
        }
      ],
      "ratingCount": 1
    }
  ],
  "averageRating": 85,
  "ratingCount": 10
}
```

### Get Top Performers

**GET** `/api/v1/ratings/top-performer`

Fetches organization-wide top performers.

**Query Parameters:**

- `frequency` (string, optional)
- `limit` (number, optional, default: 10)
- `startDate`, `endDate` (optional)
- Other period filters (optional)

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "employee": {
        "_id": "...",
        "first_Name": "John",
        "last_Name": "Doe"
      },
      "avgScore": 95,
      "ratingCount": 10
    },
    ...
  ]
}
```

### Get Top Performers by Designation

**GET** `/api/v1/ratings/top-performer/by-designation`

Fetches top performers for user's designation.

**Query Parameters:** Same as top-performer

**Success Response (200):** Same format as top-performer

### Get Manager Team Analytics

**GET** `/api/v1/ratings/manager/team/analytics`

Fetches comprehensive analytics for manager's team.

**Query Parameters:**

- `frequency` (string, required)
- Period range parameters
- `department` (string, optional)
- `designation` (string, optional)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "periods": ["2024-01-01", "2024-01-02", ...],
    "aggregatedTeam": [...],
    "rawRatingsTeam": [...],
    "chartDataTeam": [
      {
        "period": "2024-01-01",
        "totalTarget": 1000,
        "totalAchieved": 900,
        "totalScore": 850,
        "percentOfTarget": 90,
        "normalizedScore": 85
      }
    ],
    "categoryDist": [
      {
        "category": "Excellent",
        "value": 5,
        "periods": [...]
      }
    ],
    "avgKpiPerf": [...],
    "scatterData": [...],
    "avgDailyKpi": {...},
    "normalizedBuckets": [...],
    "employeeAggregates": [...],
    "topPerformers": [...],
    "bottomPerformers": [...],
    "heatmap": [...],
    "movingAverage": [85, 87, 89, ...],
    "periodChange": [null, 2.35, 2.30, ...]
  }
}
```

### Get Super Admin Organization Analytics

**GET** `/api/v1/ratings/superadmin/org/analytics`

Fetches comprehensive analytics for entire organization.

**Query Parameters:** Same as manager team analytics

**Success Response (200):** Same structure as manager analytics, but organization-wide

## Error Codes

### HTTP Status Codes

| Code    | Meaning      | Common Causes                    |
| ------- | ------------ | -------------------------------- |
| **200** | Success      | Request processed successfully   |
| **201** | Created      | Resource created successfully    |
| **400** | Bad Request  | Invalid input, validation errors |
| **401** | Unauthorized | Missing or invalid JWT token     |
| **403** | Forbidden    | Insufficient permissions         |
| **404** | Not Found    | Resource doesn't exist           |
| **500** | Server Error | Internal server error            |

### Error Response Format

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "errors": [
    // Optional: Detailed validation errors
    {
      "field": "score",
      "message": "Score cannot exceed Max Marks"
    }
  ]
}
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing:

- Per-user rate limits
- Per-endpoint rate limits
- Bulk operation throttling

## Best Practices

### Request Optimization

1. **Use Aggregated Endpoints**: Prefer aggregated endpoints when possible
2. **Filter Early**: Apply filters in query parameters, not client-side
3. **Pagination**: Use pagination for large datasets (if implemented)

### Error Handling

1. **Check Status Codes**: Always check HTTP status codes
2. **Parse Error Messages**: Display user-friendly error messages
3. **Retry Logic**: Implement retry for transient errors (5xx)

### Security

1. **Token Management**: Store tokens securely, refresh before expiry
2. **Input Validation**: Validate all inputs before sending
3. **HTTPS Only**: Always use HTTPS in production

## Next Steps

Continue reading:

- [Part 1: Overview & Architecture](./performance-management-part1-overview.md)
- [Part 2: KPI Management](./performance-management-part2-kpi-management.md)
- [Part 3: Rating Management](./performance-management-part3-rating-management.md)
- [Part 4: Bulk Operations](./performance-management-part4-bulk-operations.md)
- [Part 5: Dashboards and Analytics](./performance-management-part5-dashboards-analytics.md)

---

**Last Updated:** 2024  
**Maintained By:** Development Team
