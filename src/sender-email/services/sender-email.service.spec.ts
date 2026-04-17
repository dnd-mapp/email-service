import { DatabaseService } from '@/database';
import { MockPrisma, createTestModule } from '@/test';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { SEED_SENDER_EMAIL_ADDRESS, SEED_SENDER_EMAIL_ID } from '../test';
import { SenderEmailModule } from '../sender-email.module';
import { SenderEmailService } from './sender-email.service';

describe('SenderEmailService', () => {
    async function setupTest() {
        const module = await createTestModule(SenderEmailModule);
        const databaseService = module.get<DatabaseService<MockPrisma>>(DatabaseService);

        return {
            service: module.get(SenderEmailService),
            senderEmailDb: databaseService.prisma.senderEmailDb,
        };
    }

    describe('findAll()', () => {
        it('should return all sender emails', async () => {
            const { service } = await setupTest();

            const result = await service.findAll();

            expect(result).toHaveLength(1);
            expect(result[0]?.id).toBe(SEED_SENDER_EMAIL_ID);
        });
    });

    describe('findById()', () => {
        it('should return the sender when found', async () => {
            const { service } = await setupTest();

            const result = await service.findById(SEED_SENDER_EMAIL_ID);

            expect(result.id).toBe(SEED_SENDER_EMAIL_ID);
        });

        it('should throw NotFoundException when sender does not exist', async () => {
            const { service } = await setupTest();

            await expect(service.findById('unknown')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create()', () => {
        it('should create a new sender email and return it', async () => {
            const { service, senderEmailDb } = await setupTest();

            const result = await service.create({ name: 'New Sender', email: 'new@example.com' });

            expect(result.name).toBe('New Sender');
            expect(result.email).toBe('new@example.com');
            expect(senderEmailDb.getAll()).toHaveLength(2);
        });

        it('should throw ConflictException when the email address is already taken', async () => {
            const { service } = await setupTest();

            await expect(service.create({ name: 'Duplicate', email: SEED_SENDER_EMAIL_ADDRESS })).rejects.toThrow(
                ConflictException
            );
        });
    });

    describe('update()', () => {
        it('should update name and return updated sender', async () => {
            const { service } = await setupTest();

            const result = await service.update(SEED_SENDER_EMAIL_ID, { name: 'Updated Name' });

            expect(result.name).toBe('Updated Name');
            expect(result.id).toBe(SEED_SENDER_EMAIL_ID);
        });

        it('should throw ConflictException when updating to an email used by another sender', async () => {
            const { service, senderEmailDb } = await setupTest();
            senderEmailDb.add('Other Sender', 'other@example.com');
            const other = senderEmailDb.getByEmail('other@example.com')!;

            await expect(service.update(other.id, { email: SEED_SENDER_EMAIL_ADDRESS })).rejects.toThrow(
                ConflictException
            );
        });

        it('should throw NotFoundException when the sender does not exist', async () => {
            const { service } = await setupTest();

            await expect(service.update('unknown', { name: 'X' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete()', () => {
        it('should delete the sender', async () => {
            const { service, senderEmailDb } = await setupTest();

            await service.delete(SEED_SENDER_EMAIL_ID);

            expect(senderEmailDb.getById(SEED_SENDER_EMAIL_ID)).toBeNull();
        });

        it('should throw NotFoundException when the sender does not exist', async () => {
            const { service } = await setupTest();

            await expect(service.delete('unknown')).rejects.toThrow(NotFoundException);
        });
    });
});
