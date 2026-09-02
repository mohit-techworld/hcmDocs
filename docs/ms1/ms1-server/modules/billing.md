---
title: Billing API
sidebar_position: 1
description: "The Billing module provides comprehensive billing information, subscription management, and trial tracking for companies."
---

# Billing API (Server-Side)

> **Note:** This is the **server-side API documentation** for Billing. For the client-side React component, see [MS1 Client - Billing Component](../../ms1-client/components/billing).

The Billing module provides comprehensive billing information, subscription management, and trial tracking for companies.

## Overview

This module enables:
- View comprehensive billing information
- Track trial periods and expiration
- Manage subscriptions and plan changes
- View billing history and payment records
- Request trial extensions
- Manage employee add-ons

## Core Features

- **Billing Information** – Complete billing dashboard data
- **Trial Management** – Track and extend trial periods
- **Subscription Updates** – Change plans and sync permissions
- **Payment History** – Track subscription and payment records
- **Employee Add-ons** – Manage extra employee capacity

## API Reference

### 1. Get Billing Information

**Endpoint:** `GET /api/v1/billing/:companyId`

**Description:** Get comprehensive billing information for a company.

**Path Parameters:**
- `companyId` (number, required) – Company ID

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "companyData": {
      "companyId": 12345,
      "companyName": "Acme Corp",
      "emailId": "company@example.com",
      "status": "active"
    },
    "trialInfo": {
      "isTrialActive": true,
      "isTrialExpired": false,
      "trialStartDate": "2024-01-01T00:00:00.000Z",
      "trialEndDate": "2024-01-31T23:59:59.000Z",
      "remainingDays": 15,
      "detailedTimeRemaining": {
        "days": 15,
        "hours": 5,
        "minutes": 30
      }
    },
    "subscriptionData": {
      "currentPlan": "PREMIUM",
      "subscriptionStatus": "active",
      "monthlyCharges": 5000,
      "nextBillingDate": "2024-02-15T00:00:00.000Z",
      "employeeAddOns": {
        "extraEmployees": 10,
        "effectiveEmployeeLimit": 60
      }
    },
    "availablePlans": [...],
    "billingHistory": [...]
  }
}
```

### 2. Request Trial Extension

**Endpoint:** `POST /api/v1/billing/:companyId/extend-trial`

**Description:** Request extension of trial period.

**Path Parameters:**
- `companyId` (number, required) – Company ID

**Request Body:**
```json
{
  "reason": "Need more time to evaluate",
  "requestedDays": 7
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Trial extended successfully",
  "data": {
    "newTrialEndDate": "2024-02-07T23:59:59.000Z",
    "remainingDays": 22
  }
}
```

### 3. Update Subscription

**Endpoint:** `POST /api/v1/billing/:companyId/update-subscription`

**Description:** Update company subscription plan.

**Path Parameters:**
- `companyId` (number, required) – Company ID

**Request Body:**
```json
{
  "plan": "ENTERPRISE",
  "reason": "Upgrading for more features"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Subscription updated successfully",
  "data": {
    "currentPlan": "ENTERPRISE",
    "permissions": [...],
    "nextBillingDate": "2024-02-15T00:00:00.000Z"
  }
}
```

## Models

### `model/tenant.model.js` – Company Billing Fields

- `currentSubscription` – Current plan name
- `trialStartDate`, `trialEndDate` – Trial period dates
- `subscriptionHistory` – Array of subscription changes
- `planHistory` – Detailed plan change history
- `employeeAddOns` – Extra employee capacity
- `status` – Account status (active, suspended, etc.)

### `model/pricingPlan.model.js` – Plan Information

- `name` – Plan identifier
- `priceMonthlyINR`, `priceYearlyINR` – Pricing
- `features` – Plan features/permissions
- `active` – Plan availability

---

**Next Steps:**
- Read [MS1 Client - Billing Component](../../ms1-client/components/billing) for frontend details
- See [Billing Overview](../../modules/billing-overview) for complete system understanding

