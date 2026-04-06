import { isArrayEmpty } from '@/shared-utils';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EnvironmentVariablesSchema } from './environment-variables.schema';

export async function validateEnvironmentVariables(variables: Record<string, string>) {
    const parsedEnvironmentVariables = plainToInstance(EnvironmentVariablesSchema, variables, {
        enableImplicitConversion: true,
        enableCircularCheck: true,
        exposeDefaultValues: true,
    });

    const validationErrors = await validate(parsedEnvironmentVariables, {
        forbidUnknownValues: true,
        skipMissingProperties: false,
        stopAtFirstError: true,
        whitelist: true,
    });

    if (!isArrayEmpty(validationErrors)) {
        const constraints = validationErrors[0]!.constraints as Record<string, string>;
        throw new Error(Object.values(constraints)[0]);
    }

    return parsedEnvironmentVariables;
}
