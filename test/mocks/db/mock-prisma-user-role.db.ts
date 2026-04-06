import { MockRoleDB } from '@/role/test';
import { MockUserRoleDB } from '@/user/test';

export class MockPrismaUserRoleDB {
    constructor(
        private readonly db: MockUserRoleDB,
        private readonly roleDb: MockRoleDB
    ) {}

    public async findUnique(params: { where: { userId_roleId: { userId: string; roleId: string } } }) {
        const { userId, roleId } = params.where.userId_roleId;
        const record = this.db.getByComposite(userId, roleId);

        if (!record) return await Promise.resolve(null);
        const role = this.roleDb.getById(roleId);

        return await Promise.resolve(role ? { userId, roleId, role } : null);
    }

    public async findMany(params: { where?: { userId?: string; roleId?: { in?: string[] } } }) {
        const userId = params?.where?.userId;
        const roleIdIn = params?.where?.roleId?.in;
        let records = userId ? this.db.getForUser(userId) : [];

        if (roleIdIn) {
            records = records.filter((r) => roleIdIn.includes(r.roleId));
        }

        const result = records
            .map((r) => {
                const role = this.roleDb.getById(r.roleId);
                return role ? { userId: r.userId, roleId: r.roleId, role } : null;
            })
            .filter(Boolean);

        return await Promise.resolve(result);
    }

    public async createMany(params: { data: { userId: string; roleId: string }[]; skipDuplicates?: boolean }) {
        let count = 0;

        for (const { userId, roleId } of params.data) {
            if (params.skipDuplicates && this.db.getByComposite(userId, roleId)) continue;
            this.db.add(userId, roleId);
            count++;
        }
        return await Promise.resolve({ count });
    }

    public async create(params: { data: { userId: string; roleId: string } }) {
        const { userId, roleId } = params.data;

        this.db.add(userId, roleId);

        const role = this.roleDb.getById(roleId);
        return await Promise.resolve({ userId, roleId, role: role! });
    }

    public async delete(params: { where: { userId_roleId: { userId: string; roleId: string } } }) {
        const { userId, roleId } = params.where.userId_roleId;

        this.db.remove(userId, roleId);
        return await Promise.resolve({ userId, roleId });
    }

    public async deleteMany(params: { where: { userId: string; roleId: { in: string[] } } }) {
        const {
            userId,
            roleId: { in: roleIds },
        } = params.where;
        let count = 0;

        for (const roleId of roleIds) {
            if (this.db.getByComposite(userId, roleId)) {
                this.db.remove(userId, roleId);
                count++;
            }
        }
        return await Promise.resolve({ count });
    }
}
