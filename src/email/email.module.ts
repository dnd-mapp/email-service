import { DatabaseModule } from '@/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './email.controller';
import { EmailRepository } from './email.repository';
import { EmailService, ResendService, TemplateService } from './services';

@Module({
    imports: [ConfigModule, DatabaseModule],
    controllers: [EmailController],
    providers: [ResendService, TemplateService, EmailRepository, EmailService],
})
export class EmailModule {}
