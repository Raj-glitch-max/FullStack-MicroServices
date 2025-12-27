# Monitoring on EKS (Prometheus + Grafana)

This is a **learning-first** monitoring setup using the Prometheus community stack.

## Why Prometheus/Grafana?

- Prometheus scrapes metrics from Kubernetes and your workloads.
- Grafana visualizes those metrics with dashboards.
- This is the most common “portable” stack across clusters.

On AWS you also have CloudWatch-native options, but Prometheus is excellent for learning and is widely used in production.

## What we install

We’ll use the Helm chart:

- **kube-prometheus-stack** (`prometheus-operator`, Prometheus, Alertmanager, Grafana)

It adds CRDs like `ServiceMonitor`/`PodMonitor` to make scraping Kubernetes services easy.

## Prereqs

- EKS cluster running
- `kubectl` configured to your EKS context
- `helm` installed

## Install (recommended namespace: monitoring)

```bash
kubectl create namespace monitoring
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  -n monitoring \
  -f eks/ops/monitoring/kube-prometheus-stack.values.yaml
```

## Access Grafana (learning)

For learning you can port-forward:

```bash
kubectl -n monitoring port-forward svc/kube-prometheus-stack-grafana 3000:80
```

Then open http://localhost:3000

Get the admin password:

```bash
kubectl get secret -n monitoring kube-prometheus-stack-grafana \
  -o jsonpath='{.data.admin-password}' | base64 -d
```

## Production notes

- Prefer exposing Grafana via an internal ALB + auth (or VPN) instead of public.
- Persist Grafana dashboards (EBS) if you want them durable.
- Add Alertmanager receivers (Slack/email/PagerDuty).

## Verify

```bash
kubectl get pods -n monitoring
kubectl get servicemonitors -A | head
```
