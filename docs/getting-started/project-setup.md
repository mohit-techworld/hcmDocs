---
title: Project Setup
sidebar_position: 1
description: "Follow this guide to run the HCM platform locally. It covers prerequisites, environment variables, dependency installation, and common scripts for both."
---

# Project Setup

Follow this guide to run the HCM platform locally.  It covers prerequisites, environment variables, dependency installation, and common scripts for both backend and frontend projects.

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| **Node.js** | ≥ 20.x | Backend requires ES modules and mediasoup bindings built for Node 20. |
| **npm / pnpm** | npm 10+ or pnpm 9+ | The repo ships with both `package-lock.json` and `pnpm-lock.yaml`. Pick one package manager per workspace. |
| **MongoDB** | 6.x+ | Local instance or Atlas cluster. Connection string is supplied via `DB_URI_CLOUD`. |
| **Redis** | 4.x+ | Required for BullMQ email queues and scheduled jobs. Configure host/port/password via env vars. |
| **AWS SES + S3 credentials** | Optional but recommended | Email delivery and file uploads rely on SES and S3. |
| **Firebase service account** | Required for push notifications | Place the JSON credentials inside `hcmBackendv2/src/config/firebase-service-account.json`. |
| **Python 3.11 (optional)** | | Used by some seed scripts and environment tooling (see `venv/`). |

## Repository Layout

```
hcm web app/
├── hcmBackendv2/         # Express + Socket.io backend
├── hcmFrontend/          # React + Vite frontend
└── hcm-documentation/    # Docusaurus documentation site
```

## Backend Setup (`hcmBackendv2`)

### 1. Install dependencies

```bash
cd hcmBackendv2
npm install          # or: pnpm install
```

Mediasoup will compile native binaries during this step. Ensure build tools (make, g++) are available on your system.

### 2. Create `.env`

Create `hcmBackendv2/.env` with the values required in your environment. Use the template below as a starting point:

```dotenv
# General
APP_NAME=HCM Local
PORT=6006
NODE_ENV=development

# MongoDB
DB_URI_CLOUD=mongodb://127.0.0.1:27017/hcm
DATABASE_NAME=hcm

# Authentication
SUPERADMIN_SECRET_KEY=change-me
JWT_SECRET_KEY=change-me-again
JWT_SECRET_FOR_GUEST=guest-secret
ACCESS_TOKEN_EXPIRY=7d
DEVICE_SECRET=device-handshake-secret

# URLs
FRONTEND_URL=http://localhost:5173
WEB_APP_URL=http://localhost:5173

# Redis (BullMQ)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
EMAIL_WORKER_CONCURRENCY=5
EMAIL_RATE_LIMIT_MAX=10
EMAIL_RATE_LIMIT_DURATION=1000

# AWS (SES + S3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_SES_FROM_EMAIL=noreply@example.com
BUCKET_NAME=hcm-dev-bucket

# Email identities (optional overrides)
EMAIL_FROM_NAME=HumanMaximizer
EMAIL_FROM_ADDRESS=noreply@example.com

# Holiday calendar / external APIs
NINJA_API_KEY=your-api-key

# Mediasoup (WebRTC)
MEDIASOUP_MIN_PORT=10000
MEDIASOUP_MAX_PORT=11000
PUBLIC_IP=127.0.0.1

# Misc
DEBUG_TIMELINE=0
```

:::danger Do not commit secrets
Replace secrets with secure values before deploying to production. `.env` files must never be committed.
:::

### 3. Firebase Service Account

Place the service account JSON at `hcmBackendv2/src/config/firebase-service-account.json`. The content should resemble:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123",
  "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
  "client_email": "firebase-adminsdk@your-project.iam.gserviceaccount.com",
  "client_id": "1234567890",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/... "
}
```

### 4. Run the backend

```bash
# development with nodemon
npm run dev

# production-style start
npm start
```

The API listens on `PORT` (default `6006`). Socket.io namespaces share the same port.

### 5. Seed data (optional)

On first run the backend executes `runAllSeeds()` (see `src/controllers/bonus/seedDatabase.js`) to populate statutory data.  You can also run scripts manually from `hcmBackendv2/scripts/**`.

## Frontend Setup (`hcmFrontend`)

### 1. Install dependencies

```bash
cd hcmFrontend
npm install          # or: pnpm install
```

### 2. Create `.env`

Vite reads variables prefixed with `VITE_`. Create `hcmFrontend/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:6006
VITE_SOCKET_URL=http://localhost:6006
VITE_SECRET_KEY=razorinfotech123   # used by super admin registration UI
```

Add additional variables (Firebase config, analytics keys, etc.) as needed.

### 3. Run the frontend

```bash
npm run dev
# Vite dev server defaults to http://localhost:5173
```

The proxy expects the backend at `VITE_API_BASE_URL`. Socket.io also points to `VITE_SOCKET_URL`.

### 4. Build for production

```bash
npm run build
# Preview the built assets
npm run preview
```

The build script sets `NODE_OPTIONS='--max_old_space_size=4096'` to avoid memory issues on large bundles.

## Documentation (`hcm-documentation/hcm-doc`)

The documentation site is powered by Docusaurus. To view it locally:

```bash
cd hcm-documentation/hcm-doc
npm install
npm run start
```

The docs server runs on `http://localhost:3000` by default.

## Common Issues

| Symptom | Resolution |
| --- | --- |
| `ERR_MODULE_NOT_FOUND` for `missedpunchrequest.model.js` | Ensure imports use the exact file casing (`missedpunchrequest.model.js`). |
| mediasoup worker `ENOENT` | Rebuild mediasoup after installing dependencies: `npm install mediasoup --build-from-source`. |
| Redis connection refused | Verify `REDIS_HOST`/`REDIS_PORT` env vars and that the server is running. |
| Emails silently fail | Check AWS credentials and verified SES identities. The console logs warnings when keys are missing. |
| Firebase push not received | Confirm the service account file exists and the browser has notification permissions. |

## Next Steps

- Create a super admin account with the `SUPERADMIN_SECRET_KEY`.
- Configure company settings (employment types, shifts) via the UI.
- Import employees or register them manually.
- Explore domain-specific documentation in the backend and frontend sections.
- For multi-tenant production setups, duplicate the `.env`, PM2 process, and frontend build per customer as described in [Deployment & Operations](../devops/deployment.md#multi-tenant-deployment-pattern).

