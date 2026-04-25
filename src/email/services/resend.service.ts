import { AppConfig, AppConfigurationNamespaces, ResendConfig } from '@/common';
import { SenderEmail } from '@/sender-email/domain';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendService implements OnModuleInit {
    private readonly logger = new Logger(ResendService.name);
    private readonly configService: ConfigService<AppConfig, true>;

    private client!: Resend;

    constructor(configService: ConfigService<AppConfig, true>) {
        this.configService = configService;
    }

    public onModuleInit() {
        const { apiKey } = this.configService.get<ResendConfig>(AppConfigurationNamespaces.RESEND);

        this.client = new Resend(apiKey);
    }

    public async send(to: string, subject: string, html: string, sender: SenderEmail): Promise<void> {
        this.logger.debug(`Dispatching email to "${to}" via Resend using sender "${sender.email}"`);

        const { error } = await this.client.emails.send({
            from: `${sender.name} <${sender.email}>`,
            to: to,
            subject: subject,
            html: html,
        });

        if (error) {
            throw new Error(error.message);
        }
    }
}
