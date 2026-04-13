import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EmailTemplate, EmailTemplates } from '../email-template.enum';
import { TemplateService } from './template.service';

describe('TemplateService', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            providers: [TemplateService],
        }).compile();

        module.useLogger(false);
        await module.init();

        return { service: module.get(TemplateService) };
    }

    describe('render()', () => {
        it('should render the verify-email template with the correct subject and variables', async () => {
            const { service } = await setupTest();

            const result = service.render(EmailTemplates.VERIFY_EMAIL, {
                username: 'Alice',
                verificationLink: 'https://example.com/verify/abc123',
            });

            expect(result.subject).toBe('Verify your email address');
            expect(result.html).toContain('Alice');
            expect(result.html).toContain('https://example.com/verify/abc123');
        });

        it('should render the welcome template with the correct subject and variables', async () => {
            const { service } = await setupTest();

            const result = service.render(EmailTemplates.WELCOME, { username: 'Bob' });

            expect(result.subject).toBe('Welcome to D&D Mapp');
            expect(result.html).toContain('Bob');
        });

        it('should render the request-change-email template with the correct subject and variables', async () => {
            const { service } = await setupTest();

            const result = service.render(EmailTemplates.REQUEST_CHANGE_EMAIL, {
                username: 'Carol',
                confirmationLink: 'https://example.com/confirm/xyz',
            });

            expect(result.subject).toBe('Confirm your new email address');
            expect(result.html).toContain('Carol');
            expect(result.html).toContain('https://example.com/confirm/xyz');
        });

        it('should render the notify-change-email-request template with the correct subject and variables', async () => {
            const { service } = await setupTest();

            const result = service.render(EmailTemplates.NOTIFY_CHANGE_EMAIL_REQUEST, { username: 'Dave' });

            expect(result.subject).toBe('Email address change requested');
            expect(result.html).toContain('Dave');
        });

        it('should render the request-change-password template with the correct subject and variables', async () => {
            const { service } = await setupTest();

            const result = service.render(EmailTemplates.REQUEST_CHANGE_PASSWORD, {
                username: 'Eve',
                resetLink: 'https://example.com/reset/token',
            });

            expect(result.subject).toBe('Reset your password');
            expect(result.html).toContain('Eve');
            expect(result.html).toContain('https://example.com/reset/token');
        });

        it('should render the confirm-password-change template with the correct subject and variables', async () => {
            const { service } = await setupTest();

            const result = service.render(EmailTemplates.CONFIRM_PASSWORD_CHANGE, { username: 'Frank' });

            expect(result.subject).toBe('Your password has been changed');
            expect(result.html).toContain('Frank');
        });

        it('should render the request-account-deletion template with the correct subject and variables', async () => {
            const { service } = await setupTest();

            const result = service.render(EmailTemplates.REQUEST_ACCOUNT_DELETION, {
                username: 'Grace',
                confirmationLink: 'https://example.com/delete/confirm',
            });

            expect(result.subject).toBe('Confirm your account deletion request');
            expect(result.html).toContain('Grace');
            expect(result.html).toContain('https://example.com/delete/confirm');
        });

        it('should render the confirm-account-deletion template with the correct subject and variables', async () => {
            const { service } = await setupTest();

            const result = service.render(EmailTemplates.CONFIRM_ACCOUNT_DELETION, { username: 'Hank' });

            expect(result.subject).toBe('Your D&D Mapp account has been deleted');
            expect(result.html).toContain('Hank');
        });

        it('should render the invite-to-campaign template with the correct subject and variables', async () => {
            const { service } = await setupTest();

            const result = service.render(EmailTemplates.INVITE_TO_CAMPAIGN, {
                inviterName: 'Ivan',
                campaignName: 'The Lost Mine',
                inviteLink: 'https://example.com/campaign/invite/token',
            });

            expect(result.subject).toBe("You've been invited to a D&D Mapp campaign");
            expect(result.html).toContain('Ivan');
            expect(result.html).toContain('The Lost Mine');
            expect(result.html).toContain('https://example.com/campaign/invite/token');
        });

        it('should render missing variables as empty strings', async () => {
            const { service } = await setupTest();

            const result = service.render(EmailTemplates.WELCOME, {});

            expect(result.html).not.toContain('{{username}}');
        });

        it('should throw InternalServerErrorException for an unknown template value', async () => {
            const { service } = await setupTest();

            expect(() => service.render('unknown-template' as unknown as EmailTemplate, {})).toThrow(
                InternalServerErrorException
            );
        });
    });
});
