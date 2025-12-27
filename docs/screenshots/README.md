# Screenshots checklist (portfolio)

This folder is for screenshots you can drop into your GitHub README.

Suggested structure:

```
docs/screenshots/
  01-argocd-root-app.png
  02-argocd-app-sync.png
  03-rollouts-steps.png
  04-github-actions-run.png
  05-ecr-images.png
  06-grafana-dashboard.png
  07-prometheus-alerts.png
  08-velero-backups.png
  09-velero-restore.png
```

## Recommended captures + captions

### 1) GitOps in ArgoCD

1. **Root app (App-of-Apps)**
   - File: `01-argocd-root-app.png`
   - Caption: “Root app manages child applications (App-of-Apps pattern).”

2. **Application details + sync status**
   - File: `02-argocd-app-sync.png`
   - Caption: “ArgoCD auto-sync + self-heal + prune enabled.”

### 2) Progressive delivery (Argo Rollouts)

3. **Rollout steps / canary progression**
   - File: `03-rollouts-steps.png`
   - Caption: “Backend Rollout canary steps with analysis gate.”

Tip: If you don’t use the UI, you can capture terminal output from:
- `kubectl argo rollouts get rollout backend -n default`

### 3) CI/CD (GitHub Actions)

4. **Successful workflow run**
   - File: `04-github-actions-run.png`
   - Caption: “CI builds images, pushes to ECR, and commits the GitOps tag bump.”

Optional:
- Add a screenshot of the commit diff showing `k8s-manifests/overlays/prod/kustomization.yaml` tag changes.

### 4) Artifact registry (ECR)

5. **ECR repositories/tags**
   - File: `05-ecr-images.png`
   - Caption: “ECR holds immutable build artifacts (images) referenced by GitOps.”

### 5) Monitoring (Prometheus/Grafana)

6. **Grafana dashboard**
   - File: `06-grafana-dashboard.png`
   - Caption: “Request rate, latency (p95), errors, and dependency health.”

7. **Prometheus alerts**
   - File: `07-prometheus-alerts.png`
   - Caption: “Custom alerts for error rate, latency, and dependency availability.”

### 6) Backup & DR (Velero)

8. **Backups list**
   - File: `08-velero-backups.png`
   - Caption: “Velero backups stored in S3 + optional PV snapshots.”

9. **Restore completed**
   - File: `09-velero-restore.png`
   - Caption: “Restore drill completed successfully.”

## Suggested README placement

- Put 2–3 “hero” screenshots near the top:
  - ArgoCD sync view
  - Rollouts canary view
  - Grafana dashboard

- Put the rest under a section like: “Evidence / Screenshots”.
