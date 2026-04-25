import { DatabaseModule } from '@dnd-mapp/shared-backend';
import { Module } from '@nestjs/common';
import { EmailTemplateVariableController } from './email-template-variable.controller';
import { EmailTemplateVariableRepository } from './email-template-variable.repository';
import { EmailTemplateVariableService } from './email-template-variable.service';

@Module({
    imports: [DatabaseModule],
    controllers: [EmailTemplateVariableController],
    providers: [EmailTemplateVariableRepository, EmailTemplateVariableService],
    exports: [EmailTemplateVariableService],
})
export class EmailTemplateVariableModule {}
