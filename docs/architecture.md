# Azaria SW Architecture

## 1. Overview

Azaria SW is a full-stack portfolio monorepo.

```text
Browser
   |
   v
Vercel - React/Vite client
   |
   v
Render - Express API
   |_______________
   |              |
   v              v
Neon          Cloudinary
PostgreSQL     Files
   |
   v
Prisma
```

GitHub API is accessed by the backend for GitHub-related data.

The frontend handles presentation and client state. The backend handles API logic, authentication, validation, persistence, file operations, integrations, security, and logging.

## 2. Repository

```text
azaria-sw/
|-- apps/
|   |-- client/          React/Vite frontend
|   `-- server/          Express backend
|-- docs/                Documentation
|-- .github/workflows/   GitHub Actions
|-- docker-compose.yml
|-- docker-compose.prod.yml
`-- package.json
```

The repository uses npm workspaces.

## 3. Frontend

Location: `apps/client/`

Main responsibilities:

- React UI and navigation
- Public portfolio
- Admin interface
- Forms and client validation
- Browser state and API requests
- Loading and error states

The frontend does not access PostgreSQL or backend secrets directly.

Its API communication goes through the Express backend.

## 4. Backend

Location: `apps/server/`

The backend uses Node.js and Express and follows a layered structure:

```text
Routes
  |
  v
Middleware
  |
  v
Controllers
  |
  v
Services
  |
  +--> Prisma --> PostgreSQL
  |
  +--> Cloudinary
  |
  `--> GitHub API
```

### Routes

Define HTTP endpoints and attach required middleware.

### Middleware

Handles cross-cutting concerns such as security, authentication, validation, uploads, request IDs, logging, rate limiting, missing routes, and errors.

### Controllers

Read HTTP input, call services, and build API responses.

### Services

Contain application and business logic, including database operations, file handling, caching, and external integrations.

### Prisma

Provides database access and schema/migration management.

## 5. Backend Structure

```text
apps/server/
|-- src/
|   |-- config/          Configuration
|   |-- constants/       Backend constants
|   |-- controllers/     HTTP handlers
|   |-- lib/             External library integration
|   |-- logger/          Logging
|   |-- middleware/      Request middleware
|   |-- prisma/          Prisma client
|   |-- routes/          API routes
|   |-- services/        Business logic
|   |-- utils/           Reusable helpers
|   |-- validators/      Zod validation
|   |-- app.js
|   `-- server.js
`-- prisma/
    |-- schema.prisma
    |-- seed.js
    `-- migrations/
```

## 6. Request Lifecycle

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
Validation / Authentication when required
  |
  v
Controller
  |
  v
Service
  |
  v
Database or External Service
  |
  v
Response
```

The exact order is determined by middleware registration in `app.js`.

## 7. Authentication

Admin authentication uses:

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
JWT
   |
   v
Protected API Requests
```

The backend is authoritative for authentication and authorization. Frontend route protection is only a UI concern.

## 8. Validation and Errors

Zod validates request data before business logic.

```text
Request
  |
  v
Validation
  |---- invalid --> Error Response
  |
  v
Controller -> Service
```

Application and unexpected errors are handled by the global error handler and returned using the API's standardized error format. Diagnostic details are logged server-side.

## 9. Database

Production database: Neon PostgreSQL.

Development/local database support is provided through Docker Compose.

Prisma is the database access layer.

Primary data includes:

```text
Profile
Project
ProjectImage
Skill
Experience
Education
Certificate
ContactMessage
```

Schema: `apps/server/prisma/schema.prisma`

Migrations: `apps/server/prisma/migrations/`

Seed: `apps/server/prisma/seed.js`

PostgreSQL stores structured data and file metadata/references, not uploaded binary files.

## 10. File Storage

Production files are stored in Cloudinary.

The backend handles:

```text
Upload
  |
  v
Validation
  |
  v
Cloudinary
  |
  v
Database file reference
```

Supported application assets include profile images, project images, certificate images, resume, and CV.

File operations are coordinated by backend services so replaced or deleted assets can be cleaned up.

The frontend accesses uploaded assets through the stored URLs.

## 11. GitHub Integration

```text
Frontend
   |
   v
Backend GitHub Service
   |
   v
GitHub API
```

GitHub integration remains behind the backend boundary.

GitHub responses are cached by the backend to reduce unnecessary external requests and improve response performance.

## 12. Frontend State

The frontend owns temporary UI state such as:

- Form state
- Selected files
- Modal state
- Navigation state
- Authentication UI state
- Loading/display state

Persistent application state belongs to the backend and its data stores.

## 13. Security Boundary

Security is distributed across several layers:

```text
CORS
 |
 v
Security Headers
 |
 v
Rate Limiting
 |
 v
Request Validation
 |
 v
Authentication
 |
 v
Authorization
 |
 v
Business Logic
 |
 v
Database / Storage
```

Secrets remain server-side and are supplied through environment variables.

## 14. Logging

The backend uses structured logging.

Request IDs allow related request, application, and error logs to be correlated.

Logging is intended for tracing, debugging, and operational monitoring without exposing secrets.

## 15. Deployment

The current production architecture is:

```text
Browser
   |
   v
Vercel
React frontend
   |
   v
Render
Express backend
   |
   +--> Neon PostgreSQL
   |
   +--> Cloudinary
   |
   `--> GitHub API
```

The frontend and backend are deployed independently.

Production database and uploaded files are external managed services, so they are not tied to the lifecycle of the application containers.

## 16. Docker

Docker provides reproducible local/production-style runtime configuration and image builds.

The repository contains:

```text
apps/server/Dockerfile
apps/client/Dockerfile
docker-compose.yml
docker-compose.prod.yml
```

The Compose configuration defines the application services and local persistence used by the Docker-based environment.

Docker is also validated by CI through server and client image builds.

## 17. CI/CD

GitHub Actions is defined in:

```text
.github/workflows/ci.yml
```

CI validates:

```text
Backend
- npm ci
- Prisma validation
- Prisma Client generation

Frontend
- npm ci
- ESLint
- Production build

Docker
- Server image build
- Client image build
```

On a successful push to `master`, the workflow triggers deployment hooks for Render and Vercel.

Deployment therefore occurs only after the required CI jobs succeed.

## 18. Dependency Direction

The main application dependency direction is:

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

Lower layers should not depend on higher-level HTTP or UI layers.

Examples:

```text
Services do not depend on controllers.
Controllers do not register routes.
Prisma does not depend on Express.
Backend infrastructure does not depend on React.
```

## 19. Data Ownership

```text
Structured application data -> Neon PostgreSQL
Uploaded files              -> Cloudinary
GitHub data                 -> GitHub API
Cached GitHub data          -> Backend cache
UI state                    -> React client
```

The backend coordinates data across these boundaries.

## 20. Architectural Principles

- Separation of concerns
- Layered backend design
- One-way dependency flow
- Backend-enforced security
- Server-side validation
- Centralized error handling
- Separate structured and file storage
- Environment-based configuration
- Reusable service logic
- Automated CI/CD validation

## 21. Summary

```text
React/Vite
    |
    | HTTP
    v
Express
    |
    +--> Prisma --> Neon PostgreSQL
    |
    +--> Cloudinary
    |
    `--> GitHub API

GitHub Actions
    |
    +--> Validate
    +--> Build
    `--> Deploy to Vercel/Render
```

The frontend is the presentation layer, the backend is the application boundary, Neon is the structured data store, Cloudinary is the file store, GitHub is an external integration, and GitHub Actions automates validation and deployment.
