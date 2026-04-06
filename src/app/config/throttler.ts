import { convertTime, TimeUnits } from '@/shared-utils';
import { ClassProvider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerModuleOptions: ThrottlerModuleOptions = {
    throttlers: [
        {
            name: 'short',
            ttl: convertTime(1, TimeUnits.SECONDS),
            limit: 3,
        },
        {
            name: 'medium',
            ttl: convertTime(10, TimeUnits.SECONDS),
            limit: 20,
        },
        {
            name: 'long',
            ttl: convertTime(1, TimeUnits.MINUTES),
            limit: 100,
        },
    ],
};

export function provideAppThrottler(): ClassProvider {
    return {
        provide: APP_GUARD,
        useClass: ThrottlerGuard,
    };
}
