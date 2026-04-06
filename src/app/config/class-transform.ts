import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

export function configureGlobalValidation(app: NestFastifyApplication) {
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (validationErrors) => {
                const constraints = validationErrors[0]!.constraints as Record<string, string>;
                return new BadRequestException(Object.values(constraints)[0]);
            },
            forbidUnknownValues: true,
            forbidNonWhitelisted: true,
            stopAtFirstError: true,
            transformOptions: {
                enableImplicitConversion: true,
                enableCircularCheck: true,
                exposeDefaultValues: true,
            },
            transform: true,
            validateCustomDecorators: true,
            whitelist: true,
        })
    );
}
