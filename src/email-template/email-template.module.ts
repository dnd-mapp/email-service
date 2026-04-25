import { DatabaseModule } from '@dnd-mapp/shared-backend';
import { Module } from '@nestjs/common';
import { EmailTemplateController } from './email-template.controller';
import { EmailTemplateRepository } from './email-template.repository';
import { EmailTemplateService } from './email-template.service';

@Module({
    imports: [DatabaseModule],
    controllers: [EmailTemplateController],
    providers: [EmailTemplateRepository, EmailTemplateService],
    exports: [EmailTemplateService],
})
export class EmailTemplateModule {}
