# Phase 9 — Terraform IaC scaffolding

## Goal

Introduce Infrastructure-as-Code so the platform can be provisioned reproducibly.

## What we did

- Created `terraform/` with:
  - environment folder: `terraform/environments/prod/`
  - modules: `vpc`, `eks`, `ecr`, `iam-irsa`
- Ran Terraform initialization and validation.
- Kept it learning-first (placeholders for account IDs / thumbprints).

## What we achieved

- A clean IaC structure representing how production repos are laid out.
- Terraform validates successfully and can be extended incrementally.

## Tools / tech used

- Terraform
- AWS provider

## Why we did it this way

- Terraform modules encourage reuse and separation of concerns.
- Environments allow dev/staging/prod to differ safely.

## How it was implemented

- VPC module: public/private subnets and IGW (NAT intentionally noted as future).
- EKS module: minimal cluster scaffolding + OIDC provider placeholder.
- ECR module: repos for backend/frontend.
- IRSA module: skeleton role for controllers.

## Challenges faced

- HCL parsing errors during early scaffolding.

## How we solved it

- Corrected variable blocks and formatting.
- Re-ran `terraform validate` until green.

## Outcome / validation

- `terraform validate` returns: configuration valid.
