# Azaria SW Backend

## Overview

The Azaria SW backend is a REST API built with Node.js and Express. It is the server-side boundary for API logic, authentication, validation, persistence, file management, integrations, security, and logging.

- Location: `apps/server/`
- API base: `/api/v1`
- Endpoint reference: `docs/api.md`
- Architecture: `docs/architecture.md`
- Database: `docs/database.md`
- Security: `docs/security.md`
- Deployment: `docs/deployment.md`

## Stack

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| Node.js            | Runtime                    |
| Express.js         | HTTP server/routing        |
| PostgreSQL         | Relational persistence     |
| Prisma             | Database access/migrations |
| Zod                | Request validation         |
| JWT                | Admin authentication       |
| bcrypt             | Password hashing           |
| Multer             | Multipart uploads          |
| Cloudinary         | Production file storage    |
| Winston            | Application logging        |
| Morgan             | HTTP logging               |
| Helmet             | Security headers           |
| CORS               | Cross-origin protection    |
| Express Rate Limit | Rate limiting              |
| Compression        | Response compression       |
| Docker             | Runtime/image builds       |

## Responsibilities

The backend manages portfolio content, administrator authentication/authorization, request validation, PostgreSQL persistence, file storage coordination, GitHub integration/caching, contact messages, pagination/filtering/sorting, standardized responses/errors, security, and logging.

Primary resources:

```text
Profile
Skill
Project
ProjectImage
Experience
Education
Certificate
ContactMessage
```

## Architecture

```text
HTTP Request
    |
    v
Routes -> Middleware -> Controllers -> Services
                                        |
                      +-----------------+----------------+
                      v                 v                v
                   Prisma          Cloudinary       GitHub API
                      |
                      v
               P  ostgreSQL
```

- **Routes:** endpoint registration, middleware composition, controller selection.
- **Middleware:** security, authentication, validation, uploads, rate limiting, request IDs, logging, not-found handling, and errors.
- **Controllers:** read HTTP input, call services, return responses.
- **Services:** business logic, database operations, file coordination, caching, and integrations.
- **Prisma:** database abstraction and schema/migration workflow.

## Project Structure

```text
apps/server/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── lib/
│   ├── logger/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   └── server.js
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
├── Dockerfile
├── prisma.config.ts
├── package.json
└── .env.example
```

| Directory     | Responsibility             |
| ------------- | -------------------------- |
| `config`      | Runtime configuration      |
| `constants`   | Shared constants           |
| `controllers` | HTTP handlers              |
| `lib`         | External integrations      |
| `logger`      | Winston configuration      |
| `middleware`  | Request processing         |
| `prisma`      | Prisma client              |
| `routes`      | API definitions            |
| `services`    | Business/application logic |
| `utils`       | Reusable helpers           |
| `validators`  | Zod schemas                |

## Entry Points

`server.js` starts the HTTP server. `app.js` creates/configures Express, including security, compression, rate limiting, request IDs, logging, body parsing, routes, not-found handling, and global error handling.

Separating startup from application configuration keeps the application easier to run and test.

## Request Lifecycle

```text
Request
  |
  v
Security / Compression / Rate Limit
  |
  v
Request ID / Logging / Body Parsing
  |
  v
Route
  |
  v
Validation / Authentication (when required)
  |
  v
Controller
  |
  v
Service
  |
  +--> PostgreSQL
  +--> Cloudinary
  `--> GitHub API
  |
  v
Response
```

The exact middleware order is defined by `app.js` and route configuration.

## Routes

Routes under `src/routes/` cover:

```text
auth
certificate
education
experience
github
health
message
profile
project
skill
test
```

The versioned router provides the `/api/v1` boundary. Routes contain HTTP wiring rather than business logic.

## Controllers

Controllers are the HTTP boundary. They read request data/files, invoke services, return standardized responses, and forward failures to centralized error handling.

Controllers should not contain Prisma queries or resource business rules.

## Services

Current services:

```text
auth.service.js
cache.service.js
certificate.service.js
education.service.js
experience.service.js
file.service.js
github.service.js
health.service.js
message.service.js
profile.service.js
project.service.js
query.service.js
skill.service.js
```

Services contain database operations, business rules, transactions, file coordination, external API communication, caching, and query construction. They should remain independent of Express where practical.

## Validation

Zod validators live under `src/validators/` and validate request bodies, parameters, and query values.

```text
Request -> Validation -> Controller -> Service
              |
              `--> invalid -> Error Response
```

Invalid input should be rejected before business logic executes.

## Middleware

```text
authenticateAdmin.js  -> protected admin endpoints
errorHandler.js       -> centralized errors
logger.js             -> HTTP/application logging bridge
notFound.js           -> unmatched routes
requestId.js          -> request correlation IDs
security.js           -> Helmet/CORS/rate limiting
upload.js             -> multipart upload processing
validate.js           -> Zod validation middleware
```

Each middleware should have a focused responsibility.

## Database

Production uses Neon PostgreSQL; local PostgreSQL development is supported through Docker Compose. Prisma is the database access layer.

Important files:

```text
apps/server/prisma/schema.prisma
apps/server/prisma/seed.js
apps/server/prisma/migrations/
apps/server/prisma.config.ts
src/prisma/client.js
```

Database models include Profile, Skill, Project, ProjectImage, Experience, Education, Certificate, and ContactMessage.

PostgreSQL stores structured data and file references/metadata; production file binaries are stored in Cloudinary.

Detailed schema, relations, constraints, migration, backup, and recovery information belongs in `docs/database.md`.

## Database Flow

```text
Controller -> Service -> Prisma Client -> PostgreSQL
```

Controllers should not bypass services for database access.

## Migrations and Seed

Schema changes are represented by committed Prisma migrations in `apps/server/prisma/migrations/`.

Workflow:

1. Update `schema.prisma`.
2. Create and review the migration.
3. Apply and test it.
4. Update seed data if needed.
5. Commit schema and migration together.

Seed logic is in `apps/server/prisma/seed.js` and must respect database uniqueness and relationship constraints.

## Authentication

Administrator authentication uses:

```text
Challenge
    |
    v
Challenge Token
    |
    v
Username + Password
    |
    v
Admin JWT
    |
    v
Protected API Request
```

The backend is authoritative for authentication and authorization. Frontend route protection is only a UI concern.

Detailed security behavior belongs in `docs/security.md`.

## Password Security

Administrator passwords are never stored as plaintext. bcrypt handles hashing and verification.

```text
Password -> bcrypt -> Password Hash
```

## JWT

Successful administrator authentication produces a JWT. Protected requests are checked by `authenticateAdmin.js`. Signing configuration and secrets come from environment variables.

## File Storage

Production uploaded files are stored in Cloudinary.

```text
Upload -> Validation -> Cloudinary -> Database File Reference
```

Supported assets include profile images, project images, certificate images, resume, and CV.

Multer handles multipart requests. Upload/service layers coordinate validation, storage, replacement, deletion, and database references.

## GitHub Integration

```text
Frontend -> GitHub Route -> Controller -> Service -> GitHub API
```

Relevant modules:

```text
src/lib/github.js
src/services/github.service.js
src/controllers/github.controller.js
src/routes/github.routes.js
```

GitHub responses are cached through `src/services/cache.service.js` to reduce external requests and improve repeated response performance.

## Contact Messages

Public users submit contact messages through the API.

```text
Request -> Validation -> Message Service -> PostgreSQL
```

Administrative operations can retrieve/manage persisted messages. Validation and endpoint rate limiting protect the public submission boundary.

## Portfolio Resources

The backend exposes APIs for:

```text
Profile
Skills
Projects
Experience
Education
Certificates
Messages
```

Projects additionally support project images, ordering, replacement/deletion, and file references. Certificates support optional images.

Endpoint behavior belongs in `docs/api.md`.

## Query Utilities

Reusable query functionality is provided by:

```text
src/services/query.service.js
src/utils/pagination.js
src/utils/sorting.js
src/constants/pagination.js
```

These support consistent pagination, sorting, filtering, and query handling.

## Responses and Errors

```text
src/utils/ApiResponse.js
src/utils/ApiError.js
src/utils/asyncHandler.js
src/middleware/errorHandler.js
```

Successful operations use a consistent response format. `ApiError` represents expected failures; `asyncHandler` forwards asynchronous failures; the global error handler processes validation, authentication, authorization, not-found, Prisma, upload, application, and unexpected errors.

Diagnostic details are logged server-side rather than exposed unnecessarily to clients.

## Logging

```text
Morgan  -> HTTP logging
Winston -> Application logging
```

Logger configuration:

```text
src/logger/logger.js
src/middleware/logger.js
```

Logs support tracing, debugging, and operational diagnosis. Sensitive credentials and tokens must never be logged.

## Request IDs

`src/middleware/requestId.js` provides correlation IDs:

```text
Request
  |
  +--> HTTP log
  +--> Application log
  `--> Error log
```

This makes related events easier to trace.

## Security

Security is layered:

```text
CORS
  -> Security Headers
  -> Rate Limiting
  -> Validation
  -> Authentication
  -> Authorization
  -> Business Logic
  -> Database / Storage
```

Key protections include Helmet, CORS, rate limiting, JWT, bcrypt, challenge authentication, request validation, secure file validation, request IDs, and environment-based secrets.

Full security rules belong in `docs/security.md`.

## Configuration

Runtime configuration is centralized under `src/config/`:

```text
app.config.js
auth.config.js
database.js
env.js
github.config.js
upload.config.js
```

Environment-specific values must not be hardcoded or committed. Sensitive values include database credentials, JWT secrets, admin credentials, Cloudinary credentials, GitHub credentials, and environment-specific URLs.

## Docker

Docker provides reproducible runtime configuration and image builds.

```text
apps/server/Dockerfile
docker-compose.yml
docker-compose.prod.yml
```

Local Compose supports the application environment and PostgreSQL. Production uses managed persistence rather than depending on container filesystems for permanent data.

## Production Architecture

```text
Browser
   |
   v
Vercel
   |
   v
Render
Express API
   |
   +--> Neon PostgreSQL
   +--> Cloudinary
   `--> GitHub API
```

The backend is deployed independently from the React client. Neon provides relational persistence and Cloudinary provides production file storage.

## CI/CD

GitHub Actions is defined in:

```text
.github/workflows/ci.yml
```

Backend validation includes:

```text
npm ci
Prisma validation
Prisma Client generation
Docker image build
```

The complete pipeline also validates the frontend and Docker images. Successful validation on `master` triggers the production deployment hooks.

## Development Workflow

1. Configure environment variables.
2. Start PostgreSQL locally when required.
3. Generate Prisma Client when needed.
4. Apply migrations after schema changes.
5. Start the development server.
6. Test affected endpoints.
7. Inspect logs.
8. Run validation/CI checks.
9. Commit related changes.

Common server scripts:

```text
npm run dev
npm run start
npm run prisma:generate
npm run prisma:studio
npm run prisma:migrate
```

## Dependency Direction

```text
Routes
   |
   v
Controllers
   |
   v
Services
   |
   +--> Prisma
   +--> Cloudinary
   `--> GitHub API
```

Lower layers must not depend on higher HTTP/UI layers.

```text
Services do not import controllers.
Controllers do not register routes.
Prisma does not depend on Express.
Backend code does not depend on React.
```

## Maintenance Rules

A new resource normally requires:

```text
Validator
Controller
Service
Route
```

Persistent resources additionally require the appropriate Prisma model, migration, and seed changes.

Keep responsibilities separated:

```text
Route      -> HTTP wiring
Controller -> HTTP handling
Service    -> Business logic
Validator  -> Input boundary
Prisma     -> Persistence
```

Add utilities/configuration only when genuinely reusable.

## Debugging

For a failing API request, inspect:

1. URL and HTTP method
2. Authentication requirements
3. Request validation
4. Controller
5. Service
6. Prisma/database
7. Cloudinary/file handling
8. External GitHub calls
9. Backend logs
10. Request ID

### Database problems

A missing-table error does not automatically mean the Prisma schema is wrong. Check the connection, selected database, PostgreSQL availability, applied migrations, local Docker volume, and schema/database consistency before changing the schema.

### File problems

Check upload validation, service operations, Cloudinary results/references, database file references, and the frontend asset URL.

Detailed recovery procedures belong in `docs/database.md`.

## Production Checklist

Before production changes, verify:

- Environment variables are configured.
- Database connectivity is correct.
- Required migrations are applied.
- Prisma Client is generated.
- CORS allows intended origins.
- Authentication secrets are secure.
- Rate limits are appropriate.
- Cloudinary configuration is valid.
- Sensitive values are excluded from logs.
- Production API and asset URLs are correct.
- CI validation succeeds.

## Documentation Boundaries

| Document               | Focus                                          |
| ---------------------- | ---------------------------------------------- |
| `docs/backend.md`      | Backend responsibilities and systems           |
| `docs/architecture.md` | System architecture and dependency flow        |
| `docs/database.md`     | PostgreSQL, Prisma, schema, migrations, backup |
| `docs/security.md`     | Authentication and security                    |
| `docs/api.md`          | Endpoint-level behavior                        |
| `docs/deployment.md`   | Deployment and runtime configuration           |

Avoid duplicating detailed endpoint, database, security, or deployment information here.

## Current State

The backend provides:

- Express REST API and versioned routes
- Layered controllers/services
- Zod validation
- Prisma/PostgreSQL persistence
- Admin authentication and JWT authorization
- Cloudinary file storage
- GitHub integration and caching
- Contact message management
- Pagination, filtering, and sorting
- Standardized responses and errors
- Request IDs and Morgan/Winston logging
- Helmet/CORS/rate limiting
- Docker support
- CI validation and automated production deployment

The architecture supports adding new resources without another major reorganization.

## Summary

```text
React/Vite
     |
     | HTTP
     v
Express Backend
     |
     +--> Controllers
     |       |
     |       v
     |    Services
     |       |
     |       +--> Prisma --> Neon PostgreSQL
     |       +--> Cloudinary
     |       `--> GitHub API
     |
     `--> Middleware / Security / Logging
```

The backend is the trusted application boundary: it validates input, enforces authentication and authorization, coordinates business logic, persists structured data, manages production file storage, integrates with GitHub, and exposes a consistent REST API.
