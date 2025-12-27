# Phase 6 — Load generation, Jobs/CronJobs, and RBAC

## Goal

Add operational primitives: load testing, batch workloads, scheduled health checks, and required RBAC.

## What we did

- Implemented load generation:
  - DaemonSet curl load
  - stronger curl-based load to reliably trigger HPA
  - optional `hey` loadgen
- Added batch examples:
  - smoke test Job
  - health-check CronJob
  - fixed-duration load test Job
- Added Postgres backup CronJob writing `pg_dump` to a PVC.
- Added cleanup CronJob to delete completed Jobs older than N minutes.
- Added RBAC:
  - service account + Role/RoleBinding for job cleanup
  - observer role examples

## What we achieved

- Repeatable load demos that show scaling.
- A realistic batch toolkit (Jobs + CronJobs).
- Backup example that demonstrates stateful ops.
- Correct “least privilege” RBAC patterns.

## Tools / tech used

- Kubernetes Jobs, CronJobs
- RBAC (Role, RoleBinding, ServiceAccount)
- curl-based load generation
- Postgres `pg_dump`

## Why we did it this way

- Autoscaling is only credible if you can generate deterministic load.
- Batch workloads are common in production (health checks, maintenance, backups).
- RBAC is necessary for any workload that touches the Kubernetes API.

## How it was implemented

- Load DaemonSets run in-cluster against `backend-service`.
- Jobs/CronJobs use small containers and clear labels for log selection.
- Cleanup CronJob deletes stale Jobs using API permissions.

## Challenges faced

- Some clusters can’t pull arbitrary images (registry restrictions).
- Jobs can disappear quickly if cleanup runs aggressively.

## How we solved it

- Provided a strong-load DaemonSet using `alpine` to avoid registry issues.
- Documented label-based log retrieval for Jobs.

## Outcome / validation

- HPA scales reliably using strong load.
- Batch jobs run and logs are discoverable.
- Cleanup job works only thanks to RBAC (as designed).
