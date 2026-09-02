---
title: MS1 Server - Setup & Installation
sidebar_position: 2
description: "This guide will help you set up the MS1 Server (backend) quickly and start working on the project."
---

# MS1 Server - Setup & Installation Guide

This guide will help you set up the MS1 Server (backend) quickly and start working on the project.

## Prerequisites

Before you begin, make sure you have:

- **Node.js** (v18 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **pnpm** package manager
- **AWS Account** (for S3 backups - optional)
- **SMTP Server** credentials (for emails - optional)

## Quick Start (5 Minutes)

### Step 1: Clone and Install

```bash
# Navigate to the project directory
cd hcmMs1Server

# Install dependencies
npm install
# OR
pnpm install
```

### Step 2: Configure Environment

Create a `.env` file in the root directory:

```bash
# Copy example if available
cp .env.example .env
# OR create new file
touch .env
```

### Step 3: Set Environment Variables

Add these required variables to `.env`:

```env
# Server Configuration
PORT=4001
NODE_ENV=development

# MongoDB Configuration
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_USER=your_mongo_user
MONGO_PASSWORD=your_mongo_password
MONGO_AUTH_DB=admin
MONGO_DB=admin

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Admin Configuration
SUPERADMIN_SECRET_KEY=your_superadmin_secret_key
ADMIN_BACKUP_KEY=your_admin_backup_key

# SMTP Configuration (for emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Company Branding
COMPANY_NAME=Human Maximizer HRMS
LOGO_URL=https://example.com/logo.png
ADMIN_PANEL_URL=http://localhost:3000

# AWS S3 (for backups - optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=hcm-dbbackup
```

### Step 4: Start MongoDB

Make sure MongoDB is running:

```bash
# On macOS (if installed via Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# Or run directly
mongod
```

### Step 5: Create Super Admin

```bash
# Run the super admin creation script
node utils/create.superadmin.js
```

This will create your first admin user.

### Step 6: Start the Server

```bash
# Development mode
npm start
# OR
node app.js

# The server will start on http://localhost:4001
```

## Verification

Test if the server is running:

```bash
# Check server health
curl http://localhost:4001/api/v1/auth/health

# Or open in browser
open http://localhost:4001/api/v1/auth/health
```

## Project Structure

```
hcmMs1Server/
├── app.js                 # Main entry point
├── package.json           # Dependencies
├── .env                   # Environment variables (create this)
│
├── config/                # Configuration files
│   ├── database.config.js
│   └── roles.config.js
│
├── controller/            # Business logic
│   ├── auth.controller.js
│   ├── demo.controller.js
│   ├── plan.controller.js
│   └── ...
│
├── model/                 # Database models
│   ├── tenant.model.js
│   ├── pricingPlan.model.js
│   └── ...
│
├── routes/                # API routes
│   ├── auth.routes.js
│   ├── demo.routes.js
│   └── ...
│
├── middleware/            # Express middleware
│   ├── admin.verifyToken.js
│   └── ...
│
├── utils/                 # Utility functions
│   ├── emailQueue.js
│   ├── database.utils.js
│   └── ...
│
└── validation/            # Input validation
    ├── demo.validation.js
    └── ...
```

## Common Setup Issues

### Issue: MongoDB Connection Failed

**Solution:**
```bash
# Check if MongoDB is running
mongosh

# Verify connection string in .env
MONGO_HOST=localhost
MONGO_PORT=27017
```

### Issue: Port Already in Use

**Solution:**
```bash
# Change PORT in .env
PORT=4002

# Or kill the process using port 4001
lsof -ti:4001 | xargs kill
```

### Issue: JWT Secret Missing

**Solution:**
```bash
# Generate a random JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Add to .env
JWT_SECRET=<generated_secret>
```

## Next Steps

1. Server is running
2. Read [MS1 Server Folder Structure](./folder-structure) to understand the codebase
3. Read [MS1 Server Folder Structure](./folder-structure) for advanced settings
4. Explore [Modules Documentation](./modules) for specific features

## Development Tips

### Hot Reload (Optional)

Install `nodemon` for automatic server restart:

```bash
npm install -g nodemon
nodemon app.js
```

### Database Setup

Initialize the database:

```bash
# Run database setup script if available
node scripts/setup-database.js
```

### Testing API Endpoints

Use tools like:
- **Postman** - API testing
- **curl** - Command line testing
- **Thunder Client** - VS Code extension

Example:
```bash
# Test login endpoint
curl -X POST http://localhost:4001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Use strong JWT secrets
3. Enable HTTPS
4. Set up proper MongoDB authentication
5. Configure AWS S3 properly
6. Set up monitoring and logging

See [Deployment Guide](../../devops/deployment) for details.

---

**You're all set! The server is running and ready for development.**

