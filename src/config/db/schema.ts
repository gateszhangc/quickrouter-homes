// this file is used to export the schema for the database
// export * from './schema.sqlite'; // sqlite schema, used when DATABASE_PROVIDER=sqlite or DATABASE_PROVIDER=turso
// export * from './schema.mysql'; // mysql schema, used when DATABASE_PROVIDER=mysql
// export * from './schema.postgres'; // postgres schema, used when DATABASE_PROVIDER=postgresql
// The deployed environment uses PostgreSQL, and the column type mapping has to
// match the driver: an sqlite schema hands epoch numbers to postgres.js, which
// rejects them for a timestamp column.
export * from './schema.postgres';
