import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SenderEmail } from '../domain/sender-email.model';
import { SenderEmailRepository } from '../sender-email.repository';
import { SenderEmailService } from './sender-email.service';

describe('SenderEmailService', () => {
    const now = new Date();

    const mockSender: SenderEmail = {
        id: 'sender-1',
        name: 'D&D Mapp',
        email: 'info@dndmapp.nl.eu.org',
        createdAt: now,
        updatedAt: now,
    };

    const mockRepository = {
        findAll: vi.fn().mockResolvedValue([mockSender]),
        findById: vi.fn().mockResolvedValue(mockSender),
        findByEmail: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(mockSender),
        update: vi.fn().mockResolvedValue(mockSender),
        deleteById: vi.fn().mockResolvedValue(undefined),
    };

    async function setupTest() {
        const module = await Test.createTestingModule({
            providers: [SenderEmailService, { provide: SenderEmailRepository, useValue: mockRepository }],
        }).compile();

        module.useLogger(false);
        await module.init();

        return { service: module.get(SenderEmailService) };
    }

    beforeEach(() => {
        mockRepository.findById.mockResolvedValue(mockSender);
        mockRepository.findByEmail.mockResolvedValue(null);
        mockRepository.create.mockResolvedValue(mockSender);
        mockRepository.update.mockResolvedValue(mockSender);
        mockRepository.deleteById.mockResolvedValue(undefined);
    });

    describe('findAll()', () => {
        it('should return all sender emails', async () => {
            const { service } = await setupTest();

            const result = await service.findAll();

            expect(result).toEqual([mockSender]);
        });
    });

    describe('findById()', () => {
        it('should return the sender when found', async () => {
            const { service } = await setupTest();

            const result = await service.findById('sender-1');

            expect(result).toEqual(mockSender);
        });

        it('should throw NotFoundException when sender does not exist', async () => {
            const { service } = await setupTest();
            mockRepository.findById.mockResolvedValueOnce(null);

            await expect(service.findById('unknown')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create()', () => {
        it('should create a sender and return it', async () => {
            const { service } = await setupTest();

            const result = await service.create({
                name: 'D&D Mapp',
                email: 'info@dndmapp.nl.eu.org',
            });

            expect(mockRepository.create).toHaveBeenCalledWith({
                name: 'D&D Mapp',
                email: 'info@dndmapp.nl.eu.org',
            });
            expect(result).toEqual(mockSender);
        });

        it('should throw ConflictException when the email address is already taken', async () => {
            const { service } = await setupTest();
            mockRepository.findByEmail.mockResolvedValueOnce(mockSender);

            await expect(service.create({ name: 'D&D Mapp', email: 'info@dndmapp.nl.eu.org' })).rejects.toThrow(
                ConflictException
            );
        });
    });

    describe('update()', () => {
        it('should update name/email', async () => {
            const { service } = await setupTest();

            await service.update('sender-1', { name: 'New Name' });

            expect(mockRepository.update).toHaveBeenCalledWith('sender-1', { name: 'New Name', email: undefined });
        });

        it('should throw ConflictException when updating to an email used by another sender', async () => {
            const { service } = await setupTest();
            mockRepository.findByEmail.mockResolvedValueOnce({ ...mockSender, id: 'sender-2' });

            await expect(service.update('sender-1', { email: 'info@dndmapp.nl.eu.org' })).rejects.toThrow(
                ConflictException
            );
        });

        it('should throw NotFoundException when the sender does not exist', async () => {
            const { service } = await setupTest();
            mockRepository.findById.mockResolvedValueOnce(null);

            await expect(service.update('unknown', { name: 'X' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete()', () => {
        it('should delete the sender', async () => {
            const { service } = await setupTest();

            await service.delete('sender-1');

            expect(mockRepository.deleteById).toHaveBeenCalledWith('sender-1');
        });

        it('should throw NotFoundException when the sender does not exist', async () => {
            const { service } = await setupTest();
            mockRepository.findById.mockResolvedValueOnce(null);

            await expect(service.delete('unknown')).rejects.toThrow(NotFoundException);
        });
    });
});
