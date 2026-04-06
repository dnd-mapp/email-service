import { MockClientDB } from '@/client/test';

interface ClientRow {
    id: string;
    name: string;
    allowedUris: { uri: string }[];
    createdAt: Date;
    updatedAt: Date;
}

function toRow(record: ReturnType<MockClientDB['getById']>): ClientRow | null {
    if (!record) return null;
    return {
        id: record.id,
        name: record.name,
        allowedUris: record.allowedUris.map((uri) => ({ uri })),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    };
}

export class MockPrismaClientDB {
    constructor(private readonly db: MockClientDB) {}

    public async findMany(_params?: unknown) {
        const all = this.db.getAll();
        return await Promise.resolve([...all].sort((a, b) => a.name.localeCompare(b.name)).map((r) => toRow(r)!));
    }

    public async findUnique(params: { where: { id?: string; name?: string } }) {
        const { where } = params;
        let result = null;

        if (where.id !== undefined) {
            result = this.db.getById(where.id);
        } else if (where.name !== undefined) {
            result = this.db.getByName(where.name);
        }
        return await Promise.resolve(toRow(result));
    }

    public async create(params: { data: { name: string; allowedUris?: { create?: { uri: string }[] } } }) {
        const uris = params.data.allowedUris?.create?.map((e) => e.uri) ?? [];
        return await Promise.resolve(toRow(this.db.add(params.data.name, uris))!);
    }

    public async update(params: {
        where: { id: string };
        data: { name: string; allowedUris?: { deleteMany?: unknown; create?: { uri: string }[] } };
    }) {
        const uris = params.data.allowedUris?.create?.map((e) => e.uri) ?? [];
        const result = this.db.update(params.where.id, params.data.name, uris);
        return await Promise.resolve(toRow(result)!);
    }

    public async delete(params: { where: { id: string } }) {
        this.db.remove(params.where.id);
        return await Promise.resolve();
    }
}
