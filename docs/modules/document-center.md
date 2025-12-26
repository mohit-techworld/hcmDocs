# Document Center Module Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Module Structure](#module-structure)
4. [Pages & Components](#pages--components)
5. [User Roles & Permissions](#user-roles--permissions)
6. [API Endpoints](#api-endpoints)
7. [User Flows](#user-flows)
8. [Technical Details](#technical-details)
9. [Usage Guide](#usage-guide)
10. [Templates](#templates)

---

## Overview

The **Document Center Module** is a comprehensive document management system designed for creating, managing, sharing, and tracking employment-related documents. It enables HR teams to generate professional documents using templates, send them via email, track recipient status, and manage document sharing across the organization.

### Key Objectives
- Create professional employment documents using pre-built templates
- Send documents via email with attachments
- Track document viewing and acknowledgment status
- Share documents with specific employees or teams
- Manage letterhead branding
- Monitor document delivery and engagement
- Track onboarding document status

---

## Features

### 1. **Document Creation (DocumentCenter.jsx)**
- **Template Selection**: Choose from 7 pre-built document templates
- **Employee Selection**: Search and select employees from the organization
- **Variable Customization**: Edit template variables (name, designation, dates, etc.)
- **Content Editing**: Edit document content in plain text or HTML
- **Letterhead Integration**: Automatic letterhead inclusion in documents
- **Multi-page Support**: Automatic page splitting for long documents
- **Preview**: Real-time document preview with page indicators
- **Email Sending**: Send documents directly via email with attachments
- **Print Support**: Print preview functionality

### 2. **Document Management (DocumentCenterPage.jsx)**
- **Document Listing**: View all documents with pagination
- **Advanced Filtering**: 
  - Search by title, description, or tags
  - Filter by category
  - Filter by document type (payslip, policy, form, letter, certificate, report, other)
- **Sorting**: Sort by upload date, title, category, or file size
- **Document Sharing**: Share documents with specific users
- **Notifications**: View document share notifications
- **Acknowledgment Tracking**: Track document acknowledgment status
- **Document Preview**: Preview documents in new tab
- **Quick Stats**: View document statistics

### 3. **Document Preview (DocumentPreview.jsx)**
- **Automatic Preview**: Opens document preview in new tab
- **Loading States**: Visual feedback during document loading
- **Error Handling**: Graceful error handling with user feedback
- **Auto-redirect**: Returns to document center after preview

### 4. **Letterhead Management (LetterHeadUpload.jsx)**
- **Upload Letterhead**: Upload company letterhead (PNG, JPG, JPEG, PDF)
- **Preview**: Preview uploaded letterhead
- **Auto-loading**: Automatically loads existing letterhead on page load
- **Error Handling**: Handles CORS and loading errors gracefully

### 5. **Mail Recipient Status (StatusDocument.jsx)**
- **Status Tracking**: View all mail recipients and their status
- **Search Functionality**: Search by name, email, or document type
- **Status Indicators**: 
  - Viewed status
  - Acknowledged status
  - Sent timestamp
- **Pagination**: Navigate through recipient records

### 6. **Recent Onboards (RecentOboard.jsx)**
- **Onboarding List**: View recently onboarded employees
- **Document Status**: Track document status for each onboard
- **Search**: Search by name, email, or designation
- **Status Badges**: Visual status indicators (Pending, Sent, Viewed)
- **Quick Navigation**: Link to document center for pending documents

---

## Module Structure

```
src/
├── pages/
│   ├── DocumentCenter.jsx              # Document creation page
│   ├── DocumentCenterPage.jsx          # Document listing & management
│   ├── DocumentPreview.jsx             # Document preview page
│   ├── LetterHeadUpload.jsx           # Letterhead management
│   ├── StatusDocument.jsx              # Mail recipient status
│   └── RecentOboard.jsx                # Recent onboardings
├── components/DocumentCenter/
│   ├── DocumentCenterTable.jsx        # Document listing table
│   ├── DocumentShareModal.jsx         # Share document modal
│   ├── DocumentShareNotifications.jsx # Share notifications
│   ├── UserSharedDocuments.jsx        # User's shared documents
│   ├── MailRecipientTable.jsx         # Mail recipient table
│   ├── UserViewStatusTable.jsx        # User view status
│   ├── NotificationPopupModal.jsx     # Notification popup
│   └── SentMailsTable.jsx             # Sent mails table
├── hooks/
│   ├── useDocumentCenter.js           # Document center hooks
│   └── useDocumentSharing.js          # Document sharing hooks
└── assets/Mail-Templates/
    └── Templates.js                   # Document templates
```

---

## Pages & Components

### 1. DocumentCenter.jsx

**Purpose**: Create and send employment documents using templates.

**Key Features**:
- Employee search and selection
- Template selection (7 templates)
- Variable customization
- Content editing (HTML/plain text)
- Multi-page document preview
- Email sending with attachments
- Letterhead integration

**State Management**:
```javascript
- employees: Array of all employees
- filteredUsers: Filtered employee list
- selectedEmployee: Currently selected employee
- selectedTemplate: Selected template type
- templateHtml: Generated HTML content
- templateText: Plain text version
- placeholderValues: Template variable values
- attachments: File attachments
- letterheadUrl: Letterhead image URL
```

**Key Functions**:
- `fillTemplate()`: Fills template with user data
- `getTemplateData()`: Extracts template data from user object
- `splitHtmlIntoPages()`: Splits long documents into pages
- `handleSendMail()`: Sends document via email
- `htmlToPlain()`: Converts HTML to plain text
- `plainToHtml()`: Converts plain text to HTML

**Template Variables**:
- `Name`, `EmployeeName`, `CandidateName`
- `Designation`, `JobTitle`
- `DepartmentName`, `CompanyName`
- `JoiningDate`, `LastWorkingDay`, `Date`
- `Location`, `NoticePeriod`
- `ContactAddress`
- `SenderName`, `SenderDesignation`
- `AuthorizedSignatoryName`, `SignatoryDesignation`, `SignatoryContact`
- `PronounPossessive`, `PronounObjective` (gender-based)

### 2. DocumentCenterPage.jsx

**Purpose**: Main document management interface for viewing, sharing, and managing documents.

**Key Features**:
- Document listing with pagination
- Advanced filtering and sorting
- Document sharing
- Notification management
- Document acknowledgment
- Quick stats sidebar

**State Management**:
```javascript
- documents: Array of documents
- categories: Available categories
- searchTerm: Search filter
- selectedCategory: Category filter
- selectedDocumentType: Document type filter
- sortBy: Sort field
- sortOrder: Sort direction
- currentPage: Current page number
- pagination: Pagination metadata
- showShareModal: Share modal visibility
- selectedDocument: Document to share
- showNotifications: Notification sidebar visibility
```

**Key Functions**:
- `loadDocuments()`: Fetches documents with filters
- `handleShareDocument()`: Opens share modal
- `handleAcknowledgeDocument()`: Acknowledges document
- `handleViewDocument()`: Opens document preview
- `clearFilters()`: Resets all filters

### 3. DocumentPreview.jsx

**Purpose**: Handles document preview functionality.

**Key Features**:
- Automatic preview opening
- Loading states
- Error handling
- Auto-redirect after preview

**State Management**:
```javascript
- loading: Loading state
- opened: Preview opened state
```

**Key Functions**:
- `fetchPreview()`: Fetches preview URL and opens in new tab

### 4. LetterHeadUpload.jsx

**Purpose**: Manages company letterhead upload and display.

**Key Features**:
- File upload (PNG, JPG, JPEG, PDF)
- Image preview
- Error handling for CORS issues
- Auto-load existing letterhead

**State Management**:
```javascript
- file: Uploaded file URL
- loading: Upload state
- imageError: Image loading error
- imageLoading: Image loading state
```

**Key Functions**:
- `handleFileChange()`: Handles file upload
- `fetchExistingLetterhead()`: Loads existing letterhead
- `handleRemove()`: Removes letterhead

### 5. StatusDocument.jsx

**Purpose**: Tracks mail recipient status for sent documents.

**Key Features**:
- Mail recipient listing
- Search functionality
- Status indicators (Viewed, Acknowledged)
- Pagination

**State Management**:
```javascript
- mailRecipients: Array of mail recipients
- search: Search term
- page: Current page
```

**Key Functions**:
- `fetchMailRecipients()`: Loads mail recipients
- `formatDate()`: Formats date for display

### 6. RecentOboard.jsx

**Purpose**: Displays recently onboarded employees with document status.

**Key Features**:
- Recent onboard listing
- Document status tracking
- Search functionality
- Status badges (Pending, Sent, Viewed)
- Navigation to document center

**State Management**:
```javascript
- search: Search term
- mailRecipients: Mail recipient data
- page: Current page
- hiringDetails: Onboarding data
```

**Key Functions**:
- `getDocumentStatus()`: Determines document status
- `getStatusBadge()`: Returns status badge component
- `extractEmail()`: Extracts email from employee data

---

## User Roles & Permissions

### Roles

1. **HR/Admin**
   - Full access to all features
   - Can create documents
   - Can upload letterhead
   - Can share documents
   - Can view all mail recipients
   - Can manage document center

2. **Manager**
   - Can view shared documents
   - Can acknowledge documents
   - Can preview documents
   - Limited document creation (if permitted)

3. **Employee**
   - Can view shared documents
   - Can acknowledge documents
   - Can preview documents
   - Cannot create or share documents

### Permission Checks

- Document upload: `currentUser?.role === "admin" || currentUser?.role === "hr"`
- Document sharing: Based on document ownership and permissions
- Letterhead upload: Admin/HR only

---

## API Endpoints

### Base Path: `/document-center`

#### Document Management

**Get Documents**
```
GET /document-center/documents
Query Parameters:
  - page: Page number
  - limit: Items per page
  - search: Search term
  - category: Category slug
  - documentType: Document type
  - sortBy: Sort field (uploadedAt, title, category, fileSize)
  - sortOrder: Sort direction (asc, desc)
```

**Get Document Preview**
```
GET /document-center/documents/:id/preview
Response: { success: boolean, data: { previewUrl: string } }
```

**Upload Document**
```
POST /document-center/upload
Content-Type: multipart/form-data
Body:
  - file: File
  - title: string
  - description: string
  - category: string
  - documentType: string
  - tags: string[]
```

**Delete Document**
```
DELETE /document-center/documents/:id
```

**Download Document**
```
GET /document-center/documents/:id/download
```

#### Document Sharing

**Share Document**
```
POST /document-center/share-document
Body:
{
  documentId: string,
  recipientIds: string[],
  message: string,
  shareMethod: 'notification' | 'email',
  sendEmail: boolean
}
```

**Get Share Notifications**
```
GET /document-center/share-notifications
```

**Acknowledge Document Share**
```
POST /document-center/share-notifications/:notificationId/acknowledge
```

#### Document Sending

**Send Document via Email**
```
POST /document-center/send-document
Content-Type: multipart/form-data
Body:
  - to: string (email)
  - email: string (email)
  - subject: string
  - content: string (HTML)
  - templateType: string
  - data: string (JSON)
  - attachments: File[]
```

#### Letterhead Management

**Upload Letterhead**
```
POST /document-center/upload-letterhead
Content-Type: multipart/form-data
Body:
  - file: File (PNG, JPG, JPEG, PDF)
Response: { success: boolean, data: { Url: string } }
```

**Get Letterhead**
```
GET /document-center/get-letterhead
Response: { success: boolean, data: { Url: string } }
```

#### Mail Recipients

**Get Mail Recipients**
```
GET /document-center/mail-recipients
Response: { data: Array<{ name, email, documentType, viewedAt, acknowledgedAt, sentAt }> }
```

#### Categories

**Get Categories**
```
GET /document-center/categories
Response: { success: boolean, data: Array<{ _id, name, slug }> }
```

---

## User Flows

### Flow 1: Creating and Sending a Document

1. Navigate to **Document Center** (DocumentCenter.jsx)
2. **Search and Select Employee**:
   - Use search bar to find employee
   - Click on employee card to select
3. **Select Template**:
   - Choose from available templates (Letter of Intent, Appointment Letter, etc.)
4. **Customize Variables** (Optional):
   - Expand "Template Variables" section
   - Edit variable values as needed
5. **Edit Content** (Optional):
   - Edit document content in text area
   - Changes are reflected in preview
6. **Add Attachments** (Optional):
   - Click file input to add attachments
7. **Preview Document**:
   - Review document in preview section
   - Check page count and formatting
8. **Send Document**:
   - Click "Send Document" button
   - Document is sent via email to employee
   - Success notification appears

### Flow 2: Sharing a Document

1. Navigate to **Document Center** (DocumentCenterPage.jsx)
2. **Find Document**:
   - Use search or filters to find document
3. **Share Document**:
   - Click share icon on document row
   - Share modal opens
4. **Select Recipients**:
   - Search and select employees
   - Add optional message
5. **Choose Share Method**:
   - Notification only
   - Email notification
6. **Confirm Share**:
   - Click share button
   - Recipients receive notification/email

### Flow 3: Viewing and Acknowledging Shared Documents

1. **View Notifications**:
   - Click bell icon in header
   - Notification sidebar opens
2. **View Document**:
   - Click on notification
   - Document preview opens in new tab
3. **Acknowledge Document**:
   - Click acknowledge button
   - Status updates to acknowledged
   - Notification disappears

### Flow 4: Uploading Letterhead

1. Navigate to **Letterhead Upload** page
2. **Upload File**:
   - Click upload area or drag & drop
   - Select PNG, JPG, JPEG, or PDF file
3. **Preview**:
   - Letterhead preview appears
   - Verify appearance
4. **Auto-Application**:
   - Letterhead automatically applied to all new documents
   - Appears in document preview

### Flow 5: Tracking Mail Recipient Status

1. Navigate to **Mail Recipients Status** page
2. **View Recipients**:
   - See all mail recipients in table
3. **Search** (Optional):
   - Search by name, email, or document type
4. **Check Status**:
   - View "Viewed" status (green checkmark if viewed)
   - View "Acknowledged" status (green checkmark if acknowledged)
   - View "Sent At" timestamp
5. **Navigate Pages**:
   - Use pagination to view more recipients

### Flow 6: Checking Onboarding Document Status

1. Navigate to **Recent Onboards** page
2. **View Onboards**:
   - See recently onboarded employees
3. **Search** (Optional):
   - Search by name, email, or designation
4. **Check Document Status**:
   - **Pending** (Yellow): Document not sent - click to go to document center
   - **Sent** (Green): Document sent successfully
   - **Viewed** (Blue): Document viewed by employee
5. **Take Action**:
   - Click "Pending" badge to create and send document

---

## Technical Details

### Technologies Used

- **React**: Frontend framework
- **React Router**: Routing
- **Axios**: HTTP client
- **React Hot Toast**: Notifications
- **Custom Hooks**: `useDocumentCenter`, `useDocumentSharing`
- **File Upload**: FormData for multipart uploads
- **HTML Parsing**: Custom HTML to plain text conversion

### Data Structures

#### Document Object
```javascript
{
  _id: string,
  title: string,
  description: string,
  fileUrl: string,
  fileExtension: string,
  fileSize: number,
  category: {
    _id: string,
    name: string,
    slug: string
  },
  documentType: string,
  uploadedAt: string,
  uploadedBy: {
    _id: string,
    name: string
  },
  userAcknowledgmentStatus: {
    isShared: boolean,
    isAcknowledged: boolean,
    acknowledgedAt: string
  }
}
```

#### Mail Recipient Object
```javascript
{
  name: string,
  email: string,
  documentType: string,
  viewedAt: string | null,
  acknowledgedAt: string | null,
  sentAt: string
}
```

#### Template Data Object
```javascript
{
  Name: string,
  EmployeeName: string,
  CandidateName: string,
  Designation: string,
  JobTitle: string,
  DepartmentName: string,
  CompanyName: string,
  JoiningDate: string,
  LastWorkingDay: string,
  Date: string,
  Location: string,
  NoticePeriod: string,
  ContactAddress: string,
  SenderName: string,
  SenderDesignation: string,
  AuthorizedSignatoryName: string,
  SignatoryDesignation: string,
  SignatoryContact: string,
  PronounPossessive: string,
  PronounObjective: string
}
```

### State Management Patterns

1. **Local State**: Components use React `useState` for local state
2. **Custom Hooks**: Reusable logic in `useDocumentCenter` and `useDocumentSharing`
3. **API Calls**: Centralized in hooks with error handling
4. **Caching**: Letterhead URL cached in component state

### Performance Optimizations

1. **Debounced Search**: Search inputs debounced (200-300ms)
2. **Pagination**: Documents loaded in pages (10 per page)
3. **Lazy Loading**: Components loaded on demand
4. **Memoization**: Expensive calculations memoized
5. **Image Optimization**: Letterhead images optimized for display

### Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- Adaptive layouts for tables and grids
- Touch-friendly interactions

### Dark Mode Support

- All components support dark mode
- Uses Tailwind CSS dark mode classes
- Consistent color scheme across components

---

## Usage Guide

### For HR/Admin Users

#### Creating a Document

1. **Navigate to Document Center**
   - Go to Dashboard → Document Center
2. **Select Employee**
   - Use search to find employee
   - Click employee card
3. **Choose Template**
   - Select appropriate template
4. **Customize** (if needed):
   - Edit template variables
   - Modify content
   - Add attachments
5. **Preview**
   - Review document appearance
   - Check page count
6. **Send**
   - Click "Send Document"
   - Document sent via email

#### Managing Documents

1. **View Documents**
   - Navigate to Document Center page
   - Use filters to find specific documents
2. **Share Documents**
   - Click share icon
   - Select recipients
   - Choose share method
3. **Track Status**
   - View mail recipient status
   - Check acknowledgment status
4. **Upload Letterhead**
   - Navigate to Letterhead Upload
   - Upload company letterhead
   - Verify preview

#### Tracking Onboarding Documents

1. **View Recent Onboards**
   - Navigate to Recent Onboards page
2. **Check Status**
   - Identify pending documents
3. **Create Documents**
   - Click "Pending" badge
   - Create and send document

### For Employees

#### Viewing Shared Documents

1. **Check Notifications**
   - Click bell icon
   - View document notifications
2. **Open Document**
   - Click notification
   - Document opens in new tab
3. **Acknowledge**
   - Click acknowledge button
   - Status updates

#### Viewing Personal Documents

1. **Navigate to Document Center**
2. **View Shared Documents**
   - Check sidebar for shared documents
3. **Preview Documents**
   - Click preview icon
   - Document opens in new tab

---

## Templates

### Available Templates

1. **Letter of Intent** (`LetterTemplate`)
   - Purpose: Job offer intent letter
   - Icon: 📝

2. **Appointment Letter** (`AppointmentLetter`)
   - Purpose: Official appointment confirmation
   - Icon: 📋

3. **Confirmation Letter** (`ConfirmationLetter`)
   - Purpose: Employment confirmation after probation
   - Icon: ✅

4. **Offer Letter** (`OfferLetter`)
   - Purpose: Job offer letter
   - Icon: 💼

5. **Increment Letter** (`IncrementLetter`)
   - Purpose: Salary increment notification
   - Icon: 📈

6. **Internship Letter** (`InternshipLetter`)
   - Purpose: Internship certificate/letter
   - Icon: 🎓

7. **Placement Service Agreement** (`PlacementServiceAgreement`)
   - Purpose: Placement service agreement
   - Icon: 🤝

### Template Variables

All templates support these variables (automatically filled from employee data):

- **Name Variables**: `Name`, `EmployeeName`, `CandidateName`
- **Job Details**: `Designation`, `JobTitle`, `DepartmentName`
- **Company Info**: `CompanyName`, `Location`
- **Dates**: `JoiningDate`, `LastWorkingDay`, `Date`
- **Contact**: `ContactAddress`
- **Sender Info**: `SenderName`, `SenderDesignation`
- **Signatory**: `AuthorizedSignatoryName`, `SignatoryDesignation`, `SignatoryContact`
- **Pronouns**: `PronounPossessive`, `PronounObjective` (auto-determined by gender)

### Template Customization

Templates use placeholder syntax: `{VariableName}`

Example:
```
Dear {Name},

We are pleased to offer you the position of {Designation}...

Sincerely,
{SenderName}
{SenderDesignation}
```

---

## Best Practices

### For HR/Admin

1. **Template Usage**:
   - Use appropriate template for each document type
   - Verify all variables are correctly filled
   - Review preview before sending

2. **Document Management**:
   - Use descriptive titles and categories
   - Add tags for better searchability
   - Regularly review shared documents

3. **Letterhead**:
   - Use high-quality letterhead image
   - Ensure proper dimensions (recommended: 800x200px)
   - Test letterhead display before sending documents

4. **Tracking**:
   - Regularly check mail recipient status
   - Follow up on unacknowledged documents
   - Monitor onboarding document completion

### For Employees

1. **Notifications**:
   - Check notifications regularly
   - Acknowledge documents promptly
   - Review important documents carefully

2. **Document Access**:
   - Use search to find specific documents
   - Preview documents before downloading
   - Contact HR for document issues

---

## Troubleshooting

### Common Issues

1. **Document Not Sending**
   - Check employee email address
   - Verify template content is not empty
   - Check network connection
   - Review server logs

2. **Letterhead Not Displaying**
   - Verify letterhead is uploaded
   - Check image format (PNG, JPG, JPEG, PDF)
   - Verify CORS settings if using S3
   - Clear browser cache

3. **Preview Not Opening**
   - Check document ID is valid
   - Verify document exists
   - Check browser popup blocker
   - Review network connection

4. **Template Variables Not Filling**
   - Verify employee data is complete
   - Check variable names match template
   - Review template syntax
   - Manually fill missing variables

5. **Search Not Working**
   - Clear search term and retry
   - Check filter combinations
   - Verify data exists
   - Refresh page

6. **Attachments Not Sending**
   - Check file size limits
   - Verify file format is supported
   - Review network connection
   - Check server upload limits

---

## Future Enhancements

Potential improvements for the module:

- **Document Versioning**: Track document versions
- **Bulk Operations**: Send documents to multiple employees
- **Document Templates Library**: Expandable template library
- **E-signature Integration**: Digital signature support
- **Document Analytics**: Track document engagement metrics
- **Automated Workflows**: Automated document generation
- **Document Expiry**: Set expiration dates for documents
- **Advanced Search**: Full-text search across documents
- **Document Comments**: Add comments to documents
- **Export Functionality**: Export document lists to Excel/PDF
- **Mobile App**: Native mobile app support
- **Document Categories**: Enhanced category management
- **Custom Templates**: User-created templates
- **Document Approval Workflow**: Multi-level approval process

---

## Support

For technical support or questions about the Document Center module, please contact:
- **Development Team**: [Contact Information]
- **Documentation**: This file
- **Issue Tracking**: [Issue Tracker URL]

---

**Last Updated**: [Current Date]
**Version**: 1.0
**Module**: Document Center

