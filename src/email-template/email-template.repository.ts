import { DatabaseService } from '@/database';
import { PrismaClient } from '@/prisma/client';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateEmailTemplate } from './domain/create-email-template.model';
import { UpdateEmailTemplate } from './domain/update-email-template.model';

@Injectable()
export class EmailTemplateRepository {
    private readonly logger = new Logger(EmailTemplateRepository.name);
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
    }

    public async findAll() {
        this.logger.debug('Fetching all email templates');

        const { data, error } = await tryCatch(
            this.databaseService.prisma.emailTemplate.findMany({ include: { sender: true, variables: true } })
        );

        if (error) {
            this.logger.error('Failed to fetch email templates', error.stack);
            throw new InternalServerErrorException('Failed to fetch email templates', { cause: error });
        }
        return data;
    }

    public async findById(id: string) {
        this.logger.debug(`Fetching email template by id "${id}"`);

        const { data, error } = await tryCatch(
            this.databaseService.prisma.emailTemplate.findUnique({
                where: { id },
                include: { sender: true, variables: true },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch email template "${id}"`, error.stack);
            throw new InternalServerErrorException(`Failed to fetch email template "${id}"`, { cause: error });
        }
        return data;
    }

    public async findByName(name: string) {
        this.logger.debug(`Fetching email template by name "${name}"`);

        const { data, error } = await tryCatch(
            this.databaseService.prisma.emailTemplate.findUnique({
                where: { name },
                include: { sender: true, variables: true },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch email template with name "${name}"`, error.stack);
            throw new InternalServerErrorException(`Failed to fetch email template with name "${name}"`, {
                cause: error,
            });
        }
        return data;
    }

    public async create(data: CreateEmailTemplate) {
        this.logger.debug(`Creating email template "${data.name}"`);

        const { data: created, error } = await tryCatch(
            this.databaseService.prisma.emailTemplate.create({
                data,
                include: { sender: true, variables: true },
            })
        );

        if (error) {
            this.logger.error(`Failed to create email template "${data.name}"`, error.stack);
            throw new InternalServerErrorException(`Failed to create email template "${data.name}"`, {
                cause: error,
            });
        }
        return created;
    }

    public async update(id: string, data: UpdateEmailTemplate) {
        this.logger.debug(`Updating email template "${id}"`);

        const { data: updated, error } = await tryCatch(
            this.databaseService.prisma.emailTemplate.update({
                where: { id },
                data,
                include: { sender: true, variables: true },
            })
        );

        if (error) {
            this.logger.error(`Failed to update email template "${id}"`, error.stack);
            throw new InternalServerErrorException(`Failed to update email template "${id}"`, { cause: error });
        }
        return updated;
    }

    public async deleteById(id: string) {
        this.logger.debug(`Deleting email template "${id}"`);

        const { error } = await tryCatch(this.databaseService.prisma.emailTemplate.delete({ where: { id } }));

        if (error) {
            this.logger.error(`Failed to delete email template "${id}"`, error.stack);
            throw new InternalServerErrorException(`Failed to delete email template "${id}"`, { cause: error });
        }
    }

    public async senderExists(senderId: string) {
        this.logger.debug(`Checking if sender email "${senderId}" exists`);

        const { data, error } = await tryCatch(
            this.databaseService.prisma.senderEmail.findUnique({ where: { id: senderId }, select: { id: true } })
        );

        if (error) {
            this.logger.error(`Failed to check sender email existence for "${senderId}"`, error.stack);
            throw new InternalServerErrorException(`Failed to check sender email existence for "${senderId}"`, {
                cause: error,
            });
        }
        return data !== null;
    }
}
