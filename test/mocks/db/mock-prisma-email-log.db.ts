import { MockEmailLogDB } from '@/email/test';

export class MockPrismaEmailLogDB {
    constructor(private readonly db: MockEmailLogDB) {}

    public async create(params: { data: { to: string; status: string; errorMessage?: string } }) {
        const record = this.db.add(params.data.to, params.data.status, params.data.errorMessage);
        return await Promise.resolve(record);
    }
}
