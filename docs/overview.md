# Email Service — Overview

## Purpose

The email service is a NestJS microservice in the D&D Mapp platform responsible for all transactional email dispatch. It manages reusable email templates, their dynamic variables, and the sender addresses used when dispatching emails. All outbound delivery is handled through [Resend](https://resend.com).

---

## Module Breakdown

| Module                        | Route prefix                             | Responsibility                                                            |
|-------------------------------|------------------------------------------|---------------------------------------------------------------------------|
| `EmailModule`                 | `/email`                                 | Accepts send-email requests, renders templates, and dispatches via Resend |
| `EmailTemplateModule`         | `/email-templates`                       | CRUD for email templates (name, subject, Handlebars content)              |
| `EmailTemplateVariableModule` | `/email-templates/:templateId/variables` | CRUD for the variables declared on each template                          |
| `SenderEmailModule`           | `/sender-emails`                         | CRUD for sender email address records                                     |
| `HealthModule`                | `/health`                                | Liveness and readiness probes for orchestrators                           |

---

## Request Lifecycle — `POST /email`

1. **`EmailController`** receives the `SendEmailDto` (`to`, `templateName`, optional `variables`).
2. **`EmailService`** loads the template by name via `EmailTemplateService.findByName()`.
3. **`EmailService`** validates that every declared template variable has been supplied in the request; throws `BadRequestException` for missing variables.
4. **`TemplateService`** compiles the template `content` string with Handlebars and injects the provided variable values, returning rendered HTML.
5. **`ResendService`** dispatches the email to the recipient using the Resend API, using the subject from the template and the sender address linked to the template.
6. The outcome is recorded in the email audit log stored in the database.

---

## Database Schema Overview

The service uses a MySQL database accessed via Prisma.

```text
SenderEmail
  id          String   @id @default(nanoid())
  name        String
  email       String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  templates   EmailTemplate[]

EmailTemplate
  id          String   @id @default(nanoid())
  name        String   @unique
  subject     String
  content     String   @db.Text
  senderId    String
  sender      SenderEmail @relation(...)
  variables   EmailTemplateVariable[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

EmailTemplateVariable
  id          String   @id @default(nanoid())
  name        String
  templateId  String
  template    EmailTemplate @relation(...)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
```

---

## Security

| Concern        | Implementation                                                                                |
|----------------|-----------------------------------------------------------------------------------------------|
| Authentication | Bearer token guard applied globally; all routes require a valid JWT                           |
| Rate limiting  | Three-tier throttle: 3 req/s · 20 req/10 s · 100 req/min (via `@nestjs/throttler`)            |
| CORS           | Allowlist driven; default origin `https://localhost.auth.dndmapp.dev:4350`; max-age 1 hour    |
| Transport      | HTTPS only in all environments (TLS termination via Fastify with configurable cert/key paths) |
| Helmet         | HTTP security headers applied via `@fastify/helmet`                                           |

---

## API Documentation

When the service is running, Swagger UI is available at `https://<host>:<port>/docs`.
