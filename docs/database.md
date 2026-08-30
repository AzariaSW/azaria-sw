# Azaria SW Database Documentation

## 1. Purpose

Documents PostgreSQL and Prisma usage: schema, models, relations, migrations, persistence, backup/restore, and maintenance.

Endpoint behavior: `docs/api.md`  
Architecture: `docs/architecture.md`  
Security: `docs/security.md`

## 2. Stack

- PostgreSQL 16 (`postgres:16-alpine`)
- Prisma 7.8.0
- Docker Compose with persistent PostgreSQL storage

Prisma files: `apps/server/prisma/`
- `schema.prisma` — database definition
- `seed.js` — seed data
- `migrations/` — versioned schema history
- `prisma.config.ts` — Prisma configuration

## 3. Architecture

```text
Client → Express → Controller → Service → Prisma → PostgreSQL
```

Controllers should delegate persistence to services rather than access Prisma directly.

## 4. Database Configuration

The application database is `azaria_sw`.

`POSTGRES_DB`, `DATABASE_URL`, and manual `psql` commands must target the same database.

In Docker, the server normally connects through the PostgreSQL Compose service name, not `localhost`.

Credentials belong in environment configuration, not source control.

## 5. PostgreSQL Persistence

PostgreSQL stores data under `/var/lib/postgresql/data`.

The Compose database volume (`postgres-data`) persists data across normal container recreation.

**Do not remove the database volume without a verified backup.**

Database storage is independent from server upload storage.

## 6. Models

| Model | Purpose | Key constraints/relations |
|---|---|---|
| `Profile` | Portfolio identity/contact data | References profile assets |
| `Skill` | Technical/professional skills | `name` unique |
| `Project` | Portfolio projects | Has many `ProjectImage` |
| `ProjectImage` | Image metadata | FK to `Project`; URL/path + order |
| `Experience` | Professional history | Required `startDate`, optional `endDate` |
| `Education` | Academic history | Unique `institution + degree` |
| `Certificate` | Certification metadata | Optional image |
| `ContactMessage` | Contact submissions | Persisted separately from HTTP handling |

Dates use PostgreSQL-compatible timestamp values. Creation/update timestamps are used where defined.

## 7. Integrity

Primary keys provide stable record identity; use IDs unless another field is explicitly unique.

Foreign keys preserve relationships, especially:

```text
Project → ProjectImage
```

Important database constraints include unique skill names, the Education composite key, and valid project/image relationships.

Parent deletion must account for child records. Database transactions do not roll back filesystem operations.

Exact fields, constraints, defaults, and relation actions are defined in `schema.prisma`.

## 8. Prisma

`schema.prisma` defines models, types, keys, constraints, relations, and defaults.

```bash
npx prisma validate --schema=apps/server/prisma/schema.prisma
npx prisma generate --schema=apps/server/prisma/schema.prisma
```

`validate` checks schema correctness; `generate` updates Prisma Client. Neither applies migrations.

## 9. Migrations

Migrations live in `apps/server/prisma/migrations/`. Each contains `migration.sql` and is committed to source control.

Rules:
- Create a new migration for every new schema change.
- Do not rewrite shared migrations.
- Review generated SQL.
- Keep schema and migration changes together.
- Production changes should use committed migrations.
- Emergency SQL must be reconciled with migration history.

Current migration history includes:

```text
20260712105426_init_schema
20260712121244_add_seed_constraints
20260714094401_add_contact_message
20260717213703_add_resume_url
20260718135456_add_project_images
20260718190230_rename_url_in_project_images
20260721170632_add_image_to_certificate
20260804122341_add_profilw_phone
20260805161525_add_profile_telegram
```

The `profilw` spelling is preserved because it is the actual migration name.

## 10. Migration Records

Prisma tracks applied migrations in `_prisma_migrations`, including names, checksums, and execution metadata.

Do not clear this table as routine troubleshooting.

For migration problems compare:
1. Source migration files
2. `_prisma_migrations`
3. Actual database schema

## 11. Seed Data

Seed logic is in `apps/server/prisma/seed.js` and must respect schema constraints.

Prisma `upsert` requires a unique selector:
- `Skill`: `name`
- `Education`: composite `institution + degree`

Non-unique fields cannot be used as upsert selectors.

## 12. Health and Inspection

PostgreSQL uses `pg_isready` for its Compose healthcheck.

```text
Process → Connection → Schema → Application
```

A healthy container does not prove that migrations or expected tables exist.

Useful inspection:

```bash
docker compose exec postgres psql
```

```sql
\dt
SELECT COUNT(*) FROM "Profile";
SELECT COUNT(*) FROM "Project";
SELECT COUNT(*) FROM "Education";
```

Current PascalCase table names should be quoted; unquoted `Profile` becomes `profile`.

## 13. Diagnosing Problems

### Database not found
Check `POSTGRES_DB`, `DATABASE_URL`, and the active Compose project/container.

### Missing tables
Check PostgreSQL → database name → mounted volume → migrations → actual tables → Prisma schema.

Do not immediately modify `schema.prisma`; the server may be using the wrong database or volume.

### Schema drift
Schema drift means actual database state differs from migration history. Common causes are manual SQL, wrong database/volume, or restoring an unrelated database.

## 14. Backup and Restore

A Docker volume provides persistence, not a portable backup. Use independent PostgreSQL dumps.

```bash
pg_dump -U azaria -d azaria_sw -Fc -f azaria_sw.dump
pg_restore -l azaria_sw.dump
pg_restore --no-owner --no-acl -d azaria_sw azaria_sw.dump
```

Exact commands depend on the environment.

Before restore, verify the dump, target database, and target volume/environment. Keep the previous backup until verification succeeds.

Prefer inspecting the archive and testing restoration against a disposable database when possible.

## 15. Restore Modes

- **Schema-only:** useful for schema inspection/recreation; existing objects may cause `relation already exists`.
- **Data-only:** useful when the target schema already exists and is compatible; constraints can affect restore ordering.
- Use inspected dump contents for selective restoration.

## 16. Migration vs Backup

| Migrations | Backups |
|---|---|
| Describe schema evolution | Preserve actual data/state |
| Stored in Git | Stored separately/protected |
| Reproduce structure changes | Recover from data loss |
| Do not replace backups | Do not replace migration history |

## 17. Prisma Studio

Prisma Studio is useful for development data inspection but does not replace migration history, SQL inspection, or backups.

## 18. Transactions

Use Prisma transactions when related database changes must be atomic, such as multi-record project updates.

Transactions do **not** roll back filesystem operations, so database and file changes require explicit coordination.

## 19. Maintenance

When changing the database:

1. Update `schema.prisma`.
2. Create and review a migration.
3. Apply and test locally.
4. Generate Prisma Client when required.
5. Test affected services/API behavior.
6. Update seed data if necessary.
7. Commit schema and migration together.

Avoid routine manual production schema edits. Back up before destructive operations.

## 20. Key Rules

- Keep `DATABASE_URL` and PostgreSQL configuration aligned.
- Treat migrations as source-controlled schema history.
- Never casually delete `_prisma_migrations`.
- Never remove the PostgreSQL volume without a verified backup.
- Quote current PascalCase identifiers in manual SQL.
- Use unique fields for Prisma upserts.
- Coordinate database state with referenced filesystem assets.
- Keep independent PostgreSQL dumps for recovery.
