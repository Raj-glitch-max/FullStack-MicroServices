# Minimal VPC scaffold for learning.
# For production, consider terraform-aws-modules/vpc/aws.

data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  azs = slice(data.aws_availability_zones.available.names, 0, 3)
}

resource "aws_vpc" "this" {
  cidr_block           = var.cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = merge(var.tags, {
    Name = "${lookup(var.tags, "Project", "project")}-vpc"
  })
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags   = var.tags
}

# Public subnets
resource "aws_subnet" "public" {
  for_each = { for idx, az in local.azs : idx => az }

  vpc_id                  = aws_vpc.this.id
  availability_zone       = each.value
  cidr_block              = cidrsubnet(var.cidr, 8, 1 + each.key)
  map_public_ip_on_launch = true

  tags = merge(var.tags, {
    Name = "public-${each.value}"
    "kubernetes.io/role/elb" = "1"
    "kubernetes.io/cluster/${lookup(var.tags, "ClusterName", "production-cluster")}" = "shared"
  })
}

# Private subnets
resource "aws_subnet" "private" {
  for_each = { for idx, az in local.azs : idx => az }

  vpc_id            = aws_vpc.this.id
  availability_zone = each.value
  cidr_block        = cidrsubnet(var.cidr, 8, 11 + each.key)

  tags = merge(var.tags, {
    Name = "private-${each.value}"
    "kubernetes.io/role/internal-elb" = "1"
    "kubernetes.io/cluster/${lookup(var.tags, "ClusterName", "production-cluster")}" = "shared"
  })
}

# Route tables (simplified)
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  tags   = var.tags
}

resource "aws_route" "public_internet" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.this.id
}

resource "aws_route_table_association" "public" {
  for_each = aws_subnet.public
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

# NAT is intentionally omitted here to keep scaffold small.
# Add NAT + private route tables once AWS creds are available and you want full realism.
