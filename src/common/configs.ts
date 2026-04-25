import { ConfigurationNamespaces, DatabaseConfig, ServerConfig } from '@dnd-mapp/shared-backend';

export const AppConfigurationNamespaces = {
    ...ConfigurationNamespaces,
    RESEND: 'resend',
} as const;

export interface ResendConfig {
    apiKey: string;
}

export interface AppConfig {
    [AppConfigurationNamespaces.SERVER]: ServerConfig;
    [AppConfigurationNamespaces.DATABASE]: DatabaseConfig;
    [AppConfigurationNamespaces.RESEND]: ResendConfig;
}
