---
title: Notification Email - Overview
sidebar_position: 1
---

# Notification Email - Complete Guide

The Notification Email module manages the list of email addresses that receive automated notifications from the system. It allows administrators to add, update, and remove notification recipients for various system events.

## How It Works Together

```
╔═══════════════════════════════════════════════════════════════════════╗
║            NOTIFICATION EMAIL - SERVER & CLIENT FLOW                    ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  🖥️  MS1 CLIENT (Frontend)                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  📧 Notification Email Component                           │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • View Email List                                    │   │   │
│  │  │ • Add Email Address                                  │   │   │
│  │  │ • Edit Email Address                                 │   │   │
│  │  │ • Delete Email Address                               │   │   │
│  │  │ • Email Validation                                   │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📡 API Calls via notificationEmailApi Service            │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ GET    /api/v1/notification-email                    │   │   │
│  │  │ POST   /api/v1/notification-email                    │   │   │
│  │  │ PUT    /api/v1/notification-email/:id                │   │   │
│  │  │ DELETE /api/v1/notification-email/:id                │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                          ⬇️ HTTP Requests                            │
│                                                                      │
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️  MS1 SERVER (Backend)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🎮 Notification Email Controller                           │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • getAllNotificationEmails()                        │   │   │
│  │  │ • addNotificationEmail()                            │   │   │
│  │  │ • updateNotificationEmail()                         │   │   │
│  │  │ • deleteNotificationEmail()                         │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  💾 Notification Email Model (MongoDB)                      │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Stores email addresses                            │   │   │
│  │  │ • Tracks name/description                           │   │   │
│  │  │ • Records added by info                            │   │   │
│  │  │ • Timestamps                                        │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📧 Email Service Integration                               │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Uses notification emails for system alerts        │   │   │
│  │  │ • Sends to all registered emails                    │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow

### 1. Add Notification Email Flow

```
Admin → Add Email Form → MS1 Client → API Call → MS1 Server → Validate → Check Duplicate → Save → Success
```

**Steps:**
1. Admin opens Notification Email management page
2. Admin clicks "Add Email"
3. Admin fills form (email, name)
4. MS1 Client sends POST request
5. MS1 Server validates email format
6. MS1 Server checks for duplicate email
7. MS1 Server saves notification email
8. MS1 Client refreshes email list

### 2. System Notification Flow

```
System Event → Email Service → Get Notification Emails → Send to All → Delivery Status
```

**Steps:**
1. System event occurs (e.g., new demo request)
2. Email service retrieves all notification emails
3. Email service sends notification to each email
4. Email queue processes deliveries
5. Delivery status tracked

## Documentation Structure

To understand Notification Email completely, read in this order:

### 1. **Start Here** → [Notification Email Overview](./notification-email-overview) (this page)
   - Understand the complete system
   - See how server and client work together
   - Learn the overall workflow

### 2. **Backend Implementation** → [MS1 Server - Notification Email API](../ms1-server/modules/notification-email) *(Server-Side/API)*
   - API endpoints and routes
   - Database models and schemas
   - Business logic and controllers
   - Validation rules
   - **Note:** This is the server-side API that handles all backend operations

### 3. **Frontend Implementation** → [MS1 Client - Notification Email Component](../ms1-client/components/notification-email) *(Client-Side)*
   - React component structure
   - Email list display
   - Add/Edit/Delete forms
   - State management
   - API integration
   - **Note:** This is the client-side React component that provides the UI

## Key Concepts

### Server-Side (MS1 Server)
- **Models**: NotificationEmail schema with email and metadata
- **Controllers**: CRUD operations for notification emails
- **Validation**: Email format validation, duplicate checking
- **Integration**: Used by email services for system notifications

### Client-Side (MS1 Client)
- **Components**: Notification email management interface
- **Services**: API service wrappers
- **State**: Email list, form data, validation errors
- **UI**: Table/list, forms, validation messages

## Quick Reference

| Task | Server Side | Client Side |
|------|-------------|------------|
| View Emails | `getAllNotificationEmails()` controller | Email list component |
| Add Email | `addNotificationEmail()` controller | Add email form |
| Update Email | `updateNotificationEmail()` controller | Edit email form |
| Delete Email | `deleteNotificationEmail()` controller | Delete confirmation |

---

**Next Steps:**
- Read [MS1 Server - Notification Email API](../ms1-server/modules/notification-email) for backend details
- Read [MS1 Client - Notification Email Component](../ms1-client/components/notification-email) for frontend details

