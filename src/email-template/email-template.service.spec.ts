import { MockPrisma, createTestModule } from '@/test';
import { DatabaseService } from '@dnd-mapp/shared-backend';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EmailTemplateModule } from './email-template.module';
import { EmailTemplateService } from './email-template.service';
import { SEED_EMAIL_TEMPLATE_ID } from './test';

describe('EmailTemplateService', () => {
    async function setupTest() {
        const module = await createTestModule(EmailTemplateModule);
        const databaseService = module.get<DatabaseService<MockPrisma>>(DatabaseService);

        return {
            service: module.get(EmailTemplateService),
            senderEmailDb: databaseService.prisma.senderEmailDb,
            emailTemplateDb: databaseService.prisma.emailTemplateDb,
        };
    }

    describe('findAll()', () => {
        it('should return all email templates', async () => {
            const { service } = await setupTest();

            const result = await service.findAll();

            expect(result).toHaveLength(1);
            expect(result[0]?.id).toBe(SEED_EMAIL_TEMPLATE_ID);
        });
    });

    describe('findById()', () => {
        it('should return the template when found', async () => {
            const { service } = await setupTest();

            const result = await service.findById(SEED_EMAIL_TEMPLATE_ID);

            expect(result.id).toBe(SEED_EMAIL_TEMPLATE_ID);
        });

        it('should throw NotFoundException when template does not exist', async () => {
            const { service } = await setupTest();

            await expect(service.findById('unknown')).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByName()', () => {
        it('should return the template when found', async () => {
            const { service } = await setupTest();

            const result = await service.findByName('welcome');

            expect(result.name).toBe('welcome');
        });

        it('should throw NotFoundException when the template does not exist', async () => {
            const { service } = await setupTest();

            await expect(service.findByName('no-such-template')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create()', () => {
        it('should create a template when name is unique and sender exists', async () => {
            const { service, senderEmailDb } = await setupTest();
            const sender = senderEmailDb.getAll()[0]!;

            const result = await service.create({
                name: 'newsletter',
                subject: 'Monthly Newsletter',
                content: '<p>News for {{username}}</p>',
                senderId: sender.id,
            });

            expect(result.name).toBe('newsletter');
            expect(result.senderId).toBe(sender.id);
        });

        it('should throw ConflictException when the template name is already taken', async () => {
            const { service, senderEmailDb } = await setupTest();
            const sender = senderEmailDb.getAll()[0]!;

            await expect(
                service.create({ name: 'welcome', subject: 'S', content: 'C', senderId: sender.id })
            ).rejects.toThrow(ConflictException);
        });

        it('should throw NotFoundException when the senderId does not exist', async () => {
            const { service } = await setupTest();

            await expect(
                service.create({ name: 'new-tpl', subject: 'S', content: 'C', senderId: 'ghost' })
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('update()', () => {
        it('should update the template successfully', async () => {
            const { service } = await setupTest();

            const result = await service.update(SEED_EMAIL_TEMPLATE_ID, { subject: 'New Subject' });

            expect(result.subject).toBe('New Subject');
        });

        it('should throw NotFoundException when template does not exist', async () => {
            const { service } = await setupTest();

            await expect(service.update('ghost', { subject: 'X' })).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException when updating to a name already taken by another template', async () => {
            const { service, senderEmailDb } = await setupTest();
            const sender = senderEmailDb.getAll()[0]!;
            await service.create({ name: 'other-template', subject: 'S', content: 'C', senderId: sender.id });

            await expect(service.update(SEED_EMAIL_TEMPLATE_ID, { name: 'other-template' })).rejects.toThrow(
                ConflictException
            );
        });

        it('should throw NotFoundException when updating to a non-existent senderId', async () => {
            const { service } = await setupTest();

            await expect(service.update(SEED_EMAIL_TEMPLATE_ID, { senderId: 'ghost' })).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe('delete()', () => {
        it('should delete an existing template', async () => {
            const { service, emailTemplateDb } = await setupTest();

            await service.delete(SEED_EMAIL_TEMPLATE_ID);

            expect(emailTemplateDb.getById(SEED_EMAIL_TEMPLATE_ID)).toBeNull();
        });

        it('should throw NotFoundException when template does not exist', async () => {
            const { service } = await setupTest();

            await expect(service.delete('ghost')).rejects.toThrow(NotFoundException);
        });
    });
});
