---
title: Loans, Advances & Reimbursements
sidebar_position: 7
description: Employee requests for loans, salary advances and expense reimbursements, the manager-initiated proposal flow, and the administration surface.
---

# Loans, Advances & Reimbursements

Three related workflows share one store and two screens — an employee surface
behind `payroll-loan-lequest`, and an administration surface behind
`payroll-manage-claims`.

:::note That permission string is not a typo in this page
The employee permission really is `payroll-loan-lequest` in the source. It must
match the backend exactly, so do not "correct" it on one side alone.
:::

## What an employee can do

The employee screen has four tabs — a dashboard, loans, advances and
reimbursements.

- **Request a loan** with a type, amount, tenure, purpose and supporting
  documents.
- **Request an advance** against salary.
- **Claim a reimbursement**, including a travel-specific sub-form, and cancel a
  pending claim.
- **Check eligibility** before requesting.
- **Respond to a proposal** — accept it, or reject it with a reason.

That last one is easy to miss: a manager can *initiate* a loan or advance for an
employee, and the employee then responds. It is a distinct flow from requesting.

## What an administrator can do

- Review requests, approving or rejecting with overrides to the amount or
  tenure.
- Disburse an approved loan or advance.
- Assign a loan, advance or reimbursement directly to an employee without a
  request.
- Mark a loan EMI paid, or set and adjust an advance's recovery start month.
- Run bulk operations: advance recovery-start, advance disbursal, reimbursement
  review, and reimbursement payment processing.

## Endpoints

All paths sit under `/loan-advance/`.

| Area | Endpoints |
| --- | --- |
| Loan | `POST loan/request` · `GET loan/my-loans`, `loan/details/{id}`, `loan/eligibility`, `loan/all-requests`, `loan/pending-emis` · `POST loan/respond/{id}`, `loan/review/{id}`, `loan/disburse/{id}`, `loan/assign`, `loan/mark-emi-paid` |
| Advance | `POST advance/request` · `GET advance/my-advances`, `advance/details/{id}`, `advance/eligibility`, `advance/all-requests`, `advance/pending-recoveries` · `POST advance/respond/{id}`, `advance/review/{id}`, `advance/disburse/{id}`, `advance/assign`, `advance/bulk/recovery-start`, `advance/bulk/disburse` · `PATCH advance/{id}/recovery-start` |
| Reimbursement | `POST reimbursement/request`, `reimbursement/cancel/{id}`, `reimbursement/review/{id}`, `reimbursement/process-payment/{id}`, `reimbursement/assign`, `reimbursement/bulk/review`, `reimbursement/bulk/process-payment` · `GET reimbursement/my-reimbursements`, `reimbursement/details/{id}`, `reimbursement/all-requests` |

The store keeps separate loading flags and pagination per slice, so the three
lists can load independently.

## Known issues

- The store file carries roughly **1,000 commented-out lines** of an earlier
  implementation before the live code begins.
- `components/loan&advance/SalaryCard.js` has no importers. It independently
  fetches payslips and computes a financial-year total, duplicating logic that
  belongs to the [Payroll](./payroll.md) module.
- Several statistics actions exist in the store but nothing renders them on
  mobile: loan, advance and reimbursement statistics, the payroll-facing pending
  EMI and recovery queries, and supporting-document deletion.
