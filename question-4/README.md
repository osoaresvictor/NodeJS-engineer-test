## Overview
Objectively, this terraform project sets up an autoscaling group on AWS using the latest AMI, creating both public and private subnets, and applying an autoscaling policy based on system load.

## Prerequisites
- Terraform >= 1.0.0
- AWS CLI
- AWS Account with appropriate permissions

## Configuration
1. **Provider Configuration**: Set the AWS region in `variables.tf`.
2. **VPC and Subnets**: Define CIDR blocks for VPC, public subnets, and private subnets in `terraform.tfvars`.
3. **Autoscaling Group**: Configure desired capacity, instance type, and scaling policies in `terraform.tfvars`.

## Usage
1. Initialize Terraform:
    ```bash
    terraform init
    ```
2. Apply the Terraform configuration:
    ```bash
    terraform apply
    ```
3. Confirm the apply action with `yes`.

## Modules

### VPC Module
- **main.tf**: Defines the VPC and its subnets.
- **variables.tf**: Declares variables for VPC CIDR and subnets.
- **outputs.tf**: Outputs the VPC ID and subnet IDs.

### Autoscaling Module
- **main.tf**: Sets up the launch configuration and autoscaling group, including scaling policies.
- **variables.tf**: Declares variables for autoscaling group configuration.
- **outputs.tf**: Outputs the name of the autoscaling group.

## Outputs
- **vpc_id**: The ID of the created VPC.
- **public_subnet_ids**: The IDs of the created public subnets.
- **private_subnet_ids**: The IDs of the created private subnets.
- **autoscaling_group_name**: The name of the created autoscaling group.
