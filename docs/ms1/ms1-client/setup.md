---
title: MS1 Client - Setup & Installation
sidebar_position: 2
description: "This guide will help you set up the MS1 Client (frontend) quickly and start working on the project."
---

# MS1 Client - Setup & Installation Guide

This guide will help you set up the MS1 Client (frontend) quickly and start working on the project.

## Prerequisites

Before you begin, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** package manager
- **MS1 Server** running (see [MS1 Server Setup](../ms1-server/setup))

## Quick Start (5 Minutes)

### Step 1: Navigate to Project

```bash
# Navigate to the client directory
cd hcmMs1Client
```

### Step 2: Install Dependencies

```bash
# Install dependencies
npm install
# OR
pnpm install
```

### Step 3: Configure API Endpoint

Create or update `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Add the API endpoint:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:4001/api/v1

# Optional: Other configuration
VITE_APP_NAME=MS1 Admin Panel
VITE_APP_VERSION=1.0.0
```

### Step 4: Start Development Server

```bash
# Start development server
npm run dev
# OR
pnpm dev

# The app will start on http://localhost:5173 (or similar)
```

### Step 5: Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

## Verification

1. Development server is running
2. Browser opens automatically
3. Login page is visible
4. Can connect to MS1 Server API

## Project Structure

```
hcmMs1Client/
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Main app component
│   ├── routesConfig.jsx      # Route definitions
│   │
│   ├── components/           # React components
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── plan-management/
│   │   ├── demo-enquiry/
│   │   └── ...
│   │
│   ├── services/             # API services
│   │   ├── api.js            # Base API client
│   │   ├── authService.js
│   │   ├── planApi.js
│   │   └── ...
│   │
│   ├── context/              # React Context
│   │   └── ThemeContext.jsx
│   │
│   └── utils/                # Utility functions
│       ├── auth.js
│       └── permissions.js
│
├── public/                   # Static assets
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
└── package.json              # Dependencies
```

## Common Setup Issues

### Issue: Cannot Connect to API

**Solution:**
```bash
# Check if MS1 Server is running
curl http://localhost:4001/api/v1/auth/health

# Verify VITE_API_BASE_URL in .env
VITE_API_BASE_URL=http://localhost:4001/api/v1
```

### Issue: Port Already in Use

**Solution:**
```bash
# Vite will automatically use next available port
# Or specify port in vite.config.js
server: {
  port: 5174
}
```

### Issue: Dependencies Installation Failed

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# OR use pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Development Workflow

### 1. Start Development

```bash
# Terminal 1: Start MS1 Server
cd ../hcmMs1Server
npm start

# Terminal 2: Start MS1 Client
cd hcmMs1Client
npm run dev
```

### 2. Make Changes

- Edit files in `src/components/`
- Changes auto-reload in browser
- Check browser console for errors

### 3. Build for Production

```bash
# Build production bundle
npm run build

# Output will be in dist/ folder
```

## Key Files to Know

### `src/services/api.js`
Base API client configuration:
```javascript
// Configure API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### `src/routesConfig.jsx`
Define all application routes:
```javascript
const APP_ROUTES = [
  { path: '/', component: Dashboard },
  { path: '/plans', component: PlanManagement },
  // ...
];
```

### `src/App.jsx`
Main application component with routing and authentication.

## Testing the Setup

### 1. Test Login

1. Open http://localhost:5173
2. Enter admin credentials
3. Should redirect to dashboard

### 2. Test API Connection

Open browser console and check:
- No CORS errors
- API calls are successful
- Data loads correctly

### 3. Test Components

Navigate to different pages:
- Dashboard
- Plan Management
- Demo Enquiry
- Backup & Restore

## Development Tips

### Hot Module Replacement (HMR)

Vite provides instant HMR:
- Save file → See changes immediately
- No page refresh needed
- State is preserved

### Browser DevTools

Use React DevTools extension:
- Inspect component tree
- View component props/state
- Debug React issues

### API Testing

Use browser Network tab:
- See all API calls
- Check request/response
- Debug API issues

## Next Steps

1. Client is running
2. Read [MS1 Client Folder Structure](./folder-structure) to understand the codebase
3. Read [MS1 Client Components](./components) documentation
4. Check [API Integration](../ms1-server/modules) guide

## Production Build

### Build Command

```bash
npm run build
```

### Output

Build output in `dist/` folder:
- Optimized JavaScript
- Minified CSS
- Static assets

### Deploy

Deploy `dist/` folder to:
- Static hosting (Netlify, Vercel)
- CDN
- Web server (Nginx, Apache)

---

**You're all set! The client is running and ready for development.**

