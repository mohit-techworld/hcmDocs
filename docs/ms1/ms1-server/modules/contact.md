---
title: Contact API
sidebar_position: 1
description: "The Contact module handles contact form submissions from the public website with queue-based email delivery."
---

# Contact API (Server-Side)

> **Note:** This is the **server-side API documentation** for Contact. For the client-side React component, see [MS1 Client - Contact Component](../../ms1-client/components/contact).

The Contact module handles contact form submissions from the public website with queue-based email delivery.

## Overview

This module enables:
- Process contact form submissions
- Send notification emails to administrators
- Queue-based reliable email delivery
- Email queue status monitoring

## Core Features

- **Contact Form Processing** – Validate and process submissions
- **Email Queue** – Reliable email delivery with retry logic
- **Queue Status** – Monitor email queue status
- **Validation** – Input validation using express-validator

## API Reference

### 1. Send Contact Email

**Endpoint:** `POST /api/v1/contact/send`

**Description:** Process contact form submission and queue emails.

**Request Body:**
```json
{
  "fullname": "John Doe",
  "workingEmail": "john@example.com",
  "companyName": "Acme Corp",
  "mobile": "+1234567890",
  "countryCode": "+1",
  "message": "I'm interested in your product..."
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Contact form submitted successfully! We will get back to you soon.",
  "data": {
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "contactId": "507f1f77bcf86cd799439011",
    "emailsQueued": true,
    "queueStatus": {
      "queueLength": 1,
      "processing": false
    }
  }
}
```

### 2. Get Queue Status

**Endpoint:** `GET /api/v1/contact/queue-status`

**Description:** Get current email queue status.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Email queue status retrieved successfully",
  "data": {
    "queueLength": 2,
    "processing": true,
    "processingIds": ["contact-123", "contact-124"],
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## Validation

Uses `express-validator` for input validation:
- `fullname` – Required, 2-100 characters
- `workingEmail` – Required, valid email format
- `message` – Required, 10-5000 characters
- `companyName` – Optional, 2-100 characters
- `mobile` – Optional, valid phone format
- `countryCode` – Optional, valid country code

## Email Service

### `utils/contactEmailService.js`

- Prepares email content from contact data
- Adds emails to queue for delivery
- Sends to configured admin notification emails
- Handles email template processing

### `utils/emailQueue.js`

- In-memory email queue
- Sequential processing
- Automatic retry on failure (max 3 attempts)
- Tracks delivery status

---

**Next Steps:**
- Read [MS1 Client - Contact Component](../../ms1-client/components/contact) for frontend details
- See [Contact Overview](../../modules/contact-overview) for complete system understanding

