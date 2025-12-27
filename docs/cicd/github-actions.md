# CI/CD (GitHub Actions → ECR → GitOps → ArgoCD)

This repo uses a GitOps-friendly CI/CD flow:

1) GitHub Actions builds Docker images (backend + frontend)
2) Pushes them to Amazon ECR
3) Commits a tag bump into `k8s-manifests/overlays/prod/kustomization.yaml`
4) ArgoCD detects the Git change and syncs it

## Workflow file

- `.github/workflows/gitops-release.yml`

## Required GitHub Secrets

- `AWS_ROLE_TO_ASSUME`
  - Use GitHub OIDC (recommended)
  - Role needs permissions to push images to ECR

## IAM permissions (high level)

The assumed role should allow:

- `ecr:GetAuthorizationToken`
- `ecr:BatchCheckLayerAvailability`
- `ecr:CompleteLayerUpload`
- `ecr:InitiateLayerUpload`
- `ecr:PutImage`
- `ecr:UploadLayerPart`

## Notes

- This workflow uses `github.sha` as the image tag.
- In a production environment, add:
  - SBOM + vulnerability scanning
  - signed images (cosign)
  - environment promotion (dev → staging → prod)
