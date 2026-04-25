import { PickType } from '@nestjs/swagger';
import { CreateEmailTemplateVariable } from '../domain';
import { EmailTemplateVariableDto } from './email-template-variable.dto';

export class CreateEmailTemplateVariableDto
    extends PickType(EmailTemplateVariableDto, ['name'] as const)
    implements Omit<CreateEmailTemplateVariable, 'templateId'> {}
