---
title: API Reference
sidebar_position: 0
description: Endpoint reference for the HCM tenant backend, grouped by domain, with the tenant request contract every call must satisfy.
---

# API Reference

Every endpoint below lives on the tenant backend and is mounted under `/api/v1`.

:::warning Read this first
Every non-public request must carry a tenant identity, or it is rejected before
your controller runs. See **[Request Headers](/platform/request-headers)** —
a request with only `Authorization` and `Content-Type` returns
`403 TENANT_HEADER_REQUIRED`.
:::

## Request basics

| Property | Value |
| --- | --- |
| Base path | `/api/v1` |
| Auth | `Authorization: Bearer <accessToken>` |
| Tenant (web) | `X-Tenant-Subdomain: <subdomain>` — **required** |
| Tenant (mobile) | resolved from the JWT; send `x-device-type: android \| ios` |
| Content type | `application/json` unless the endpoint takes a file upload |

## Domains

### Identity & access

- [Authentication](Authentication/auth-setup.md) — login, OTP, refresh, password reset
- [User Management](user-management/user-management.md) — user CRUD, roles, profile data
- [Subordinates Management](subordinates-management/subordinates-management.md) — reporting lines and team scoping

### People operations

- [Employee Onboarding](employee-onboarding/employee-onboarding.md)
- [Department Management](department-management/department-management.md)
- [Designation Management](designation-management/designation-management.md)
- [Company Settings](company-settings/company-settings.md)

### Time & attendance

- [Attendance Management](attendance-management/attendance-management.md)
- [Leave Management](leave-management/leave-management.md)
- [Holiday Management](holiday-management/holiday-management.md)

### Work & delivery

- [Task Management](task-management/task-management.md)
- [Tickets Management](tickets-management/tickets-management.md)
- [RACI Management](raci-management/raci-management.md)

### Talent

- [Recruitment Management](recruitment-management/recruitment-management.md)
- [KPI Management](performance-management/kpi-management.md)
- [Performance Ratings](performance-management/performance-ratings-managemenet.md)
- [Employee Engagement](employee-engagement/employee-engagement.md)

### Compliance

- [POSH Management](posh-management/posh-management.md)

## Coverage

This reference covers the domains above. A number of shipped domains are not yet
documented — including `ai-insights`, `chat`, `calls`, `biometric`, `device`,
`payslip`, `billing`, `permission-role` and `audit`. Track progress in the
[Modules overview](../modules/index.md).
