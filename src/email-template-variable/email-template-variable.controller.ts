import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { CreateEmailTemplateVariableDto, UpdateEmailTemplateVariableDto } from './dtos';
import { EmailTemplateVariableService } from './services';

@Controller('/email-templates/:templateId/variables')
export class EmailTemplateVariableController {
    private readonly emailTemplateVariableService: EmailTemplateVariableService;

    constructor(emailTemplateVariableService: EmailTemplateVariableService) {
        this.emailTemplateVariableService = emailTemplateVariableService;
    }

    /**
     * List all variables for an email template.
     */
    @Get()
    public async findAll(@Param('templateId') templateId: string) {
        return this.emailTemplateVariableService.findAllByTemplateId(templateId);
    }

    /**
     * Create a new variable for an email template.
     */
    @HttpCode(HttpStatus.CREATED)
    @Post()
    public async create(
        @Param('templateId') templateId: string,
        @Body() dto: CreateEmailTemplateVariableDto,
        @Res({ passthrough: true }) res: FastifyReply
    ) {
        const variable = await this.emailTemplateVariableService.create(templateId, dto);

        res.header('Location', `/email-templates/${templateId}/variables/${variable.id}`);

        return variable;
    }

    /**
     * Get an email template variable by its ID.
     */
    @Get('/:variableId')
    public async findById(@Param('variableId') variableId: string) {
        return this.emailTemplateVariableService.findById(variableId);
    }

    /**
     * Update a variable.
     */
    @Put('/:variableId')
    public async update(
        @Param('templateId') templateId: string,
        @Param('variableId') variableId: string,
        @Body() dto: UpdateEmailTemplateVariableDto
    ) {
        return this.emailTemplateVariableService.update(variableId, templateId, dto);
    }

    /**
     * Partially update a variable.
     */
    @Patch('/:variableId')
    public async patch(
        @Param('templateId') templateId: string,
        @Param('variableId') variableId: string,
        @Body() dto: UpdateEmailTemplateVariableDto
    ) {
        return this.emailTemplateVariableService.update(variableId, templateId, dto);
    }

    /**
     * Delete a variable.
     */
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:variableId')
    public async delete(@Param('variableId') variableId: string) {
        await this.emailTemplateVariableService.delete(variableId);
    }
}
