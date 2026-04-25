import { AppConfigurationNamespaces } from '@/common';
import {
    DatabaseConfig,
    DEFAULT_DB_HOST,
    DEFAULT_DB_PORT,
    DEFAULT_DB_SCHEMA,
    DEFAULT_DB_USER,
} from '@dnd-mapp/shared-backend';
import { parseInteger } from '@dnd-mapp/shared-utils';
import { registerAs } from '@nestjs/config';
import { EnvironmentVariableNames } from '../validation/environment-variables.schema';

export const databaseConfig = registerAs<DatabaseConfig>(AppConfigurationNamespaces.DATABASE, () => {
    return {
        host: process.env[EnvironmentVariableNames.DB_HOST] ?? DEFAULT_DB_HOST,
        port: parseInteger(process.env[EnvironmentVariableNames.DB_PORT]!, DEFAULT_DB_PORT),
        schema: process.env[EnvironmentVariableNames.DB_SCHEMA] ?? DEFAULT_DB_SCHEMA,
        user: process.env[EnvironmentVariableNames.DB_USER] ?? DEFAULT_DB_USER,
        password: process.env[EnvironmentVariableNames.DB_PASSWORD]!,
    };
});
