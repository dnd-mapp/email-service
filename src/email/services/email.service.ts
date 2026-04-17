import { tryCatch } from '@dnd-mapp/shared-utils';
import { BadRequestException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { EmailTemplateService } from '../../email-template/services';
import { EmailLogStatuses } from '../email-log-statuses.enum';
import { EmailRepository } from '../email.repository';
import { ResendService } from './resend.service';
import { TemplateService } from './template.service';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly emailRepository: EmailRepository;
    private readonly resendService: ResendService;
    private readonly templateService: TemplateService;
    private readonly emailTemplateService: EmailTemplateService;

    constructor(
        emailRepository: EmailRepository,
        resendService: ResendService,
        templateService: TemplateService,
        emailTemplateService: EmailTemplateService
    ) {
        this.emailRepository = emailRepository;
        this.resendService = resendService;
        this.templateService = templateService;
        this.emailTemplateService = emailTemplateService;
    }

    public async sendEmail(to: string, templateName: string, variables: Record<string, string>) {
        this.logger.log(`Sending email to "${to}"`);

        const template = await this.emailTemplateService.findByName(templateName);

        if (!template.sender) {
            throw new ServiceUnavailableException('No sender configured for template');
        }
        const missing = (template.variables ?? []).map((v) => v.name).filter((name) => !(name in variables));

        if (missing.length > 0) {
            throw new BadRequestException(`Missing required template variables: ${missing.join(', ')}`);
        }
        const { html } = this.templateService.render(template.content, variables);

        const { error } = await tryCatch(this.resendService.send(to, template.subject, html, template.sender));

        if (error) {
            this.logger.error(`Failed to send email to "${to}"`, error.stack);
            await this.emailRepository.log(to, EmailLogStatuses.FAILURE, error.message);

            throw new ServiceUnavailableException(`Failed to send email to "${to}"`);
        }
        this.logger.log(`Email sent successfully to "${to}"`);
        await this.emailRepository.log(to, EmailLogStatuses.SUCCESS);
    }
}
