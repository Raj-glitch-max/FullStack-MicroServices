# Contributing

Thanks for your interest in contributing!

## Development setup (quick)

- Backend: `backend/` (Node.js)
- Frontend: `frontend/` (React served by Nginx)
- Local Kubernetes learning manifests: `k8s/`
- GitOps source of truth: `k8s-manifests/` and `argocd/`

## How to contribute

1. Create a branch from `main`.
2. Keep changes focused and small.
3. Prefer updating/adding tests when you change logic.
4. For Kubernetes changes:
   - run `hack/validate_gitops.py` against the target overlay when applicable.

## Commit style

- Use short, descriptive commit messages.
- Example: `chore: add issue templates`

## Pull requests

- Include a concise summary.
- Link any relevant issues.
- Include screenshots for UI changes.

