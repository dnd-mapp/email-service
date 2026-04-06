# Workflow

## Before Making Changes

Run the following before editing any file:

```bash
pnpm gen:prisma
```

## After Making Changes

Run the following checks after editing any file, in this order:

1. **Format** — auto-fix Prettier violations:

   ```bash
   pnpm format:write
   ```

2. **Lint** — catch ESLint and markdownlint issues:

   ```bash
   pnpm lint
   ```

3. **Format check** — verify no formatting drift remains:

   ```bash
   pnpm format:check
   ```

4. **Tests** — confirm nothing is broken:

   ```bash
   pnpm test
   ```

## Dev Commands

```bash
# Development
pnpm start                    # Start with watch mode
pnpm build                    # Build with Webpack via NestJS CLI

# Testing
pnpm test                     # Run all tests (CI mode)
pnpm test:development         # Watch mode with Vitest UI (http://localhost:51204/auth-server/)

# Single test file
pnpm exec vitest run src/path/to/file.spec.ts

# Linting & formatting
pnpm lint                     # ESLint + markdownlint
pnpm format:check             # Check formatting
pnpm format:write             # Auto-format
```
