import { SenderEmail } from '@/sender-email/domain';
import { MockConfigService } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ResendService } from './resend.service';

const mockEmailsSend = vi.fn().mockResolvedValue({ data: { id: 'email-1' }, error: null });

vi.mock('resend', () => ({
    Resend: vi.fn().mockImplementation(function () {
        return {
            emails: { send: mockEmailsSend },
        };
    }),
}));

describe('ResendService', () => {
    const now = new Date();

    const mockSender: SenderEmail = {
        id: 'sender-1',
        name: 'D&D Mapp',
        email: 'info@dndmapp.nl.eu.org',
        createdAt: now,
        updatedAt: now,
    };

    async function setupTest() {
        const module = await Test.createTestingModule({
            providers: [ResendService, { provide: ConfigService, useFactory: () => new MockConfigService() }],
        }).compile();

        module.useLogger(false);
        await module.init();

        return { service: module.get(ResendService) };
    }

    beforeEach(() => {
        mockEmailsSend.mockResolvedValue({ data: { id: 'email-1' }, error: null });
    });

    it('should send with the correct from address', async () => {
        const { service } = await setupTest();

        await service.send('user@example.com', 'Welcome', '<p>Hi</p>', mockSender);

        expect(mockEmailsSend).toHaveBeenCalledWith({
            from: 'D&D Mapp <info@dndmapp.nl.eu.org>',
            to: 'user@example.com',
            subject: 'Welcome',
            html: '<p>Hi</p>',
        });
    });

    it('should throw an Error when Resend returns an error', async () => {
        const { service } = await setupTest();
        mockEmailsSend.mockResolvedValueOnce({ data: null, error: { message: 'Invalid API key' } });

        await expect(service.send('user@example.com', 'Welcome', '<p>Hi</p>', mockSender)).rejects.toThrow(
            'Invalid API key'
        );
    });
});
