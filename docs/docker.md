# Azaria SW Docker Documentation

## 1. Purpose

This document describes Docker usage in Azaria SW.

It covers:

* Docker architecture
* Images
* Containers
* Dockerfiles
* Compose services
* Networks
* Volumes
* Environment variables
* Development usage
* Production image builds
* Service startup
* Health checks
* Upload persistence
* Database persistence
* Troubleshooting
* Maintenance
* Common commands

API behavior is documented in docs/api.md.

Database behavior is documented in docs/database.md.

Security behavior is documented in docs/security.md.

Deployment procedures are documented in docs/deployment.md.

## 2. Docker Architecture

Azaria SW uses Docker to package the application services.

The current containerized architecture contains:

* PostgreSQL
* Express backend
* React frontend
* Nginx frontend runtime

The backend communicates with PostgreSQL through the Docker network.

The browser communicates with the frontend through Nginx.

The frontend communicates with the backend through HTTP.

The backend stores uploaded files separately from the database.

Persistent data is stored in named Docker volumes.

## 3. Repository Docker Files

Docker-related files are located at the repository root and application directories.

Root files include:

* .dockerignore
* docker-compose.yml
* docker-compose.prod.yml

Server files include:

* apps/server/Dockerfile
* apps/server/.dockerignore

Client files include:

* apps/client/Dockerfile
* apps/client/.dockerignore
* apps/client/nginx.conf

The Docker files are part of the application source and should be committed.

## 4. Docker Compose Files

The project has two Compose configurations.

Development Compose:

```text
docker-compose.yml
```

Production-oriented Compose:

```text
docker-compose.prod.yml
```

The two files serve different purposes.

The development configuration is intended for local development.

The production configuration builds the application images and runs the complete containerized stack.

The production configuration is not yet the final public deployment configuration.

A real deployment will require infrastructure-specific configuration.

## 5. Services

The Compose stack contains three main services.

The services are:

```text
postgres
server
client
```

The dependency flow is:

```text
client
  |
  v
server
  |
  v
postgres
```

The client depends on the server.

The server depends on PostgreSQL.

PostgreSQL is the persistence layer.

## 6. PostgreSQL Service

The PostgreSQL service uses:

```text
postgres:16-alpine
```

The service provides relational database storage.

Its configuration uses:

```text
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
```

These values should come from the environment.

They should not be hardcoded into the Compose file.

The database uses a named volume.

The PostgreSQL data directory inside the container is:

```text
/var/lib/postgresql/data
```

## 7. PostgreSQL Persistence

The PostgreSQL service mounts:

```text
postgres-data:/var/lib/postgresql/data
```

The volume preserves database data when the PostgreSQL container is recreated.

Removing the container does not normally remove the volume.

Removing the volume is destructive.

Before deleting a database volume:

1. Confirm the active Compose project.
2. Confirm the volume name.
3. Create a database backup.
4. Verify the backup.
5. Only then perform the destructive operation.

The database documentation contains the detailed backup and restore procedure.

## 8. PostgreSQL Health Check

PostgreSQL has a Compose health check.

The check uses:

```text
pg_isready
```

The check verifies that PostgreSQL is accepting connections.

The production Compose configuration uses:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
  interval: 10s
  timeout: 5s
  retries: 5
```

The doubled dollar signs are intentional.

Compose must pass the variables into the container instead of resolving them while parsing the Compose file.

## 9. Server Service

The backend runs as the:

```text
server
```

service.

The image is built from:

```text
apps/server/Dockerfile
```

The build context is the repository root.

The server exposes port:

```text
5000
```

The application itself listens on port 5000.

The server receives environment configuration from:

```text
apps/server/.env.production
```

for the production Compose configuration.

## 10. Server Image

The server image uses Node.js.

The Docker build is based on:

```text
node:22-alpine
```

The image contains the backend application and the dependencies required to run it.

The Prisma schema is copied into the image.

Prisma Client is generated during the image build.

The server source code is then copied into the image.

The image is designed to run the backend directly with Node.js.

## 11. Server Dependencies

The server Docker build uses the root workspace.

The repository uses npm workspaces.

The root package files therefore participate in the installation process.

The Docker build must preserve the workspace structure.

The server workspace is:

```text
apps/server
```

The server package is:

```text
@azaria/server
```

The production image must contain the dependencies required by that workspace.

## 12. Prisma in Docker

The server Docker image includes the Prisma schema.

The schema path is:

```text
apps/server/prisma/schema.prisma
```

The image build runs Prisma Client generation.

The command is equivalent to:

```bash
npx prisma generate --schema=apps/server/prisma/schema.prisma
```

Generating Prisma Client does not create database tables.

Database schema management remains a separate operation.

Migrations are documented in docs/database.md.

## 13. Server Uploads

Uploaded files are stored under:

```text
apps/server/uploads
```

The production container mounts a named volume at:

```text
/app/apps/server/uploads
```

The volume is:

```text
server-uploads
```

This separates uploaded files from the container filesystem.

Recreating the server container therefore does not normally remove uploaded files.

## 14. Upload Directory Structure

The upload storage currently contains directories such as:

```text
uploads/
  certificates/
  cv/
  profile/
  projects/
  resume/
  temp/
```

Project images may also contain project-specific subdirectories.

The database stores references to uploaded assets.

The physical files remain in the upload storage.

Database and filesystem cleanup therefore need to remain coordinated.

## 15. Client Service

The frontend runs as the:

```text
client
```

service.

The client image uses:

```text
apps/client/Dockerfile
```

The production client uses a multi-stage build.

The first stage builds the React application.

The final stage serves the generated static files through Nginx.

This avoids requiring Node.js at frontend runtime.

## 16. Client Build

The client build uses Node.js during the build stage.

The frontend is built with Vite.

The production build command is:

```bash
npm run build
```

The output is the Vite distribution directory.

The final image copies the generated files into Nginx.

The runtime image is therefore much smaller than a Node-based development image.

## 17. Nginx Runtime

The final frontend image uses:

```text
nginx:alpine
```

Nginx serves the generated React application.

The project has a custom configuration:

```text
apps/client/nginx.conf
```

The configuration controls how the frontend is served.

The browser accesses the frontend through Nginx.

## 18. Frontend Environment Values

Vite variables are build-time values.

The production Compose configuration provides:

```text
VITE_API_URL
VITE_UPLOAD_URL
VITE_APP_NAME
```

The current local production-style values are:

```text
VITE_API_URL=http://localhost:5000/api/v1
VITE_UPLOAD_URL=http://localhost:5000/uploads
VITE_APP_NAME=Azaria SW
```

These values are embedded into the frontend during the build.

Changing them after the image has been built does not normally change the already-generated JavaScript.

The client image must therefore be rebuilt when build-time Vite configuration changes.

## 19. Docker Networking

Compose automatically creates a network for the project.

Services on the same Compose network can communicate using service names.

The backend should connect to PostgreSQL using:

```text
postgres
```

as the hostname.

It should not use:

```text
localhost
```

for PostgreSQL from inside the server container.

Inside the server container, localhost refers to the server container itself.

## 20. Database Connection

The server uses:

```text
DATABASE_URL
```

to connect to PostgreSQL.

A container-to-container connection uses the PostgreSQL service name.

The general form is:

```text
postgresql://USER:PASSWORD@postgres:5432/DATABASE
```

The exact credentials must come from the environment.

The database name must match:

```text
POSTGRES_DB
```

## 21. Host Ports

The production Compose configuration publishes:

```text
5000:5000
```

for the server.

It publishes:

```text
5173:80
```

for the client.

The left side is the host port.

The right side is the container port.

Therefore:

```text
localhost:5000
```

reaches the server container.

And:

```text
localhost:5173
```

reaches Nginx in the client container.

These ports are suitable for the current local production test environment.

They should be reviewed before public deployment.

## 22. Service Dependencies

The server depends on PostgreSQL.

The dependency uses the PostgreSQL health condition:

```yaml
depends_on:
  postgres:
    condition: service_healthy
```

This prevents the server from being started before PostgreSQL is reported healthy.

The client depends on the server.

The client currently uses:

```yaml
condition: service_started
```

This only confirms that the server container has started.

It does not prove that every API endpoint is ready.

## 23. Restart Policy

The production services use:

```yaml
restart: unless-stopped
```

This allows Docker to restart a stopped service automatically in normal failure scenarios.

It also allows the services to restart after Docker itself restarts.

The service remains stopped if it is explicitly stopped by the operator.

## 24. Development Docker Usage

Docker is useful for running PostgreSQL during development.

The application can still be developed locally depending on the selected workflow.

When using the Compose stack, common commands include:

```bash
docker compose up -d
```

and:

```bash
docker compose down
```

The exact development configuration is defined by:

```text
docker-compose.yml
```

Do not assume the production Compose configuration is identical to the development configuration.

## 25. Start the Stack

Start the Compose services with:

```bash
docker compose up -d
```

This starts the services in detached mode.

Check the status with:

```bash
docker compose ps
```

Check all containers with:

```bash
docker ps
```

The PostgreSQL service should eventually show a healthy status.

## 26. Stop the Stack

Stop the services with:

```bash
docker compose stop
```

This stops the containers without removing them.

To stop and remove the containers:

```bash
docker compose down
```

The named volumes are normally preserved by this command.

To remove volumes as well:

```bash
docker compose down -v
```

Do not use the volume option casually.

It can delete persistent database data.

## 27. Rebuild Images

Rebuild the application images with:

```bash
docker compose build
```

For the production configuration:

```bash
docker compose -f docker-compose.prod.yml build
```

A rebuild is required after Dockerfile changes.

A rebuild is also required when frontend build-time Vite values change.

## 28. Rebuild and Start

A common production-style local test is:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

This rebuilds changed images and starts the services.

After startup, verify:

```bash
docker compose -f docker-compose.prod.yml ps
```

Then inspect logs if necessary.

## 29. View Logs

View all Compose logs:

```bash
docker compose logs
```

Follow logs:

```bash
docker compose logs -f
```

View server logs:

```bash
docker compose logs server
```

View PostgreSQL logs:

```bash
docker compose logs postgres
```

View client logs:

```bash
docker compose logs client
```

Limit the number of lines:

```bash
docker compose logs --tail=100 server
```

## 30. Execute Commands in Containers

Use:

```bash
docker compose exec SERVICE COMMAND
```

For PostgreSQL:

```bash
docker compose exec postgres psql -U azaria -d azaria_sw
```

For the server:

```bash
docker compose exec server sh
```

For the client:

```bash
docker compose exec client sh
```

The exact command available depends on the image.

Alpine-based images commonly provide `sh`.

## 31. PostgreSQL Inspection

Use the PostgreSQL container for database inspection.

List tables:

```bash
docker compose exec postgres psql -U azaria -d azaria_sw -c "\dt"
```

For PascalCase Prisma table names, quote the identifier.

Example:

```bash
docker compose exec postgres psql -U azaria -d azaria_sw -c "SELECT COUNT(*) FROM `"Profile`";"
```

PowerShell quoting can require special handling.

The database documentation contains more database-specific examples.

## 32. Volume Inspection

List Docker volumes:

```bash
docker volume ls
```

Inspect a volume:

```bash
docker volume inspect VOLUME_NAME
```

The important application volumes include:

```text
postgres-data
server-uploads
```

The actual Docker Compose project may prefix the volume names.

Always verify the exact name before destructive operations.

## 33. Volume Separation

Database data and uploaded files are stored separately.

Database:

```text
postgres-data
```

Uploads:

```text
server-uploads
```

This separation is intentional.

Removing upload storage should not remove database records.

Removing database storage should not remove uploaded files.

However, restoring one without the other can create inconsistent application state.

## 34. Backup Strategy

Docker volumes provide persistence.

They are not a replacement for backups.

The PostgreSQL database should have independent database dumps.

Uploaded files should also have an independent backup strategy before real deployment.

A safe backup approach protects:

* database data
* uploaded files
* migration history
* environment configuration

Never treat a Docker volume as the only backup.

## 35. Database Volume Safety

The database volume contains persistent PostgreSQL data.

Before running:

```bash
docker compose down -v
```

verify that the database has been backed up.

Before running:

```bash
docker volume rm VOLUME_NAME
```

verify that the volume is not the active database volume.

Keep a known-good database dump before destructive maintenance.

## 36. Upload Volume Safety

The upload volume contains user or portfolio assets.

Before removing it:

1. Confirm the volume.
2. List the files.
3. Create an independent backup.
4. Verify the backup.
5. Remove the volume only if necessary.

Uploaded files are not recreated automatically from the database.

## 37. Image Layers

Docker images are built in layers.

Each Dockerfile instruction can create a layer.

Keeping dependency installation separate from source code copying can improve build caching.

The project Dockerfiles use the workspace structure to install dependencies and then copy application source.

Avoid unnecessarily invalidating dependency layers.

## 38. Build Context

The Compose build context is the repository root.

This is required because the application uses npm workspaces.

The Dockerfiles therefore reference paths such as:

```text
apps/server
apps/client
package.json
package-lock.json
```

The root `.dockerignore` reduces unnecessary build context.

Application-specific `.dockerignore` files also exist.

## 39. Docker Ignore Files

The repository contains:

```text
.dockerignore
apps/server/.dockerignore
apps/client/.dockerignore
```

Ignore files prevent unnecessary files from being included in Docker build contexts.

They should exclude development-only content where appropriate.

Typical excluded content includes:

```text
node_modules
logs
environment files
build output
git metadata
```

The exact exclusions should remain aligned with the current build requirements.

## 40. Secrets

Secrets must not be baked into Docker images.

Do not place real values inside:

```text
Dockerfile
docker-compose.yml
docker-compose.prod.yml
```

unless the value is explicitly non-sensitive.

Sensitive configuration should be supplied through environment files or deployment secrets.

Examples include:

```text
DATABASE_URL
POSTGRES_PASSWORD
JWT_SECRET
ADMIN_PASSWORD_HASH
ADMIN_SEQUENCE_HASH
GITHUB_TOKEN
```

## 41. Build Arguments

Frontend Vite variables are supplied as build arguments.

For example:

```yaml
args:
  VITE_API_URL: ...
  VITE_UPLOAD_URL: ...
  VITE_APP_NAME: ...
```

Build arguments are appropriate for frontend configuration that is intended to become part of the public frontend bundle.

Do not pass private secrets as frontend build arguments.

Anything embedded in a browser bundle is potentially visible to users.

## 42. Production Environment

The production server receives its runtime configuration through:

```text
apps/server/.env.production
```

This file should contain environment-specific values.

It should not be committed if it contains secrets.

The repository should contain an example file instead.

The exact production secrets depend on the eventual hosting environment.

## 43. Production Compose Configuration

The current production Compose file defines:

```text
postgres
server
client
```

PostgreSQL uses a persistent volume.

The server uses a persistent uploads volume.

The client is served by Nginx.

The server waits for PostgreSQL health.

The client waits for the server container to start.

## 44. Current Local Production Test

The production Compose file can be used for local testing.

Build:

```bash
docker compose -f docker-compose.prod.yml build
```

Start:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Check status:

```bash
docker compose -f docker-compose.prod.yml ps
```

Check server logs:

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 server
```

Check PostgreSQL:

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 postgres
```

## 45. Production Is Not Public Deployment

The current production Compose configuration is not a complete public deployment.

It currently uses local-style host ports.

The frontend API URLs currently reference localhost.

There is no finalized public domain.

There is no finalized hosting provider.

There is no reverse proxy or TLS configuration for the final public infrastructure.

Those decisions belong to the deployment phase.

## 46. Docker and CI

The CI workflow validates the project.

It currently performs backend Prisma validation.

It also performs frontend linting and production build validation.

Docker image building is a separate concern.

The CI pipeline should not assume that local Docker state exists.

Docker-specific CI steps can be added later if image validation becomes part of the CI requirements.

## 47. Docker and CD

Continuous deployment is intentionally delayed.

The project does not yet have:

* a selected production server
* a finalized hosting provider
* a finalized domain
* final TLS configuration
* a container registry strategy

CD should be implemented immediately before deployment.

The production Compose configuration provides the foundation for that later work.

## 48. Image Naming

Compose normally generates image names based on the Compose project and service.

The current local images include names similar to:

```text
azaria-sw-server
azaria-sw-client
```

Container names may include the Compose project and service.

Do not rely on automatically generated names in deployment automation unless explicitly configured.

## 49. Container Status

Use:

```bash
docker ps
```

to view running containers.

Use:

```bash
docker ps -a
```

to view running and stopped containers.

Use:

```bash
docker compose ps
```

to view services belonging to the current Compose project.

The Compose command is preferred when debugging a Compose stack.

## 50. Container Health

A running container does not necessarily mean the application is healthy.

For PostgreSQL:

```text
Up ... (healthy)
```

is expected after successful initialization.

For the server, a running container means the process is running.

Application health should still be tested through the API.

For the client, a running Nginx container should still be tested through the browser.

## 51. Common Startup Sequence

A normal production-style startup looks like:

```text
Docker starts PostgreSQL
        |
        v
PostgreSQL health check passes
        |
        v
Server container starts
        |
        v
Server connects to PostgreSQL
        |
        v
Client container starts
        |
        v
Nginx serves React application
```

The actual application readiness still depends on configuration and database state.

## 52. Database Schema Is Separate

Docker starting PostgreSQL does not automatically prove that the expected schema exists.

A healthy PostgreSQL container can still contain:

* an empty database
* the wrong database
* an old volume
* an incomplete migration state

Schema management remains a Prisma responsibility.

Check migrations and tables separately.

## 53. Migration Safety

Do not solve schema problems by deleting the database volume unless the data is disposable or backed up.

Check:

```text
DATABASE_URL
POSTGRES_DB
Compose project
PostgreSQL volume
_prisma_migrations
```

before diagnosing an apparently empty database.

The database documentation contains the detailed diagnosis procedure.

## 54. Wrong Database Troubleshooting

If Prisma reports:

```text
table does not exist
```

first verify the database connection.

Check the database name.

Check the PostgreSQL container.

Check the volume.

Check the migration records.

Check the actual tables.

Do not immediately modify the Prisma schema.

## 55. Wrong Table Identifier

Prisma model names such as:

```text
Profile
Project
Education
```

correspond to quoted PostgreSQL identifiers.

PostgreSQL lowercases unquoted identifiers.

Therefore:

```sql
SELECT COUNT(*) FROM Profile;
```

can be interpreted as:

```text
profile
```

Use:

```sql
SELECT COUNT(*) FROM "Profile";
```

when querying these tables manually.

## 56. Upload Endpoint Troubleshooting

Uploaded files are served from the backend.

The backend exposes the upload directory through the `/uploads` path.

The Docker server must have access to:

```text
/app/apps/server/uploads
```

The production Compose file mounts the upload volume there.

If an upload succeeds but the file cannot be retrieved, check:

1. The upload volume.
2. The server mount path.
3. The requested `/uploads` path.
4. Static file configuration.
5. The file's physical location.

## 57. Upload Persistence Test

After uploading a file:

Check the server volume:

```bash
docker volume ls
```

Then inspect the running server container:

```bash
docker compose exec server ls -la /app/apps/server/uploads
```

Check the relevant subdirectory.

Restart the server container.

Verify that the uploaded file still exists.

This confirms that the upload volume is persistent.

## 58. Database Persistence Test

Create or verify database data.

Restart the PostgreSQL container.

Check the same data again.

A named volume should preserve the records.

Do not use:

```bash
docker compose down -v
```

during this test.

That command can remove the database volume.

## 59. Container Recreation Test

Container recreation is different from volume deletion.

This:

```bash
docker compose down
docker compose up -d
```

normally recreates containers while preserving named volumes.

This:

```bash
docker compose down -v
```

also removes named volumes.

For persistent services, always know which operation is being performed.

## 60. Clean Image Rebuild

When troubleshooting a suspicious image cache:

```bash
docker compose build --no-cache
```

For production:

```bash
docker compose -f docker-compose.prod.yml build --no-cache
```

Use this only when necessary.

No-cache builds are slower.

Normal builds should use Docker layer caching.

## 61. Remove Unused Images

List images:

```bash
docker images
```

Remove a specific image:

```bash
docker rmi IMAGE
```

Docker may refuse to remove an image that is still referenced.

Do not remove production images or volumes without confirming their usage.

## 62. Remove Stopped Containers

List stopped containers:

```bash
docker ps -a
```

Remove a specific container:

```bash
docker rm CONTAINER
```

Compose-managed containers should normally be managed through Compose.

Avoid manually deleting active Compose containers unless troubleshooting requires it.

## 63. Docker System Cleanup

Docker provides cleanup commands such as:

```bash
docker system prune
```

These commands can remove unused Docker resources.

They should not be used blindly.

Before cleanup, inspect:

```bash
docker ps -a
docker images
docker volume ls
```

Volumes require particular care because they may contain persistent application data.

## 64. Recommended Maintenance Order

For normal maintenance:

1. Check container status.
2. Check service logs.
3. Check volumes.
4. Check image versions.
5. Rebuild only when necessary.
6. Restart only the affected service.
7. Avoid destructive cleanup.
8. Verify the application after maintenance.

## 65. Server Restart

Restart only the server:

```bash
docker compose restart server
```

This does not intentionally remove the database.

The upload volume remains mounted.

Use this when changing runtime server behavior that requires a restart.

## 66. Client Restart

Restart only the client:

```bash
docker compose restart client
```

This restarts Nginx.

If frontend source or build-time variables changed, restarting an old image is not enough.

Rebuild the client image first.

## 67. PostgreSQL Restart

Restart PostgreSQL:

```bash
docker compose restart postgres
```

This restarts the database container.

Persistent data remains in the named volume.

Application connectivity should be verified afterward.

## 68. Full Stack Restart

Restart all services:

```bash
docker compose restart
```

This preserves the containers and volumes.

For a full recreation:

```bash
docker compose down
docker compose up -d
```

The second operation recreates the containers.

Named volumes remain unless the volume option is used.

## 69. Production Full Rebuild

For a complete local production-style rebuild:

```bash
docker compose -f docker-compose.prod.yml down
```

Then:

```bash
docker compose -f docker-compose.prod.yml build
```

Then:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Verify:

```bash
docker compose -f docker-compose.prod.yml ps
```

Do not add `-v` unless volume deletion is intentional.

## 70. Inspect Compose Configuration

Before starting production Compose, validate the resolved configuration:

```bash
docker compose -f docker-compose.prod.yml config
```

This is useful for detecting:

* YAML errors
* missing variables
* incorrect interpolation
* incorrect service definitions
* unexpected volume mappings
* incorrect build arguments

Review the output before deployment.

## 71. Environment Interpolation

Compose expands environment variables in the Compose file.

For example:

```yaml
POSTGRES_USER: ${POSTGRES_USER}
```

uses the environment value.

For commands that must be evaluated inside the container, escape the dollar sign:

```yaml
$${POSTGRES_USER}
```

This is why the PostgreSQL health check uses doubled dollar signs.

## 72. Compose Project Names

Compose resources are commonly prefixed with the project name.

For example:

```text
azaria-sw_postgres-data
azaria-sw_server-uploads
```

may appear as the actual Docker volume names.

Do not assume that:

```text
postgres-data
```

is the literal Docker volume name.

Use:

```bash
docker volume ls
```

to confirm the actual name.

## 73. Multiple Compose Projects

Running different Compose projects can create different resources.

For example:

```text
azaria-os
azaria-sw
```

can have separate PostgreSQL volumes.

This can cause confusing database behavior.

Always verify the active Compose project when diagnosing missing data.

## 74. Old Containers

Old containers can remain after changing Compose configuration.

Check:

```bash
docker ps -a
```

If an old PostgreSQL container exists, verify which project created it.

Do not remove it automatically.

It may contain data that is still needed for migration or recovery.

## 75. Old Database Volumes

Old database volumes can also remain.

Check:

```bash
docker volume ls
```

An old volume can contain a previous version of the application database.

Never assume a volume is unused only because its name is old.

Inspect the associated containers and project configuration first.

## 76. Migration Restore History

During project migration work, database dumps were used to restore existing data.

The dump can be inspected with:

```bash
pg_restore -l dump_file.dump
```

A table can be searched in the output.

For example:

```powershell
pg_restore -l /tmp/azaria_os.dump | Select-String "Education"
```

This helps verify that a backup actually contains the expected database objects.

## 77. Restore Principle

A dump should be restored into the intended database.

Before restoring:

1. Confirm the dump.
2. Confirm the target database.
3. Confirm the PostgreSQL container.
4. Confirm the volume.
5. Keep the previous state backed up.

Do not restore an unknown dump into the active database without verification.

## 78. Schema-Only Restore

A schema-only restore can be used for inspection or controlled recreation.

Example:

```bash
pg_restore --schema-only --table=Education dump_file.dump
```

If the table already exists, PostgreSQL can report:

```text
relation "Education" already exists
```

This does not necessarily indicate a failure of the existing schema.

It can simply mean the target already contains the table.

## 79. Docker Build Failures

If a build fails unexpectedly:

Check Docker Desktop.

Check:

```bash
docker info
```

Check the Docker daemon.

Then retry:

```bash
docker compose -f docker-compose.prod.yml build
```

A temporary Docker Desktop failure is different from a Dockerfile failure.

Read the first actual build error rather than the final summary line.

## 80. Docker Desktop

Local development currently uses Docker Desktop.

If Docker commands report that the Docker daemon cannot start, check Docker Desktop first.

For example:

```text
Docker Desktop is unable to start
```

is an environment problem, not necessarily a Compose configuration problem.

Once Docker is running, retry the same command.

## 81. Build Network Failures

Docker image builds may need access to Docker registries.

The current images include:

```text
node:22-alpine
nginx:alpine
postgres:16-alpine
```

If Docker cannot retrieve an image, check:

* Docker daemon status
* network connectivity
* registry availability
* image name
* Docker Hub access

Do not change the Dockerfile merely because a registry request temporarily failed.

## 82. Build Cache

Docker caches completed build steps.

A source-only change may reuse dependency layers.

A dependency file change can invalidate later layers.

This behavior is expected.

Use a no-cache build only when cache behavior is suspected.

## 83. Dependency Vulnerabilities

Docker builds may report npm audit vulnerabilities.

For example:

```text
npm ci
```

may report vulnerabilities in installed dependencies.

This output does not automatically mean the Docker build failed.

Dependency security should be reviewed separately.

Do not run automatic dependency upgrades inside a Docker troubleshooting step without reviewing the resulting package changes.

## 84. Node Version

The backend Docker build currently uses Node 22 Alpine.

The CI workflow also targets Node 22.

Keeping these versions aligned reduces environment differences.

If the Node version changes, review:

* Dockerfiles
* CI
* package compatibility
* npm behavior
* production runtime behavior

## 85. PostgreSQL Version

The project currently uses:

```text
postgres:16-alpine
```

The database documentation should remain aligned with this version.

Changing PostgreSQL versions should be treated as an infrastructure change.

Test migrations and application behavior before changing the production database image.

## 86. Nginx Version

The client runtime currently uses:

```text
nginx:alpine
```

The exact Alpine release is determined by the image tag.

A future production deployment may pin a more specific version if reproducibility requirements increase.

Review Nginx configuration whenever frontend routing or asset serving behavior changes.

## 87. Reproducibility

For reproducible builds:

* commit package-lock.json
* keep Dockerfiles versioned
* keep Compose files versioned
* avoid undocumented manual container changes
* keep migrations committed
* document environment requirements

The application should be reproducible from source and configuration.

## 88. Do Not Modify Running Containers

Avoid manually changing application files inside running containers.

Changes made inside a container are generally lost when the container is recreated.

Persistent application changes belong in:

* source code
* Dockerfiles
* Compose configuration
* environment configuration
* persistent volumes when appropriate

## 89. Container vs Volume

A container is disposable runtime state.

A volume is persistent data.

Application code belongs in the image.

Database data belongs in the PostgreSQL volume.

Uploaded files belong in the uploads volume.

This distinction is fundamental to the current Docker architecture.

## 90. Development Data

Development data can be stored in the development PostgreSQL volume.

Do not assume development data is disposable if it contains important portfolio content.

If the development database contains valuable data, back it up before destructive operations.

## 91. Production Data

Production data must be treated as persistent.

At minimum, protect:

```text
PostgreSQL data
Uploaded files
Migration history
Environment configuration
```

Database backups and file backups should be independent from the Docker host.

## 92. Uploads and Image Rebuilds

Rebuilding the server image should not be relied upon as a backup mechanism.

The production Compose configuration mounts the upload directory as a volume.

The volume therefore owns the persistent upload data.

The image may contain an initial uploads directory, but runtime uploads should remain in the mounted volume.

## 93. Client Rebuilds and Data

The frontend contains static application code.

It does not store the PostgreSQL database.

It does not own server uploads.

Rebuilding the client image therefore does not replace backend data.

Frontend configuration is rebuilt into the static bundle.

## 94. Server Rebuilds and Data

Rebuilding the server image replaces the server container image.

It should not remove:

```text
postgres-data
server-uploads
```

as long as the Compose volumes are preserved.

This is why application state is separated from the container filesystem.

## 95. Recommended Development Workflow

A normal Docker development workflow is:

```text
1. Start Docker Desktop
2. Start PostgreSQL
3. Start the required application services
4. Check service status
5. Develop and test
6. Review logs
7. Stop services when finished
```

Use Compose commands instead of manually recreating the same service configuration.

## 96. Recommended Production-Test Workflow

Before deployment:

```text
1. Validate Compose configuration
2. Build server image
3. Build client image
4. Start PostgreSQL
5. Wait for health
6. Start server
7. Verify database connection
8. Start client
9. Test API
10. Test frontend
11. Test uploads
12. Test persistence
13. Review logs
14. Stop without deleting volumes
```

This is a local production-style test.

It is not yet the final deployment process.

## 97. Important Destructive Commands

Use caution with:

```bash
docker compose down -v
docker volume rm ...
docker system prune
docker system prune --volumes
```

These can remove persistent data.

Never execute them as generic troubleshooting commands.

Always determine exactly what will be removed first.

## 98. Useful Command Reference

Check Docker:

```bash
docker --version
docker info
```

Check containers:

```bash
docker ps
docker ps -a
```

Check images:

```bash
docker images
```

Check volumes:

```bash
docker volume ls
```

Check Compose:

```bash
docker compose ps
docker compose config
```

## 99. Compose Command Reference

Start:

```bash
docker compose up -d
```

Stop:

```bash
docker compose stop
```

Remove containers:

```bash
docker compose down
```

Build:

```bash
docker compose build
```

Build and start:

```bash
docker compose up -d --build
```

Logs:

```bash
docker compose logs -f
```

Execute:

```bash
docker compose exec SERVICE COMMAND
```

## 100. Production Compose Command Reference

Validate:

```bash
docker compose -f docker-compose.prod.yml config
```

Build:

```bash
docker compose -f docker-compose.prod.yml build
```

Start:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Build and start:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Status:

```bash
docker compose -f docker-compose.prod.yml ps
```

Logs:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

Stop:

```bash
docker compose -f docker-compose.prod.yml down
```

## 101. Final Docker Principles

The project follows these Docker principles:

1. Containers are disposable.
2. Persistent data belongs in volumes.
3. Database and upload data use separate volumes.
4. PostgreSQL is reached by service name inside Compose.
5. Frontend Vite values are build-time configuration.
6. Secrets must remain outside images and source control.
7. Dockerfiles should remain reproducible.
8. Compose should define service relationships.
9. Health checks should be used for important dependencies.
10. Database backups are separate from Docker volumes.
11. Destructive Docker commands require explicit verification.
12. Production deployment configuration will be finalized later.
13. CI validates application code independently from deployment.
14. CD will be added when the hosting environment is selected.
15. Docker changes should be tested locally before deployment.