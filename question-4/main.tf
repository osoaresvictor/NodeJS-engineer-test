module "vpc" {
  source = "./modules/vpc"

  vpc_cidr        = var.vpc_cidr
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
  vpc_name        = var.vpc_name
}

module "autoscaling" {
  source = "./modules/autoscaling"

  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids
  private_subnet_ids = module.vpc.private_subnet_ids

  desired_capacity             = var.desired_capacity
  max_size                     = var.max_size
  min_size                     = var.min_size
  instance_type                = var.instance_type
  ami_id                       = data.aws_ami.latest.id
  scale_up_policy_adjustment   = var.scale_up_policy_adjustment
  scale_down_policy_adjustment = var.scale_down_policy_adjustment
  autoscaling_group_name       = var.autoscaling_group_name
  launch_configuration_name    = var.launch_configuration_name
}

data "aws_ami" "latest" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}
