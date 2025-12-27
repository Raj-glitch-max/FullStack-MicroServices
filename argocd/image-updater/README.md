# ArgoCD Image Updater

This repo supports **automatic image updates** using ArgoCD Image Updater.

## What it does

- Watches container registries (ECR in this project)
- Detects new tags
- Updates your ArgoCD Application accordingly

This repo is set up for the **write-back-to-Git** pattern (recommended):
- Image Updater commits changes to Git (e.g. bumps tags in Kustomize overlays)
- ArgoCD syncs those Git changes

## Install (one-time)

You can install it into the `argocd` namespace.

> Pin versions in real production.

## Registry auth (ECR)

For ECR, Image Updater typically uses one of these approaches:

- IRSA + assumed role (best on EKS)
- Docker registry secret (simpler for demos)

This repo includes a placeholder secret manifest you can adapt:
- `argocd/image-updater/registry-secret.yaml`

## Enable for an app

Add annotations to your ArgoCD Application:

- Example: `argocd/applications/apps/prod/app.yaml`

This repo includes a ready-to-use patch:
- `argocd/image-updater/app-prod-image-updater-patch.yaml`

## Notes

- To keep credentials out of Git, create the registry secret out-of-band.
- For ECR + IRSA, create an IAM policy allowing `ecr:GetAuthorizationToken` and reads.
