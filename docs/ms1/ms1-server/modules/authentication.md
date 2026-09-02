---
title: Authentication (Company/Tenant) API
sidebar_position: 1
description: "The Authentication module handles company/tenant creation, credential management, and subdomain-based routing for multi-tenant architecture."
---

# Authentication (Company/Tenant) API (Server-Side)

> **Note:** This is the **server-side API documentation** for Authentication. For the client-side React component, see [MS1 Client - Authentication Component](../../ms1-client/components/authentication).

The Authentication module handles company/tenant creation, credential management, and subdomain-based routing for multi-tenant architecture.

## Overview

This module enables:
- Company registration with unique subdomains
- Subdomain-based company identification
- Credential retrieval for company databases
- Feed/configuration management per company

## Core Features

- **Company Creation** – Register new companies with unique subdomains
- **Subdomain Routing** – Middleware-based company identification
- **Credential Management** – Secure retrieval of database credentials
- **Feed Management** – Company-specific configuration retrieval

## API Reference

### 1. Create Company

**Endpoint:** `POST /api/v1/auth/company`

**Description:** Create a new company/tenant.

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
  "message": "Company created successfully!",
  "companyId": 12345,
  "loginUrl": "https://acme.ms1.example.com"
}
```

### 2. Check Company

**Endpoint:** `GET /api/v1/auth/firm`

**Description:** Get company information based on subdomain (via middleware).

**Headers:**
- Subdomain extracted from request host

**Response (Success - 200):**
```json
{
  "success": true,
  "companyAvatar": "https://...",
  "companyId": 12345,
  "companySpecificUrl": "acme"
}
```

### 3. Get Company Credentials

**Endpoint:** `GET /api/v1/auth/credentials`

**Description:** Retrieve database credentials for the company.

**Headers:**
- Subdomain extracted from request host

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Company credentials retrieved successfully",
  "data": {
    "companyId": 12345,
    "uri": "mongodb://...",
    "loginUrl": "https://acme.ms1.example.com",
    "companyName": "Acme Corp",
    "companyAvatar": "https://...",
    "dbName": "acme_12345_..."
  }
}
```

### 4. Get Company Feeds

**Endpoint:** `GET /api/v1/auth/company/:companyId/feeds`

**Description:** Get company configuration and permissions based on subscription plan.

**Path Parameters:**
- `companyId` (number, required) – Company ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Company and admin details retrieved successfully",
  "data": {
    "data": {
      "name": "John Doe",
      "email": "company@example.com",
      "mobile": "+1234567890",
      "password": "...",
      "permissions": ["task.view", "task.create"],
      "secretKey": "..."
    }
  }
}
```

## Models

### `model/tenant.model.js` – Company/Tenant Schema

Stores company information:
- `emailId` – Company email (unique)
- `firstName`, `lastName` – Admin name
- `mobileNo` – Contact number
- `password` – Admin password
- `companyId` – Unique numeric ID
- `companyName` – Company name
- `subdomain` – Unique subdomain (unique)
- `numberOfEmployees` – Employee count
- `dbName`, `uri`, `username`, `password` – Database credentials
- `loginUrl` – Company-specific login URL

## Middleware

### `middleware/subdomain.middleware.js`

Extracts subdomain from request host and attaches company to request:
- Parses hostname to extract subdomain
- Finds company by subdomain
- Attaches company to `req.company`
- Handles errors for invalid/missing subdomains

---

**Next Steps:**
- Read [MS1 Client - Authentication Component](../../ms1-client/components/authentication) for frontend details
- See [Authentication Overview](../../modules/authentication-overview) for complete system understanding

