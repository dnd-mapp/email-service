import { AppConfig, ResendConfig } from '@/common';
import { DatabaseConfig, ServerConfig } from '@dnd-mapp/shared-backend';

export const defaultMockServerConfig: ServerConfig = {
    host: 'localhost',
    port: 4450,
    cors: {
        origins: ['http://localhost:4350'],
    },
    ssl: {},
};

export const defaultMockDatabaseConfig: DatabaseConfig = {
    host: 'localhost',
    port: 3306,
    schema: 'email_db',
    user: 'email_app',
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
