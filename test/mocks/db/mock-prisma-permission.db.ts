import { MockPermissionDB } from '@/permission/test';

export class MockPrismaPermissionDB {
    constructor(private readonly db: MockPermissionDB) {}

    public async findMany(_params?: unknown) {
        const all = this.db.getAll();
        return await Promise.resolve([...all].sort((a, b) => a.name.localeCompare(b.name)));
    }

    public async findUnique(params: { where: { id?: string; name?: string } }) {
        const { where } = params;
        let result = null;

        if (where.id !== undefined) {
            result = this.db.getById(where.id);
        } else if (where.name !== undefined) {
            result = this.db.getByName(where.name);
        }
        return await Promise.resolve(result);
    }

    public async create(params: { data: { name: string } }) {
        return await Promise.resolve(this.db.add(params.data.name));
    }

    public async update(params: { where: { id: string }; data: { name: string } }) {
        const result = this.db.update(params.where.id, params.data.name);
        return await Promise.resolve(result!);
    }

    public async delete(params: { where: { id: string } }) {
        this.db.remove(params.where.id);
        return await Promise.resolve();
    }
}
