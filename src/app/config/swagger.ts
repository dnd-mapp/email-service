import { appVersion } from '@/shared-utils';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const description = `
## 🛡️ Core Security Engine
The **auth-server** is a high-performance, custom-built Identity Provider (IdP) for the D&D Mapp ecosystem. It serves as the centralized authentication and authorization hub, ensuring secure identity management for players and Dungeon Masters.

### 🗝️ Key Features

- **OAuth2-Inspired Flow:** Implementation of **Authorization Code Flow with PKCE** designed for modern SPAs.
- **Token Management:** 
  - **JWT Access Tokens** for API authorization.
  - **JWT ID Tokens** for user profile data.
  - **Opaque Refresh Tokens** (server-side) for secure session persistence and revocation.
- **Hardened Security:** Built with **Argon2** hashing, **Helmet** (CSP/HSTS), and strict **CORS** validation.
- **Advanced Throttling:** Multi-layered rate limiting (Short/Medium/Long windows) to mitigate brute-force and DDoS attacks.
- **RBAC/ABAC:** Granular Attribute/Role-Based Access Control integrated directly into JWT claims.

### 🔐 Security & Access

This API requires secure communication. For local development, ensure you are accessing the service via:

- **Host:** "localhost.auth.dndmapp.dev"
- **Protocol:** HTTPS (via mkcert)

*Note:This server acts as a standalone service using NestJS + Fastify + Prisma + MariaDB*
`;

export async function configureSwagger(app: NestFastifyApplication) {
    const swaggerConfig = new DocumentBuilder()
        .setTitle('D&D Mapp - Auth Server')
        .setDescription(description.trim())
        .setVersion(await appVersion())
        .build();

    SwaggerModule.setup('/docs', app, () => SwaggerModule.createDocument(app, swaggerConfig));
}
