---
title: Billing Component
sidebar_position: 1
description: "The Billing component (components/Dashboard/SubscriptionManagement.jsx) provides a comprehensive billing dashboard for managing company subscriptions."
---

# Billing Component (MS1 Client)

> **Note:** This is the **client-side React component** documentation. For the server-side API, see [MS1 Server - Billing API](../../ms1-server/modules/billing).

The Billing component (`components/Dashboard/SubscriptionManagement.jsx`) provides a comprehensive billing dashboard for managing company subscriptions, trials, and payments.

## Overview

Features:
- View billing information dashboard
- Trial status and countdown
- Subscription management
- Plan comparison and selection
- Payment history
- Employee add-ons management
- Trial extension requests

## Component Structure

- **Billing Dashboard** – Main billing information display
- **Trial Information** – Trial status, remaining time, progress
- **Subscription Plans** – Plan cards with comparison
- **Payment History** – Transaction history table
- **Employee Add-ons** – Extra employee capacity management
- **Trial Extension** – Request trial extension form

## API Integration

Uses billing API services:
- `getBillingInfo(companyId)` – Get comprehensive billing data
- `requestTrialExtension(companyId, data)` – Extend trial
- `updateSubscription(companyId, data)` – Change plan

## State Management

- Billing data
- Trial information
- Available plans
- Subscription status
- Payment history
- Loading/error states

---

**Next Steps:**
- Read [MS1 Server - Billing API](../../ms1-server/modules/billing) for backend details
- See [Billing Overview](../../modules/billing-overview) for complete system understanding

