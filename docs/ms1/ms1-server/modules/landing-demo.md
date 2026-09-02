---
title: Landing Demo API
sidebar_position: 1
description: "The Landing Demo module handles demo requests from the public landing page with OTP-based verification."
---

# Landing Demo API (Server-Side)

> **Note:** This is the **server-side API documentation** for Landing Demo. For the client-side React component, see [MS1 Client - Landing Demo Component](../../ms1-client/components/landing-demo).

The Landing Demo module handles demo requests from the public landing page with OTP-based verification.

## Overview

This module enables:
- Process demo requests from landing page
- OTP-based email verification
- Prevent duplicate submissions
- Queue-based email delivery

## Core Features

- **OTP Generation** – 6-digit OTP codes
- **OTP Verification** – Email verification before saving
- **Duplicate Prevention** – Check for existing verified requests
- **Email Queue** – Reliable email delivery

## API Reference

### 1. Send OTP

**Endpoint:** `POST /api/v1/landing-demo/send-otp`

**Description:** Send OTP to email for demo request verification.

**Request Body:**
```json
{
  "companyName": "Acme Corp",
  "fullName": "John Doe",
  "workingEmail": "john@example.com",
  "mobileNo": "+1234567890",
  "noOfEmp": "50-100"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "code": "SEND_SENT",
  "message": "OTP sent successfully"
}
```

**Response (Error - 409):**
```json
{
  "success": false,
  "code": "ALREADY_REGISTER_FOR_DEMO",
  "field": "workingEmail",
  "message": "Already register for demo"
}
```

### 2. Verify OTP

**Endpoint:** `POST /api/v1/landing-demo/verify-otp`

**Description:** Verify OTP and save demo request.

**Request Body:**
```json
{
  "workingEmail": "john@example.com",
  "otpCode": "123456"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "code": "VERIFY_SUCCESS",
  "message": "Verification successful"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "code": "VERIFY_INVALID_OTP",
  "message": "Invalid OTP"
}
```

## Models

### `model/landingDemoOtp.model.js` – Landing Demo OTP Schema

```javascript
{
  companyName: String,
  fullName: String,
  workingEmail: String (unique),
  mobileNo: String,
  noOfEmp: String,
  otpCode: String,
  otpExpiresAt: Date,
  isVerified: Boolean (default: false)
}
```

## OTP Configuration

- **OTP Length:** 6 digits
- **Expiration:** 2 minutes
- **Format:** Numeric only
- **Generation:** Random 6-digit number

## Email Queue

- OTP emails queued for delivery
- Confirmation emails sent after verification
- Queue-based processing with retries

---

**Next Steps:**
- Read [MS1 Client - Landing Demo Component](../../ms1-client/components/landing-demo) for frontend details
- See [Landing Demo Overview](../../modules/landing-demo-overview) for complete system understanding

