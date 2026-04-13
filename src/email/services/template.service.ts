import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { readFile } from 'fs/promises';
import Handlebars from 'handlebars';
import { join } from 'path';
import { EmailTemplate, EmailTemplates, emailSubjects } from '../email-template.enum';

@Injectable()
export class TemplateService implements OnModuleInit {
    private readonly logger = new Logger(TemplateService.name);
    private templates!: ReadonlyMap<EmailTemplate, Handlebars.TemplateDelegate>;

    public async onModuleInit() {
        const templateDir =
            process.env['NODE_ENV'] === 'test'
                ? join(__dirname, '../../assets/email-templates')
                : join(__dirname, 'assets/email-templates');

        this.templates = new Map(
            await Promise.all(
                Object.values(EmailTemplates).map(async (name) => {
                    const source = await readFile(join(templateDir, `${name}.hbs`), 'utf-8');
                    return [name, Handlebars.compile(source)] as const;
                })
            )
        );
    }

    public render(template: EmailTemplate, variables: Record<string, string>) {
        const compiled = this.templates.get(template);

        if (!compiled) {
            this.logger.error(`Unknown email template: "${template}"`);
            throw new InternalServerErrorException(`Unknown email template: "${template}"`);
        }

        return { subject: emailSubjects[template], html: compiled(variables) };
    }
}
