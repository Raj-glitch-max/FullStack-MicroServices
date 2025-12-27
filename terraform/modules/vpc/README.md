# Module: vpc

Creates a VPC suitable for EKS:

- 3 public subnets (ALB/NAT)
- 3 private subnets (nodes)
- IGW
- NAT (single for learning; HA variant can be added)

Outputs:
- vpc_id
- public_subnet_ids
- private_subnet_ids

Implementation note:
- In real projects, many teams use the community module `terraform-aws-modules/vpc/aws`.
- Here we keep this as a learning module scaffold.
