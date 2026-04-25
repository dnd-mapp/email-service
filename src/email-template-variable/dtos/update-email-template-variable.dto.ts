import { PartialType, PickType } from '@nestjs/swagger';
import { UpdateEmailTemplateVariable } from '../domain';
import { EmailTemplateVariableDto } from './email-template-variable.dto';

export class UpdateEmailTemplateVariableDto
    extends PartialType(PickType(EmailTemplateVariableDto, ['name'] as const))
    implements UpdateEmailTemplateVariable {}
