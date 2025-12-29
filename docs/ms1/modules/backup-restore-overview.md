---
title: Backup & Restore - Overview
sidebar_position: 3
---

# Backup & Restore - Complete Guide

The Backup & Restore system provides comprehensive database backup and restore functionality for both company databases and the admin database. It supports automated backups, scheduled backups, and flexible restore options.

## How It Works Together

```
╔═══════════════════════════════════════════════════════════════════════╗
║          BACKUP & RESTORE - SERVER & CLIENT FLOW                       ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│  🖥️  MS1 CLIENT (Frontend)                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  💾 BackupRestore Component                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Create backups                                    │   │   │
│  │  │ • List backups                                      │   │   │
│  │  │ • Restore databases                                  │   │   │
│  │  │ • Restore collections                                │   │   │
│  │  │ • Configure auto-backup                              │   │   │
│  │  │ • Admin database backup/restore                      │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  📡 API Calls via backupRestoreApi                        │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ POST   /api/v1/backup-restore/backup/:identifier   │   │   │
│  │  │ GET    /api/v1/backup-restore/list/:identifier     │   │   │
│  │  │ POST   /api/v1/backup-restore/restore/:identifier  │   │   │
│  │  │ ...                                                  │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│                          ⬇️ HTTP Requests                            │
│                                                                      │
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️  MS1 SERVER (Backend)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  🎮 BackupRestore Controller                                │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • backupDatabase()                                   │   │   │
│  │  │ • restoreDatabase()                                  │   │   │
│  │  │ • listBackups()                                      │   │   │
│  │  │ • deleteBackup()                                     │   │   │
│  │  │ • getBackupSettings()                                │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  💾 MongoDB Operations                                     │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • mongodump (create backup)                          │   │   │
│  │  │ • mongorestore (restore backup)                      │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  ☁️  AWS S3 Storage                                        │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Upload backups to S3                              │   │   │
│  │  │ • Download backups from S3                          │   │   │
│  │  │ • Delete backups from S3                            │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  ⏰ Backup Scheduler                                        │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ • Automated backups                                 │   │   │
│  │  │ • Scheduled backups                                 │   │   │
│  │  │ • Email notifications                                │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Complete Workflow

### 1. Create Backup

```
Admin → MS1 Client UI → Select Company → Click "Create Backup" → API Call → MS1 Server → mongodump → Upload to S3 → Save Metadata → UI Update
```

**Steps:**
1. Admin opens Backup & Restore page
2. Selects a company (by ID or subdomain)
3. Clicks "Create Backup"
4. MS1 Server runs `mongodump` command
5. Backup file is compressed (gzip)
6. Uploaded to AWS S3
7. Metadata saved to database
8. UI shows new backup in list

### 2. Restore Database

```
Admin → Select Backup → Click "Restore" → Confirm → API Call → MS1 Server → Download from S3 → mongorestore → Database Restored → UI Update
```

**Steps:**
1. Admin selects a backup file
2. Clicks "Restore"
3. Confirms the restore operation
4. MS1 Server downloads backup from S3
5. Runs `mongorestore` command
6. Database is restored
7. Restore history is saved
8. UI shows success message

## Documentation Structure

To understand Backup & Restore completely, read in this order:

### 1. **Start Here** → [Backup & Restore Overview](./backup-restore-overview) (this page)
   - Understand the complete system
   - See how server and client work together
   - Learn the overall workflow

### 2. **Backend Implementation** → [MS1 Server - Backup & Restore API](../ms1-server/modules/backup-restore) *(Server-Side/API)*
   - API endpoints and routes
   - Backup/restore operations
   - S3 integration
   - Scheduled backups
   - **Note:** This is the server-side API that handles all backend operations

### 3. **Frontend Implementation** → [MS1 Client - Backup & Restore Component](../ms1-client/components/backup-restore) *(Client-Side)*
   - React component structure
   - UI components and features
   - Backup management interface
   - Settings configuration
   - **Note:** This is the client-side React component that provides the UI

## Key Features

### Backup Features
- ✅ **Manual Backups** - Create backups on demand
- ✅ **Automated Backups** - Scheduled backups (hourly, daily, weekly, monthly)
- ✅ **S3 Storage** - Backups stored securely in AWS S3
- ✅ **Compression** - Backups are gzipped to save space
- ✅ **Metadata Tracking** - Backup history and details stored
- ✅ **Checksum Verification** - MD5 checksums for integrity

### Restore Features
- ✅ **Full Restore** - Restore entire database
- ✅ **Collection Restore** - Restore specific collections only
- ✅ **Admin Database Restore** - Restore admin database (protected)
- ✅ **Restore History** - Track all restore operations
- ✅ **Confirmation Required** - Safety confirmation before restore

### Settings Features
- ✅ **Auto-Backup Configuration** - Enable/disable automated backups
- ✅ **Schedule Configuration** - Set backup frequency and times
- ✅ **Notification Settings** - Email notifications on success/failure
- ✅ **Retention Policy** - Configure backup retention rules

## Quick Reference

| Task | Server Side | Client Side |
|------|-------------|------------|
| Create backup | `backupDatabase()` controller | Create backup button |
| List backups | `listBackups()` controller | Backup list display |
| Restore database | `restoreDatabase()` controller | Restore button |
| Configure settings | `saveBackupSettings()` controller | Settings form |
| Admin backup | `backupAdminDatabase()` controller | Admin tab (protected) |

## Integration Points

### AWS S3 Integration
- Backups are uploaded directly to S3
- No local storage required
- Automatic cleanup of temporary files
- S3 bucket structure: `{dbName}/{backupFileName}`

### MongoDB Integration
- Uses `mongodump` for backups
- Uses `mongorestore` for restores
- Supports gzip compression
- Handles authentication

### Email Notifications
- Backup success notifications
- Backup failure notifications
- Restore completion notifications
- Configurable email recipients

## Security Features

### Admin Database Protection
- Requires admin key verification
- Separate endpoints for admin operations
- Additional security layer

### Backup Verification
- MD5 checksum calculation
- File size verification
- S3 upload verification
- Gzip format validation

## Next Steps

1. 📖 Read [MS1 Server - Backup & Restore API](../ms1-server/modules/backup-restore) for backend details
2. 🎨 Read [MS1 Client - Backup & Restore Component](../ms1-client/components/backup-restore) for frontend details
3. 🔧 Check [MS1 Server Setup](../ms1-server/setup) for AWS S3 configuration
4. ⚙️ See [Backup Settings](../ms1-server/modules/backup-restore#backup-settings) for configuration

---

**This unified view helps you understand how the server and client work together to provide complete Backup & Restore functionality.**

