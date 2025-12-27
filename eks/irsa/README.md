# IRSA (IAM Roles for Service Accounts)

IRSA is the recommended way to give Kubernetes pods AWS permissions.

## Why IRSA?

Without IRSA, you often end up attaching AWS permissions to the **node IAM role**, which means:

- every pod on the node can potentially use those permissions
- permissions are very broad

With IRSA:

- permissions are attached to a **Kubernetes ServiceAccount**
- only pods using that ServiceAccount get AWS credentials
- credentials are short-lived (STS)

## How IRSA works (conceptual)

1. EKS cluster has an OIDC provider (enabled in `eks/cluster-config.yaml`).
2. You create an IAM role with a trust policy allowing that OIDC provider.
3. You annotate a ServiceAccount with `eks.amazonaws.com/role-arn`.
4. Pods use the SA → AWS SDK uses a projected token → exchanges it for STS creds.

## In this repo

- `backend-serviceaccount.yaml` — example SA for the backend to access AWS APIs
- `external-dns-serviceaccount.yaml` — example SA for ExternalDNS (Route53)
- `s3-backup-policy.json` — example IAM policy for S3 backups (learning)
- `route53-policy.json` — example IAM policy for ExternalDNS (learning)

> These are templates. Replace `${AWS_ACCOUNT_ID}`, `${CLUSTER_NAME}`, hosted zone IDs, bucket names, etc.
