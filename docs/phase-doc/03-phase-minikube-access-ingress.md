# Phase 3 — Minikube access, Ingress, and DNS stability

## Goal

Make the application accessible for users in a local learning cluster (Minikube), and stabilize cluster networking.

## What we did

- Deployed to Minikube.
- Exposed services via `minikube service` and then via Ingress.
- Debugged DNS failures inside cluster.
- Traced DNS instability to kube-proxy file descriptor limits / “too many open files”.

## What we achieved

- Stable in-cluster DNS resolution.
- Predictable access path to the application.
- Working ingress routing in Minikube.

## Tools / tech used

- Minikube
- Ingress controller (ingress-nginx)
- kube-proxy
- Linux sysctl / ulimit tuning

## Why we did it this way

- Local clusters are learning environments; you want a smooth “open in browser” path.
- DNS is foundational: if CoreDNS doesn’t resolve Services, nothing works.

## How it was implemented

- Enabled ingress-nginx.
- Used `/etc/hosts` host mapping for a local domain (`myapp.local`) when needed.
- Tuned OS/kernel limits and restarted kube-proxy to restore DNS stability.

## Challenges faced

- DNS failures that came and went.
- kube-proxy errors related to FD limits.

## How we solved it

- Increased file descriptor limits and ensured kube-proxy had enough resources.
- Restarted kube-proxy after tuning.

## Outcome / validation

- Service resolution works reliably: `backend-service`, `postgres-service`, `redis-service`.
- Ingress routes traffic consistently.
