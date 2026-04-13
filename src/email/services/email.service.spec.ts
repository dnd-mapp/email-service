import { MockResendService, MockTemplateService } from '@/test';
import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EmailLogStatuses } from '../email-log-statuses.enum';
import { EmailTemplates } from '../email-template.enum';
import { EmailRepository } from '../email.repository';
import { EmailService } from './email.service';
import { ResendService } from './resend.service';
import { TemplateService } from './template.service';

describe('EmailService', () => {
    const mockLog = vi.fn().mockResolvedValue(undefined);
    const mockEmailRepository = { log: mockLog };

    async function setupTest() {
        const resendService = new MockResendService();
        const templateService = new MockTemplateService();

        const module = await Test.createTestingModule({
            providers: [
                EmailService,
                { provide: EmailRepository, useValue: mockEmailRepository },
                { provide: ResendService, useValue: resendService },
                { provide: TemplateService, useValue: templateService },
            ],
        }).compile();

        module.useLogger(false);
        await module.init();

        return { service: module.get(EmailService), resendService, templateService };
    }

    it('should render the template and send an email, then log SUCCESS', async () => {
        const { service, resendService, templateService } = await setupTest();

        await service.sendEmail('user@example.com', EmailTemplates.WELCOME, { userName: 'Alice' });

        expect(templateService.render).toHaveBeenCalledWith(EmailTemplates.WELCOME, { userName: 'Alice' });
        expect(resendService.send).toHaveBeenCalledWith('user@example.com', 'Mock Subject', '<p>Mock HTML</p>');
        expect(mockLog).toHaveBeenCalledWith('user@example.com', EmailLogStatuses.SUCCESS);
    });

    it('should log FAILURE and throw ServiceUnavailableException when sending fails', async () => {
        const { service, resendService } = await setupTest();
        resendService.send.mockRejectedValueOnce(new Error('API error'));

        await expect(
            service.sendEmail('user@example.com', EmailTemplates.WELCOME, { userName: 'Alice' })
        ).rejects.toThrow(ServiceUnavailableException);

        expect(mockLog).toHaveBeenCalledWith('user@example.com', EmailLogStatuses.FAILURE, 'API error');
    });
});
