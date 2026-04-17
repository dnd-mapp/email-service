import { DatabaseService } from '@/database';
import { MockPrisma, createTestModule } from '@/test';
import { NotFoundException } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { SenderEmailController } from './sender-email.controller';
import { SenderEmailModule } from './sender-email.module';
import { SEED_SENDER_EMAIL_ADDRESS, SEED_SENDER_EMAIL_ID } from './test';

describe('SenderEmailController', () => {
    async function setupTest() {
        const module = await createTestModule(SenderEmailModule);
        const databaseService = module.get<DatabaseService<MockPrisma>>(DatabaseService);

        return {
            controller: module.get(SenderEmailController),
            senderEmailDb: databaseService.prisma.senderEmailDb,
        };
    }

    it('should return all sender emails', async () => {
        const { controller } = await setupTest();

        const result = await controller.findAll();

        expect(result).toHaveLength(1);
        expect(result[0]?.id).toBe(SEED_SENDER_EMAIL_ID);
    });

    it('should create a sender email and set the Location header', async () => {
        const { controller, senderEmailDb } = await setupTest();
        const mockRes = { header: vi.fn() } as unknown as FastifyReply;
        const dto = { name: 'New Sender', email: 'new@example.com' };

        const result = await controller.create(dto as any, mockRes);

        expect(result.name).toBe('New Sender');
        expect(result.email).toBe('new@example.com');
        expect(mockRes.header).toHaveBeenCalledWith('Location', `/sender-emails/${result.id}`);
        expect(senderEmailDb.getAll()).toHaveLength(2);
    });

    it('should return the sender email by id', async () => {
        const { controller } = await setupTest();

        const result = await controller.findById(SEED_SENDER_EMAIL_ID);

        expect(result.id).toBe(SEED_SENDER_EMAIL_ID);
        expect(result.email).toBe(SEED_SENDER_EMAIL_ADDRESS);
    });

    it('should update a sender email', async () => {
        const { controller } = await setupTest();

        const result = await controller.update(SEED_SENDER_EMAIL_ID, { name: 'Updated Name' } as any);

        expect(result.id).toBe(SEED_SENDER_EMAIL_ID);
        expect(result.name).toBe('Updated Name');
    });

    it('should partially update a sender email', async () => {
        const { controller } = await setupTest();

        const result = await controller.patch(SEED_SENDER_EMAIL_ID, { email: 'patched@example.com' } as any);

        expect(result.id).toBe(SEED_SENDER_EMAIL_ID);
        expect(result.email).toBe('patched@example.com');
    });

    it('should delete a sender email', async () => {
        const { controller, senderEmailDb } = await setupTest();

        await controller.delete(SEED_SENDER_EMAIL_ID);

        expect(senderEmailDb.getById(SEED_SENDER_EMAIL_ID)).toBeNull();
    });

    it('should throw NotFoundException when the sender email does not exist', async () => {
        const { controller } = await setupTest();

        await expect(controller.findById('unknown')).rejects.toThrow(NotFoundException);
    });
});
