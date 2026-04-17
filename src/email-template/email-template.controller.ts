import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from './dtos';
import { EmailTemplateService } from './services';

@Controller('/email-templates')
export class EmailTemplateController {
    private readonly emailTemplateService: EmailTemplateService;

    constructor(emailTemplateService: EmailTemplateService) {
        this.emailTemplateService = emailTemplateService;
    }

    /**
     * List all email templates.
     */
    @Get()
    public async findAll() {
        return this.emailTemplateService.findAll();
    }

    /**
     * Create a new email template.
     */
    @HttpCode(HttpStatus.CREATED)
    @Post()
    public async create(@Body() dto: CreateEmailTemplateDto, @Res({ passthrough: true }) res: FastifyReply) {
        const template = await this.emailTemplateService.create(dto);

        res.header('Location', `/email-templates/${template.id}`);

        return template;
    }

    /**
     * Get an email template by its ID.
     */
    @Get('/:templateId')
    public async findById(@Param('templateId') templateId: string) {
        return this.emailTemplateService.findById(templateId);
    }

    /**
     * Update an email template.
     */
    @Put('/:templateId')
    public async update(@Param('templateId') templateId: string, @Body() dto: UpdateEmailTemplateDto) {
        return this.emailTemplateService.update(templateId, dto);
    }

    /**
     * Partially update an email template.
     */
    @Patch('/:templateId')
    public async patch(@Param('templateId') templateId: string, @Body() dto: UpdateEmailTemplateDto) {
        return this.emailTemplateService.update(templateId, dto);
    }

    /**
     * Delete an email template.
     */
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:templateId')
    public async delete(@Param('templateId') templateId: string) {
        await this.emailTemplateService.delete(templateId);
    }
}
