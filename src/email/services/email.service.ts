import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { EmailLogStatuses } from '../email-log-statuses.enum';
import { EmailTemplate } from '../email-template.enum';
import { EmailRepository } from '../email.repository';
import { ResendService } from './resend.service';
import { TemplateService } from './template.service';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly emailRepository: EmailRepository;
    private readonly resendService: ResendService;
    private readonly templateService: TemplateService;

    constructor(emailRepository: EmailRepository, resendService: ResendService, templateService: TemplateService) {
        this.emailRepository = emailRepository;
        this.resendService = resendService;
        this.templateService = templateService;
    }

    public async sendEmail(to: string, template: EmailTemplate, variables: Record<string, string>) {
        this.logger.log(`Sending email to "${to}"`);

        const { subject, html } = this.templateService.render(template, variables);

        const { error } = await tryCatch(this.resendService.send(to, subject, html));

        if (error) {
            this.logger.error(`Failed to send email to "${to}"`, error.stack);
            await this.emailRepository.log(to, EmailLogStatuses.FAILURE, error.message);

            throw new ServiceUnavailableException(`Failed to send email to "${to}"`);
        }
        this.logger.log(`Email sent successfully to "${to}"`);
        await this.emailRepository.log(to, EmailLogStatuses.SUCCESS);
    }
}
