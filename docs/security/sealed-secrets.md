# Sealed Secrets (encrypted secrets in Git)

Sealed Secrets lets you store **encrypted Kubernetes secrets** safely in Git.

## Why it matters

- Plain `Secret` manifests are base64 only (not encryption).
- Sealed Secrets encrypts secrets to a **cluster-specific** public key.
- Only the controller in your cluster can decrypt them.

## Install (learning)

Install the controller (pin version in production):

- Namespace: `kube-system` or `sealed-secrets`

Official docs: https://github.com/bitnami-labs/sealed-secrets

## Workflow

1) Create a normal Secret yaml locally (don’t commit it)
2) Encrypt it with `kubeseal` → generates a `SealedSecret`
3) Commit the `SealedSecret` to Git
4) ArgoCD syncs the `SealedSecret`
5) Controller creates the decrypted `Secret` in-cluster

## Example in this repo

- Example manifest: `k8s-manifests/overlays/prod/secrets/db-sealedsecret.yaml`

> It contains placeholder encrypted data. You must generate your own sealed secret for your cluster.
