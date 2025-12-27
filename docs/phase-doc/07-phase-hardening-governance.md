# Phase 7 — Hardening & governance primitives

## Goal

Add “production-ish” safety controls: availability, security posture, and resource governance.

## What we did

- Added PodDisruptionBudgets (PDBs).
- Added NetworkPolicies (default-deny with explicit allows).
- Added PriorityClasses and assigned them to workloads.
- Added governance controls:
  - ResourceQuota
  - LimitRange

## What we achieved

- Higher availability under disruption and node churn.
- Clear traffic rules between tiers (ingress → frontend → backend → db/cache).
- Cluster scheduling prioritization to keep critical services up.
- Namespace guardrails to prevent runaway resource usage.

## Tools / tech used

- Kubernetes:
  - PDB
  - NetworkPolicy
  - PriorityClass
  - ResourceQuota + LimitRange

## Why we did it this way

These primitives are common in production clusters and demonstrate platform maturity:

- PDBs prevent accidental full downtime during maintenance.
- NetworkPolicies document and enforce communication boundaries.
- PriorityClasses help under resource pressure.
- Quotas/limits prevent noisy-neighbor and accidental runaway.

## How it was implemented

- Default-deny ingress/egress, then allow:
  - DNS to CoreDNS
  - ingress controller to frontend
  - frontend to backend
  - backend to postgres/redis
  - jobs to required dependencies
- Priority tiers:
  - `app-critical` (postgres/redis/backend)
  - `app-normal` (frontend)
  - `app-batch` (jobs/loadgen)

## Challenges faced

- NetworkPolicy enforcement depends on the CNI.

## How we solved it

- Documented that enforcement depends on cluster CNI.
- Provided troubleshooting checks to validate connectivity when policies are enforced.

## Outcome / validation

- Workloads remain accessible.
- Under simulated load/pressure, critical services have higher priority.
- Namespace guardrails apply.
