import { AppModule, configureSwagger } from '@/app';
import { AppConfig, AppConfigurationNamespaces } from '@/common';
import {
    configureCors,
    configureFastifyAdapter,
    configureGlobalValidation,
    configureHelmet,
    ServerConfig,
} from '@dnd-mapp/shared-backend';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
    const { EMAIL_SERVICE_SSL_CERT_PATH, EMAIL_SERVICE_SSL_KEY_PATH } = process.env;
    const { adapter, ssl } = await configureFastifyAdapter(EMAIL_SERVICE_SSL_CERT_PATH, EMAIL_SERVICE_SSL_KEY_PATH);

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);

    const configService = app.get(ConfigService<AppConfig, true>);
    const { host, port } = configService.get<ServerConfig>(AppConfigurationNamespaces.SERVER);

    await configureHelmet(app);
    await configureSwagger(app);
    configureCors(app);
    configureGlobalValidation(app);

    app.enableShutdownHooks();

    await app.listen(port, host, () => {
        const url = `${ssl ? 'https' : 'http'}://${host}:${port}`;

        Logger.log(`Documentation available at: ${url}/docs`, 'NestApplication');
    });
}

bootstrap().catch((error) => console.error(error));
