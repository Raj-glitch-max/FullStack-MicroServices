# Phase 1 — Docker builds & local reliability

## Goal

Get the **backend** and **frontend** Docker images building reliably and consistently across machines and CI.

## What we did

- Fixed Docker build failures where `npm ci` was being executed even when a lockfile was missing/empty.
- Made installs deterministic *when lockfiles exist*, and gracefully fall back to `npm install` when they don’t.
- Fixed an Nginx configuration copy/path issue in the frontend container build.

## What we achieved

- `docker build` works even if a developer cloned the repo without `package-lock.json`.
- Builds are more resilient and beginner-friendly.
- The container runtime behaves consistently between dev machines and learning clusters.

## Tools / tech used

- Docker + Dockerfiles
- Node.js (npm)
- Nginx (frontend container)

## Why we did it this way

- `npm ci` is great for reproducible builds, but it **requires** a valid lockfile.
- In learning repos, lockfiles are sometimes missing or intentionally not committed.
- A robust Dockerfile should handle both paths:
  - lockfile present → `npm ci`
  - lockfile absent → `npm install`

## How it was implemented

### Backend

- Backend Dockerfile now checks for a lockfile before running `npm ci`.
- If not present, it falls back to `npm install`.

### Frontend

- Same lockfile-aware approach.
- Also corrected the nginx config copy destination so the built image serves the React build correctly.

## Challenges faced

- **Hard failure during image build** because `npm ci` exits non-zero without a lockfile.
- Confusing symptoms because the error looks like a package or registry issue when it’s actually file-state.

## How we solved it

- Added conditional logic in Dockerfiles (lockfile detection).
- Kept the “best practice” path (`npm ci`) when the repo is in a strict/production mode.

## Outcome / validation

- Container images build consistently.
- Subsequent Kubernetes work (Minikube/EKS) doesn’t get blocked by build flakiness.
