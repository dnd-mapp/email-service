import { PartialType, PickType } from '@nestjs/swagger';
import { UpdateSenderEmail } from '../domain/update-sender-email.model';
import { SenderEmailDto } from './sender-email.dto';

export class UpdateSenderEmailDto
    extends PartialType(PickType(SenderEmailDto, ['name', 'email'] as const))
    implements UpdateSenderEmail {}
