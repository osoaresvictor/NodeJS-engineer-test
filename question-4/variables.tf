variable "region" {
  description = "The AWS region to create resources in"
  type        = string
  default     = "us-east-1"
}
variable "vpc_name" {
  description = "The Name tag for the VPC"
  type        = string
  default     = "my-vpc"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "A list of public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets" {
  description = "A list of private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "desired_capacity" {
  description = "The desired number of instances in the autoscaling group"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "The maximum number of instances in the autoscaling group"
  type        = number
  default     = 3
}

variable "min_size" {
  description = "The minimum number of instances in the autoscaling group"
  type        = number
  default     = 1
}

variable "launch_configuration_name" {
  description = "The Name tag for the Launch Configuration"
  type        = string
  default     = "my-launch-configuration"
}

variable "instance_type" {
  description = "The instance type for the EC2 instances"
  type        = string
  default     = "t2.micro"
}

variable "autoscaling_group_name" {
  description = "The Name tag for the Autoscaling Group"
  type        = string
  default     = "my-autoscaling-group"
}

variable "scale_up_policy_adjustment" {
  description = "The number of instances to add on scale up"
  type        = number
  default     = 1
}

variable "scale_down_policy_adjustment" {
  description = "The number of instances to remove on scale down"
  type        = number
  default     = 1
}
