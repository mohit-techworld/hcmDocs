---
title: Billing - Overview
sidebar_position: 1
---

# Billing - Complete Guide

The Billing module provides comprehensive billing information, subscription management, trial tracking, and payment history for companies. It enables administrators to view and manage company subscriptions, billing cycles, and employee add-ons.

## How It Works Together

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    BILLING - SERVER & CLIENT FLOW                       ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  🖥️  MS1 CLIENT (Frontend)                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  💰 Billing Components                                      │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Billing Dashboard                                  │   │   │
│  │  │ • Subscription Management                           │   │   │
│  │  │ • Trial Information                                  │   │   │
│  │  │ • Payment History                                    │   │   │
│  │  │ • Plan Comparison                                    │   │   │
│  │  │ • Employee Add-ons                                   │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📡 API Calls via billingApi Service                       │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ GET    /api/v1/billing/:companyId                     │   │   │
│  │  │ POST   /api/v1/billing/:companyId/extend-trial       │   │   │
│  │  │ POST   /api/v1/billing/:companyId/update-subscription│   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                          ⬇️ HTTP Requests                            │
│                                                                      │
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️  MS1 SERVER (Backend)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🎮 Billing Controller                                      │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • getBillingInfo()                                  │   │   │
│  │  │ • requestTrialExtension()                           │   │   │
│  │  │ • updateSubscription()                              │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  💾 Tenant Model (MongoDB)                                  │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Subscription history                               │   │   │
│  │  │ • Trial dates                                       │   │   │
│  │  │ • Current plan                                      │   │   │
│  │  │ • Employee limits                                   │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  💰 Pricing Plan Model                                     │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Plan details                                      │   │   │
│  │  │ • Pricing information                               │   │   │
│  │  │ • Features and limits                              │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow

### 1. View Billing Information Flow

```
Admin → Billing Page → MS1 Client → API Call → MS1 Server → Aggregate Data → Return Billing Info → Display Dashboard
```

**Steps:**
1. Admin opens billing page for a company
2. MS1 Client sends GET request with companyId
3. MS1 Server retrieves company and plan data
4. MS1 Server calculates trial information, billing history, next billing date
5. MS1 Server formats comprehensive billing data
6. MS1 Client displays billing dashboard with all information

### 2. Trial Extension Flow

```
Admin → Request Trial Extension → MS1 Client → API Call → MS1 Server → Validate → Extend Trial → Update Company → Success
```

**Steps:**
1. Admin requests trial extension for a company
2. MS1 Client sends POST request with reason and days
3. MS1 Server validates request (trial status, permissions)
4. MS1 Server extends trial end date
5. MS1 Server updates company record
6. MS1 Client refreshes billing information

### 3. Subscription Update Flow

```
Admin → Update Subscription → MS1 Client → API Call → MS1 Server → Validate Plan → Update Company → Sync Permissions → Success
```

**Steps:**
1. Admin updates company subscription plan
2. MS1 Client sends POST request with new plan
3. MS1 Server validates plan exists and is active
4. MS1 Server updates company subscription
5. MS1 Server syncs plan permissions to company
6. MS1 Server records subscription history
7. MS1 Client refreshes billing dashboard

## Documentation Structure

To understand Billing completely, read in this order:

### 1. **Start Here** → [Billing Overview](./billing-overview) (this page)
   - Understand the complete system
   - See how server and client work together
   - Learn the overall workflow

### 2. **Backend Implementation** → [MS1 Server - Billing API](../ms1-server/modules/billing) *(Server-Side/API)*
   - API endpoints and routes
   - Database models and schemas
   - Business logic and controllers
   - Calculation methods
   - **Note:** This is the server-side API that handles all backend operations

### 3. **Frontend Implementation** → [MS1 Client - Billing Component](../ms1-client/components/billing) *(Client-Side)*
   - React component structure
   - Billing dashboard UI
   - Subscription management interface
   - Trial extension forms
   - State management
   - API integration
   - **Note:** This is the client-side React component that provides the UI

## Key Concepts

### Server-Side (MS1 Server)
- **Models**: Tenant model with subscription data, PricingPlan model
- **Controllers**: Billing information retrieval, trial extension, subscription updates
- **Calculations**: Trial remaining time, billing cycles, employee limits
- **Integration**: Plan Management, Permission sync

### Client-Side (MS1 Client)
- **Components**: Billing dashboard, subscription management, trial extension
- **Services**: API service wrappers
- **State**: Billing data, subscription info, trial status
- **UI**: Charts, tables, forms, plan comparison

## Quick Reference

| Task | Server Side | Client Side |
|------|-------------|------------|
| View Billing Info | `getBillingInfo()` controller | Billing dashboard component |
| Extend Trial | `requestTrialExtension()` controller | Trial extension form |
| Update Subscription | `updateSubscription()` controller | Subscription update form |
| View Payment History | Included in billing info | Payment history table |

---

**Next Steps:**
- Read [MS1 Server - Billing API](../ms1-server/modules/billing) for backend details
- Read [MS1 Client - Billing Component](../ms1-client/components/billing) for frontend details

