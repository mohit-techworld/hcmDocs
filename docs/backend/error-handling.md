---
title: Error Handling Guidelines
sidebar_position: 4
---

# Error Handling Guidelines

The backend standardises error responses so clients receive actionable messages while logs retain full stack traces.  Use the following patterns when adding or refactoring controllers.

## FormatErrorResponse Utility

`src/utils/errorHandler.js` exports `formatErrorResponse(error, context)` which returns a structured JSON payload and logs the error with contextual metadata.

```javascript
import { formatErrorResponse } from "../utils/errorHandler.js";

export const exampleController = async (req, res) => {
  try {
    // ...business logic
  } catch (error) {
    const response = formatErrorResponse(error, "exampleController");
    res.status(response.statusCode || 500).json(response);
  }
};
```

This produces responses such as:

```json
{
  "success": false,
  "message": "Validation Error: Missing field employee_Id.",
  "error": {
    "name": "ValidationError",
    "message": "Missing field employee_Id.",
    "stack": "...",
    "code": "VALIDATION_ERROR"
  }
}
```

## Catch Blocks

- Include context in error logs to simplify tracing.
- Avoid returning generic `"Internal Server Error"` unless disclosure is unsafe.
- Respect `process.env.NODE_ENV`: expose stack traces only in development.

```javascript
} catch (error) {
  logger.error("UserProfileById:", error);
  const response = formatErrorResponse(error, "UserProfileById");
  res.status(response.statusCode || 500).json(response);
}
```

## Global Error Middleware

Keep the final middleware in `server.js` to catch uncaught exceptions:

```javascript
app.use((err, req, res, next) => {
  const response = formatErrorResponse(err, `${req.method} ${req.path}`);
  res.status(response.statusCode || 500).json(response);
});
```

## Common Error Types

| Error | Cause | Response |
| --- | --- | --- |
| `ValidationError` | Failed input validation (Joi/Mongoose) | 400 with detailed message. |
| `CastError` | Invalid ObjectId | 400 `"Invalid ID format"` |
| `MongoServerError` 11000 | Duplicate key | 409 `"Duplicate entry: ..."` |
| `JsonWebTokenError` | Bad JWT signature | 401 `"Invalid authentication token"` |
| `TokenExpiredError` | JWT expired | 401 `"Authentication token has expired"` |
| `ENOENT / MODULE_NOT_FOUND` | Missing file/module | 500 with path details. |

## Frontend Error Display

- Use `error.message` when available to show precise messages (e.g., `"Passwords do not match"`).
- Fall back to generic copy only when `message` is undefined.
- For API errors, inspect `response.data` for the structured payload generated above.

```javascript
try {
  await axiosInstance.post("/payrollv2/employee-salary/assign", payload);
} catch (error) {
  const apiError = error.response?.data;
  toast.error(apiError?.message || "Failed to assign salary structure");
}
```

Consistent error handling makes troubleshooting smoother for both engineers and support teams.  When adding new modules, reuse `formatErrorResponse` and log contextual metadata.

