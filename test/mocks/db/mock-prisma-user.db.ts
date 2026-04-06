import { MockUserDB, MockUserRoleDB } from '@/user/test';

interface UserPayload {
    id: string;
    username: string;
    email: string;
    password: string;
    roles: { userId: string; roleId: string; role: { id: string; name: string; createdAt: Date; updatedAt: Date } }[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export class MockPrismaUserDB {
    constructor(
        private readonly db: MockUserDB,
        private readonly userRoleDb: MockUserRoleDB
    ) {}

    private toPayload(record: {
        id: string;
        username: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }): UserPayload {
        return { ...record, roles: [] };
    }

    public async findMany(params?: {
        where?: {
            deletedAt?: null;
            roles?: { some?: { roleId?: string } };
        };
    }) {
        let users = this.db.getAll();

        if (params?.where?.deletedAt === null) {
            users = users.filter((u) => u.deletedAt === null);
        }
        const roleId = params?.where?.roles?.some?.roleId;

        if (roleId !== undefined) {
            const userIds = new Set(this.userRoleDb.getForRole(roleId).map((r) => r.userId));
            users = users.filter((u) => userIds.has(u.id));
        }
        return await Promise.resolve(users.map((u) => this.toPayload(u)));
    }

    public async findUnique(params: { where: { id?: string; username?: string; email?: string; deletedAt?: null } }) {
        const { where } = params;
        let record = null;

        if (where.id !== undefined) {
            record = this.db.getById(where.id);

            if (record && where.deletedAt === null && record.deletedAt !== null) {
                record = null;
            }
        } else if (where.username !== undefined) {
            record = this.db.getByUsername(where.username);
        } else if (where.email !== undefined) {
            record = this.db.getByEmail(where.email);
        }
        return await Promise.resolve(record ? this.toPayload(record) : null);
    }

    public async create(params: { data: { username: string; email: string; password: string; roles?: unknown } }) {
        const record = this.db.add(params.data.username, params.data.email, params.data.password);
        return await Promise.resolve(this.toPayload(record));
    }

    public async update(params: { where: { id: string }; data: { username?: string; deletedAt?: Date } }) {
        const { where, data } = params;

        if (data.deletedAt !== undefined) {
            this.db.softDelete(where.id);
        } else if (data.username !== undefined) {
            this.db.update(where.id, data.username);
        }
        const record = this.db.getById(where.id);

        return await Promise.resolve(record ? this.toPayload(record) : null);
    }

    public async delete(params: { where: { id: string } }) {
        this.db.purge(params.where.id);
        return await Promise.resolve();
    }
}
