import { PrismaClient } from '@/prisma/client';
import { DatabaseService } from '@dnd-mapp/shared-backend';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateSenderEmail, UpdateSenderEmail } from './domain';

@Injectable()
export class SenderEmailRepository {
    private readonly logger = new Logger(SenderEmailRepository.name);
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
    }

    public async findAll() {
        this.logger.debug('Fetching all sender emails');

        const { data, error } = await tryCatch(this.databaseService.prisma.senderEmail.findMany());

        if (error) {
            this.logger.error('Failed to fetch sender emails', error.stack);
            throw new InternalServerErrorException('Failed to fetch sender emails', { cause: error });
        }

        return data;
    }

    public async findById(id: string) {
        this.logger.debug(`Fetching sender email by id "${id}"`);

        const { data, error } = await tryCatch(this.databaseService.prisma.senderEmail.findUnique({ where: { id } }));

        if (error) {
            this.logger.error(`Failed to fetch sender email "${id}"`, error.stack);
            throw new InternalServerErrorException(`Failed to fetch sender email "${id}"`, { cause: error });
        }

        return data;
    }

    public async findByEmail(email: string) {
        this.logger.debug(`Fetching sender email by email address "${email}"`);

        const { data, error } = await tryCatch(
            this.databaseService.prisma.senderEmail.findUnique({ where: { email } })
        );

        if (error) {
            this.logger.error(`Failed to fetch sender email with address "${email}"`, error.stack);
            throw new InternalServerErrorException(`Failed to fetch sender email with address "${email}"`, {
                cause: error,
            });
        }

        return data;
    }

    public async create(data: CreateSenderEmail) {
        this.logger.debug(`Creating sender email for "${data.email}"`);

        const { data: created, error } = await tryCatch(this.databaseService.prisma.senderEmail.create({ data }));

        if (error) {
            this.logger.error(`Failed to create sender email for "${data.email}"`, error.stack);
            throw new InternalServerErrorException(`Failed to create sender email for "${data.email}"`, {
                cause: error,
            });
        }

        return created;
    }

    public async update(id: string, data: UpdateSenderEmail) {
        this.logger.debug(`Updating sender email "${id}"`);

        const { data: updated, error } = await tryCatch(
            this.databaseService.prisma.senderEmail.update({ where: { id }, data })
        );

        if (error) {
            this.logger.error(`Failed to update sender email "${id}"`, error.stack);
            throw new InternalServerErrorException(`Failed to update sender email "${id}"`, { cause: error });
        }

        return updated;
    }

    public async deleteById(id: string) {
        this.logger.debug(`Deleting sender email "${id}"`);

        const { error } = await tryCatch(this.databaseService.prisma.senderEmail.delete({ where: { id } }));

        if (error) {
            this.logger.error(`Failed to delete sender email "${id}"`, error.stack);
            throw new InternalServerErrorException(`Failed to delete sender email "${id}"`, { cause: error });
        }
    }
}
