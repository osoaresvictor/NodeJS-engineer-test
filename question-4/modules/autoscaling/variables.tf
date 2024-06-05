variable "vpc_id" {
  description = "The VPC ID"
  type        = string
}

variable "public_subnet_ids" {
  description = "The IDs of the public subnets"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "The IDs of the private subnets"
  type        = list(string)
}

variable "desired_capacity" {
  description = "The desired number of instances in the autoscaling group"
  type        = number
}

variable "max_size" {
  description = "The maximum number of instances in the autoscaling group"
  type        = number
}

variable "min_size" {
  description = "The minimum number of instances in the autoscaling group"
  type        = number
}

variable "instance_type" {
  description = "The instance type for the EC2 instances"
  type        = string
}

variable "ami_id" {
  description = "The AMI ID to use for the EC2 instances"
  type        = string
}

variable "scale_up_policy_adjustment" {
  description = "The number of instances to add on scale up"
  type        = number
}

variable "scale_down_policy_adjustment" {
  description = "The number of instances to remove on scale down"
  type        = number
}

variable "autoscaling_group_name" {
  description = "The Name tag for the Autoscaling Group"
  type        = string
}

variable "launch_configuration_name" {
  description = "The Name tag for the Launch Configuration"
  type        = string
}
