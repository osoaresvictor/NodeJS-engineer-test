resource "aws_launch_configuration" "launch_cfg" {
  name          = var.launch_configuration_name
  image_id      = var.ami_id
  instance_type = var.instance_type

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "autoscaling_grp" {
  launch_configuration = aws_launch_configuration.launch_cfg.id
  vpc_zone_identifier  = concat(var.public_subnet_ids, var.private_subnet_ids)
  desired_capacity     = var.desired_capacity
  max_size             = var.max_size
  min_size             = var.min_size

  tag {
    key                 = "Name"
    value               = var.autoscaling_group_name
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_policy" "scale_up" {
  name                   = "scale_up"
  scaling_adjustment     = var.scale_up_policy_adjustment
  adjustment_type        = "ChangeInCapacity"
  autoscaling_group_name = aws_autoscaling_group.autoscaling_grp.name
}

resource "aws_autoscaling_policy" "scale_down" {
  name                   = "scale_down"
  scaling_adjustment     = var.scale_down_policy_adjustment
  adjustment_type        = "ChangeInCapacity"
  autoscaling_group_name = aws_autoscaling_group.autoscaling_grp.name
}
