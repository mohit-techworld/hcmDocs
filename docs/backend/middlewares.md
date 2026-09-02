---
title: Middleware Catalogue
sidebar_position: 6
description: "Middlewares in src/middlewares apply shared behaviours—authentication, permission checks, file handling, device validation—between the router and controllers."
---

# Middleware Catalogue

Middlewares in `src/middlewares` apply shared behaviours—authentication, permission checks, file handling, device validation—between the router and controllers. This page documents the available middleware functions, the routes that use them, and related configuration.

## Authentication & Authorisation

### `auth.middleware.js`

| Function | Description | Notes |
| --- | --- | --- |
| `verifyJWT` | Validates JWTs, enforces device-specific tokens, maps legacy permissions, attaches `req.user`. | Requires `Authorization` header or cookie, plus `x-device-type`. |
| `verifyJWTGuest` | Validates guest JWTs issued for registration flows. | Uses `JWT_SECRET_FOR_GUEST`; ensures guest tokens expire/are scoped. |
| `decodeJWT` | Helper to decode tokens without throwing errors. | Used in controllers/services for token introspection. |

Routes: most `/api/v1/**` endpoints include `verifyJWT`. Registration guest routes use `verifyJWTGuest`.

### `checkPermission.middleware.js`

Enforces permission slugs on protected routes. Example:

```javascript
router.post(
  "/user-management/create",
  verifyJWT,
  checkPermission("employee-create-super"),
  userManagementController.createEmployee
);
```

If `req.user.allPermissions` does not contain the slug, a 403 response is returned.

## Device & Punch Auth

### `deviceMiddlware.js`

Validates custom device secrets (e.g., biometric devices). Compares `x-device-secret` header to `process.env.DEVICE_SECRET`.

### `unifiedPunchAuth.middleware.js`

Additional validation for attendance punch payloads; ensures signature, device info, and schema adherence before reaching attendance controllers.

## File Uploads

### `multer.middleware.js`

Configures Multer for handling multipart form uploads (documents, images). Often combined with S3 upload utilities:

```javascript
router.post(
  "/document-center/upload",
  verifyJWT,
  upload.single("file"),
  DocumentController.uploadDocument
);
```

Variants (if present) handle multiple files or specific MIME types.

## Logging & Error Handling

- **Morgan**: Configurable in `server.js` (`app.use(morgan(logFormat, { stream: logger.stream }))`) for HTTP access logs.
- **Global Error Handler**: After routes, `server.js` uses `formatErrorResponse` to standardise 500 responses.

## Socket.io Middleware

`server.js` applies middleware on Socket.io namespaces:

- Default namespace: verifies JWT tokens via `jwt.verify`.
- `/chat` namespace: authenticates token, attaches `socket.user`, logs success/failure.

## Adding New Middleware

1. Create a file under `src/middlewares/<name>.middleware.js`.
2. Export the middleware (`export const myMiddleware = (req, res, next) => { ... };`).
3. Import and use it in relevant routes (`router.use(myMiddleware)` or per endpoint).
4. Document the purpose, configuration, and usage on this page.

Understanding these middleware functions is key to securing routes, validating input, and connecting device integrations across the API.

