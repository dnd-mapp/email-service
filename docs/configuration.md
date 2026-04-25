# Email Service — Configuration Reference

All configuration is supplied via environment variables. Copy `.env.template` to `.env` and fill in the required values before starting the service.

---

## Server

| Variable             | Required | Type                  | Default   | Description                           |
|----------------------|----------|-----------------------|-----------|---------------------------------------|
| `EMAIL_SERVICE_HOST` | No       | `string`              | `0.0.0.0` | Host address the HTTP server binds to |
| `EMAIL_SERVICE_PORT` | No       | `number` (1024–65535) | `4450`    | Port the HTTP server listens on       |

---

## SSL / TLS

Required for all environments (the server only starts on HTTPS).

| Variable                      | Required | Type     | Default | Description                                  |
|-------------------------------|----------|----------|---------|----------------------------------------------|
| `EMAIL_SERVICE_SSL_CERT_PATH` | Yes      | `string` | —       | Path to the PEM-encoded TLS certificate file |
| `EMAIL_SERVICE_SSL_KEY_PATH`  | Yes      | `string` | —       | Path to the PEM-encoded private key file     |

For local development, generate a self-signed cert with `mkcert localhost.email.dndmapp.dev`.

---

## CORS

| Variable                     | Required | Type                     | Default                                   | Description          |
|------------------------------|----------|--------------------------|-------------------------------------------|----------------------|
| `EMAIL_SERVICE_CORS_ORIGINS` | No       | comma-separated `string` | `https://localhost.auth.dndmapp.dev:4350` | Allowed CORS origins |

---

## Database

The service uses MySQL accessed through Prisma. Two database users are configured: one for the application and one for Prisma migrations.

| Variable                         | Required | Type     | Default     | Description                                                                          |
|----------------------------------|----------|----------|-------------|--------------------------------------------------------------------------------------|
| `EMAIL_SERVICE_DB_HOST`          | No       | `string` | `localhost` | Database server hostname (used as application host reference)                        |
| `EMAIL_SERVICE_DB_PORT`          | No       | `number` | `3306`      | Database server port                                                                 |
| `EMAIL_SERVICE_DB_USER`          | No       | `string` | `root`      | Application database user                                                            |
| `EMAIL_SERVICE_DB_PASSWORD`      | Yes      | `string` | —           | Application database user password                                                   |
| `EMAIL_SERVICE_DB_PASSWORD_FILE` | No       | `string` | —           | Path to a file containing the DB password (Docker secrets)                           |
| `EMAIL_SERVICE_DB_SCHEMA`        | No       | `string` | `my_db`     | Database schema / catalog name                                                       |
| `PRISMA_DB_HOST`                 | Yes      | `string` | —           | Host used in the Prisma connection string; typically set to `$EMAIL_SERVICE_DB_HOST` |
| `PRISMA_DB_USER`                 | Yes      | `string` | —           | Prisma migration user (requires DDL privileges)                                      |
| `PRISMA_DB_PASSWORD`             | Yes      | `string` | —           | Prisma migration user password                                                       |
| `PRISMA_DB_PASSWORD_FILE`        | No       | `string` | —           | Path to a file containing the Prisma DB password (Docker secrets)                    |

> [!NOTE]
> `EMAIL_SERVICE_DB_PASSWORD_FILE` and `PRISMA_DB_PASSWORD_FILE` follow the Docker secrets `_FILE` convention. When set, the entrypoint reads the file and exports the secret as the corresponding base variable. Set only one of the pair — the base variable takes precedence if both are present.

---

## Resend

| Variable         | Required | Type     | Default | Description                                                                                         |
|------------------|----------|----------|---------|-----------------------------------------------------------------------------------------------------|
| `RESEND_API_KEY` | Yes      | `string` | —       | Resend API key scoped to the sending domain. Obtain from the Resend dashboard. Format: `re_<value>` |

---

## Rate Limiting (Throttle)

Rate limits are hard-coded and apply globally. They cannot be changed via environment variables.

| Tier     | Window     | Limit        |
|----------|------------|--------------|
| `short`  | 1 second   | 3 requests   |
| `medium` | 10 seconds | 20 requests  |
| `long`   | 1 minute   | 100 requests |

---

## Example `.env`

```dotenv
# Server
EMAIL_SERVICE_HOST="0.0.0.0"
EMAIL_SERVICE_PORT="4450"

# SSL
EMAIL_SERVICE_SSL_CERT_PATH="ssl-cert.pem"
EMAIL_SERVICE_SSL_KEY_PATH="ssl-key.pem"

# CORS
EMAIL_SERVICE_CORS_ORIGINS="https://localhost.auth.dndmapp.dev:4350"

# Database
EMAIL_SERVICE_DB_HOST="localhost"
EMAIL_SERVICE_DB_PORT="3306"
EMAIL_SERVICE_DB_USER="email_app"
EMAIL_SERVICE_DB_PASSWORD="s3cr3t"
# When using Docker secrets, set this instead:
# EMAIL_SERVICE_DB_PASSWORD_FILE="/run/secrets/db_password"
EMAIL_SERVICE_DB_SCHEMA="email_db"

PRISMA_DB_HOST="$EMAIL_SERVICE_DB_HOST"
PRISMA_DB_USER="prisma"
PRISMA_DB_PASSWORD="s3cr3t"
# When using Docker secrets, set this instead:
# PRISMA_DB_PASSWORD_FILE="/run/secrets/prisma_db_password"

EMAIL_SERVICE_DB_URL="mysql://${PRISMA_DB_USER}:${PRISMA_DB_PASSWORD}@${PRISMA_DB_HOST}:${EMAIL_SERVICE_DB_PORT}/${EMAIL_SERVICE_DB_SCHEMA}"

# Resend
RESEND_API_KEY="re_your_key_here"
```
