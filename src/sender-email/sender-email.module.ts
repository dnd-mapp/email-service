import { DatabaseModule } from '@dnd-mapp/shared-backend';
import { Module } from '@nestjs/common';
import { SenderEmailController } from './sender-email.controller';
import { SenderEmailRepository } from './sender-email.repository';
import { SenderEmailService } from './sender-email.service';

@Module({
    imports: [DatabaseModule],
    controllers: [SenderEmailController],
    providers: [SenderEmailRepository, SenderEmailService],
    exports: [SenderEmailService],
})
export class SenderEmailModule {}
