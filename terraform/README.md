# Terraform IaC (Phase 3 – GitOps platform)

This folder is the **Infrastructure as Code** part of Phase 3.

Goal: one `terraform apply` creates the AWS foundation:

- VPC (3 AZs, public + private subnets)
- EKS cluster (OIDC enabled)
- ECR repositories (backend/frontend)
- IAM roles/policies for:
  - AWS Load Balancer Controller (IRSA)
  - Karpenter controller (IRSA) + node role
  - optional ExternalDNS (IRSA)
- Optional: CloudWatch log group integration pieces

> This repo intentionally keeps credentials out of Git. You’ll provide AWS creds in your environment later.

## Layout

- `environments/prod` – example production environment
  - uses modules for VPC, EKS, IAM, ECR
- `modules/*` – reusable Terraform modules

## How this pairs with ArgoCD

Terraform creates:
- the cluster + AWS resources
- **then** ArgoCD pulls Kubernetes manifests from Git and deploys apps/add-ons

In Phase 3, the workflow becomes:

1. `terraform apply` (infrastructure)
2. ArgoCD install (one-time)
3. Git push → ArgoCD auto-sync (continuous delivery)

## Prereqs (when you run it)

- Terraform v1.6+
- AWS creds
- `kubectl` + `helm` for the GitOps/app layers (not required for pure Terraform planning)

