# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add `@dnd-mapp/shared-backend` dependency providing shared NestJS infrastructure (database module, Prisma type helpers, health module, bootstrap utilities, throttler/CORS/Helmet/serialization config, `IsHost` validator, and env validation helper).
- Add Docker secrets support in the entrypoint: secrets can now be provided as files via the `_FILE` suffix convention (e.g. `PRISMA_DB_PASSWORD_FILE`).
- Add `PRISMA_DB_HOST` environment variable; used in the Prisma connection string so the Prisma migration user can target a different host than the application user if needed.
- Add `serve` and `migrate` command modes to the Docker entrypoint for more flexible container orchestration.
- Add `domain/index.ts` and top-level `index.ts` barrel exports to each feature module.

### Changed

- `EMAIL_SERVICE_DB_URL` now interpolates `PRISMA_DB_HOST` instead of `EMAIL_SERVICE_DB_HOST`, allowing the Prisma connection to target a separate host when required.
- Service files moved from `services/` subdirectory to feature module root (e.g. `email-template/email-template.service.ts`).
- Domain type files consolidated under a `domain/` subdirectory within each feature module.
- Bump Node.js runtime from 24.14.0 to 24.15.0.
- Fix Docker `EXPOSE` port from 4350 to 4450 and enable the `ENTRYPOINT` instruction.
- Update healthcheck URL port to 4450.

### Removed

- Remove locally-defined database module, Prisma type helpers (`PrismaLikeClient`, tokens), health module, CORS/Helmet/Fastify-adapter/class-transform/serialization/throttler config helpers, `IsHost` decorator, and `validateEnvironmentVariables` function — all now provided by `@dnd-mapp/shared-backend`.
- Remove local shared utility functions for arrays, integer parsing, and time conversion — now provided by `@dnd-mapp/shared-utils`.

---

## [0.2.0] - 2026-03-15

### Added

- Add Docker container healthcheck integration to ensure orchestration liveness checks pass.
- Add `appVersion` support and use it in generated OpenAPI spec metadata (version and description).
- Add helper to read package manifest version from `package.json`.

### Changed

- Improve API documentation generation by setting version and description from runtime metadata.

### Fixed

- Add explicit return type where necessary for improved TypeScript safety.

### Chore

- Update dependencies and Dockerfile for improved container behavior.

---

## [0.1.0] - 2026-03-15

### Added

- Initial API with `/health` endpoint and startup log message indicating server URL.
- Fastify adapter with CORS, helmet security headers, request throttler, and graceful shutdown hooks.
- OpenAPI spec generation and Swagger metadata integration.
- Utilities for parsing integers, arrays, and time units from environment variables.
- Package manifest version retrieval helper and app version injection into spec metadata.
- Docker container support with healthcheck and SSL certificate helper script.

### Changed

- Migrated from Express to Fastify and moved configuration into app module structure.
- Refactored application config constants and moved app files into structured `app/` folder.

### Chore

- Added linting, prettier, markdownlint, vitest configuration and CI workflow scaffolding.
- Added Dockerization and CI badges, CODEOWNERS, and release process documentation.

---
