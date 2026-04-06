# 🛡️ D&D Mapp | Auth Server (Docker)

![Docker Pulls](https://img.shields.io/docker/pulls/dndmapp/auth-server)
![Docker Image Size](https://img.shields.io/docker/image-size/dndmapp/auth-server/latest)
![Node Version](https://img.shields.io/badge/Node-v24.14.0-339933?logo=node.js&logoColor=white)
![Framework](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

The **dndmapp/auth-server** is a high-performance, containerized Identity Provider (IdP) built on NestJS and Fastify. It serves as the core security engine for the **D&D Mapp** ecosystem, implementing modern authentication standards like **Authorization Code Flow with PKCE**. This image is engineered for security-first environments, featuring multi-stage builds, hardened Alpine runtimes, and full SBOM/Provenance attestations.

---

## 🚀 Quick Start

Launch a standalone instance. This requires an existing MariaDB/MySQL instance.

```bash
docker run -d \
  --name auth-server \
  -p 4350:4350 \
  -e NODE_ENV=production \
  -e DB_URL="mysql://user:password@host:3306/auth_db" \
  dndmapp/auth-server:latest
```

---

## 🏗️ Full Stack Deployment

For a complete environment including the database, migrations, and management tools, use the provided Docker Compose configuration.

### 1. Configuration Setup

Prepare your environment by creating the following files based on these examples:

#### **Environment Variables (`.env`)**

Create a `.env` file in your root directory. This configuration links the NestJS application to the MariaDB container.

```text
# CORS Configuration
AUTH_SERVER_CORS_ORIGINS="https://localhost.www.dndmapp.dev:4200"

# Database Configuration
AUTH_SERVER_DB_HOST="mariadb-server"
AUTH_SERVER_DB_PORT="3306"
AUTH_SERVER_DB_USER="admin"
AUTH_SERVER_DB_PASSWORD="password123"
AUTH_SERVER_DB_SCHEMA="auth_db"

PRISMA_DB_HOST="mariadb-server"
PRISMA_DB_USER="prisma"
PRISMA_DB_PASSWORD="prisma-password"

# Connection String used by Prisma
DB_URL="mysql://${PRISMA_DB_USER}:${PRISMA_DB_PASSWORD}@${PRISMA_DB_HOST}:${AUTH_SERVER_DB_PORT}/${AUTH_SERVER_DB_SCHEMA}"
```

#### **Database Initialization (`mariadb-init.sql`)**

This script sets up the necessary users and databases during the first boot of the MariaDB container.

```sql
-- 1. Create database users
CREATE USER IF NOT EXISTS 'prisma'@'%' IDENTIFIED BY 'prisma-password';
CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'password123';

-- 2. Create application database and grant privileges
CREATE DATABASE IF NOT EXISTS `auth_db`
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON `auth_db`.* TO 'prisma'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `auth_db`.* TO 'admin'@'%';

-- 3. Create shadow database for Prisma migrations (Only required for non-production environments)
CREATE DATABASE IF NOT EXISTS `auth_db_shadow`
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON `auth_db_shadow`.* TO 'prisma'@'%';

-- 4. Apply privileges
FLUSH PRIVILEGES;
```

#### **Secrets**

Create the root password file for MariaDB:

```bash
mkdir -p secrets/mariadb
echo "your_root_password" > ./secrets/mariadb/root.txt
```

### 2. Orchestration Details

The stack includes:

- **auth-server:** The NestJS application.
- **db-migration:** A short-lived container that runs `prisma migrate deploy` and `prisma db seed` before the server starts.
- **mariadb-server:** The primary data store with health checks.
- **dbeaver:** A web-based database management GUI (CloudBeaver) available on port `8978`.

---

## 🛡️ Image Details

This image follows DevSecOps best practices to ensure a minimal attack surface and verifiable supply chain integrity.

- **Base Image:** `node:24.14.0-alpine3.23` (Lightweight & security hardened).
- **Exposed Ports:** `4350` (API/Docs).
- **Security Attestations:**
  - **SBOM:** Software Bill of Materials included.
  - **Provenance:** Build metadata (`mode=max`) for CI/CD transparency.
- **User:** Runs as a non-root user to adhere to the principle of least privilege.

### Supported Platforms

This image is built using **Docker Buildx** to support multi-arch deployments:

- `linux/amd64` (Standard Cloud/Server)
- `linux/arm64` (Apple Silicon M1/M2/M3, Graviton, Raspberry Pi)

---

## 🏷️ Tagging Policy

| Tag                 | Description                                                                                   | Stability            |
|:--------------------|:----------------------------------------------------------------------------------------------|:---------------------|
| `latest`            | The most recent stable release from the `main` branch.                                        | **Stable**           |
| `1`, `1.2`, `1.2.3` | Semantic Versioning (SemVer) tags. `1` and `1.2` act as rolling aliases for the latest patch. | **Stable**           |
| `1.2.3-alpha.4`     | Prerelease builds. Supported IDs: `alpha`, `beta`, or `rc` (Release Candidate).               | **Testing**          |
| `dev`               | Bleeding-edge builds from the development pipeline.                                           | **Unstable**         |
| `sha-<hash>`        | Immutable builds pinned to a specific Git commit for reproducibility.                         | **Production Ready** |

### Versioning Examples

- **Major (`1`):** Always points to the latest stable release of version 1.
- **Minor (`1.2`):** Points to the latest patch within the 1.2 minor branch.
- **Patch (`1.2.3`):** An immutable tag for a specific production release.
- **Prerelease (`1.2.3-rc.1`):** Used for integration testing before a final release.

---

## 🔗 Project Links

- **Source Code:** [github.com/dnd-mapp/auth-server](https://github.com/dnd-mapp/auth-server)
- **Issue Tracker:** [Report a Bug](https://github.com/dnd-mapp/auth-server/issues)
- **Organization:** [D&D Mapp on GitHub](https://github.com/dnd-mapp)

---

*“Critical hit on security. Roll for initiative!”*
