# CI/CD setup (production-shaped)

This repo uses a **GitOps** deployment model:

- GitHub Actions builds and signs images.
- GitHub Actions updates the GitOps overlay image tags in `k8s-manifests/`.
- ArgoCD syncs from Git and deploys into the cluster.

> No cluster credentials are used in GitHub Actions.

## Workflows

### 1) CI (`.github/workflows/ci.yml`)
Runs on PRs and pushes:

- backend: install + `npm run lint` + `npm run test`
- frontend: install + build + tests

### 2) Images (`.github/workflows/images.yml`)
Runs on push to `main` (and manual runs):

- builds backend + frontend Docker images
- pushes to GHCR
- signs images using **cosign keyless** (OIDC)
- generates SBOMs

### 3) GitOps promote (`.github/workflows/gitops-promote.yml`)

- On push to `main`, defaults to updating the **dev** overlay tag.
- Manually, you can pick `dev|staging|prod` and set a specific `sha`.
- For staging/prod it opens a PR so promotions are reviewed.

### 4) Security

- CodeQL: `.github/workflows/codeql.yml`
- Dependency Review: `.github/workflows/dependency-review.yml`

## One-time GitHub setup

### Enable GHCR publishing

- Repo Settings → Actions → General: allow workflows.
- Packages (GHCR) are written with `GITHUB_TOKEN` (no PAT required).

### (Optional) GitHub Environments

Create environments: `dev`, `staging`, `prod`.

Suggested protection rules:

- `prod`: required reviewers + restrict who can deploy (if you later add deploy-to-cluster steps)
- `staging`: required reviewers

## GitOps wiring (ArgoCD)

- ArgoCD should point at this repo and the overlay path.
- Example overlay paths:
  - `k8s-manifests/overlays/dev`
  - `k8s-manifests/overlays/staging`
  - `k8s-manifests/overlays/prod`

## Promotion flow

1. Merge PR to `main` → CI passes.
2. Images workflow publishes `:sha` images (and signs them).
3. GitOps Promote updates `dev` overlay to the new sha.
4. Create promotion PR for staging → merge.
5. Create promotion PR for prod → merge.
6. ArgoCD syncs the new tags.

