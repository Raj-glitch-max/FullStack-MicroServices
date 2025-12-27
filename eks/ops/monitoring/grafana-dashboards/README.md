# Grafana dashboards

This folder contains a small portfolio dashboard JSON.

## Import

1) Port-forward Grafana (see `eks/ops/monitoring/README.md`)
2) Grafana → Dashboards → New → Import
3) Upload `app-backend-overview.json`

## Production notes

For production, prefer provisioning dashboards via ConfigMaps + sidecar, and persist Grafana.
