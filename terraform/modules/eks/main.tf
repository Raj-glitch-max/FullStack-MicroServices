# Minimal EKS scaffold. For production, prefer terraform-aws-modules/eks/aws.

resource "aws_iam_role" "cluster" {
  name = "${var.cluster_name}-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "eks.amazonaws.com" },
      Action = "sts:AssumeRole",
    }]
  })

  tags = var.tags
}

resource "aws_eks_cluster" "this" {
  name     = var.cluster_name
  role_arn = aws_iam_role.cluster.arn

  vpc_config {
    subnet_ids = concat(var.private_subnet_ids, var.public_subnet_ids)
  }

  tags = var.tags
}

# For IRSA we need the cluster issuer URL.
resource "aws_iam_openid_connect_provider" "this" {
  url = aws_eks_cluster.this.identity[0].oidc[0].issuer

  client_id_list = ["sts.amazonaws.com"]

  # Thumbprint should be fetched from the issuer cert chain.
  # Placeholder: you will compute the correct thumbprint when running for real.
  thumbprint_list = ["0000000000000000000000000000000000000000"]

  tags = var.tags
}
