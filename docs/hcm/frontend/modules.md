---
title: Feature Modules
sidebar_position: 2
description: "The HCM SPA mirrors backend domains. Each module combines a Zustand store, service wrapper, components, and pages."
---

# Frontend Feature Modules

The HCM SPA mirrors backend domains.  Each module combines a Zustand store, service wrapper, components, and pages.  This section summarises the most important modules so new contributors can find the relevant code quickly.

## Module Index

| Domain | Primary Pages | Store | Service | Notes |
| --- | --- | --- | --- | --- |
| **Authentication** | `pages/auth/login`, `pages/emp-registration` | `store/store.js` | `service/service.js` | Handles login, registration, OTP flows, logout, and session persistence. |
| **Dashboard** | `pages/dashboard`, `pages/dashboard/super-employee-dashboard` | `store/dashboardStore.js` | `service/dashboardService.js` | Aggregated analytics cards, widgets, and filters. |
| **Attendance** | `pages/attendance`, `components/attendance/**` | `store/useAttendanceStore.js`, `store/useAttendanceLockStore.js` | `service/attendanceService.js` | Punch history, live roster, missed punch approvals. |
| **Leave** | `pages/leave-management`, `components/leave/**` | `store/useLeaveStore.js`, `store/leaveTypeStore.js` | `service/leaveService.js` | Leave calendar, application wizard, manager approvals. |
| **Payroll v2** | `pages/payrollV2/**` | `store/payrollStore.js`, `store/payrollHoldStore.js`, `store/employeeTaxStore.js` | `service/payrollService.js`, `service/statutoryComplianceService.js` | Salary structures, compliance config, payroll run pipeline. |
| **Recruitment** | `pages/recruit management/**` | `store/useVacancyStore.js`, `store/useReferralStore.js` | `service/recruitService.js` | Vacancy boards, candidate tracking, recruitment dashboards. |
| **Performance** | `pages/performance/**`, `pages/kpi/**` | `store/useKpiStore.js`, `store/useRatingStore.js` | `service/kpiService.js` | KPI/KRA creation, goal management, review cycles. |
| **Engagement** | `pages/engagement/**`, `components/Engagement/**` | `store/engagementStore.js`, `store/feedStore.js`, `store/pollStore.js` | `service/engagementService.js` | Posts, polls, recognitions, greetings. |
| **Assets & Inventory** | `pages/assets/**`, `pages/inventory/**` | `store/useAssetStore.js`, `store/loanAdvanceStore.js` | `service/assetService.js` | Asset assignment, issue tracking, loan/advance management. |
| **Compliance (POSH, Disciplinary)** | `pages/posh/**`, `pages/disciplinary/**` | `store/poshStore.js`, `store/useDisciplinaryStore.js` | `service/poshService.js` | POSH case handling, disciplinary action logs. |
| **Notifications & Chat** | `components/Notification/**`, `components/chats/` | `store/notificationStore.js`, `store/socketStore.js` | `service/socket.js`, `service/chatService.js` | Realtime messaging via Socket.io, push notifications via Firebase. |
| **Settings** | `pages/settings/**`, `pages/company/**` | `store/useCompanySettingsStore.js`, `store/companyStore.js` | `service/companyService.js` | Company profile, shift configuration, role & permission management. |

## Store Pattern

Each store exposes data, actions, and loading status.  Example (`useAttendanceStore.js`):

```javascript
const useAttendanceStore = create((set, get) => ({
  records: [],
  isLoading: false,
  filters: {},

  fetchRecords: async (params) => {
    set({ isLoading: true });
    try {
      const res = await attendanceService.list(params);
      set({ records: res.data, isLoading: false });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load attendance");
      set({ isLoading: false });
    }
  },
}));
```

This structure keeps UI components declarative and eliminates prop drilling.

## Service Example

Services wrap API endpoints and merge common headers:

```javascript
import axiosInstance from "./axiosInstance";

export const attendanceService = {
  list: (params) => axiosInstance.get("/attendance", { params }),
  approveMissedPunch: (id, payload) =>
    axiosInstance.patch(`/attendance/missed-punch/${id}`, payload),
};
```

`axiosInstance` injects `Authorization: Bearer <token>` automatically using the auth store.

## Component Patterns

- **Data Grids** use Material UI tables, `react-virtualized`, or `react-window` for large datasets.
- **Forms** rely on `react-hook-form` with `yup` schemas for validation.
- **Charts** leverage `apexcharts`, `recharts`, or `chart.js` depending on complexity.
- **Dialogs** and confirmation flows reuse `SweetAlert2` wrappers or MUI `Dialog` components.

## Real-time UI

- Chat and notifications subscribe to Socket.io events and update zustand stores.
- Attendance dashboards can refetch or receive push-based updates when new punches arrive.
- Firebase messaging shows toast notifications and increments badge counts.

## Styling

- Global styles in `src/index.css` set Tailwind layers.
- Feature components often ship with local CSS Modules or inline Tailwind classes.
- Material Tailwind and Material UI offer ready-made components consistent with the design system.

Understanding these patterns dramatically speeds up feature development—new modules should follow the same folder and store structure to stay idiomatic.

