---
sidebar_position: 6
title: Device & Agent Auth
description: >-
  How the mobile app bootstraps a workspace and how biometric agents
  authenticate to the right tenant.
---

# Device & Agent Auth

Browsers get their tenant from the URL. Devices cannot — a biometric terminal on
a factory floor has no address bar. This page covers how non-browser clients
establish tenancy.

## Mobile workspace bootstrap

Before a user can log in, the app must know which workspace it is talking to.
That is what `POST /api/v1/tenant/verify` is for. It is one of the few public
routes.

```http
POST /api/v1/tenant/verify
Content-Type: application/json
x-device-id: <stable device identifier>

{
  "companyId": "1506491936",
  "subdomain": "acme"
}
```

The endpoint requires **both** values and matches them as a pair against an
active tenant:

```js
Tenant.findOne({ companyId, subdomain, isActive: true, status: "active" })
```

`companyId` must be exactly ten digits. Because the pair must match, a client
that passes verification always holds a `companyId` consistent with its
subdomain — which is precisely what makes the
[`companyid` cross-check](request-headers.md#the-companyid-header-is-a-cross-check)
safe to enforce on later requests.

### Rate limiting

This endpoint is the natural target for tenant enumeration, so it is limited
harder than the rest of the API:

- **5 attempts per 30 seconds**, keyed on three signals combined: the caller's IP
  `/24` prefix, `x-device-id`, and the target `companyId`.
- A **daily failure ceiling** as a second limiter, so one network prefix cannot
  accumulate unlimited attempts across windows.

The `/24` prefix is a deliberate trade-off. Residential and mobile networks share
a prefix across many subscribers, but an attacker rotating `x-device-id` gains
nothing — they would need to control a whole `/24` to spread the load, which is
materially harder than editing a header.

After bootstrap, the app stores the pair and sends `companyid` plus
`x-device-type` on every subsequent call.

## Biometric agents

The attendance agent runs on a PC inside the customer's network, polls the
biometric device, and POSTs punches to whichever backend that **machine** is
configured for. The agent is deliberately architecture-agnostic — it does not
know or care whether the backend behind it is single- or multi-tenant.

Authentication differs by deployment mode:

| | Shared multi-tenant | Single-tenant |
| --- | --- | --- |
| Credential | Per-tenant device key — `keyId` + HMAC | Global `DEVICE_SECRET` |
| Header | key id plus signature | `x-secret-key` |
| Tenant resolution | device key → `companyId` | implicit: the deployment is the tenant |
| Fallback | legacy global secret still accepted | — |

In shared mode the device key **is** the tenant identity: the key maps to a
`companyId`, so an agent never sends a subdomain. Key issuance and revocation are
handled by the device-key admin endpoints.

:::caution Machines are tenant-scoped
A given agent installation belongs to one tenant. There is currently no
supported way to point one agent at several tenants — a second tenant needs a
second installation with its own key.
:::

## Employee identity across modes

The field an agent's punch is matched against differs between the two
architectures, and this is the most common cause of "punches arrive but nothing
appears":

| | Shared multi-tenant | Single-tenant |
| --- | --- | --- |
| Field | `employeeId` | `employee_Id` |
| Lookup | `User.findOne({ employeeId, <companyId scope> })` | `User.findOne({ employee_Id })` |
| Uniqueness | compound `{ companyId, employeeId }` | `employee_Id` globally unique |

The same enrolment number legitimately exists under two different companies in
shared mode, which is exactly why the global-unique index of single-tenant mode
cannot be carried over. See [Tenancy Model](index.md#two-architectures-one-codebase).

## Other machine credentials

| Header | Used by |
| --- | --- |
| `x-integration-key` / `x-integration-secret` | third-party integrations |
| `x-capture-api-key` | screenshot / productivity capture agents |
| `x-sync-token` | internal MS1 ⇄ MS2 sync |
| `x-device-id` | any device; feeds rate-limit keys and audit trails |

All of these identify a *machine*, not a person. None of them widen tenant
scope — like `companyid`, they are checked against the tenant already resolved.
Mohit Kumar

