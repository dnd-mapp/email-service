import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { type FastifyReply } from 'fastify';
import { CreateEmailTemplateVariableDto, UpdateEmailTemplateVariableDto } from './dtos';
import { EmailTemplateVariableService } from './services';

@ApiTags('email-template-variables')
@Controller('/email-templates/:templateId/variables')
export class EmailTemplateVariableController {
    private readonly emailTemplateVariableService: EmailTemplateVariableService;

    constructor(emailTemplateVariableService: EmailTemplateVariableService) {
        this.emailTemplateVariableService = emailTemplateVariableService;
    }

    /**
     * List all variables for an email template.
     *
     * @param templateId - The ID of the email template.
     */
    @Get()
    public async findAll(@Param('templateId') templateId: string) {
        return this.emailTemplateVariableService.findAllByTemplateId(templateId);
    }

    /**
     * Create a new variable for an email template.
     *
     * @param templateId - The ID of the email template.
     */
    @ApiCreatedResponse({ description: 'Template variable created.' })
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
     *
     * @param variableId - The ID of the template variable.
     */
    @Get('/:variableId')
    public async findById(@Param('variableId') variableId: string) {
        return this.emailTemplateVariableService.findById(variableId);
    }

    /**
     * Update a variable.
     *
     * @param templateId - The ID of the email template.
     * @param variableId - The ID of the template variable.
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
     *
     * @param templateId - The ID of the email template.
     * @param variableId - The ID of the template variable.
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
     *
     * @param variableId - The ID of the template variable.
     */
    @ApiNoContentResponse({ description: 'Template variable deleted.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:variableId')
    public async delete(@Param('variableId') variableId: string) {
        await this.emailTemplateVariableService.delete(variableId);
    }
}
