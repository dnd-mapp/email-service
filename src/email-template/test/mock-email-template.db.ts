import { nanoid } from 'nanoid';
import { SEED_SENDER_EMAIL_ID } from '../../sender-email/test';

interface EmailTemplateRecord {
    id: string;
    name: string;
    subject: string;
    content: string;
    senderId: string;
    createdAt: Date;
    updatedAt: Date;
}

const SEED_DATE = new Date('2024-01-01T00:00:00.000Z');

export const SEED_EMAIL_TEMPLATE_ID = 'x7Mq3tPLn8Yw6rBvZ5DcE';

export const seedEmailTemplate: EmailTemplateRecord = {
    id: SEED_EMAIL_TEMPLATE_ID,
    name: 'welcome',
    subject: 'Welcome to D&D Mapp',
    content: '<p>Hello {{username}}</p>',
    senderId: SEED_SENDER_EMAIL_ID,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
};

export class MockEmailTemplateDB {
    private records: Record<string, EmailTemplateRecord>;

    constructor() {
        this.records = { [seedEmailTemplate.id]: { ...seedEmailTemplate } };
    }

    public getAll(): EmailTemplateRecord[] {
        return Object.values(this.records);
    }

    public getById(id: string): EmailTemplateRecord | null {
        return this.records[id] ?? null;
    }

    public getByName(name: string): EmailTemplateRecord | null {
        return Object.values(this.records).find((r) => r.name === name) ?? null;
    }

    public add(name: string, subject: string, content: string, senderId: string): EmailTemplateRecord {
        const now = new Date();
        const record: EmailTemplateRecord = {
            id: nanoid(),
            name,
            subject,
            content,
            senderId,
            createdAt: now,
            updatedAt: now,
        };

        this.records[record.id] = record;
        return record;
    }

    public update(
        id: string,
        data: { name?: string; subject?: string; content?: string; senderId?: string }
    ): EmailTemplateRecord | null {
        const record = this.records[id];

        if (!record) return null;

        if (data.name !== undefined) record.name = data.name;
        if (data.subject !== undefined) record.subject = data.subject;
        if (data.content !== undefined) record.content = data.content;
        if (data.senderId !== undefined) record.senderId = data.senderId;
        record.updatedAt = new Date();

        return record;
    }

    public remove(id: string): void {
        delete this.records[id];
    }
}
