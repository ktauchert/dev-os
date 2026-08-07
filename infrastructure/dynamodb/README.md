# DynamoDB Local — quick reference

Full guide: [docs/dynamodb-local.md](../../docs/dynamodb-local.md)

```bash
# from repo root
docker compose up -d dynamodb-local
chmod +x infrastructure/dynamodb/create-table.sh   # once
./infrastructure/dynamodb/create-table.sh
# or: npm run dynamo:create-table
```

Needs **Docker**. AWS CLI on the host is optional — the script falls back to `docker run amazon/aws-cli`.

**Install AWS CLI (optional):** [AWS CLI install guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) — Ubuntu quick path in [docs/dynamodb-local.md](../../docs/dynamodb-local.md).
