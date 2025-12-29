---
title: MS1 Server - Folder Structure
sidebar_position: 1
---

# MS1 Server - Folder Structure

This document explains the folder structure of the MS1 Server (backend) application. Understanding this structure will help you navigate the codebase and understand how different components are organized.

## Overview

MS1 Server follows a standard Express.js MVC (Model-View-Controller) architecture with clear separation of concerns.

```
╔═══════════════════════════════════════════════════════════════════════╗
║              MS1 SERVER FOLDER STRUCTURE                             ║
╚═══════════════════════════════════════════════════════════════════════╝

hcmMs1Server/
│
├── 📄 app.js                    # Main application entry point
├── 📄 package.json              # Dependencies and scripts
│
├── 📁 config/                   # Configuration files
│   ├── database.config.js       # Database connection config
│   └── roles.config.js          # User roles configuration
│
├── 📁 constant/                 # Constants and enums
│   ├── feed.permission.js       # Permission constants
│   └── responseCodes.js         # API response codes
│
├── 📁 controller/               # Business logic (Controllers)
│   ├── adminUser.controller.js  # Admin user management
│   ├── auth.controller.js       # Authentication
│   ├── backupRestore.controller.js  # Backup & restore
│   ├── billing.controller.js     # Billing operations
│   ├── contact.controller.js     # Contact form handling
│   ├── database.controller.js    # Database operations
│   ├── demo.controller.js       # Demo request management
│   ├── landingDemo.controller.js # Landing page demos
│   ├── loginHistory.controller.js # Login tracking
│   ├── loginRestrictions.controller.js # Login restrictions
│   ├── notificationEmail.controller.js # Email notifications
│   ├── permissionsController.js # Permission management
│   └── plan.controller.js       # Plan management
│
├── 📁 middleware/               # Express middleware
│   ├── admin.verifyToken.js     # Admin authentication
│   ├── rateLimit.middleware.js  # Rate limiting
│   └── subdomain.middleware.js  # Subdomain handling
│
├── 📁 model/                    # Database models (Mongoose)
│   ├── adminUser.model.js       # Admin user schema
│   ├── backupSettings.model.js  # Backup settings schema
│   ├── demo.model.js            # Demo request schema
│   ├── landingDemoOtp.model.js  # Landing demo OTP
│   ├── loginHistory.model.js    # Login history schema
│   ├── notificationEmail.model.js # Notification emails
│   ├── permission.model.js      # Permission schema
│   ├── pricingPlan.model.js     # Pricing plan schema
│   └── tenant.model.js          # Company/tenant schema
│
├── 📁 routes/                   # API route definitions
│   ├── adminUser.routes.js      # Admin user routes
│   ├── auth.routes.js           # Authentication routes
│   ├── backupRestore.routes.js  # Backup/restore routes
│   ├── billing.routes.js        # Billing routes
│   ├── contact.routes.js        # Contact routes
│   ├── database.routes.js       # Database routes
│   ├── demo.routes.js           # Demo routes
│   ├── landingDemo.routes.js    # Landing demo routes
│   ├── loginHistory.routes.js   # Login history routes
│   ├── loginRestrictions.routes.js # Login restrictions
│   ├── notificationEmail.routes.js # Notification routes
│   ├── permissionsRoutes.js    # Permission routes
│   └── plan.routes.js           # Plan routes
│
├── 📁 services/                 # Background services
│   └── backupScheduler.service.js # Automated backups
│
├── 📁 utils/                    # Utility functions
│   ├── backupNotification.service.js # Backup notifications
│   ├── contactEmailService.js   # Contact email service
│   ├── create.superadmin.js     # Super admin creation
│   ├── database.utils.js        # Database utilities
│   ├── delete.db.js             # Database deletion
│   ├── demoEmailService.js      # Demo email service
│   ├── email.utils.js           # Email utilities
│   ├── emailQueue.js            # Email queue system
│   ├── emailTemplateLoader.js   # Email template loader
│   ├── landingDemoEmail.util.js # Landing demo emails
│   ├── logger.js                # Logging utility
│   ├── newEmail.js              # Email helper
│   ├── tenantUpdater.js         # Tenant update utility
│   ├── updateExistingPlans.js   # Plan update utility
│   └── userAgentParser.js       # User agent parsing
│
├── 📁 validation/               # Input validation
│   ├── contact.validation.js    # Contact validation
│   ├── demo.validation.js       # Demo validation
│   ├── errorHandler.js          # Error handling
│   ├── landingDemo.validation.js # Landing demo validation
│   └── validation.js            # General validation
│
├── 📁 email-templates/          # HTML email templates
│   ├── admin-contact.html
│   ├── admin-notification.html
│   ├── demo-cancelled.html
│   ├── demo-completed.html
│   ├── demo-confirmation.html
│   ├── demo-otp.html
│   ├── demo-rescheduled.html
│   ├── demo-resend-otp.html
│   ├── demo-scheduled.html
│   ├── demo-status-updated.html
│   ├── landing-re-demo.html
│   └── user-contact.html
│
├── 📁 scripts/                  # Utility scripts
│   ├── check-orphan-tenants.js  # Find orphaned tenants
│   └── reset-tenant-data.js    # Reset tenant data
│
├── 📁 public/                   # Static files
│   ├── script.js
│   └── trail.html
│
├── 📁 logs/                     # Application logs
│   ├── combined.log
│   └── error.log
│
└── 📁 temp_backups/             # Temporary backup storage
```

## Detailed Folder Descriptions

### 📄 Root Files

**`app.js`**
- Main application entry point
- Sets up Express server
- Configures middleware
- Mounts routes
- Starts the server

**`package.json`**
- Project dependencies
- NPM scripts
- Project metadata

### 📁 config/

Configuration files for the application.

**`database.config.js`**
- MongoDB connection settings
- Database configuration

**`roles.config.js`**
- User role definitions
- Permission mappings

### 📁 controller/

Contains all business logic controllers. Each controller handles requests for a specific feature.

**Pattern:** `[feature].controller.js`
- Receives HTTP requests
- Validates input
- Calls models/services
- Returns responses

**Example Flow:**
```
Request → Route → Controller → Model → Database → Response
```

### 📁 model/

Mongoose schemas that define database structure.

**Pattern:** `[entity].model.js`
- Defines data structure
- Sets validation rules
- Creates database collections

**Key Models:**
- `tenant.model.js` - Company/tenant information
- `pricingPlan.model.js` - Subscription plans
- `demo.model.js` - Demo requests
- `adminUser.model.js` - Admin users

### 📁 routes/

API route definitions that map URLs to controllers.

**Pattern:** `[feature].routes.js`
- Defines endpoints
- Applies middleware
- Connects to controllers

**Example:**
```javascript
router.post('/backup/:identifier', adminVerifyToken, controller.backupDatabase);
```

### 📁 middleware/

Express middleware functions.

**Key Middleware:**
- `admin.verifyToken.js` - Verifies admin JWT tokens
- `rateLimit.middleware.js` - Prevents API abuse
- `subdomain.middleware.js` - Handles subdomain routing

### 📁 utils/

Reusable utility functions and services.

**Key Utilities:**
- `emailQueue.js` - Manages email sending queue
- `database.utils.js` - Database operations
- `demoEmailService.js` - Demo email templates

### 📁 services/

Background services that run independently.

**`backupScheduler.service.js`**
- Automatically creates backups
- Runs on schedule
- Sends notifications

### 📁 validation/

Input validation using express-validator.

**Pattern:** `[feature].validation.js`
- Validates request data
- Returns error messages
- Ensures data integrity

### 📁 email-templates/

HTML email templates for various notifications.

**Templates:**
- OTP emails
- Confirmation emails
- Status update emails
- Admin notifications

## File Naming Conventions

```
Controllers:  [feature].controller.js
Models:       [entity].model.js
Routes:       [feature].routes.js
Validation:   [feature].validation.js
Utils:        [purpose].js or [purpose].service.js
```

## How Files Connect

```
┌─────────────────────────────────────────────────────────────┐
│                    FILE CONNECTION FLOW                     │
└─────────────────────────────────────────────────────────────┘

1. app.js
   │
   │ Requires routes
   │
2. routes/[feature].routes.js
   │
   │ Uses controller & middleware
   │
3. controller/[feature].controller.js
   │
   │ Uses model & utils
   │
4. model/[entity].model.js
   │
   │ Defines database schema
   │
5. utils/[utility].js
   │
   │ Provides helper functions
```

## Common Patterns

### Creating a New Feature

1. **Create Model** → `model/[feature].model.js`
2. **Create Controller** → `controller/[feature].controller.js`
3. **Create Routes** → `routes/[feature].routes.js`
4. **Create Validation** → `validation/[feature].validation.js`
5. **Mount Routes** → Add to `app.js`

### Request Flow

```
HTTP Request
    │
    ▼
Route (routes/[feature].routes.js)
    │
    ▼
Middleware (authentication, validation)
    │
    ▼
Controller (controller/[feature].controller.js)
    │
    ├──► Model (model/[entity].model.js)
    │         │
    │         ▼
    │    Database
    │
    └──► Utils (utils/[utility].js)
              │
              ▼
         External Services
```

## Best Practices

1. **Keep controllers thin** - Move business logic to services/utils
2. **Validate early** - Use validation middleware
3. **Handle errors** - Use errorHandler middleware
4. **Log operations** - Use logger utility
5. **Follow naming** - Use consistent naming conventions

## Quick Reference

| Folder | Purpose | Example Files |
|--------|---------|---------------|
| `controller/` | Business logic | `demo.controller.js` |
| `model/` | Database schemas | `demo.model.js` |
| `routes/` | API endpoints | `demo.routes.js` |
| `middleware/` | Request processing | `admin.verifyToken.js` |
| `utils/` | Helper functions | `emailQueue.js` |
| `validation/` | Input validation | `demo.validation.js` |
| `services/` | Background services | `backupScheduler.service.js` |

---

**Next Steps:**
- 📖 [MS1 Server Setup Guide](./setup)
- 🔧 [MS1 Server Configuration](./configuration)
- 📚 [MS1 Server Modules](./modules)

