---
title: Authentication Component
sidebar_position: 1
---

# Authentication (Company/Tenant) Component (MS1 Client)

> **Note:** This is the **client-side React component** documentation. For the server-side API, see [MS1 Server - Authentication API](../../ms1-server/modules/authentication).

The Authentication components handle company registration, credential management, and subdomain-based routing in MS1 Client.

## Overview

Components provide interfaces for:
- Company registration and creation
- Credential retrieval and display
- Subdomain management
- Feed/configuration management

## Components

### Company Registration
- Registration form with validation
- Subdomain availability checking
- Company creation API integration
- Success/error handling

### Credential Display
- Secure credential viewing
- Database connection info
- Login URL display
- Copy-to-clipboard functionality

## API Integration

Uses auth API services:
- `createCompany(data)` – Create new company
- `getCompanyCredentials()` – Get credentials
- `getFeeds(companyId)` – Get company feeds

## State Management

- Company data
- Credentials (secure display)
- Form validation
- Loading/error states

---

**Next Steps:**
- Read [MS1 Server - Authentication API](../../ms1-server/modules/authentication) for backend details
- See [Authentication Overview](../modules/authentication-overview) for complete system understanding

