import { DatabaseService } from '@/database';
import { MockPrisma } from '@/test';
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EmailLogStatuses } from './email-log-statuses.enum';
import { EmailRepository } from './email.repository';

describe('EmailRepository', () => {
    async function setupTest() {
        const prisma = new MockPrisma({});

        const module = await Test.createTestingModule({
            providers: [EmailRepository, { provide: DatabaseService, useValue: { prisma: prisma } }],
        }).compile();

        module.useLogger(false);
        await module.init();

        return {
            repository: module.get(EmailRepository),
            prisma: prisma,
            emailLogDb: prisma.emailLogDb,
        };
    }

    it('should create a SUCCESS log entry', async () => {
        const { repository, emailLogDb } = await setupTest();

        await repository.log('user@example.com', EmailLogStatuses.SUCCESS);

        const logs = emailLogDb.getAll();
        expect(logs).toHaveLength(1);
        expect(logs[0]).toMatchObject({ to: 'user@example.com', status: EmailLogStatuses.SUCCESS, errorMessage: null });
    });

    it('should create a FAILURE log entry with an error message', async () => {
        const { repository, emailLogDb } = await setupTest();

        await repository.log('user@example.com', EmailLogStatuses.FAILURE, 'SMTP error');

        const logs = emailLogDb.getAll();
        expect(logs).toHaveLength(1);
        expect(logs[0]).toMatchObject({
            to: 'user@example.com',
            status: EmailLogStatuses.FAILURE,
            errorMessage: 'SMTP error',
        });
    });

    it('should throw InternalServerErrorException when the database call fails', async () => {
        const { repository, prisma } = await setupTest();

        vi.spyOn(prisma.emailLog, 'create').mockRejectedValueOnce(new Error('DB connection lost'));

        await expect(repository.log('user@example.com', EmailLogStatuses.SUCCESS)).rejects.toThrow(
            InternalServerErrorException
        );
    });
});
