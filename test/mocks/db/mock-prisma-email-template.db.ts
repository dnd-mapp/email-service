import { MockEmailTemplateVariableDB } from '@/email-template-variable/test';
import { MockEmailTemplateDB } from '@/email-template/test';
import { MockSenderEmailDB } from '@/sender-email/test';

interface EmailTemplatePayload {
    id: string;
    name: string;
    subject: string;
    content: string;
    senderId: string;
    sender?: { id: string; name: string; email: string; createdAt: Date; updatedAt: Date };
    variables?: { id: string; name: string; templateId: string; createdAt: Date; updatedAt: Date }[];
    createdAt: Date;
    updatedAt: Date;
}

export class MockPrismaEmailTemplateDB {
    constructor(
        private readonly db: MockEmailTemplateDB,
        private readonly senderEmailDb: MockSenderEmailDB,
        private readonly variableDb: MockEmailTemplateVariableDB
    ) {}

    private toPayload(
        record: { id: string; name: string; subject: string; content: string; senderId: string; createdAt: Date; updatedAt: Date },
        include?: { sender?: boolean; variables?: boolean }
    ): EmailTemplatePayload {
        const payload: EmailTemplatePayload = { ...record };

        if (include?.sender) {
            payload.sender = this.senderEmailDb.getById(record.senderId) ?? undefined;
        }
        if (include?.variables) {
            payload.variables = this.variableDb.getAllByTemplateId(record.id);
        }

        return payload;
    }

    public async findMany(params?: { include?: { sender?: boolean; variables?: boolean } }) {
        const records = this.db.getAll();
        return await Promise.resolve(records.map((r) => this.toPayload(r, params?.include)));
    }

    public async findUnique(params: {
        where: { id?: string; name?: string };
        include?: { sender?: boolean; variables?: boolean };
        select?: { id?: boolean };
    }) {
        const { where } = params;
        let record = null;

        if (where.id !== undefined) {
            record = this.db.getById(where.id);
        } else if (where.name !== undefined) {
            record = this.db.getByName(where.name);
        }

        if (!record) return await Promise.resolve(null);

        if (params.select?.id) {
            return await Promise.resolve({ id: record.id });
        }

        return await Promise.resolve(this.toPayload(record, params.include));
    }

    public async create(params: {
        data: { name: string; subject: string; content: string; senderId: string };
        include?: { sender?: boolean; variables?: boolean };
    }) {
        const { name, subject, content, senderId } = params.data;
        const record = this.db.add(name, subject, content, senderId);
        return await Promise.resolve(this.toPayload(record, params.include));
    }

    public async update(params: {
        where: { id: string };
        data: { name?: string; subject?: string; content?: string; senderId?: string };
        include?: { sender?: boolean; variables?: boolean };
    }) {
        const record = this.db.update(params.where.id, params.data);
        return await Promise.resolve(this.toPayload(record!, params.include));
    }

    public async delete(params: { where: { id: string } }) {
        this.db.remove(params.where.id);
        return await Promise.resolve();
    }
}
