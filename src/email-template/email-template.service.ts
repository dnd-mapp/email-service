import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmailTemplateDto, EmailTemplateDto, UpdateEmailTemplateDto } from './dtos';
import { EmailTemplateRepository } from './email-template.repository';

@Injectable()
export class EmailTemplateService {
    private readonly logger = new Logger(EmailTemplateService.name);
    private readonly repository: EmailTemplateRepository;

    constructor(repository: EmailTemplateRepository) {
        this.repository = repository;
    }

    public async findAll() {
        return (await this.repository.findAll()).map((t) => EmailTemplateDto.from(t));
    }

    public async findById(id: string) {
        const template = await this.repository.findById(id);

        if (!template) {
            throw new NotFoundException(`Email template with id "${id}" not found`);
        }
        return EmailTemplateDto.from(template);
    }

    public async findByName(name: string) {
        const template = await this.repository.findByName(name);

        if (!template) {
            throw new NotFoundException(`Email template with name "${name}" not found`);
        }
        return EmailTemplateDto.from(template);
    }

    public async create(dto: CreateEmailTemplateDto) {
        const existing = await this.repository.findByName(dto.name);

        if (existing) {
            throw new ConflictException(`An email template with name "${dto.name}" already exists`);
        }
        const senderExists = await this.repository.senderExists(dto.senderId);

        if (!senderExists) {
            throw new NotFoundException(`Sender email with id "${dto.senderId}" not found`);
        }
        const template = await this.repository.create({
            name: dto.name,
            subject: dto.subject,
            content: dto.content,
            senderId: dto.senderId,
        });
        this.logger.log(`Created email template "${template.id}" with name "${template.name}"`);

        return EmailTemplateDto.from(template);
    }

    public async update(id: string, dto: UpdateEmailTemplateDto) {
        await this.findById(id);

        if (dto.name !== undefined) {
            const existing = await this.repository.findByName(dto.name);

            if (existing && existing.id !== id) {
                throw new ConflictException(`An email template with name "${dto.name}" already exists`);
            }
        }
        if (dto.senderId !== undefined) {
            const senderExists = await this.repository.senderExists(dto.senderId);

            if (!senderExists) {
                throw new NotFoundException(`Sender email with id "${dto.senderId}" not found`);
            }
        }
        return EmailTemplateDto.from(
            await this.repository.update(id, {
                name: dto.name,
                subject: dto.subject,
                content: dto.content,
                senderId: dto.senderId,
            })
        );
    }

    public async delete(id: string) {
        await this.findById(id);
        await this.repository.deleteById(id);

        this.logger.log(`Deleted email template "${id}"`);
    }
}
