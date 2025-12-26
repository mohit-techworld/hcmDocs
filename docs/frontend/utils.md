---
title: Frontend Utilities
sidebar_position: 5
---

# Frontend Utilities

The `src/utils` directory holds helper functions, formatters, and integration hooks shared across the React application.  This page highlights the most referenced utilities and their responsibilities.

## Utility Directory Overview

| File | Purpose |
| --- | --- |
| `utils/registerFcmToken.js` | Registers Firebase Cloud Messaging (FCM) token with backend (`POST /notifications/register-token`). |
| `utils/SubdomainValidator.jsx` | Component that validates tenant subdomain before rendering app content. |
| `utils/socket.js` / `utils/socketService.js` | Initialises Socket.io connections (encapsulated in services). |
| `utils/helpers.js` / `utils/formatters.js` (if present) | Date/time formatting, currency helpers, etc. |
| `utils/storeHelpers.js` (if present) | Utility selectors for Zustand stores. |
| `utils/downloadHelper.js` | Handles file downloads with signed URLs. |
| `utils/pdfHelper.js` | PDF generation/viewer helpers (where applicable). |
| `utils/validationSchemas.js` | Shared Yup schemas for forms. |

> The exact files may vary; inspect `src/utils/` for the most current list.

## Key Utilities in Detail

### `registerFcmToken.js`

- Checks browser notification permissions.
- Requests token from Firebase messaging (`messaging.getToken()`).
- Calls backend to register the token for the logged-in user.
- Used in `App.jsx` (visibility change handler) to keep tokens up-to-date.

### `SubdomainValidator.jsx`

- Reads window hostname, validates against allowed tenant list.
- If subdomain is unsupported, renders a fallback message/redirect.
- Wraps `<RouterProvider>` in `App.jsx`.

### Socket Helpers

- `utils/socket.js` exports a Socket.io client instance with base URL `import.meta.env.VITE_API_BASE_URL`.
- Used by chat context and notification store to listen to real-time events.

### Formatter Utilities

- Date formatting functions (e.g., convert ISO to human-readable).
- Currency formatting for payroll views.
- Status badge helpers (return classes based on status).

### Download Helpers

- Generate temporary anchor elements to trigger file download.
- Used by Document Centre and payroll export screens.

## Adding a Utility

1. Place new helper in `src/utils/<name>.js`.
2. Export functions; keep dependencies minimal.
3. Document usage in relevant feature docs or here.
4. Import only where necessary to avoid large bundles.

Utility modules promote reuse and keep components focused on rendering logic. Keep this page updated as new helpers are added.

