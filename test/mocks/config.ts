import { AppConfig, DatabaseConfig, ResendConfig, ServerConfig } from '@/common';

export const defaultMockServerConfig: ServerConfig = {
    host: 'localhost',
    port: 4350,
    cors: {
        origins: ['http://localhost:4200'],
    },
    ssl: {},
};

export const defaultMockDatabaseConfig: DatabaseConfig = {
    host: 'localhost',
    port: 3306,
    schema: 'dma_auth',
    user: 'dma',
    password: 'password',
};

export const defaultMockResendConfig: ResendConfig = {
    apiKey: 're_mock_api_key',
};

export class MockConfigService {
    public config: AppConfig;

    constructor(config?: Partial<AppConfig>) {
        this.config = {
            server: {
                ...defaultMockServerConfig,
                ...config?.server,
            },
            database: {
                ...defaultMockDatabaseConfig,
                ...config?.database,
            },
            resend: {
                ...defaultMockResendConfig,
                ...config?.resend,
            },
        };
    }

    public get(key: keyof AppConfig) {
        return this.config[key];
    }
}
