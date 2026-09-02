---
title: "Deployment & Operations"
sidebar_position: 1
description: "This guide summarises how the HCM platform is deployed in production environments (PM2 + Node), the background services it relies on, and the operational."
---

# Deployment & Operations

This guide summarises how the HCM platform is deployed in production environments (PM2 + Node), the background services it relies on, and the operational tasks administrators should monitor.

## Infrastructure Overview

| Component | Production Notes |
| --- | --- |
| **API Node Process** | Managed via PM2 (`pm2 start server.js --name hcm-api`). Uses Node 20+. |
| **Socket.io** | Shares the API process; namespace `/chat` requires JWT handshake. |
| **Mediasoup Worker** | The WebRTC stack spawns native binaries under `node_modules/mediasoup/worker/out/Release`. Ensure binaries exist (`npm install mediasoup --build-from-source`). |
| **MongoDB** | Hosted Atlas cluster or self-managed replica set. Connection string provided via `DB_URI_CLOUD`. |
| **Redis** | Managed service or VM for BullMQ queueing (`REDIS_HOST`, `REDIS_PORT`). |
| **S3 / SES** | AWS credentials stored in env vars for document uploads and transactional email delivery. |
| **Firebase** | Service account enables push notifications. |
| **Hostinger VPS / Nginx** | Serves tenant-specific React bundles and reverse-proxies to PM2 API ports. |

## Production Environment Variables

See [Project Setup](../getting-started/project-setup.md) for the full list.  Additional production considerations:

- `NODE_ENV=production`
- `EMAIL_WORKER_CONCURRENCY` tuned to SES throughput limits.
- `MEDIASOUP_MIN_PORT` / `MEDIASOUP_MAX_PORT` open in firewall security groups.
- `PUBLIC_IP` points to the server’s external address.
- `SUPERADMIN_SECRET_KEY` rotated and stored securely (e.g., secrets manager).

## Process Management with PM2

Example `ecosystem.config.js` (optional):

```javascript
module.exports = {
  apps: [
    {
      name: "hcm-api",
      script: "./server.js",
      cwd: "/root/razorinfotech/production/hcmServer",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 6006
      }
    },
    {
      name: "email-worker",
      script: "./src/services/emailWorker.js",
      cwd: "/root/razorinfotech/production/hcmServer",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
```

Deploy sequence:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # generate systemd service
```

## Background Jobs

| Job | Description | Location | Scheduling |
| --- | --- | --- | --- |
| **Late Punch Scheduler** | Reads company shift settings, queues reminders, reschedules nightly. | `src/jobs/latePunchScheduler.js` | Triggered after DB connection. |
| **Poll Closure** | Auto-closes engagement polls on expiry. | `src/utils/pollScheduler.js` | Runs on server boot and scheduled intervals. |
| **Ticket Reminder** | Nudges assignees about pending issues. | `src/jobs/ticketReminderScheduler.js` | Cron interval defined inside script. |
| **Inventory Low Stock** | Sends alerts when inventory thresholds are breached. | `src/jobs/inventoryLowStockScheduler.js` | Cron interval defined inside script. |
| **Email Worker** | Processes BullMQ jobs created by `emailService`. | `src/services/emailWorker.js` | Continuous. Requires Redis. |

Ensure these scripts write to logs (PM2 or dedicated log files). Check `/root/razorinfotech/production/hcmServer/logs/*.log` or `pm2 logs` during incidents.

## File System Requirements

| Path | Purpose |
| --- | --- |
| `/uploads` | Stores uploaded resumes, documents, and generated exports. Mounted from `express.static`. |
| `/public` | Static assets served by Express (branding, welcome images). |
| `src/config/firebase-service-account.json` | Service account credentials for Firebase admin SDK. |

Set appropriate file permissions and include these directories in backups when using local storage. In production, prefer S3 for durable storage.

## Monitoring & Logging

- **Application Logs**: Winston (`logger.stream`) can be piped to PM2 log files. Enable `morgan` access logging if HTTP visibility is required.
- **Error Logs**: The global error handler prints stack traces; wrap with a log aggregator (CloudWatch, ELK) for long-term retention.
- **Queue Health**: Monitor Redis memory, BullMQ queue depth, and failed jobs (email worker prints warnings on failures).
- **Mediasoup**: Errors referencing `mediasoup-worker ENOENT` indicate missing binaries; rebuild mediasoup after dependency updates.

## Deployment Checklist

1. Export `.env` variables for the target environment.
2. Install dependencies (`npm ci`) and rebuild mediasoup.
3. Verify `firebase-service-account.json` is present.
4. Confirm MongoDB and Redis connectivity from the server.
5. Run database migrations/seeds if necessary (first boot runs `runAllSeeds()` automatically).
6. Start PM2 processes and confirm health (`pm2 status`).
7. Tail logs for a few minutes to ensure no uncaught exceptions occur.
8. Validate Socket.io and notifications (login from frontend, send a chat message, trigger a push notification).
9. Build the frontend for each tenant (`npm run build`) and upload the tenant-specific `dist` folder to its Nginx root.
10. Reload Nginx (`sudo systemctl reload nginx`) and verify subdomain routing for every company.

## Disaster Recovery

- Keep backups of MongoDB (Atlas snapshots or mongodump).
- Retain Redis snapshots if you rely on persistent queues.
- Store S3 bucket versions for document recovery.
- Maintain the ability to recreate `firebase-service-account.json`.
- Document `SUPERADMIN_SECRET_KEY` storage and rotation procedure.

## Scaling Considerations

- **Horizontal scaling** of the API requires sticky sessions or Redis-based socket adapters because Socket.io maintains state in-memory. Currently the platform runs as a single process per tenant.
- **Background workers** can be split into separate PM2 processes if queue volumes increase.
- **Database indexing** should be reviewed as data grows; Mongoose models define indexes for most lookups, but profile the slow queries routinely.

## Multi-Tenant Deployment Pattern

- **Separate PM2 Applications** – each company runs an isolated API process (`hcm-razor`, `hcm-razormar`, etc.). Only the `.env` (ports, DB URI, branding, secrets) differs.
- **Nginx Reverse Proxy** – for each tenant, configure a server block:

```nginx
server {
    server_name razorinfotech.humanmaximizer.com;

    root /var/www/razorinfotech/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:6006/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

- **Frontend Builds** – run `npm run build` for each tenant, copy the resulting `dist` to `/var/www/<tenant>` on the VPS, and ensure file ownership matches the Nginx user.
- **TLS Certificates** – issue per-subdomain certificates (Let’s Encrypt with certbot) to keep HTTPS valid for every tenant.
- **Monitoring per Tenant** – track PM2 processes individually (`pm2 logs hcm-razor`) and set up custom alerts if a single tenant crashes.

Despite separate deployments, all tenants run the same codebase, simplifying upgrades—pull the latest commit, rebuild, and restart each PM2 process with the tenant’s environment file.

With these operational practices the HCM platform remains reliable and observable across environments.

