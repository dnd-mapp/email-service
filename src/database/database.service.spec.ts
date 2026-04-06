import { MockConfigService, MockPrisma } from '@/test';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from './database.module';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule.forRoot(MockPrisma)],
        })
            .overrideProvider(ConfigService)
            .useFactory({
                factory: () => new MockConfigService(),
            })
            .compile();

        return {
            service: module.get(DatabaseService<MockPrisma>),
        };
    }

    it('should connect and disconnect', async () => {
        const { service } = await setupTest();

        expect(service.prisma).not.toBeDefined();

        await service.onModuleInit();

        expect(service.prisma).toBeDefined();
        expect(service.prisma.connected).toEqual(true);

        await service.onApplicationShutdown();

        expect(service.prisma.connected).toEqual(false);
    });

    it('should only initialize prisma once', async () => {
        const { service } = await setupTest();

        await service.onModuleInit();

        const spy = vi.spyOn(service.prisma, '$connect');

        expect(spy).not.toHaveBeenCalled();
        await service.onModuleInit();

        expect(spy).toHaveBeenCalledTimes(0);
    });
});
