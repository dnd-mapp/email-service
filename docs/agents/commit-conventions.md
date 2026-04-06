# Commit Conventions

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Format

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Types

| Type       | When to use                                             |
|------------|---------------------------------------------------------|
| `feat`     | A new feature                                           |
| `fix`      | A bug fix                                               |
| `docs`     | Documentation changes only                              |
| `style`    | Formatting, missing semicolons, etc. (no logic changes) |
| `refactor` | Code change that is neither a fix nor a feature         |
| `test`     | Adding or updating tests                                |
| `chore`    | Build process, tooling, or dependency updates           |
| `perf`     | Performance improvements                                |
| `ci`       | CI/CD configuration changes                             |

## Scopes

Use the NestJS module name as the scope where applicable (e.g. `user`, `role`, `permission`, `database`, `config`, `health`). Use `prisma` for schema/migration changes and `docker` for container-related changes.

## Rules

- Use the **imperative mood** in the description: "add feature" not "added feature"
- Keep the description under **72 characters**
- Mark breaking changes with `!` after the type/scope and a `BREAKING CHANGE:` footer

## Examples

```text
feat(user): add soft delete endpoint
fix(auth): handle expired PKCE code verifier
refactor(database): extract repository base class
docs: update AGENTS.md with commit conventions
chore(prisma): regenerate client after schema change
feat(auth)!: require PKCE for all authorization requests

BREAKING CHANGE: authorization requests without code_challenge are now rejected
```
