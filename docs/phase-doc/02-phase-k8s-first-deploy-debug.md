# Phase 2 — First Kubernetes deploy & debugging (kind/minikube)

## Goal

Deploy the app to Kubernetes for the first time and fix early-stage failures (readiness, images, service wiring).

## What we did

- Applied first-pass manifests for backend, frontend, Postgres, and Redis.
- Investigated readiness timeouts that *looked like Postgres issues*.
- Discovered real root cause: **image pull timeouts / image availability** in the cluster runtime.
- Corrected service-to-service wiring (notably the frontend proxy upstream targeting the backend service).

## What we achieved

- Kubernetes objects create successfully.
- Pods become Ready once images are available.
- Correct internal routing: frontend → backend service.

## Tools / tech used

- Kubernetes primitives:
  - Deployments
  - Services
  - ConfigMaps/Secrets
- `kubectl describe`, `kubectl logs`
- Container runtime troubleshooting (image pull)

## Why we did it this way

- The fastest way to stabilize a first deploy is to:
  1) confirm images exist and can be pulled/loaded
  2) confirm networking/service names
  3) confirm probes

## How it was implemented

- For local clusters where registries can be flaky or blocked:
  - Images were loaded into the cluster runtime (kind/minikube approaches).
- Updated nginx proxy config to point to the correct backend Service name.

## Challenges faced

- **Misleading symptom**: readiness timeout looked like Postgres readiness.
- **Root issue**: image pulls failing/slow, causing pods never to start.

## How we solved it

- Confirmed failures using Pod events (ImagePullBackOff / timeouts).
- Ensured images were actually present in the cluster runtime.
- Fixed nginx upstream/service naming mismatch.

## Outcome / validation

- `kubectl get pods` shows backend/frontend pods Running/Ready.
- Service routing works inside cluster.
