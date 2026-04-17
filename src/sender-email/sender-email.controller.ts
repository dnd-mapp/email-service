import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { CreateSenderEmailDto, SenderEmailDto, UpdateSenderEmailDto } from './dtos';
import { SenderEmailService } from './services';

@Controller('/sender-emails')
export class SenderEmailController {
    private readonly senderEmailService: SenderEmailService;

    constructor(senderEmailService: SenderEmailService) {
        this.senderEmailService = senderEmailService;
    }

    /**
     * List all sender email addresses.
     */
    @Get()
    public async findAll() {
        return this.senderEmailService.findAll();
    }

    /**
     * Create a new sender email address.
     */
    @HttpCode(HttpStatus.CREATED)
    @Post()
    public async create(@Body() dto: CreateSenderEmailDto, @Res({ passthrough: true }) res: FastifyReply) {
        const sender = await this.senderEmailService.create(dto);

        res.header('Location', `/sender-emails/${sender.id}`);

        return sender;
    }

    /**
     * Get a sender email address by its ID.
     */
    @Get('/:senderEmailId')
    public async findById(@Param('senderEmailId') id: string) {
        return this.senderEmailService.findById(id);
    }

    /**
     * Update a sender email address.
     */
    @Put('/:senderEmailId')
    public async update(
        @Param('senderEmailId') id: string,
        @Body() dto: UpdateSenderEmailDto
    ): Promise<SenderEmailDto> {
        return this.senderEmailService.update(id, dto);
    }

    /**
     * Partially update a sender email address.
     */
    @Patch('/:senderEmailId')
    public async patch(@Param('senderEmailId') id: string, @Body() dto: UpdateSenderEmailDto) {
        return this.senderEmailService.update(id, dto);
    }

    /**
     * Delete a sender email address.
     */
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:senderEmailId')
    public async delete(@Param('senderEmailId') id: string) {
        await this.senderEmailService.delete(id);
    }
}
