---
title: Admin User Management - Overview
sidebar_position: 1
description: "The Admin User Management system handles all aspects of administrator user accounts in MS1, including registration, authentication, profile management."
---

# Admin User Management - Complete Guide

The Admin User Management system handles all aspects of administrator user accounts in MS1, including registration, authentication, profile management, password management, and access control.

## How It Works Together

```
╔═══════════════════════════════════════════════════════════════════════╗
║        ADMIN USER MANAGEMENT - SERVER & CLIENT FLOW                    ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  🖥️  MS1 CLIENT (Frontend)                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  👤 Admin User Components                                   │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Login Page                                         │   │   │
│  │  │ • User Registration                                  │   │   │
│  │  │ • Profile Management                                 │   │   │
│  │  │ • Password Management                                │   │   │
│  │  │ • User List & Management                             │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📡 API Calls via authApi Service                          │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ POST   /api/v1/admin-user/register                   │   │   │
│  │  │ POST   /api/v1/admin-user/login                      │   │   │
│  │  │ GET    /api/v1/admin-user/profile                    │   │   │
│  │  │ PUT    /api/v1/admin-user/profile                    │   │   │
│  │  │ POST   /api/v1/admin-user/forgot-password            │   │   │
│  │  │ ...                                                   │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                          ⬇️ HTTP Requests                            │
│                                                                      │
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️  MS1 SERVER (Backend)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🎮 Admin User Controller                                   │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • register()                                        │   │   │
│  │  │ • login()                                           │   │   │
│  │  │ • getProfile()                                      │   │   │
│  │  │ • updateProfile()                                   │   │   │
│  │  │ • forgotPassword()                                  │   │   │
│  │  │ • changePassword()                                  │   │   │
│  │  │ • deleteUser()                                      │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  💾 Admin User Model (MongoDB)                              │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Stores user credentials                           │   │   │
│  │  │ • Manages roles & permissions                       │   │   │
│  │  │ • Tracks login history                             │   │   │
│  │  │ • Manages OTP for verification                     │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  🔐 Authentication Middleware                              │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • JWT token verification                             │   │   │
│  │  │ • Role-based access control                          │   │   │
│  │  │ • Permission checking                                │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📧 Email Service                                          │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Sends OTP emails                                   │   │   │
│  │  │ • Sends password reset emails                        │   │   │
│  │  │ • Sends verification emails                          │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow

### 1. User Registration Flow

```
User → Registration Form → MS1 Server API → Validation → User Created → OTP Email → Verification → Account Activated
```

**Steps:**
1. User fills registration form (name, email, mobile, password, role)
2. MS1 Client sends registration request to MS1 Server
3. MS1 Server validates input (email format, password strength, etc.)
4. MS1 Server checks for existing users (email/mobile uniqueness)
5. MS1 Server hashes password and creates user account
6. MS1 Server assigns default permissions based on role
7. MS1 Server generates OTP and sends verification email
8. User verifies OTP via email
9. Account is activated and user can login

### 2. Login Flow

```
User → Login Form → MS1 Server API → Credential Check → JWT Token → Login History → Dashboard Access
```

**Steps:**
1. User enters email and password
2. MS1 Client sends login request to MS1 Server
3. MS1 Server validates credentials
4. MS1 Server checks if user is active and verified
5. MS1 Server checks login restrictions (blocked, IP restrictions, etc.)
6. MS1 Server generates JWT access token
7. MS1 Server records login history (IP, device, timestamp)
8. MS1 Client stores token and redirects to dashboard

### 3. Profile Management Flow

```
Admin → Profile Page → View/Edit Profile → OTP Verification → Update Profile → Email Confirmation
```

**Steps:**
1. Admin opens profile page in MS1 Client
2. MS1 Client fetches current profile data
3. Admin edits profile information
4. For email changes, MS1 Server sends OTP to new email
5. Admin verifies OTP
6. MS1 Server updates profile in database
7. MS1 Client refreshes profile display

### 4. Password Management Flow

```
User → Forgot Password → OTP Email → Verify OTP → New Password → Password Changed
```

**Steps:**
1. User clicks "Forgot Password"
2. User enters email address
3. MS1 Server generates OTP and sends to email
4. User enters OTP and new password
5. MS1 Server verifies OTP
6. MS1 Server hashes and updates password
7. User can login with new password

## Documentation Structure

To understand Admin User Management completely, read in this order:

### 1. **Start Here** → [Admin User Management Overview](./admin-user-management-overview) (this page)
   - Understand the complete system
   - See how server and client work together
   - Learn the overall workflow

### 2. **Backend Implementation** → [MS1 Server - Admin User Management API](../ms1-server/modules/admin-user-management) *(Server-Side/API)*
   - API endpoints and routes
   - Database models and schemas
   - Business logic and controllers
   - Authentication and authorization
   - OTP and email services
   - Validation rules
   - **Note:** This is the server-side API that handles all backend operations

### 3. **Frontend Implementation** → [MS1 Client - Admin User Management Component](../ms1-client/components/admin-user-management) *(Client-Side)*
   - React component structure
   - Login and registration forms
   - Profile management UI
   - Password management interface
   - State management
   - API integration
   - User interactions
   - **Note:** This is the client-side React component that provides the UI for managing admin users

## Key Concepts

### Server-Side (MS1 Server)
- **Models**: AdminUser schema with roles, permissions, login restrictions
- **Controllers**: Registration, login, profile management, password management
- **Routes**: RESTful API endpoints with authentication middleware
- **Authentication**: JWT token-based authentication
- **Authorization**: Role-based access control (RBAC)
- **Security**: Password hashing (bcrypt), OTP verification, rate limiting

### Client-Side (MS1 Client)
- **Components**: Login, Registration, Profile, User Management components
- **Services**: API service wrappers for authentication
- **State**: User session management, token storage
- **UI**: Forms, validation, error handling

## Quick Reference

| Task | Server Side | Client Side |
|------|-------------|------------|
| User Registration | `register()` controller | Registration form component |
| User Login | `login()` controller | Login form component |
| View Profile | `getProfile()` controller | Profile display component |
| Update Profile | `updateProfile()` controller | Profile edit form |
| Change Password | `changePassword()` controller | Password change form |
| Forgot Password | `forgotPassword()` controller | Forgot password form |
| Delete User | `deleteUser()` controller | User management table |

---

**Next Steps:**
- Read [MS1 Server - Admin User Management API](../ms1-server/modules/admin-user-management) for backend details
- Read [MS1 Client - Admin User Management Component](../ms1-client/components/admin-user-management) for frontend details

