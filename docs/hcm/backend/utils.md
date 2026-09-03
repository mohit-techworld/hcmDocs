---
title: Backend Utilities
sidebar_position: 7
description: "Utilities in src/utils provide reusable helpers for logging, email templating, salary calculations, S3 uploads, validation, and more. This document."
---

# Backend Utilities

Utilities in `src/utils` provide reusable helpers for logging, email templating, salary calculations, S3 uploads, validation, and more.  This document catalogs the most important utility files and their responsibilities.

## Core Utilities

| File | Description |
| --- | --- |
| `utils/logger.js` | Winston logger configured with transports for console and optional file streams. Used by controllers/services for structured logging. |
| `utils/errorHandler.js` | `formatErrorResponse` helper to standardise API error payloads; used by global error middleware. |
| `utils/accessToken.js` | Generates JWT tokens (`generateJWT`) using `JWT_SECRET_KEY` and `ACCESS_TOKEN_EXPIRY`. |
| `utils/hashPass.js` | Password hashing/comparison helpers using bcrypt. |
| `utils/fileUpload.js`, `utils/s3Upload.js`, `utils/cloudinary.js`, `utils/s3MailUpload.js` | File upload utilities for S3/Cloudinary (documents, images, emails). |
| `utils/emailQueue.js` | Exports BullMQ queue instance (`emailQueue`). |
| `utils/emailTemplate.js` (base template) | Wraps email content with consistent HTML layout. |
| `utils/SalaryCalculationService.js` | Core payroll calculator (earnings, deductions, statutory). Covered in payroll doc. |
| `utils/cronJobs.js` | Registers recurring jobs (late punch reminder, ticket reminders, poll closures). |
| `utils/pollScheduler.js` | Scheduler for poll auto-closure. |
| `utils/sendPushToUsers.js` | Firebase push notifications. |
| `utils/companyInfo.js` | Fetches company info and constructs default emails. |
| `utils/awsService.js` | Generic AWS S3 helper functions. |
| `utils/logger.js` | Winston logger (structured logs). |
| `utils/unifiedPunchHelper.js` (if present) | Attendance device helper logic. |

## Utility Usage Examples

### Logging

```javascript
import logger from "../utils/logger.js";

try {
  // ...
} catch (error) {
  logger.error("FeatureName:", error);
}
```

### Error Handling

```javascript
import { formatErrorResponse } from "../utils/errorHandler.js";

} catch (error) {
  const response = formatErrorResponse(error, "controllerName");
  res.status(response.statusCode || 500).json(response);
}
```

### S3 Upload

```javascript
import { uploadToS3 } from "../utils/s3Upload.js";

const result = await uploadToS3(fileBuffer, fileName, mimeType);
```

### Access Tokens

```javascript
import { generateJWT } from "../utils/accessToken.js";

const token = generateJWT({ _id: user._id, employee_Id: user.employee_Id });
```

## Guidelines

- Utilities should be pure (stateless) whenever possible.
- Avoid importing controllers/models inside utilities; keep dependencies low-level.
- Document environment variable requirements (e.g., AWS credentials, JWT secrets).
- Update this page when adding new utility modules to help future maintainers.

Utilities are central to keeping controllers lean and maintainable. Refer here to locate shared helper logic across the backend.

