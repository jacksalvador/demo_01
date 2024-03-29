
resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "salva-an2-ddb-demo-01"
  billing_mode   = "PROVISIONED"
  read_capacity  = 10
  write_capacity = 10
  hash_key       = "Destination"
  range_key      = "TopScore"

  attribute {
    name = "Destination"
    type = "S"
  }

  attribute {
    name = "TopScore"
    type = "N"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled        = false
  }

  tags = merge(var.common_tags, {
    Name = "tag test"
  })
}
