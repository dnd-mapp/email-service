import { AppConfig, ConfigurationNamespaces, ServerConfig } from '@/common';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { CORS_MAX_AGE } from './constants';

export function configureCors(app: NestFastifyApplication) {
    const configService = app.get(ConfigService<AppConfig, true>);
    const { cors } = configService.get<ServerConfig>(ConfigurationNamespaces.SERVER);

    app.enableCors({
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
        maxAge: CORS_MAX_AGE,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        optionsSuccessStatus: HttpStatus.NO_CONTENT,
        origin: [...cors.origins],
    });
}
