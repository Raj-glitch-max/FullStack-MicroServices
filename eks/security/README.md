# Security hardening on EKS

This is a practical checklist for making Kubernetes workloads more production-ready.

## 1) Pod Security Standards (PSS)

Kubernetes has Pod Security Standards:

- `privileged`
- `baseline`
- `restricted`

For production, aim for `restricted` where possible.

How to enforce
- Use namespace labels, e.g.:
  - `pod-security.kubernetes.io/enforce: restricted`
  - `pod-security.kubernetes.io/audit: restricted`
  - `pod-security.kubernetes.io/warn: restricted`

Start with `warn` / `audit` first, then move to `enforce`.

## 2) Workload securityContext

Recommended defaults (you’ll see these in `eks/manifests/*.yaml`):

- `seccompProfile: RuntimeDefault`
- `allowPrivilegeEscalation: false`
- drop capabilities
- `runAsNonRoot: true`

## 3) NetworkPolicies

In EKS, NetworkPolicy enforcement depends on the CNI mode/add-on.

- Default AWS VPC CNI historically did not enforce NetworkPolicies by itself.
- In modern EKS you can enable network policy with AWS VPC CNI features or use a CNI like Calico/Cilium.

Rule of thumb
- Keep your NetworkPolicies (good hygiene)
- Verify enforcement in the cluster you deploy to

## 4) Secrets

Avoid hardcoding secrets in Git.

Production options
- AWS Secrets Manager + External Secrets Operator
- SOPS + KMS + GitOps

## 5) Supply chain

Consider adding:
- image scanning (ECR scan or Trivy)
- signing (cosign)
- admission policies (Kyverno/Gatekeeper)

