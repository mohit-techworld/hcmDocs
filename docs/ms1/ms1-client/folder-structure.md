---
title: MS1 Client - Folder Structure
sidebar_position: 1
description: "This document explains the folder structure of the MS1 Client (frontend) application. Understanding this structure will help you navigate the React."
---

# MS1 Client - Folder Structure

This document explains the folder structure of the MS1 Client (frontend) application. Understanding this structure will help you navigate the React codebase and understand how components are organized.

## Overview

MS1 Client is a React-based single-page application (SPA) built with modern React patterns and tools.

```
╔═══════════════════════════════════════════════════════════════════════╗
║              MS1 CLIENT FOLDER STRUCTURE                             ║
╚═══════════════════════════════════════════════════════════════════════╝

hcmMs1Client/
│
├── 📄 package.json              # Dependencies and scripts
├── 📄 vite.config.js            # Vite build configuration
├── 📄 tailwind.config.js        # Tailwind CSS configuration
├── 📄 index.html                # HTML entry point
│
├── 📁 public/                   # Static assets
│   └── vite.svg                 # Logo/icon
│
├── 📁 src/                      # Source code
│   │
│   ├── 📄 main.jsx              # React app entry point
│   ├── 📄 App.jsx               # Main app component
│   ├── 📄 index.css             # Global styles
│   ├── 📄 routesConfig.jsx      # Route definitions
│   │
│   ├── 📁 components/           # React components
│   │   ├── 📁 Auth/             # Authentication
│   │   │   └── Login.jsx        # Login component
│   │   │
│   │   ├── 📁 Dashboard/        # Dashboard components
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── CompanyDetails.jsx
│   │   │   ├── ActionZone.jsx
│   │   │   └── ...
│   │   │
│   │   ├── 📁 plan-management/  # Plan management
│   │   │   └── PlanManagement.jsx
│   │   │
│   │   ├── 📁 demo-enquiry/     # Demo management
│   │   │   ├── DemoEnquiry.jsx
│   │   │   ├── DemoRequestDetailsModal.jsx
│   │   │   └── NotificationEmailManager.jsx
│   │   │
│   │   ├── 📁 backup-restore/   # Backup & restore
│   │   │   └── BackupRestore.jsx
│   │   │
│   │   ├── 📁 database-management/ # Database management
│   │   │   ├── DatabaseManagement.jsx
│   │   │   └── DatabaseDeletion.jsx
│   │   │
│   │   ├── 📁 permission/       # Permission management
│   │   │   └── Permission.jsx
│   │   │
│   │   ├── 📁 Layout/           # Layout components
│   │   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   ├── RouteWrapper.jsx   # Route wrapper
│   │   │   └── ThemeToggle.jsx   # Dark/light mode
│   │   │
│   │   └── 📁 Profile/          # User profile
│   │       └── Profile.jsx
│   │
│   ├── 📁 services/             # API services
│   │   ├── api.js               # Base API client
│   │   ├── authService.js       # Authentication
│   │   ├── planApi.js           # Plan API
│   │   ├── demoApi.js           # Demo API
│   │   ├── backupRestoreApi.js  # Backup API
│   │   ├── databaseApi.js       # Database API
│   │   ├── permissionApi.js     # Permission API
│   │   └── ...                  # Other APIs
│   │
│   ├── 📁 context/              # React Context
│   │   └── ThemeContext.jsx     # Theme management
│   │
│   ├── 📁 utils/                 # Utility functions
│   │   ├── auth.js              # Auth utilities
│   │   └── permissions.js       # Permission utilities
│   │
│   └── 📁 assets/               # Static assets
│       └── react.svg            # Images/icons
│
└── 📁 dist/                     # Build output (generated)
    └── assets/                  # Compiled assets
```

## Detailed Folder Descriptions

### Root Files

**`package.json`**
- React dependencies
- Build scripts
- Project metadata

**`vite.config.js`**
- Vite bundler configuration
- Build settings
- Development server config

**`tailwind.config.js`**
- Tailwind CSS configuration
- Theme customization
- Utility classes

**`index.html`**
- HTML template
- React root element
- Meta tags

### src/

Main source code directory.

#### Core Files

**`main.jsx`**
- React app entry point
- Renders App component
- Sets up React Router

**`App.jsx`**
- Main application component
- Handles routing
- Manages authentication state
- Provides theme context

**`routesConfig.jsx`**
- Defines all application routes
- Maps URLs to components
- Configures protected routes

**`index.css`**
- Global CSS styles
- Tailwind imports
- Custom styles

#### components/

React components organized by feature.

**Structure Pattern:**
```
components/
  └── [feature]/
      └── [ComponentName].jsx
```

**Key Component Folders:**

**`Auth/`**
- Login component
- Authentication UI

**`Dashboard/`**
- Main dashboard
- Company details
- Action zones
- Feed components

**`plan-management/`**
- Plan creation/editing
- Permission assignment
- Plan listing

**`demo-enquiry/`**
- Demo request management
- Demo details modal
- Email notification manager

**`backup-restore/`**
- Backup creation
- Restore operations
- Backup listing
- Settings management

**`database-management/`**
- Database operations
- Database deletion
- Database listing

**`Layout/`**
- Sidebar navigation
- Route protection
- Theme toggle
- Layout wrapper

#### services/

API service functions that communicate with MS1 Server.

**Pattern:** `[feature]Api.js`

**Key Services:**

**`api.js`**
- Base Axios instance
- Request interceptors
- Response interceptors
- Error handling

**`authService.js`**
- Login/logout
- Token management
- User session

**`planApi.js`**
- Plan CRUD operations
- Permission management

**`demoApi.js`**
- Demo request operations
- OTP verification

**`backupRestoreApi.js`**
- Backup operations
- Restore operations
- Settings management

#### context/

React Context providers for global state.

**`ThemeContext.jsx`**
- Dark/light theme
- Theme persistence
- Theme toggle functionality

#### utils/

Utility functions and helpers.

**`auth.js`**
- Token validation
- User permissions
- Auth helpers

**`permissions.js`**
- Permission checking
- Role validation

### public/

Static files served directly.

- Images
- Icons
- Favicon
- Other static assets

### dist/

Build output (generated, not in source control).

- Compiled JavaScript
- Bundled CSS
- Optimized assets

## Component Structure Pattern

```
ComponentName.jsx
│
├── Imports
│   ├── React hooks
│   ├── UI components
│   ├── Services
│   └── Utils
│
├── Component Definition
│   ├── State management
│   ├── Effects (useEffect)
│   ├── Event handlers
│   └── Render logic
│
└── Export
```

## Service Structure Pattern

```javascript
// [feature]Api.js
import api from './api';

export const [operation] = async (params) => {
  try {
    const response = await api.[method](`/endpoint`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error' };
  }
};
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA FLOW IN MS1 CLIENT                  │
└─────────────────────────────────────────────────────────────┘

User Action (Click, Form Submit)
    │
    ▼
Component Event Handler
    │
    ▼
Service Function (API Call)
    │
    ▼
API Service (api.js)
    │
    ▼
HTTP Request to MS1 Server
    │
    ▼
Response Received
    │
    ▼
Update Component State
    │
    ▼
UI Re-renders
```

## File Naming Conventions

```
Components:  PascalCase.jsx (e.g., PlanManagement.jsx)
Services:   camelCaseApi.js (e.g., planApi.js)
Utils:      camelCase.js (e.g., auth.js)
Context:    PascalCaseContext.jsx (e.g., ThemeContext.jsx)
```

## Common Patterns

### Creating a New Feature Component

1. **Create Component** → `components/[feature]/[ComponentName].jsx`
2. **Create Service** → `services/[feature]Api.js`
3. **Add Route** → Update `routesConfig.jsx`
4. **Add to Sidebar** → Update `Layout/Sidebar.jsx`

### Component Structure

```jsx
import React, { useState, useEffect } from 'react';
import { featureApi } from '../../services/featureApi';

export default function FeatureComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await featureApi.getData();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

## Key Technologies

- **React 18** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Context API** - State management

## Quick Reference

| Folder | Purpose | Example |
|--------|---------|---------|
| `components/` | UI components | `PlanManagement.jsx` |
| `services/` | API calls | `planApi.js` |
| `context/` | Global state | `ThemeContext.jsx` |
| `utils/` | Helpers | `auth.js` |
| `routesConfig.jsx` | Route definitions | Route mapping |

---

**Next Steps:**
- [MS1 Client Setup Guide](./setup)
- [MS1 Client Components](./components)
- [API Integration](../ms1-server/modules)

