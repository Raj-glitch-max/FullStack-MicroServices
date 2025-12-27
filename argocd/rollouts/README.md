# Progressive Delivery (Argo Rollouts)

This repo includes a **progressive delivery** example using **Argo Rollouts**.

## What you get

- A `Rollout` for the backend (canary strategy)
- Stable + canary services
- An `AnalysisTemplate` that checks the backend health endpoint

## Install Argo Rollouts (learning)

Install into its own namespace (recommended):

- Namespace: `argo-rollouts`

You can install via the official manifests (pin versions in production).

## How it integrates with ArgoCD

ArgoCD can sync Argo Rollouts custom resources after the Rollouts controller and CRDs are installed.

This repo wires the Rollouts resources into the GitOps overlay (prod) so they’re managed through Git.

## Demo flow

1) Apply / install Argo Rollouts
2) Deploy app via ArgoCD
3) Change backend image tag in `k8s-manifests/overlays/prod/kustomization.yaml`
4) Watch rollout progression in Argo Rollouts UI / kubectl

## Notes

- This is a demo-grade example; real production setups will add metrics-based analysis (Prometheus) and traffic shaping via ALB/Nginx/Istio.
