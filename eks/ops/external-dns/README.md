# ExternalDNS (Route53)

ExternalDNS automatically creates DNS records (Route53) from Kubernetes resources.

## Why you want it

Instead of copying the ALB hostname, you can have:

- `api.example.com` → created automatically from Ingress

## How it works

- Watches Ingresses/Services
- Calls Route53 API to upsert DNS records

## IRSA

Use IRSA so the ExternalDNS pods can call Route53.

- ServiceAccount template: `eks/irsa/external-dns-serviceaccount.yaml`
- IAM policy template: `eks/irsa/route53-policy.json`

## Install (conceptual)

Most common: Helm chart `bitnami/external-dns` or `kubernetes-sigs/external-dns`.

Key settings
- `provider: aws`
- `policy: upsert-only`
- `txtOwnerId: <clusterName>`
- `domainFilters: ["example.com"]`

