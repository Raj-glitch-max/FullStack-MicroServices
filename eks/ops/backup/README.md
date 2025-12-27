# Backup & Disaster Recovery (Velero)

This folder documents a learning-first backup & restore setup using **Velero**.

## What Velero does

Velero can back up:
- Kubernetes objects (Deployments, Services, ConfigMaps, etc.)
- Persistent volumes (EBS snapshots on EKS) when configured

It can also restore those backups for disaster recovery drills.

## Typical EKS architecture

- Velero installed in namespace: `velero`
- Backup storage location: **S3 bucket**
- IAM auth: **IRSA** (recommended)
- Volume snapshots: EBS snapshots via AWS APIs

## Install (learning)

> Pin versions and configure least-privilege IAM in production.

High-level steps:

1) Create an S3 bucket (example name)

- `myapp-velero-backups-<account>-<region>`

2) Create an IAM policy for Velero

This repo includes a *starter* policy snippet (you should review and tighten it):

- `eks/ops/backup/velero-iam-policy.json`

3) Create an IAM role for ServiceAccount (IRSA)

- Namespace: `velero`
- ServiceAccount: `velero`

4) Install Velero

You can use the Velero CLI or Helm. Either way you’ll configure:
- bucket name
- region
- IRSA role ARN annotation on the serviceaccount

## Backup schedules

This repo includes example schedules:

- `eks/ops/backup/velero-schedule.yaml`

## Restore drill (what to practice)

1) Deploy app via ArgoCD
2) Create a backup
3) Delete namespace or delete key resources
4) Restore backup
5) Verify:
   - Pods come back
   - Services route correctly
   - Data volumes restored (if snapshotting was configured)

## Notes

- If you use Postgres with EBS snapshots, ensure consistent backups:
  - either stop writes (maintenance window)
  - or prefer logical backups (pg_dump) *plus* snapshots

- Velero is great for cluster-level DR drills and GitOps complement.
