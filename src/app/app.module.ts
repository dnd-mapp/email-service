import { EmailModule } from '@/email';
import { EmailTemplateModule } from '@/email-template';
import { EmailTemplateVariableModule } from '@/email-template-variable';
import { PrismaClient } from '@/prisma/client';
import { SenderEmailModule } from '@/sender-email';
import {
    createThrottlerOptions,
    DatabaseModule,
    HealthModule,
    provideAppThrottler,
    provideGlobalSerialization,
} from '@dnd-mapp/shared-backend';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { configModuleOptions } from './config';
import { HealthController } from './health/health.controller';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        ThrottlerModule.forRoot(createThrottlerOptions()),
        HealthModule.forRoot(HealthController),
        EmailModule,
        EmailTemplateModule,
        EmailTemplateVariableModule,
        SenderEmailModule,
        DatabaseModule.forRoot(PrismaClient),
    ],
    providers: [provideAppThrottler(), provideGlobalSerialization()],
})
export class AppModule {}
