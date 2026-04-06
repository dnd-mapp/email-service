import { config } from '@dotenvx/dotenvx';
import { defineConfig } from 'prisma/config';

config({ path: '.env', quiet: true, ignore: ['MISSING_ENV_FILE'] });

const dbUrl = process.env['DB_URL'];

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: dbUrl,
        shadowDatabaseUrl: `${dbUrl}_shadow`,
    },
});
