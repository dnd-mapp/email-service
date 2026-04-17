import { DatabaseModule } from '@/database';
import { PrismaClient } from '@/prisma/client';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailModule } from '../email';
import { EmailTemplateVariableModule } from '../email-template-variable/email-template-variable.module';
import { EmailTemplateModule } from '../email-template/email-template.module';
import { SenderEmailModule } from '../sender-email/sender-email.module';
import { configModuleOptions, provideAppThrottler, provideGlobalSerialization, throttlerModuleOptions } from './config';
import { HealthModule } from './health/health.module';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        ThrottlerModule.forRoot(throttlerModuleOptions),
        HealthModule,
        EmailModule,
        EmailTemplateModule,
        EmailTemplateVariableModule,
        SenderEmailModule,
        DatabaseModule.forRoot(PrismaClient),
    ],
    providers: [provideAppThrottler(), provideGlobalSerialization()],
})
export class AppModule {}
