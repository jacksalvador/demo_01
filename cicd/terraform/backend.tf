terraform {
  backend "s3" {
    bucket = "terraform-state-056231226580-ap-northeast-2"
    key    = "demo_01/ap-northeast-2/dev/demo_01.tfstate"
    region = "ap-northeast-2"
    dynamodb_table = ""
    encrypt = true
  }
}
