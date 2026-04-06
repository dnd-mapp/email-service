import { DatabaseModule } from '@/database';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
    imports: [TerminusModule, DatabaseModule],
    controllers: [HealthController],
})
export class HealthModule {}
