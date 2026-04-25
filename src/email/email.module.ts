import { EmailTemplateModule } from '@/email-template';
import { DatabaseModule } from '@dnd-mapp/shared-backend';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './email.controller';
import { EmailRepository } from './email.repository';
import { EmailService, ResendService, TemplateService } from './services';

@Module({
    imports: [ConfigModule, DatabaseModule, EmailTemplateModule],
    controllers: [EmailController],
    providers: [ResendService, TemplateService, EmailRepository, EmailService],
    exports: [ResendService, TemplateService, EmailService],
})
export class EmailModule {}
