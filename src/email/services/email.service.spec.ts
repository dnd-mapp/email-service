import { MockResendService } from '@/test';
import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EmailLogStatuses } from '../email-log-statuses';
import { EmailRepository } from '../email.repository';
import { EmailService } from './email.service';
import { ResendService } from './resend.service';

describe('EmailService', () => {
    const mockLog = vi.fn().mockResolvedValue(undefined);
    const mockEmailRepository = { log: mockLog };

    async function setupTest() {
        const resendService = new MockResendService();

        const module = await Test.createTestingModule({
            providers: [
                EmailService,
                { provide: EmailRepository, useValue: mockEmailRepository },
                { provide: ResendService, useValue: resendService },
            ],
        }).compile();

        module.useLogger(false);
        await module.init();

        return { service: module.get(EmailService), resendService };
    }

    it('should send an email and log SUCCESS', async () => {
        const { service, resendService } = await setupTest();

        await service.sendEmail('user@example.com');

        expect(resendService.send).toHaveBeenCalledWith('user@example.com', expect.any(String), expect.any(String));
        expect(mockLog).toHaveBeenCalledWith('user@example.com', EmailLogStatuses.SUCCESS);
    });

    it('should log FAILURE and throw ServiceUnavailableException when sending fails', async () => {
        const { service, resendService } = await setupTest();
        resendService.send.mockRejectedValueOnce(new Error('API error'));

        await expect(service.sendEmail('user@example.com')).rejects.toThrow(ServiceUnavailableException);

        expect(mockLog).toHaveBeenCalledWith('user@example.com', EmailLogStatuses.FAILURE, 'API error');
    });
});
