# Azaria SW Docker Documentation

## 1. Purpose

Docker provides reproducible local and production-style environments for Azaria SW.

Detailed application, database, security, and deployment behavior is documented separately.

## 2. Docker Files

```text
docker-compose.yml
docker-compose.prod.yml
.dockerignore

apps/server/Dockerfile
apps/server/.dockerignore

apps/client/Dockerfile
apps/client/.dockerignore
apps/client/nginx.conf
```

The project uses npm workspaces, so Docker builds use the repository root as the build context.

## 3. Services

The Compose stack contains:

```text
client
  |
  v
server
  |
  v
postgres
```

- `client`: React application served by Nginx
- `server`: Express API
- `postgres`: PostgreSQL database

## 4. Images

The backend uses:

```text
Node.js 22 Alpine
```

The database uses:

```text
postgres:16-alpine
```

The client uses an Nginx Alpine image to serve the built React application.

Dockerfiles are responsible for creating the application images. Application changes should be made in source code rather than inside running containers.

## 5. Networking

Compose provides an internal network between services.

The server reaches PostgreSQL through its Compose service name:

```text
postgres
```

It should not use `localhost` to reach the database container.

The browser reaches the exposed application ports from the host.

Current local production-style ports are:

```text
5000 -> server
5173 -> client
```

## 6. Persistence

Persistent data is separated from disposable containers.

```text
postgres-data   -> PostgreSQL data
server-uploads  -> uploaded files
```

PostgreSQL stores data under:

```text
/var/lib/postgresql/data
```

Server uploads use the application's uploads directory.

Removing a container normally preserves named volumes. Removing volumes is destructive.

## 7. Environment Configuration

Docker configuration receives environment-specific values from environment configuration.

Sensitive values must not be committed or baked into images.

Examples:

```text
DATABASE_URL
POSTGRES_PASSWORD
JWT_SECRET
ADMIN_PASSWORD_HASH
GITHUB_TOKEN
```

Frontend Vite values are build-time configuration and are therefore public once included in the browser bundle.

Never pass secrets as frontend build arguments.

## 8. Development Usage

Start the development Compose environment:

```Bash
docker compose up -d
```

Check services:

```Bash
docker compose ps
```

Stop services:

```Bash
docker compose stop
```

Remove containers while preserving volumes:

```Bash
docker compose down
```

Docker is primarily used to provide PostgreSQL and reproducible application environments during development.

## 9. Production-Style Local Environment

The production Compose file can be used to test the complete containerized stack locally.

Build and start:

```Bash
docker compose -f docker-compose.prod.yml up -d --build
```

Check status:

```Bash
docker compose -f docker-compose.prod.yml ps
```

View logs:

```Bash
docker compose -f docker-compose.prod.yml logs -f
```

This is a local production-style test, not the final public deployment configuration.

## 10. Service Health

PostgreSQL uses a `pg_isready` healthcheck.

The server waits for PostgreSQL to become healthy before starting.

A healthy PostgreSQL container only proves that PostgreSQL is accepting connections. It does not prove that the expected database schema or migrations exist.

Database verification belongs in `docs/database.md`.

## 11. Builds

Normal rebuild:

```Bash
docker compose build
```

Production-style rebuild:

```Bash
docker compose -f docker-compose.prod.yml build
```

Build without cache only when necessary:

```Bash
docker compose build --no-cache
```

Docker layer caching should normally be preserved for faster builds.

## 12. Logs and Inspection

Useful commands:

```Bash
docker compose ps
docker compose logs -f
docker compose logs server
docker compose logs postgres
docker compose logs client
```

Enter a container when necessary:

```Bash
docker compose exec SERVICE sh
```

For database inspection, use the procedures documented in `docs/database.md`.

## 13. Volumes and Data Safety

Inspect volumes with:

```Bash
docker volume ls
```

The important persistent resources are:

```text
postgres-data
server-uploads
```

Do not remove persistent volumes unless the data is backed up or intentionally disposable.

In particular, avoid using:

```Bash
docker compose down -v
```

as a generic troubleshooting command because it removes Compose volumes.

## 14. Container vs Volume

The basic Docker rule is:

```text
Container = disposable runtime
Image     = application build
Volume    = persistent data
```

Therefore:

```text
Application code -> image
Database data    -> postgres-data
Uploaded files   -> server-uploads
```

Rebuilding or recreating application containers should not remove persistent data when the volumes are preserved.

## 15. Troubleshooting

For a failing Docker environment, check:

```text
1. docker compose ps
2. service logs
3. environment configuration
4. service dependencies
5. database connection
6. volumes
7. application/API health
```

Common problems include:

- PostgreSQL not healthy
- Wrong `DATABASE_URL`
- Wrong database or volume
- Missing migrations
- Missing upload volume
- Incorrect frontend API URL
- Stale Docker image

Do not modify application or database configuration before confirming the actual container, environment, and volume being used.

## 16. Destructive Operations

Use extra caution with:

```Bash
docker compose down -v
docker volume rm VOLUME
docker system prune
docker system prune --volumes
```

These commands can remove persistent resources.

Always inspect containers and volumes before destructive cleanup.

## 17. Production Considerations

The production Compose configuration is primarily a production-style container definition and local deployment test.

Final public deployment additionally requires infrastructure-specific decisions such as:

```text
Hosting
Domain
TLS
Reverse proxy
Secrets
Persistent storage
Database hosting
File storage
CI/CD
```

Those details belong in:

```text
docs/deployment.md
```

## 18. Key Rules

1. Keep application changes in source code, not running containers.
2. Keep persistent data in volumes or external storage.
3. Keep database and upload storage separate.
4. Use `postgres` as the database hostname inside Compose.
5. Never put secrets in images or source control.
6. Treat `down -v` as destructive.
7. Use Compose to manage Compose services.
8. Rebuild images when Dockerfile or build-time configuration changes.
9. Keep Docker configuration version-controlled.
10. Use `docs/database.md` and `docs/deployment.md` for details outside Docker itself.