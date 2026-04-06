import { MockClientDB } from '@/client/test';
import { PrismaLikeClient } from '@/common';
import { MockPermissionDB } from '@/permission/test';
import { MockRoleDB, MockRolePermissionDB } from '@/role/test';
import { MockUserDB, MockUserRoleDB } from '@/user/test';
import { MockPrismaClientDB } from './db/mock-prisma-client.db';
import { MockPrismaPermissionDB } from './db/mock-prisma-permission.db';
import { MockPrismaRolePermissionDB } from './db/mock-prisma-role-permission.db';
import { MockPrismaRoleDB } from './db/mock-prisma-role.db';
import { MockPrismaUserRoleDB } from './db/mock-prisma-user-role.db';
import { MockPrismaUserDB } from './db/mock-prisma-user.db';

export class MockPrisma implements PrismaLikeClient {
    public connected = false;
    public options: Record<string, unknown>;

    public readonly clientDb = new MockClientDB();
    public readonly permissionDb = new MockPermissionDB();
    public readonly roleDb = new MockRoleDB();
    public readonly rolePermissionDb = new MockRolePermissionDB();
    public readonly userRoleDb = new MockUserRoleDB();
    public readonly userDb = new MockUserDB();

    public client = new MockPrismaClientDB(this.clientDb);
    public permission = new MockPrismaPermissionDB(this.permissionDb);
    public role = new MockPrismaRoleDB(this.roleDb);
    public rolePermission = new MockPrismaRolePermissionDB(this.rolePermissionDb, this.permissionDb);
    public userRole = new MockPrismaUserRoleDB(this.userRoleDb, this.roleDb);
    public user = new MockPrismaUserDB(this.userDb, this.userRoleDb);

    constructor(options: Record<string, unknown>) {
        this.options = options;
    }

    public async $connect() {
        await Promise.resolve();
        this.connected = true;
    }

    public async $disconnect() {
        await Promise.resolve();
        this.connected = false;
    }

    public async $runCommandRaw(_command: unknown) {
        return await Promise.resolve();
    }
}
