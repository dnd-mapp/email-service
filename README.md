# 🛡️ D&D Mapp | Email Service

![Node Version](https://img.shields.io/badge/Node-v24+-339933?logo=node.js&logoColor=white)
![Package Manager](https://img.shields.io/badge/pnpm-v10.33.0-F69220?logo=pnpm&logoColor=white)
![Framework](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![Database](https://img.shields.io/badge/MariaDB-003545?logo=mariadb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)
[![CI](https://github.com/dnd-mapp/email-service/actions/workflows/push-main.yaml/badge.svg)](https://github.com/dnd-mapp/email-service/actions/workflows/push-main.yaml)

The centralized communication engine for the **D&D Mapp** ecosystem. This repository contains a high-performance email dispatching service designed to handle reliable notification delivery for players and Dungeon Masters.

## 📧 Overview

The `email-service` is a NestJS REST API built on the **Fastify** adapter, acting as the unified gateway for all outbound communication within the D&D Mapp platform. It abstracts the complexities of mail providers and provides robust tracking for every message sent, ensuring high deliverability and auditability.

## 🏗️ Architecture

The service is designed as an internal utility within the D&D Mapp microservices landscape:

- **Identity-Aware Security:** Access is strictly limited to clients registered with the D&D Mapp Identity Provider. All requests must be authenticated via valid bearer tokens.
- **Provider Layer:** Currently utilizes a **Gmail SMTP** integration for dispatching, abstracted behind a service layer to allow for future provider transitions.
- **Persistence:** Uses **MariaDB** to maintain a comprehensive audit log of all email transactions, including delivery status and detailed error logs for failed attempts.
- **Performance:** Leverages **Fastify** to ensure low-latency request handling under high notification loads.

## ✨ Features

- **Reliable Dispatching:** Robust email delivery using modern SMTP standards.
- **Delivery Tracking:** Real-time logging of "Success" or "Failure" states for every request.
- **Failure Analysis:** Detailed storage of SMTP error codes and stack traces for debugging failed deliveries.
- **Auto-Generated Documentation:** Integrated **OpenAPI (Swagger)** UI for easy exploration of endpoints and DTO schemas.
- **Secure Integration:** Built-in guards to validate tokens issued by the D&D Mapp Auth Server.

---

## 🛡️ Security Configuration Details

### Rate Limiting (Throttling)

To prevent brute-force attacks and API abuse, the server implements a triple-window throttling strategy via `@nestjs/throttler`:

| Window     | TTL        | Limit        | Purpose                   |
|:-----------|:-----------|:-------------|:--------------------------|
| **Short**  | 1 Second   | 3 requests   | Burst protection          |
| **Medium** | 10 Seconds | 20 requests  | Sustained traffic control |
| **Long**   | 1 Minute   | 100 requests | General API stability     |

### Headers & CORS

- **Helmet:** Configured via `@fastify/helmet` with a custom CSP to allow local Swagger UI assets.
- **CORS:** Dynamically configured to support specific origins (e.g., the Angular SPA). Explicitly allows `Authorization` and `Content-Type` headers with `credentials: true`.

---

## 🛠️ Tech Stack

- **Framework:** NestJS (TypeScript)
- **Engine:** Fastify
- **Runtime:** Node.js v24
- **Package Manager:** pnpm v10.33.0
- **ORM:** Prisma
- **Database:** MariaDB
- **Testing:** Vitest
- **Linting:** ESLint & Markdownlint
- **Formatting:** Prettier
- **Infrastructure:** Docker & Docker Compose

---

## 📖 API Documentation

Interactive documentation is automatically generated via Swagger.

- **Local Dev (SSL):** [https://localhost.email.dndmapp.dev:4450/docs](https://localhost.email.dndmapp.dev:4450/docs)
- **Docker/Localhost:** [http://localhost:4450/docs](http://localhost:4450/docs)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v24+
- **pnpm:** v10.33.0+
- **mise:** To automatically manage Node.js and pnpm versions. See the [Mise Configuration Guide](https://github.com/dnd-mapp/.github/blob/main/docs/mise-configuration.md) for setup instructions.
- **Docker & Docker Compose**
- **mkcert:** For generating local SSL certificates. See the [Self-Signed Certificates](https://github.com/dnd-mapp/.github/blob/main/docs/self-signed-certificates.md) guide for setup instructions.
- A local MariaDB instance (or via Docker).

### Local Networking Setup

During development, the server is configured to be served via a custom local hostname to support secure cookie sharing across subdomains. Follow the [Local DNS Setup](https://github.com/dnd-mapp/.github/blob/main/docs/local-dns-setup.md) guide, then add the following entry for this service:

```text
127.0.0.1 localhost.email.dndmapp.dev
```

> [!NOTE]
> This configuration applies only to local development. Docker containers continue to use standard networking as they are designed to sit behind a reverse proxy.

### Local HTTPS Setup

To support secure cookies and PKCE flows locally, the server must run over HTTPS during development. Follow the [Self-Signed Certificates](https://github.com/dnd-mapp/.github/blob/main/docs/self-signed-certificates.md) guide to install `mkcert` and set up the local CA, then generate the certificates for this service:

```bash
pnpm gen:ssl-certs
```

### Installation & Run

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dnd-mapp/email-service.git
   cd email-service
   ```

2. **Setup Runtimes:**

   Ensure `mise` is installed. Run the following to install the correct Node.js and pnpm versions defined in `.tool-versions`:

   ```bash
   mise install
   ```

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

4. **Environment Setup:**

   Copy the example env file and fill in your secrets.

   ```bash
   cp .env.template .env
   ```

5. **Database Migration:**

   ```bash
   pnpm prisma:migrate-dev
   ```

6. **Run the server:**

   ```bash
   pnpm start
   ```

   The API will be available at `https://localhost.email.dndmapp.dev:4450`.

---

## 🧪 Quality Control

### Testing

We use **Vitest** for unit and integration testing.

- **Run tests (CI):**

  ```bash
  pnpm test
  ```

- **Development mode (UI/Watch):**
  
  ```bash
  pnpm test:development
  ```

### Linting & Formatting

To maintain high code quality and consistent documentation standards:

- **Lint Code (ESLint):**

  ```bash
  pnpm lint:eslint
  ```

- **Lint Docs (Markdownlint):**

  ```bash
  pnpm lint:markdownlint
  ```

- **Run All Lints:**

  ```bash
  pnpm lint
  ```

- **Format Check:**

  ```bash
  pnpm format:check
  ```

- **Auto-format:**

  ```bash
  pnpm format:write
  ```

---

## 🐳 Docker Deployment

> [!NOTE]
> The Docker configuration is intended for production-like environments or CI. **Containers are served over HTTP** as they are designed to sit behind a reverse proxy (e.g., Nginx, Traefik) which handles SSL termination.

This project uses Docker Compose to orchestrate the email service, MariaDB database, and management tools. Follow the steps below to set up your local environment.

### 1. Prerequisites

Ensure you have Docker and Docker Compose (v2.0+) installed on your machine.

### 2. Configuration Setup

Before starting the containers, you must create and configure the necessary environment and initialization files from their respective templates.

#### Environment Variables

Copy the template `.env` file and adjust the values (especially credentials and database names) to match your environment:

```bash
cp .docker/.env.template .docker/.env
```

#### MariaDB Initialization

Create the SQL initialization script. This script handles user creation and database provisioning:

```bash
cp .docker/mariadb-init-template.sql .docker/mariadb-init.sql
```

#### Secrets

The MariaDB root password is managed via a Docker secret. Create the directory and the secret file:

```bash
echo "your_secure_root_password" > ./secrets/mariadb/root.txt
```

### 3. Running the Services

You can use Docker [profiles](https://docs.docker.com/compose/profiles/) to start either the entire stack or just the database-related infrastructure.

#### Start Entire Stack

To start the authentication server, database migrations, MariaDB, and DBeaver:

```bash
docker compose --profile all up -d
```

#### Start Database Services Only

If you are running the application code locally and only need the database infrastructure (MariaDB, Prisma migrations, and CloudBeaver):

```bash
docker compose --profile db up -d
```

### 4. Service Access

Once the containers are healthy, you can access the services at the following endpoints:

- **Email Service:** `http://localhost:4450`
- **CloudBeaver (Database GUI):** `http://localhost:8978`
- **MariaDB:** `localhost:3306`

### 5. Troubleshooting

If the migration fails, check the logs for the `db-migration` container:

```bash
docker logs db-migration
```

> [!NOTE]
> that the `db-migration` service is configured to run `prisma migrate deploy` and `prisma db seed` automatically upon startup, provided the database is healthy.

---

## 🤝 Contributing

This repository is part of the **D&D Mapp** internal ecosystem. At this time, we are **not accepting external contributions or Pull Requests**.

Refer to our global [CONTRIBUTING.md](https://github.com/dnd-mapp/.github/blob/main/CONTRIBUTING.md) for organizational policies.

For details on how releases are triggered, versioned, and published, see the [Release Pipeline](https://github.com/dnd-mapp/.github/blob/main/docs/release-pipeline.md) guide.

---

## 🛡️ License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for more details.
