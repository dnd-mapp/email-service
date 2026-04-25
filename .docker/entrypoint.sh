#!/bin/sh

set -e

# Resolve Docker secrets using the _FILE suffix convention.
# For each supported secret, if the _FILE variant is set and the base variable is not,
# the file content is read and exported as the base variable.
for secret in AUTH_SERVER_DB_PASSWORD AUTH_SERVER_PASSWORD_PEPPER PRISMA_DB_PASSWORD; do
    file_var="${secret}_FILE"
    file_path="$(printenv "$file_var" 2>/dev/null || true)"

    if [ -n "$file_path" ] && [ -f "$file_path" ] && [ -z "$(printenv "$secret" 2>/dev/null || true)" ]; then
        export "$secret=$(tr -d '\r' < "$file_path")"
    fi
done

case "$1" in
    migrate)
        npx prisma migrate deploy
        npx prisma db seed
        ;;
    serve)
        npx prisma migrate deploy
        npx prisma db seed
        exec node /app/main.js
        ;;
    *)
        exec "$@"
        ;;
esac
