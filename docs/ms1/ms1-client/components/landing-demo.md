---
title: Landing Demo Component
sidebar_position: 1
---

# Landing Demo Component (MS1 Client)

> **Note:** This is the **client-side React component** documentation. For the server-side API, see [MS1 Server - Landing Demo API](../../ms1-server/modules/landing-demo).

The Landing Demo component (`components/landing-demo/LandingDemo.jsx`) provides a demo request form for the public landing page.

## Overview

Features:
- Demo request form
- OTP verification
- Email validation
- Duplicate prevention
- Success/error handling

## Component Structure

- **Demo Request Form** – Input fields for demo information
- **OTP Verification** – OTP input and verification
- **Success State** – Confirmation message
- **Error Handling** – Error message display

## API Integration

Uses landing demo API services:
- `sendOTP(data)` – Request OTP
- `verifyOTP(data)` – Verify OTP and save request

## State Management

- Form data
- OTP status
- Verification state
- Success/error messages

---

**Next Steps:**
- Read [MS1 Server - Landing Demo API](../../ms1-server/modules/landing-demo) for backend details
- See [Landing Demo Overview](../modules/landing-demo-overview) for complete system understanding

