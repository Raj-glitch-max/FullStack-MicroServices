# Karpenter IAM/IRSA (learning)

This folder documents the IAM pieces Karpenter needs.

## Roles involved

1) **Karpenter controller role** (IRSA)
- Assumed by the Karpenter controller pod
- Allows creating/terminating EC2 instances, reading tags/subnets/SGs, etc.

2) **Karpenter node role** (instance profile)
- Assumed by EC2 nodes that Karpenter launches
- Allows nodes to:
  - join the cluster
  - pull from ECR
  - write logs/metrics (optional)

## Why two roles?

- Controller needs permission to manage infrastructure.
- Nodes need permission to function as nodes.
- Keeping them separate is least privilege.

## Learning workflow

Because you said “no AWS creds yet”, we keep these as templates:

- `controller-trust-policy.json` — trust relationship for IRSA
- `controller-policy.json` — high-level policy skeleton

In real production, follow the **official Karpenter docs** for the exact policy for your Karpenter version.
