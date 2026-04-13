export const EmailTemplates = {
    VERIFY_EMAIL: 'verify-email',
    WELCOME: 'welcome',
    REQUEST_CHANGE_EMAIL: 'request-change-email',
    NOTIFY_CHANGE_EMAIL_REQUEST: 'notify-change-email-request',
    REQUEST_CHANGE_PASSWORD: 'request-change-password',
    CONFIRM_PASSWORD_CHANGE: 'confirm-password-change',
    REQUEST_ACCOUNT_DELETION: 'request-account-deletion',
    CONFIRM_ACCOUNT_DELETION: 'confirm-account-deletion',
    INVITE_TO_CAMPAIGN: 'invite-to-campaign',
} as const;

export type EmailTemplate = (typeof EmailTemplates)[keyof typeof EmailTemplates];

export const emailSubjects: Record<EmailTemplate, string> = {
    [EmailTemplates.VERIFY_EMAIL]: 'Verify your email address',
    [EmailTemplates.WELCOME]: 'Welcome to D&D Mapp',
    [EmailTemplates.REQUEST_CHANGE_EMAIL]: 'Confirm your new email address',
    [EmailTemplates.NOTIFY_CHANGE_EMAIL_REQUEST]: 'Email address change requested',
    [EmailTemplates.REQUEST_CHANGE_PASSWORD]: 'Reset your password',
    [EmailTemplates.CONFIRM_PASSWORD_CHANGE]: 'Your password has been changed',
    [EmailTemplates.REQUEST_ACCOUNT_DELETION]: 'Confirm your account deletion request',
    [EmailTemplates.CONFIRM_ACCOUNT_DELETION]: 'Your D&D Mapp account has been deleted',
    [EmailTemplates.INVITE_TO_CAMPAIGN]: "You've been invited to a D&D Mapp campaign",
};
