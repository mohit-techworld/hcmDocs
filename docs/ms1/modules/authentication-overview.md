---
title: Authentication (Company/Tenant) - Overview
sidebar_position: 1
---

# Authentication (Company/Tenant) - Complete Guide

The Authentication module handles company/tenant creation, credential management, and subdomain-based routing. It enables multi-tenant architecture where each company has its own isolated database and access credentials.

## How It Works Together

```
╔═══════════════════════════════════════════════════════════════════════╗
║        AUTHENTICATION (COMPANY/TENANT) - SERVER & CLIENT FLOW          ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  🖥️  MS1 CLIENT (Frontend)                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🏢 Company Management Components                           │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Company Registration                               │   │   │
│  │  │ • Credential Retrieval                               │   │   │
│  │  │ • Subdomain Management                               │   │   │
│  │  │ • Feed Management                                    │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📡 API Calls via authApi Service                          │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ POST   /api/v1/auth/company                          │   │   │
│  │  │ GET    /api/v1/auth/firm                             │   │   │
│  │  │ GET    /api/v1/auth/credentials                      │   │   │
│  │  │ GET    /api/v1/auth/company/:companyId/feeds        │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                          ⬇️ HTTP Requests                            │
│                                                                      │
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️  MS1 SERVER (Backend)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🎮 Auth Controller                                         │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • createCompany()                                    │   │   │
│  │  │ • checkCompany()                                     │   │   │
│  │  │ • getCompanyCredentials()                            │   │   │
│  │  │ • getFeeds()                                         │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  🔐 Subdomain Middleware                                   │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Extracts subdomain from request                    │   │   │
│  │  │ • Finds company by subdomain                         │   │   │
│  │  │ • Attaches company to request                        │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  💾 Tenant Model (MongoDB)                                  │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Stores company information                         │   │   │
│  │  │ • Manages subdomains                                 │   │   │
│  │  │ • Tracks credentials                                 │   │   │
│  │  │ • Links to database                                  │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow

### 1. Company Registration Flow

```
Admin → Registration Form → MS1 Client → API Call → MS1 Server → Create Company → Generate Credentials → Return Success
```

**Steps:**
1. Admin fills company registration form
2. MS1 Client sends POST request to create company
3. MS1 Server validates input (email, subdomain uniqueness)
4. MS1 Server creates company record with unique companyId
5. MS1 Server generates login URL and credentials
6. MS1 Client displays success with company details

### 2. Subdomain-Based Routing Flow

```
User → Subdomain Request → Middleware → Find Company → Attach to Request → Route Handler
```

**Steps:**
1. User accesses `company1.ms1.example.com`
2. Subdomain middleware extracts "company1"
3. Middleware finds company by subdomain
4. Middleware attaches company to request object
5. Route handler uses company data
6. Response includes company-specific information

### 3. Credential Retrieval Flow

```
Admin → Request Credentials → Subdomain Check → MS1 Server → Return Credentials → Display
```

**Steps:**
1. Admin requests company credentials
2. Subdomain middleware identifies company
3. MS1 Server retrieves company data
4. MS1 Server returns credentials (dbName, uri, loginUrl)
5. MS1 Client displays credentials securely

## Documentation Structure

To understand Authentication (Company/Tenant) completely, read in this order:

### 1. **Start Here** → [Authentication Overview](./authentication-overview) (this page)
   - Understand the complete system
   - See how server and client work together
   - Learn the overall workflow

### 2. **Backend Implementation** → [MS1 Server - Authentication API](../ms1-server/modules/authentication) *(Server-Side/API)*
   - API endpoints and routes
   - Database models and schemas
   - Subdomain middleware
   - Business logic and controllers
   - **Note:** This is the server-side API that handles all backend operations

### 3. **Frontend Implementation** → [MS1 Client - Authentication Component](../ms1-client/components/authentication) *(Client-Side)*
   - React component structure
   - Company registration forms
   - Credential display
   - State management
   - API integration
   - **Note:** This is the client-side React component that provides the UI

## Key Concepts

### Server-Side (MS1 Server)
- **Models**: Tenant/Company schema with subdomain, credentials, database info
- **Controllers**: Company creation, credential retrieval, feed management
- **Middleware**: Subdomain extraction and company resolution
- **Routes**: RESTful API endpoints with subdomain support
- **Security**: Subdomain-based isolation, credential protection

### Client-Side (MS1 Client)
- **Components**: Company registration, credential management
- **Services**: API service wrappers
- **State**: Company data, credentials
- **UI**: Forms, credential display

## Quick Reference

| Task | Server Side | Client Side |
|------|-------------|------------|
| Create Company | `createCompany()` controller | Registration form component |
| Check Company | `checkCompany()` controller | Company verification |
| Get Credentials | `getCompanyCredentials()` controller | Credential display component |
| Get Feeds | `getFeeds()` controller | Feed management component |

---

**Next Steps:**
- Read [MS1 Server - Authentication API](../ms1-server/modules/authentication) for backend details
- Read [MS1 Client - Authentication Component](../ms1-client/components/authentication) for frontend details

