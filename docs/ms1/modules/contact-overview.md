---
title: Contact - Overview
sidebar_position: 1
description: "The Contact module handles contact form submissions from the public website. It processes contact inquiries, sends notification emails to administrators."
---

# Contact - Complete Guide

The Contact module handles contact form submissions from the public website. It processes contact inquiries, sends notification emails to administrators, and provides queue-based email delivery for reliable message handling.

## How It Works Together

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    CONTACT - SERVER & CLIENT FLOW                      ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  🌐 PUBLIC WEBSITE (Frontend)                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  📝 Contact Form Component                                  │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Name Input                                         │   │   │
│  │  │ • Email Input                                        │   │   │
│  │  │ • Company Name Input                                 │   │   │
│  │  │ • Mobile Input                                       │   │   │
│  │  │ • Message Textarea                                   │   │   │
│  │  │ • Submit Button                                      │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📡 API Call to MS1 Server                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ POST   /api/v1/contact/send                         │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                          ⬇️ HTTP Request                             │
│                                                                      │
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️  MS1 SERVER (Backend)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🎮 Contact Controller                                      │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • sendMail()                                        │   │   │
│  │  │ • getQueueStatus()                                  │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📧 Contact Email Service                                   │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Prepares email content                            │   │   │
│  │  │ • Adds to email queue                               │   │   │
│  │  │ • Sends to admin emails                             │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📬 Email Queue                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Queues emails for delivery                        │   │   │
│  │  │ • Processes sequentially                            │   │   │
│  │  │ • Retries on failure                                │   │   │
│  │  │ • Tracks delivery status                            │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow

### 1. Contact Form Submission Flow

```
User → Fills Contact Form → Submit → MS1 Server → Validation → Queue Email → Send to Admins → Success Response
```

**Steps:**
1. User fills contact form on public website
2. User clicks submit button
3. MS1 Client sends POST request with form data
4. MS1 Server validates input (required fields, email format)
5. MS1 Server prepares email content
6. MS1 Server adds email to queue
7. Email queue processes and sends to admin notification emails
8. MS1 Server returns success response
9. User sees confirmation message

### 2. Email Queue Processing Flow

```
Contact Submitted → Email Added to Queue → Queue Processor → Send Email → Update Status → Next Email
```

**Steps:**
1. Contact form submission adds email to queue
2. Email queue processor picks up email
3. Email service sends to configured admin emails
4. Queue updates delivery status
5. If successful, marks as sent
6. If failed, retries up to 3 times
7. Processes next email in queue

## Documentation Structure

To understand Contact completely, read in this order:

### 1. **Start Here** → [Contact Overview](./contact-overview) (this page)
   - Understand the complete system
   - See how server and client work together
   - Learn the overall workflow

### 2. **Backend Implementation** → [MS1 Server - Contact API](../ms1-server/modules/contact) *(Server-Side/API)*
   - API endpoints and routes
   - Email service and queue
   - Validation rules
   - **Note:** This is the server-side API that handles all backend operations

### 3. **Frontend Implementation** → [MS1 Client - Contact Component](../ms1-client/components/contact) *(Client-Side)*
   - React component structure
   - Contact form UI
   - Validation and error handling
   - Success/error states
   - **Note:** This is the client-side React component for the contact form

## Key Concepts

### Server-Side (MS1 Server)
- **Controllers**: Contact form processing, email queue status
- **Services**: Contact email service, email queue management
- **Validation**: Input validation using express-validator
- **Email Queue**: Reliable email delivery with retry logic

### Client-Side (Public Website)
- **Components**: Contact form with validation
- **Services**: API service wrappers
- **State**: Form data, validation errors, submission status
- **UI**: Form inputs, validation messages, success/error states

## Quick Reference

| Task | Server Side | Client Side |
|------|-------------|------------|
| Submit Contact Form | `sendMail()` controller | Contact form component |
| Check Queue Status | `getQueueStatus()` controller | Queue status display (admin) |
| Send Notification Email | Email service | Automatic on submission |

---

**Next Steps:**
- Read [MS1 Server - Contact API](../ms1-server/modules/contact) for backend details
- Read [MS1 Client - Contact Component](../ms1-client/components/contact) for frontend details

