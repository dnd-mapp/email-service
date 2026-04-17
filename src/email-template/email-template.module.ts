import { DatabaseModule } from '@/database';
import { Module } from '@nestjs/common';
import { EmailTemplateController } from './email-template.controller';
import { EmailTemplateRepository } from './email-template.repository';
import { EmailTemplateService } from './services';

@Module({
    imports: [DatabaseModule],
    controllers: [EmailTemplateController],
    providers: [EmailTemplateRepository, EmailTemplateService],
    exports: [EmailTemplateService],
})
export class EmailTemplateModule {}
