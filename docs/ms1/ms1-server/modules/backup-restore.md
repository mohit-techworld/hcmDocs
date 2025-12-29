---
title: Backup & Restore API
sidebar_position: 3
---

# Backup & Restore API (Server-Side)

> **Note:** This is the **server-side API documentation** for Backup & Restore. For the client-side React component, see [MS1 Client - Backup & Restore Component](../../ms1-client/components/backup-restore).

## Overview

The Backup & Restore API provides comprehensive database backup and restore functionality. It supports creating backups, restoring databases, managing backup settings, and automated scheduled backups.

## Core Features

- ✅ **Manual Backups** - Create backups on demand
- ✅ **Automated Backups** - Scheduled backups with configurable frequency
- ✅ **S3 Storage** - Backups stored securely in AWS S3
- ✅ **Full Restore** - Restore entire databases
- ✅ **Collection Restore** - Restore specific collections
- ✅ **Admin Database Backup** - Protected admin database operations
- ✅ **Backup History** - Track all backup operations
- ✅ **Restore History** - Track all restore operations
- ✅ **Settings Management** - Configure backup schedules and notifications

## Architecture

```
╔═══════════════════════════════════════════════════════════════════════╗
║              BACKUP & RESTORE ARCHITECTURE                            ║
╚═══════════════════════════════════════════════════════════════════════╝

Admin Request
    │
    ▼
BackupRestore Controller
    │
    ├──► MongoDB (mongodump/mongorestore)
    │         │
    │         └──► Database Operations
    │
    ├──► AWS S3 Client
    │         │
    │         └──► Upload/Download Backups
    │
    ├──► Backup Settings Model
    │         │
    │         └──► Schedule Configuration
    │
    └──► Backup Scheduler Service
              │
              └──► Automated Backups
```

## API Reference

**Base URL:** `/api/v1/backup-restore`

**Authentication:** All endpoints require `Authorization: Bearer <admin_token>` header

### Company Database Endpoints

#### Create Backup

```http
POST /api/v1/backup-restore/backup/:identifier
Authorization: Bearer <admin_token>
```

**Path Parameters:**
- `identifier` (required): Company ID or subdomain

**Response:**
```json
{
  "success": true,
  "message": "Backup created successfully",
  "data": {
    "companyId": 1234567890,
    "companyName": "Acme Corp",
    "dbName": "acme_corp_db",
    "backupFileName": "acme_corp_db_2024-12-15_14-30-45.archive.gz",
    "s3Key": "acme_corp_db/acme_corp_db_2024-12-15_14-30-45.archive.gz",
    "sizeMB": 125.5,
    "sizeBytes": 131596800,
    "checksum": "a1b2c3d4e5f6...",
    "createdAt": "2024-12-15T14:30:45.000Z",
    "createdBy": "admin@example.com"
  }
}
```

#### List Backups

```http
GET /api/v1/backup-restore/list/:identifier
Authorization: Bearer <admin_token>
```

**Path Parameters:**
- `identifier` (required): Company ID or subdomain

**Response:**
```json
{
  "success": true,
  "data": {
    "backups": [
      {
        "fileName": "acme_corp_db_2024-12-15_14-30-45.archive.gz",
        "s3Key": "acme_corp_db/acme_corp_db_2024-12-15_14-30-45.archive.gz",
        "sizeMB": 125.5,
        "sizeBytes": 131596800,
        "checksum": "a1b2c3d4e5f6...",
        "createdAt": "2024-12-15T14:30:45.000Z",
        "createdBy": "admin@example.com",
        "status": "completed"
      }
    ],
    "total": 5
  }
}
```

#### Restore Database

```http
POST /api/v1/backup-restore/restore/:identifier
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "backupFileName": "acme_corp_db_2024-12-15_14-30-45.archive.gz",
  "confirmRestore": true
}
```

**Request Body:**
- `backupFileName` (required): Name of backup file to restore
- `confirmRestore` (required): Must be `true` to proceed

**Response:**
```json
{
  "success": true,
  "message": "Database restored successfully from S3 backup",
  "data": {
    "companyId": 1234567890,
    "companyName": "Acme Corp",
    "dbName": "acme_corp_db",
    "backupFileName": "acme_corp_db_2024-12-15_14-30-45.archive.gz",
    "restoredAt": "2024-12-15T15:00:00.000Z",
    "restoredBy": "admin@example.com"
  }
}
```

#### Restore Collections

```http
POST /api/v1/backup-restore/restore-collections/:identifier
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "backupFileName": "acme_corp_db_2024-12-15_14-30-45.archive.gz",
  "collections": ["users", "tasks", "projects"],
  "confirmRestore": true
}
```

**Request Body:**
- `backupFileName` (required): Name of backup file
- `collections` (required): Array of collection names to restore
- `confirmRestore` (required): Must be `true`

#### Delete Backup

```http
DELETE /api/v1/backup-restore/:identifier/:backupFileName
Authorization: Bearer <admin_token>
```

**Path Parameters:**
- `identifier` (required): Company ID or subdomain
- `backupFileName` (required): Name of backup file to delete

**Response:**
```json
{
  "success": true,
  "message": "Backup deleted successfully"
}
```

#### Get Collections

```http
GET /api/v1/backup-restore/collections/:identifier
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "collections": [
      "users",
      "tasks",
      "projects",
      "departments"
    ]
  }
}
```

#### Get Restore History

```http
GET /api/v1/backup-restore/restore-history/:identifier
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "restoreHistory": [
      {
        "restoreType": "full",
        "backupFileName": "acme_corp_db_2024-12-15_14-30-45.archive.gz",
        "collections": [],
        "restoredAt": "2024-12-15T15:00:00.000Z",
        "restoredBy": "admin@example.com",
        "status": "success"
      }
    ]
  }
}
```

### Backup Settings Endpoints

#### Get Backup Settings

```http
GET /api/v1/backup-restore/settings
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "autoBackupEnabled": true,
    "frequency": "daily",
    "backupTime": "02:00",
    "timezone": "Asia/Kolkata",
    "notifyOnSuccess": true,
    "notifyOnFailure": true,
    "notificationEmail": "admin@example.com"
  }
}
```

#### Save Backup Settings

```http
POST /api/v1/backup-restore/settings
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "autoBackupEnabled": true,
  "frequency": "daily",
  "backupTime": "02:00",
  "timezone": "Asia/Kolkata",
  "notifyOnSuccess": true,
  "notifyOnFailure": true,
  "notificationEmail": "admin@example.com"
}
```

#### Get Company Backup Settings

```http
GET /api/v1/backup-restore/settings/:identifier
Authorization: Bearer <admin_token>
```

#### Save Company Backup Settings

```http
POST /api/v1/backup-restore/settings/:identifier
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "autoBackupEnabled": true,
  "frequency": "weekly",
  "backupTime": "03:00"
}
```

### Admin Database Endpoints (Protected)

#### Verify Admin Key

```http
POST /api/v1/backup-restore/admin/verify-key
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "adminKey": "your_admin_backup_key"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin key verified"
}
```

#### Create Admin Backup

```http
POST /api/v1/backup-restore/admin/backup
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "adminKey": "your_admin_backup_key"
}
```

#### List Admin Backups

```http
POST /api/v1/backup-restore/admin/list
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "adminKey": "your_admin_backup_key"
}
```

#### Restore Admin Database

```http
POST /api/v1/backup-restore/admin/restore
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "adminKey": "your_admin_backup_key",
  "backupFileName": "admin_db_2024-12-15.archive.gz",
  "confirmRestore": true
}
```

## Models

### BackupSettings Model

```javascript
{
  companyId: Number (optional, null for global),
  subdomain: String (optional),
  autoBackupEnabled: Boolean,
  frequency: Enum ['hourly', 'daily', 'weekly', 'monthly', 'custom'],
  backupTime: String (HH:mm format),
  timezone: String,
  notifyOnSuccess: Boolean,
  notifyOnFailure: Boolean,
  notificationEmail: String,
  deletionPolicy: {
    enabled: Boolean,
    keepLast: Number,
    olderThanDays: Number
  }
}
```

### Tenant Model (Backup History)

Backup history is stored in the Tenant model:

```javascript
{
  backupHistory: [{
    fileName: String,
    s3Key: String,
    sizeMB: Number,
    sizeBytes: Number,
    checksum: String,
    createdAt: Date,
    createdBy: String,
    status: Enum ['completed', 'failed', 'restored'],
    restoredAt: Date,
    restoredBy: String
  }],
  restoreHistory: [{
    restoreType: Enum ['full', 'collections'],
    backupFileName: String,
    collections: [String],
    restoredAt: Date,
    restoredBy: String,
    status: Enum ['success', 'failed'],
    errorMessage: String
  }]
}
```

## Controllers

### `controller/backupRestore.controller.js`

**Key Methods:**

1. **`backupDatabase`** - Create backup for company database
2. **`restoreDatabase`** - Restore full database from backup
3. **`restoreCollections`** - Restore specific collections
4. **`listBackups`** - List all backups for a company
5. **`deleteBackup`** - Delete backup from S3 and database
6. **`getCollections`** - Get list of collections in database
7. **`getRestoreHistory`** - Get restore history for company
8. **`getBackupSettings`** - Get global backup settings
9. **`saveBackupSettings`** - Save global backup settings
10. **`backupAdminDatabase`** - Create admin database backup
11. **`restoreAdminDatabase`** - Restore admin database

## Routes

### `routes/backupRestore.routes.js`

**Route Structure:**
```
POST   /backup/:identifier
POST   /restore/:identifier
POST   /restore-collections/:identifier
GET    /list/:identifier
GET    /collections/:identifier
GET    /restore-history/:identifier
DELETE /:identifier/:backupFileName

GET    /settings
POST   /settings
GET    /settings/:identifier
POST   /settings/:identifier
DELETE /settings/:identifier

POST   /admin/verify-key
POST   /admin/backup
POST   /admin/list
POST   /admin/restore
DELETE /admin/backup
POST   /admin/settings
POST   /admin/settings/save
POST   /admin/collections
POST   /admin/restore-collections
```

## AWS S3 Configuration

### Required Environment Variables

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=hcm-dbbackup
AWS_S3_PREFIX=  # Optional prefix
```

### S3 Bucket Structure

```
s3://hcm-dbbackup/
  └── {dbName}/
      └── {dbName}_{timestamp}.archive.gz
```

### IAM Permissions Required

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:HeadObject"
      ],
      "Resource": [
        "arn:aws:s3:::hcm-dbbackup/*",
        "arn:aws:s3:::hcm-dbbackup"
      ]
    }
  ]
}
```

## Backup Process

### Step-by-Step Backup Flow

1. **Receive Request** - Controller receives backup request
2. **Validate** - Check company exists and database is set up
3. **Create Temp Directory** - Create temporary backup location
4. **Run mongodump** - Execute MongoDB dump command
5. **Compress** - Gzip the backup archive
6. **Calculate Checksum** - Generate MD5 checksum
7. **Upload to S3** - Upload backup file to AWS S3
8. **Verify Upload** - Confirm file uploaded successfully
9. **Save Metadata** - Store backup info in database
10. **Cleanup** - Delete temporary files

## Restore Process

### Step-by-Step Restore Flow

1. **Receive Request** - Controller receives restore request
2. **Validate** - Check backup exists and confirm flag is set
3. **Download from S3** - Download backup file to temp location
4. **Verify File** - Check file integrity and size
5. **Run mongorestore** - Execute MongoDB restore command
6. **Update History** - Save restore operation to history
7. **Update Backup Status** - Mark backup as restored
8. **Cleanup** - Delete temporary files

## Automated Backups

### Backup Scheduler Service

The `services/backupScheduler.service.js` handles automated backups:

- **Scheduled Execution** - Runs backups based on configured schedule
- **Multi-Company Support** - Can backup multiple companies
- **Email Notifications** - Sends success/failure emails
- **Error Handling** - Logs errors and continues with other companies

### Schedule Configuration

```javascript
{
  frequency: 'daily',        // hourly, daily, weekly, monthly, custom
  backupTime: '02:00',      // HH:mm format
  timezone: 'Asia/Kolkata',
  daysOfWeek: ['monday', 'wednesday', 'friday']  // For weekly
}
```

## Error Handling

### Common Errors

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Company database is not yet setup"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Backup file not found in S3"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Backup creation failed",
  "error": "mongodump failed: connection refused"
}
```

## Security Considerations

1. **Admin Authentication** - All endpoints require admin token
2. **Admin Key Protection** - Admin database operations require additional key
3. **Confirmation Required** - Restore operations require explicit confirmation
4. **S3 Access Control** - Backups stored with proper IAM permissions
5. **Checksum Verification** - All backups verified for integrity

## Best Practices

1. **Regular Backups** - Set up automated daily backups
2. **Test Restores** - Periodically test restore operations
3. **Monitor S3 Storage** - Keep track of backup storage usage
4. **Retention Policy** - Configure backup retention to manage storage
5. **Email Notifications** - Enable notifications for backup status
6. **Document Restores** - Always document restore operations

## Related Documentation

- 📖 [Backup & Restore Overview](../modules/backup-restore-overview)
- 🎨 [MS1 Client - Backup & Restore Component](../../ms1-client/components/backup-restore)
- 🔧 [MS1 Server Setup](../setup) - AWS S3 configuration
- 📚 [Backup Settings Model](../../../ms1-server/modules/backup-restore#backup-settings)

---

**This API provides complete backup and restore functionality for the MS1 system.**

