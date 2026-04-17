import { PickType } from '@nestjs/swagger';
import { CreateEmailTemplateVariable } from '../domain/create-email-template-variable.model';
import { EmailTemplateVariableDto } from './email-template-variable.dto';

export class CreateEmailTemplateVariableDto
    extends PickType(EmailTemplateVariableDto, ['name'] as const)
    implements Omit<CreateEmailTemplateVariable, 'templateId'> {}
