import { DatabaseService } from '@/database';
import { MockPrisma, createTestModule } from '@/test';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { SEED_EMAIL_TEMPLATE_VARIABLE_ID } from '../test';
import { SEED_EMAIL_TEMPLATE_ID } from '../../email-template/test';
import { EmailTemplateVariableModule } from '../email-template-variable.module';
import { EmailTemplateVariableService } from './email-template-variable.service';

describe('EmailTemplateVariableService', () => {
    async function setupTest() {
        const module = await createTestModule(EmailTemplateVariableModule);
        const databaseService = module.get<DatabaseService<MockPrisma>>(DatabaseService);

        return {
            service: module.get(EmailTemplateVariableService),
            emailTemplateDb: databaseService.prisma.emailTemplateDb,
            emailTemplateVariableDb: databaseService.prisma.emailTemplateVariableDb,
        };
    }

    describe('findAllByTemplateId()', () => {
        it('should return all variables for an existing template', async () => {
            const { service } = await setupTest();

            const result = await service.findAllByTemplateId(SEED_EMAIL_TEMPLATE_ID);

            expect(result).toHaveLength(1);
            expect(result[0]?.templateId).toBe(SEED_EMAIL_TEMPLATE_ID);
        });

        it('should throw NotFoundException when template does not exist', async () => {
            const { service } = await setupTest();

            await expect(service.findAllByTemplateId('ghost')).rejects.toThrow(NotFoundException);
        });
    });

    describe('findById()', () => {
        it('should return the variable when found', async () => {
            const { service } = await setupTest();

            const result = await service.findById(SEED_EMAIL_TEMPLATE_VARIABLE_ID);

            expect(result.id).toBe(SEED_EMAIL_TEMPLATE_VARIABLE_ID);
        });

        it('should throw NotFoundException when not found', async () => {
            const { service } = await setupTest();

            await expect(service.findById('ghost')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create()', () => {
        it('should create a variable when name is unique and template exists', async () => {
            const { service, emailTemplateVariableDb } = await setupTest();

            const result = await service.create(SEED_EMAIL_TEMPLATE_ID, { name: 'email' });

            expect(result.name).toBe('email');
            expect(result.templateId).toBe(SEED_EMAIL_TEMPLATE_ID);
            expect(emailTemplateVariableDb.getAllByTemplateId(SEED_EMAIL_TEMPLATE_ID)).toHaveLength(2);
        });

        it('should throw NotFoundException when template does not exist', async () => {
            const { service } = await setupTest();

            await expect(service.create('ghost', { name: 'username' })).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException when variable name already exists for template', async () => {
            const { service } = await setupTest();

            await expect(service.create(SEED_EMAIL_TEMPLATE_ID, { name: 'username' })).rejects.toThrow(
                ConflictException
            );
        });
    });

    describe('update()', () => {
        it('should update the variable successfully', async () => {
            const { service } = await setupTest();

            const result = await service.update(SEED_EMAIL_TEMPLATE_VARIABLE_ID, SEED_EMAIL_TEMPLATE_ID, {
                name: 'newName',
            });

            expect(result.name).toBe('newName');
        });

        it('should throw NotFoundException when variable does not exist', async () => {
            const { service } = await setupTest();

            await expect(service.update('ghost', SEED_EMAIL_TEMPLATE_ID, { name: 'x' })).rejects.toThrow(
                NotFoundException
            );
        });

        it('should throw ConflictException when renaming to a name already taken', async () => {
            const { service, emailTemplateVariableDb } = await setupTest();
            emailTemplateVariableDb.add('takenName', SEED_EMAIL_TEMPLATE_ID);

            await expect(
                service.update(SEED_EMAIL_TEMPLATE_VARIABLE_ID, SEED_EMAIL_TEMPLATE_ID, { name: 'takenName' })
            ).rejects.toThrow(ConflictException);
        });

        it('should not check for conflict when name is unchanged', async () => {
            const { service } = await setupTest();

            const result = await service.update(SEED_EMAIL_TEMPLATE_VARIABLE_ID, SEED_EMAIL_TEMPLATE_ID, {
                name: 'username',
            });

            expect(result.name).toBe('username');
        });
    });

    describe('delete()', () => {
        it('should delete an existing variable', async () => {
            const { service, emailTemplateVariableDb } = await setupTest();

            await service.delete(SEED_EMAIL_TEMPLATE_VARIABLE_ID);

            expect(emailTemplateVariableDb.getById(SEED_EMAIL_TEMPLATE_VARIABLE_ID)).toBeNull();
        });

        it('should throw NotFoundException when variable does not exist', async () => {
            const { service } = await setupTest();

            await expect(service.delete('ghost')).rejects.toThrow(NotFoundException);
        });
    });
});
