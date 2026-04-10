# 🛡️ D&D Mapp | Email Service

![Docker Pulls](https://img.shields.io/docker/pulls/dndmapp/email-service)
![Docker Image Size](https://img.shields.io/docker/image-size/dndmapp/email-service/latest)
![Node Version](https://img.shields.io/badge/Node-v24+-339933?logo=node.js&logoColor=white)
![Framework](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

The **dndmapp/email-service** is the centralized communication engine for the **D&D Mapp** ecosystem. It is a high-performance, containerized email dispatching service built on NestJS and Fastify, responsible for reliable notification delivery to players and Dungeon Masters. This image is engineered for security-first environments, featuring multi-stage builds, hardened Alpine runtimes, and full SBOM/Provenance attestations.

---

## 🚀 Quick Start

Launch a standalone instance. This requires an existing MariaDB/MySQL instance and access to a Gmail SMTP account.

```bash
docker run -d \
  --name email-service \
  -p 4450:4450 \
  -e NODE_ENV=production \
  -e DB_URL="mysql://user:password@host:3306/email_db" \
  -e EMAIL_SERVICE_SMTP_HOST="smtp.gmail.com" \
  -e EMAIL_SERVICE_SMTP_USER="your-account@gmail.com" \
  -e EMAIL_SERVICE_SMTP_PASSWORD="your-app-password" \
  -e EMAIL_SERVICE_AUTH_SERVER_URL="https://your-auth-server" \
  dndmapp/email-service:latest
```

---

## 🏗️ Full Stack Deployment

For a complete environment including the database, migrations, and management tools, refer to the [**dnd-mapp-stack**](https://github.com/dnd-mapp/dnd-mapp-stack) repository, which contains the official Docker Compose configuration for the entire D&D Mapp platform.

---

## 🛡️ Image Details

This image follows DevSecOps best practices to ensure a minimal attack surface and verifiable supply chain integrity.

- **Base Image:** `node:24-alpine` (Lightweight & security hardened).
- **Exposed Ports:** `4450` (API/Docs).
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

- **Source Code:** [github.com/dnd-mapp/email-service](https://github.com/dnd-mapp/email-service)
- **Issue Tracker:** [Report a Bug](https://github.com/dnd-mapp/email-service/issues)
- **Organization:** [D&D Mapp on GitHub](https://github.com/dnd-mapp)

---

*"Critical hit on deliverability. Roll for initiative!"*
