export const ConfigurationNamespaces = {
    SERVER: 'server',
    DATABASE: 'database',
    RESEND: 'resend',
} as const;

interface CorsConfig {
    origins: string[];
}

export interface SslConfig {
    cert?: string;
    key?: string;
}

export interface ServerConfig {
    host: string;
    port: number;
    cors: CorsConfig;
    ssl: SslConfig;
}

export interface DatabaseConfig {
    host: string;
    port: number;
    schema: string;
    user: string;
    password: string;
}

export interface ResendConfig {
    apiKey: string;
    from: string;
}

export interface AppConfig {
    [ConfigurationNamespaces.SERVER]: ServerConfig;
    [ConfigurationNamespaces.DATABASE]: DatabaseConfig;
    [ConfigurationNamespaces.RESEND]: ResendConfig;
}
