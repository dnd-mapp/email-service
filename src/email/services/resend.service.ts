import { AppConfig, ConfigurationNamespaces, ResendConfig } from '@/common';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendService implements OnModuleInit {
    private readonly logger = new Logger(ResendService.name);
    private readonly configService: ConfigService<AppConfig, true>;

    private client!: Resend;

    private from!: string;

    constructor(configService: ConfigService<AppConfig, true>) {
        this.configService = configService;
    }

    public onModuleInit() {
        const { apiKey, from } = this.configService.get<ResendConfig>(ConfigurationNamespaces.RESEND);

        this.client = new Resend(apiKey);
        this.from = from;
    }

    public async send(to: string, subject: string, text: string) {
        this.logger.debug(`Dispatching email to "${to}" via Resend`);

        const { error } = await this.client.emails.send({
            from: `D&D Mapp <${this.from}>`,
            to: to,
            subject: subject,
            text: text,
        });

        if (error) {
            throw new Error(error.message);
        }
    }
}
