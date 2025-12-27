# AWS Load Balancer Controller (ALB Ingress)

In Minikube you used `ingress-nginx`. In EKS, the common production option is **AWS Load Balancer Controller**.

## Why you need it

- Ingress objects don’t automatically create AWS ALBs by themselves.
- This controller watches `Ingress` / `IngressClass=alb` and creates/manages:
  - ALB
  - Target Groups
  - Security group rules

## Prereqs

- An EKS cluster created with OIDC enabled (`iam.withOIDC: true` in eksctl config)
- Helm installed on your machine
- AWS creds configured (you said you’ll add later)

## IAM policy

The controller needs AWS permissions. In learning mode you can create a dedicated IAM policy and attach it to a **Kubernetes ServiceAccount** using IRSA.

This folder includes a vendored `iam-policy.json` version so your install steps don’t depend on a live curl.

## Install steps (later)

```bash
# 1) Create IAM policy
aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://eks/alb/iam-policy.json

# 2) Create the controller service account (IRSA)
# Replace ${CLUSTER_NAME} and ${AWS_ACCOUNT_ID}
eksctl create iamserviceaccount \
  --cluster=${CLUSTER_NAME} \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --attach-policy-arn=arn:aws:iam::${AWS_ACCOUNT_ID}:policy/AWSLoadBalancerControllerIAMPolicy \
  --override-existing-serviceaccounts \
  --approve

# 3) Install controller
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=${CLUSTER_NAME} \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

# 4) Verify
kubectl get deployment -n kube-system aws-load-balancer-controller
```

## Notes

- For TLS, ALB typically integrates with **ACM certificates**.
- For DNS automation (Route53), add ExternalDNS (optional; see `eks/ops/`).
