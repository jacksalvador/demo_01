#!/bin/bash
if [ "$0" = "$BASH_SOURCE" ]
then
    echo "$0: Please source this file."
    echo "e.g. source ./set-terraform-env.sh tfvars-file"
    return 1
fi
echo $0
