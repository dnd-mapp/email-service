import { PrismaLikeClient } from '@/common';

export class MockPrisma implements PrismaLikeClient {
    public connected = false;
    public options: Record<string, unknown>;

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
