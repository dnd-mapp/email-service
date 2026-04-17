import { PickType } from '@nestjs/swagger';
import { CreateSenderEmail } from '../domain/create-sender-email.model';
import { SenderEmailDto } from './sender-email.dto';

export class CreateSenderEmailDto
    extends PickType(SenderEmailDto, ['name', 'email'] as const)
    implements CreateSenderEmail {}
