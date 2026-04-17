import { DatabaseModule } from '@/database';
import { Module } from '@nestjs/common';
import { EmailTemplateVariableController } from './email-template-variable.controller';
import { EmailTemplateVariableRepository } from './email-template-variable.repository';
import { EmailTemplateVariableService } from './services';

@Module({
    imports: [DatabaseModule],
    controllers: [EmailTemplateVariableController],
    providers: [EmailTemplateVariableRepository, EmailTemplateVariableService],
    exports: [EmailTemplateVariableService],
})
export class EmailTemplateVariableModule {}
