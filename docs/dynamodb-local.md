# DynamoDB lokal (Docker) + Denkmodell

**Nicht verwechseln:** **DynamoDB Local** = nur DynamoDB in einem Container. **LocalStack** = viele AWS-Services nachgebaut — für DevOS-M2 reicht DynamoDB Local.

**Offiziell:** [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) · [Docker image](https://hub.docker.com/amazon/dynamodb-local)

**Projekt-Sketch (Keys):** [aws-dev-workflow.md](./aws-dev-workflow.md#dynamodb-sketch-projects-mvp)  
**HTTP-Contract:** [api/openapi.yaml](./api/openapi.yaml)

---

## 1. Wo was im Repo liegt

```text
dev-os/
├── docker-compose.yml              # DynamoDB Local starten/stoppen
├── infrastructure/
│   └── dynamodb/
│       ├── create-table.sh         # Tabelle einmal anlegen (CLI → localhost:8000)
│       └── README.md               # Kurzreferenz
├── backend/
│   ├── .env.example                # TABLE_NAME, DYNAMODB_ENDPOINT, Region
│   └── src/lib/dynamo.ts           # Client liest diese Env-Vars (du implementierst)
└── docs/dynamodb-local.md          # diese Datei
```

**Daten:** Docker-Volume `dev-os-dynamodb-data` (überlebt `docker compose down`; weg bei `docker volume rm`).

**Secrets:** Keine echten AWS-Keys nötig für Local — Dummy-Credentials reichen.

---

## 2. Einrichtung Schritt für Schritt

### Voraussetzungen

- Docker (Compose v2)
- **Eines von beiden:**
  - [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) (`aws --version`), **oder**
  - nur Docker — dann nutzt `create-table.sh` automatisch das Image `amazon/aws-cli` (kein `aws` auf dem Host nötig)

#### AWS CLI auf Ubuntu installieren (optional, aber praktisch langfristig)

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o /tmp/awscliv2.zip
unzip -q /tmp/awscliv2.zip -d /tmp
sudo /tmp/aws/install
aws --version
```

ARM64 (z. B. einige Laptops): `awscli-exe-linux-aarch64.zip` statt `x86_64`.

### 2.1 Container starten

Im Repo-Root:

```bash
docker compose down
docker compose up -d dynamodb-local
```

**Hinweis:** Standard-Setup nutzt **`-inMemory`** (Daten weg nach `docker compose down`). Stabiler auf Linux als Volume-`dbPath` (kein SQLite-Permission-Ärger). Persistenz optional — Abschnitt unten.

Prüfen (Port **8000** = DynamoDB, nicht dein REST-Backend):

```bash
curl -s http://127.0.0.1:8000
```

Eine JSON-Antwort mit `MissingAuthenticationToken` ist **OK** — der Dienst läuft, `curl` sendet nur keine AWS-Keys.

**`aws dynamodb list-tables` braucht Dummy-Credentials** (auch lokal):

```bash
export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export AWS_DEFAULT_REGION=eu-central-1

aws dynamodb list-tables --endpoint-url http://127.0.0.1:8000
```

Ohne die drei `export`-Zeilen hängt oder scheitert die CLI oft. `localhost` vs `127.0.0.1` ist gleich, solange der Container auf `0.0.0.0:8000` mapped (siehe `docker compose ps`).

Wenn die CLI **in einem Docker-Container** läuft (`amazon/aws-cli`), ist `localhost:8000` **falsch** — dann `--network host` nutzen (wie in `create-table.sh`) oder Endpoint `http://host.docker.internal:8000`.

### 2.2 Tabelle anlegen (Schema)

DynamoDB hat **kein** SQL-`CREATE DATABASE` wie MariaDB. Du definierst:

- **Tabellenname** (`dev-projects`)
- **Partition Key** (PK) + optional **Sort Key** (SK)
- **Attribute** auf Items kommen beim **Schreiben** dazu (schemalos pro Item, außer Keys)

Für M2 ohne Auth (Option B):

| PK | SK | Weitere Attribute am Item |
| --- | --- | --- |
| `PROJECT#<uuid>` | `METADATA` | `id`, `name`, `description`, `sdlcPhase`, … |

Tabelle erstellen:

```bash
./infrastructure/dynamodb/create-table.sh
```

Oder manuell (gleicher Inhalt wie das Skript):

```bash
export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export AWS_DEFAULT_REGION=eu-central-1

aws dynamodb create-table \
  --table-name dev-projects \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000
```

**Verify:**

```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000
aws dynamodb describe-table --table-name dev-projects --endpoint-url http://localhost:8000
```

### 2.3 Backend-Env (lokal)

```bash
cp backend/.env.example backend/.env
```

Typisch in `backend/.env`:

```env
TABLE_NAME=dev-projects
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
DYNAMODB_ENDPOINT=http://localhost:8000
```

| Variable | Lokal | Lambda in AWS |
| --- | --- | --- |
| `TABLE_NAME` | `dev-projects` | z. B. `dev-projects` (dev stage) |
| `DYNAMODB_ENDPOINT` | `http://localhost:8000` | **nicht setzen** (SDK nutzt AWS) |
| `AWS_REGION` | `eu-central-1` | gleiche Region wie Tabelle |
| Keys | `local` / `local` | IAM-Rolle der Lambda |

### 2.4 Client im Code (`backend/src/lib/dynamo.ts`)

Gleicher Code für Local und AWS — nur Config wechselt:

```ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const endpoint = process.env.DYNAMODB_ENDPOINT // nur lokal gesetzt

const client = new DynamoDBClient({
  region: process.env.AWS_REGION ?? 'eu-central-1',
  ...(endpoint ? { endpoint } : {}),
  ...(endpoint
    ? {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'local',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'local',
        },
      }
    : {}),
})

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
})
```

In **Lambda** gibt es keine `DYNAMODB_ENDPOINT` — die Execution Role ersetzt Dummy-Credentials.

---

## 3. DynamoDB vs. MariaDB / Supabase (Mental Model)

| Gewohnt (relational) | DynamoDB |
| --- | --- |
| Tabellen + Spalten fix (Schema) | Tabelle nur mit **Key-Schema**; andere Felder sind **Attribute** am Item |
| `SELECT … WHERE` beliebig | **Access Pattern zuerst:** welche Queries brauchst du? |
| JOINs | Keine JOINs — Daten denormalisieren oder zweite Query |
| Primary Key oft `id` | **Composite Key** PK + SK sehr üblich (Single-Table Design später) |

Für DevOS Projects (dev): ein Item pro Projekt unter `PK=PROJECT#id`, `SK=METADATA`.

---

## 4. Operationen (was du im Repo brauchst)

SDK: `@aws-sdk/lib-dynamodb` (Document Client) — du arbeitest mit normalen JS-Objekten.

### Get one project (GET `/api/projects/:id`)

```ts
import { GetCommand } from '@aws-sdk/lib-dynamodb'

await docClient.send(
  new GetCommand({
    TableName: tableName,
    Key: { PK: `PROJECT#${id}`, SK: 'METADATA' },
  }),
)
// → Item oder undefined
```

### Put new / updated project (POST / PATCH)

```ts
import { PutCommand } from '@aws-sdk/lib-dynamodb'

await docClient.send(
  new PutCommand({
    TableName: tableName,
    Item: {
      PK: `PROJECT#${project.id}`,
      SK: 'METADATA',
      ...project,
    },
  }),
)
```

### List all projects (GET `/api/projects`)

**Dev ohne User (Option B):** es gibt keinen `USER#` — du musst alle Projekt-Items finden.

- **Einfach (dev OK):** `Scan` mit `FilterExpression` `begins_with(PK, :p)` und `SK = METADATA`  
  - Teuer in Prod bei großen Tabellen — für Lernen und wenige Projekte OK.  
- **Später mit Auth (Option A):** `Query` mit `PK = USER#<sub>` und `begins_with(SK, 'PROJECT#')` — das ist der prod-taugliche Weg.

Beispiel Scan (dev):

```ts
import { ScanCommand } from '@aws-sdk/lib-dynamodb'

const result = await docClient.send(
  new ScanCommand({
    TableName: tableName,
    FilterExpression: 'begins_with(PK, :prefix) AND SK = :sk',
    ExpressionAttributeValues: {
      ':prefix': 'PROJECT#',
      ':sk': 'METADATA',
    },
  }),
)
```

Sortierung `updatedAt desc` machst du in der App mit `sortProjectsByUpdated` aus `@dev-os/domain` (wie MSW).

### Delete (nicht im MVP-Contract)

`DeleteCommand` mit gleichem Key — erst relevant, wenn ihr DELETE dokumentiert.

---

## 5. CLI zum Debuggen (neben dem Backend)

Item schreiben:

```bash
aws dynamodb put-item \
  --table-name dev-projects \
  --endpoint-url http://localhost:8000 \
  --item '{
    "PK": {"S": "PROJECT#test-1"},
    "SK": {"S": "METADATA"},
    "id": {"S": "test-1"},
    "name": {"S": "Hello"}
  }'
```

Items lesen:

```bash
aws dynamodb scan --table-name dev-projects --endpoint-url http://localhost:8000
```

---

## 6. End-to-End-Workflow (dein Ziel ohne MSW)

```text
1. docker compose up -d dynamodb-local
2. ./infrastructure/dynamodb/create-table.sh
3. backend/.env mit DYNAMODB_ENDPOINT
4. Backend: repos/projects-repo.ts (Put/Get/Scan) + handlers + lokaler HTTP-Server
5. frontend/.env.local: VITE_MOCK_API=false, VITE_API_BASE_URL=http://localhost:3001
6. npm run dev (Frontend) + Backend-Prozess
7. UI-Aktion → Network → dein Backend → DynamoDB Local (Port 8000)
```

MSW aus = sofort sichtbar, wenn Schritt 4–5 fehlen.

---

## 7. Später: gleicher Code, AWS dev-Tabelle

1. Tabelle in AWS Console/CLI mit **gleichem Key-Schema** anlegen (`dev-projects`).  
2. Lambda: `TABLE_NAME` setzen, **kein** `DYNAMODB_ENDPOINT`.  
3. IAM: Lambda darf `dynamodb:GetItem`, `PutItem`, `Scan`/`Query` auf diese Tabelle.  
4. API Gateway URL → `VITE_API_BASE_URL`.

Local und Cloud unterscheiden sich nur in **Endpoint + Credentials**, nicht in Repo-Logik (wenn du `dynamo.ts` so baust).

---

## 8. Häufige Fehler

| Symptom | Ursache |
| --- | --- |
| `Cannot connect to localhost:8000` | Container nicht gestartet |
| `ResourceNotFoundException` | Tabelle nicht erstellt oder falscher `TABLE_NAME` |
| `The security token included in the request is invalid` | CLI ohne Dummy-Keys gegen Local |
| UI leer, Backend 200 | Falsche PK/SK beim Put; Scan-Filter passt nicht |
| Daten weg | `-inMemory` (default compose) — Tabelle nach Neustart mit `create-table.sh` neu anlegen |
| `aws` hängt / timeout | Container-Logs: `docker logs dev-os-dynamodb-local` — oft kaputtes SQLite-Volume; `docker compose down` + neues `up` |
| `MissingAuthenticationToken` bei curl | Normal ohne Keys; bei `aws` immer `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` setzen |

---

## 9. Nützliche Links

- [DynamoDB core components](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html)
- [PartiQL vs Document API](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ql-reference.html) — ihr nutzt Document API im Node-SDK
- [Best practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
