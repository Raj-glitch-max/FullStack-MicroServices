# EKS deployment (learning + production-ready patterns)

This folder is a **learning pack** to move this repo from **Minikube (local)** to **AWS EKS (production Kubernetes)**.

It’s written to be safe to commit to Git:

- It contains **no AWS credentials**.
- It uses **placeholders** like `${AWS_ACCOUNT_ID}` and `${CLUSTER_NAME}`.
- You’ll provide AWS creds later (AWS CLI, IAM Identity Center, env vars, etc.).

> Region used in examples: **ap-south-1** (Mumbai)

## What changes when you go from Minikube → EKS?

| Area | Minikube | EKS (recommended) |
|---|---|---|
| Control plane | on your laptop | managed by AWS (HA across AZs) |
| Nodes | 1 node typically | multiple nodes across 3 AZs |
| Ingress | ingress-nginx | AWS Load Balancer Controller (ALB/NLB) |
| Storage | local PV / hostPath-ish | EBS CSI driver (gp3) |
| IAM | none | cluster role, node role, **IRSA** for pods |
| Scaling | HPA only | HPA + node autoscaling (Managed Node Group ASG or **Karpenter**) |
| DNS | CoreDNS only | CoreDNS + optional ExternalDNS to Route53 |
| TLS | self-signed secret | ACM certs (recommended) or cert-manager |

## Repo strategy: keep `k8s/` (local) and add `eks/` (cloud)

- `k8s/` stays as your Minikube / learning manifests.
- `eks/` contains EKS-focused configs + manifests.

You can run both from the same repo by switching contexts:

```bash
kubectl config get-contexts
kubectl config use-context <minikube-context>
kubectl config use-context <eks-context>
```

## Contents

- `cluster-config.yaml` — eksctl cluster config (VPC, private nodes, OIDC/IRSA)
- `storage/gp3-storageclass.yaml` — default gp3 StorageClass (EBS CSI)
- `alb/` — AWS Load Balancer Controller install notes + IAM policy
- `manifests/` — example EKS manifests (ECR images, ALB ingress)
- `irsa/` — IRSA example for pods to call AWS APIs without node-wide creds
- `ops/` — monitoring/logging options, Karpenter notes
	- `ops/monitoring/` — Prometheus + Grafana (kube-prometheus-stack)
	- `ops/karpenter/` — Karpenter NodePool/NodeClass examples
	- `ops/external-dns/` — Route53 DNS automation notes
	- `ops/logging/` — logging approaches (CloudWatch vs Loki etc.)
- `security/` — Pod Security Standards (PSS) + workload hardening checklist

## Cost notes (important)

EKS has a fixed control plane cost (~$0.10/hour). The biggest *variable* cost drivers are:

- NAT gateways (HA = 3 NATs)
- worker nodes (instance size & count)
- ALB/NLB
- storage (EBS)

For learning, you can start cheaper (fewer nodes, single NAT) and scale up the architecture once comfortable.

## Next steps

1. Create your cluster with `eksctl` using `cluster-config.yaml`.
2. Install EKS add-ons (EBS CSI, metrics-server if needed, etc.).
3. Install AWS Load Balancer Controller.
4. Push images to ECR.
5. Apply `eks/manifests/`.

See the README files under the subfolders for exact guidance.
