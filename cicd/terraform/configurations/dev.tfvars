########## Terraform State file configuration
s3_bucket         = "terraform-state-056231226580-ap-northeast-2"
s3_folder_project = "demo_01"
s3_bucket_region  = "ap-northeast-2"
s3_tfstate_file   = "demo_01.tfstate"

# For AWS Region 
aws_region   = "ap-northeast-2"
environment  = "dev"
service_name = "demo_01"

common_tags = {
  CREATEDBY   = "terraform:demo_01"
  SYSTEM      = "demo_01"
  SERVICE     = "demo_01"
  ENVIRONMENT = "dev"
  USER        = "salva"
}
