---
title: Admin User Management Component
sidebar_position: 1
description: "The Admin User Management components provide a React-based interface for user authentication, profile management, and user administration in MS1 Client."
---

# Admin User Management Component (MS1 Client)

> **Note:** This is the **client-side React component** documentation. For the server-side API, see [MS1 Server - Admin User Management API](../../ms1-server/modules/admin-user-management).

The Admin User Management components provide a React-based interface for user authentication, profile management, and user administration in MS1 Client.

## Overview

The Admin User Management system consists of multiple React components that handle:

- **Authentication** – Login and logout functionality
- **Profile Management** – View and update user profile
- **Password Management** – Change password, forgot password
- **Active Sessions** – View and manage active login sessions
- **User Administration** – Manage admin users (if implemented)

## Component Structure

```
╔═══════════════════════════════════════════════════════════════════════╗
║        ADMIN USER MANAGEMENT COMPONENT STRUCTURE                      ║
╚═══════════════════════════════════════════════════════════════════════╝

Admin User Management Components
│
├── 🔐 Login Component (Auth/Login.jsx)
│   ├── Email & Password Input
│   ├── Form Validation
│   ├── Error Handling
│   ├── Loading States
│   └── Password Visibility Toggle
│
├── 👤 Profile Component (Profile/Profile.jsx)
│   ├── Profile Display
│   ├── Profile Edit Form
│   ├── OTP Verification
│   ├── Email Change Flow
│   └── Password Change
│
├── 📊 Active Sessions Component (active-sessions/ActiveSessions.jsx)
│   ├── Session List
│   ├── Device Information
│   ├── IP Address Display
│   ├── Last Activity
│   └── Logout Session
│
└── 🔌 API Services
    ├── authService.js
    ├── userApi.js
    └── loginHistoryApi.js
```

## Components

### 1. Login Component

**Location:** `components/Auth/Login.jsx`

**Purpose:** Handles user authentication and login flow.

**Features:**
- Email and password input fields
- Form validation (email format, password length)
- Error message display
- Loading states during authentication
- Password visibility toggle
- Automatic redirect after successful login
- Session error persistence

**State Management:**
```javascript
{
  formData: {
    email: string,
    password: string
  },
  errors: {
    email?: string,
    password?: string,
    auth?: string
  },
  isLoading: boolean,
  showPassword: boolean
}
```

**API Integration:**
- Uses `authService.login(email, password)`
- Stores token in localStorage/sessionStorage
- Calls `onLogin(user, token)` callback on success

**Usage Example:**
```jsx
<Login onLogin={(user, token) => {
  // Handle successful login
  setUser(user)
  setToken(token)
  navigate('/dashboard')
}} />
```

### 2. Profile Component

**Location:** `components/Profile/Profile.jsx`

**Purpose:** Manages user profile information and settings.

**Features:**
- View current profile information
- Edit profile (name, mobile)
- Change email (with OTP verification)
- Change password
- OTP verification flow
- Form validation
- Success/error notifications

**State Management:**
```javascript
{
  profile: {
    name: string,
    email: string,
    mobile: string,
    role: string,
    permissions: string[]
  },
  editMode: boolean,
  otpSent: boolean,
  otpVerified: boolean,
  loading: boolean
}
```

**API Integration:**
- `GET /api/v1/admin-user/profile` – Fetch profile
- `PUT /api/v1/admin-user/profile` – Update profile
- `POST /api/v1/admin-user/profile/send-otp` – Request OTP
- `POST /api/v1/admin-user/change-password` – Change password

### 3. Active Sessions Component

**Location:** `components/active-sessions/ActiveSessions.jsx`

**Purpose:** Displays and manages active login sessions.

**Features:**
- List all active sessions
- Display device information (browser, OS, device)
- Show IP addresses
- Display last activity time
- Logout from specific session
- Logout from all sessions

**API Integration:**
- `GET /api/v1/login-history/active` – Get active sessions
- `POST /api/v1/login-history/logout/:sessionId` – Logout session

## API Services

### authService.js

**Location:** `services/authService.js`

**Functions:**
- `login(email, password)` – Authenticate user
- `logout()` – Clear session and token
- `getCurrentUser()` – Get current user from token
- `isAuthenticated()` – Check if user is logged in
- `getToken()` – Get stored access token

**Example:**
```javascript
import authService from '../services/authService'

// Login
const { user, token } = await authService.login(email, password)

// Check authentication
if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser()
}
```

### userApi.js

**Location:** `services/userApi.js`

**Functions:**
- `getProfile()` – Get user profile
- `updateProfile(data)` – Update profile
- `changePassword(data)` – Change password
- `sendProfileOtp()` – Request profile update OTP
- `sendEmailOtp(newEmail)` – Request email change OTP

### loginHistoryApi.js

**Location:** `services/loginHistoryApi.js`

**Functions:**
- `getActiveSessions()` – Get active login sessions
- `logoutSession(sessionId)` – Logout from specific session
- `logoutAllSessions()` – Logout from all sessions

## State Management

### Authentication State

Managed at App level using React Context or state:

```javascript
{
  isAuthenticated: boolean,
  user: {
    id: string,
    name: string,
    email: string,
    role: string,
    permissions: string[]
  },
  token: string
}
```

### Token Storage

- **Access Token**: Stored in `localStorage` or `sessionStorage`
- **Token Validation**: Verified on app load and route changes
- **Auto Logout**: On token expiration or invalid token

## User Flows

### Login Flow

```
1. User enters email and password
2. Component validates input
3. Calls authService.login()
4. On success:
   - Store token
   - Store user data
   - Redirect to dashboard
5. On error:
   - Display error message
   - Keep form data
```

### Profile Update Flow

```
1. User clicks "Edit Profile"
2. Component fetches current profile
3. User edits information
4. For email changes:
   - Request email OTP
   - Verify OTP
5. For other changes:
   - Request profile OTP
   - Verify OTP
6. Submit update
7. Refresh profile display
```

### Password Change Flow

```
1. User clicks "Change Password"
2. User enters current password
3. User requests OTP
4. User enters OTP and new password
5. Component validates
6. Submit change password request
7. Show success message
8. Optionally logout user
```

## Error Handling

### Form Validation Errors
- Displayed inline below input fields
- Real-time validation on input change
- Prevents submission with invalid data

### API Errors
- Displayed as toast notifications or alert messages
- Error codes mapped to user-friendly messages
- Network errors handled gracefully

### Authentication Errors
- Redirect to login on 401 errors
- Clear stored tokens on authentication failure
- Show appropriate error messages

## Security Features

### Token Management
- Tokens stored securely (localStorage/sessionStorage)
- Tokens validated on each API request
- Automatic token refresh (if implemented)
- Token cleared on logout

### Input Validation
- Client-side validation before API calls
- Email format validation
- Password strength requirements
- OTP format validation

### Session Management
- Track active sessions
- Logout from other devices
- Session timeout handling

## Styling

Components use:
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Responsive Design** for mobile/desktop
- **Dark Mode Support** via ThemeContext

## Integration Points

### With Other Components
- **Dashboard**: Shows user info in header
- **Sidebar**: Displays user profile
- **Protected Routes**: Uses authentication state
- **Permission System**: Uses user permissions for access control

### With Services
- **authService**: Authentication operations
- **userApi**: User profile operations
- **loginHistoryApi**: Session management

---

**Next Steps:**
- Read [MS1 Server - Admin User Management API](../../ms1-server/modules/admin-user-management) for backend details
- See [Admin User Management Overview](../../modules/admin-user-management-overview) for complete system understanding

