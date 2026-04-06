import {
    AppModule,
    configureCors,
    configureFastifyAdapter,
    configureGlobalValidation,
    configureHelmet,
    configureSwagger,
} from '@/app';
import { AppConfig, ConfigurationNamespaces, ServerConfig } from '@/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
    const { adapter, ssl } = await configureFastifyAdapter();

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);

    const configService = app.get(ConfigService<AppConfig, true>);
    const { host, port } = configService.get<ServerConfig>(ConfigurationNamespaces.SERVER);

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
