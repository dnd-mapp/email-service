import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EmailTemplateVariable } from './domain/email-template-variable.model';
import { EmailTemplateVariableController } from './email-template-variable.controller';
import { EmailTemplateVariableService } from './services';

describe('EmailTemplateVariableController', () => {
    const now = new Date();

    const mockVariable: EmailTemplateVariable = {
        id: 'var-1',
        name: 'username',
        templateId: 'tpl-1',
        createdAt: now,
        updatedAt: now,
    };

    const mockService = {
        findAllByTemplateId: vi.fn().mockResolvedValue([mockVariable]),
        findById: vi.fn().mockResolvedValue(mockVariable),
        create: vi.fn().mockResolvedValue(mockVariable),
        update: vi.fn().mockResolvedValue(mockVariable),
        delete: vi.fn().mockResolvedValue(undefined),
    };

    async function setupTest() {
        const module = await Test.createTestingModule({
            controllers: [EmailTemplateVariableController],
            providers: [{ provide: EmailTemplateVariableService, useValue: mockService }],
        }).compile();

        module.useLogger(false);
        await module.init();

        return { controller: module.get(EmailTemplateVariableController) };
    }

    beforeEach(() => {
        mockService.findAllByTemplateId.mockResolvedValue([mockVariable]);
        mockService.findById.mockResolvedValue(mockVariable);
        mockService.create.mockResolvedValue(mockVariable);
        mockService.update.mockResolvedValue(mockVariable);
        mockService.delete.mockResolvedValue(undefined);
    });

    it('should call findAllByTemplateId with the templateId', async () => {
        const { controller } = await setupTest();

        const result = await controller.findAll('tpl-1');

        expect(mockService.findAllByTemplateId).toHaveBeenCalledWith('tpl-1');
        expect(result).toEqual([mockVariable]);
    });

    it('should call findById with the variable id', async () => {
        const { controller } = await setupTest();

        const result = await controller.findById('var-1');

        expect(mockService.findById).toHaveBeenCalledWith('var-1');
        expect(result).toEqual(mockVariable);
    });

    it('should call delete with the variable id', async () => {
        const { controller } = await setupTest();

        await controller.delete('var-1');

        expect(mockService.delete).toHaveBeenCalledWith('var-1');
    });

    it('should throw NotFoundException when template does not exist', async () => {
        const { controller } = await setupTest();
        mockService.findAllByTemplateId.mockRejectedValueOnce(new NotFoundException('not found'));

        await expect(controller.findAll('ghost')).rejects.toThrow(NotFoundException);
    });
});
