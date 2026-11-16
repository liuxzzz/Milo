# Database

`createDatabase({ connectionString })` provides a Drizzle client, its `pg` pool,
an explicit `checkConnection()` probe, and `close()` for shutdown. Importing the
package does not open a connection. Call the probe before reporting readiness.

Future application tables belong to the `milo` PostgreSQL schema. Mastra's
runtime schema is managed separately by `PostgresStore`; do not include its
tables in Drizzle migrations. Drizzle tracks its own migrations in
`milo_migrations.__drizzle_migrations`.

There are no business tables or SQL migrations in this scaffold. The empty
migration journal allows migration commands to run before the first application
migration exists. Running `db:migrate` may create Drizzle's bookkeeping schema
and table; it does not implement any product data model.

Set `DATABASE_URL` before running `db:generate`, `db:migrate`, or `db:studio`.
Run the root workspace commands to load the root environment consistently.
When business tables are added, generate and review migrations before applying
them; business schema changes are not performed automatically on service start.
