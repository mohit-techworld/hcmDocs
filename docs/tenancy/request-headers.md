---
title: Request Headers
sidebar_position: 2
description: The tenant headers every API call must carry, how web and mobile differ, and why companyid can only ever deny a request.
---

# Request Headers

Every non-public request to the tenant backend must establish which company it
belongs to. This page is the contract.

## The minimum

**Web clients**

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
X-Tenant-Subdomain: acme
```

**Mobile clients (Android / iOS)**

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
x-device-type: android
companyid: 1506491936
```

Omit the tenant header on a web request and you get:

```json
{
  "success": false,
  "code": "TENANT_HEADER_REQUIRED",
  "message": "Missing X-Tenant-Subdomain header. Every web request must declare its tenant."
}
```

## `X-Tenant-Subdomain`

The bare subdomain — `acme`, not `acme.humanmaximizer.com` and not a URL. It is
lower-cased and trimmed on arrival.

The header exists so that local development works without DNS. In production the
same value can be derived from `req.hostname`, and the resolver falls back to
that when the header is absent. The web frontend sends it on **every** request
through an axios interceptor, so it is never conditional.

Four subdomains are reserved and never resolve to a tenant: `admin`, `apiv2`,
`ms1`, `www`.

:::note Enforcement can be disabled, but is on by default
`ENFORCE_TENANT_SUBDOMAIN=false` turns off web enforcement without a code
deploy. Requests then defer tenant resolution to `verifyJWT`, which re-binds from
the authenticated user. Do not rely on this — it exists for incident response.
:::

## The `companyid` header is a cross-check

This is the rule most likely to be misread, so it is worth stating plainly:

> **`companyid` can only ever deny a request. It can never select a tenant.**

Clients do send it — the mobile app, the field-worker app and both
ProductivityLens agents all persist the company they were onboarded to. The
backend reads it *only* to compare against the tenant it already resolved from
the subdomain. If they disagree, the request is refused with `TENANT_MISMATCH`.

The reasoning is that the header arrives from the client. Honouring it as a
selector would let any caller read another company's data by editing one header.
So tenancy comes from the subdomain, validated against the registry, and
`companyid` is reduced to a drift detector — it catches a device re-pointed at a
different backend, or a session left over from another workspace.

Comparison is numeric when both sides parse as numbers, so `"1506491936"` and
`1506491936` agree; a genuinely different number is still caught.

## The origin cross-check

For browser requests, the subdomain in `Origin` (or `Referer`) must agree with
the one being claimed. A frontend build that hard-codes the wrong tenant — a
stray `VITE_TENANT_SUBDOMAIN` override, say — cannot log a user into a tenant
other than the one in their address bar.

The check is skipped when the origin cannot be attributed to a subdomain of
`BASE_DOMAIN` (localhost, custom domains) rather than blocking those requests.

## Mobile resolves differently

A request is treated as mobile when `x-device-type` is `android` or `ios`.
Mobile clients may hit a non-tenant host and are allowed through the edge
resolver without a subdomain. Their tenant is established later, in `verifyJWT`,
from the authenticated user's `companyId` — which is unspoofable, because it
comes out of a signed token rather than a header.

The practical consequence: **the same endpoint has two different header
contracts.** Test both.

## Public routes

About twenty routes skip authentication entirely — the login and OTP surface,
token refresh, password reset, the mobile version gate, the login-screen logo,
crash uploads and health probes. `POST /api/v1/tenant/verify` is on the list
because it is how a mobile client bootstraps a workspace before it has a session.

The allow-list lives in `src/config/publicRoutes.js` and a boot-time auditor
fails CI when a route ships without auth and without an entry.

## Other headers you will meet

| Header | Used by | Purpose |
| --- | --- | --- |
| `x-device-type` | mobile | `android` / `ios`; selects the mobile contract |
| `x-device-id` | mobile, agents | per-device identity, used in rate-limit keys |
| `x-secret-key` | legacy agents | global device secret (single-tenant deployments) |
| `x-integration-key` / `x-integration-secret` | partners | integration API credentials |
| `x-request-id` | all | correlation id echoed into logs |

## Worked example

```bash
curl -X POST https://acme.humanmaximizer.com/api/v1/leave/apply \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: acme" \
  -H "companyid: 1506491936" \
  -d '{ "leaveTypeId": "...", "fromDate": "2026-09-10", "toDate": "2026-09-12" }'
```

Drop the `X-Tenant-Subdomain` line and this returns `403`, regardless of how
valid the token is.
