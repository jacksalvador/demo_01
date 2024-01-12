#!/bin/bash

# ./로 직접 실행하는 것을 방지하는 조건문이다. 직접 실행할 경우 스크립트 파일은 별도 프로세스로 실행되어
# 스크립트에서 세팅한 환경변수들이 프로세스 종료와 함께 날아간다. 따라서 source 혹은 . 으로 실행을 강제 
if [ "$0" = "$BASH_SOURCE" ]
then
    echo "$0: Please source this file."
    echo "e.g. source ./set-terraform-env.sh tfvars-file"
    return 1
fi

# configurations 파일을 파라미터로 넣어주는 것을 강제하는 조건문  eg) configurations/dev.tfvars
# -z 는 문자열의 길이가 0인지, 즉 문자열이 비어 있는지 확인하는 Test Operator로
# if [ -z "$1" ]는 스크립트 실행시 첫번째 파라미터($1)가 설정되어 있는지 확인
if [ -z "$1" ]
then
    echo "set-terraform-env.sh: You must provide the name of the configuration file."
    echo "e.g. source ./set-terraform-env.sh tfvars-file"
    return 1
fi

DIR=$(pwd)
DATAFILE="$DIR/$1"

# 환경변수들을 본격 세팅하기 전에 -f 는 configuration file이 파라미터($1)로 지정한 경로에 실재하는지 확인
if [ ! -f "$DATAFILE" ]; then
    echo "set-terraform-env.sh: Configuration file not found: $DATAFILE"
    return 1
fi

ENVIRONMENT=$(grep environment "$DATAFILE" | awk -F '=' '{print $2}' | sed -e 's/["\ ]//g')
S3BUCKET=$(grep s3_bucket\  "$DATAFILE" | awk -F '=' '{print $2}' | sed -e 's/["\ ]//g')
S3FOLDERPROJ=$(grep s3_folder_project "$DATAFILE" | awk -F '=' '{print $2}' | sed -e 's/["\ ]//g')
S3BUCKETREGION=$(grep s3_bucket_region "$DATAFILE" | awk -F '=' '{print $2}' | sed -e 's/["\ ]//g')
AWSDEPLOYREGION=$(grep aws_region "$DATAFILE" | awk -F '=' '{print $2}' | sed -e 's/["\ ]//g')
S3TFSTATEFILE=$(grep s3_tfstate_file "$DATAFILE" | awk -F '=' '{print $2}' | sed -e 's/["\ ]//g')
DYNAMOTABLE=$(grep dynamodb_table "$DATAFILE" | awk -F '=' '{print $2}' | sed -e 's/["\ ]//g')

# 모든 파라미터 값이 정상적으로 들어갔는지 확인
if [ -z "$ENVIRONMENT" ]
then
    echo "set-terraform-env.sh: 'environment' variable not set in configuration file."
    return 1
fi
if [ -z "$S3BUCKET" ]
then
    echo "set-terraform-env.sh: 's3_bucket' variable not set in configuration file."
    return 1
fi
if [ -z "$S3FOLDERPROJ" ]
then
    S3FOLDERPROJ=$(sed -nr 's/^\s*project_name\s*=\s*"([^"]*)".*$/\1/p' "$DATAFILE")
    if [ -z "$S3FOLDERPROJ" ]
    then
        echo "set-terraform-env.sh: 's3_folder_project' variable not set in configuration file."
        return 1
    fi
fi
if [ -z "$S3BUCKETREGION" ]
then
    echo "set-terraform-env.sh: 's3_bucket_region' variable not set in configuration file."
    return 1
fi
if [ -z "$AWSDEPLOYREGION" ]
then
    echo "set-terraform-env.sh: 'aws_region' variable not set in configuration file."
    return 1
fi
if [ -z "$S3TFSTATEFILE" ]
then
    echo "set-terraform-env.sh: 's3_tfstate_file' variable not set in configuration file."
    echo "e.g. s3_tfstate_file=\"infrastructure.tfstate\""
    return 1
fi

# backend.tf 파일을 생성
cat << EOF > "$DIR/backend.tf"
terraform {
  backend "s3" {
    bucket = "${S3BUCKET}"
    key    = "${S3FOLDERPROJ}/${AWSDEPLOYREGION}/${ENVIRONMENT}/${S3TFSTATEFILE}"
    region = "${S3BUCKETREGION}"
    dynamodb_table = "${DYNAMOTABLE}"
    encrypt = true
  }
}
EOF

# Verify if user has valid AWS credentials in current session
#if CALLER_IDENTITY=$(aws sts get-caller-identity 2>&1); then
#    echo "Using AWS Identity: ${CALLER_IDENTITY}"
#else
#    echo "set-terraform-env.sh: Please run 'get-temporary-aws-credentials.sh' first"
#    return 1
#fi

export DATAFILE
export TF_WARN_OUTPUT_ERRORS=1
rm -rf "$DIR/.terraform"

cd "$DIR"

echo "set-terraform-env.sh: Initializing terraform"
terraform init > /dev/null
