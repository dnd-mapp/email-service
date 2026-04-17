import { MockSenderEmailDB } from '@/sender-email/test';

export class MockPrismaSenderEmailDB {
    constructor(private readonly db: MockSenderEmailDB) {}

    public async findMany(_params?: unknown) {
        return await Promise.resolve(this.db.getAll());
    }

    public async findUnique(params: {
        where: { id?: string; email?: string };
        select?: { id?: boolean };
    }) {
        const { where } = params;
        let record = null;

        if (where.id !== undefined) {
            record = this.db.getById(where.id);
        } else if (where.email !== undefined) {
            record = this.db.getByEmail(where.email);
        }

        if (!record) return await Promise.resolve(null);

        if (params.select?.id) {
            return await Promise.resolve({ id: record.id });
        }

        return await Promise.resolve(record);
    }

    public async create(params: { data: { name: string; email: string } }) {
        const record = this.db.add(params.data.name, params.data.email);
        return await Promise.resolve(record);
    }

    public async update(params: { where: { id: string }; data: { name?: string; email?: string } }) {
        const record = this.db.update(params.where.id, params.data);
        return await Promise.resolve(record!);
    }

    public async delete(params: { where: { id: string } }) {
        this.db.remove(params.where.id);
        return await Promise.resolve();
    }
}
