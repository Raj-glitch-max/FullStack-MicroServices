# Terraform environment: prod (learning)

This is an example production-like environment.

## What it creates

- VPC (3 AZ)
- EKS cluster + OIDC
- ECR repos
- IAM for ALB controller + Karpenter + (optional) ExternalDNS

## How to use (later)

```bash
terraform init
terraform plan
terraform apply
```

## Next

After the cluster is created, Phase 3 continues with:

- ArgoCD install (`/argocd`)
- GitOps manifests (`/k8s-manifests`)

