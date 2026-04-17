import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';
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
    @ApiCreatedResponse({ description: 'Sender email address created.' })
    @HttpCode(HttpStatus.CREATED)
    @Post()
    public async create(@Body() dto: CreateSenderEmailDto, @Res({ passthrough: true }) res: FastifyReply) {
        const sender = await this.senderEmailService.create(dto);

        res.header('Location', `/sender-emails/${sender.id}`);

        return sender;
    }

    /**
     * Get a sender email address by its ID.
     *
     * @param senderEmailId - The ID of the sender email address.
     */
    @Get('/:senderEmailId')
    public async findById(@Param('senderEmailId') senderEmailId: string) {
        return this.senderEmailService.findById(senderEmailId);
    }

    /**
     * Update a sender email address.
     *
     * @param senderEmailId - The ID of the sender email address.
     */
    @Put('/:senderEmailId')
    public async update(
        @Param('senderEmailId') senderEmailId: string,
        @Body() dto: UpdateSenderEmailDto
    ): Promise<SenderEmailDto> {
        return this.senderEmailService.update(senderEmailId, dto);
    }

    /**
     * Partially update a sender email address.
     *
     * @param senderEmailId - The ID of the sender email address.
     */
    @Patch('/:senderEmailId')
    public async patch(@Param('senderEmailId') senderEmailId: string, @Body() dto: UpdateSenderEmailDto) {
        return this.senderEmailService.update(senderEmailId, dto);
    }

    /**
     * Delete a sender email address.
     *
     * @param senderEmailId - The ID of the sender email address.
     */
    @ApiNoContentResponse({ description: 'Sender email address deleted.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:senderEmailId')
    public async delete(@Param('senderEmailId') senderEmailId: string) {
        await this.senderEmailService.delete(senderEmailId);
    }
}
