import { DatabaseModule } from '@/database';
import { PrismaClient } from '@/prisma/client';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { configModuleOptions, provideAppThrottler, provideGlobalSerialization, throttlerModuleOptions } from './config';
import { HealthModule } from './health/health.module';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        ThrottlerModule.forRoot(throttlerModuleOptions),
        HealthModule,
        DatabaseModule.forRoot(PrismaClient),
    ],
    providers: [provideAppThrottler(), provideGlobalSerialization()],
})
export class AppModule {}
