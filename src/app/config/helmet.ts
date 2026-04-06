import fastifyHelmet from '@fastify/helmet';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

export async function configureHelmet(app: NestFastifyApplication) {
    await app.register(fastifyHelmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [`'self'`],
                styleSrc: [`'self'`, `'unsafe-inline'`],
                imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
                scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
            },
        },
    });
}
