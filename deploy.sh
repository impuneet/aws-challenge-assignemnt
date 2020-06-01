#!/usr/bin/env bash

export AWS_DEFAULT_REGION=us-east-2
export AWS_REGION=us-east-2
export AWS_DEFAULT_PROFILE=puneet

ACCOUNT_ID=$(aws sts get-caller-identity --profile puneet --query Account --output text)
SAM_BUCKET=${ACCOUNT_ID}-sam-deploy-${AWS_REGION}
set -e

STACK_NAME=aws-challenge

if ! aws s3api head-bucket --bucket "${SAM_BUCKET}" 2>/dev/null; then
 echo "Please create S3 bucket \"${SAM_BUCKET}\" as deployment bucket"
 echo "This bucket can be reused for all your SAM deployments"
 echo ""
 echo "aws s3 mb s3://${SAM_BUCKET}"
 exit 1
fi

#install dependencies and run test cases and b
npm --prefix ./backend install ./backend
#npm test --prefix backend/
npm --prefix ./backend run build ./backend


aws s3 cp backend/swagger.yaml s3://${SAM_BUCKET}/${STACK_NAME}/swagger.yaml
aws cloudformation package --template-file cfn.yaml --s3-bucket ${SAM_BUCKET} --s3-prefix ${STACK_NAME} --output-template-file cfn.packaged.yaml

aws cloudformation deploy --profile puneet --template-file cfn.packaged.yaml --stack-name aws-challenge --capabilities CAPABILITY_IAM --no-fail-on-empty-changeset

npm --prefix ./frontend install frontend/
npm --prefix ./frontend run build

BUCKET=$(aws cloudformation describe-stacks --stack-name ${STACK_NAME} --query "Stacks[0].Outputs[?OutputKey == 'WebappBucket'].OutputValue" --output text)
aws s3 sync --delete --exact-timestamps frontend/build/ s3://${BUCKET}
aws s3 cp frontend/build/index.html s3://${BUCKET}/index.html

CFURL=$(aws cloudformation describe-stacks --stack-name ${STACK_NAME} --query "Stacks[0].Outputs[?OutputKey == 'WebUrl'].OutputValue" --output text)
echo "Website is available under: ${CFURL}"