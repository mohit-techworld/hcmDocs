---
sidebar_position: 1
---

# Authentication  Flow


Complete guide to the HCM Authentication system with multi-device support, OTP verification, and secure password management.

## Base URL
```
/api/v1/auth
```

## 🔐 Authentication System Overview

The HCM authentication system supports:
- **Multi-device login** (Android, iOS, Web, Desktop)
- **OTP-based verification** for enhanced security
- **Password reset** via email tokens
- **Device-specific tokens** for session management
- **Super admin registration** with secret key protection

## 📱 Device Type Header

**All requests must include device type:**
```
x-device-type: android | ios | web | desktop
```

## 🔑 Environment Variables Required

```env
JWT_SECRET_KEY=your-jwt-secret-key
JWT_SECRET_FOR_GUEST=your-guest-jwt-secret
ACCESS_TOKEN_EXPIRY=7d
SUPERADMIN_SECRET_KEY=your-super-admin-secret
```

---

## 🚀 API Endpoints

### 1. 👑 Register Super Admin

Creates the first super admin account with secret key validation.

**POST** `/register-super-admin`

**Request Body:**
```json
{
  "secret_key": "your-super-admin-secret-key",
  "first_Name": "John",
  "last_Name": "Doe",
  "employee_Id": "EMP001",
  "password": "SecurePass123",
  "confirm_Password": "SecurePass123",
  "department": "IT",
  "designation": "System Administrator",
  "mobile_No": "1234567890",
  "personal_Email_Id": "john.personal@email.com",
  "working_Email_Id": "john@company.com",
  "permission": ["all-permissions"]
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Super Admin created.",
  "user": {
    "_id": "user_id_123",
    "first_Name": "John",
    "last_Name": "Doe",
    "employee_Id": "EMP001",
    "user_Role": "super-admin",
    "working_Email_Id": "john@company.com",
    "isActive": true
  }
}
```

**Error Responses:**
```json
// Invalid secret key
{
  "success": false,
  "message": "Invalid secret key."
}

// Super admin already exists
{
  "success": false,
  "message": "Super Admin already exists."
}

// Missing required fields
{
  "success": false,
  "message": "Missing field first_Name."
}

// Password mismatch
{
  "success": false,
  "message": "Passwords do not match."
}

// Employee ID or email already in use
{
  "success": false,
  "message": "Employee ID or Email in use."
}
```

**Business Rules:**
- Only one super admin can exist
- Secret key must match `SUPERADMIN_SECRET_KEY` env variable
- Password and confirm password must match
- Employee ID and working email must be unique

---

### 2. 🔐 Login

Authenticates user and returns device-specific JWT token. Supports OTP verification.

**POST** `/login`

**Headers:**
```
x-device-type: android | ios | web | desktop
```

**Request Body:**
```json
{
  "employee_Id": "EMP001",
  "password": "userpassword123"
}
```

**Response Success (No OTP):**
```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "_id": "user_id_123",
    "employee_Id": "EMP001",
    "first_Name": "John",
    "last_Name": "Doe",
    "user_Role": "employee",
    "department": "Engineering",
    "isActive": true,
    "permission": ["attendance-view", "profile-edit"]
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "requiresOtp": false
}
```

**Response Success (OTP Required):**
```json
{
  "success": true,
  "message": "Login OTP sent. Verify to complete.",
  "employee_Id": "EMP001",
  "requiresOtp": true
}
```

**Error Responses:**
```json
// User not found
{
  "success": false,
  "message": "User not found."
}

// Account inactive
{
  "success": false,
  "message": "Account inactive."
}

// Wrong password
{
  "success": false,
  "message": "Incorrect password."
}

// Unsupported device
{
  "success": false,
  "message": "Unsupported device."
}
```

**Login Flow:**
1. User enters employee_Id and password
2. System validates credentials
3. If OTP is enabled (`user.otp === "yes"`):
   - Generates 6-digit OTP
   - Sends OTP to user's working email
   - Returns `requiresOtp: true`
4. If no OTP required:
   - Generates JWT token
   - Stores token in device-specific field
   - Returns user data and token

---

### 3. 📱 Verify OTP

Verifies OTP and completes login process.

**POST** `/verify-otp`

**Headers:**
```
x-device-type: android | ios | web | desktop
```

**Request Body:**
```json
{
  "employee_Id": "EMP001",
  "otp": "123456"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "OTP verified; logged in.",
  "user": {
    "_id": "user_id_123",
    "employee_Id": "EMP001",
    "first_Name": "John",
    "last_Name": "Doe",
    "user_Role": "employee",
    "isActive": true
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
// Invalid or expired OTP
{
  "success": false,
  "message": "Invalid or expired OTP."
}

// Unsupported device
{
  "success": false,
  "message": "Unsupported device."
}
```

**OTP Verification Flow:**
1. User enters OTP received via email
2. System validates OTP from database
3. If valid, deletes OTP record
4. Generates JWT token
5. Stores token in device-specific field
6. Returns user data and token

---

### 4. 🔄 Resend OTP

Resends OTP for login verification.

**POST** `/resend-otp`

**Request Body:**
```json
{
  "employee_Id": "EMP001"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "OTP resent."
}
```

**Error Responses:**
```json
// User not found
{
  "success": false,
  "message": "User not found."
}

// OTP not enabled for user
{
  "success": false,
  "message": "OTP not enabled."
}
```

---

### 5. 📧 Password Reset Request

Sends password reset email with secure token. Rate limited to 4 requests per day.

**POST** `/password-reset-request`

**Request Body:**
```json
{
  "employee_Id": "EMP001"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Password reset link sent."
}
```

**Error Responses:**
```json
// User not found
{
  "success": false,
  "message": "User not found."
}

// Rate limit exceeded
{
  "success": false,
  "message": "You can only request a password reset 4 per day."
}
```

**Password Reset Flow:**
1. User enters employee_Id
2. System checks rate limiting (4 requests/day)
3. Generates secure 32-byte token
4. Hashes token and stores in database
5. Sets expiry time (1 hour)
6. Sends email with reset link
7. Link format: `https://your-app.com/reset-password?token=<resetToken>`

---

### 6. 🔒 Reset Password

Resets password using the token from email.

**POST** `/reset-password`

**Request Body:**
```json
{
  "resetToken": "abc123def456...",
  "newPassword": "NewSecurePass123",
  "confirmPassword": "NewSecurePass123"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Password reset successful."
}
```

**Error Responses:**
```json
// Password mismatch
{
  "success": false,
  "message": "Passwords do not match."
}

// Invalid or expired token
{
  "success": false,
  "message": "Invalid or expired token."
}
```

**Reset Password Flow:**
1. User clicks link from email
2. Frontend extracts token from URL
3. User enters new password and confirmation
4. System validates token (not expired, exists in DB)
5. Hashes new password
6. Updates user record
7. Clears reset token fields

---

### 7. ✅ Check Authorization

Validates JWT token and returns user information.

**GET** `/check-authorization`

**Headers:**
```
Authorization: Bearer <jwt-token>
x-device-type: android | ios | web | desktop
```

**Response Success:**
```json
{
  "success": true,
  "message": "Authorized.",
  "response": {
    "_id": "user_id_123",
    "employee_Id": "EMP001",
    "first_Name": "John",
    "last_Name": "Doe",
    "email": "john.personal@email.com",
    "isFieldWorker": false
  }
}
```

**Error Responses:**
```json
// No token provided
{
  "success": false,
  "message": "No token provided."
}

// User not found
{
  "success": false,
  "message": "User not found."
}

// Token mismatch
{
  "success": false,
  "message": "Token mismatch."
}

// Invalid token
{
  "success": false,
  "message": "Invalid or expired token."
}
```

**Authorization Flow:**
1. Extract token from Authorization header
2. Verify token using JWT secret
3. Find user by decoded ID
4. Check if stored device token matches request token
5. Return user information if valid

---

### 8. 🚪 Logout

Clears device-specific token and logs out user.

**POST** `/logout`

**Headers:**
```
Authorization: Bearer <jwt-token>
x-device-type: android | ios | web | desktop
```

**Response Success:**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

**Error Responses:**
```json
// Missing token or device type
{
  "success": false,
  "message": "Token or device type missing."
}

// User not found
{
  "success": false,
  "message": "User not found."
}

// Invalid device type
{
  "success": false,
  "message": "Invalid device type."
}
```

**Logout Flow:**
1. Extract token and device type from headers
2. Decode token to get user ID
3. Find user in database
4. Clear device-specific token field
5. Save user record

---

## 🛡️ Security Features

### Device-Specific Tokens
Each user can have different tokens for different devices:
- `accessTokenAndroid` - Android app token
- `accessTokenIOS` - iOS app token
- `accessTokenWeb` - Web browser token
- `accessTokenDesktop` - Desktop app token

### Password Security
- **Bcrypt hashing** with salt rounds = 10
- **Password comparison** using bcrypt.compare()
- **Reset tokens** are hashed using SHA-256

### Rate Limiting
- **Password reset**: 4 requests per day per employee_Id
- **OTP generation**: Automatic cleanup of old OTPs

### Token Security
- **JWT signing** with secret key
- **Token expiry** configurable via environment
- **Token validation** on each request
- **Device-specific storage** prevents cross-device token reuse

---

## 🔧 Database Models

### User Model Key Fields
```javascript
{
  employee_Id: String,           // Unique identifier
  password: String,              // Bcrypt hashed
  user_Role: String,             // "super-admin", "employee", etc.
  isActive: Boolean,             // Account status
  otp: String,                   // "yes" or "no"
  
  // Device-specific tokens
  accessTokenAndroid: String,
  accessTokenIOS: String,
  accessTokenWeb: String,
  accessTokenDesktop: String,
  
  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Contact information
  working_Email_Id: String,
  personal_Email_Id: String,
  mobile_No: String
}
```

### OTP Model
```javascript
{
  employee_Id: String,     // Reference to user
  otp: String,            // 6-digit OTP
  createdAt: Date,        // Auto-expires after 10 minutes
  expiresAt: Date
}
```

---

## 💻 Frontend Integration Examples

### 1. Super Admin Registration
```javascript
const registerSuperAdmin = async (formData) => {
  try {
    const response = await fetch('/api/v1/auth/register-super-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret_key: 'your-secret-key',
        first_Name: formData.firstName,
        last_Name: formData.lastName,
        employee_Id: formData.employeeId,
        password: formData.password,
        confirm_Password: formData.confirmPassword,
        working_Email_Id: formData.email,
        // ... other fields
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Super admin created:', data.user);
      // Redirect to login
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### 2. Login with OTP Support
```javascript
const login = async (employeeId, password) => {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-device-type': 'web'
      },
      body: JSON.stringify({
        employee_Id: employeeId,
        password: password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      if (data.requiresOtp) {
        // Show OTP input form
        setShowOtpForm(true);
        setEmployeeId(employeeId);
      } else {
        // Login successful
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to dashboard
      }
    } else {
      console.error('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### 3. OTP Verification
```javascript
const verifyOtp = async (employeeId, otp) => {
  try {
    const response = await fetch('/api/v1/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-device-type': 'web'
      },
      body: JSON.stringify({
        employee_Id: employeeId,
        otp: otp
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Redirect to dashboard
    } else {
      console.error('OTP verification failed:', data.message);
    }
  } catch (error) {
    console.error('OTP verification error:', error);
  }
};
```

### 4. Password Reset Flow
```javascript
// Step 1: Request reset
const requestPasswordReset = async (employeeId) => {
  try {
    const response = await fetch('/api/v1/auth/password-reset-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employee_Id: employeeId
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Password reset link sent to your email');
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Password reset request failed:', error);
  }
};

// Step 2: Reset password
const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const response = await fetch('/api/v1/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resetToken: token,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Password reset successful');
      // Redirect to login
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Password reset failed:', error);
  }
};
```

### 5. Authenticated Requests
```javascript
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'x-device-type': 'web'
    }
  });
  
  if (response.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }
  
  return response;
};
```

### 6. Logout
```javascript
const logout = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-device-type': 'web'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      // Redirect to login
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

---

## 🔄 Authentication Flow Diagrams

### Login Flow
```
User → Login Request → Server
                     ↓
                Check Credentials
                     ↓
              OTP Required? → Yes → Send OTP Email → User Enters OTP
                     ↓                                       ↓
                    No                              Verify OTP → Generate Token
                     ↓                                       ↓
              Generate Token ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
                     ↓
              Store in Device Field
                     ↓
              Return Token & User Data
```

### Password Reset Flow
```
User → Reset Request → Server
                     ↓
               Generate Token
                     ↓
              Store Hashed Token
                     ↓
              Send Email → User Clicks Link → Frontend
                                               ↓
                                        Extract Token
                                               ↓
                                        Reset Form
                                               ↓
                                     Submit New Password
                                               ↓
                                        Verify Token
                                               ↓
                                      Update Password
```

---

## 🛠️ Testing Guide

### Test Super Admin Registration
```bash
curl -X POST http://localhost:6006/api/v1/auth/register-super-admin \
  -H "Content-Type: application/json" \
  -d '{
    "secret_key": "your-secret-key",
    "first_Name": "Admin",
    "last_Name": "User",
    "employee_Id": "ADMIN001",
    "password": "AdminPass123",
    "confirm_Password": "AdminPass123",
    "working_Email_Id": "admin@company.com"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:6006/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "x-device-type: web" \
  -d '{
    "employee_Id": "ADMIN001",
    "password": "AdminPass123"
  }'
```

### Test Authorization
```bash
curl -X GET http://localhost:6006/api/v1/auth/check-authorization \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "x-device-type: web"
```

---

## 📞 Support & Troubleshooting

### Common Issues

**1. "Invalid secret key" during super admin registration**
- Check `SUPERADMIN_SECRET_KEY` in environment variables
- Ensure secret key matches exactly

**2. "Token mismatch" during authorization**
- Device type header must match token storage
- User may be logged in on different device

**3. "Invalid or expired OTP"**
- OTP expires after 10 minutes
- Use resend OTP endpoint if needed

**4. "User not found" during login**
- Check employee_Id format
- Ensure user exists in database

**5. Rate limiting on password reset**
- Limit is 4 requests per day per employee_Id
- Wait 24 hours or contact admin

### Debug Tips

1. **Check JWT token expiry**: Use jwt.io to decode tokens
2. **Verify device type**: Ensure consistent device type header
3. **Monitor logs**: Check server logs for detailed error messages
4. **Database inspection**: Verify user records and token fields



