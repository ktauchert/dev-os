# Backend — welche Datei wofür?

Du legst diese Dateien **selbst** an. Domain-Regeln kommen aus **`@dev-os/domain`** (nicht nochmal in `backend/src/domain/`).

**Contract:** [docs/api-projects.md](../docs/api-projects.md)  
**Vorbild fürs Verhalten:** [frontend/src/mocks/db/projects-db.ts](../frontend/src/mocks/db/projects-db.ts) + [projects-handlers.ts](../frontend/src/mocks/handlers/projects-handlers.ts)

**Empfohlene Reihenfolge:** `lib/` → `repos/` → `handlers/` → `index.ts`

---

## `src/lib/response.ts`

**Zweck:** Einheitliche Antworten für API Gateway (Status, Header, JSON-Body).

| Export (Beispiel) | Macht |
| --- | --- |
| `corsHeaders()` | `Access-Control-Allow-Origin` (z. B. `http://localhost:3000`), erlaubte Methods/Headers |
| `jsonResponse(status, body)` | `{ statusCode, headers, body: JSON.stringify(...) }` |
| `emptyResponse(status)` | z. B. `204` für OPTIONS |

Kein AWS-SDK, keine Business-Logik.

---

## `src/lib/apigw.ts`

**Zweck:** API Gateway **HTTP API v2** Event lesen (nicht Express).

| Export (Beispiel) | Macht |
| --- | --- |
| `getHttpMethod(event)` | `GET`, `POST`, `PATCH`, `OPTIONS` aus `event.requestContext.http.method` |
| `getPath(event)` | `event.rawPath` o. Ä. |
| `getProjectId(event)` | `event.pathParameters?.id` |
| `parseJsonBody<T>(event)` | Body parsen (inkl. `isBase64Encoded` falls nötig); bei leerem/ungültigem Body `null` |
| `handleOptions()` | CORS-Preflight → `204` + CORS-Header |

Referenz: [Lambda proxy integration (HTTP API)](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html)

---

## `src/lib/dynamo.ts`

**Zweck:** DynamoDB-Client einmalig + Tabellenname + Key-Helfer.

| Export (Beispiel) | Macht |
| --- | --- |
| `getTableName()` | `process.env.TABLE_NAME` — wirft, wenn fehlt |
| `getDocClient()` | `DynamoDBDocumentClient` (lazy singleton) |
| `projectPk(id)` | z. B. `` `PROJECT#${id}` `` (dev ohne Auth, siehe Workflow-Doc) |
| `PROJECT_SK` | z. B. `'METADATA'` |

Env in Lambda setzen: `TABLE_NAME=dev-projects` (Beispiel). Lokal: siehe [docs/dynamodb-local.md](../../docs/dynamodb-local.md) und `backend/.env.example` (`DYNAMODB_ENDPOINT`, Dummy-Credentials).

---

## `src/repos/projects-repo.ts`

**Zweck:** Persistenz — **nur** Lesen/Schreiben, keine HTTP-Statuscodes.

Spiegel die MSW-DB-Funktionen, aber mit DynamoDB (oder erst **In-Memory-Array** zum Üben, gleiche Signatur).

| Funktion | Macht |
| --- | --- |
| `listProjects()` | Alle Projekte → `sortProjectsByUpdated` aus `@dev-os/domain` |
| `findProject(id)` | Ein Projekt oder `undefined` |
| `insertProject(input)` | `buildNewProject(input)` → speichern → zurückgeben |
| `patchProject(id, patch)` | Laden → `applyProjectPatch` → speichern; fehlt ID → Error werfen (Handler mappt auf 404) |

**Item in Dynamo (M2 dev):** PK `PROJECT#<id>`, SK `METADATA`, Attribute = Felder von `Project` (oder ein JSON-Feld `data`).

**List:** `Scan` mit Filter (dev OK) oder später `Query` pro User (M3).

Importiert: `buildNewProject`, `applyProjectPatch`, `sortProjectsByUpdated`, Typen von `@dev-os/domain`.

---

## `src/handlers/projects.ts`

**Zweck:** Eine Route-Gruppe — HTTP-Regeln + Statuscodes, ruft nur **Repo** auf.

Entweder vier exportierte Handler oder ein Objekt mit Methoden; wichtig ist das Mapping:

| Route | Status | Logik |
| --- | --- | --- |
| `GET /api/projects` | 200 | `listProjects()` |
| `GET /api/projects/:id` | 200 / 404 | `findProject` — 404 `{ message: "Project not found" }` |
| `POST /api/projects` | 201 / 400 | Body `CreateProjectInput`; ohne `name.trim()` → 400; sonst `insertProject` |
| `PATCH /api/projects/:id` | 200 / 404 | partial `ProjectPatch`; nicht gefunden → 404 |

POST: `sdlcPhase` im Body **ignorieren** (Server nutzt `buildNewProject` → immer Discovery).

Kein Dynamo direkt hier — nur Repo + `jsonResponse`.

---

## `src/index.ts`

**Zweck:** **Ein** Lambda-Entry (`export const handler` oder `export async function handler`).

1. `OPTIONS` → `handleOptions()`
2. Pfad + Methode matchen:
   - `/api/projects` + GET → list handler
   - `/api/projects` + POST → create
   - `/api/projects/{id}` + GET → get
   - `/api/projects/{id}` + PATCH → patch
3. Unbekannt → `404` oder `405`

Das ist der Handler, den du in AWS als **Handler** einträgst (z. B. `index.handler` nach Build).

---

## Später (nicht für den ersten Slice)

| Datei | Wann |
| --- | --- |
| `esbuild.config.mjs` | Ein Bundle `dist/index.mjs` für Lambda Upload |
| `src/repos/projects-repo.memory.ts` | Optional: In-Memory-Repo zum Testen ohne AWS |
| Tests `*.test.ts` | Handler mit gemocktem Repo oder Integration gegen DynamoDB Local |

---

## Checkliste „fertig für M2“

- [ ] `npm run typecheck` im `backend/` grün
- [ ] Gleiche JSON/Status wie [api-projects.md](../docs/api-projects.md)
- [ ] `curl` gegen API Gateway dev stage
- [ ] Frontend: `VITE_MOCK_API=false`, `VITE_API_BASE_URL=<execute-api-url>`
