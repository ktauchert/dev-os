#!/usr/bin/env bash
# Create dev-projects table on DynamoDB Local (run after: docker compose up -d dynamodb-local)
set -euo pipefail

ENDPOINT="${DYNAMODB_ENDPOINT:-http://localhost:8000}"
TABLE="${TABLE_NAME:-dev-projects}"
REGION="${AWS_REGION:-eu-central-1}"

export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID:-local}"
export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY:-local}"
export AWS_DEFAULT_REGION="$REGION"

# Use host AWS CLI if installed; otherwise official CLI image (no local install).
aws_cmd() {
  if command -v aws >/dev/null 2>&1; then
    aws "$@"
    return
  fi
  if ! command -v docker >/dev/null 2>&1; then
    echo "Error: neither 'aws' nor 'docker' found." >&2
    echo "Install AWS CLI v2: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html" >&2
    echo "Or install Docker and re-run this script (uses amazon/aws-cli image)." >&2
    exit 1
  fi
  docker run --rm --network host \
    -e AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY \
    -e AWS_DEFAULT_REGION \
    amazon/aws-cli \
    "$@"
}

if aws_cmd dynamodb describe-table --table-name "$TABLE" --endpoint-url "$ENDPOINT" &>/dev/null; then
  echo "Table $TABLE already exists at $ENDPOINT"
  exit 0
fi

aws_cmd dynamodb create-table \
  --table-name "$TABLE" \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url "$ENDPOINT"

echo "Waiting for table $TABLE to become ACTIVE..."
aws_cmd dynamodb wait table-exists --table-name "$TABLE" --endpoint-url "$ENDPOINT"
echo "Done."
