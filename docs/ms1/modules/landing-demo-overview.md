---
title: Landing Demo - Overview
sidebar_position: 1
---

# Landing Demo - Complete Guide

The Landing Demo module handles demo requests from the public landing page. It provides OTP-based verification to prevent spam and duplicate submissions, then processes verified demo requests for the sales team.

## How It Works Together

```
╔═══════════════════════════════════════════════════════════════════════╗
║                  LANDING DEMO - SERVER & CLIENT FLOW                   ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  🌐 LANDING PAGE (Frontend)                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  📝 Landing Demo Form Component                             │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Company Name Input                                 │   │   │
│  │  │ • Full Name Input                                    │   │   │
│  │  │ • Email Input                                        │   │   │
│  │  │ • Mobile Input                                       │   │   │
│  │  │ • Number of Employees Input                          │   │   │
│  │  │ • Submit Button                                      │   │   │
│  │  │ • OTP Verification                                   │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📡 API Calls to MS1 Server                                │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ POST   /api/v1/landing-demo/send-otp                │   │   │
│  │  │ POST   /api/v1/landing-demo/verify-otp              │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                          ⬇️ HTTP Requests                            │
│                                                                      │
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️  MS1 SERVER (Backend)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🎮 Landing Demo Controller                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • sendOTP()                                         │   │   │
│  │  │ • verifyOTP()                                       │   │   │
│  │  │ • getDemoRequests()                                 │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  💾 Landing Demo OTP Model                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Stores demo request data                         │   │   │
│  │  │ • Manages OTP codes                                │   │   │
│  │  │ • Tracks verification status                        │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📧 Email Queue                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Sends OTP emails                                  │   │   │
│  │  │ • Sends confirmation emails                         │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow

### 1. Demo Request with OTP Flow

```
User → Fills Demo Form → Submit → MS1 Server → Generate OTP → Send Email → User Enters OTP → Verify → Save Request → Success
```

**Steps:**
1. User fills demo request form on landing page
2. User clicks submit
3. MS1 Client sends POST request with demo data
4. MS1 Server checks for existing verified requests
5. If exists, returns error (already registered)
6. If not, generates 6-digit OTP
7. MS1 Server saves request with OTP (unverified)
8. MS1 Server sends OTP email to user
9. User enters OTP in form
10. MS1 Client sends verify OTP request
11. MS1 Server verifies OTP
12. MS1 Server marks request as verified
13. MS1 Server sends confirmation email
14. User sees success message

## Documentation Structure

To understand Landing Demo completely, read in this order:

### 1. **Start Here** → [Landing Demo Overview](./landing-demo-overview) (this page)
   - Understand the complete system
   - See how server and client work together
   - Learn the overall workflow

### 2. **Backend Implementation** → [MS1 Server - Landing Demo API](../ms1-server/modules/landing-demo) *(Server-Side/API)*
   - API endpoints and routes
   - Database models and schemas
   - OTP generation and verification
   - Email services
   - **Note:** This is the server-side API that handles all backend operations

### 3. **Frontend Implementation** → [MS1 Client - Landing Demo Component](../ms1-client/components/landing-demo) *(Client-Side)*
   - React component structure
   - Demo request form
   - OTP verification UI
   - State management
   - API integration
   - **Note:** This is the client-side React component for the landing page

## Key Concepts

### Server-Side (MS1 Server)
- **Models**: LandingDemoOtp schema with OTP management
- **Controllers**: OTP sending, verification, demo request retrieval
- **Security**: OTP expiration (2 minutes), duplicate prevention
- **Email**: OTP and confirmation emails via queue

### Client-Side (Landing Page)
- **Components**: Demo request form, OTP verification
- **Services**: API service wrappers
- **State**: Form data, OTP status, verification state
- **UI**: Form inputs, OTP input, success/error messages

## Quick Reference

| Task | Server Side | Client Side |
|------|-------------|------------|
| Send OTP | `sendOTP()` controller | Demo form submission |
| Verify OTP | `verifyOTP()` controller | OTP verification form |
| Get Demo Requests | `getDemoRequests()` controller | Admin dashboard (if implemented) |

---

**Next Steps:**
- Read [MS1 Server - Landing Demo API](../ms1-server/modules/landing-demo) for backend details
- Read [MS1 Client - Landing Demo Component](../ms1-client/components/landing-demo) for frontend details

