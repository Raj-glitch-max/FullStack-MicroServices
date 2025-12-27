# GitOps Kubernetes manifests (source of truth)

This folder is the **GitOps source of truth**.

ArgoCD will watch this directory and apply everything inside it to your cluster.

## Structure

- `base/` – shared, environment-agnostic manifests
- `overlays/prod/` – production overlay (EKS)
- `overlays/dev/` – optional dev overlay

## How it relates to the existing repo folders

- `k8s/` contains learning/minikube manifests.
- `eks/` contains EKS-specific examples and install docs.
- `k8s-manifests/` is the GitOps-managed *deployment* layer.

In Phase 3, you should avoid applying `kubectl apply -f k8s/...` manually to EKS.
Instead:

- commit changes here
- ArgoCD syncs automatically

