# Phase 3: GitOps with ArgoCD + Terraform (Complete Platform)

This phase turns your repo into a production-style platform:

- **Terraform** provisions AWS infrastructure (VPC, EKS, IAM, ECR).
- **ArgoCD** deploys Kubernetes manifests from Git (no manual kubectl).

## Target architecture checklist

✅ EKS cluster (multi-AZ control plane)
✅ Nodes (Karpenter for autoscaling)
✅ App workloads (frontend/backend HPA)
✅ Storage (EBS gp3 via CSI)
✅ Ingress (ALB)
✅ Monitoring (Prometheus/Grafana/Alertmanager)
✅ Security (IRSA, RBAC, NetworkPolicies, encrypted EBS)
✅ Image automation (ArgoCD Image Updater)
✅ Progressive delivery (Argo Rollouts canary)
✅ Encrypted secrets in Git (Sealed Secrets)
✅ CI/CD (GitHub Actions → ECR → GitOps tag bump → ArgoCD sync)
✅ Backup/DR drill (Velero docs + schedules)

## Repo structure

- `terraform/` – IaC (Phase 3)
- `k8s-manifests/` – GitOps source of truth
- `argocd/` – ArgoCD Application definitions
- `eks/` – EKS install docs + examples
- `k8s/` – local/minikube learning manifests

## Workflow

1) Provision infrastructure

```bash
cd terraform/environments/prod
terraform init
terraform apply
```

2) Install ArgoCD (one-time)

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

3) Point ArgoCD at this repo

Edit:
- `argocd/applications/production.yaml` → set `repoURL` and `targetRevision`

Apply it:

```bash
kubectl apply -f argocd/applications/production.yaml
```

4) GitOps loop

- Change manifests under `k8s-manifests/`
- `git push`
- ArgoCD auto-syncs to EKS

## Notes and safety

- Karpenter and the ALB controller require IRSA + AWS-side IAM resources.
- For TLS on ALB, prefer ACM certificates.
- For secrets, prefer AWS Secrets Manager + External Secrets Operator.

### Implemented “portfolio extras” (remaining 20%)

- ArgoCD Image Updater annotations: `argocd/image-updater/`
- Progressive delivery example (Rollouts): `k8s-manifests/base/backend-rollout.yaml`
- Sealed Secrets workflow: `docs/security/sealed-secrets.md`
- CI/CD workflow: `.github/workflows/gitops-release.yml`
- Monitoring artifacts:
	- Alerts: `eks/ops/monitoring/app-alerts.yaml`
	- Dashboard JSON: `eks/ops/monitoring/grafana-dashboards/app-backend-overview.json`
- Backup/DR:
	- Velero schedules/policy: `eks/ops/backup/`
	- Runbook: `docs/ops/backup-dr.md`

### Known trade-off: backend autoscaling with Rollouts

The GitOps base uses an Argo `Rollout` for backend progressive delivery.
HPA examples exist for the learning cluster, but an HPA targeting a Deployment does not directly apply to a Rollout.
If you want autoscaling + progressive delivery together, the next enhancement is to adopt a Rollout-compatible autoscaling approach (e.g., KEDA) and document it.

