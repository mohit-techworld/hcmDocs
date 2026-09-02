---
title: Database Management Component
sidebar_position: 1
description: "The Database Management component (components/database-management/DatabaseManagement.jsx) provides interfaces for creating and managing company databases."
---

# Database Management Component (MS1 Client)

> **Note:** This is the **client-side React component** documentation. For the server-side API, see [MS1 Server - Database Management API](../../ms1-server/modules/database-management).

The Database Management component (`components/database-management/DatabaseManagement.jsx`) provides interfaces for creating and managing company databases.

## Overview

Features:
- Database creation form
- Database deletion interface
- Database status display
- Credential viewing
- Company registration with OTP

## Component Structure

- **Database Creation Form** – Company registration and database setup
- **Database List** – View all company databases
- **Database Deletion** – Delete database with confirmation
- **Status Display** – Database setup status indicators

## API Integration

Uses database API services:
- `createDatabase(data)` – Create company database
- `deleteDatabase(companyId)` – Delete database
- `getDatabaseStatus(companyId)` – Get status
- `registerCompany(data)` – Register with OTP

## State Management

- Database list
- Creation form data
- Status information
- Loading/error states

---

**Next Steps:**
- Read [MS1 Server - Database Management API](../../ms1-server/modules/database-management) for backend details
- See [Database Management Overview](../../modules/database-management-overview) for complete system understanding

