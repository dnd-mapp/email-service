import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmailTemplateVariableDto, EmailTemplateVariableDto, UpdateEmailTemplateVariableDto } from '../dtos';
import { EmailTemplateVariableRepository } from '../email-template-variable.repository';

@Injectable()
export class EmailTemplateVariableService {
    private readonly logger = new Logger(EmailTemplateVariableService.name);
    private readonly repository: EmailTemplateVariableRepository;

    constructor(repository: EmailTemplateVariableRepository) {
        this.repository = repository;
    }

    public async findAllByTemplateId(templateId: string) {
        const exists = await this.repository.templateExists(templateId);

        if (!exists) {
            throw new NotFoundException(`Email template with id "${templateId}" not found`);
        }
        return (await this.repository.findAllByTemplateId(templateId)).map((template) =>
            EmailTemplateVariableDto.from(template)
        );
    }

    public async findById(id: string) {
        const variable = await this.repository.findById(id);

        if (!variable) {
            throw new NotFoundException(`Email template variable with id "${id}" not found`);
        }
        return EmailTemplateVariableDto.from(variable);
    }

    public async create(templateId: string, dto: CreateEmailTemplateVariableDto) {
        const templateExists = await this.repository.templateExists(templateId);

        if (!templateExists) {
            throw new NotFoundException(`Email template with id "${templateId}" not found`);
        }
        const existing = await this.repository.findByNameAndTemplateId(dto.name, templateId);

        if (existing) {
            throw new ConflictException(
                `A variable with name "${dto.name}" already exists for template "${templateId}"`
            );
        }
        const variable = await this.repository.create({ name: dto.name, templateId });
        this.logger.log(`Created variable "${variable.id}" with name "${variable.name}" for template "${templateId}"`);

        return EmailTemplateVariableDto.from(variable);
    }

    public async update(id: string, templateId: string, dto: UpdateEmailTemplateVariableDto) {
        const variable = await this.repository.findById(id);

        if (!variable) {
            throw new NotFoundException(`Email template variable with id "${id}" not found`);
        }
        if (dto.name !== undefined && dto.name !== variable.name) {
            const existing = await this.repository.findByNameAndTemplateId(dto.name, templateId);

            if (existing) {
                throw new ConflictException(
                    `A variable with name "${dto.name}" already exists for template "${templateId}"`
                );
            }
        }
        return EmailTemplateVariableDto.from(await this.repository.update(id, { name: dto.name }));
    }

    public async delete(id: string) {
        await this.findById(id);
        await this.repository.deleteById(id);

        this.logger.log(`Deleted email template variable "${id}"`);
    }
}
