# Phase 3 (learning): wire modules together.
#
# This is intentionally minimal scaffolding. You can implement the modules
# incrementally and keep `terraform plan` green as you go.

module "vpc" {
  source = "../../modules/vpc"
  cidr   = var.vpc_cidr
  region = var.aws_region
  tags   = merge(var.tags, { ClusterName = var.cluster_name })
  # AZs are chosen inside the module (or you can provide them)
}

module "eks" {
  source             = "../../modules/eks"
  cluster_name       = var.cluster_name
  region             = var.aws_region
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids  = module.vpc.public_subnet_ids
  tags               = var.tags
}

module "ecr" {
  source = "../../modules/ecr"
  tags   = var.tags
  repositories = [
    "backend",
    "frontend",
  ]
}

module "iam_irsa" {
  source            = "../../modules/iam-irsa"
  cluster_name      = var.cluster_name
  region            = var.aws_region
  oidc_provider_arn = module.eks.oidc_provider_arn
  oidc_provider_url = module.eks.oidc_provider_url
  tags              = var.tags
}
