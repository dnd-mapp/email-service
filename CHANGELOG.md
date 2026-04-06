# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- (n/a)

### Changed

- (n/a)

### Deprecated

- (n/a)

### Removed

- (n/a)

### Fixed

- (n/a)

### Security

- (n/a)

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
