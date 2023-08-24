## Migrations
These are a list of environment variables that need to exist in order to run database migrations.

// These need to be provided
TYPEORM_CONNECTION = mysql
TYPEORM_HOST = localhost
TYPEORM_USERNAME = root
TYPEORM_PASSWORD = root
TYPEORM_DATABASE = local_db
TYPEORM_PORT = 3306

// These are default values that should not be changed
TYPEORM_ENTITIES = src/**/*.entity.ts
TYPEORM_MIGRATIONS = migrations/*.ts
TYPEORM_MIGRATIONS_DIR = migrations/
TYPEORM_MIGRATIONS_TABLE_NAME = nest_migrations
TYPEORM_MIGRATIONS_RUN = true
TYPEORM_SYNCHRONIZE = false

Commands:
  'npm run migration:generate -- -n test' -- this would detect any changes made and generate a migration file with the name '${timestamp}-test.ts'
  'npm run migration:up'                  -- Run migrations
  'npm run migration:down'                -- Revert the last migration
