import { FastifyAdapter } from '@nestjs/platform-fastify';
import { readFile } from 'fs/promises';
import { EnvironmentVariableNames } from './validation/environment-variables.schema';

export async function configureFastifyAdapter() {
    const sslCertPath = process.env[EnvironmentVariableNames.SSL_CERT_PATH];
    const sslKeyPath = process.env[EnvironmentVariableNames.SSL_KEY_PATH];

    if (!sslCertPath || !sslKeyPath) {
        if (process.env['NODE_ENV'] !== 'production') {
            throw new Error('SSL certificates paths need to be set');
        }
        return {
            adapter: new FastifyAdapter(),
            ssl: false,
        };
    }
    const sslCert = await readFile(sslCertPath, { encoding: 'utf8' });
    const sslKey = await readFile(sslKeyPath, { encoding: 'utf8' });

    if (process.env['NODE_ENV'] !== 'production' && (!sslCert || !sslKey)) {
        throw new Error('SSL certificates are missing');
    }
    return {
        adapter: new FastifyAdapter({ https: { cert: sslCert, key: sslKey } }),
        ssl: true,
    };
}
