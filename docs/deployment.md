# Azaria SW Deployment Documentation

## 1. Overview

Azaria SW is deployed as separate services rather than as one application server.

```text
                         GitHub
                           |
                    GitHub Actions
                           |
              +------------+------------+
              |                         |
              v                         v
           Vercel                    Render
         React/Vite               Express API
                                      |
                         +------------+------------+
                         |                         |
                         v                         v
                       Neon                   Cloudinary
                    PostgreSQL               File Storage
```

Each service has a separate responsibility:

| Service  | Provider   | Purpose                |
| -------- | ---------- | ---------------------- |
| Source   | GitHub     | Source code and CI/CD  |
| Frontend | Vercel     | React/Vite application |
| Backend  | Render     | Express API            |
| Database | Neon       | PostgreSQL             |
| Files    | Cloudinary | Uploaded assets        |

The frontend and backend are deployed independently, while Neon and Cloudinary provide persistent external storage.

## 2. Source Repository

The project source code is hosted on GitHub.

The repository contains:

```text
apps/client/
apps/server/
docs/
.github/workflows/
```

The production branch is:

```text
master
```

Changes pushed to the production branch are validated by GitHub Actions before deployment.

## 3. CI/CD Pipeline

The CI/CD workflow is defined in:

```text
.github/workflows/ci.yml
```

The pipeline validates the project before production deployment.

The main validation stages include:

```text
Backend
  |
  +-- npm ci
  +-- Prisma validation
  +-- Prisma Client generation
  `-- Docker image build

Frontend
  |
  +-- npm ci
  +-- ESLint
  `-- Production build

Docker
  |
  +-- Server image build
  `-- Client image build
```

After successful validation on master, the workflow triggers the deployment hooks for Render and Vercel.

This prevents the production deployment from being triggered by code that fails the required CI checks.

## 4. Frontend Deployment

The frontend is deployed on Vercel.

The frontend application is located at:

```text
apps/client/
```

Vercel builds the React/Vite application and serves the resulting static application.

The frontend communicates with the production backend through the Render API.

```text
Browser
   |
   v
Vercel
   |
   | HTTPS
   v
Render API
```

Production frontend configuration includes the backend API URL and other public Vite configuration.

The production frontend URL:

```text
https://azaria-sw.vercel.app
```

The production API URL:

```text
https://azaria-sw-server.onrender.com/api/v1
```

## 5. Backend Deployment

The backend is deployed on Render.

The backend is located at:

```text
apps/server/
```

Render runs the Node.js/Express application and exposes the REST API to the frontend.

The backend connects to external services:

```text
Render
  |
  +--> Neon PostgreSQL
  |
  +--> Cloudinary
  |
  `--> GitHub API
```

the Render service/API URL

```text
https://azaria-sw-server.onrender.com
```

## 6. Backend Build and Start

The backend deployment uses the Node.js application configuration in:

```text
apps/server/package.json
```

The project also contains:

```text
apps/server/Dockerfile
```

Docker image builds are validated by CI.

## 7. Production Database

The production PostgreSQL database is hosted by Neon.

```text
Render Backend
      |
      | DATABASE_URL
      v
Neon PostgreSQL
```

The backend connects to Neon using the production `DATABASE_URL`.

The database is independent from the Render application instance.

This means restarting or redeploying the backend does not remove the production database.

Database schema management is handled through Prisma migrations.

The database schema and migration process are documented in:

```text
docs/database.md
```

## 8. Production File Storage

Uploaded files are stored in Cloudinary.

```text
Client
  |
  v
Render API
  |
  v
Cloudinary
  |
  v
File URL
  |
  v
Database reference
```

Cloudinary is used for persistent production file storage instead of relying on the Render filesystem.

Supported assets include:

```text
Profile images
Project images
Certificate images
Resume
CV
```

The backend stores the required file references in PostgreSQL.

This allows application containers to be replaced without losing uploaded files.

## 9. Environment Variables

Production configuration is supplied through the deployment providers rather than committed to Git.

### Vercel

The frontend requires public build-time configuration such as:

```text
VITE_API_URL
VITE_UPLOAD_URL
VITE_APP_NAME
```

### Render

The backend requires runtime configuration including:

```text
ADMIN_PASSWORD_HASH
ADMIN_SEQUENCE_HASH
ADMIN_USERNAME
CLIENT_URL
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLOUDINARY_CLOUD_NAME
DATABASE_URL
GITHUB_USERNAME
GITHUB_TOKEN
JWT_CHALLENGE_EXPIRES_IN
JWT_EXPIRES_IN
JWT_SECRET
NODE_ENV
PORT
```

### Neon

Neon provides the production PostgreSQL connection information used by the backend.

Production secrets must never be committed to the repository.

## 10. CORS

The frontend and backend use different production origins.

The Render backend therefore allows the production Vercel origin through CORS.

```text
Vercel Frontend
      |
      | Browser request
      v
Render Backend
      |
      | CORS verification
      v
API
```

The final production frontend origin:

```text
https://azaria-sw.vercel.app
```

Development origins such as `localhost` are used only for local development.

Detailed security behavior is documented in:

```text
docs/security.md
```

## 11. API and Asset URLs

The production frontend must point to the production backend.

```text
Frontend
  |
  +--> API URL
  |
  `--> Upload URL
```

```text
Frontend:
https://azaria-sw.vercel.app

Backend:
https://azaria-sw-server.onrender.com

API:
https://azaria-sw-server.onrender.com/api/v1

Assets:
https://azaria-sw-server.onrender.com
```

These values must not point to localhost in the production frontend build.

## 12. Database Migrations

Database changes are deployed through committed Prisma migrations.

The deployment flow is:

```text
schema.prisma
     |
     v
Prisma migration
     |
     v
GitHub
     |
     v
Render deployment
     |
     v
Neon PostgreSQL
```

Production database changes should use the migration history rather than manually editing production tables.

Before destructive database changes, a database backup should be available.

## 13. Persistent Data

Production persistence is provided by external services.

```text
Neon
  -> PostgreSQL data

Cloudinary
  -> Uploaded files
```

The Render filesystem is therefore not treated as permanent application storage.

This is different from the local Docker environment, where PostgreSQL and uploads can use Docker volumes.

## 14. GitHub Integration

The backend communicates with the GitHub API for portfolio GitHub activity.

```text
Render
   |
   v
GitHub API
```

GitHub API responses are cached by the backend to reduce unnecessary external requests.

GitHub credentials, when required, are configured as backend environment variables.

## 15. Deployment Flow

A normal production deployment follows:

```text
Developer
    |
    v
Git commit
    |
    v
Push to master
    |
    v
GitHub Actions
    |
    v
CI validation
    |
    +---- failure ----> Deployment stops
    |
    v
Deployment hooks
    |
    +------------------+
    |                  |
    v                  v
  Vercel             Render
    |                  |
    v                  v
Frontend             Backend
                       |
              +--------+--------+
              |                 |
              v                 v
            Neon           Cloudinary
```

This separates code validation from production deployment.

## 16. Frontend Deployment Flow

When the frontend is deployed:

```text
GitHub
   |
   v
Vercel
   |
   v
Install dependencies
   |
   v
Vite production build
   |
   v
Deploy static application
```

The frontend build receives the configured production Vite variables during the build.

Because Vite values are embedded into the frontend bundle, changing them requires a new frontend deployment.

## 17. Backend Deployment Flow

When the backend is deployed:

```text
GitHub
   |
   v
Render
   |
   v
Install dependencies
   |
   v
Generate Prisma Client
   |
   v
Apply required migrations
   |
   v
Start Express server
```

The exact Render build and start configuration should remain synchronized with the project's package scripts and Docker configuration.

## 18. Deployment Verification

After a deployment, verify:

```text
Frontend
  -> Application loads

Backend
  -> Health endpoint responds

Database
  -> Prisma queries succeed

Cloudinary
  -> Uploads and asset URLs work

Authentication
  -> Admin login works

CORS
  -> Production frontend can access API

GitHub
  -> GitHub integration works
```

The production health endpoint:

```text
https://azaria-sw-server.onrender.com/api/v1/health
```

## 19. Rollback

Frontend and backend deployments can be rolled back independently through their respective deployment platforms.

Database migrations require additional care.

Rolling back application code does not automatically reverse a database migration.

Cloudinary files are independent of application deployments and should not be deleted as part of a normal application rollback.

## 20. Production Secrets

Production secrets are stored in the deployment environments.

They include values such as:

```text
Database credentials
DATABASE_URL
JWT secrets
Administrator credentials
Challenge hashes
Cloudinary credentials
GitHub credentials
```

Secrets must not be placed in:

```text
GitHub source files
Frontend code
Docker images
Public Vite variables
Documentation
```

## 21. Deployment Responsibilities

Each platform has a clearly defined responsibility:

```text
GitHub
  -> Source control and CI/CD

Vercel
  -> Frontend hosting

Render
  -> Backend hosting

Neon
  -> PostgreSQL hosting

Cloudinary
  -> Persistent file storage
```

This separation keeps application runtime, structured data, and uploaded files independent.

## 22. Current Production Deployment

The current production deployment is:

```text
Source
  -> GitHub

Frontend
  -> Vercel

Backend
  -> Render

Database
  -> Neon PostgreSQL

File Storage
  -> Cloudinary

CI/CD
  -> GitHub Actions
```

The deployment architecture is intentionally separated so that application deployments do not directly control persistent database or file storage.
