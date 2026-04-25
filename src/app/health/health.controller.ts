import { PrismaClient } from '@/prisma/client';
import { DatabaseService } from '@dnd-mapp/shared-backend';
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';

@Controller('/health')
export class HealthController {
    private readonly healthCheckService: HealthCheckService;
    private readonly prismaHealthIndicator: PrismaHealthIndicator;
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(
        healthCheckService: HealthCheckService,
        prismaHealthIndicator: PrismaHealthIndicator,
        databaseService: DatabaseService<PrismaClient>
    ) {
        this.healthCheckService = healthCheckService;
        this.prismaHealthIndicator = prismaHealthIndicator;
        this.databaseService = databaseService;
    }

    /**
     * Liveness Probe.
     *
     * @remarks Determines if the application is running. If this returns an error,
     * the orchestrator will usually restart the container.
     *
     * This check is intentionally lightweight and does not check downstream
     * dependencies to avoid unnecessary restarts during transient network blips.
     */
    @HealthCheck()
    @Get('/liveness')
    public async liveness() {
        return this.healthCheckService.check([]);
    }

    /**
     * Readiness Probe.
     *
     * @remarks Determines if the application is ready to handle incoming traffic.
     *
     * This check verifies connectivity to critical downstream dependencies,
     * specifically the database. If this fails, the orchestrator will
     * stop routing traffic to this instance until it becomes healthy.
     */
    @HealthCheck()
    @Get('/readiness')
    public async readiness() {
        return this.healthCheckService.check([
            async () => this.prismaHealthIndicator.pingCheck('database', this.databaseService.prisma),
        ]);
    }
}
