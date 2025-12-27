output "cluster_name" {
  value = var.cluster_name
}

output "region" {
  value = var.aws_region
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "oidc_provider_arn" {
  value = module.eks.oidc_provider_arn
}
