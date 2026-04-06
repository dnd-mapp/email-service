import { MockPermissionDB } from '@/permission/test';
import { MockRolePermissionDB } from '@/role/test';

export class MockPrismaRolePermissionDB {
    constructor(
        private readonly db: MockRolePermissionDB,
        private readonly permissionDb: MockPermissionDB
    ) {}

    public async findUnique(params: { where: { roleId_permissionId: { roleId: string; permissionId: string } } }) {
        const { roleId, permissionId } = params.where.roleId_permissionId;
        const record = this.db.getByComposite(roleId, permissionId);

        if (!record) return await Promise.resolve(null);
        const permission = this.permissionDb.getById(permissionId);

        return await Promise.resolve(permission ? { roleId, permissionId, permission } : null);
    }

    public async findMany(params: { where?: { roleId?: string; permissionId?: { in?: string[] } } }) {
        const roleId = params?.where?.roleId;
        const permissionIdIn = params?.where?.permissionId?.in;
        let records = roleId ? this.db.getForRole(roleId) : [];

        if (permissionIdIn) {
            records = records.filter((r) => permissionIdIn.includes(r.permissionId));
        }

        const result = records
            .map((r) => {
                const permission = this.permissionDb.getById(r.permissionId);
                return permission ? { roleId: r.roleId, permissionId: r.permissionId, permission } : null;
            })
            .filter(Boolean);

        return await Promise.resolve(result);
    }

    public async createMany(params: { data: { roleId: string; permissionId: string }[]; skipDuplicates?: boolean }) {
        let count = 0;

        for (const { roleId, permissionId } of params.data) {
            if (params.skipDuplicates && this.db.getByComposite(roleId, permissionId)) continue;
            this.db.add(roleId, permissionId);
            count++;
        }
        return await Promise.resolve({ count });
    }

    public async create(params: { data: { roleId: string; permissionId: string } }) {
        const { roleId, permissionId } = params.data;

        this.db.add(roleId, permissionId);

        const permission = this.permissionDb.getById(permissionId);
        return await Promise.resolve({ roleId, permissionId, permission: permission! });
    }

    public async delete(params: { where: { roleId_permissionId: { roleId: string; permissionId: string } } }) {
        const { roleId, permissionId } = params.where.roleId_permissionId;

        this.db.remove(roleId, permissionId);
        return await Promise.resolve({ roleId, permissionId });
    }

    public async deleteMany(params: { where: { roleId: string; permissionId: { in: string[] } } }) {
        const {
            roleId,
            permissionId: { in: permissionIds },
        } = params.where;
        let count = 0;

        for (const permissionId of permissionIds) {
            if (this.db.getByComposite(roleId, permissionId)) {
                this.db.remove(roleId, permissionId);
                count++;
            }
        }
        return await Promise.resolve({ count });
    }
}
