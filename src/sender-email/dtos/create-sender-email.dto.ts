import { PickType } from '@nestjs/swagger';
import { CreateSenderEmail } from '../domain';
import { SenderEmailDto } from './sender-email.dto';

export class CreateSenderEmailDto
    extends PickType(SenderEmailDto, ['name', 'email'] as const)
    implements CreateSenderEmail {}
