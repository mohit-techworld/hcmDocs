---
title: Backup & Restore Component
sidebar_position: 3
---

# Backup & Restore Component (MS1 Client)

> **Note:** This is the **client-side React component** documentation. For the server-side API, see [MS1 Server - Backup & Restore API](../../ms1-server/modules/backup-restore).

## Overview

The Backup & Restore component (`components/backup-restore/BackupRestore.jsx`) provides a comprehensive admin interface for managing database backups and restores. It supports creating backups, restoring databases, configuring automated backups, and managing backup settings.

## Component Structure

```
╔═══════════════════════════════════════════════════════════════════════╗
║          BACKUP & RESTORE COMPONENT STRUCTURE                          ║
╚═══════════════════════════════════════════════════════════════════════╝

BackupRestore Component
│
├── 📊 Tab Navigation
│   ├── 💾 Backups Tab
│   ├── ⬇️ Restore Tab
│   ├── ⚙️ Settings Tab
│   └── 🔒 Admin Tab (Protected)
│
├── 💾 Backups Tab
│   ├── Company Selection
│   ├── Create Backup Section
│   │   ├── Company Selector
│   │   ├── Create Backup Button
│   │   └── Backup Status
│   │
│   └── Manage Backups Section
│       ├── Backup List
│       ├── Backup Details (Size, Date, Status)
│       ├── Delete Backup Button
│       └── View All Backups (All Companies)
│
├── ⬇️ Restore Tab
│   ├── Full Restore Section
│   │   ├── Company Selector
│   │   ├── Backup File Selector
│   │   ├── Restore Button
│   │   └── Confirmation Modal
│   │
│   └── Collection Restore Section
│       ├── Company Selector
│       ├── Backup File Selector
│       ├── Collection Selector (Multi-select)
│       ├── Restore Button
│       └── Confirmation Modal
│
├── ⚙️ Settings Tab
│   ├── Global Settings
│   │   ├── Auto-Backup Toggle
│   │   ├── Frequency Selector
│   │   ├── Backup Time Picker
│   │   ├── Timezone Selector
│   │   ├── Notification Settings
│   │   └── Save Button
│   │
│   └── Company-Specific Settings
│       ├── Company Selector
│       ├── Override Global Settings
│       └── Save Company Settings
│
└── 🔒 Admin Tab (Protected)
    ├── Admin Key Verification
    ├── Admin Backup Section
    ├── Admin Restore Section
    └── Admin Settings Section
```

## Key Features

### 1. Backup Management

**Create Backup:**
- Select company (by ID or subdomain)
- Click "Create Backup" button
- Real-time progress indicator
- Success/error notifications
- Backup appears in list immediately

**View Backups:**
- List all backups for selected company
- View backup details (size, date, checksum)
- Filter and search backups
- View backups from all companies

**Delete Backup:**
- Select backup to delete
- Confirmation dialog
- Deletes from both S3 and database
- Updates list immediately

### 2. Restore Operations

**Full Restore:**
- Select company
- Select backup file
- Click "Restore" button
- Confirmation required (safety measure)
- Progress indicator during restore
- Success notification

**Collection Restore:**
- Select company
- Select backup file
- Select collections to restore (multi-select)
- Click "Restore Collections"
- Confirmation required
- Only selected collections are restored

**Restore History:**
- View all restore operations
- See restore details (date, user, collections)
- Delete restore history records

### 3. Settings Management

**Global Settings:**
- Enable/disable auto-backup
- Set backup frequency (hourly, daily, weekly, monthly)
- Set backup time
- Configure timezone
- Email notification settings
- Retention policy

**Company-Specific Settings:**
- Override global settings per company
- Custom backup schedule for specific companies
- Company-specific notification emails

### 4. Admin Database Operations

**Protected Access:**
- Requires admin key verification
- Separate tab for admin operations
- Additional security layer

**Admin Backup:**
- Create backup of admin database
- List admin backups
- Delete admin backups

**Admin Restore:**
- Restore admin database
- Full restore only
- Requires confirmation

## Component Flow

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    COMPONENT INTERACTION FLOW                          ║
╚═══════════════════════════════════════════════════════════════════════╝

1. Component Mounts
   │
   ├──► Load Companies List
   │
   └──► Load Backup Settings (if on Settings tab)

2. Create Backup Flow
   │
   ├──► User Selects Company
   │
   ├──► User Clicks "Create Backup"
   │
   ├──► Show Loading State
   │
   ├──► API Call (POST /backup/:identifier)
   │
   ├──► Success → Show Success Message → Refresh Backup List
   │
   └──► Error → Show Error Message

3. Restore Flow
   │
   ├──► User Selects Company
   │
   ├──► User Selects Backup File
   │
   ├──► User Clicks "Restore"
   │
   ├──► Show Confirmation Modal
   │
   ├──► User Confirms
   │
   ├──► Show Loading State
   │
   ├──► API Call (POST /restore/:identifier)
   │
   ├──► Success → Show Success Message → Refresh History
   │
   └──► Error → Show Error Message

4. Settings Flow
   │
   ├──► User Changes Settings
   │
   ├──► User Clicks "Save"
   │
   ├──► API Call (POST /settings)
   │
   ├──► Success → Show Success Message
   │
   └──► Error → Show Error Message
```

## State Management

### Main State Structure

```javascript
{
  // Tab management
  activeTab: 'backups',  // 'backups', 'restore', 'settings', 'admin'
  
  // Company selection
  selectedCompany: null,
  companies: [],
  
  // Backup state
  backups: [],
  creatingBackup: false,
  backupSubTab: 'create',  // 'create' or 'manage'
  
  // Restore state
  restoreSubTab: 'full',  // 'full' or 'collections'
  backupFileName: '',
  collections: [],
  restoring: false,
  restoreHistory: [],
  
  // Settings state
  backupSettings: {
    autoBackupEnabled: false,
    frequency: 'daily',
    backupTime: '02:00',
    timezone: 'Asia/Kolkata',
    notifyOnSuccess: true,
    notifyOnFailure: true
  },
  
  // Admin state
  adminSubTab: 'backup',
  adminKeyVerified: false,
  adminBackups: [],
  
  // UI state
  loading: false,
  error: null,
  success: null
}
```

## API Integration

### Service: `services/backupRestoreApi.js`

The component uses the `backupRestoreApi` service:

**Key Methods:**

```javascript
// Create backup
backupRestoreApi.createBackup(identifier)

// List backups
backupRestoreApi.listBackups(identifier)
backupRestoreApi.listAllBackups()

// Restore operations
backupRestoreApi.restoreFromBackup(identifier, backupFileName, confirmRestore)
backupRestoreApi.restoreCollections(identifier, backupFileName, collections, confirmRestore)

// Delete backup
backupRestoreApi.deleteBackup(identifier, backupFileName)

// Settings
backupRestoreApi.getBackupSettings()
backupRestoreApi.saveBackupSettings(settings)
backupRestoreApi.getCompanyBackupSettings(identifier)
backupRestoreApi.saveCompanyBackupSettings(identifier, settings)

// Collections
backupRestoreApi.getCollections(identifier)

// Restore history
backupRestoreApi.getRestoreHistory(identifier)
backupRestoreApi.deleteRestoreHistory(identifier, index)

// Admin operations
backupRestoreApi.createAdminBackup(adminKey)
backupRestoreApi.listAdminBackups(adminKey)
backupRestoreApi.restoreAdminDatabase(adminKey, backupFileName, confirmRestore)
backupRestoreApi.deleteAdminBackup(adminKey, backupFileName)
```

## UI Components

### 1. Tab Navigation

**Tabs:**
- 💾 **Backups** - Create and manage backups
- ⬇️ **Restore** - Restore databases
- ⚙️ **Settings** - Configure backup settings
- 🔒 **Admin** - Admin database operations (protected)

### 2. Company Selector

**Features:**
- Search companies by name, ID, or subdomain
- Dropdown with all companies
- Shows company details (ID, subdomain, database name)

### 3. Backup List

**Features:**
- Table view of all backups
- Sortable columns (date, size)
- Backup details (file name, size, date, checksum)
- Delete action per backup
- Status indicators

### 4. Restore Confirmation Modal

**Features:**
- Warning message about data loss
- Shows backup details
- Requires explicit confirmation
- Cannot be dismissed accidentally

### 5. Settings Form

**Sections:**
- Auto-Backup Configuration
- Schedule Settings
- Notification Settings
- Retention Policy

## Usage Example

```jsx
import BackupRestore from './components/backup-restore/BackupRestore';

function App() {
  return (
    <div>
      <BackupRestore />
    </div>
  );
}
```

## Key Functions

### Backup Operations

```javascript
// Create backup
const handleCreateBackup = async () => {
  setCreatingBackup(true);
  try {
    const result = await createBackup(identifier);
    if (result.success) {
      setSuccess('Backup created successfully');
      await loadBackups(); // Refresh list
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setCreatingBackup(false);
  }
};

// Delete backup
const handleDeleteBackup = async (backupFileName) => {
  if (!confirm('Delete this backup?')) return;
  
  try {
    await deleteBackup(identifier, backupFileName);
    setSuccess('Backup deleted successfully');
    await loadBackups();
  } catch (error) {
    setError(error.message);
  }
};
```

### Restore Operations

```javascript
// Full restore
const handleRestore = async () => {
  if (!confirm('This will replace all data. Continue?')) return;
  
  setRestoring(true);
  try {
    const result = await restoreFromBackup(identifier, backupFileName, true);
    if (result.success) {
      setSuccess('Database restored successfully');
      await loadRestoreHistory();
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setRestoring(false);
  }
};

// Collection restore
const handleRestoreCollections = async () => {
  if (collections.length === 0) {
    setError('Please select at least one collection');
    return;
  }
  
  setRestoring(true);
  try {
    const result = await restoreCollections(identifier, backupFileName, collections, true);
    if (result.success) {
      setSuccess('Collections restored successfully');
      await loadRestoreHistory();
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setRestoring(false);
  }
};
```

### Settings Management

```javascript
// Save settings
const handleSaveSettings = async () => {
  try {
    await saveBackupSettings(backupSettings);
    setSuccess('Settings saved successfully');
  } catch (error) {
    setError(error.message);
  }
};

// Load settings
const loadSettings = async () => {
  try {
    const result = await getBackupSettings();
    setBackupSettings(result.data);
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
};
```

## Styling

The component uses Tailwind CSS with:
- Tab-based navigation
- Card-based layouts
- Color-coded status indicators
- Dark mode support
- Responsive design
- Loading states
- Error/success notifications

## Best Practices

1. **Always Confirm Restores** - Restore operations are destructive
2. **Check Backup Size** - Large backups take time
3. **Monitor Progress** - Show loading states during operations
4. **Handle Errors Gracefully** - Show clear error messages
5. **Refresh Data** - Update lists after operations
6. **Validate Inputs** - Check company selection, backup file, etc.

## Security Features

### Admin Tab Protection

- Requires admin key verification
- Separate authentication flow
- Additional security layer for admin operations

### Confirmation Dialogs

- All restore operations require confirmation
- Cannot be bypassed
- Clear warning messages

## Related Components

- `Dashboard` - Main dashboard with backup status
- `DatabaseManagement` - Database operations

## Related Services

- `backupRestoreApi` - API service for backup/restore operations
- `databaseApi` - Database management API

---

**Next Steps:**
- 📖 [MS1 Server - Backup & Restore API](../../ms1-server/modules/backup-restore)
- 🔧 [MS1 Client - Folder Structure](../folder-structure)
- 🎨 [MS1 Client - Components Overview](./overview)

