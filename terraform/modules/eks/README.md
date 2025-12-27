# Module: eks

Creates an EKS cluster with:

- EKS control plane
- OIDC provider (for IRSA)

For learning, this module is intentionally scaffold-like.

In real production repos, teams often use:

- `terraform-aws-modules/eks/aws`

Outputs expected:
- oidc_provider_arn
- oidc_provider_url

