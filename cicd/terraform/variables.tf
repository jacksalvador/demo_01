########## Terraform State file configuration
variable "s3_bucket" { type = string }
variable "s3_folder_project" { type = string }
variable "s3_bucket_region" { type = string }
variable "s3_tfstate_file" { type = string }

# For AWS Region
variable "aws_region" { type = string }
variable "environment" { type = string }
variable "service_name" { type = string }

# For Common Tags
variable "common_tags" { type = map(string) }
