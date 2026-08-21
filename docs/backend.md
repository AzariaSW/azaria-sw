# azaria-sw Backend Documentation

## 1. Overview

The azaria-sw backend is a RESTful API built with Node.js and Express.js.

It provides the server-side functionality required by the portfolio application, including:

* Portfolio content management
* Administrative authentication
* Database access
* File uploads
* GitHub integration
* Contact message handling
* Request validation
* Error handling
* Logging
* Security controls

The backend uses a layered architecture to separate HTTP handling, business logic, validation, persistence, and supporting infrastructure.

The main backend technologies are:

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* Zod
* JWT
* Multer
* Winston
* Morgan
* Helmet
* CORS
* Express Rate Limit
* Compression
* Docker

The backend is located under:

```
apps/server/
```

The API is exposed through versioned routes under:

```
/api/v1
```

The detailed endpoint reference is maintained separately in:

```
docs/api.md
```

## 2. Main Responsibilities

The backend is responsible for the following application areas.

### 2.1 Portfolio Data

The API manages portfolio information such as:

* Profile
* Projects
* Project images
* Skills
* Experience
* Education
* Certificates

These resources are persisted in PostgreSQL through Prisma.

### 2.2 Administration

Administrative operations are protected by authentication middleware.

The administration system supports:

* Challenge verification
* Administrator login
* JWT-based authentication
* Protected administrative operations

### 2.3 File Management

The backend handles uploaded files for resources such as:

* Profile images
* Project images
* Certificate images
* Resume files
* CV files

Files are stored under the server uploads directory and are exposed through the appropriate static route.

### 2.4 GitHub Integration

The backend communicates with GitHub to retrieve portfolio-related GitHub information.

The GitHub integration includes caching to reduce unnecessary external API requests.

### 2.5 Contact Messages

The backend accepts contact messages from the public portfolio and stores them in PostgreSQL.

Administrative functionality can retrieve and manage stored messages.

### 2.6 Infrastructure

The backend also provides infrastructure concerns including:

* Security headers
* CORS
* Rate limiting
* Compression
* Request IDs
* HTTP logging
* Application logging
* Centralized error handling

## 3. Technology Stack

| Technology         | Responsibility                       |
| ------------------ | ------------------------------------ |
| Node.js            | JavaScript runtime                   |
| Express.js         | HTTP server and routing              |
| PostgreSQL         | Persistent data storage              |
| Prisma             | Database access and ORM              |
| Zod                | Request validation                   |
| JWT                | Administrative authentication        |
| bcrypt             | Password hashing                     |
| Multer             | Multipart file uploads               |
| file-type          | File type validation                 |
| Winston            | Application logging                  |
| Morgan             | HTTP request logging                 |
| Helmet             | HTTP security headers                |
| CORS               | Cross-origin access control          |
| express-rate-limit | Request rate limiting                |
| compression        | Response compression                 |
| uuid               | Request and file identifiers         |
| Docker             | Containerized runtime infrastructure |

## 4. Backend Structure

The backend follows a layered and modular structure.

```
apps/server/
|
+-- prisma/
|   +-- schema.prisma
|   +-- seed.js
|   +-- migrations/
|
+-- src/
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
|   +-- app.js
|   +-- server.js
|
+-- uploads/
|   +-- certificates/
|   +-- cv/
|   +-- profile/
|   +-- projects/
|   +-- resume/
|   +-- temp/
|
+-- package.json
+-- prisma.config.ts
+-- .env.example
```

Each directory has a specific responsibility.

This separation prevents the application from becoming dependent on a single large collection of route handlers.

## 5. Application Entry Points

The backend has two main application files.

### 5.1 server.js

`server.js` is the runtime entry point.

Its responsibility is to start the HTTP server and initialize the application runtime.

The application itself is separated from the server startup logic so that configuration and request handling remain independent of the process that starts the server.

### 5.2 app.js

`app.js` creates and configures the Express application.

It is responsible for assembling:

* Security middleware
* Compression
* Rate limiting
* Request identification
* Logging
* Body parsing
* Routes
* Static file handling
* Not-found handling
* Global error handling

This separation makes the Express application easier to configure and reuse.

## 6. Request Lifecycle

A typical request follows this general flow:

```
Client
   |
   v
Express
   |
   v
Security middleware
   |
   v
Compression
   |
   v
Rate limiting
   |
   v
Request ID
   |
   v
Request logging
   |
   v
Body parsing
   |
   v
Router
   |
   +---- Authentication
   |
   +---- Validation
   |
   v
Controller
   |
   v
Service
   |
   v
Prisma
   |
   v
PostgreSQL
   |
   v
Response
```

Not every endpoint requires authentication, validation, or database access.

The exact middleware chain depends on the route.

## 7. Configuration

Configuration is separated from application logic.

The configuration directory contains modules for major runtime concerns:

```
src/config/
|
+-- app.config.js
+-- auth.config.js
+-- database.js
+-- env.js
+-- github.config.js
+-- upload.config.js
```

### 7.1 app.config.js

Contains application-level configuration.

This keeps general application settings out of controllers and services.

### 7.2 auth.config.js

Contains configuration related to administrative authentication.

Authentication-specific configuration should not be scattered throughout route handlers.

### 7.3 database.js

Contains database connection configuration and database-related setup.

Prisma is used as the application's database access layer.

### 7.4 env.js

Centralizes environment variable handling.

Environment-dependent values should be obtained through configuration rather than being repeatedly accessed throughout the application.

### 7.5 github.config.js

Contains configuration required by the GitHub integration.

### 7.6 upload.config.js

Contains configuration used by the file upload system.

## 8. Routes

Routes define the public HTTP interface of the backend.

The route directory contains resource-specific route modules:

```
src/routes/
|
+-- auth.routes.js
+-- certificate.routes.js
+-- education.routes.js
+-- experience.routes.js
+-- github.routes.js
+-- health.routes.js
+-- message.routes.js
+-- profile.routes.js
+-- project.routes.js
+-- skill.routes.js
+-- test.routes.js
+-- index.js
+-- v1/
    +-- index.js
```

The versioned router provides the API version boundary.

Routes are responsible for:

* Registering endpoints
* Selecting middleware
* Selecting controllers
* Defining request processing order

Routes should not contain business logic.

For endpoint details, see:

```
docs/api.md
```

## 9. Controllers

Controllers are responsible for HTTP-level operations.

The controller directory contains resource-specific controllers:

```
src/controllers/
|
+-- auth.controller.js
+-- certificate.controller.js
+-- education.controller.js
+-- experience.controller.js
+-- github.controller.js
+-- health.controller.js
+-- message.controller.js
+-- profile.controller.js
+-- project.controller.js
+-- skill.controller.js
+-- test.controller.js
```

A controller generally performs the following operations:

1. Receive the request.
2. Read parameters, query values, body data, or uploaded files.
3. Call the appropriate service.
4. Construct or return the API response.
5. Allow errors to reach the centralized error handler.

Controllers should not contain database implementation details.

For example, a project controller should not directly construct Prisma queries.

Instead:

```
Route
  |
  v
Controller
  |
  v
Project Service
  |
  v
Prisma
```

## 10. Services

Services contain application and business logic.

The service directory contains:

```
src/services/
|
+-- auth.service.js
+-- cache.service.js
+-- certificate.service.js
+-- education.service.js
+-- experience.service.js
+-- file.service.js
+-- github.service.js
+-- health.service.js
+-- message.service.js
+-- profile.service.js
+-- project.service.js
+-- query.service.js
+-- skill.service.js
```

Services are responsible for operations such as:

* Database queries
* Database updates
* Transactions
* Business rules
* File operations
* External API communication
* Cache operations

Keeping this logic outside controllers makes the application easier to maintain.

A service should avoid depending on Express request or response objects whenever possible.

## 11. Validators

Request validation is handled through Zod schemas.

The validator directory contains resource-specific validation modules:

```
src/validators/
|
+-- auth.validator.js
+-- certificate.validator.js
+-- education.validator.js
+-- experience.validator.js
+-- id.validator.js
+-- message.validator.js
+-- profile.validator.js
+-- project.validator.js
+-- skill.validator.js
```

Validation can cover:

* Request bodies
* Route parameters
* Query parameters

The normal flow is:

```
Request
   |
   v
Validation
   |
   +---- invalid --> Error response
   |
   v
Controller
```

Invalid input should therefore be rejected before it reaches business logic.

## 12. Middleware

Middleware provides reusable request-processing functionality.

The middleware directory contains:

```
src/middleware/
|
+-- authenticateAdmin.js
+-- errorHandler.js
+-- logger.js
+-- notFound.js
+-- requestId.js
+-- security.js
+-- upload.js
+-- validate.js
```

### 12.1 authenticateAdmin.js

Protects administrative endpoints.

It verifies the authentication information required for protected operations.

### 12.2 errorHandler.js

Provides centralized error processing.

Errors from controllers, services, database operations, and middleware can ultimately be handled here.

### 12.3 logger.js

Connects HTTP request logging with the application's logging system.

### 12.4 notFound.js

Handles requests that do not match an existing endpoint.

### 12.5 requestId.js

Creates or attaches a unique identifier to requests.

The request ID allows logs associated with a single request to be correlated.

### 12.6 security.js

Configures security-related middleware such as:

* Helmet
* CORS
* Rate limiting

### 12.7 upload.js

Provides multipart upload processing and file validation.

### 12.8 validate.js

Provides reusable request validation middleware for Zod schemas.

## 13. Database Access

The backend uses Prisma as its database access layer.

The Prisma configuration is located under:

```
apps/server/prisma/
```

Important files include:

```
prisma/schema.prisma
prisma/seed.js
prisma/migrations/
prisma.config.ts
```

Application code accesses Prisma through the Prisma client module:

```
src/prisma/client.js
```

The intended dependency direction is:

```
Controller
    |
    v
Service
    |
    v
Prisma Client
    |
    v
PostgreSQL
```

Controllers should not bypass services to access Prisma directly.

## 14. Database Models

The backend currently contains portfolio-oriented entities including:

* Profile
* Skill
* Project
* ProjectImage
* Experience
* Education
* Certificate
* ContactMessage

Relationships and constraints are defined in:

```
apps/server/prisma/schema.prisma
```

Database structure and migration history are documented separately in:

```
docs/database.md
```

## 15. Prisma Migrations

Schema changes are represented by Prisma migrations.

The migration directory is:

```
apps/server/prisma/migrations/
```

Migrations provide a versioned history of database structure changes.

Examples of implemented migrations include changes for:

* Initial schema
* Seed constraints
* Contact messages
* Resume URL
* Project images
* Project image URL changes
* Certificate images
* Profile fields

The migration history should be committed to version control.

Generated or local database state should not replace migration files.

## 16. Seed Data

The backend contains a Prisma seed script:

```
apps/server/prisma/seed.js
```

The seed script provides initial or development data where required.

Seed logic should respect the uniqueness constraints defined by the Prisma schema.

When modifying unique fields or relationships, the seed script must be updated accordingly.

## 17. Authentication

Administrative authentication uses a two-step process.

The general flow is:

```
Hidden admin entry
      |
      v
Challenge verification
      |
      v
Challenge token
      |
      v
Administrator login
      |
      v
Credentials verified
      |
      v
JWT issued
      |
      v
Protected request
      |
      v
Authentication middleware
```

The challenge mechanism adds an additional barrier before administrator login.

JWTs are then used for authenticated API requests.

Detailed authentication and security information belongs in:

```
docs/security.md
```

## 18. Password Security

Administrator credentials are not stored as plaintext passwords.

Password hashing is handled using bcrypt.

The authentication service is responsible for password-related authentication operations.

The general principle is:

```
Plain password
      |
      v
   bcrypt
      |
      v
Password hash
      |
      v
   Database
```

During login, the supplied password is compared with the stored hash.

## 19. JWT Authentication

After successful administrator authentication, the backend issues a JWT.

Protected requests provide the token to the authentication middleware.

The authentication middleware verifies the token before allowing the request to continue.

The protected flow is:

```
Request
   |
   v
JWT supplied
   |
   v
authenticateAdmin
   |
   +---- invalid --> authentication error
   |
   v
Controller
   |
   v
Service
```

## 20. File Upload System

The backend supports persistent file uploads.

The upload root is:

```
apps/server/uploads/
```

The current categories include:

```
uploads/
|
+-- certificates/
+-- cv/
+-- profile/
+-- projects/
+-- resume/
+-- temp/
```

The project-specific image directories are organized by project ID.

This keeps uploaded assets separated from application source code.

## 21. Upload Processing

File uploads use multipart form data.

The upload middleware handles the multipart request and performs validation before the file is accepted.

Validation includes:

* File type
* File extension
* File size
* Upload destination

The application also uses `file-type` for file type validation.

This provides stronger validation than relying only on the filename extension or client-provided MIME type.

## 22. Upload Lifecycle

A typical upload follows this flow:

```
Client
   |
   v
Multipart request
   |
   v
Upload middleware
   |
   v
File validation
   |
   +---- invalid --> Error response
   |
   v
Temporary or target storage
   |
   v
File service
   |
   v
Database update
   |
   v
Public asset URL
```

When replacing or deleting resources, the associated file operations must remain synchronized with the database state.

## 23. Static Uploaded Files

Uploaded files are exposed through the backend's upload path.

The public URL pattern is based on:

```
/uploads/
```

For example:

```
/uploads/profile/example.jpg
```

The frontend uses the configured upload base URL to resolve these assets.

In containerized environments, uploaded files are stored in a persistent Docker volume rather than depending only on the container filesystem.

## 24. File Storage in Docker

The production Compose configuration mounts persistent storage for server uploads.

The volume is mounted to:

```
/app/apps/server/uploads
```

This prevents uploaded files from disappearing when the server container is recreated.

The database uses a separate persistent PostgreSQL volume.

Therefore the production runtime separates:

* Database persistence
* Uploaded file persistence
* Container lifecycle

## 25. GitHub Integration

GitHub functionality is separated into:

```
src/lib/github.js
src/services/github.service.js
src/controllers/github.controller.js
src/routes/github.routes.js
```

The GitHub library handles external GitHub communication.

The GitHub service handles application-level logic and caching.

The controller exposes the data through API endpoints.

This keeps external API communication separate from HTTP handling.

## 26. GitHub Caching

GitHub responses are cached to reduce repeated external API requests.

The caching functionality is represented by:

```
src/services/cache.service.js
```

The GitHub service can therefore use cached data when appropriate instead of making a new request for every client request.

This provides:

* Reduced GitHub API usage
* Faster repeated requests
* Better resilience against unnecessary external requests

## 27. API Responses

The backend provides reusable response utilities:

```
src/utils/ApiResponse.js
src/utils/ApiError.js
```

`ApiResponse` is used to keep successful responses consistent.

`ApiError` provides a structured way for application code to represent expected errors.

The general design is:

```
Service
   |
   +---- success --> Controller --> API response
   |
   +---- ApiError --> Error handler --> Error response
```

## 28. Error Handling

Errors are handled centrally.

The backend distinguishes between common error categories such as:

* Validation errors
* Authentication errors
* Authorization errors
* Not found errors
* Prisma errors
* Upload errors
* Application errors
* Unexpected errors

The global error handler converts these failures into consistent API responses.

This prevents individual controllers from implementing their own incompatible error formats.

## 29. Not Found Handling

Requests that do not match a registered endpoint are processed by:

```
src/middleware/notFound.js
```

This ensures unknown routes receive a controlled API response rather than an uncontrolled Express response.

## 30. Asynchronous Error Handling

Asynchronous route and controller operations use the reusable async handler utility:

```
src/utils/asyncHandler.js
```

This allows asynchronous errors to reach the centralized error handler without requiring repeated error-handling boilerplate in every controller.

## 31. Logging

The backend uses two complementary logging mechanisms.

### HTTP logging

Morgan is used for HTTP request logging.

### Application logging

Winston provides application-level structured logging.

The logger is configured in:

```
src/logger/logger.js
```

The middleware responsible for request logging is:

```
src/middleware/logger.js
```

## 32. Request IDs

Each request can be associated with a unique request ID.

The request ID is useful when tracing a request across:

* Middleware
* Controllers
* Services
* Database operations
* Error logs

A typical log relationship is:

```
Request
   |
   +-- request ID
          |
          +-- HTTP log
          |
          +-- application log
          |
          +-- error log
```

This makes debugging production problems substantially easier.

## 33. Security Middleware

Security-related request processing is centralized in:

```
src/middleware/security.js
```

The backend uses:

* Helmet
* CORS
* Rate limiting

Other security mechanisms are implemented in their respective middleware and services.

The complete security model is documented separately in:

```
docs/security.md
```

## 34. CORS

CORS controls which browser origins can access the API.

The allowed client origin is configured through environment configuration.

This prevents the API from unintentionally allowing arbitrary browser origins in production.

## 35. Rate Limiting

The backend uses `express-rate-limit` to reduce excessive request traffic.

Rate limiting is particularly useful for protecting:

* Authentication endpoints
* Public API endpoints
* Resource-intensive operations

The actual limits are configured in the security middleware.

## 36. Compression

Response compression is enabled through the compression middleware.

Compression reduces response size for supported responses and can improve network performance.

It is applied at the application level rather than being duplicated across individual controllers.

## 37. Utility Modules

Reusable backend functionality is placed under:

```
src/utils/
```

Current utility modules include:

```
ApiError.js
ApiResponse.js
asyncHandler.js
dateConverter.js
hash.js
jwt.js
pagination.js
slug.js
sorting.js
```

Utilities should contain reusable logic that does not belong to a specific resource service.

## 38. Pagination

Pagination-related helpers are provided through the utility and service layers.

The backend also contains:

```
src/constants/pagination.js
src/utils/pagination.js
```

Pagination allows resource endpoints to avoid returning unnecessarily large collections.

Resource-specific pagination behavior is documented in the API documentation.

## 39. Query and Sorting Utilities

The backend contains reusable query-related functionality:

```
src/services/query.service.js
src/utils/sorting.js
```

These modules support consistent handling of query-driven operations such as sorting and pagination.

This prevents every resource service from implementing completely separate query logic.

## 40. Date Handling

Date conversion is centralized through:

```
src/utils/dateConverter.js
```

This is particularly important because the database stores date and timestamp values in PostgreSQL while API clients may submit or display dates in different representations.

Date conversion should therefore occur at the application boundary rather than being duplicated throughout business logic.

## 41. Slugs

Slug generation is handled through:

```
src/utils/slug.js
```

A centralized slug utility ensures that slug-related behavior remains consistent wherever it is required.

## 42. Resource Organization

Each major portfolio resource follows a similar structure.

For example, projects have:

```
Route
  |
  v
project.controller.js
  |
  v
project.service.js
  |
  v
Prisma Project model
```

Other resources follow the same general pattern:

* Profile
* Skill
* Experience
* Education
* Certificate
* Message
* GitHub

## 43. Project Management

Project functionality includes:

* Project creation
* Project retrieval
* Project updates
* Project deletion
* Project image management
* Image ordering
* File handling

Project images have their own database model and filesystem organization.

The service layer coordinates project data with project image files.

## 44. Certificate Management

Certificate functionality includes certificate data and optional certificate images.

Certificate image files are stored under:

```
uploads/certificates/
```

The certificate service coordinates database records and associated file operations.

## 45. Profile Management

Profile information is stored in PostgreSQL.

The profile functionality also integrates with uploaded profile assets where applicable.

The profile service handles persistence while the controller handles HTTP communication.

## 46. Education and Experience

Education and experience are stored as separate resources.

They are represented by dedicated:

* Models
* Validators
* Services
* Controllers
* Routes

This keeps the resource-specific business rules isolated.

## 47. Skills

Skills are represented as their own resource.

Skill operations use the same layered pattern:

```
Route
   |
   v
Controller
   |
   v
Service
   |
   v
Prisma
```

## 48. Contact Messages

Contact messages are persisted by the backend.

The message functionality provides a separation between:

* Public message submission
* Administrative message management
* Validation
* Database persistence

Message validation is performed before the request reaches the service layer.

## 49. Health Endpoint

The backend provides a health endpoint for runtime checks.

The health functionality has dedicated:

```
health.controller.js
health.service.js
health.routes.js
```

Health checks are useful for:

* Local development
* Docker health verification
* Deployment infrastructure
* Runtime diagnostics

## 50. Docker Integration

The backend can run as a Docker container.

The server Dockerfile is:

```
apps/server/Dockerfile
```

The production Compose configuration builds the server using:

```
apps/server/Dockerfile
```

The production server container:

* Installs backend dependencies
* Generates Prisma Client
* Copies backend source
* Includes required upload paths
* Starts the Node.js server

PostgreSQL runs as a separate container.

## 51. Docker Database Relationship

The production container architecture is:

```
Client
   |
   v
Server
   |
   v
PostgreSQL
```

The server communicates with PostgreSQL through the internal Docker network.

The database does not need to expose its port publicly to support server-to-database communication.

Persistent database data is stored in a Docker volume.

## 52. Environment Configuration

Environment-specific configuration is not hardcoded into the application.

The backend provides:

```
apps/server/.env.example
```

Production configuration is supplied through the production environment.

Sensitive values such as:

* Database passwords
* JWT secrets
* Administrator credentials
* GitHub credentials or tokens
* Environment-specific URLs

must not be committed to source control.

## 53. Backend Package Scripts

The server workspace currently provides scripts for common operations:

```
npm run dev
npm run start
npm run prisma:generate
npm run prisma:studio
npm run prisma:migrate
```

The development server uses Nodemon.

The production server uses Node.js directly.

## 54. Development Workflow

A typical backend development workflow is:

1. Start PostgreSQL.
2. Configure environment variables.
3. Generate Prisma Client when required.
4. Run migrations when the schema changes.
5. Start the backend development server.
6. Test API endpoints.
7. Check logs for errors.
8. Run validation or CI checks.
9. Commit the changes.

The backend should be tested together with the database because many resource operations depend on PostgreSQL.

## 55. Schema Change Workflow

When a database change is required:

1. Update `schema.prisma`.
2. Create a Prisma migration.
3. Review the generated migration.
4. Apply the migration locally.
5. Verify the affected API functionality.
6. Update seed data if necessary.
7. Commit the schema and migration together.
8. Update `docs/database.md` when the database documentation changes materially.

Migration files are part of the source-controlled database history.

## 56. Backend Validation

The backend participates in the project's CI pipeline.

The CI workflow validates the Prisma schema using:

```
npx prisma validate --schema=apps/server/prisma/schema.prisma
```

The frontend has separate lint and build validation.

This ensures that backend schema problems can be detected before changes are merged.

## 57. CI and Backend

The current CI workflow is located at:

```
.github/workflows/ci.yml
```

The backend validation job:

* Checks out the repository
* Sets up Node.js
* Uses npm dependency caching
* Runs `npm ci`
* Validates the Prisma schema

The current project intentionally delays deployment automation until a production server and domain have been selected.

## 58. Production Runtime

The production Compose configuration contains:

* PostgreSQL
* Server
* Client

The backend server exposes port:

```
5000
```

The server depends on PostgreSQL becoming healthy before startup.

Uploaded files use a persistent Docker volume so container recreation does not remove them.

## 59. Dependency Direction

The backend follows a one-way dependency structure.

```
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
   v
Prisma / External APIs
```

Lower layers should not depend on higher HTTP layers.

For example:

* Services should not import route modules.
* Services should not control Express responses.
* Controllers should not contain database query implementation.
* Routes should not contain business rules.

This keeps the architecture modular.

## 60. Design Principles

The backend follows these main principles:

* Separation of concerns
* Single responsibility
* Layered architecture
* Centralized error handling
* Centralized validation
* Reusable middleware
* Reusable utilities
* Consistent API responses
* Secure defaults
* Persistent storage
* Environment-based configuration
* Explicit database migrations
* Modular resource design

The goal is to keep the backend understandable as the project grows.

## 61. Documentation Boundaries

The backend documentation is intentionally divided across several documents.

### backend.md

Describes:

* Backend responsibilities
* Technology stack
* Directory responsibilities
* Request processing
* Major backend systems
* Development principles

### architecture.md

Describes:

* Layer relationships
* Dependency flow
* Architectural decisions
* Request lifecycle

### database.md

Describes:

* Prisma schema
* Database models
* Relationships
* Constraints
* Migrations
* Database persistence

### security.md

Describes:

* Authentication
* Authorization
* Password security
* JWT security
* CORS
* Rate limiting
* File security
* Administrative access

### api.md

Describes:

* API endpoints
* Methods
* Parameters
* Request bodies
* Responses
* Resource-specific API behavior

Keeping these responsibilities separate prevents documentation from becoming repetitive.

## 62. Backend Maintenance Rules

When adding a new resource, follow the existing resource structure.

Normally this means adding:

```
Validator
Controller
Service
Route
```

and, when required:

```
Prisma model
Migration
Utility
Configuration
Tests
```

The route should expose the resource.

The controller should handle HTTP concerns.

The service should contain business logic.

The validator should protect the input boundary.

The database model should represent persistent state.

## 63. Adding New Middleware

New middleware should have one clear responsibility.

Examples:

* Authentication
* Validation
* Logging
* Upload processing
* Request identification

Avoid creating middleware that combines unrelated concerns.

If middleware is resource-specific, consider whether the behavior belongs in the resource service instead.

## 64. Adding New Services

A service should represent a meaningful application responsibility.

Services should:

* Keep business rules out of controllers
* Use Prisma for database access
* Handle related transactions where necessary
* Reuse common utilities
* Avoid Express-specific implementation details

If a service becomes too large, split independent responsibilities into smaller services.

## 65. Adding New Utilities

A utility should only be introduced when functionality is genuinely reusable.

Good utility candidates include:

* Formatting
* Hashing
* JWT helpers
* Pagination
* Sorting
* Date conversion
* Slug generation

Resource-specific business logic should remain in the resource service instead.

## 66. Debugging Strategy

When an API request fails, investigate in this order:

1. Check the request URL.
2. Check the HTTP method.
3. Check authentication requirements.
4. Check request validation.
5. Check the controller.
6. Check the service.
7. Check Prisma/database errors.
8. Check uploaded file paths if files are involved.
9. Check backend logs.
10. Check the request ID when correlating logs.

This follows the same order as the application's request architecture.

## 67. Database Runtime Problems

If Prisma reports that a table does not exist, first verify:

* The server is connected to the expected database.
* The PostgreSQL container is running.
* The correct database name is configured.
* The expected migrations have been applied.
* The database volume contains the intended database.
* The Prisma schema matches the database.

Do not immediately modify the Prisma schema to fix a runtime database problem.

First determine whether the server is connected to the correct database.

## 68. File Runtime Problems

If an uploaded file exists on disk but cannot be retrieved through the API, check:

1. The file exists under `uploads/`.
2. The correct static route is registered.
3. The requested URL begins with `/uploads/`.
4. The container has the upload volume mounted.
5. The frontend uses the correct upload base URL.
6. The server container has access to the same upload directory where the file was written.

File storage and static file serving must use compatible paths.

## 69. Logging Strategy

Logs should be used to answer three questions:

1. What request occurred?
2. What operation failed?
3. What internal error caused the failure?

Request IDs provide the connection between HTTP activity and application errors.

Sensitive information should never be written to logs, including:

* Passwords
* JWT secrets
* Authentication tokens
* Database passwords
* Private credentials

## 70. Production Considerations

Before production deployment, verify:

* Production environment variables are configured.
* Database persistence is enabled.
* Upload persistence is enabled.
* Database migrations are applied.
* Prisma Client is generated.
* CORS allows only intended origins.
* Authentication secrets are strong.
* Rate limiting is configured appropriately.
* Uploaded files are protected appropriately.
* Logs do not expose secrets.
* The server is reachable through the intended deployment network.
* The client uses the production API and upload URLs.

Deployment automation is intentionally postponed until the production hosting environment and domain are selected.

## 71. Current Backend State

The backend currently provides a complete layered foundation for the portfolio application.

The major implemented areas are:

* Express application
* Versioned API routes
* Controllers
* Services
* Zod validation
* Prisma database access
* PostgreSQL persistence
* Administrative authentication
* JWT authentication
* File uploads
* Static file serving
* GitHub integration
* Response caching
* Centralized errors
* Request IDs
* HTTP logging
* Application logging
* Security middleware
* Docker support
* Persistent database storage
* Persistent upload storage
* CI schema validation

The backend is therefore structured for continued development without requiring another major architectural reorganization.

## 72. Related Documentation

For more information, refer to:

```
docs/api.md
docs/architecture.md
docs/database.md
docs/security.md
docs/deployment.md
```

The API documentation remains the authoritative reference for endpoint-level behavior.

## 73. Summary

The azaria-sw backend is organized around a layered architecture:

```
HTTP
  |
  v
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
  v
Prisma
  |
  v
PostgreSQL
```

Supporting systems provide:

* Authentication
* Validation
* File management
* GitHub integration
* Caching
* Logging
* Error handling
* Security
* Persistent Docker storage

This structure keeps HTTP concerns, business logic, persistence, and infrastructure concerns separated while allowing the application to grow without unnecessary coupling.