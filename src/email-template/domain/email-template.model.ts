import { EmailTemplateVariable } from '@/email-template-variable/domain';
import { SenderEmail } from '@/sender-email/domain';

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    content: string;
    senderId: string;
    sender?: SenderEmail;
    variables?: EmailTemplateVariable[];
    createdAt: Date;
    updatedAt: Date;
}
