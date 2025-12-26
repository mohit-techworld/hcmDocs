---
title: Frontend Services (API Clients)
sidebar_position: 4
---

# Frontend Services (API Clients)

The `src/service` directory contains Axios-based clients that interact with backend REST endpoints. Each service module encapsulates endpoint URLs, request/response handling, and error propagation. This page maps key service files to their API routes and related stores/components.

## Shared Infrastructure

- `service/axiosInstance.js` – Configured Axios instance adding `Authorization: Bearer` header, handling refresh/logout on 401, and base URL (`VITE_API_BASE_URL`).
- `service/publicAxios.jsx` – Axios instance for public endpoints (no auth), e.g., registration guest APIs.
- `service/socketService.js` / `service/socket.js` – Socket.io clients.

## Service Modules

| Service File | Base Path | Used By | Notes |
| --- | --- | --- | --- |
| `service/service.js` | `/api/v1/auth` | Auth store (`useAuthStore`) | Login, logout, profile fetch. |
| `service/dashboardService.js` | `/api/v1/dashboard-stats` | Dashboard stores & pages | Super admin/employee stats. |
| `service/attendanceService.js` | `/api/v1/attendance`, `/api/v1/attendance-user` | Attendance stores & pages | Punch logs, regularisation, OT requests. |
| `service/leaveService.js` | `/api/v1/leaves`, `/api/v1/holiday` | Leave stores/pages | Apply, approve, calendar. |
| `service/payrollService.js` | `/api/v1/payrollv2/*` | Payroll stores/pages | Salary structure, runs, holds. |
| `service/statutoryComplianceService.js` | `/api/v1/payrollv2/statutory-compliance` | Payroll compliance UI | PT/LWF/EPF/ESI settings. |
| `service/employeeService.js`, `service/userManagementService.js` | `/api/v1/user`, `/api/v1/user-management` | Employee management | Profile CRUD, bulk operations. |
| `service/recruitService.js` | `/api/v1/recruitment/*` | Recruitment modules | Jobs, candidates, MRF. |
| `service/engagementService.js`, `service/pollService.js` | `/api/v1/engagement/*` | Engagement feed | Posts, polls, recognitions. |
| `service/assetService.js` | `/api/v1/asset-management` | Asset dashboards | Cataloguing, assignment. |
| `service/inventoryService.js` | `/api/v1/inventory-management` | Inventory pages | Stock, vendors, transactions. |
| `service/issueService.js` | `/api/v1/issues` | Ticket management | Create/update tickets. |
| `service/poshService.js` | `/api/v1/posh` | POSH dashboards | Case management. |
| `service/disciplinaryService.js` | `/api/v1/disciplinary` | Disciplinary pages | Case management. |
| `service/policyService.js` | `/api/v1/policies` | Policies & Document Centre | List, acknowledge policies. |
| `service/documentService.js` | `/api/v1/document-center` | Document Centre | Upload, download docs. |
| `service/inductionService.js` | `/api/v1/induction` | Onboarding | Induction PPTs. |
| `service/trainingMaterialService.js` | `/api/v1/training-materials` | Training modules | Upload/view training materials. |
| `service/resignationService.js` | `/api/v1/resignation` | Resignation module | Submit, approve, view resignation. |
| `service/fnfService.js` | `/api/v1/payrollv2/fnf` (if implemented) | F&F dashboards | Settlement actions. |
| `service/productivityService.js` | `/api/v1/productivity-lens` | Productivity lens | Overview, timeline. |
| `service/raciService.js` | `/api/v1/raci` | RACI dashboards | Matrices, analytics. |
| `service/geolocationService.js`, `service/locationVisitService.js` | `/api/v1/geolocation`, `/api/v1/location-tracking` | Field tracking | Live map, visits. |
| `service/registrationService.js` | `/api/v1/registration` | Registration flows | Guest login, edit rest detail. |

> Additional service files exist for specialised dashboards (analytics cards) and should follow the same pattern.

## Axios Instance Responsibilities

- Injects `Authorization` header from `useAuthStore`.
- Handles response interceptors for 401 (logout) and error transformations.
- Base URL derived from `.env` (`VITE_API_BASE_URL`).

## Adding a Service

1. Create `src/service/<feature>Service.js`.
2. Import `axiosInstance`.
3. Export functions for each endpoint, e.g.:
   ```javascript
   export const featureService = {
     list: (params) => axiosInstance.get("/feature", { params }),
     create: (payload) => axiosInstance.post("/feature", payload),
   };
   ```
4. Call from stores/components.
5. Update this document if the service interacts with major modules.

Having a centralized service layer keeps API knowledge in one place, simplifies error handling, and ensures consistent base URL usage.

