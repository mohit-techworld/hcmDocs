---
title: Contact Component
sidebar_position: 1
description: "The Contact component provides a contact form for the public website to submit inquiries."
---

# Contact Component (MS1 Client)

> **Note:** This is the **client-side React component** documentation. For the server-side API, see [MS1 Server - Contact API](../../ms1-server/modules/contact).

The Contact component provides a contact form for the public website to submit inquiries.

## Overview

Features:
- Contact form with validation
- Email format validation
- Message submission
- Success/error handling
- Queue status display (admin)

## Component Structure

- **Contact Form** – Input fields for contact information
- **Validation** – Real-time form validation
- **Submission** – API integration for form submission
- **Success/Error States** – User feedback

## API Integration

Uses contact API services:
- `sendContactForm(data)` – Submit contact form
- `getQueueStatus()` – Get email queue status (admin)

## State Management

- Form data
- Validation errors
- Submission status
- Success/error messages

---

**Next Steps:**
- Read [MS1 Server - Contact API](../../ms1-server/modules/contact) for backend details
- See [Contact Overview](../../modules/contact-overview) for complete system understanding

