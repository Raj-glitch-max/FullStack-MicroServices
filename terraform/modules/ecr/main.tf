resource "aws_ecr_repository" "this" {
  for_each = toset(var.repositories)

  name = each.value

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = var.tags
}
