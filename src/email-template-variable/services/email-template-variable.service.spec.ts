import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EmailTemplateVariable } from '../domain/email-template-variable.model';
import { EmailTemplateVariableRepository } from '../email-template-variable.repository';
import { EmailTemplateVariableService } from './email-template-variable.service';

describe('EmailTemplateVariableService', () => {
    const now = new Date();

    const mockVariable: EmailTemplateVariable = {
        id: 'var-1',
        name: 'username',
        templateId: 'tpl-1',
        createdAt: now,
        updatedAt: now,
    };

    const mockRepository = {
        findAllByTemplateId: vi.fn().mockResolvedValue([mockVariable]),
        findById: vi.fn().mockResolvedValue(mockVariable),
        findByNameAndTemplateId: vi.fn().mockResolvedValue(null),
        templateExists: vi.fn().mockResolvedValue(true),
        create: vi.fn().mockResolvedValue(mockVariable),
        update: vi.fn().mockResolvedValue(mockVariable),
        deleteById: vi.fn().mockResolvedValue(undefined),
    };

    async function setupTest() {
        const module = await Test.createTestingModule({
            providers: [
                EmailTemplateVariableService,
                { provide: EmailTemplateVariableRepository, useValue: mockRepository },
            ],
        }).compile();

        module.useLogger(false);
        await module.init();

        return { service: module.get(EmailTemplateVariableService) };
    }

    beforeEach(() => {
        mockRepository.findAllByTemplateId.mockResolvedValue([mockVariable]);
        mockRepository.findById.mockResolvedValue(mockVariable);
        mockRepository.findByNameAndTemplateId.mockResolvedValue(null);
        mockRepository.templateExists.mockResolvedValue(true);
        mockRepository.create.mockResolvedValue(mockVariable);
        mockRepository.update.mockResolvedValue(mockVariable);
        mockRepository.deleteById.mockResolvedValue(undefined);
    });

    describe('findAllByTemplateId()', () => {
        it('should return all variables for an existing template', async () => {
            const { service } = await setupTest();

            const result = await service.findAllByTemplateId('tpl-1');

            expect(result).toEqual([mockVariable]);
        });

        it('should throw NotFoundException when template does not exist', async () => {
            const { service } = await setupTest();
            mockRepository.templateExists.mockResolvedValueOnce(false);

            await expect(service.findAllByTemplateId('ghost')).rejects.toThrow(NotFoundException);
        });
    });

    describe('findById()', () => {
        it('should return the variable when found', async () => {
            const { service } = await setupTest();

            const result = await service.findById('var-1');

            expect(result).toEqual(mockVariable);
        });

        it('should throw NotFoundException when not found', async () => {
            const { service } = await setupTest();
            mockRepository.findById.mockResolvedValueOnce(null);

            await expect(service.findById('ghost')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create()', () => {
        it('should create a variable when name is unique and template exists', async () => {
            const { service } = await setupTest();

            const result = await service.create('tpl-1', { name: 'username' });

            expect(mockRepository.create).toHaveBeenCalledWith({ name: 'username', templateId: 'tpl-1' });
            expect(result).toEqual(mockVariable);
        });

        it('should throw NotFoundException when template does not exist', async () => {
            const { service } = await setupTest();
            mockRepository.templateExists.mockResolvedValueOnce(false);

            await expect(service.create('ghost', { name: 'username' })).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException when variable name already exists for template', async () => {
            const { service } = await setupTest();
            mockRepository.findByNameAndTemplateId.mockResolvedValueOnce(mockVariable);

            await expect(service.create('tpl-1', { name: 'username' })).rejects.toThrow(ConflictException);
        });
    });

    describe('update()', () => {
        it('should update the variable successfully', async () => {
            const { service } = await setupTest();

            const result = await service.update('var-1', 'tpl-1', { name: 'newName' });

            expect(mockRepository.update).toHaveBeenCalledWith('var-1', { name: 'newName' });
            expect(result).toEqual(mockVariable);
        });

        it('should throw NotFoundException when variable does not exist', async () => {
            const { service } = await setupTest();
            mockRepository.findById.mockResolvedValueOnce(null);

            await expect(service.update('ghost', 'tpl-1', { name: 'x' })).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException when renaming to a name already taken', async () => {
            const { service } = await setupTest();
            mockRepository.findByNameAndTemplateId.mockResolvedValueOnce({ ...mockVariable, id: 'var-2' });

            await expect(service.update('var-1', 'tpl-1', { name: 'takenName' })).rejects.toThrow(ConflictException);
        });

        it('should not check for conflict when name is unchanged', async () => {
            const { service } = await setupTest();

            await service.update('var-1', 'tpl-1', { name: 'username' });

            expect(mockRepository.findByNameAndTemplateId).not.toHaveBeenCalled();
        });
    });

    describe('delete()', () => {
        it('should delete an existing variable', async () => {
            const { service } = await setupTest();

            await service.delete('var-1');

            expect(mockRepository.deleteById).toHaveBeenCalledWith('var-1');
        });

        it('should throw NotFoundException when variable does not exist', async () => {
            const { service } = await setupTest();
            mockRepository.findById.mockResolvedValueOnce(null);

            await expect(service.delete('ghost')).rejects.toThrow(NotFoundException);
        });
    });
});
