import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { EmailLogStatuses } from '../email-log-statuses';
import { EmailRepository } from '../email.repository';
import { ResendService } from './resend.service';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly emailRepository: EmailRepository;
    private readonly resendService: ResendService;

    constructor(emailRepository: EmailRepository, resendService: ResendService) {
        this.emailRepository = emailRepository;
        this.resendService = resendService;
    }

    public async sendEmail(to: string) {
        this.logger.log(`Sending email to "${to}"`);

        const { error } = await tryCatch(this.resendService.send(to, 'TODO: subject', 'TODO: email body'));

        if (error) {
            this.logger.error(`Failed to send email to "${to}"`, error.stack);
            await this.emailRepository.log(to, EmailLogStatuses.FAILURE, error.message);

            throw new ServiceUnavailableException(`Failed to send email to "${to}"`);
        }
        this.logger.log(`Email sent successfully to "${to}"`);
        await this.emailRepository.log(to, EmailLogStatuses.SUCCESS);
    }
}
