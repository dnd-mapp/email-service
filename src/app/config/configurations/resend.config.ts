import { ConfigurationNamespaces, ResendConfig } from '@/common';
import { registerAs } from '@nestjs/config';
import { EnvironmentVariableNames } from '../validation/environment-variables.schema';

export const resendConfig = registerAs<ResendConfig>(ConfigurationNamespaces.RESEND, () => ({
    apiKey: process.env[EnvironmentVariableNames.RESEND_API_KEY]!,
}));
