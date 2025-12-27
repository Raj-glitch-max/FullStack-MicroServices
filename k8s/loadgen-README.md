# HPA autoscaling test (real load)

> Phase 3 note: for EKS/GitOps deployments, the source-of-truth manifests live under `k8s-manifests/` and are meant to be synced by ArgoCD.
> This README remains focused on the local learning manifests in `k8s/` (Minikube-kind).

This repo already has an HPA on the `backend` Deployment (`backend-hpa`).

This folder includes a **DaemonSet load generator** you can apply to create sustained internal traffic against the backend service.

## Prereqs

This guide assumes you applied the baseline manifests in `k8s/` and that these “ops” primitives are also installed:

```bash
kubectl apply -f k8s/pdb.yaml
kubectl apply -f k8s/network-policies.yaml
kubectl apply -f k8s/priority-classes.yaml
```

### Quick verify (recommended)

```bash
kubectl get pdb -o wide
kubectl get networkpolicy
kubectl get priorityclass | grep '^app-'
```

### Outside-in verify (Ingress + TLS)

If you have `/etc/hosts` mapped (e.g. `myapp.local -> $(minikube ip)`), you can validate end-to-end routing over HTTPS:

```bash
curl -k -sS -D- https://myapp.local/ -o /tmp/front.html | head -n 20
curl -k -sS -D- https://myapp.local/api/health -o /tmp/api.json | head -n 20
cat /tmp/api.json
```

## What it does

- `loadgen-daemonset.yaml` starts **one load pod per node**.
- Each pod loops `curl` requests against `http://backend-service:3000/health`.
- It’s intentionally in-cluster so it doesn’t depend on ingress/TLS/host routing.

> Note: Minikube is usually single-node, so you’ll see one `loadgen-*` pod. On a multi-node cluster, you’ll get one per node.

## Start the load

```bash
kubectl apply -f k8s/loadgen-daemonset.yaml
kubectl rollout status ds/loadgen
```

### Watch autoscaling

```bash
kubectl get hpa backend-hpa -w
kubectl get deploy backend -w
kubectl top pods -l app=backend
```

## Tune the intensity

Edit environment variables in `k8s/loadgen-daemonset.yaml`:

- `CONCURRENCY`: number of parallel request loops per pod (bigger = more load)
- `SLEEP_SECONDS`: delay per request loop, set `0` for max load

Apply changes:

```bash
kubectl apply -f k8s/loadgen-daemonset.yaml
kubectl rollout status ds/loadgen
```

## Stop / cleanup

```bash
kubectl delete -f k8s/loadgen-daemonset.yaml
```

## Optional: deterministic load with `hey`

If you want a more repeatable load pattern than `curl` loops, apply the `hey` DaemonSet:

```bash
kubectl apply -f k8s/loadgen-hey-daemonset.yaml
kubectl rollout status ds/loadgen-hey
```

Stop it:

```bash
kubectl delete -f k8s/loadgen-hey-daemonset.yaml
```

> If `loadgen-hey` gets `ImagePullBackOff`, your cluster likely can’t pull from that registry.
> Use the strong curl-based DaemonSet below, which uses `alpine:3.20`.

## Strong-load DaemonSet (reliable HPA scale-up demo)

This is the “make it scale” version.

It uses a very high `curl` concurrency and works well in Minikube where pulling extra images may be blocked.

Apply it:

```bash
kubectl apply -f k8s/loadgen-strong-daemonset.yaml
kubectl rollout status ds/loadgen-strong
```

Watch scaling:

```bash
kubectl get hpa backend-hpa -w
kubectl get deploy backend -w
kubectl top pods -l app=backend
kubectl top pods -l app=loadgen-strong
```

Stop it:

```bash
kubectl delete -f k8s/loadgen-strong-daemonset.yaml
```

## Notes on scale down

Your HPA has a scale-down stabilization window (300s) and a 1-pod-per-minute policy, so scale down is intentionally slower.
You can temporarily shorten the stabilization window if you want a faster demo.

## Jobs & CronJobs (scheduled tasks)

This repo also includes examples you can use to learn one-off and scheduled tasks:

- `k8s/backend-smoketest-job.yaml`: a one-off Job that curls `backend-service` `/health` and fails if it’s not `200`.
- `k8s/backend-health-cronjob.yaml`: a CronJob that runs every 5 minutes and logs status.

Run the Job:

```bash
kubectl apply -f k8s/backend-smoketest-job.yaml
kubectl wait --for=condition=complete job/backend-smoketest --timeout=180s || true
kubectl logs -l app=backend-smoketest --tail=200
```

> Note: if a cleanup CronJob deletes completed Jobs quickly, the Job object may disappear.
> In that case, logs still exist on the Pod—use the label selector:

```bash
kubectl get pods -l app=backend-smoketest -o wide
kubectl logs -l app=backend-smoketest --tail=200
```

Enable the CronJob:

```bash
kubectl apply -f k8s/backend-health-cronjob.yaml
kubectl get cronjob backend-health
```

See recent runs:

```bash
kubectl get jobs --sort-by=.metadata.creationTimestamp
kubectl logs -l app=backend-health --tail=200
```

Cleanup:

```bash
kubectl delete -f k8s/backend-smoketest-job.yaml
kubectl delete -f k8s/backend-health-cronjob.yaml
```

## Postgres backup CronJob (pg_dump → PVC)

This creates a PVC (`postgres-backup-pvc`) and a CronJob (`postgres-backup`) that writes `pg_dump` files into that PVC.

Apply it:

```bash
kubectl apply -f k8s/postgres-backup.yaml
kubectl get pvc postgres-backup-pvc
kubectl get cronjob postgres-backup
```

Run a backup immediately (manual job from the CronJob):

```bash
kubectl create job --from=cronjob/postgres-backup postgres-backup-manual
kubectl wait --for=condition=complete job/postgres-backup-manual --timeout=180s
kubectl logs job/postgres-backup-manual --tail=200
```

List backup files in the PVC (one-off pod that mounts the PVC):

```bash
kubectl run backup-check --rm -i --restart=Never --image=alpine:3.20 \
	--overrides '{"apiVersion":"v1","spec":{"containers":[{"name":"backup-check","image":"alpine:3.20","command":["/bin/sh","-lc"],"args":["ls -lh /backups"],"volumeMounts":[{"name":"backup","mountPath":"/backups"}]}],"volumes":[{"name":"backup","persistentVolumeClaim":{"claimName":"postgres-backup-pvc"}}],"restartPolicy":"Never"}}'
```

Cleanup:

```bash
kubectl delete -f k8s/postgres-backup.yaml
```

## Cleanup CronJob (delete completed Jobs older than N minutes)

This CronJob is useful in learning clusters to keep completed Jobs from piling up.

Apply it:

```bash
kubectl apply -f k8s/jobs-cleanup-cronjob.yaml
kubectl get cronjob jobs-cleanup
```

Trigger an immediate run:

```bash
kubectl create job --from=cronjob/jobs-cleanup jobs-cleanup-manual
kubectl wait --for=condition=complete job/jobs-cleanup-manual --timeout=180s
kubectl logs job/jobs-cleanup-manual --tail=200
```

Cleanup:

```bash
kubectl delete -f k8s/jobs-cleanup-cronjob.yaml
```

## Fixed-duration load test Job (CI-friendly)

This is a one-off Job that generates load for a fixed duration and exits, so it’s easy to use in demos/CI.

Run it:

```bash
kubectl apply -f k8s/backend-loadtest-job.yaml
kubectl wait --for=condition=complete job/backend-loadtest --timeout=240s
kubectl logs job/backend-loadtest --tail=200
```

Cleanup:

```bash
kubectl delete -f k8s/backend-loadtest-job.yaml
```

## RBAC notes (service accounts)

Some workloads need Kubernetes API permissions.

- `k8s/jobs-cleanup-cronjob.yaml` creates a `ServiceAccount` **`job-cleaner`** with a Role/RoleBinding that allows `get/list/delete` on `batch/jobs`.
	That CronJob *must* have RBAC because it deletes Jobs.

- `k8s/rbac-observer.yaml` creates an optional read-only `ServiceAccount` **`app-observer`** that can `get/list/watch` common resources and read pod logs.
	It’s useful for demos and troubleshooting without giving full admin.

- `k8s/rbac-cluster-observer.yaml` creates a read-only **ClusterRole** + **ClusterRoleBinding** for cross-namespace observation.

### RBAC quick tests

```bash
kubectl auth can-i list pods --as=system:serviceaccount:default:cluster-observer
kubectl auth can-i list pods -n kube-system --as=system:serviceaccount:default:cluster-observer
kubectl auth can-i delete pods --as=system:serviceaccount:default:cluster-observer
```

## HPA demo profile (fast scaling)

If you want the HPA to react faster/more visibly during a demo:

1) Apply the demo HPA tuning:

```bash
kubectl apply -f k8s/hpa-demo-profile.yaml
kubectl get hpa backend-hpa -o wide
```

2) (Optional) temporarily lower backend CPU request to make utilization spike faster:

```bash
kubectl patch deploy backend -p '{"spec":{"template":{"spec":{"containers":[{"name":"backend","resources":{"requests":{"cpu":"50m","memory":"256Mi"},"limits":{"cpu":"500m","memory":"512Mi"}}}]}}}}'
kubectl rollout status deploy/backend
```

Rollback (restore normal behavior):

```bash
kubectl apply -f k8s/backend-hpa.yaml
kubectl apply -f k8s/backend.yaml
```

## ResourceQuota + LimitRange

To enforce namespace-level guardrails:

```bash
kubectl apply -f k8s/resource-quotas.yaml
kubectl apply -f k8s/limit-ranges.yaml
kubectl describe quota app-quota
kubectl describe limitrange app-limits
```

## NetworkPolicy notes (when enforcement is enabled)

`k8s/network-policies.yaml` includes a default-deny posture with explicit allows for:

- DNS egress to CoreDNS in `kube-system` (TCP/UDP 53)
- `ingress-nginx` → `frontend` (TCP 80)
- `ingress-nginx` and `frontend` → `backend` (TCP 3000)
- `backend` → `postgres` (TCP 5432) and `redis` (TCP 6379)
- batch Jobs/CronJobs labeled `app in (backend-smoketest, backend-health, backend-loadtest, postgres-backup)` → backend/postgres

If you ever apply these policies on a cluster where NetworkPolicy is enforced (depends on CNI), and something breaks, run these checks:

```bash
kubectl get pods -o wide
kubectl describe networkpolicy default-deny-ingress
kubectl describe networkpolicy default-deny-egress

# in-cluster validation
kubectl get pod -l app=frontend -o name | head -n 1 | xargs -I{} kubectl exec {} -- sh -lc 'wget -qSO- http://backend-service:3000/health 2>&1 | head -n 30'
kubectl get pod -l app=backend -o name | head -n 1 | xargs -I{} kubectl exec {} -- sh -lc 'getent hosts postgres-service && getent hosts redis-service'
```

## PriorityClass notes

These manifests set `priorityClassName` so that under pressure, the cluster will prefer keeping stateful/core services running:

- `app-critical`: postgres, redis, backend
- `app-normal`: frontend
- `app-batch`: loadgen + Jobs/CronJobs

Check what a running pod got:

```bash
kubectl get pod -l app=backend -o jsonpath='{.items[0].spec.priorityClassName}{"\n"}'
kubectl get pod -l app=frontend -o jsonpath='{.items[0].spec.priorityClassName}{"\n"}'
```
