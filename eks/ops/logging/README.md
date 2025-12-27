# Logging on EKS

There are two common approaches:

## Option A: AWS-native (CloudWatch)

- Fluent Bit / ADOT collector ships container logs to CloudWatch Logs
- Works well for many teams

## Option B: Kubernetes-native

- Loki + Grafana
- Elasticsearch/OpenSearch

## Recommendation

For learning:
- start with Prometheus/Grafana for metrics
- add CloudWatch for logs (least operational burden)

For production:
- standardize log format (JSON)
- add request IDs
- set retention policies

