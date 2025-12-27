# Phase 4 — TLS, Ingress rules, and Stateful Postgres

## Goal

Make ingress production-shaped (TLS + correct routing) and stabilize Postgres identity/storage.

## What we did

- Created two Ingresses so rewrite rules apply only to `/api`.
- Enabled TLS using a self-signed cert in a Kubernetes Secret (`app-tls-secret`).
- Redirected HTTP → HTTPS.
- Migrated Postgres from Deployment to StatefulSet.
- Added a headless service for stable pod DNS while keeping a stable service name `postgres-service`.

## What we achieved

- End-to-end HTTPS validation from outside the cluster.
- Stable Postgres network identity and storage semantics.

## Tools / tech used

- Kubernetes Ingress + TLS Secrets
- ingress-nginx
- Postgres StatefulSet + PVC

## Why we did it this way

- TLS + redirects are a realistic “production-ish” ingress posture.
- Postgres benefits from StatefulSet semantics (stable identity, storage attachment).

## How it was implemented

- TLS secret created from generated self-signed cert.
- Ingress split into:
  - root paths → frontend
  - `/api` → backend
- Postgres:
  - headless service for the StatefulSet
  - stable service for app connections

## Challenges faced

- Rewrite rules can unintentionally affect non-API routes.
- StatefulSet changes require careful service naming so apps don’t break.

## How we solved it

- Split ingress resources to avoid rewrite bleed.
- Kept `postgres-service` stable while adding the headless service for the StatefulSet.

## Outcome / validation

- `curl -k https://myapp.local/` works.
- `curl -k https://myapp.local/api/health` returns 200.
- Postgres pod remains stable across restarts.
