import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SenderEmail } from '../../sender-email/domain/sender-email.model';
import { EmailTemplate } from '../domain/email-template.model';
import { EmailTemplateRepository } from '../email-template.repository';
import { EmailTemplateService } from './email-template.service';

describe('EmailTemplateService', () => {
    const now = new Date();

    const mockSender: SenderEmail = {
        id: 'sender-1',
        name: 'D&D Mapp',
        email: 'info@dndmapp.nl.eu.org',
        createdAt: now,
        updatedAt: now,
    };

    const mockTemplate: EmailTemplate = {
        id: 'tpl-1',
        name: 'welcome',
        subject: 'Welcome to D&D Mapp',
        content: '<p>Hello {{username}}</p>',
        senderId: 'sender-1',
        sender: mockSender,
        createdAt: now,
        updatedAt: now,
    };

    const mockRepository = {
        findAll: vi.fn().mockResolvedValue([mockTemplate]),
        findById: vi.fn().mockResolvedValue(mockTemplate),
        findByName: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(mockTemplate),
        update: vi.fn().mockResolvedValue(mockTemplate),
        deleteById: vi.fn().mockResolvedValue(undefined),
        senderExists: vi.fn().mockResolvedValue(true),
    };

    async function setupTest() {
        const module = await Test.createTestingModule({
            providers: [EmailTemplateService, { provide: EmailTemplateRepository, useValue: mockRepository }],
        }).compile();

        module.useLogger(false);
        await module.init();

        return { service: module.get(EmailTemplateService) };
    }

    beforeEach(() => {
        mockRepository.findById.mockResolvedValue(mockTemplate);
        mockRepository.findByName.mockResolvedValue(null);
        mockRepository.create.mockResolvedValue(mockTemplate);
        mockRepository.update.mockResolvedValue(mockTemplate);
        mockRepository.deleteById.mockResolvedValue(undefined);
        mockRepository.senderExists.mockResolvedValue(true);
    });

    describe('findByName()', () => {
        it('should return the template when found', async () => {
            const { service } = await setupTest();
            mockRepository.findByName.mockResolvedValueOnce(mockTemplate);

            const result = await service.findByName('welcome');

            expect(result).toEqual(mockTemplate);
        });

        it('should throw NotFoundException when the template does not exist', async () => {
            const { service } = await setupTest();
            mockRepository.findByName.mockResolvedValueOnce(null);

            await expect(service.findByName('no-such-template')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create()', () => {
        it('should create a template when name is unique and sender exists', async () => {
            const { service } = await setupTest();

            const result = await service.create({
                name: 'welcome',
                subject: 'Welcome',
                content: '<p>Hi</p>',
                senderId: 'sender-1',
            });

            expect(mockRepository.create).toHaveBeenCalledWith({
                name: 'welcome',
                subject: 'Welcome',
                content: '<p>Hi</p>',
                senderId: 'sender-1',
            });
            expect(result).toEqual(mockTemplate);
        });

        it('should throw ConflictException when the template name is already taken', async () => {
            const { service } = await setupTest();
            mockRepository.findByName.mockResolvedValueOnce(mockTemplate);

            await expect(
                service.create({ name: 'welcome', subject: 'S', content: 'C', senderId: 'sender-1' })
            ).rejects.toThrow(ConflictException);
        });

        it('should throw NotFoundException when the senderId does not exist', async () => {
            const { service } = await setupTest();
            mockRepository.senderExists.mockResolvedValueOnce(false);

            await expect(
                service.create({ name: 'new-tpl', subject: 'S', content: 'C', senderId: 'ghost' })
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('update()', () => {
        it('should update the template successfully', async () => {
            const { service } = await setupTest();

            const result = await service.update('tpl-1', { subject: 'New Subject' });

            expect(mockRepository.update).toHaveBeenCalledWith('tpl-1', {
                name: undefined,
                subject: 'New Subject',
                content: undefined,
                senderId: undefined,
            });
            expect(result).toEqual(mockTemplate);
        });

        it('should throw NotFoundException when template does not exist', async () => {
            const { service } = await setupTest();
            mockRepository.findById.mockResolvedValueOnce(null);

            await expect(service.update('ghost', { subject: 'X' })).rejects.toThrow(NotFoundException);
        });

        it('should throw ConflictException when updating to a name already taken by another template', async () => {
            const { service } = await setupTest();
            mockRepository.findByName.mockResolvedValueOnce({ ...mockTemplate, id: 'tpl-2' });

            await expect(service.update('tpl-1', { name: 'welcome' })).rejects.toThrow(ConflictException);
        });

        it('should throw NotFoundException when updating to a non-existent senderId', async () => {
            const { service } = await setupTest();
            mockRepository.senderExists.mockResolvedValueOnce(false);

            await expect(service.update('tpl-1', { senderId: 'ghost' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete()', () => {
        it('should delete an existing template', async () => {
            const { service } = await setupTest();

            await service.delete('tpl-1');

            expect(mockRepository.deleteById).toHaveBeenCalledWith('tpl-1');
        });

        it('should throw NotFoundException when template does not exist', async () => {
            const { service } = await setupTest();
            mockRepository.findById.mockResolvedValueOnce(null);

            await expect(service.delete('ghost')).rejects.toThrow(NotFoundException);
        });
    });
});
