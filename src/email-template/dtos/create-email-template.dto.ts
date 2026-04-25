import { PickType } from '@nestjs/swagger';
import { CreateEmailTemplate } from '../domain';
import { EmailTemplateDto } from './email-template.dto';

export class CreateEmailTemplateDto
    extends PickType(EmailTemplateDto, ['name', 'subject', 'content', 'senderId'] as const)
    implements CreateEmailTemplate {}
