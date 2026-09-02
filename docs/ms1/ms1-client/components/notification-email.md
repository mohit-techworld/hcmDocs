---
title: Notification Email Component
sidebar_position: 1
description: "The Notification Email component provides an interface for managing system notification email addresses."
---

# Notification Email Component (MS1 Client)

> **Note:** This is the **client-side React component** documentation. For the server-side API, see [MS1 Server - Notification Email API](../../ms1-server/modules/notification-email).

The Notification Email component provides an interface for managing system notification email addresses.

## Overview

Features:
- View notification email list
- Add new notification emails
- Edit existing emails
- Delete notification emails
- Email validation

## Component Structure

- **Email List** – Table/list of notification emails
- **Add Email Form** – Form to add new email
- **Edit Email Form** – Edit existing email
- **Delete Confirmation** – Confirmation modal

## API Integration

Uses notification email API services:
- `getNotificationEmails()` – Get all emails
- `addNotificationEmail(data)` – Add email
- `updateNotificationEmail(id, data)` – Update email
- `deleteNotificationEmail(id)` – Delete email

## State Management

- Email list
- Form data
- Validation errors
- Loading/error states

---

**Next Steps:**
- Read [MS1 Server - Notification Email API](../../ms1-server/modules/notification-email) for backend details
- See [Notification Email Overview](../../modules/notification-email-overview) for complete system understanding

