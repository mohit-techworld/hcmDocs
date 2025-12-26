---
title: Onboarding Management
sidebar_position: 7
---

# Onboarding Management

Onboarding bridges recruitment and active employment. It manages induction materials, checklist completion, and field worker onboarding dashboards.

## Permissions

| Permission | Description |
| --- | --- |
| `organization-chart` (repurposed in menu) | Grants access to onboarding dashboards (ensure dedicated slug if required). |
| `training-manage`/`training-view` | Manage or view training materials. |
| `induction-view` / `company-induction` | View or update induction content. |

## Backend Components

| File | Responsibility |
| --- | --- |
| `controllers/induction/induction.controller.js` | Manage induction PPTs and onboarding assets. |
| `controllers/training-materials/material.controller.js` | Upload, list, assign training materials. |
| `controllers/registration/registration.controller.js` | Handles registration steps post-selection (document collection, verification). |
| `models/training-materials/*.model.js` | Training material schemas (categories, assignments). |
| `models/induction/induction.model.js` (if present) | Induction documents metadata. |
| `routes/v1/training-materials/`, `routes/v1/induction/` | Exposure of onboarding endpoints. |
| `controllers/recruitment/candidate.controller.js` | Moves candidates to onboarding stage and triggers registration flows. |

## Frontend Components

| Path | Description |
| --- | --- |
| `pages/onboarding/OnboardingDashboard.jsx` | Overview of onboarding progress (linked from menu). |
| `components/onboarding/OnboardingChecklist.jsx` | Checklist cards (documents, training, induction). |
| `components/onboarding/FieldWorkerDashboard.jsx` | Field worker onboarding flows (shared with geolocation). |
| `components/training/TrainingList.jsx` | Training material viewer. |
| `components/induction/InductionUploader.jsx` | Upload or manage induction PPTs. |
| `store/useInductionPPTStore.js`, `store/useTrainingMaterialStore.js`, `store/useRegistrationStore.js` | Zustand stores for onboarding data. |
| `service/inductionService.js`, `service/trainingMaterialService.js`, `service/registrationService.js` | Axios clients. |

## Workflow

```mermaid
flowchart LR
    A[Candidate Selected] --> B[Recruitment moves to onboarding stage]
    B --> C[Registration Controller creates onboarding record]
    C --> D[Onboarding Dashboard displays checklist]
    D --> E[Training Materials assigned]
    D --> F[Induction PPTs shared]
    E --> G[Employee completes modules]
    F --> G
    G --> H[HR verifies completion and activates employee]
```

## Integrations

- **Recruitment** – Candidate stage transitions trigger onboarding tasks.
- **Registration** – Handles document collection, employee profile finalisation.
- **Training Materials** – training completion feeds into performance/HR analytics.
- **Geolocation** – Field worker onboarding ensures location permissions and device setup.

## Tenant Notes

- Induction/training files stored in tenant-specific S3 buckets.
- `.env` values determine upload size limits, S3 credentials.
- Onboarding dashboards can be customised per tenant by adjusting store defaults (e.g., required steps).

Use this module guide when updating onboarding checklists, induction content, or adding new onboarding steps.

