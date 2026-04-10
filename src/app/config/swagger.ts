import { appVersion } from '@/shared-utils';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const description = `
# D&D Mapp | Email Service API

The **Email Service** is a high-performance centralized communication engine within the **D&D Mapp** microservices ecosystem. Built with **NestJS** and the **Fastify** adapter, it provides a unified RESTful gateway for outbound communications, ensuring reliable notification delivery for players and Dungeon Masters.

## 🚀 Overview

This service abstracts the complexities of mail providers and provides robust tracking for every message sent. It is designed for high deliverability, security, and auditability.

### Key Features

- **Reliable Dispatching**: Robust email delivery using modern SMTP standards (currently integrated with Gmail SMTP).
- **Delivery Tracking**: Real-time logging of delivery states (Success/Failure) in a MariaDB audit log.
- **Failure Analysis**: Comprehensive storage of SMTP error codes and stack traces for debugging.
- **High Performance**: Low-latency request handling optimized by the Fastify engine.

## 🛡️ Security & Integration
Access to this API is strictly controlled to ensure the integrity of the D&D Mapp ecosystem.

- **Authentication**: All requests must be authenticated via valid **Bearer Tokens** issued by the D&D Mapp Identity Provider.
- **Rate Limiting**: The API implements a triple-window throttling strategy:
  - **Short**: 3 requests / 1 second (Burst protection)
  - **Medium**: 20 requests / 10 seconds (Sustained traffic)
  - **Long**: 100 requests / 1 minute (Stability)
- **CORS**: Configured to support specific D&D Mapp origins (e.g., the Angular SPA) with credential support.

## 📊 Monitoring & Audit

Every request is persisted via Prisma to a MariaDB instance, maintaining a complete history of communication transactions to assist in platform-wide audit trails and troubleshooting.

---

**Version**: 1.0.0  
**License**: [MIT](https://github.com/dnd-mapp/email-service/blob/main/LICENSE)  
**Repository**: [github.com/dnd-mapp/email-service](https://github.com/dnd-mapp/email-service)
`;

export async function configureSwagger(app: NestFastifyApplication) {
    const swaggerConfig = new DocumentBuilder()
        .setTitle('D&D Mapp - Email Service')
        .setDescription(description.trim())
        .setVersion(await appVersion())
        .build();

    SwaggerModule.setup('/docs', app, () => SwaggerModule.createDocument(app, swaggerConfig));
}
