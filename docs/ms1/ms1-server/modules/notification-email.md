---
title: Notification Email API
sidebar_position: 1
---

# Notification Email API (Server-Side)

> **Note:** This is the **server-side API documentation** for Notification Email. For the client-side React component, see [MS1 Client - Notification Email Component](../../ms1-client/components/notification-email).

The Notification Email module manages the list of email addresses that receive automated system notifications.

## Overview

This module enables:
- Add email addresses for notifications
- Update notification email details
- Remove notification emails
- View all notification emails

## Core Features

- **Email Management** – CRUD operations for notification emails
- **Duplicate Prevention** – Ensure unique email addresses
- **Audit Trail** – Track who added emails
- **Integration** – Used by email services for system alerts

## API Reference

### 1. Get All Notification Emails

**Endpoint:** `GET /api/v1/notification-email`

**Description:** Get all notification email addresses.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Notification emails retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "admin@example.com",
      "name": "Admin Team",
      "addedBy": "System Admin",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

### 2. Add Notification Email

**Endpoint:** `POST /api/v1/notification-email`

**Description:** Add a new notification email address.

**Request Body:**
```json
{
  "email": "notifications@example.com",
  "name": "Notification Team"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Notification email added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "notifications@example.com",
    "name": "Notification Team",
    "addedBy": "Admin User",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Update Notification Email

**Endpoint:** `PUT /api/v1/notification-email/:id`

**Description:** Update notification email details.

**Path Parameters:**
- `id` (string, required) – Notification email ID

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "name": "Updated Name"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Notification email updated successfully",
  "data": {...}
}
```

### 4. Delete Notification Email

**Endpoint:** `DELETE /api/v1/notification-email/:id`

**Description:** Remove a notification email address.

**Path Parameters:**
- `id` (string, required) – Notification email ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Notification email deleted successfully"
}
```

## Models

### `model/notificationEmail.model.js` – Notification Email Schema

```javascript
{
  email: String (required, unique, lowercase),
  name: String,
  addedBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Integration

Notification emails are used by:
- Demo Management – New demo request notifications
- Contact Form – Contact submission notifications
- System Alerts – Critical system notifications
- Email Queue – Batch email delivery

---

**Next Steps:**
- Read [MS1 Client - Notification Email Component](../../ms1-client/components/notification-email) for frontend details
- See [Notification Email Overview](../modules/notification-email-overview) for complete system understanding

