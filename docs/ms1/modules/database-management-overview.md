---
title: Database Management - Overview
sidebar_position: 1
description: "The Database Management module handles the creation, deletion, and management of company-specific MongoDB databases. It enables multi-tenant architecture."
---

# Database Management - Complete Guide

The Database Management module handles the creation, deletion, and management of company-specific MongoDB databases. It enables multi-tenant architecture by creating isolated databases for each company with unique credentials.

## How It Works Together

```
╔═══════════════════════════════════════════════════════════════════════╗
║              DATABASE MANAGEMENT - SERVER & CLIENT FLOW                 ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  🖥️  MS1 CLIENT (Frontend)                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  💾 Database Management Components                          │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Create Database                                   │   │   │
│  │  │ • Delete Database                                   │   │   │
│  │  │ • View Database Status                              │   │   │
│  │  │ • Database Credentials                              │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📡 API Calls via databaseApi Service                      │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ POST   /api/v1/database/create                       │   │   │
│  │  │ DELETE /api/v1/database/:companyId                    │   │   │
│  │  │ GET    /api/v1/database/:companyId/status            │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                          ⬇️ HTTP Requests                            │
│                                                                      │
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️  MS1 SERVER (Backend)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🎮 Database Controller                                     │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • createDatabase()                                  │   │   │
│  │  │ • deleteDatabase()                                  │   │   │
│  │  │ • getDatabaseStatus()                                │   │   │
│  │  │ • registerCompany()                                 │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  🔧 Database Service                                        │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Create MongoDB database                          │   │   │
│  │  │ • Create MongoDB user                              │   │   │
│  │  │ • Generate connection URI                          │   │   │
│  │  │ • Delete database and user                         │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  💾 Tenant Model (MongoDB)                                  │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Stores database credentials                      │   │   │
│  │  │ • Tracks database setup status                     │   │   │
│  │  │ • Links company to database                        │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow

### 1. Create Database Flow

```
Admin → Create Database Form → MS1 Client → API Call → MS1 Server → Create MongoDB DB → Create User → Update Company → Success
```

**Steps:**
1. Admin fills company registration form
2. MS1 Client sends POST request to create database
3. MS1 Server validates input (subdomain format, uniqueness)
4. MS1 Server creates company record
5. MS1 Server generates unique database name and credentials
6. MS1 Server creates MongoDB database
7. MS1 Server creates MongoDB user with permissions
8. MS1 Server generates connection URI
9. MS1 Server updates company with database details
10. MS1 Client displays success with credentials

### 2. Delete Database Flow

```
Admin → Delete Database → Confirmation → MS1 Client → API Call → MS1 Server → Delete MongoDB DB → Delete User → Update Company → Success
```

**Steps:**
1. Admin clicks delete database for a company
2. MS1 Client shows confirmation modal
3. Admin confirms deletion
4. MS1 Client sends DELETE request
5. MS1 Server validates company exists
6. MS1 Server deletes MongoDB database
7. MS1 Server deletes MongoDB user
8. MS1 Server updates company status
9. MS1 Client refreshes database list

## Documentation Structure

To understand Database Management completely, read in this order:

### 1. **Start Here** → [Database Management Overview](./database-management-overview) (this page)
   - Understand the complete system
   - See how server and client work together
   - Learn the overall workflow

### 2. **Backend Implementation** → [MS1 Server - Database Management API](../ms1-server/modules/database-management) *(Server-Side/API)*
   - API endpoints and routes
   - Database service utilities
   - Business logic and controllers
   - Security considerations
   - **Note:** This is the server-side API that handles all backend operations

### 3. **Frontend Implementation** → [MS1 Client - Database Management Component](../ms1-client/components/database-management) *(Client-Side)*
   - React component structure
   - Database creation forms
   - Database deletion interface
   - Status display
   - State management
   - API integration
   - **Note:** This is the client-side React component that provides the UI

## Key Concepts

### Server-Side (MS1 Server)
- **Controllers**: Database creation, deletion, status checking
- **Services**: MongoDB database operations, user management
- **Models**: Tenant model with database credentials
- **Security**: Unique credentials per company, isolated databases

### Client-Side (MS1 Client)
- **Components**: Database management interface, creation forms
- **Services**: API service wrappers
- **State**: Database status, credentials, company data
- **UI**: Forms, status indicators, confirmation modals

## Quick Reference

| Task | Server Side | Client Side |
|------|-------------|------------|
| Create Database | `createDatabase()` controller | Database creation form |
| Delete Database | `deleteDatabase()` controller | Delete confirmation modal |
| Check Status | `getDatabaseStatus()` controller | Status display component |
| Register Company | `registerCompany()` controller | Registration form |

---

**Next Steps:**
- Read [MS1 Server - Database Management API](../ms1-server/modules/database-management) for backend details
- Read [MS1 Client - Database Management Component](../ms1-client/components/database-management) for frontend details

