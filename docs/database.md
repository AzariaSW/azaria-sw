# Azaria SW Database Documentation

## Purpose

Documents PostgreSQL and Prisma usage in Azaria SW.
Focuses on models, relations, migrations, persistence, backup, restore, and maintenance.
Endpoint behavior remains documented in docs/api.md.
Security behavior remains documented in docs/security.md.

## Database Stack

Database engine: PostgreSQL 16.
Container image: postgres:16-alpine.
ORM and data access layer: Prisma 7.8.0.
PostgreSQL provides persistent relational storage.

## Database Responsibilities

Stores portfolio profile information.
Stores skills, projects, images, experience, education, and certificates.
Stores contact messages.
Stores metadata that links records to uploaded files.

## Repository Location

Prisma files are under apps/server/prisma/.
The main schema is apps/server/prisma/schema.prisma.
Seed logic is in apps/server/prisma/seed.js.
Migration history is in apps/server/prisma/migrations/.

## Architecture

Client requests reach Express routes.
Controllers delegate persistence work to services.
Services use Prisma Client.
Prisma communicates with PostgreSQL.

## Database Name

The current application database is azaria_sw.
POSTGRES_DB must use the same database name.
DATABASE_URL must point to the same database.
Manual psql checks must also target the same database.

## PostgreSQL Container

PostgreSQL runs as a Docker service.
The project uses postgres:16-alpine.
The service is configured with user, password, and database variables.
The container uses a persistent named volume.

## Persistence

PostgreSQL data is stored under /var/lib/postgresql/data.
Compose maps that directory to postgres-data.
Normal container recreation does not remove the volume.
Removing the database volume is destructive.

## Application Tables

Profile stores the main portfolio identity.
Skill stores technical skills.
Project stores portfolio projects.
ProjectImage stores project image metadata.

## Additional Tables

Experience stores professional history.
Education stores academic history.
Certificate stores certifications.
ContactMessage stores submitted contact messages.

## Prisma Migration Table

Prisma maintains _prisma_migrations.
It records migration names and execution metadata.
It helps compare source migration history with database state.
It should not be manually cleared as routine troubleshooting.

## Identifier Naming

Prisma models use names such as Profile and Project.
PostgreSQL preserves quoted mixed-case identifiers.
Unquoted Profile becomes the lowercase identifier profile.
Use quoted identifiers when querying these tables manually.

## Manual SQL Example

Use SELECT COUNT(*) FROM "Profile";
Use SELECT COUNT(*) FROM "Project";
Use SELECT COUNT(*) FROM "Education";
Do not omit quotes around current PascalCase table names.

## Profile Model

Profile stores personal information displayed by the portfolio.
It includes identity and professional information.
It includes social contact information.
It also references uploaded profile assets.

## Profile Fields

Current API fields include fullName, title, bio, email, phone, telegram, and location.
Social links include github and linkedin.
File references include profileImage, resume, and cv.
Application validation protects these fields before persistence.

## Profile Constraints

Field lengths are primarily enforced by application validation.
URL fields are validated as URLs.
Phone and Telegram values use dedicated validation.
File size and type are handled by the upload layer.

## Skill Model

Skill represents a technical or professional skill.
Examples include JavaScript, Node.js, and PostgreSQL.
Each skill has a primary identifier.
Skill names are unique.

## Skill Uniqueness

Skill.name has a database uniqueness constraint.
Duplicate skill names are therefore rejected by PostgreSQL.
Seed upserts can use name because it is unique.
The uniqueness rule protects concurrent writes as well.

## Project Model

Project stores portfolio project information.
It includes title and description.
It supports GitHub and live URLs.
It also supports featured state and timestamps.

## Project Images

Project images use a separate ProjectImage model.
Each image belongs to a project.
The record stores an asset URL or path.
The record also stores display order.

## Project Relation

A Project can have multiple ProjectImage records.
ProjectImage contains the project foreign key.
The relation preserves parent-child ownership.
Deletion behavior must follow the Prisma schema and migrations.

## Image Ordering

Image order is stored as database metadata.
Changing order does not require renaming the physical file.
The frontend can display images according to stored order.
Project update logic coordinates order with image records.

## Experience Model

Experience stores professional work history.
It includes company and role.
It includes description.
It includes startDate and optional endDate.

## Experience Dates

startDate is required by the resource.
endDate can be omitted for an ongoing experience.
Dates are stored as PostgreSQL timestamp-compatible values.
Application date conversion occurs before persistence.

## Education Model

Education stores academic history.
It includes institution, degree, and field.
It includes startDate and optional endDate.
Education is independent from Experience.

## Education Uniqueness

Education has a composite unique constraint.
The unique fields are institution and degree.
The database constraint is Education_institution_degree_key.
Seed upserts must respect this composite key.

## Certificate Model

Certificate stores certification metadata.
It includes name and issuer.
It includes issue date and credential URL.
It can also reference an uploaded certificate image.

## Certificate Images

Certificate images are stored under uploads/certificates/.
The database stores the associated reference.
The binary image remains in filesystem or volume storage.
Database and file cleanup must remain coordinated.

## ContactMessage Model

ContactMessage persists public contact submissions.
It separates message storage from HTTP handling.
Administrative tools can manage persisted messages.
Validation occurs before database persistence.

## Primary Keys

Application models use primary identifiers.
Primary keys provide stable record identity.
Update and delete operations should normally use IDs.
A non-ID field should only identify a record when the schema marks it unique.

## Foreign Keys

ProjectImage references Project.
The foreign key prevents references to nonexistent projects.
Related writes must preserve referential integrity.
Exact relation actions are defined by schema.prisma.

## Referential Integrity

Parent and child records must remain consistent.
ProjectImage records must reference valid projects.
Deleting a parent must account for its children.
Filesystem assets require separate cleanup consideration.

## Timestamps

Models use creation timestamps where required.
Projects also track update information where supported.
Timestamps support sorting and ordering.
They are stored as database timestamp values.

## Prisma Schema

schema.prisma is the main database definition.
It declares models and field types.
It declares primary keys and unique constraints.
It declares relations and defaults.

## Prisma Client

Prisma Client is generated from schema.prisma.
Current project version is 7.8.0.
Generation updates the client library code.
Generation does not apply database migrations.

## Schema Validation

Use npx prisma validate with the project schema path.
Validation checks Prisma schema correctness.
It does not modify database data.
The CI workflow performs this validation.

## Generate Client

Use npx prisma generate with the project schema path.
Run it after relevant schema changes.
The generated client must match the schema used by the server.
CI and Docker builds can generate the client as part of validation or image creation.

## Migration Directory

Migrations live in apps/server/prisma/migrations/.
Each migration has a timestamped directory.
Each directory contains migration.sql.
Migration files are committed to source control.

## Migration Principle

Migrations represent versioned schema changes.
Do not rewrite an already shared migration to represent a later change.
Create a new migration for a new schema change.
This preserves reproducible database history.

## Migration History

The project began with init_schema.
Seed constraints were added later.
ContactMessage was introduced by a later migration.
Further migrations added files and profile fields.

## Migration Names

20260712105426_init_schema is the initial schema migration.
20260712121244_add_seed_constraints added seed-related constraints.
20260714094401_add_contact_message added contact messages.
Later migrations extend the same database history.

## Later Migrations

20260717213703_add_resume_url added resume support.
20260718135456_add_project_images added project images.
20260718190230_rename_url_in_project_images changed project image URL naming.
20260721170632_add_image_to_certificate added certificate image support.

## Profile Migrations

20260804122341_add_profilw_phone added profile phone support.
20260805161525_add_profile_telegram added Telegram support.
The migration name profilw is preserved because it is the actual project name.
Migration history should not be renamed only for spelling.

## Migration Records

_prisma_migrations stores applied migration information.
It includes migration_name and checksum.
It records start and completion timestamps.
It can indicate rollback information when applicable.

## Migration Integrity

Source migrations and database migration records should agree.
Compare both when diagnosing schema problems.
Do not delete _prisma_migrations to hide a mismatch.
Investigate the database and volume first.

## Development Migration Workflow

Edit schema.prisma.
Create the migration.
Review generated SQL.
Apply and test the migration.

## Migration Completion

Generate Prisma Client when required.
Test affected services.
Test affected API behavior.
Commit schema and migration changes together.

## Production Migrations

Production schema changes should use committed migrations.
Avoid routine manual table editing.
Emergency SQL changes must be reconciled with migration history.
Back up data before destructive schema operations.

## Seed Script

Seed logic is located at apps/server/prisma/seed.js.
It provides development or initial portfolio data.
It must respect database constraints.
Seed behavior should evolve with schema changes.

## Seed Upserts

Prisma upsert requires a valid unique selector.
Skill can use name because name is unique.
Education can use its composite institution and degree key.
An arbitrary non-unique field cannot be used as an upsert selector.

## Database Connection

The server connects through DATABASE_URL.
In Docker, the hostname should normally be the postgres service.
The database name must match the Compose database.
Credentials must remain outside committed source code.

## Docker Network

Server and PostgreSQL communicate on the Compose network.
The server does not need localhost for the database container.
The PostgreSQL service name provides internal DNS resolution.
Host port publishing is mainly useful for local administrative access.

## Healthcheck

PostgreSQL uses pg_isready for its Compose healthcheck.
The check verifies that PostgreSQL accepts connections.
The server waits for PostgreSQL to become healthy.
Container health does not prove schema correctness.

## Health Layers

Process health means PostgreSQL is running.
Connection health means clients can connect.
Schema health means expected tables exist.
Application health means Prisma queries succeed.

## Table Verification

Use docker compose exec postgres psql for inspection.
Use the correct user and database.
Run \dt to list relations.
Confirm expected application tables exist.

## Record Verification

Use COUNT queries for representative tables.
Quote PascalCase table identifiers.
Verify more than one table after a restore.
Record counts are useful but do not prove every row is correct.

## Wrong Identifier Error

relation "profile" does not exist can occur when Profile exists.
PostgreSQL lowercases unquoted identifiers.
The correct current table name is "Profile".
Use quoted identifiers in manual SQL.

## Wrong Database Error

A database-not-found error can indicate a database mismatch.
Check POSTGRES_DB.
Check DATABASE_URL.
Check the active Compose project and container.

## Empty Database Diagnosis

First confirm the PostgreSQL container.
Then confirm the database name.
Then confirm the mounted volume.
Finally inspect migrations and tables.

## Missing Tables

Missing tables do not immediately mean schema.prisma is wrong.
The server may be connected to another database.
The database may use another volume.
Migrations may not have been applied to the selected database.

## Schema Drift

Schema drift means actual database state differs from expected history.
Manual SQL can cause drift.
Restoring an unrelated database can cause drift.
Wrong volume selection can also cause drift.

## Database Volume

postgres-data stores PostgreSQL data.
The volume maps to /var/lib/postgresql/data.
The volume is independent from server uploads.
Do not remove it without a verified backup.

## Volume Safety

List Docker volumes before destructive operations.
Confirm the active Compose project.
Confirm the database volume name.
Keep a database dump before deletion.

## Backup Principle

A Docker volume provides runtime persistence.
A PostgreSQL dump provides portable recovery.
They protect against different failure modes.
Keep an independent dump when data matters.

## PostgreSQL Dump

pg_dump can create a database backup.
Custom format is suitable for pg_restore.
Example: pg_dump -U azaria -d azaria_sw -Fc -f azaria_sw.dump.
The exact execution location depends on the environment.

## Dump Restore

Copy a dump into the PostgreSQL container when needed.
Use pg_restore for custom-format dumps.
Confirm the target database before restoring.
Use --no-owner and --no-acl when appropriate for the target environment.

## Restore Safety

Confirm the backup file before restore.
Confirm the target database.
Confirm the target volume.
Keep the previous backup until verification succeeds.

## Schema Only Restore

pg_restore supports schema-only restores.
Existing tables can produce relation-already-exists errors.
That error means the target object already exists.
Use schema-only restore for controlled schema inspection or recreation.

## Data Only Restore

Data-only restore is useful when the target schema already exists.
Table definitions must be compatible.
Constraints can affect restore ordering.
Inspect the dump before selective restoration.

## Dump Inspection

Use pg_restore -l to inspect a custom-format dump.
Filter the listing when checking for a specific table.
Education was verified in the project dump during migration work.
Inspection helps avoid restoring the wrong backup.

## Backup Verification

A successful dump command is not enough.
Inspect the archive contents.
Restore to a disposable target when possible.
Verify tables, representative data, and application connectivity.

## Migration vs Backup

Migrations describe schema evolution.
Backups preserve actual data and database state.
Migrations belong in source control.
Real database dumps should be stored separately and protected.

## Prisma Studio

Prisma Studio is useful for development inspection.
It provides a graphical view of Prisma-managed data.
It should be used carefully with real data.
It is not a substitute for migration history or backups.

## Transactions

Use transactions when related database changes must be atomic.
Project updates can involve several related records.
Prisma transactions can coordinate related database operations.
Filesystem operations are not automatically rolled back by database transactions.