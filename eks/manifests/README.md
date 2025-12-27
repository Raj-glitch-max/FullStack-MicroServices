# EKS app manifests (example)

These manifests are a **cloud-oriented** variant of the local `k8s/` manifests.

Main differences vs Minikube:

- Use **ECR images** (placeholders).
- Use **ALB Ingress** (`ingressClassName: alb`).
- Use **EBS gp3** storage class for Postgres PVC / volumeClaimTemplates.
- Prefer `ClusterIP` services (external access via ALB).
- Add production-ish hardening: securityContext, topology spread, terminationGracePeriod, etc.

## Before applying

1. Push backend and frontend images to ECR and update the image references.
2. Install AWS Load Balancer Controller.
3. Ensure EBS CSI driver is installed (eksctl addon in this repo’s cluster config).

## Apply order (later)

```bash
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f eks/storage/gp3-storageclass.yaml
kubectl apply -f eks/manifests/postgres.yaml
kubectl apply -f eks/manifests/redis.yaml
kubectl apply -f eks/manifests/backend.yaml
kubectl apply -f eks/manifests/frontend.yaml
kubectl apply -f eks/manifests/ingress-alb.yaml
```
