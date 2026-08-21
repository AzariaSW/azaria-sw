# Azaria SW Architecture

## 1. Overview

Azaria SW is a full-stack portfolio application built as a monorepo.

The system consists of:

* React frontend
* Express backend
* PostgreSQL database
* Prisma ORM
* Persistent file storage
* GitHub API integration
* Docker-based runtime configuration
* GitHub Actions CI

The architecture is designed around separation of concerns.

The frontend is responsible for:

* User interface
* Client-side navigation
* Form interaction
* Client-side validation
* API communication
* Administrative interfaces
* Displaying portfolio content

The backend is responsible for:

* HTTP API handling
* Authentication
* Authorization
* Request validation
* Business logic
* Database access
* File management
* GitHub integration
* Error handling
* Logging
* Security

PostgreSQL is responsible for persistent structured data.

The upload volume is responsible for persistent uploaded files.

GitHub Actions is responsible for automated validation of changes.

---

## 2. High-Level Architecture

The application can be viewed as the following major components:

```text
+----------------------+
|      Web Browser     |
|                      |
| React Application    |
+----------+-----------+
           |
           | HTTP
           v
+----------------------+
|    Express Server    |
|                      |
| Routes               |
| Middleware           |
| Controllers          |
| Services             |
+----------+-----------+
           |
           +-------------------+
           |                   |
           v                   v
+----------------------+  +----------------------+
|      PostgreSQL      |  |   Upload Storage     |
|                      |  |                      |
| Portfolio data       |  | Images               |
| Admin data           |  | Documents            |
| Messages             |  | Temporary files      |
+----------------------+  +----------------------+

           |
           v

+----------------------+
|      GitHub API      |
|                      |
| Repository data      |
| Commit information   |
+----------------------+
```

The browser does not communicate directly with PostgreSQL.

The browser does not communicate directly with GitHub.

The Express backend acts as the application boundary between the frontend and external or persistent resources.

---

## 3. Repository Architecture

The repository is organized as a monorepo.

The major top-level directories are:

```text
azaria-sw/
|
+-- .github/
|   |
|   +-- workflows/
|
+-- apps/
|   |
|   +-- client/
|   |
|   +-- server/
|
+-- packages/
|   |
|   +-- shared/
|
+-- docker/
|
+-- docs/
|
+-- docker-compose.yml
+-- docker-compose.prod.yml
+-- package.json
+-- package-lock.json
+-- .dockerignore
+-- README.md
```

The `apps` directory contains the runnable application components.

The `packages` directory contains reusable packages.

The `docs` directory contains project documentation.

The `docker` directory contains Docker-related supporting configuration.

The `.github` directory contains CI workflows.

---

## 4. Application Boundaries

The application is divided into four primary runtime boundaries.

```text
+--------------------+
| Frontend           |
| apps/client        |
+---------+----------+
          |
          | HTTP
          v
+--------------------+
| Backend            |
| apps/server        |
+---------+----------+
          |
          +----------------+
          |                |
          v                v
+----------------+  +----------------+
| PostgreSQL     |  | File Storage   |
+----------------+  +----------------+
```

A fifth external dependency exists for GitHub functionality:

```text
Backend
   |
   v
GitHub API
```

The frontend should not contain database credentials, server secrets, JWT secrets, administrator credentials, or GitHub API credentials.

---

## 5. Frontend Architecture

The frontend is implemented with React.

The frontend application is located at:

```text
apps/client/
```

Its primary responsibilities are:

* Rendering the public portfolio
* Rendering the administrator interface
* Managing browser-side state
* Handling navigation
* Handling forms
* Communicating with the backend API
* Displaying API results
* Handling loading and error states

The frontend does not implement server-side business rules.

The frontend does not directly access PostgreSQL.

The frontend does not directly access the filesystem used by the backend.

---

## 6. Backend Architecture

The backend is implemented with Node.js and Express.

The backend application is located at:

```text
apps/server/
```

The backend follows a layered architecture.

The primary dependency direction is:

```text
Routes
   |
   v
Controllers
   |
   v
Services
   |
   v
Prisma
   |
   v
PostgreSQL
```

Middleware surrounds and supports the request pipeline.

Utilities and configuration provide reusable infrastructure without becoming business logic layers.

---

## 7. Backend Layer Responsibilities

### 7.1 Routes

Routes define HTTP endpoints.

Responsibilities include:

* Registering endpoints
* Selecting middleware
* Selecting controllers
* Defining route parameters
* Defining authentication requirements

Routes should not contain business logic.

A route should primarily answer:

```text
Which HTTP request is this?
Which middleware should run?
Which controller handles it?
```

---

### 7.2 Middleware

Middleware processes requests before or around controller execution.

The backend contains middleware for concerns such as:

* Authentication
* Error handling
* Logging
* Request IDs
* Security
* File uploads
* Request validation
* Missing routes

Middleware should focus on cross-cutting concerns.

Business rules should remain in services.

---

### 7.3 Controllers

Controllers form the HTTP handling layer.

Responsibilities include:

* Reading request data
* Calling services
* Preparing responses
* Returning HTTP status codes
* Returning standardized API responses

Controllers should not contain complex database logic.

Controllers should not directly manage Prisma queries when the operation belongs to a service.

---

### 7.4 Services

Services contain application business logic.

Services are responsible for operations such as:

* Creating records
* Updating records
* Deleting records
* Querying records
* Managing files
* Calling external APIs
* Managing cache behavior
* Coordinating multiple operations

Services should remain as independent from Express as practical.

This makes the business logic easier to reuse and test.

---

### 7.5 Prisma

Prisma is the database access layer.

It provides:

* Database queries
* Relationship handling
* Transactions
* Schema representation
* Migration support
* Generated database client

The backend uses Prisma instead of allowing controllers to construct raw database operations throughout the application.

---

### 7.6 PostgreSQL

PostgreSQL is the persistent relational database.

The database stores structured portfolio information such as:

* Profile
* Projects
* Project images
* Skills
* Experience
* Education
* Certificates
* Contact messages

Uploaded files themselves are stored in the upload storage rather than as binary data in PostgreSQL.

---

## 8. Backend Directory Responsibilities

The backend source follows this general organization:

```text
apps/server/
|
+-- src/
|   |
|   +-- config/
|   +-- constants/
|   +-- controllers/
|   +-- lib/
|   +-- logger/
|   +-- middleware/
|   +-- prisma/
|   +-- routes/
|   +-- services/
|   +-- utils/
|   +-- validators/
|   |
|   +-- app.js
|   +-- server.js
|
+-- prisma/
|   |
|   +-- schema.prisma
|   +-- seed.js
|   +-- migrations/
|
+-- uploads/
|
+-- Dockerfile
+-- package.json
```

The major responsibilities are:

| Directory        | Responsibility                    |
| ---------------- | --------------------------------- |
| `config`         | Application configuration         |
| `constants`      | Shared backend constants          |
| `controllers`    | HTTP request handlers             |
| `lib`            | External library integrations     |
| `logger`         | Logging configuration             |
| `middleware`     | Cross-cutting request processing  |
| `prisma`         | Prisma client access              |
| `routes`         | HTTP route definitions            |
| `services`       | Business logic                    |
| `utils`          | Reusable helper functions         |
| `validators`     | Zod request validation            |
| `prisma` at root | Schema, migrations, and seed data |
| `uploads`        | Uploaded file storage             |

---

## 9. Dependency Direction

The backend follows a one-way dependency direction.

```text
Routes
   |
   v
Controllers
   |
   v
Services
   |
   v
Prisma / External Services
```

Higher-level request handling may depend on lower-level application services.

Lower-level layers should not depend on higher-level HTTP implementation details.

Examples:

```text
Services should not import controllers.

Controllers should not define route registration.

Prisma should not depend on Express.

Database code should not depend on React.

```

This reduces coupling between application layers.

---

## 10. Request Lifecycle

The request lifecycle can be summarized as:

```text
Client
   |
   v
Express
   |
   v
Security Middleware
   |
   v
Compression
   |
   v
Rate Limiting
   |
   v
Request ID
   |
   v
Request Logging
   |
   v
Body Parsing
   |
   v
Router
   |
   v
Authentication
   |
   v
Validation
   |
   v
Controller
   |
   v
Service
   |
   v
Prisma / External Service
   |
   v
Response
```

This is a conceptual lifecycle.

The exact execution order depends on the middleware registration in the application.

The diagram therefore describes the architectural responsibilities rather than serving as a line-by-line representation of `app.js`.

---

## 11. Public Request Flow

A normal public request follows this general path:

```text
Browser
   |
   | GET /api/v1/profile
   v
Express
   |
   v
Route
   |
   v
Controller
   |
   v
Profile Service
   |
   v
Prisma
   |
   v
PostgreSQL
   |
   v
Profile Service
   |
   v
Controller
   |
   v
JSON Response
   |
   v
Browser
```

The browser only needs to know the API contract.

It does not need to know how the database query is implemented.

---

## 12. Administrative Request Flow

Administrative operations add authentication and authorization.

A simplified flow is:

```text
Administrator
     |
     v
Frontend Admin Interface
     |
     v
Authentication API
     |
     v
Challenge Verification
     |
     v
Login
     |
     v
JWT
     |
     v
Protected API Request
     |
     v
Admin Authentication Middleware
     |
     v
Validation
     |
     v
Controller
     |
     v
Service
     |
     v
Database / File Storage
```

The JWT is used for authenticated administrative requests.

Protected resources must not rely only on frontend route protection.

The backend remains responsible for authorization.

---

## 13. Authentication Architecture

The administrative authentication system uses a two-step process.

```text
Step 1
Admin
 |
 v
Challenge
 |
 v
Challenge Token


Step 2
Admin
 |
 v
Username + Password + Challenge Token
 |
 v
Authentication
 |
 v
JWT
```

The challenge provides an additional verification step before administrative login.

The backend validates the challenge before allowing the login operation.

After successful authentication, the backend issues a JWT.

The frontend uses the JWT for protected administrative API requests.

---

## 14. Authentication Boundary

The frontend may determine whether an administrator appears authenticated.

However, the backend is authoritative.

The architecture therefore follows:

```text
Frontend Authentication State
             |
             | convenience
             v
     Admin Interface


Backend Authentication
             |
             | authority
             v
     Protected Resource
```

A user who bypasses frontend restrictions must still be rejected by backend authentication middleware.

---

## 15. Validation Architecture

Request validation occurs before business logic.

The general flow is:

```text
Request
   |
   v
Validation Middleware
   |
   +---- invalid ----> Error Response
   |
   v
Controller
   |
   v
Service
```

Zod schemas are used for structured request validation.

Validation may apply to:

* Request body
* Route parameters
* Query parameters

The purpose is to prevent malformed input from reaching business logic.

---

## 16. Error Architecture

Errors are centralized.

The general error flow is:

```text
Controller
   |
   v
Service
   |
   +---- expected application error
   |
   v
ApiError
   |
   v
Global Error Handler
   |
   v
Standard API Response
```

Unexpected errors also reach the global error handler.

The backend therefore avoids implementing a different error response format in every controller.

---

## 17. Error Boundary

The error handler acts as the backend's final application-level boundary.

Conceptually:

```text
Route
  |
  v
Middleware
  |
  v
Controller
  |
  v
Service
  |
  +------ error ------+
                     |
                     v
              Error Handler
                     |
                     v
              HTTP Response
```

Errors should not expose internal implementation details to clients unnecessarily.

Detailed diagnostic information belongs in server logs.

---

## 18. File Storage Architecture

Uploaded files are separated from structured database data.

The backend stores files under:

```text
apps/server/uploads/
```

The current upload structure includes:

```text
uploads/
|
+-- certificates/
+-- cv/
+-- profile/
+-- projects/
|   |
|   +-- <project-id>/
|
+-- resume/
+-- temp/
```

The exact file names are generated rather than relying on the original client filename.

---

## 19. File Upload Flow

A simplified upload flow is:

```text
Browser
   |
   | multipart/form-data
   v
Upload Middleware
   |
   v
File Validation
   |
   v
Temporary / Managed Storage
   |
   v
Service
   |
   +-------------------+
   |                   |
   v                   v
Database            Final File
Record              Location
   |                   |
   +---------+---------+
             |
             v
          Response
```

The database stores references to files where required.

The file itself remains in persistent file storage.

---

## 20. File Categories

The application supports several major file categories.

```text
Profile
   |
   +-- profile image

Project
   |
   +-- project images

Certificate
   |
   +-- certificate image

Profile Documents
   |
   +-- resume
   +-- CV
```

Project images use project-specific directories.

This prevents unrelated project files from being mixed together.

---

## 21. Upload Persistence

Production Docker Compose defines a persistent upload volume.

```text
server-uploads
      |
      v
/app/apps/server/uploads
```

The purpose is to prevent uploaded files from disappearing when the server container is recreated.

The database volume is similarly persistent.

```text
postgres-data
      |
      v
/var/lib/postgresql/data
```

The application therefore separates:

```text
Structured persistent data
        |
        v
PostgreSQL volume

Uploaded persistent files
        |
        v
Server upload volume
```

---

## 22. Database Architecture

The backend uses:

```text
Application
    |
    v
Prisma Client
    |
    v
PostgreSQL
```

The Prisma schema is located at:

```text
apps/server/prisma/schema.prisma
```

Database migrations are located under:

```text
apps/server/prisma/migrations/
```

Seed logic is located at:

```text
apps/server/prisma/seed.js
```

---

## 23. Database Entity Layer

The primary application entities are:

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

Relationships between these entities are defined in the Prisma schema.

Project images are associated with projects.

Other entities represent independent portfolio sections or administrative data.

The database is the source of truth for structured portfolio content.

---

## 24. Database Migration Architecture

Database structure changes are tracked through Prisma migrations.

The migration flow is:

```text
Prisma Schema
     |
     v
Migration
     |
     v
PostgreSQL
```

Migrations provide a history of schema changes.

The migration history is stored in the Prisma migration table.

The project currently has migrations covering:

* Initial schema
* Seed-related constraints
* Contact messages
* Resume URL changes
* Project images
* Project image URL changes
* Certificate image support
* Profile phone
* Profile Telegram

The exact migration files remain the authoritative record of schema history.

---

## 25. Database and Application Consistency

The application expects the database schema to match the Prisma schema and migration history.

A newly created production database must therefore be initialized correctly before the server is expected to operate normally.

A database containing no application tables is not equivalent to a valid empty application database.

The expected state is:

```text
PostgreSQL
   |
   +-- Application tables
   |
   +-- Prisma migration history
   |
   +-- Application data
```

---

## 26. GitHub Integration

GitHub functionality is implemented on the backend.

The general flow is:

```text
Frontend
   |
   v
Backend GitHub Route
   |
   v
GitHub Service
   |
   v
GitHub API
```

The backend acts as the integration boundary.

This keeps GitHub credentials and integration logic outside the browser.

---

## 27. GitHub Caching

GitHub data is cached by the backend.

The purpose is to:

* Reduce external API requests
* Reduce response latency
* Avoid unnecessary repeated GitHub requests
* Improve resilience against API rate limits

The general flow is:

```text
Request
   |
   v
GitHub Service
   |
   v
Cache
   |
   +---- cached ----> Return cached data
   |
   +---- missing ---> GitHub API
                         |
                         v
                       Cache
                         |
                         v
                       Client
```

The cache behavior is implemented by the backend service layer.

---

## 28. Frontend and Backend Communication

The frontend communicates with the backend over HTTP.

The production container configuration exposes the backend on port `5000`.

The frontend is served through Nginx on port `80` inside its container.

The development or local published ports are configured through Docker Compose.

The conceptual relationship is:

```text
Browser
   |
   | HTTP
   v
Frontend
   |
   | API requests
   v
Backend :5000
```

The frontend does not communicate directly with PostgreSQL.

---

## 29. API Boundary

The backend exposes versioned API routes.

The API versioning structure allows future changes without immediately breaking existing clients.

The general structure is:

```text
/api/v1/
```

Detailed endpoints, request formats, response formats, and endpoint-specific behavior are documented separately in:

```text
docs/api.md
```

The API documentation is intentionally kept separate from this architecture document.

---

## 30. Docker Architecture

Docker provides the runtime environment for the application components.

The production Compose configuration defines three primary services:

```text
+----------------------+
| postgres             |
| PostgreSQL 16 Alpine |
+----------+-----------+
           |
           v
+----------------------+
| server               |
| Node.js + Express    |
+----------+-----------+
           |
           v
+----------------------+
| client               |
| Nginx + React build  |
+----------------------+
```

The services communicate over the Docker Compose network.

---

## 31. PostgreSQL Container

The PostgreSQL service uses:

```text
postgres:16-alpine
```

The database container provides:

* PostgreSQL runtime
* Database initialization
* Database health checking
* Persistent database storage

The PostgreSQL data directory is backed by:

```text
postgres-data
```

mounted at:

```text
/var/lib/postgresql/data
```

---

## 32. Server Container

The server is built from:

```text
apps/server/Dockerfile
```

The server container runs the Express backend.

Its published port is:

```text
5000:5000
```

The server depends on PostgreSQL becoming healthy before startup.

The production configuration also mounts:

```text
server-uploads:/app/apps/server/uploads
```

This preserves uploaded files independently from the server container lifecycle.

---

## 33. Client Container

The client is built from:

```text
apps/client/Dockerfile
```

The production client uses Nginx to serve the generated frontend.

The internal service port is:

```text
80
```

The local published port is:

```text
5173:80
```

The React application receives its build-time environment values through Docker build arguments.

---

## 34. Docker Service Dependencies

The primary dependency chain is:

```text
PostgreSQL
    |
    | healthy
    v
Backend
    |
    | started
    v
Frontend
```

The backend waits for PostgreSQL to become healthy.

The frontend waits for the backend service to start.

This controls container startup order.

It does not replace application-level connection error handling.

---

## 35. Persistent Volumes

The production Compose configuration defines two important persistent volumes.

```text
postgres-data
server-uploads
```

Their responsibilities are separate.

```text
postgres-data
    |
    +-- PostgreSQL database files


server-uploads
    |
    +-- Uploaded application files
```

Removing a container should not remove these volumes.

This is important for application data persistence.

---

## 36. Database Backup Strategy

The database should be treated independently from the application containers.

A database backup can be created using PostgreSQL backup tools such as `pg_dump`.

A backup can later be restored using `pg_restore` when the dump format supports it.

The architecture therefore treats:

```text
Application containers
```

and

```text
Persistent database data
```

as separate lifecycle concerns.

A database backup should not be considered a replacement for the persistent database volume.

The volume provides runtime persistence.

The backup provides recovery capability.

---

## 37. Deployment Architecture Status

The project currently has production-oriented Docker configuration.

The repository contains:

```text
docker-compose.prod.yml
```

The production Compose configuration provides:

* PostgreSQL
* Backend
* Frontend
* Persistent database storage
* Persistent upload storage
* Container health checking
* Service dependencies

Automatic cloud deployment is not currently part of the architecture.

Continuous deployment is intentionally postponed until the deployment target and domain strategy are selected.

---

## 38. Continuous Integration

GitHub Actions is used for CI validation.

The workflow is located at:

```text
.github/workflows/ci.yml
```

The CI workflow validates backend and frontend changes.

The major flow is:

```text
Git Push / Pull Request
          |
          v
     GitHub Actions
          |
          +------------------+
          |                  |
          v                  v
      Backend            Frontend
      Validation         Validation
```

---

## 39. Backend CI Validation

The backend CI job:

1. Checks out the repository.
2. Configures Node.js.
3. Uses the npm dependency cache.
4. Runs `npm ci`.
5. Validates the Prisma schema.

The Prisma validation command verifies that the schema is structurally valid.

This prevents invalid Prisma schema changes from passing CI.

---

## 40. Frontend CI Validation

The frontend CI job:

1. Checks out the repository.
2. Configures Node.js.
3. Uses the npm dependency cache.
4. Runs `npm ci`.
5. Runs frontend ESLint.
6. Builds the production frontend.

The frontend build is important because linting alone does not guarantee that the application can be bundled successfully.

The build also verifies that the required Vite environment values are available during CI.

---

## 41. CI Boundary

CI validates source changes.

It does not currently perform deployment.

The current architecture is:

```text
Developer
    |
    v
Git Push / Pull Request
    |
    v
GitHub Actions
    |
    +---- Backend validation
    |
    +---- Frontend lint
    |
    +---- Frontend build
    |
    v
Validation Result
```

Deployment will be added later when the hosting environment is selected.

---

## 42. Configuration Architecture

Configuration is separated from application logic.

The backend uses environment variables for values such as:

* Database connection
* Application environment
* Port
* Client URL
* Authentication secrets
* GitHub configuration
* JWT configuration
* Upload configuration

Secrets should not be committed to source control.

The repository provides example environment files where appropriate.

---

## 43. Secret Boundary

Secrets belong to the backend environment.

Examples include:

```text
DATABASE_URL
JWT_SECRET
ADMIN_PASSWORD_HASH
ADMIN_SEQUENCE_HASH
GITHUB_TOKEN
```

The frontend should only receive values that are safe to expose to the browser.

Build-time frontend variables should therefore never contain backend secrets.

---

## 44. Security Architecture Boundary

Security controls are distributed across the application.

The major security layers are:

```text
Browser
   |
   v
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

Security is therefore not implemented as a single middleware or single feature.

The detailed security model is documented separately in:

```text
docs/security.md
```

---

## 45. Logging Architecture

The backend uses structured application logging.

Logging serves several purposes:

* Request tracing
* Error investigation
* Application monitoring
* Operational debugging

Request IDs provide a way to associate related log messages.

A simplified flow is:

```text
Request
   |
   v
Request ID
   |
   v
Logger
   |
   +---- request log
   |
   +---- application log
   |
   +---- error log
```

Logs should contain useful diagnostic information without exposing secrets.

---

## 46. Request Identification

Requests are assigned request identifiers.

The request ID can be used to connect:

```text
Incoming request
       |
       v
Controller operation
       |
       v
Service operation
       |
       v
Error log
```

This is especially useful when multiple requests are being processed concurrently.

---

## 47. Separation of Persistent Data

The application has two major types of persistent data.

### Structured data

Stored in PostgreSQL:

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

### File data

Stored in the upload volume:

```text
profile/
projects/
certificates/
resume/
cv/
```

The database may store metadata or paths that refer to uploaded files.

The file itself remains in storage.

---

## 48. Data Ownership

The system follows these ownership rules:

```text
Portfolio structured data
        |
        v
PostgreSQL

Uploaded binary files
        |
        v
Upload storage

GitHub repository information
        |
        v
GitHub API

GitHub response cache
        |
        v
Backend cache
```

This separation avoids placing all application data into a single storage mechanism.

---

## 49. File and Database Consistency

File operations and database operations can affect the same logical resource.

For example, updating a project image may require:

```text
1. Validate the new file.
2. Store the new file.
3. Update the project image record.
4. Remove obsolete files when appropriate.
5. Return the updated project.
```

The service layer coordinates these operations.

Cleanup behavior is important because database records and files must not be allowed to diverge unnecessarily.

---

## 50. Frontend State Boundary

The frontend owns browser-side UI state.

Examples include:

* Form state
* Modal state
* Selected files
* Navigation state
* Authentication state
* Display state

The backend owns persistent application state.

Examples include:

* Portfolio records
* Administrative records
* Stored file references
* Database data

The architecture therefore separates:

```text
UI State
   |
   v
Frontend


Persistent State
   |
   v
Backend + PostgreSQL + Storage
```

---

## 51. Form Architecture

Forms are handled primarily by the frontend.

The frontend performs client-side validation to improve user experience.

The backend performs server-side validation for security and correctness.

The two responsibilities are complementary.

```text
Frontend Form
     |
     v
Client Validation
     |
     v
HTTP Request
     |
     v
Server Validation
     |
     v
Business Logic
```

Passing frontend validation does not imply that backend validation should be skipped.

---

## 52. Authentication State

The frontend maintains the current administrator authentication state for UI behavior.

The backend maintains the authoritative authentication state through JWT verification.

This allows the frontend to:

* Show administrative pages
* Hide protected UI
* Handle logout
* Attach authentication credentials

The backend still verifies every protected request.

---

## 53. Public and Administrative Areas

The application contains two conceptual interfaces.

```text
Public Portfolio
        |
        +-- Profile
        +-- Skills
        +-- Experience
        +-- Education
        +-- Certificates
        +-- Projects
        +-- GitHub information
        +-- Contact


Administrative Interface
        |
        +-- Authentication
        +-- Profile management
        +-- Project management
        +-- Skill management
        +-- Experience management
        +-- Education management
        +-- Certificate management
        +-- Message management
```

The administrative interface is protected by backend authentication.

---

## 54. Architectural Principles

The architecture follows several major principles.

### Separation of concerns

Each layer has a focused responsibility.

### Single responsibility

Modules should avoid mixing unrelated concerns.

### One-way dependency flow

Application dependencies move toward lower-level infrastructure.

### Backend authority

Security and persistent data decisions are enforced server-side.

### Persistent storage separation

Database data and uploaded files use appropriate storage systems.

### Centralized error handling

Errors are normalized through shared backend infrastructure.

### Reusable services

Business logic is concentrated in services instead of being duplicated across controllers.

### Environment-based configuration

Environment-specific values are kept outside source code.

### Automated validation

Important source changes are validated through CI.

---

## 55. Architecture Summary

The overall system can be summarized as:

```text
                         +-------------------+
                         |    Web Browser    |
                         +---------+---------+
                                   |
                                   | HTTP
                                   v
                         +-------------------+
                         | React Frontend    |
                         | apps/client       |
                         +---------+---------+
                                   |
                                   | API
                                   v
                         +-------------------+
                         | Express Backend   |
                         | apps/server       |
                         +---------+---------+
                                   |
              +--------------------+--------------------+
              |                    |                    |
              v                    v                    v
       +-------------+      +-------------+      +-------------+
       | PostgreSQL  |      | File        |      | GitHub API  |
       |             |      | Storage     |      |             |
       +-------------+      +-------------+      +-------------+

                         Development / Deployment

                         +-------------------+
                         | Docker Compose    |
                         +---------+---------+
                                   |
              +--------------------+--------------------+
              |                    |                    |
              v                    v                    v
         PostgreSQL             Backend             Frontend
          container             container            container
              |                    |                    |
              v                    v                    v
       postgres-data        server-uploads          Nginx
```

The application therefore consists of a React presentation layer, an Express application layer, a PostgreSQL persistence layer, a persistent file storage layer, and external GitHub integration.

---

## 56. Architecture Change Guidelines

Future changes should preserve the existing architectural boundaries.

When adding an API endpoint:

```text
Route
  |
  v
Controller
  |
  v
Service
  |
  v
Prisma / External API
```

When adding validation:

```text
Validator
  |
  v
Validation Middleware
```

When adding authentication requirements:

```text
Route
  |
  v
Authentication Middleware
  |
  v
Controller
```

When adding file functionality:

```text
Upload Middleware
  |
  v
Validation
  |
  v
File Service
  |
  +---- Storage
  |
  +---- Database
```

When adding an external integration:

```text
Controller
  |
  v
Service
  |
  v
External API
```

The frontend should communicate through the backend API instead of bypassing these boundaries.

---

## 57. Final Architecture Rule

The central architectural rule of Azaria SW is:

```text
The frontend handles presentation.
The backend handles application logic.
PostgreSQL handles structured persistence.
File storage handles uploaded files.
External services remain behind backend integrations.
CI validates changes before they are accepted.
```

Keeping these responsibilities separated makes the project easier to maintain, test, secure, and deploy.