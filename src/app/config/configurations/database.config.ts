import { ConfigurationNamespaces, DatabaseConfig } from '@/common';
import { parseInteger } from '@/shared-utils';
import { registerAs } from '@nestjs/config';
import { DEFAULT_DB_HOST, DEFAULT_DB_PORT, DEFAULT_DB_SCHEMA, DEFAULT_DB_USER } from '../constants';
import { EnvironmentVariableNames } from '../validation/environment-variables.schema';

export const databaseConfig = registerAs<DatabaseConfig>(ConfigurationNamespaces.DATABASE, () => {
    return {
        host: process.env[EnvironmentVariableNames.DB_HOST] ?? DEFAULT_DB_HOST,
        port: parseInteger(DEFAULT_DB_PORT, process.env[EnvironmentVariableNames.DB_PORT]),
        schema: process.env[EnvironmentVariableNames.DB_SCHEMA] ?? DEFAULT_DB_SCHEMA,
        user: process.env[EnvironmentVariableNames.DB_USER] ?? DEFAULT_DB_USER,
        password: process.env[EnvironmentVariableNames.DB_PASSWORD]!,
    };
});
