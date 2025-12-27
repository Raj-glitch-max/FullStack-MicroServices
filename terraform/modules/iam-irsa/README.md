# Module: iam-irsa

Scaffolding module for creating IRSA roles for common controllers:

- AWS Load Balancer Controller
- Karpenter controller
- ExternalDNS
- App-specific roles (e.g., backend S3 access)

This is intentionally a skeleton for learning. In a production codebase you’d:

- pin exact policies per controller version
- build least-privilege policies per environment

