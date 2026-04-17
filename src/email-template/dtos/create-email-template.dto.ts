import { PickType } from '@nestjs/swagger';
import { CreateEmailTemplate } from '../domain/create-email-template.model';
import { EmailTemplateDto } from './email-template.dto';

export class CreateEmailTemplateDto
    extends PickType(EmailTemplateDto, ['name', 'subject', 'content', 'senderId'] as const)
    implements CreateEmailTemplate {}
