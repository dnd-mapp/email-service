import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiAcceptedResponse } from '@nestjs/swagger';
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
    @ApiAcceptedResponse({ description: 'Email accepted for delivery.' })
    @HttpCode(HttpStatus.ACCEPTED)
    @Post()
    public async sendEmail(@Body() dto: SendEmailDto) {
        await this.emailService.sendEmail(dto.to, dto.templateName, dto.variables ?? {});
    }
}
