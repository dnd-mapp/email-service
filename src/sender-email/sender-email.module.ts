import { DatabaseModule } from '@/database';
import { Module } from '@nestjs/common';
import { SenderEmailController } from './sender-email.controller';
import { SenderEmailRepository } from './sender-email.repository';
import { SenderEmailService } from './services';

@Module({
    imports: [DatabaseModule],
    controllers: [SenderEmailController],
    providers: [SenderEmailRepository, SenderEmailService],
    exports: [SenderEmailService],
})
export class SenderEmailModule {}
