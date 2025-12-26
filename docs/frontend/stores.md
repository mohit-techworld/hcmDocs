---
title: Zustand Stores
sidebar_position: 3
---

# Zustand Stores

The SPA uses [Zustand](https://github.com/pmndrs/zustand) for state management.  Stores live in `src/store/**` and represent domain-specific data caches plus UI state.  This page lists the most important stores and how they interact with services.

## Store Patterns

- Each store is created with `create` (and optionally `persist`) to hold state and actions.
- Stores only import corresponding service modules to keep API calls centralised.
- Components subscribe via `useStore(selector)` to minimise re-renders.

## Major Stores

| Store File | Description | Key Actions |
| --- | --- | --- |
| `store/store.js` | Authentication store (`useAuthStore`) handling login/logout, tokens, user profile, company info. | `login`, `logout`, `clearAuthState`, `setCompanyInfo`, `setAccessToken`. |
| `store/dashboardStore.js`, `store/useDashboardStore.js` | Dashboard data (cards, filters). | `fetchSuperDashboard`, `fetchEmployeeDashboard`. |
| `store/attendance/...` (`useAttendanceStore.js`, `useAttendanceLockStore.js`) | Attendance logs, filters, locks. | `fetchRecords`, `applyFilters`, `lockPeriod`. |
| `store/useLeaveStore.js`, `store/leaveTypeStore.js` | Leave applications/types. | `applyLeave`, `fetchLeaveHistory`, `updateStatus`. |
| `store/payrollStore.js`, `store/payrollHoldStore.js`, `store/employeeTaxStore.js` | Payroll runs, holds, tax declarations. | `fetchPayrollRuns`, `holdSalary`, `saveTaxDeclaration`. |
| `store/useVacancyStore.js`, `store/useRecruitmentStore.js` | Recruitment jobs/candidates. | `fetchJobs`, `fetchCandidates`, `updateCandidateStage`. |
| `store/engagementStore.js`, `store/feedStore.js`, `store/pollStore.js` | Engagement feed and polls. | `fetchFeed`, `createPost`, `votePoll`. |
| `store/useAssetStore.js`, `store/loanAdvanceStore.js` | Asset/inventory management. | `fetchAssets`, `assignAsset`, `createLoanRequest`. |
| `store/useIssuesStore.js` | Ticketing module. | `raiseTicket`, `updateStatus`, `fetchTickets`. |
| `store/useResignationStore.js`, `store/useFNFStore.js` | Resignation workflows. | `submitResignation`, `approveResignation`, `fetchFnfRequests`. |
| `store/useUsageStore.js` | Productivity lens data. | `fetchOverview`, `fetchTimeline`. |
| `store/useRaciStore.js` | RACI matrices and analytics. | `fetchMatrices`, `saveMatrix`. |
| `store/notificationStore.js` | Notification list and unread counts. | `setNotifications`, `markAsRead`, `addNotification`. |
| `store/socketStore.js` | Manages socket connection state. | `connectSocket`, `disconnectSocket`, `setStatus`. |
| `store/useInductionPPTStore.js`, `store/useTrainingMaterialStore.js` | Onboarding/training materials. | `fetchInduction`, `uploadMaterial`. |

> The `store/analytics dashboards cards/` folder contains dedicated stores for dashboard card modules (attendance, compensation, etc.).

## Service Interaction

Stores generally follow this pattern:

```javascript
const useExampleStore = create((set, get) => ({
  data: [],
  isLoading: false,
  fetchData: async (params) => {
    set({ isLoading: true });
    try {
      const res = await exampleService.list(params);
      set({ data: res.data, isLoading: false });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed");
      set({ isLoading: false });
    }
  },
}));
```

## Persistence

- `useAuthStore` uses `persist` middleware to store tokens in `localStorage`.
- Some filters (attendance, dashboards) also persist to maintain state across reloads.

## Adding a Store

1. Create `src/store/useFeatureStore.js`.
2. Import services (e.g., `featureService`).
3. Export the store using `create`.
4. Document the store in this file with a short description.

Zustand stores keep views declarative and decouple API logic from components. This page provides a quick reference when adding features or tracing state flow.

