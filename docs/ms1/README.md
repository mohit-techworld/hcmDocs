---
title: MS1 Documentation - Complete Guide
sidebar_position: 0
description: "Welcome to the MS1 (Central Server) documentation! This comprehensive guide covers everything you need to know about MS1, from quick setup to detailed."
---

# MS1 Documentation - Complete Guide

Welcome to the MS1 (Central Server) documentation! This comprehensive guide covers everything you need to know about MS1, from quick setup to detailed system architecture.

---

## Quick Start Guide

Get up and running with MS1 (Central Server) in **10 minutes**. This guide will help you set up both the server and client so you can start working immediately.

### What You'll Need

- Node.js (v18+)
- MongoDB (v4.4+)
- npm or pnpm
- Code editor (VS Code recommended)

### Step-by-Step Setup

#### Step 1: Start MongoDB (2 minutes)

```bash
# On macOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# Verify it's running
mongosh
# Type 'exit' to leave
```

#### Step 2: Setup MS1 Server (3 minutes)

```bash
# Navigate to server directory
cd hcmMs1Server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=4001
NODE_ENV=development
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_USER=your_user
MONGO_PASSWORD=your_password
MONGO_AUTH_DB=admin
MONGO_DB=admin
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
SUPERADMIN_SECRET_KEY=admin123
COMPANY_NAME=Human Maximizer HRMS
EOF

# Create super admin
node utils/create.superadmin.js

# Start server
npm start
```

✅ **Server running on http://localhost:4001**

#### Step 3: Setup MS1 Client (3 minutes)

```bash
# Open new terminal, navigate to client directory
cd hcmMs1Client

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:4001/api/v1
EOF

# Start client
npm run dev
```

✅ **Client running on http://localhost:5173**

#### Step 4: Login and Test (2 minutes)

1. Open browser: http://localhost:5173
2. Login with super admin credentials
3. You should see the dashboard!

### Verify Everything Works

#### Test Server API

```bash
# Health check
curl http://localhost:4001/api/v1/auth/health

# Should return: {"status":"ok"}
```

#### Test Client

1. Open http://localhost:5173
2. Login page should appear
3. After login, dashboard should load

### Common First Tasks

#### 1. Create a Pricing Plan

1. Navigate to **Plan Management**
2. Click **"New Plan"**
3. Fill in details:
   - Name: `BASIC`
   - Monthly Price: `999`
   - Employee Limit: `50`
4. Click **"Save"**

#### 2. View Demo Requests

1. Navigate to **Demo Enquiry**
2. See list of demo requests
3. Filter by status, search, etc.

#### 3. Create a Backup

1. Navigate to **Backup & Restore**
2. Select a company
3. Click **"Create Backup"**
4. Wait for backup to complete

### Troubleshooting

#### Server won't start?

```bash
# Check MongoDB is running
mongosh

# Check port 4001 is available
lsof -i:4001

# Check .env file exists and has correct values
cat .env
```

#### Client won't connect?

```bash
# Check server is running
curl http://localhost:4001/api/v1/auth/health

# Check VITE_API_BASE_URL in .env
cat .env | grep VITE_API_BASE_URL
```

#### Can't login?

```bash
# Recreate super admin
cd hcmMs1Server
node utils/create.superadmin.js
```

### Development Tips

#### Use Two Terminals

```bash
# Terminal 1: Server
cd hcmMs1Server
npm start

# Terminal 2: Client
cd hcmMs1Client
npm run dev
```

#### Hot Reload

- **Server**: Restart manually or use `nodemon`
- **Client**: Auto-reloads on file save (Vite HMR)

#### API Testing

Use browser DevTools → Network tab to see all API calls.

---

## MS1 (Central Server) - Overview

MS1 (Central Server) is the administrative and management system for the Human Capital Management (HCM) platform. It consists of two main components: **MS1 Server** (backend) and **MS1 Client** (frontend), working together to provide a comprehensive admin panel for managing tenants, plans, demos, backups, and system configurations.

### What is MS1?

MS1 is the central management system that allows administrators to:

- **Manage Companies/Tenants** – Create, configure, and manage multi-tenant company databases
- **Manage Pricing Plans** – Create and configure subscription plans with permissions
- **Handle Demo Requests** – Process and schedule product demonstration requests
- **Backup & Restore** – Create backups and restore company databases
- **User Management** – Manage admin users and their permissions
- **Analytics & Reports** – View system statistics and reports
- **System Configuration** – Configure system-wide settings

### System Architecture

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    MS1 SYSTEM ARCHITECTURE                            ║
╚═══════════════════════════════════════════════════════════════════════╝

    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │  👨‍💼 ADMINISTRATOR                                         │
    │  (Uses MS1 Client - Web Interface)                          │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              │
    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │  🖥️  MS1 CLIENT (Frontend)                                  │
    │  ┌─────────────────────────────────────────────┐           │
    │  │ • React Application                         │           │
    │  │ • Admin Dashboard                           │           │
    │  │ • UI Components                             │           │
    │  │ • API Services                              │           │
    │  └─────────────────────────────────────────────┘           │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              │
    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │  ⚙️  MS1 SERVER (Backend)                                   │
    │  ┌─────────────────────────────────────────────┐           │
    │  │ • Express.js API Server                     │           │
    │  │ • Controllers & Routes                      │           │
    │  │ • Database Models                           │           │
    │  │ • Business Logic                            │           │
    │  │ • Email Services                            │           │
    │  │ • Backup Services                           │           │
    │  └─────────────────────────────────────────────┘           │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
                              │
                              ├──────────────────┬──────────────────┐
                              │                  │                  │
                              ▼                  ▼                  ▼
    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
    │  🗄️  MongoDB      │  │  ☁️  AWS S3      │  │  📧 SMTP Server  │
    │  (Main Database)  │  │  (Backups)       │  │  (Emails)        │
    │                   │  │                  │  │                  │
    │  • Admin DB       │  │  • Backup Files  │  │  • OTP Emails    │
    │  • Tenant DBs     │  │  • Archives      │  │  • Notifications │
    └──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Components Overview

#### MS1 Server (Backend)

The backend API server that handles all business logic, database operations, and integrations.

**Key Features:**
- RESTful API endpoints
- Multi-tenant database management
- Authentication & authorization
- Email services (OTP, notifications)
- Backup & restore operations
- Plan & permission management
- Demo request processing

**Technology Stack:**
- Node.js with Express.js
- MongoDB (Mongoose)
- AWS S3 (for backups)
- Nodemailer (for emails)
- JWT authentication

#### MS1 Client (Frontend)

The React-based admin dashboard that provides a user-friendly interface for managing the system.

**Key Features:**
- Modern, responsive UI
- Real-time data updates
- Interactive dashboards
- Form management
- Data visualization
- File uploads/downloads

**Technology Stack:**
- React 18
- React Router
- Tailwind CSS
- Axios (API calls)
- Context API (state management)

### How They Work Together

```
┌─────────────────────────────────────────────────────────────┐
│                    TYPICAL WORKFLOW                         │
└─────────────────────────────────────────────────────────────┘

1. 👨‍💼 Admin opens MS1 Client (browser)
   │
   │ Opens dashboard
   │
2. 🖥️  MS1 Client displays UI
   │
   │ Admin clicks "Create Plan"
   │
3. 🖥️  MS1 Client sends API request
   │ POST /api/v1/plans/BASIC
   │
4. ⚙️  MS1 Server receives request
   │
   │ Validates & processes
   │
5. 🗄️  MS1 Server saves to MongoDB
   │
   │ Returns success response
   │
6. 🖥️  MS1 Client receives response
   │
   │ Updates UI (shows new plan)
   │
7. 👨‍💼 Admin sees success message
   │
   │ Plan is now visible in list
```

### Key Concepts

#### Multi-Tenancy

MS1 manages multiple companies (tenants), each with their own:
- Database
- Subdomain
- Configuration
- Users and data

#### Authentication Flow

```
Admin Login → JWT Token → API Requests → Token Verification → Access Granted
```

#### Data Flow

```
UI Action → API Call → Controller → Model → Database → Response → UI Update
```

### Project Structure Overview

```
MS1 System
│
├── hcmMs1Server/          # Backend API
│   ├── controller/        # Business logic
│   ├── model/            # Database models
│   ├── routes/           # API routes
│   └── app.js            # Entry point
│
└── hcmMs1Client/          # Frontend React App
    ├── src/
    │   ├── components/   # UI components
    │   ├── services/     # API services
    │   └── App.jsx       # Main component
    └── vite.config.js    # Build config
```

---

## Start Here

### For New Developers

1. **Read Quick Start Guide** (above) - Get server and client running
2. **Read MS1 Overview** (above) - Understand the system architecture
3. **Explore Folder Structures** (10 minutes)
   - [MS1 Server Folder Structure](./ms1-server/folder-structure)
   - [MS1 Client Folder Structure](./ms1-client/folder-structure)
   - Understand code organization

### For Experienced Developers

1. **Jump to Setup Guides**
   - [MS1 Server Setup](./ms1-server/setup)
   - [MS1 Client Setup](./ms1-client/setup)

2. **Explore Modules**
   - Each module has Overview → Server API → Client Component
   - Start with module overviews

## Documentation Structure

```
MS1 (Central Server)
│
├── 📖 Complete Guide (this page)
│   ├── Quick Start Guide
│   ├── System Overview
│   └── Navigation Guide
│
├── 📁 Getting Started
│   ├── MS1 Server Folder Structure
│   ├── MS1 Server Setup
│   ├── MS1 Client Folder Structure
│   └── MS1 Client Setup
│
├── 📦 Demo Management
│   ├── Overview (How it works together)
│   ├── MS1 Server - Demo Management API
│   └── MS1 Client - Demo Management Component
│
├── 💰 Plan Management
│   ├── Overview (How it works together)
│   ├── MS1 Server - Plan Management API
│   └── MS1 Client - Plan Management Component
│
└── 💾 Backup & Restore
    ├── Overview (How it works together)
    ├── MS1 Server - Backup & Restore API
    └── MS1 Client - Backup & Restore Component
```

## Navigation Guide

### By Role

**Backend Developer:**
1. [MS1 Server Setup](./ms1-server/setup)
2. [MS1 Server Folder Structure](./ms1-server/folder-structure)
3. Module API docs (e.g., [Demo Management API](./ms1-server/modules/demo-management))

**Frontend Developer:**
1. [MS1 Client Setup](./ms1-client/setup)
2. [MS1 Client Folder Structure](./ms1-client/folder-structure)
3. Component docs (e.g., [Demo Management Component](./ms1-client/components/demo-management))

**Full-Stack Developer:**
1. Quick Start (above)
2. Module Overview pages (understand complete flow)
3. Both Server API and Client Component docs

**Project Manager/Non-Technical:**
1. MS1 Overview (above)
2. Module Overview pages (visual diagrams and workflows)
3. Skip technical implementation details

### By Task

**Setting Up the Project:**
- Quick Start Guide (above) - Fastest way
- [MS1 Server Setup](./ms1-server/setup) - Detailed server setup
- [MS1 Client Setup](./ms1-client/setup) - Detailed client setup

**Understanding a Feature:**
1. Start with Module Overview (e.g., [Demo Management Overview](./modules/demo-management-overview))
2. Read Server API docs for backend
3. Read Client Component docs for frontend

**Working on Backend:**
- [MS1 Server Folder Structure](./ms1-server/folder-structure)
- [MS1 Server Setup](./ms1-server/setup)
- Module API documentation

**Working on Frontend:**
- [MS1 Client Folder Structure](./ms1-client/folder-structure)
- [MS1 Client Setup](./ms1-client/setup)
- Component documentation

## Reading Order Recommendations

### Complete Beginner Path

1. Quick Start (above) - Get running
2. MS1 Overview (above) - Understand system
3. [MS1 Server Folder Structure](./ms1-server/folder-structure) - Understand code
4. [MS1 Client Folder Structure](./ms1-client/folder-structure) - Understand UI
5. Pick a module (e.g., Demo Management)
   - Read Overview
   - Read Server API
   - Read Client Component

### Experienced Developer Path

1. Quick Start (above) - Verify setup
2. Pick a module you need to work on
   - Read Overview for context
   - Read Server API or Client Component based on your task

### Project Manager Path

1. MS1 Overview (above) - System overview
2. Module Overview pages - Understand features
3. Skip technical implementation details

## Finding Information

### I want to...

**...set up the project:**
→ Quick Start Guide (above)

**...understand how a feature works:**
→ Module Overview page (e.g., [Demo Management Overview](./modules/demo-management-overview))

**...work on backend API:**
→ Server API docs (e.g., [Demo Management API](./ms1-server/modules/demo-management))

**...work on frontend UI:**
→ Client Component docs (e.g., [Demo Management Component](./ms1-client/components/demo-management))

**...see API endpoints:**
→ Server API docs → API Reference section

**...understand code structure:**
→ Folder Structure docs

**...configure settings:**
→ Setup guides or Module API docs

## Tips for Reading

1. **Start with Overviews** - They provide context
2. **Use Visual Diagrams** - They explain complex flows
3. **Follow Examples** - Real-world examples show how to use features
4. **Check API Reference** - Complete endpoint documentation
5. **Read Both Sides** - Understanding server and client helps integration

## Learning Paths

### Path 1: Complete Understanding (2-3 hours)

1. Quick Start (10 min)
2. Overview (15 min)
3. Folder Structures (20 min)
4. Demo Management Complete (30 min)
5. Plan Management Complete (30 min)
6. Backup & Restore Complete (30 min)

### Path 2: Quick Reference (30 minutes)

1. Quick Start (10 min)
2. Overview (15 min)
3. Pick one module overview (5 min)

### Path 3: Deep Dive (Full Day)

1. Complete Path 1
2. Read all API documentation
3. Read all component documentation
4. Study code examples
5. Try implementing a feature

## Documentation Features

### Visual Diagrams
- ASCII art diagrams for easy understanding
- Flow charts showing processes
- Architecture diagrams

### Code Examples
- Request/response examples
- Usage examples
- Real-world scenarios

### Step-by-Step Guides
- Setup instructions
- Workflow explanations
- Troubleshooting guides

### API Reference
- Complete endpoint documentation
- Request/response formats
- Error codes and handling

## 🆘 Need Help?

### Common Questions

**Q: Where do I start?**
A: Quick Start Guide (above)

**Q: How do I set up the server?**
A: [MS1 Server Setup](./ms1-server/setup)

**Q: How do I set up the client?**
A: [MS1 Client Setup](./ms1-client/setup)

**Q: How does Demo Management work?**
A: [Demo Management Overview](./modules/demo-management-overview)

**Q: What are the API endpoints?**
A: Check the API Reference section in Server API docs

**Q: How do I create a backup?**
A: [Backup & Restore Overview](./modules/backup-restore-overview)

## Quick Links

- Quick Start (above) - Get running fast
- Overview (above) - System introduction
- [Server Folder Structure](./ms1-server/folder-structure) - Code organization
- [Client Folder Structure](./ms1-client/folder-structure) - Component organization
- [Demo Management](./modules/demo-management-overview) - Demo requests
- [Plan Management](./modules/plan-management-overview) - Pricing plans
- [Backup & Restore](./modules/backup-restore-overview) - Database backups

---

**🎉 Congratulations! You're ready to start developing!**

**This documentation is designed to help you work effectively with MS1. Start with the Quick Start guide and explore from there!**
