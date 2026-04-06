import { ConfigModuleOptions } from '@nestjs/config';
import { databaseConfig, serverConfig } from './configurations';
import { validateEnvironmentVariables } from './validation/validate-environment-variables';

export const configModuleOptions: ConfigModuleOptions = {
    envFilePath: ['.env'],
    expandVariables: true,
    load: [serverConfig, databaseConfig],
    validate: validateEnvironmentVariables,
};
