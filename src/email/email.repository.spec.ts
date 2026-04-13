import { DatabaseService } from '@/database';
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EmailLogStatuses } from './email-log-statuses.enum';
import { EmailRepository } from './email.repository';

describe('EmailRepository', () => {
    const mockEmailLogCreate = vi.fn().mockResolvedValue({});
    const mockDatabaseService = {
        prisma: { emailLog: { create: mockEmailLogCreate } },
    };

    async function setupTest() {
        const module = await Test.createTestingModule({
            providers: [EmailRepository, { provide: DatabaseService, useValue: mockDatabaseService }],
        }).compile();

        module.useLogger(false);
        await module.init();

        return { repository: module.get(EmailRepository) };
    }

    it('should create a SUCCESS log entry', async () => {
        const { repository } = await setupTest();

        await repository.log('user@example.com', EmailLogStatuses.SUCCESS);

        expect(mockEmailLogCreate).toHaveBeenCalledWith({
            data: { to: 'user@example.com', status: EmailLogStatuses.SUCCESS },
        });
    });

    it('should create a FAILURE log entry with an error message', async () => {
        const { repository } = await setupTest();

        await repository.log('user@example.com', EmailLogStatuses.FAILURE, 'SMTP error');

        expect(mockEmailLogCreate).toHaveBeenCalledWith({
            data: { to: 'user@example.com', status: EmailLogStatuses.FAILURE, errorMessage: 'SMTP error' },
        });
    });

    it('should throw InternalServerErrorException when the database call fails', async () => {
        const { repository } = await setupTest();
        mockEmailLogCreate.mockRejectedValueOnce(new Error('DB connection lost'));

        await expect(repository.log('user@example.com', EmailLogStatuses.SUCCESS)).rejects.toThrow(
            InternalServerErrorException
        );
    });
});
