import { MockResendService, MockTemplateService } from '@/test';
import { BadRequestException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EmailTemplateService } from '../../email-template/services';
import { SenderEmail } from '../../sender-email/domain/sender-email.model';
import { EmailLogStatuses } from '../email-log-statuses.enum';
import { EmailRepository } from '../email.repository';
import { EmailService } from './email.service';
import { ResendService } from './resend.service';
import { TemplateService } from './template.service';

describe('EmailService', () => {
    const mockLog = vi.fn().mockResolvedValue(undefined);
    const mockEmailRepository = { log: mockLog };

    const mockSender: SenderEmail = {
        id: 'sender-1',
        name: 'D&D Mapp',
        email: 'info@dndmapp.nl.eu.org',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockTemplate = {
        id: 'tpl-1',
        name: 'welcome',
        subject: 'Welcome to D&D Mapp',
        content: '<p>Hello {{username}}</p>',
        senderId: 'sender-1',
        sender: mockSender,
        variables: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockEmailTemplateService = {
        findByName: vi.fn().mockResolvedValue(mockTemplate),
    };

    async function setupTest() {
        const resendService = new MockResendService();
        const templateService = new MockTemplateService();

        const module = await Test.createTestingModule({
            providers: [
                EmailService,
                { provide: EmailRepository, useValue: mockEmailRepository },
                { provide: ResendService, useValue: resendService },
                { provide: TemplateService, useValue: templateService },
                { provide: EmailTemplateService, useValue: mockEmailTemplateService },
            ],
        }).compile();

        module.useLogger(false);
        await module.init();

        return { service: module.get(EmailService), resendService, templateService };
    }

    beforeEach(() => {
        mockEmailTemplateService.findByName.mockResolvedValue(mockTemplate);
        mockLog.mockResolvedValue(undefined);
    });

    it('should look up the template, render it, send the email, and log SUCCESS', async () => {
        const { service, resendService, templateService } = await setupTest();

        await service.sendEmail('user@example.com', 'welcome', { username: 'Alice' });

        expect(mockEmailTemplateService.findByName).toHaveBeenCalledWith('welcome');
        expect(templateService.render).toHaveBeenCalledWith('<p>Hello {{username}}</p>', { username: 'Alice' });
        expect(resendService.send).toHaveBeenCalledWith(
            'user@example.com',
            'Welcome to D&D Mapp',
            '<p>Mock HTML</p>',
            mockSender,
        );
        expect(mockLog).toHaveBeenCalledWith('user@example.com', EmailLogStatuses.SUCCESS);
    });

    it('should log FAILURE and throw ServiceUnavailableException when Resend fails', async () => {
        const { service, resendService } = await setupTest();
        resendService.send.mockRejectedValueOnce(new Error('API error'));

        await expect(service.sendEmail('user@example.com', 'welcome', {})).rejects.toThrow(
            ServiceUnavailableException,
        );

        expect(mockLog).toHaveBeenCalledWith('user@example.com', EmailLogStatuses.FAILURE, 'API error');
    });

    it('should throw NotFoundException when the template does not exist', async () => {
        const { service } = await setupTest();
        mockEmailTemplateService.findByName.mockRejectedValueOnce(new NotFoundException('not found'));

        await expect(service.sendEmail('user@example.com', 'no-such-template', {})).rejects.toThrow(
            NotFoundException,
        );
    });

    it('should throw ServiceUnavailableException when the template has no sender', async () => {
        const { service } = await setupTest();
        mockEmailTemplateService.findByName.mockResolvedValueOnce({ ...mockTemplate, sender: undefined });

        await expect(service.sendEmail('user@example.com', 'welcome', {})).rejects.toThrow(
            ServiceUnavailableException,
        );
    });

    it('should throw BadRequestException when required template variables are missing', async () => {
        const { service } = await setupTest();
        mockEmailTemplateService.findByName.mockResolvedValueOnce({
            ...mockTemplate,
            variables: [
                { id: 'v-1', name: 'username', templateId: 'tpl-1', createdAt: new Date(), updatedAt: new Date() },
                { id: 'v-2', name: 'verificationLink', templateId: 'tpl-1', createdAt: new Date(), updatedAt: new Date() },
            ],
        });

        await expect(service.sendEmail('user@example.com', 'welcome', { username: 'Alice' })).rejects.toThrow(
            BadRequestException,
        );
    });

    it('should include the missing variable names in the BadRequestException message', async () => {
        const { service } = await setupTest();
        mockEmailTemplateService.findByName.mockResolvedValueOnce({
            ...mockTemplate,
            variables: [
                { id: 'v-1', name: 'username', templateId: 'tpl-1', createdAt: new Date(), updatedAt: new Date() },
                { id: 'v-2', name: 'verificationLink', templateId: 'tpl-1', createdAt: new Date(), updatedAt: new Date() },
            ],
        });

        await expect(service.sendEmail('user@example.com', 'welcome', {})).rejects.toThrow(
            'Missing required template variables: username, verificationLink',
        );
    });

    it('should not throw BadRequestException when all required variables are provided', async () => {
        const { service } = await setupTest();
        mockEmailTemplateService.findByName.mockResolvedValueOnce({
            ...mockTemplate,
            variables: [
                { id: 'v-1', name: 'username', templateId: 'tpl-1', createdAt: new Date(), updatedAt: new Date() },
            ],
        });

        await expect(
            service.sendEmail('user@example.com', 'welcome', { username: 'Alice' })
        ).resolves.not.toThrow();
    });
});
