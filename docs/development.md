# Azaria SW Development Documentation

## Purpose

This document describes the normal development workflow for Azaria SW.

It covers:

* Development prerequisites
* Repository setup
* Dependency installation
* Environment preparation
* Database startup
* Prisma workflow
* Backend development
* Frontend development
* Running the complete application
* Validation
* Testing changes
* Git workflow
* Common development problems

Environment variables are documented in docs/environment.md.

Database architecture and migration details are documented in docs/database.md.

Docker usage is documented in docs/docker.md.

API behavior is documented in docs/api.md.

---

# Project Structure

Azaria SW is organized as a workspace-based project.

The main application directories are:

```text
azaria-sw/
  apps/
    client/
    server/

  docs/
  .github/
```

The client contains the React frontend.

The server contains the Express backend and Prisma database layer.

Documentation is stored under docs/.

GitHub Actions workflows are stored under .github/workflows/.

---

# Prerequisites

Development requires the following tools.

## Node.js

The project uses Node.js 22.

Verify:

```text
node --version
```

The version should be compatible with Node.js 22.

---

## npm

npm is used for dependency management and workspace commands.

Verify:

```text
npm --version
```

---

## Docker

Docker is required for the containerized PostgreSQL development environment.

Verify:

```text
docker --version
```

---

## Docker Compose

Verify:

```text
docker compose version
```

Docker Compose is used to manage the development services.

---

## Git

Git is required for source control.

Verify:

```text
git --version
```

---

# Clone the Repository

Clone the repository:

```text
git clone <repository-url>
```

Enter the project directory:

```text
cd azaria-sw
```

Verify the repository:

```text
git status
```

---

# Install Dependencies

Azaria SW uses npm workspaces.

Install all dependencies from the repository root:

```text
npm ci
```

`npm ci` should normally be preferred for a clean, reproducible installation because it uses package-lock.json.

Do not manually install dependencies separately unless the change specifically requires it.

---

# Workspace Structure

The root package defines the workspaces:

```text
apps/*
packages/*
```

This means npm manages dependencies for the applications and packages from the repository root.

The main workspaces are:

```text
client
@azaria/server
```

---

# Verify Installation

After installation, verify the client:

```text
npm run lint --workspace=client
```

Verify the frontend build:

```text
npm run build --workspace=client
```

Verify the Prisma schema:

```text
npx prisma validate --schema=apps/server/prisma/schema.prisma
```

Generate Prisma Client:

```text
npx prisma generate --schema=apps/server/prisma/schema.prisma
```

These commands are also useful before committing changes.

---

# Environment Setup

Create the required environment files from their examples.

Review:

```text
.env.example
apps/client/.env.example
apps/server/.env.example
```

Do not commit real environment files containing secrets.

Environment configuration is documented in:

```text
docs/environment.md
```

---

# Development Database

The development environment uses PostgreSQL.

The recommended local setup uses Docker Compose.

Start the PostgreSQL service:

```text
docker compose up -d postgres
```

Check the service:

```text
docker compose ps
```

The PostgreSQL service should report a healthy state when the healthcheck succeeds.

---

# Start All Development Services

The project can start its workspace development scripts through:

```text
npm run dev
```

This runs:

```text
npm run dev --workspaces
```

The exact behavior depends on the development scripts defined by each workspace.

If individual services need to be controlled separately, run them independently.

---

# Start PostgreSQL Only

For development where the backend and frontend are started directly from the host:

```text
docker compose up -d postgres
```

Then start the server and client using their respective development scripts.

This is useful when actively debugging application source code outside Docker.

---

# Backend Development

The backend is located at:

```text
apps/server/
```

Important directories include:

```text
apps/server/
  src/
    config/
    controllers/
    logger/
    middleware/
    prisma/
    routes/
    services/
    utils/

  prisma/
    migrations/
    schema.prisma
    seed.js
```

The server uses Express.

Prisma provides database access.

---

# Start the Backend

From the repository root:

```text
npm run dev --workspace=@azaria/server
```

The server uses its development script:

```text
nodemon src/server.js
```

Nodemon restarts the server when relevant source files change.

---

# Backend Production Start

The production server script is:

```text
npm run start --workspace=@azaria/server
```

This runs:

```text
node src/server.js
```

Normal development should use the development script instead.

---

# Backend Dependencies

Backend dependencies are defined in:

```text
apps/server/package.json
```

Important runtime dependencies include:

```text
express
@prisma/client
pg
@prisma/adapter-pg
zod
jsonwebtoken
bcrypt
multer
helmet
cors
express-rate-limit
compression
morgan
winston
file-type
uuid
```

Do not add a dependency merely to solve a problem that can reasonably be handled with existing project utilities.

---

# Backend Source Changes

Backend changes should follow the existing separation of concerns.

A typical request flow is:

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
Prisma / Utility
  |
  v
Database or filesystem
```

Routes define endpoints.

Controllers handle HTTP-level behavior.

Services contain business logic.

Utilities provide reusable low-level functionality.

---

# Backend Validation

After modifying backend code, verify that the application still starts.

For database-related changes also run:

```text
npx prisma validate --schema=apps/server/prisma/schema.prisma
```

If the Prisma schema changed:

```text
npx prisma generate --schema=apps/server/prisma/schema.prisma
```

Then test the affected API behavior.

---

# Prisma Development Workflow

The Prisma schema is:

```text
apps/server/prisma/schema.prisma
```

Migration files are stored under:

```text
apps/server/prisma/migrations/
```

Seed logic is:

```text
apps/server/prisma/seed.js
```

---

# Change the Database Schema

When a database structure change is required:

1. Modify schema.prisma.
2. Create a migration.
3. Review the generated SQL.
4. Apply the migration.
5. Generate Prisma Client if required.
6. Test the affected backend functionality.
7. Commit the schema and migration together.

---

# Create a Development Migration

Use:

```text
npx prisma migrate dev --schema=apps/server/prisma/schema.prisma
```

Give the migration a meaningful name when Prisma asks for one.

Example:

```text
add_profile_telegram
```

Do not manually edit an already shared migration to represent a new database change.

Create a new migration instead.

---

# Prisma Validation

Before committing a schema change:

```text
npx prisma validate --schema=apps/server/prisma/schema.prisma
```

A successful result means the Prisma schema is syntactically and structurally valid.

It does not prove that the application logic using the schema is correct.

---

# Generate Prisma Client

After relevant schema changes:

```text
npx prisma generate --schema=apps/server/prisma/schema.prisma
```

This updates the generated Prisma Client.

Generation does not apply database migrations.

---

# Prisma Studio

Prisma Studio can be used to inspect development data:

```text
npm run prisma:studio --workspace=@azaria/server
```

Use it for development inspection.

Do not use it as a replacement for migrations.

Be careful when modifying real data.

---

# Seed Data

The seed script is located at:

```text
apps/server/prisma/seed.js
```

Seed data should remain compatible with the current schema and database constraints.

When adding a new required field or unique constraint, review the seed script.

Upsert operations must use valid unique selectors.

---

# Database Inspection

Check running services:

```text
docker compose ps
```

Open PostgreSQL:

```text
docker compose exec postgres psql -U azaria -d azaria_sw
```

List tables:

```text
\dt
```

For current PascalCase table names, use quoted identifiers.

Example:

```text
SELECT COUNT(*) FROM "Profile";
SELECT COUNT(*) FROM "Project";
SELECT COUNT(*) FROM "Education";
```

Unquoted identifiers are lowercased by PostgreSQL.

---

# Frontend Development

The frontend is located at:

```text
apps/client/
```

It uses React and Vite.

The frontend contains:

```text
src/
  components/
  features/
  layouts/
  lib/
  providers/
  routes/
  utils/
```

The feature-based structure should be preserved when adding new functionality.

---

# Start the Frontend

From the repository root:

```text
npm run dev --workspace=client
```

Vite starts the frontend development server.

The development URL depends on the Vite configuration.

The frontend communicates with the backend using the configured API URL.

---

# Frontend Dependencies

Frontend dependencies are defined in:

```text
apps/client/package.json
```

The project currently uses libraries including:

```text
react
react-dom
react-router-dom
@tanstack/react-query
react-hook-form
zod
@hookform/resolvers
framer-motion
lucide-react
```

Use existing project abstractions before introducing another library.

---

# Frontend Feature Development

Frontend functionality should normally be organized by feature.

Examples include:

```text
features/
  admin/
  certificates/
  contact/
  education/
  experience/
  github/
  profile/
  projects/
  skills/
```

Feature-specific components, hooks, validation, and logic should remain close to their feature.

Shared UI belongs in shared component directories.

---

# Frontend Environment

The client uses Vite environment variables.

Common development values include:

```text
VITE_API_URL
VITE_UPLOAD_URL
VITE_APP_NAME
```

Example:

```text
VITE_API_URL=http://localhost:5000/api/v1
VITE_UPLOAD_URL=http://localhost:5000/uploads
VITE_APP_NAME=Azaria SW
```

Do not place secrets in these variables.

See docs/environment.md for details.

---

# Frontend Linting

Run:

```text
npm run lint --workspace=client
```

The command must complete without ESLint errors.

Linting is part of CI.

Do not ignore a lint error simply to make CI pass.

Fix the underlying problem when practical.

---

# Frontend Build

Run:

```text
npm run build --workspace=client
```

This creates the production frontend build.

The build must complete successfully before merging frontend changes.

A successful build may still report warnings.

Warnings should be reviewed rather than automatically treated as failures.

---

# Frontend Build Warnings

The Vite build may report large JavaScript chunks.

For example:

```text
Some chunks are larger than 500 kB after minification.
```

This is currently a warning rather than a build failure.

Do not change build limits merely to hide a warning.

If bundle size becomes a real performance concern, investigate:

* Dynamic imports
* Route-level code splitting
* Lazy loading
* Dependency size
* Unnecessary imports

---

# API Development

API endpoints are documented in:

```text
docs/api.md
```

When adding or changing an endpoint:

1. Update the route.
2. Update the controller.
3. Update the service if required.
4. Add or update validation.
5. Test success behavior.
6. Test validation failures.
7. Test authentication requirements.
8. Update API documentation if the public API changed.

---

# File Upload Development

Uploaded files are stored under:

```text
apps/server/uploads/
```

The main categories include:

```text
uploads/
  certificates/
  cv/
  profile/
  projects/
  resume/
  temp/
```

The upload system has separate database metadata and filesystem data.

When changing upload behavior, test both.

A database record alone does not prove that the physical file exists.

A physical file alone does not prove that the database references it correctly.

---

# Testing File Uploads

When testing an upload feature verify:

```text
[ ] Request reaches the correct endpoint
[ ] File validation succeeds
[ ] File is physically stored
[ ] Database reference is stored
[ ] Returned URL is correct
[ ] Frontend can load the file
[ ] Replacement removes or preserves the correct old file
[ ] Deletion removes the correct file
[ ] Invalid file types are rejected
[ ] Oversized files are rejected
```

---

# Git Development Workflow

Before starting work:

```text
git status
```

Confirm the working tree is understood before modifying files.

Create or switch to the appropriate branch.

Make a focused change.

Review the result.

Run relevant validation.

Then commit.

---

# Review Changes

Use:

```text
git status
```

Then:

```text
git diff
```

For staged changes:

```text
git diff --cached
```

Review the diff before committing.

Do not commit unrelated changes accidentally.

---

# Commit Scope

Commits should represent a coherent change.

Good examples:

```text
feat(client): add project image management
fix(client): resolve project image preview lint error
feat(server): add profile telegram field
docs: add development environment documentation
```

Avoid vague messages such as:

```text
update
changes
fix stuff
work
```

---

# Dependency Changes

When adding or removing dependencies:

1. Update the appropriate package.json.
2. Update package-lock.json.
3. Run npm ci successfully.
4. Run relevant validation.
5. Review the resulting diff.
6. Commit both package metadata and lockfile changes.

Do not manually edit package-lock.json.

---

# Database Changes and Git

Database schema changes should normally include:

```text
apps/server/prisma/schema.prisma
apps/server/prisma/migrations/<migration-name>/migration.sql
```

Commit them together.

Do not commit a local database volume as project source.

Do not rely on a developer's local database state being reproducible without migrations.

---

# Working With Existing Data

Before destructive database work:

1. Confirm the active database.
2. Confirm the active Docker Compose project.
3. Confirm the database volume.
4. Create a backup when data matters.
5. Perform the change.
6. Verify the resulting schema and records.

A database volume is persistence, not a complete backup strategy.

---

# Development Database Backup

For important local data, create a PostgreSQL dump.

Example:

```text
pg_dump -U azaria -d azaria_sw -Fc -f azaria_sw.dump
```

The exact command depends on whether PostgreSQL is running on the host or inside Docker.

Do not commit real database dumps to the repository unless explicitly required.

---

# Pulling Changes

After pulling changes from Git:

```text
git pull
```

Then install dependencies if package metadata changed:

```text
npm ci
```

If migrations were added:

```text
npx prisma migrate dev --schema=apps/server/prisma/schema.prisma
```

If the Prisma schema changed:

```text
npx prisma generate --schema=apps/server/prisma/schema.prisma
```

Then run the relevant validation.

---

# Recommended Validation Sequence

Before pushing a normal change:

```text
git status
```

Then run the checks relevant to the change.

For frontend changes:

```text
npm run lint --workspace=client
npm run build --workspace=client
```

For Prisma changes:

```text
npx prisma validate --schema=apps/server/prisma/schema.prisma
npx prisma generate --schema=apps/server/prisma/schema.prisma
```

For backend changes:

```text
npm run start --workspace=@azaria/server
```

or use the development server while testing interactively.

---

# Full Local Validation

When preparing a major change, run:

```text
npm ci
npm run lint --workspace=client
npm run build --workspace=client
npx prisma validate --schema=apps/server/prisma/schema.prisma
npx prisma generate --schema=apps/server/prisma/schema.prisma
```

Then verify the application manually.

The same major validation areas are represented in CI.

---

# CI

GitHub Actions currently validates the project on pushes and pull requests targeting the configured branches.

The CI workflow is:

```text
.github/workflows/ci.yml
```

The frontend job performs:

```text
npm ci
npm run lint --workspace=client
npm run build --workspace=client
```

The backend job validates:

```text
npx prisma validate --schema=apps/server/prisma/schema.prisma
```

A local validation pass does not guarantee that CI will pass, but it reduces avoidable failures.

---

# Pull Requests

Before opening a pull request:

```text
git status
```

Confirm only intended changes are present.

Then run relevant validation.

Push the branch and allow CI to complete.

Review CI results before merging.

If CI fails, reproduce the failure locally when practical.

---

# GitHub Actions Environment

CI does not require the production database.

Frontend build variables used by CI are non-secret values such as:

```text
VITE_API_URL
VITE_UPLOAD_URL
VITE_APP_NAME
```

Secrets must not be hard-coded into workflow files.

Production deployment secrets belong in the deployment environment, not the repository.

---

# Debugging the Backend

If the backend fails to start:

1. Check the terminal output.
2. Check environment variables.
3. Check PostgreSQL status.
4. Check DATABASE_URL.
5. Check Prisma Client generation.
6. Check migration state.
7. Check the server port.

Check Docker services:

```text
docker compose ps
```

Check PostgreSQL logs:

```text
docker compose logs postgres
```

Check server logs:

```text
docker compose logs server
```

---

# Debugging Database Errors

If Prisma reports that a table does not exist:

1. Confirm the database name.
2. Confirm DATABASE_URL.
3. Confirm the active PostgreSQL container.
4. Confirm the active volume.
5. Run \dt.
6. Check _prisma_migrations.
7. Check migration status.

Do not immediately delete the database or migration table.

A missing table can result from connecting to the wrong database or volume.

---

# Debugging PostgreSQL Identifiers

The project uses PascalCase Prisma model names.

For example:

```text
Profile
Project
Education
```

PostgreSQL preserves quoted identifiers.

Use:

```text
SELECT COUNT(*) FROM "Profile";
```

not:

```text
SELECT COUNT(*) FROM Profile;
```

The second form is interpreted as:

```text
profile
```

---

# Debugging the Frontend

If the frontend does not load:

1. Check the Vite terminal.
2. Check the browser console.
3. Check the configured API URL.
4. Check that the backend is running.
5. Check network requests.
6. Check frontend environment variables.

If an environment value changed, restart the Vite development server.

---

# Debugging API Requests

When a frontend API request fails, inspect:

```text
Request URL
HTTP method
Status code
Request body
Response body
Authentication state
Browser console
Server logs
```

A frontend error may originate from the backend.

Always inspect both sides before changing code.

---

# Debugging Uploads

For upload failures, inspect:

```text
Request URL
Multipart form field name
HTTP status
Server response
Server upload directory
Database record
Generated asset URL
```

If the file exists but the browser receives "Endpoint not found", verify the static upload route and the frontend upload URL.

---

# Docker During Development

Docker is normally used for infrastructure and reproducible application environments.

Common commands:

```text
docker compose up -d
docker compose ps
docker compose logs
docker compose logs postgres
docker compose logs server
docker compose down
```

Detailed Docker instructions belong in:

```text
docs/docker.md
```

---

# Avoid Unnecessary Destructive Commands

Be careful with:

```text
docker compose down -v
```

The `-v` option removes Compose-managed volumes.

For PostgreSQL this can destroy local database state.

Do not use it as a routine troubleshooting command.

Verify backups before destructive operations.

---

# Generated Files

Do not manually maintain generated output when it is produced by project tooling.

Examples include:

```text
node_modules/
apps/client/dist/
generated Prisma Client files
```

The repository should contain source and configuration needed to reproduce these outputs.

---

# Documentation Changes

When development behavior changes, update the relevant documentation.

Examples:

```text
Environment changes -> docs/environment.md
Database changes -> docs/database.md
Docker changes -> docs/docker.md
API changes -> docs/api.md
Deployment changes -> docs/deployment.md
Security changes -> docs/security.md
Development workflow -> docs/development.md
```

Avoid duplicating the same detailed procedure in multiple documents.

---

# Before Committing

Use this checklist:

```text
[ ] I understand all modified files
[ ] No unintended files are included
[ ] No secrets are included
[ ] Dependencies are synchronized
[ ] Prisma migrations are included when required
[ ] Frontend lint passes when frontend code changed
[ ] Frontend build passes when frontend code changed
[ ] Prisma validation passes when schema changed
[ ] Affected backend functionality was tested
[ ] Affected frontend functionality was tested
[ ] Documentation was updated when required
```

---

# Before Pushing

Run:

```text
git status
git diff
```

Then run the relevant validation.

If everything passes:

```text
git add <files>
git commit -m "<message>"
git push
```

After pushing, check GitHub Actions.

---

# Development Principles

Keep changes focused.

Prefer existing project utilities and abstractions.

Keep business logic out of route definitions.

Keep database changes in Prisma migrations.

Keep secrets out of source control.

Keep frontend secrets out of Vite variables.

Prefer reproducible commands over manual configuration.

Test the complete request flow when changing API behavior.

Verify both database records and filesystem assets when working with uploads.

Do not use destructive Docker or database commands without understanding their effect.

---

# Quick Command Reference

## Install

```text
npm ci
```

## Start Development

```text
npm run dev
```

## Start Frontend

```text
npm run dev --workspace=client
```

## Start Backend

```text
npm run dev --workspace=@azaria/server
```

## Frontend Lint

```text
npm run lint --workspace=client
```

## Frontend Build

```text
npm run build --workspace=client
```

## Prisma Validate

```text
npx prisma validate --schema=apps/server/prisma/schema.prisma
```

## Prisma Generate

```text
npx prisma generate --schema=apps/server/prisma/schema.prisma
```

## Prisma Migration

```text
npx prisma migrate dev --schema=apps/server/prisma/schema.prisma
```

## Start PostgreSQL

```text
docker compose up -d postgres
```

## Check Containers

```text
docker compose ps
```

## PostgreSQL Logs

```text
docker compose logs postgres
```

## Server Logs

```text
docker compose logs server
```

## Git Status

```text
git status
```

## Git Diff

```text
git diff
```

---

# Final Development Flow

The normal development cycle is:

```text
1. Pull the latest changes.
2. Check the working tree.
3. Install dependencies if required.
4. Start PostgreSQL.
5. Start the backend and frontend.
6. Make a focused change.
7. Test the affected functionality.
8. Run relevant validation.
9. Review the Git diff.
10. Commit the change.
11. Push the branch.
12. Review CI.
13. Address failures before merging.
```

This workflow keeps local development consistent with the project's CI and prepares changes for the eventual production deployment process.
