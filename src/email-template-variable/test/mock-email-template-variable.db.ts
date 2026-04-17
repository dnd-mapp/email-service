import { nanoid } from 'nanoid';
import { SEED_EMAIL_TEMPLATE_ID } from '../../email-template/test';

interface EmailTemplateVariableRecord {
    id: string;
    name: string;
    templateId: string;
    createdAt: Date;
    updatedAt: Date;
}

const SEED_DATE = new Date('2024-01-01T00:00:00.000Z');

export const SEED_EMAIL_TEMPLATE_VARIABLE_ID = 'p2HjYnKoXwDm4sAqG9FcR';

export const seedEmailTemplateVariable: EmailTemplateVariableRecord = {
    id: SEED_EMAIL_TEMPLATE_VARIABLE_ID,
    name: 'username',
    templateId: SEED_EMAIL_TEMPLATE_ID,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
};

export class MockEmailTemplateVariableDB {
    private records: EmailTemplateVariableRecord[];

    constructor() {
        this.records = [{ ...seedEmailTemplateVariable }];
    }

    public getAll(): EmailTemplateVariableRecord[] {
        return [...this.records];
    }

    public getAllByTemplateId(templateId: string): EmailTemplateVariableRecord[] {
        return this.records.filter((r) => r.templateId === templateId);
    }

    public getById(id: string): EmailTemplateVariableRecord | null {
        return this.records.find((r) => r.id === id) ?? null;
    }

    public getByNameAndTemplateId(name: string, templateId: string): EmailTemplateVariableRecord | null {
        return this.records.find((r) => r.name === name && r.templateId === templateId) ?? null;
    }

    public add(name: string, templateId: string): EmailTemplateVariableRecord {
        const now = new Date();
        const record: EmailTemplateVariableRecord = { id: nanoid(), name, templateId, createdAt: now, updatedAt: now };

        this.records.push(record);
        return record;
    }

    public update(id: string, data: { name?: string }): EmailTemplateVariableRecord | null {
        const record = this.records.find((r) => r.id === id);

        if (!record) return null;

        if (data.name !== undefined) record.name = data.name;
        record.updatedAt = new Date();

        return record;
    }

    public remove(id: string): void {
        this.records = this.records.filter((r) => r.id !== id);
    }
}
