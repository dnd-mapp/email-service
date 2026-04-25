import { AppConfigurationNamespaces } from '@/common';
import { DEFAULT_SERVER_HOST, ServerConfig, SslConfig } from '@dnd-mapp/shared-backend';
import { fromStringToArray, parseInteger } from '@dnd-mapp/shared-utils';
import { registerAs } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { DEFAULT_CORS_ORIGINS, DEFAULT_SERVER_PORT } from '../constants';
import { EnvironmentVariableNames } from '../validation/environment-variables.schema';

export const serverConfig = registerAs<ServerConfig>(AppConfigurationNamespaces.SERVER, async () => {
    const sslCertPath = process.env[EnvironmentVariableNames.SSL_CERT_PATH];
    const sslKeyPath = process.env[EnvironmentVariableNames.SSL_KEY_PATH];

    const ssl: SslConfig = {};

    if (sslCertPath && sslKeyPath) {
        ssl.cert = await readFile(sslCertPath, { encoding: 'utf8' });
        ssl.key = await readFile(sslKeyPath, { encoding: 'utf8' });
    }
    return {
        host: process.env[EnvironmentVariableNames.SERVER_HOST] ?? DEFAULT_SERVER_HOST,
        port: parseInteger(process.env[EnvironmentVariableNames.SERVER_PORT]!, DEFAULT_SERVER_PORT),
        cors: {
            origins:
                fromStringToArray(process.env[EnvironmentVariableNames.CORS_ORIGINS] ?? null) ?? DEFAULT_CORS_ORIGINS,
        },
        ssl: ssl,
    };
});
