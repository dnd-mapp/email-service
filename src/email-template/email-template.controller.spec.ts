import { DatabaseService } from '@/database';
import { MockPrisma, createTestModule } from '@/test';
import { NotFoundException } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { SEED_SENDER_EMAIL_ID } from '../sender-email/test';
import { EmailTemplateController } from './email-template.controller';
import { EmailTemplateModule } from './email-template.module';
import { SEED_EMAIL_TEMPLATE_ID } from './test';

describe('EmailTemplateController', () => {
    async function setupTest() {
        const module = await createTestModule(EmailTemplateModule);
        const databaseService = module.get<DatabaseService<MockPrisma>>(DatabaseService);

        return {
            controller: module.get(EmailTemplateController),
            emailTemplateDb: databaseService.prisma.emailTemplateDb,
        };
    }

    it('should return all email templates', async () => {
        const { controller } = await setupTest();

        const result = await controller.findAll();

        expect(result).toHaveLength(1);
        expect(result[0]?.id).toBe(SEED_EMAIL_TEMPLATE_ID);
    });

    it('should create an email template and set the Location header', async () => {
        const { controller, emailTemplateDb } = await setupTest();
        const mockRes = { header: vi.fn() } as unknown as FastifyReply;
        const dto = {
            name: 'New Template',
            subject: 'Hello',
            content: '<p>Hi</p>',
            senderId: SEED_SENDER_EMAIL_ID,
        };

        const result = await controller.create(dto as any, mockRes);

        expect(result.name).toBe('New Template');
        expect(result.subject).toBe('Hello');
        expect(mockRes.header).toHaveBeenCalledWith('Location', `/email-templates/${result.id}`);
        expect(emailTemplateDb.getAll()).toHaveLength(2);
    });

    it('should return the email template by id', async () => {
        const { controller } = await setupTest();

        const result = await controller.findById(SEED_EMAIL_TEMPLATE_ID);

        expect(result.id).toBe(SEED_EMAIL_TEMPLATE_ID);
    });

    it('should update an email template', async () => {
        const { controller } = await setupTest();

        const result = await controller.update(SEED_EMAIL_TEMPLATE_ID, { subject: 'Updated Subject' } as any);

        expect(result.id).toBe(SEED_EMAIL_TEMPLATE_ID);
        expect(result.subject).toBe('Updated Subject');
    });

    it('should partially update an email template', async () => {
        const { controller } = await setupTest();

        const result = await controller.patch(SEED_EMAIL_TEMPLATE_ID, { subject: 'Patched Subject' } as any);

        expect(result.id).toBe(SEED_EMAIL_TEMPLATE_ID);
        expect(result.subject).toBe('Patched Subject');
    });

    it('should delete an email template', async () => {
        const { controller, emailTemplateDb } = await setupTest();

        await controller.delete(SEED_EMAIL_TEMPLATE_ID);

        expect(emailTemplateDb.getById(SEED_EMAIL_TEMPLATE_ID)).toBeNull();
    });

    it('should throw NotFoundException when the email template does not exist', async () => {
        const { controller } = await setupTest();

        await expect(controller.findById('unknown')).rejects.toThrow(NotFoundException);
    });
});
