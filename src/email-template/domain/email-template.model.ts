import { EmailTemplateVariable } from '../../email-template-variable/domain/email-template-variable.model';
import { SenderEmail } from '../../sender-email/domain/sender-email.model';

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
