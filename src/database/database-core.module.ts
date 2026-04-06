import { PRISMA_CLIENT, PRISMA_CLIENT_OPTIONS, PrismaClientCtor, PrismaClientOptions } from '@/common';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({})
export class DatabaseCoreModule {
    public static forRoot<TClient extends PrismaClientCtor>(
        Client: TClient,
        options?: PrismaClientOptions<TClient>
    ): DynamicModule {
        return {
            global: true,
            module: DatabaseCoreModule,
            imports: [ConfigModule],
            providers: [
                {
                    provide: PRISMA_CLIENT,
                    useValue: Client,
                },
                {
                    provide: PRISMA_CLIENT_OPTIONS,
                    useValue: options,
                },
            ],
            exports: [PRISMA_CLIENT, PRISMA_CLIENT_OPTIONS],
        };
    }
}
