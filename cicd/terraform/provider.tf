terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.32.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Environment = var.environment
      Terraform   = "True"
    }
  }
}
