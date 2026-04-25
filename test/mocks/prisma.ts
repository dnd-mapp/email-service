import { MockEmailTemplateVariableDB } from '@/email-template-variable/test';
import { MockEmailTemplateDB } from '@/email-template/test';
import { MockEmailLogDB } from '@/email/test';
import { MockSenderEmailDB } from '@/sender-email/test';
import { PrismaLikeClient } from '@dnd-mapp/shared-backend';
import { MockPrismaEmailLogDB } from './db/mock-prisma-email-log.db';
import { MockPrismaEmailTemplateVariableDB } from './db/mock-prisma-email-template-variable.db';
import { MockPrismaEmailTemplateDB } from './db/mock-prisma-email-template.db';
import { MockPrismaSenderEmailDB } from './db/mock-prisma-sender-email.db';

export class MockPrisma implements PrismaLikeClient {
    public connected = false;
    public options: Record<string, unknown>;

    public readonly senderEmailDb = new MockSenderEmailDB();
    public readonly emailTemplateDb = new MockEmailTemplateDB();
    public readonly emailTemplateVariableDb = new MockEmailTemplateVariableDB();
    public readonly emailLogDb = new MockEmailLogDB();

    public senderEmail = new MockPrismaSenderEmailDB(this.senderEmailDb);
    public emailTemplate = new MockPrismaEmailTemplateDB(
        this.emailTemplateDb,
        this.senderEmailDb,
        this.emailTemplateVariableDb
    );
    public emailTemplateVariable = new MockPrismaEmailTemplateVariableDB(this.emailTemplateVariableDb);
    public emailLog = new MockPrismaEmailLogDB(this.emailLogDb);

    constructor(options: Record<string, unknown>) {
        this.options = options;
    }

    public async $connect() {
        await Promise.resolve();
        this.connected = true;
    }

    public async $disconnect() {
        await Promise.resolve();
        this.connected = false;
    }

    public async $runCommandRaw(_command: unknown) {
        return await Promise.resolve();
    }
}
