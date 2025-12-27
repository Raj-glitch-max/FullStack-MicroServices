# Phase 8 — EKS production-shaped learning pack

## Goal

Create an EKS-ready “production-shaped” pack: ingress, storage, monitoring, autoscaling, IRSA, and security.

## What we did

- Added EKS cluster scaffolding docs and examples (`eks/`).
- Added ALB controller docs and IAM policy.
- Added gp3 StorageClass for EBS.
- Added EKS-flavored app manifests with security posture:
  - securityContext
  - topology spread constraints
  - ClusterIP services
- Added monitoring pack:
  - kube-prometheus-stack values
  - ServiceMonitor examples
- Added Karpenter pack (manifests + IAM templates).
- Added IRSA examples and security guidance.

## What we achieved

A complete learning pack to deploy the same app to EKS with production-like defaults.

## Tools / tech used

- EKS (eksctl config)
- AWS Load Balancer Controller (ALB Ingress)
- EBS CSI + gp3 storage
- Prometheus/Grafana (kube-prometheus-stack)
- Karpenter
- IRSA (OIDC provider)

## Why we did it this way

- EKS is the target production-shaped environment.
- These features represent the common baseline for real platform work.

## How it was implemented

- `eks/cluster-config.yaml` provides a starter eksctl cluster config.
- `eks/manifests/` contains hardened app/service manifests.
- `eks/ops/` provides monitoring and autoscaling packs.

## Challenges faced

- CRD-based resources (ServiceMonitor, Karpenter) can’t be dry-run validated without CRDs.

## How we solved it

- Validated YAML syntax separately.
- Documented install order: install CRDs/controllers first, then apply CR resources.

## Outcome / validation

- EKS pack is self-contained and documented.
- Users can follow the docs to install controllers and deploy the app.
