---
title: Admin User Management API
sidebar_position: 1
description: "The Admin User Management module handles all aspects of administrator user accounts, including registration, authentication, profile management, password."
---

# Admin User Management API (Server-Side)

> **Note:** This is the **server-side API documentation** for Admin User Management. For the client-side React component, see [MS1 Client - Admin User Management Component](../../ms1-client/components/admin-user-management).

The Admin User Management module handles all aspects of administrator user accounts, including registration, authentication, profile management, password management, OTP verification, and user administration.

## Overview

The Admin User Management module provides secure user account management with:
- **User Registration** – Create new admin accounts with role-based permissions
- **Authentication** – JWT-based login with session management
- **Profile Management** – Update user profile with OTP verification
- **Password Management** – Forgot password, change password with OTP
- **User Administration** – View, update, and delete users
- **Login History** – Track user login sessions and activity
- **Security Features** – Rate limiting, IP restrictions, concurrent session limits

## Core Features

- **JWT Authentication** – Secure token-based authentication
- **OTP Verification** – Email-based OTP for sensitive operations
- **Role-Based Access Control** – Roles: admin, editor, viewer
- **Permission Management** – Granular permission assignment
- **Login Restrictions** – IP blocking, session limits, account blocking
- **Login History Tracking** – Device, browser, IP, timestamp tracking
- **Password Security** – Bcrypt hashing with salt rounds
- **Rate Limiting** – Protection against brute force attacks

## Architecture

```
╔═══════════════════════════════════════════════════════════════════════╗
║        ADMIN USER MANAGEMENT - SYSTEM ARCHITECTURE                    ║
╚═══════════════════════════════════════════════════════════════════════╝

    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │  🖥️  MS1 CLIENT (Frontend)                                  │
    │  ┌─────────────────────────────────────────────┐           │
    │  │ • Login Form                                  │           │
    │  │ • Registration Form                          │           │
    │  │ • Profile Management                          │           │
    │  │ • Password Management                         │           │
    │  └─────────────────────────────────────────────┘           │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              │
    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │  ⚙️  MS1 SERVER (Backend)                                   │
    │  ┌─────────────────────────────────────────────┐           │
    │  │                                               │           │
    │  │  🎮 Admin User Controller                     │           │
    │  │  ┌─────────────────────────────────────┐   │           │
    │  │  │ • register()                         │   │           │
    │  │  │ • login()                            │   │           │
    │  │  │ • logout()                           │   │           │
    │  │  │ • getProfile()                       │   │           │
    │  │  │ • updateProfile()                    │   │           │
    │  │  │ • forgotPassword()                   │   │           │
    │  │  │ • changePassword()                   │   │           │
    │  │  │ • deleteUser()                       │   │           │
    │  │  └─────────────────────────────────────┘   │           │
    │  │                                               │           │
    │  │  🔐 Authentication Middleware                  │           │
    │  │  ┌─────────────────────────────────────┐   │           │
    │  │  │ • JWT token verification             │   │           │
    │  │  │ • Role-based access control           │   │           │
    │  │  │ • Permission checking                 │   │           │
    │  │  └─────────────────────────────────────┘   │           │
    │  │                                               │           │
    │  │  💾 Admin User Model (MongoDB)                │           │
    │  │  ┌─────────────────────────────────────┐   │           │
    │  │  │ • User credentials                   │   │           │
    │  │  │ • Roles & permissions               │   │           │
    │  │  │ • OTP codes                         │   │           │
    │  │  │ • Login restrictions                │   │           │
    │  │  └─────────────────────────────────────┘   │           │
    │  │                                               │           │
    │  │  📧 Email Service                             │           │
    │  │  ┌─────────────────────────────────────┐   │           │
    │  │  │ • OTP emails                        │   │           │
    │  │  │ • Password reset emails              │   │           │
    │  │  │ • Verification emails                │   │           │
    │  │  └─────────────────────────────────────┘   │           │
    │  │                                               │           │
    │  │  📊 Login History Model                       │           │
    │  │  ┌─────────────────────────────────────┐   │           │
    │  │  │ • Login sessions                     │   │           │
    │  │  │ • Device information                │   │           │
    │  │  │ • IP addresses                       │   │           │
    │  │  │ • Activity tracking                 │   │           │
    │  │  └─────────────────────────────────────┘   │           │
    │  └─────────────────────────────────────────────┘           │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
```

## Backend Components

### Models

#### `model/adminUser.model.js` – AdminUser Schema

The AdminUser model stores all administrator user information:

```javascript
{
  name: String (required, min 2 chars),
  email: String (required, unique, lowercase),
  mobile: String (required, unique),
  password: String (required, min 8 chars, hashed),
  isActive: Boolean (default: true),
  isVerified: Boolean (default: false),
  accessToken: String (JWT token),
  role: String (default: "viewer", enum: ["admin", "editor", "viewer"]),
  permissions: [String] (array of permission names),
  
  // Login Restrictions
  maxConcurrentSessions: Number (default: 3, min: 1, max: 10),
  isBlocked: Boolean (default: false),
  blockedReason: String,
  blockedAt: Date,
  blockedBy: ObjectId (ref: AdminUser),
  allowedDevices: [String],
  restrictedIPs: [String],
  
  // OTP Management
  otp: {
    code: String,
    expiresAt: Date
  },
  emailOtp: {
    code: String,
    expiresAt: Date,
    email: String
  },
  
  createdAt: Date
}
```

#### `model/loginHistory.model.js` – LoginHistory Schema

Tracks user login sessions:

```javascript
{
  userId: ObjectId (ref: AdminUser, required),
  email: String,
  name: String,
  loginTime: Date (required),
  logoutTime: Date,
  ipAddress: String,
  userAgent: String,
  device: String,
  browser: String,
  os: String,
  isActive: Boolean (default: true),
  sessionToken: String (JWT token),
  lastActivity: Date
}
```

### Controllers

#### `controller/adminUser.controller.js`

**Main Functions:**

1. **`register`** – Register new admin user
2. **`login`** – Authenticate user and generate JWT token
3. **`logout`** – Invalidate token and end session
4. **`getProfile`** – Get current user profile
5. **`updateProfile`** – Update user profile (requires OTP)
6. **`forgotPassword`** – Initiate password reset with OTP
7. **`resendOtp`** – Resend OTP code
8. **`verifyOtp`** – Verify OTP code
9. **`changePassword`** – Change password (requires OTP verification)
10. **`sendProfileUpdateOtp`** – Send OTP for profile updates
11. **`sendEmailVerificationOtp`** – Send OTP for email changes
12. **`deleteUser`** – Delete admin user account

### Routes

#### `routes/adminUser.routes.js`

**Base URL:** `/api/v1/admin-user`

**Rate Limiting:**
- Login: 5 attempts per 15 minutes per IP
- OTP requests: 3 requests per 5 minutes per IP
- OTP verification: 5 attempts per 15 minutes per IP

**Authentication:**
- Public endpoints: Registration, Login, Forgot Password
- Protected endpoints: Require `Authorization: Bearer <token>` header

## API Reference

### Public Endpoints

#### 1. Register Admin User

**Endpoint:** `POST /api/v1/admin-user/register`

**Description:** Register a new admin user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "password": "SecurePass123!",
  "role": "editor",
  "permissions": ["demo.view", "demo.edit"]
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Admin user registered successfully. Please verify your email to activate your account.",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "mobile": "+1234567890",
    "role": "editor",
    "permissions": ["demo.view", "demo.edit"]
  },
  "code": "REGISTRATION_SUCCESS"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Please fill all required fields",
  "code": "MISSING_FIELDS"
}
```

**Response (Error - 409):**
```json
{
  "success": false,
  "message": "User with this email already exists",
  "code": "EMAIL_EXISTS"
}
```

#### 2. Login

**Endpoint:** `POST /api/v1/admin-user/login`

**Description:** Authenticate user and receive JWT access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "isVerified": true,
    "role": "editor",
    "permissions": ["demo.view", "demo.edit"],
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "code": "LOGIN_SUCCESS"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Incorrect password",
  "code": "INCORRECT_PASSWORD"
}
```

**Response (Error - 403):**
```json
{
  "success": false,
  "message": "Maximum concurrent sessions limit (3) reached. Please logout from another device first.",
  "code": "MAX_SESSIONS_REACHED"
}
```

#### 3. Forgot Password

**Endpoint:** `POST /api/v1/admin-user/forgot-password`

**Description:** Request password reset OTP.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "OTP has been sent to your email address",
  "code": "OTP_SENT"
}
```

#### 4. Resend OTP

**Endpoint:** `POST /api/v1/admin-user/resend-otp`

**Description:** Resend OTP code.

**Request Body:**
```json
{
  "email": "john@example.com",
  "type": "password_reset"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "OTP has been resent to your email address",
  "code": "OTP_RESENT"
}
```

#### 5. Verify OTP

**Endpoint:** `POST /api/v1/admin-user/verify-otp`

**Description:** Verify OTP code.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "type": "password_reset"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "code": "OTP_VERIFIED"
}
```

### Protected Endpoints

All protected endpoints require `Authorization: Bearer <token>` header.

#### 6. Get Profile

**Endpoint:** `GET /api/v1/admin-user/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+1234567890",
    "isActive": true,
    "isVerified": true,
    "role": "editor",
    "permissions": ["demo.view", "demo.edit"],
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "code": "PROFILE_RETRIEVED"
}
```

#### 7. Update Profile

**Endpoint:** `PUT /api/v1/admin-user/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "mobile": "+1234567891",
  "otp": "123456"
}
```

**Note:** For email changes, use `emailOtp` instead of `otp` and call `/profile/send-email-otp` first.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "email": "john@example.com",
    "mobile": "+1234567891"
  },
  "code": "PROFILE_UPDATED"
}
```

#### 8. Send Profile Update OTP

**Endpoint:** `POST /api/v1/admin-user/profile/send-otp`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "OTP has been sent to your email address",
  "code": "OTP_SENT"
}
```

#### 9. Send Email Verification OTP

**Endpoint:** `POST /api/v1/admin-user/profile/send-email-otp`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "newEmail": "newemail@example.com"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Email verification OTP has been sent to newemail@example.com",
  "code": "EMAIL_OTP_SENT"
}
```

#### 10. Change Password

**Endpoint:** `POST /api/v1/admin-user/change-password`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "otp": "123456"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "code": "PASSWORD_CHANGED"
}
```

#### 11. Logout

**Endpoint:** `POST /api/v1/admin-user/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logout successful. You have been signed out.",
  "code": "LOGOUT_SUCCESS"
}
```

#### 12. Verify Token

**Endpoint:** `GET /api/v1/admin-user/verify-token`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "isVerified": true
  },
  "code": "TOKEN_VALID"
}
```

#### 13. Delete User

**Endpoint:** `DELETE /api/v1/admin-user/:userId`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "code": "USER_DELETED"
}
```

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `MISSING_FIELDS` | 400 | Required fields are missing |
| `INVALID_EMAIL` | 400 | Invalid email format |
| `INVALID_MOBILE` | 400 | Invalid mobile number format |
| `WEAK_PASSWORD` | 400 | Password doesn't meet requirements |
| `EMAIL_EXISTS` | 409 | Email already registered |
| `MOBILE_EXISTS` | 409 | Mobile number already registered |
| `EMAIL_NOT_FOUND` | 401 | Email not found |
| `INCORRECT_PASSWORD` | 401 | Wrong password |
| `EMAIL_NOT_VERIFIED` | 401 | Email not verified |
| `ACCOUNT_SUSPENDED` | 403 | Account is deactivated |
| `USER_BLOCKED` | 403 | User account is blocked |
| `MAX_SESSIONS_REACHED` | 403 | Maximum concurrent sessions reached |
| `IP_RESTRICTED` | 403 | Login from this IP is restricted |
| `INVALID_OTP` | 400 | Invalid or expired OTP |
| `OTP_EXPIRED` | 400 | OTP has expired |
| `UNAUTHORIZED` | 401 | No valid authentication token |
| `USER_NOT_FOUND` | 404 | User not found |
| `SERVER_ERROR` | 500 | Internal server error |

## Security Features

### Password Hashing
- Uses bcrypt with 12 salt rounds
- Passwords are never stored in plain text
- Passwords are never returned in API responses

### JWT Tokens
- Token expiration: 2 hours
- Tokens stored in database for validation
- Tokens invalidated on logout

### Rate Limiting
- Login attempts: 5 per 15 minutes per IP
- OTP requests: 3 per 5 minutes per IP
- OTP verification: 5 per 15 minutes per IP

### Login Restrictions
- **Concurrent Sessions**: Configurable limit (default: 3)
- **IP Restrictions**: Block specific IP addresses
- **Account Blocking**: Block users with reason
- **Device Restrictions**: Allow only specific devices

### OTP Security
- 6-digit numeric codes
- Expires in 2 minutes
- Maximum 5 verification attempts
- Rate limited to prevent abuse

## Workflow Examples

### Registration Flow

```
1. Client → POST /register
2. Server validates input
3. Server checks for duplicates
4. Server hashes password
5. Server creates user with default permissions
6. Server generates OTP
7. Server sends OTP email
8. Server returns success (user must verify email)
```

### Login Flow

```
1. Client → POST /login
2. Server validates credentials
3. Server checks user status (active, verified)
4. Server checks login restrictions
5. Server generates JWT token
6. Server saves token to user
7. Server records login history
8. Server returns token and user data
```

### Password Reset Flow

```
1. Client → POST /forgot-password
2. Server generates OTP
3. Server sends OTP email
4. Client → POST /verify-otp
5. Server verifies OTP
6. Client → POST /change-password (with OTP)
7. Server hashes new password
8. Server updates password
```

---

**Next Steps:**
- Read [MS1 Client - Admin User Management Component](../../ms1-client/components/admin-user-management) for frontend implementation
- See [Admin User Management Overview](../../modules/admin-user-management-overview) for complete system understanding

