import { DatabaseService } from '@/database';
import { MockPrisma, createTestModule } from '@/test';
import { NotFoundException } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { SEED_EMAIL_TEMPLATE_ID } from '../email-template/test';
import { EmailTemplateVariableController } from './email-template-variable.controller';
import { EmailTemplateVariableModule } from './email-template-variable.module';
import { SEED_EMAIL_TEMPLATE_VARIABLE_ID } from './test';

describe('EmailTemplateVariableController', () => {
    async function setupTest() {
        const module = await createTestModule(EmailTemplateVariableModule);
        const databaseService = module.get<DatabaseService<MockPrisma>>(DatabaseService);

        return {
            controller: module.get(EmailTemplateVariableController),
            emailTemplateVariableDb: databaseService.prisma.emailTemplateVariableDb,
        };
    }

    it('should return all variables for a template', async () => {
        const { controller } = await setupTest();

        const result = await controller.findAll(SEED_EMAIL_TEMPLATE_ID);

        expect(result).toHaveLength(1);
        expect(result[0]?.id).toBe(SEED_EMAIL_TEMPLATE_VARIABLE_ID);
    });

    it('should create a variable and set the Location header', async () => {
        const { controller, emailTemplateVariableDb } = await setupTest();
        const mockRes = { header: vi.fn() } as unknown as FastifyReply;
        const dto = { name: 'newVar' };

        const result = await controller.create(SEED_EMAIL_TEMPLATE_ID, dto as any, mockRes);

        expect(result.name).toBe('newVar');
        expect(mockRes.header).toHaveBeenCalledWith(
            'Location',
            `/email-templates/${SEED_EMAIL_TEMPLATE_ID}/variables/${result.id}`
        );
        expect(emailTemplateVariableDb.getAll()).toHaveLength(2);
    });

    it('should return a variable by id', async () => {
        const { controller } = await setupTest();

        const result = await controller.findById(SEED_EMAIL_TEMPLATE_VARIABLE_ID);

        expect(result.id).toBe(SEED_EMAIL_TEMPLATE_VARIABLE_ID);
    });

    it('should update a variable', async () => {
        const { controller } = await setupTest();

        const result = await controller.update(SEED_EMAIL_TEMPLATE_ID, SEED_EMAIL_TEMPLATE_VARIABLE_ID, {
            name: 'updatedVar',
        } as any);

        expect(result.id).toBe(SEED_EMAIL_TEMPLATE_VARIABLE_ID);
        expect(result.name).toBe('updatedVar');
    });

    it('should partially update a variable', async () => {
        const { controller } = await setupTest();

        const result = await controller.patch(SEED_EMAIL_TEMPLATE_ID, SEED_EMAIL_TEMPLATE_VARIABLE_ID, {
            name: 'patchedVar',
        } as any);

        expect(result.id).toBe(SEED_EMAIL_TEMPLATE_VARIABLE_ID);
        expect(result.name).toBe('patchedVar');
    });

    it('should delete a variable', async () => {
        const { controller, emailTemplateVariableDb } = await setupTest();

        await controller.delete(SEED_EMAIL_TEMPLATE_VARIABLE_ID);

        expect(emailTemplateVariableDb.getById(SEED_EMAIL_TEMPLATE_VARIABLE_ID)).toBeNull();
    });

    it('should throw NotFoundException when the template does not exist', async () => {
        const { controller } = await setupTest();

        await expect(controller.findAll('unknown')).rejects.toThrow(NotFoundException);
    });
});
