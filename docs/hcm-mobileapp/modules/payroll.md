---
title: Payroll & Payslips
sidebar_position: 4
description: Viewing payslips, filtering by period, and how the app renders and shares a payslip PDF on the device.
---

# Payroll & Payslips

Self-service only — there is no manager or approver surface in the mobile app
for payroll.

## What an employee can do

List their own payslips, filter by month and year, and export any payslip as a
PDF to share or save.

Filtering happens **on the device**. The app fetches up to 100 payslips sorted
by period, then narrows the list locally as the filter changes, so switching
months does not trigger a new request.

## Generating the PDF

The app builds the payslip itself rather than downloading one:

1. Fetch the full record for that payslip.
2. Fetch company details for the header, and the payslip structure from payroll
   settings (defaulting to `standard`).
3. Render an HTML template to PDF with `expo-print`.
4. Write it to the document directory as
   `Payslip_{employeeId}_{payrollMonth}.pdf`.
5. Hand it to the system share sheet with `expo-sharing`.

Sharing rather than saving to the media library is deliberate — it avoids
requesting storage permission for something the employee is about to send
anyway.

Deduction line items are labelled from a fixed map: provident fund, ESI, TDS,
loss-of-pay, half-day deduction, late-coming penalty, loan EMI, advance
recovery, accommodation charges and salary advance.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/payslip/payslips` | List, with `employeeId`, paging and `expand=full` |
| `GET` | `/payslip/payslips/{id}` | Full record for the PDF |
| `GET` | `/company-settings/info/getCompany` | Company header |
| `GET` | `/payrollv2/settings` | Payslip structure |

The payroll-settings call is wrapped so a failure degrades to the default
structure instead of blocking the payslip.

:::note A 403 here must not sign the employee out
The axios interceptor deliberately excludes `403` from its logout path, and this
module is why — a forbidden payslip download was previously ending sessions. See
[Sessions & Tokens](../security/sessions-and-tokens.md).
:::

## Known issue

The list is filtered a second time on the client by comparing `employeeId` as a
string, even though the same ID was already sent as a query parameter. If the
server ever returns the ID in a different shape, the list silently renders
empty rather than showing an error.
