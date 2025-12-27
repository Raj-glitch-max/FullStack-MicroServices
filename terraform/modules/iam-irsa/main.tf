# IRSA role skeleton.
#
# In real usage you’d create roles per serviceaccount with a trust policy like:
#   system:serviceaccount:<namespace>:<serviceaccount>
#
# For Phase 3 learning, we keep this module as a documented placeholder.
# You’ll extend it as you pick which controllers to install.

locals {
  oidc_sub = "system:serviceaccount:kube-system:aws-load-balancer-controller"
}

resource "aws_iam_role" "alb_controller" {
  name = "${var.cluster_name}-alb-controller"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Federated = var.oidc_provider_arn },
      Action = "sts:AssumeRoleWithWebIdentity",
      Condition = {
        StringEquals = {
          "${var.oidc_provider_url}:sub" = local.oidc_sub,
        }
      }
    }]
  })

  tags = var.tags
}
