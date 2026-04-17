import { DatabaseModule } from '@/database';
import { MockConfigService, MockPrisma, MockResendService, MockTemplateService } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailModule } from './email.module';
import { EmailService } from './services/email.service';
import { ResendService } from './services/resend.service';
import { TemplateService } from './services/template.service';

describe('EmailController', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule.forRoot(MockPrisma), EmailModule],
        })
            .overrideProvider(ConfigService)
            .useFactory({ factory: () => new MockConfigService() })
            .overrideProvider(ResendService)
            .useValue(new MockResendService())
            .overrideProvider(TemplateService)
            .useValue(new MockTemplateService())
            .compile();

        module.useLogger(false);
        await module.init();

        return {
            controller: module.get(EmailController),
            service: module.get(EmailService),
        };
    }

    it('should call emailService.sendEmail with the recipient address, templateName, and variables', async () => {
        const { controller, service } = await setupTest();
        const spy = vi.spyOn(service, 'sendEmail').mockResolvedValue();

        await controller.sendEmail({
            to: 'user@example.com',
            templateName: 'welcome',
            variables: { userName: 'Alice' },
        });

        expect(spy).toHaveBeenCalledWith('user@example.com', 'welcome', { userName: 'Alice' });
    });
});
