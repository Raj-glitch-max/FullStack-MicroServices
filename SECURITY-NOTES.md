# Security notes (ops)

This file documents security-sensitive cleanup steps for this repo.

## What was fixed

- Removed committed secrets and key material from Git history:
  - `.env`
  - `.tls/tls.key`
  - `.tls/tls.crt`
- Removed hardcoded default DB password from `backend/server.js`.
- Added ignore rules to prevent re-adding:
  - `.env*` (except `.env.example`)
  - `.tls/` and common key/cert extensions
  - `*kubeconfig*`

## Required rotation / follow-ups

If these files or values were ever used outside your laptop, treat them as compromised.

1) **Database password**
- Rotate the Postgres user password used by Docker/K8s.
- Update your local `.env` (kept private) and any Kubernetes Secret you deploy.

2) **TLS keys**
- Delete/rotate any certs created from the committed private key.
- Re-issue a new self-signed cert (local) or replace with cert-manager (prod).

3) **GitHub tokens / cloud keys**
- If you ever put GitHub PATs, AWS keys, or kubeconfigs in the repo (even briefly), revoke/rotate them immediately.

## Recommended GitHub settings

- Enable GitHub Secret Scanning + Push Protection (repo settings).
- Add required status checks for `main`.
- Use GitHub Actions OIDC (already scaffolded) instead of long-lived cloud keys.

