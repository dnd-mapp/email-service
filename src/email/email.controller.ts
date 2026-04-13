import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './services';

@Controller('/email')
export class EmailController {
    private readonly emailService: EmailService;

    constructor(emailService: EmailService) {
        this.emailService = emailService;
    }

    /**
     * Send an email.
     *
     * @remarks Dispatches an outbound email to the specified recipient via
     * Resend and records the outcome in the audit log.
     */
    @HttpCode(HttpStatus.ACCEPTED)
    @Post()
    public async sendEmail(@Body() dto: SendEmailDto) {
        await this.emailService.sendEmail(dto.to);
    }
}
