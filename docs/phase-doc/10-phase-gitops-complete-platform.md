# Phase 10 — Complete GitOps platform (ArgoCD + automation)

## Goal

Complete the “production-grade portfolio” layer:

- GitOps source of truth
- ArgoCD app-of-apps
- image automation
- progressive delivery
- encrypted secrets
- CI/CD integration
- monitoring artifacts
- backup/DR
- presentation-ready docs

## What we did

### GitOps source of truth

- Added `k8s-manifests/` with Kustomize base/overlays.
- Added a GitOps validator script (`hack/validate_gitops.py`).

### ArgoCD

- Added ArgoCD Applications:
  - single-app mode
  - app-of-apps root app

### ArgoCD Image Updater

- Added annotations patch + docs under `argocd/image-updater/`.

### Progressive Delivery

- Added an Argo Rollouts canary example for backend.

### Sealed Secrets

- Added docs + placeholder SealedSecret example.

### CI/CD

- Added GitHub Actions pipeline:
  - build/push images to ECR
  - commit GitOps tag bump

### Monitoring

- Added backend `/metrics` endpoint.
- Added PrometheusRule alerts and a small Grafana dashboard JSON.

### Backup/DR

- Added Velero install notes + schedules + DR runbook.

### Presentation layer

- Added screenshot checklist and demo script.

## What we achieved

- A "complete platform" story that’s interview-ready:
  - infra as code
  - GitOps deployments
  - safe releases
  - observability
  - DR posture

## Tools / tech used

- ArgoCD + Kustomize
- Argo Rollouts
- ArgoCD Image Updater
- Sealed Secrets
- GitHub Actions + ECR
- Prometheus/Grafana
- Velero

## Challenges faced

- Kustomize path safety restrictions (cross-folder loads).
- HPA compatibility with Rollouts (backend uses Rollout).
- Local npm install permissions (root-owned node_modules).

## How we solved it

- Made GitOps base self-contained under `k8s-manifests/base/`.
- Kept frontend HPA; documented backend autoscaling as a follow-up when using Rollouts.
- Documented local EACCES fix without changing permissions automatically.

## Outcome / validation

- GitOps validation script passes:
  - YAML parsing
  - overlay rendering
- Workflow YAML parses cleanly.
