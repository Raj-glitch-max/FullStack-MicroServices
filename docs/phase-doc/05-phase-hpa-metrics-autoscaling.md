# Phase 5 — HPA + metrics-server autoscaling

## Goal

Enable autoscaling and prove it works using real metrics.

## What we did

- Installed/verified `metrics-server`.
- Added an HPA (autoscaling/v2) with CPU + memory targets.
- Added an optional “demo profile” for faster visible scaling.
- Validated HPA state (initial `<unknown>` metrics → stable metrics once warmed).

## What we achieved

- Horizontal autoscaling is active based on live metrics.
- Scaling behavior is controlled to avoid flapping.

## Tools / tech used

- Kubernetes HPA (autoscaling/v2)
- metrics-server
- `kubectl top pods`

## Why we did it this way

- HPA is a core production primitive.
- CPU-only autoscaling is often insufficient; memory is a useful second signal.

## How it was implemented

- HPA targets backend deployment (in minikube learning layer).
- Behavior tuning:
  - scale-up window
  - scale-down stabilization

## Challenges faced

- HPA shows `<unknown>` until metrics-server is ready and pods emit metrics.

## How we solved it

- Waited for metrics-server warmup and confirmed with `kubectl top`.
- Tuned thresholds and policies for a stable demo.

## Outcome / validation

- HPA shows current metrics.
- Replicas increase under load and scale down slowly (intentional cooldown).
