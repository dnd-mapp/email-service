import { nanoid } from 'nanoid';

interface SenderEmailRecord {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const SEED_DATE = new Date('2024-01-01T00:00:00.000Z');

export const SEED_SENDER_EMAIL_ID = 'kfQz9tCdPAFt_VKK8SIxo';
export const SEED_SENDER_EMAIL_ADDRESS = 'info@dndmapp.nl.eu.org';

export const seedSenderEmail: SenderEmailRecord = {
    id: SEED_SENDER_EMAIL_ID,
    name: 'D&D Mapp',
    email: SEED_SENDER_EMAIL_ADDRESS,
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
};

export class MockSenderEmailDB {
    private records: Record<string, SenderEmailRecord>;

    constructor() {
        this.records = { [seedSenderEmail.id]: { ...seedSenderEmail } };
    }

    public getAll(): SenderEmailRecord[] {
        return Object.values(this.records);
    }

    public getById(id: string): SenderEmailRecord | null {
        return this.records[id] ?? null;
    }

    public getByEmail(email: string): SenderEmailRecord | null {
        return Object.values(this.records).find((r) => r.email === email) ?? null;
    }

    public add(name: string, email: string): SenderEmailRecord {
        const now = new Date();
        const record: SenderEmailRecord = { id: nanoid(), name, email, createdAt: now, updatedAt: now };

        this.records[record.id] = record;
        return record;
    }

    public update(id: string, data: { name?: string; email?: string }): SenderEmailRecord | null {
        const record = this.records[id];

        if (!record) return null;

        if (data.name !== undefined) record.name = data.name;
        if (data.email !== undefined) record.email = data.email;
        record.updatedAt = new Date();

        return record;
    }

    public remove(id: string): void {
        delete this.records[id];
    }
}
