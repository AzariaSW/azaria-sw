# Azaria SW Environment Documentation

## Purpose

This document explains how environment configuration is organized in Azaria SW.

It covers:

* Environment files
* Server configuration
* Client configuration
* Development configuration
* Production configuration
* Docker-related configuration
* Secrets
* Public client variables
* Environment validation
* Common configuration mistakes

Development workflow is documented in docs/development.md.

Docker usage is documented in docs/docker.md.

Production deployment is documented in docs/deployment.md.

Security considerations are documented in docs/security.md.

---

# Environment Structure

Azaria SW uses separate configuration for the client and server.

The main environment locations are:

```text
.env
.env.example

apps/
  client/
    .env
    .env.example

  server/
    .env
    .env.example
    .env.production
```

The exact files used can vary between local development and production.

Environment files containing real secrets must never be committed.

Example files are safe to commit because they contain placeholders rather than real secrets.

---

# Root Environment

The root environment is primarily used by Docker Compose.

Docker Compose reads variables such as:

```text
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
```

These values are used to configure PostgreSQL.

The root environment can also be used for Compose-level configuration when required.

The root `.env.example` documents variables expected by the project.

---

# Server Environment

The server requires runtime configuration.

Server environment configuration includes:

```text
NODE_ENV
PORT
DATABASE_URL
CLIENT_URL

ADMIN_USERNAME
ADMIN_PASSWORD_HASH
ADMIN_SEQUENCE_HASH

JWT_SECRET
JWT_EXPIRES_IN
JWT_CHALLENGE_EXPIRES_IN

GITHUB_USERNAME
GITHUB_TOKEN
```

The exact required variables are defined by the server configuration and environment validation code.

Do not hard-code secrets in source files.

---

# Client Environment

The frontend is a Vite application.

Client environment variables use the `VITE_` prefix.

Current client configuration includes:

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

These variables are available to frontend code at build time.

---

# Important Client Security Rule

Vite client variables are not secret.

Any variable exposed through:

```text
VITE_*
```

can become part of the generated frontend bundle.

Therefore never put the following into client environment variables:

```text
DATABASE_URL
JWT_SECRET
ADMIN_PASSWORD_HASH
ADMIN_SEQUENCE_HASH
GITHUB_TOKEN
POSTGRES_PASSWORD
```

Secrets belong on the server side.

---

# Development Environment

Local development normally uses:

```text
NODE_ENV=development
```

The server uses a local PostgreSQL connection.

When PostgreSQL runs through Docker Compose, the host machine can connect through the published PostgreSQL port when that port is exposed.

The server running inside Docker should use the PostgreSQL service name rather than `localhost`.

For example:

```text
postgresql://azaria:<password>@postgres:5432/azaria_sw
```

The exact connection string must match the configured database credentials.

---

# Database Configuration

The database configuration is controlled by two related settings.

PostgreSQL uses:

```text
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
```

The application uses:

```text
DATABASE_URL
```

These values must describe the same database.

Example:

```text
POSTGRES_USER=azaria
POSTGRES_PASSWORD=<secret>
POSTGRES_DB=azaria_sw
```

Corresponding server connection:

```text
DATABASE_URL=postgresql://azaria:<secret>@postgres:5432/azaria_sw
```

The database name must match.

The username must match.

The password must match.

The Docker hostname must be correct for the environment.

---

# Docker Hostname Rule

Inside the Docker Compose network, services communicate using service names.

The PostgreSQL service is named:

```text
postgres
```

Therefore the server should not normally use:

```text
localhost
```

for its PostgreSQL connection when both services run in Docker.

Correct:

```text
postgresql://azaria:<password>@postgres:5432/azaria_sw
```

Incorrect for container-to-container communication:

```text
postgresql://azaria:<password>@localhost:5432/azaria_sw
```

`localhost` inside the server container refers to the server container itself.

---

# Server Port

The server listens on the configured `PORT`.

Current production configuration uses:

```text
PORT=5000
```

The Docker Compose production configuration publishes:

```text
5000:5000
```

The internal server port and published host port are separate concepts.

The application listens on the container port.

Docker publishes that port to the host.

---

# Client API URL

The frontend needs to know where the API is available.

Development example:

```text
VITE_API_URL=http://localhost:5000/api/v1
```

The URL points to the API version prefix.

The frontend should not construct API paths by guessing server locations.

API requests should use the configured API base URL.

---

# Client Upload URL

Uploaded assets are served from the server upload endpoint.

Development example:

```text
VITE_UPLOAD_URL=http://localhost:5000/uploads
```

The frontend uses this value when constructing asset URLs.

The upload URL is not a secret.

It is therefore acceptable to expose it through the Vite client build.

---

# Application Name

The frontend application name is configured through:

```text
VITE_APP_NAME
```

Current value:

```text
VITE_APP_NAME=Azaria SW
```

This value may be used by frontend configuration or UI code.

It contains no sensitive information.

---

# Client URL

The server uses:

```text
CLIENT_URL
```

to identify the approved frontend origin.

This value is important for CORS configuration.

Example:

```text
CLIENT_URL=http://localhost:5173
```

A production deployment should use the actual production frontend origin.

Do not confuse `CLIENT_URL` with `VITE_API_URL`.

`CLIENT_URL` identifies the frontend origin.

`VITE_API_URL` identifies the backend API.

---

# JWT Configuration

Administrator authentication uses JWT.

The server environment contains:

```text
JWT_SECRET
JWT_EXPIRES_IN
JWT_CHALLENGE_EXPIRES_IN
```

Example structure:

```text
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=1h
JWT_CHALLENGE_EXPIRES_IN=5m
```

The secret must remain private.

Token expiration values are configuration values and should not be exposed through the frontend.

---

# Administrator Configuration

Administrator authentication uses:

```text
ADMIN_USERNAME
ADMIN_PASSWORD_HASH
ADMIN_SEQUENCE_HASH
```

The password and challenge sequence are stored as hashes.

Example:

```text
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt-hash>
ADMIN_SEQUENCE_HASH=<bcrypt-hash>
```

Never replace the hashes with plaintext passwords or secret sequences.

Never place these values in client environment files.

---

# GitHub Configuration

GitHub integration uses:

```text
GITHUB_USERNAME
GITHUB_TOKEN
```

The username is not normally sensitive.

The token is sensitive.

Example:

```text
GITHUB_USERNAME=AzariaSW
GITHUB_TOKEN=<optional-token>
```

If a GitHub token is used, it must remain in the server environment.

It must never be placed in a `VITE_` variable.

---

# Production Environment

Production uses server runtime variables separately from frontend build arguments.

The production Compose configuration provides PostgreSQL settings through:

```text
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
```

The server receives its production environment through:

```text
apps/server/.env.production
```

The frontend receives Vite variables during its Docker image build.

Example production build arguments currently use:

```text
VITE_API_URL=http://localhost:5000/api/v1
VITE_UPLOAD_URL=http://localhost:5000/uploads
VITE_APP_NAME=Azaria SW
```

These URLs are deployment-specific.

They must be changed when the application is eventually deployed behind a real domain.

---

# Build-Time vs Runtime

The client and server handle environment variables differently.

## Client

Vite variables are evaluated during the frontend build.

Changing:

```text
VITE_API_URL
```

after the frontend image has already been built does not automatically change the compiled application.

The client must normally be rebuilt.

## Server

Server environment variables are read at runtime.

Changing server configuration normally requires restarting or recreating the server container.

This difference is important when deploying the application.

---

# Environment File Rules

Use `.env.example` files to document required configuration.

Do not commit real `.env` files.

Do not commit:

```text
.env
.env.production
```

when they contain real credentials.

Example files should contain placeholders:

```text
DATABASE_URL=<database-url>
JWT_SECRET=<jwt-secret>
ADMIN_PASSWORD_HASH=<bcrypt-hash>
```

---

# Secret Management

The following values must be treated as secrets:

```text
POSTGRES_PASSWORD
DATABASE_URL
JWT_SECRET
ADMIN_PASSWORD_HASH
ADMIN_SEQUENCE_HASH
GITHUB_TOKEN
```

A database URL is sensitive even when it contains more than a password.

Never paste real secret values into:

* Source code
* Git commits
* Documentation
* Screenshots
* Frontend code
* Public issue reports

---

# Environment Separation

Development and production should use different credentials.

Do not reuse production administrator credentials for development.

Do not reuse production database passwords for development.

Do not use production JWT secrets locally.

Environment separation limits the impact of accidental exposure.

---

# Environment Examples

A development server configuration may resemble:

```text
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://azaria:<password>@localhost:5432/azaria_sw
CLIENT_URL=http://localhost:5173
JWT_SECRET=<development-secret>
JWT_EXPIRES_IN=1h
JWT_CHALLENGE_EXPIRES_IN=5m
GITHUB_USERNAME=AzariaSW
GITHUB_TOKEN=
```

A Docker server configuration may instead use:

```text
DATABASE_URL=postgresql://azaria:<password>@postgres:5432/azaria_sw
```

The difference is the database hostname.

---

# Validation

Environment configuration should be validated before the server starts.

Invalid or missing required values should prevent the application from starting with an unusable configuration.

This is preferable to allowing the server to start and fail later during a database or authentication request.

Environment validation belongs to the server configuration layer.

---

# Common Mistakes

## Wrong Database Name

Symptoms include:

```text
database does not exist
```

Check:

```text
POSTGRES_DB
DATABASE_URL
```

They must refer to the same database.

---

## Wrong Database Host

Inside Docker, using:

```text
localhost
```

for PostgreSQL is usually incorrect.

Use:

```text
postgres
```

when connecting to the Compose PostgreSQL service.

---

## Wrong Client API URL

If frontend requests fail, verify:

```text
VITE_API_URL
```

The value must include the API base path expected by the application.

Current API base path:

```text
/api/v1
```

---

## Wrong Upload URL

If images or documents fail to load, verify:

```text
VITE_UPLOAD_URL
```

The value should point to the server upload route.

---

## Client Variable Not Updating

If a changed `VITE_*` value has no effect, rebuild the frontend.

Vite variables are build-time configuration.

---

## Secret Exposed to Client

Never create:

```text
VITE_JWT_SECRET
VITE_DATABASE_URL
VITE_GITHUB_TOKEN
```

These would be exposed to frontend users.

Keep sensitive configuration server-side.

---

# Environment Checklist

Before running the application, verify:

```text
[ ] Required environment files exist
[ ] .env.example files match current configuration
[ ] Real secrets are not committed
[ ] DATABASE_URL points to the correct database
[ ] POSTGRES_DB matches DATABASE_URL
[ ] POSTGRES_USER matches DATABASE_URL
[ ] Database password matches
[ ] CLIENT_URL matches the frontend origin
[ ] VITE_API_URL points to the API
[ ] VITE_UPLOAD_URL points to uploads
[ ] JWT_SECRET exists on the server
[ ] Administrator hashes exist on the server
[ ] GitHub token is server-only
```

---

# Configuration Ownership

Configuration should remain close to the component that consumes it.

Server environment values are handled by server configuration.

Client environment values are handled by client configuration.

Docker Compose values configure infrastructure.

Prisma configuration handles database tooling.

This separation prevents application code from becoming responsible for infrastructure configuration.

---

# Relationship With Other Documentation

Environment configuration should not duplicate the complete security documentation.

Security concerns are documented in:

```text
docs/security.md
```

Database configuration and persistence are documented in:

```text
docs/database.md
```

Docker configuration is documented in:

```text
docs/docker.md
```

Development commands are documented in:

```text
docs/development.md
```

Production deployment is documented in:

```text
docs/deployment.md
```

The purpose of this document is to explain how configuration values are organized and where they belong.

---

# Summary

Azaria SW separates configuration between the root project, server, client, and Docker environment.

The main principles are:

```text
Server secrets stay server-side.
VITE_* values are public.
Development and production use separate configuration.
Docker services communicate using service names.
DATABASE_URL must match PostgreSQL configuration.
Client environment changes require a rebuild.
Server environment changes require a restart.
Real environment files must remain outside source control.
Example environment files document required configuration.
```

Environment configuration should be reviewed whenever a new external service, secret, database setting, or deployment target is introduced.
