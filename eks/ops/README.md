# Ops add-ons for EKS (monitoring, logging, autoscaling)

This folder is intentionally documentation-heavy for learning.

## Monitoring & logging options

Quick links in this repo:

- Prometheus + Grafana (kube-prometheus-stack): `eks/ops/monitoring/README.md`
- Karpenter (node autoscaling): `eks/ops/karpenter/README.md`
- IAM/IRSA examples: `eks/irsa/`

### Option A: CloudWatch Container Insights (AWS-native)

Pros
- minimal Kubernetes components to operate
- integrates with AWS dashboards

Cons
- costs can grow with high log volume

Typical setup
- Enable EKS control plane logs (done in `cluster-config.yaml`)
- Enable Container Insights in CloudWatch (agent + Fluent Bit or ADOT)

### Option B: Prometheus + Grafana (Kubernetes-native)

Pros
- portable across clouds
- great for SRE-style workflows

Cons
- you run the stack (storage, upgrades, tuning)

Install guide in this repo:

- `eks/ops/monitoring/README.md`

## Node autoscaling

### Managed Node Group autoscaling

- Good default (simple).
- Uses EC2 Auto Scaling Group.

### Karpenter (recommended for modern clusters)

Karpenter can scale nodes faster and with better packing.

High level requirements
- IAM roles for nodes it launches
- an SQS queue for interruption handling (Spot)
- NodeClass / NodePool resources

Why it’s a “Part 2”
- It’s powerful but introduces more AWS IAM + resource concepts.
- Start with Managed Node Groups first, then move to Karpenter.

## External DNS (Route53)

If you want `app.example.com` instead of copying the ALB hostname, install ExternalDNS.

How it works
- Watches Ingress/Service resources
- Creates Route53 records automatically

Use IRSA so ExternalDNS can call Route53 without wide node permissions.

## Secrets

For production, avoid storing secrets in Kubernetes plaintext manifests.

Options
- AWS Secrets Manager + External Secrets Operator
- SOPS (age/KMS) + GitOps

