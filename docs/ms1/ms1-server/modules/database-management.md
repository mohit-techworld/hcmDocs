---
title: Database Management API
sidebar_position: 1
description: "The Database Management module handles creation, deletion, and management of company-specific MongoDB databases for multi-tenant architecture."
---

# Database Management API (Server-Side)

> **Note:** This is the **server-side API documentation** for Database Management. For the client-side React component, see [MS1 Client - Database Management Component](../../ms1-client/components/database-management).

The Database Management module handles creation, deletion, and management of company-specific MongoDB databases for multi-tenant architecture.

## Overview

This module enables:
- Create isolated MongoDB databases per company
- Generate unique database credentials
- Delete databases and clean up resources
- Track database setup status

## Core Features

- **Database Creation** – Create MongoDB databases with unique names
- **User Management** – Create MongoDB users with proper permissions
- **Database Deletion** – Safely delete databases and users
- **Credential Management** – Generate and store connection URIs
- **Status Tracking** – Track database setup completion

## API Reference

### 1. Create Database

**Endpoint:** `POST /api/v1/database/create`

**Description:** Create a new MongoDB database for a company.

**Request Body:**
```json
{
  "emailId": "company@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "mobileNo": "+1234567890",
  "password": "SecurePass123!",
  "companyName": "Acme Corp",
  "subdomain": "acme",
  "numberOfEmployees": 50
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Company database created successfully",
  "data": {
    "companyId": 12345,
    "companyName": "Acme Corp",
    "subdomain": "acme",
    "dbName": "acme_12345_15_01_2024_10_30_00",
    "loginUrl": "https://acme.ms1.example.com",
    "status": "active",
    "isDatabaseSetup": true
  }
}
```

### 2. Delete Database

**Endpoint:** `DELETE /api/v1/database/:companyId`

**Description:** Delete a company's database and user.

**Path Parameters:**
- `companyId` (number, required) – Company ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Database deleted successfully"
}
```

### 3. Register Company

**Endpoint:** `POST /api/v1/database/register`

**Description:** Register company and send OTP for verification (two-step process).

**Request Body:**
```json
{
  "emailId": "company@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "mobileNo": "+1234567890",
  "password": "SecurePass123!",
  "companyName": "Acme Corp",
  "subdomain": "acme",
  "numberOfEmployees": 50
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "OTP sent to email",
  "data": {
    "companyId": 12345,
    "email": "company@example.com"
  }
}
```

## Database Service

### `utils/database.utils.js`

**Functions:**
- `createDatabaseConnection(dbName)` – Create MongoDB connection
- `createMongoUser(dbName, username, password, connection)` – Create database user
- `deleteDatabase(dbName, username)` – Delete database and user
- `testConnection(uri)` – Test database connection

## Security

- Unique database names per company
- Unique MongoDB users per database
- Credentials stored securely in company record
- Database isolation between companies
- Proper cleanup on deletion

---

**Next Steps:**
- Read [MS1 Client - Database Management Component](../../ms1-client/components/database-management) for frontend details
- See [Database Management Overview](../../modules/database-management-overview) for complete system understanding

