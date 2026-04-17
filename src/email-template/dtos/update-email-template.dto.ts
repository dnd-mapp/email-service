import { PartialType, PickType } from '@nestjs/swagger';
import { UpdateEmailTemplate } from '../domain/update-email-template.model';
import { EmailTemplateDto } from './email-template.dto';

export class UpdateEmailTemplateDto
    extends PartialType(PickType(EmailTemplateDto, ['name', 'subject', 'content', 'senderId'] as const))
    implements UpdateEmailTemplate {}
