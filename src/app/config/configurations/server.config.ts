import { ConfigurationNamespaces, ServerConfig, SslConfig } from '@/common';
import { parseArrayFromString, parseInteger } from '@/shared-utils';
import { registerAs } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { DEFAULT_CORS_ORIGINS, DEFAULT_SERVER_HOST, DEFAULT_SERVER_PORT } from '../constants';
import { EnvironmentVariableNames } from '../validation/environment-variables.schema';

export const serverConfig = registerAs<ServerConfig>(ConfigurationNamespaces.SERVER, async () => {
    const sslCertPath = process.env[EnvironmentVariableNames.SSL_CERT_PATH];
    const sslKeyPath = process.env[EnvironmentVariableNames.SSL_KEY_PATH];

    const ssl: SslConfig = {};

    if (sslCertPath && sslKeyPath) {
        ssl.cert = await readFile(sslCertPath, { encoding: 'utf8' });
        ssl.key = await readFile(sslKeyPath, { encoding: 'utf8' });
    }
    return {
        host: process.env[EnvironmentVariableNames.SERVER_HOST] ?? DEFAULT_SERVER_HOST,
        port: parseInteger(DEFAULT_SERVER_PORT, process.env[EnvironmentVariableNames.SERVER_PORT]),
        cors: {
            origins: parseArrayFromString(DEFAULT_CORS_ORIGINS, process.env[EnvironmentVariableNames.CORS_ORIGINS]),
        },
        ssl: ssl,
    };
});
