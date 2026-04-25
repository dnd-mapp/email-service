import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSenderEmailDto, SenderEmailDto, UpdateSenderEmailDto } from './dtos';
import { SenderEmailRepository } from './sender-email.repository';

@Injectable()
export class SenderEmailService {
    private readonly logger = new Logger(SenderEmailService.name);
    private readonly repository: SenderEmailRepository;

    constructor(repository: SenderEmailRepository) {
        this.repository = repository;
    }

    public async findAll() {
        return (await this.repository.findAll()).map((senderEmail) => SenderEmailDto.from(senderEmail));
    }

    public async findById(id: string) {
        const sender = await this.repository.findById(id);

        if (!sender) {
            throw new NotFoundException(`Sender email with id "${id}" not found`);
        }
        return SenderEmailDto.from(sender);
    }

    public async create(dto: CreateSenderEmailDto) {
        const existing = await this.repository.findByEmail(dto.email);

        if (existing) {
            throw new ConflictException(`A sender email with address "${dto.email}" already exists`);
        }
        const sender = await this.repository.create({ name: dto.name, email: dto.email });

        this.logger.log(`Created sender email "${sender.id}" for "${sender.email}"`);
        return SenderEmailDto.from(sender);
    }

    public async update(id: string, dto: UpdateSenderEmailDto) {
        await this.findById(id);

        if (dto.email !== undefined) {
            const existing = await this.repository.findByEmail(dto.email);

            if (existing && existing.id !== id) {
                throw new ConflictException(`A sender email with address "${dto.email}" already exists`);
            }
        }
        return SenderEmailDto.from(await this.repository.update(id, { name: dto.name, email: dto.email }));
    }

    public async delete(id: string) {
        await this.findById(id);
        await this.repository.deleteById(id);

        this.logger.log(`Deleted sender email "${id}"`);
    }
}
