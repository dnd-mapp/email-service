import { MockConfigService, MockPrisma } from '@/test';
import { DatabaseModule, HealthModule } from '@dnd-mapp/shared-backend';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule.forRoot(MockPrisma), HealthModule.forRoot(HealthController)],
        })
            .overrideProvider(ConfigService)
            .useFactory({
                factory: () => new MockConfigService(),
            })
            .compile();

        await module.init();

        return {
            controller: module.get(HealthController),
        };
    }

    it('should return a successful liveness check', async () => {
        const { controller } = await setupTest();

        expect(await controller.liveness()).toEqual({
            status: 'ok',
            details: {},
            info: {},
            error: {},
        });
    });

    it('should return a successful readiness check', async () => {
        const { controller } = await setupTest();

        expect(await controller.readiness()).toEqual({
            status: 'ok',
            details: {
                database: {
                    status: 'up',
                },
            },
            info: {
                database: {
                    status: 'up',
                },
            },
            error: {},
        });
    });
});
