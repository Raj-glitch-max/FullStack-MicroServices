# Karpenter on EKS (node autoscaling)

Karpenter is a Kubernetes-native node autoscaler.

## Why Karpenter?

- Scales nodes faster than traditional ASG-based scaling in many cases
- Better bin-packing (can reduce cost)
- Supports multiple instance types + Spot / On-Demand strategies

## What Karpenter needs (high level)

1. **IAM permissions** to launch/terminate EC2 instances
2. **Instance profile / node role** for the nodes it creates
3. **SQS queue** for interruption handling (Spot)
4. Cluster access + CRDs installed (Karpenter controller)

## Recommended approach in this repo

This repo is “learning safe”: we document the steps and provide manifests you apply *after* installation.

- Installation is typically done with Helm.
- AWS-side resources are typically created with CloudFormation/Terraform or `eksctl` helpers.

## Install steps (conceptual)

> This section is intentionally conceptual because you said you’ll add AWS creds later.

### 1) Enable OIDC for IRSA

Already done in `eks/cluster-config.yaml`:

- `iam.withOIDC: true`

### 2) Create IAM role for Karpenter controller (IRSA)

- Create an IAM role with trust policy for the EKS OIDC provider
- Attach Karpenter controller policy (AWS provides docs/policies per Karpenter version)

### 3) Install Karpenter controller

Usually:

- `helm upgrade --install karpenter oci://public.ecr.aws/karpenter/karpenter ...`

### 4) Apply NodeClass + NodePool

This repo provides examples:

- `eks/ops/karpenter/ec2nodeclass.yaml`
- `eks/ops/karpenter/nodepool.yaml`

These tell Karpenter:

- Which subnets and security groups to use
- Which AMI family
- Which instance types/capacity types (Spot/On-Demand)
- Consolidation behavior

## Safety / production notes

- Start with **max nodes** limits in NodePool
- Start with **On-Demand only**, then add Spot once stable
- Use PodDisruptionBudgets for critical workloads
- Prefer multi-AZ zone spread (you already do via topology spread constraints)

