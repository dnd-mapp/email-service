import { DatabaseModule } from '@/database';
import { MockConfigService, MockPrisma } from '@/test';
import { Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

export async function createTestModule(...domainModules: Type<unknown>[]): Promise<TestingModule> {
    const module = await Test.createTestingModule({
        imports: [DatabaseModule.forRoot(MockPrisma), ...domainModules],
    })
        .overrideProvider(ConfigService)
        .useFactory({ factory: () => new MockConfigService() })
        .compile();
    module.useLogger(false);
    await module.init();
    return module;
}
