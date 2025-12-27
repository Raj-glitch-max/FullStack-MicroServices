# ArgoCD GitOps (Phase 3)

ArgoCD will continuously deploy your manifests from Git to your EKS cluster.

## Why ArgoCD?

- Git is the single source of truth
- Auto-sync (no manual kubectl)
- Self-heal (drift correction)
- Rollback via Git history

## Install (learning)

Common approach:

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Then create Applications from this repo (`argocd/applications/*`).

> For production, pin a version and consider HA mode.

## Deployment modes in this repo

### Option A: single Application (simplest)

Apply `argocd/applications/production.yaml`.

Pros: fewer moving parts.

### Option B: App-of-Apps (recommended as you grow)

Apply `argocd/applications/root-production.yaml`.

That *root* app then creates child apps from `argocd/applications/apps/prod/`.

Pros:
- split platform components vs app components later (monitoring, external-dns, etc.)
- keep a single “root” entrypoint in ArgoCD

## Important: set your repo URL

Before applying any ArgoCD Application, edit the `repoURL` fields:

- `argocd/applications/production.yaml`
- `argocd/applications/root-production.yaml`
- `argocd/applications/apps/prod/app.yaml`

## Safety notes

- `automated.prune: true` will delete resources that were removed from Git.
- Use separate namespaces/projects per environment once you add staging/dev.

