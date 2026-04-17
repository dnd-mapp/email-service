import { DatabaseModule } from '@/database';
import { MockConfigService, MockPrisma, MockResendService } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailModule } from './email.module';
import { ResendService } from './services/resend.service';

describe('EmailController', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule.forRoot(MockPrisma), EmailModule],
        })
            .overrideProvider(ConfigService)
            .useFactory({ factory: () => new MockConfigService() })
            .overrideProvider(ResendService)
            .useValue(new MockResendService())
            .compile();

        module.useLogger(false);
        await module.init();

        return {
            controller: module.get(EmailController),
            resendService: module.get<MockResendService>(ResendService),
        };
    }

    it('should send an email using the template and variables', async () => {
        const { controller, resendService } = await setupTest();

        await controller.sendEmail({
            to: 'user@example.com',
            templateName: 'welcome',
            variables: { username: 'Alice' },
        });

        expect(resendService.send).toHaveBeenCalledWith(
            'user@example.com',
            'Welcome to D&D Mapp',
            '<p>Hello Alice</p>',
            expect.objectContaining({ email: 'info@dndmapp.nl.eu.org' })
        );
    });
});
