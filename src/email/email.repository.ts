import { DatabaseService } from '@/database';
import { PrismaClient } from '@/prisma/client';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { type EmailLogStatus } from './email-log-statuses';

@Injectable()
export class EmailRepository {
    private readonly logger = new Logger(EmailRepository.name);
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
    }

    public async log(to: string, status: EmailLogStatus, errorMessage?: string) {
        this.logger.debug(`Persisting email log for "${to}" with status "${status}"`);

        const { error } = await tryCatch(
            this.databaseService.prisma.emailLog.create({
                data: {
                    to: to,
                    status: status,
                    ...(errorMessage !== undefined && { errorMessage: errorMessage }),
                },
            })
        );

        if (error) {
            this.logger.error(`Failed to persist email log for "${to}"`, error.stack);
            throw new InternalServerErrorException('Failed to persist email log', { cause: error });
        }
    }
}
