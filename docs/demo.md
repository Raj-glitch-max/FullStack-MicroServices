# Demo script (portfolio / interview)

A suggested 10–15 minute walkthrough using this repo.

## 0) Set the stage (1 min)

- Show repo structure: Terraform, ArgoCD, GitOps manifests.
- Explain: “Git is the source of truth.”

## 1) ArgoCD GitOps sync (2–3 min)

- Open ArgoCD UI.
- Show the root app (App-of-Apps): `platform-root-prod`.
- Drill into `microservices-app-prod`.
- Highlight:
  - Auto-sync
  - Self-heal
  - Prune

## 2) CI/CD release flow (2–3 min)

- Open GitHub Actions.
- Show workflow: `.github/workflows/gitops-release.yml`.
- Explain:
  - Build + push to ECR
  - Commit tag bump in `k8s-manifests/overlays/prod/kustomization.yaml`
  - ArgoCD syncs the updated tag

## 3) Progressive delivery (Rollouts) (3–4 min)

- Show backend is a Rollout:
  - `k8s-manifests/base/backend-rollout.yaml`
- Trigger a new backend image tag.
- Watch rollout steps:
  - 20% → analysis → 50% → pause → 100%

## 4) Monitoring (2–3 min)

- Port-forward Grafana (or show ALB internal access, if configured).
- Import dashboard JSON:
  - `eks/ops/monitoring/grafana-dashboards/app-backend-overview.json`
- Show alerts exist:
  - `eks/ops/monitoring/app-alerts.yaml`

## 5) Backup/DR drill (2–3 min)

- Explain the two layers:
  - GitOps restores Kubernetes objects
  - Velero restores cluster metadata and PV snapshots
- Show runbook:
  - `docs/ops/backup-dr.md`

## Closing (30s)

Summarize what you demonstrated:
- Terraform + EKS foundations
- GitOps deployments with ArgoCD
- Automated releases
- Progressive delivery
- Observability
- Backup & DR
