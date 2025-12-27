# Backup & Disaster Recovery Runbook

This runbook is designed for portfolio demos and learning drills.

## Goal

Prove you can recover from:
- accidental deletion
- bad deployment
- cluster/node failure (conceptual)

## Recommended split

- **GitOps** (ArgoCD) = desired state of Kubernetes objects
- **Velero** = safety net for:
  - PVC snapshots
  - cluster metadata backup/restore

## Drill: namespace restore

1) Confirm app is healthy

- Frontend responds (/) 
- Backend responds (/health)

2) Create a backup (manual)

- Use Velero CLI: `velero backup create ...`

3) Simulate an incident

- Delete a workload or the entire namespace

4) Restore

- `velero restore create --from-backup ...`

5) Validate

- Deployment/Rollout recreated
- Services routing
- Postgres volume restored (if snapshotting enabled)

## Drill: bad release rollback

- Change backend image tag to a bad version
- Watch rollout fail analysis
- Restore a previous Git tag (GitOps rollback)

## Evidence for your portfolio

Capture:
- screenshots of Velero backup list
- screenshots of restore completion
- ArgoCD sync history showing rollback
