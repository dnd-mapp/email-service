import { CreateEmailTemplateVariable } from '@/email-template-variable/domain';
import { PrismaClient } from '@/prisma/client';
import { DatabaseService } from '@dnd-mapp/shared-backend';
import { tryCatch } from '@dnd-mapp/shared-utils';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class EmailTemplateVariableRepository {
    private readonly logger = new Logger(EmailTemplateVariableRepository.name);
    private readonly databaseService: DatabaseService<PrismaClient>;

    constructor(databaseService: DatabaseService<PrismaClient>) {
        this.databaseService = databaseService;
    }

    public async findAllByTemplateId(templateId: string) {
        this.logger.debug(`Fetching all variables for template "${templateId}"`);

        const { data, error } = await tryCatch(
            this.databaseService.prisma.emailTemplateVariable.findMany({ where: { templateId } })
        );

        if (error) {
            this.logger.error(`Failed to fetch variables for template "${templateId}"`, error.stack);
            throw new InternalServerErrorException(`Failed to fetch variables for template "${templateId}"`, {
                cause: error,
            });
        }
        return data;
    }

    public async findById(id: string) {
        this.logger.debug(`Fetching email template variable "${id}"`);

        const { data, error } = await tryCatch(
            this.databaseService.prisma.emailTemplateVariable.findUnique({ where: { id } })
        );

        if (error) {
            this.logger.error(`Failed to fetch email template variable "${id}"`, error.stack);
            throw new InternalServerErrorException(`Failed to fetch email template variable "${id}"`, {
                cause: error,
            });
        }
        return data;
    }

    public async findByNameAndTemplateId(name: string, templateId: string) {
        this.logger.debug(`Fetching variable "${name}" for template "${templateId}"`);

        const { data, error } = await tryCatch(
            this.databaseService.prisma.emailTemplateVariable.findUnique({
                where: { templateId_name: { templateId, name } },
            })
        );

        if (error) {
            this.logger.error(`Failed to fetch variable "${name}" for template "${templateId}"`, error.stack);
            throw new InternalServerErrorException(`Failed to fetch variable "${name}" for template "${templateId}"`, {
                cause: error,
            });
        }
        return data;
    }

    public async templateExists(templateId: string) {
        this.logger.debug(`Checking if email template "${templateId}" exists`);

        const { data, error } = await tryCatch(
            this.databaseService.prisma.emailTemplate.findUnique({ where: { id: templateId }, select: { id: true } })
        );

        if (error) {
            this.logger.error(`Failed to check email template existence for "${templateId}"`, error.stack);
            throw new InternalServerErrorException(`Failed to check email template existence for "${templateId}"`, {
                cause: error,
            });
        }
        return data !== null;
    }

    public async create(data: CreateEmailTemplateVariable) {
        this.logger.debug(`Creating variable "${data.name}" for template "${data.templateId}"`);

        const { data: created, error } = await tryCatch(
            this.databaseService.prisma.emailTemplateVariable.create({ data })
        );

        if (error) {
            this.logger.error(
                `Failed to create variable "${data.name}" for template "${data.templateId}"`,
                error.stack
            );
            throw new InternalServerErrorException(
                `Failed to create variable "${data.name}" for template "${data.templateId}"`,
                { cause: error }
            );
        }
        return created;
    }

    public async update(id: string, data: { name?: string }) {
        this.logger.debug(`Updating email template variable "${id}"`);

        const { data: updated, error } = await tryCatch(
            this.databaseService.prisma.emailTemplateVariable.update({ where: { id }, data })
        );

        if (error) {
            this.logger.error(`Failed to update email template variable "${id}"`, error.stack);
            throw new InternalServerErrorException(`Failed to update email template variable "${id}"`, {
                cause: error,
            });
        }
        return updated;
    }

    public async deleteById(id: string) {
        this.logger.debug(`Deleting email template variable "${id}"`);

        const { error } = await tryCatch(this.databaseService.prisma.emailTemplateVariable.delete({ where: { id } }));

        if (error) {
            this.logger.error(`Failed to delete email template variable "${id}"`, error.stack);
            throw new InternalServerErrorException(`Failed to delete email template variable "${id}"`, {
                cause: error,
            });
        }
    }
}
