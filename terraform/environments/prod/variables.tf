variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "ap-south-1"
}

variable "cluster_name" {
  type        = string
  description = "EKS cluster name"
  default     = "production-cluster"
}

variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR"
  default     = "10.0.0.0/16"
}

variable "tags" {
  type        = map(string)
  description = "Common tags"
  default = {
    Project     = "microservices-app"
    Environment = "production"
  }
}
