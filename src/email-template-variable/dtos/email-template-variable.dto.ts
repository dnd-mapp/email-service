import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EmailTemplateVariable } from '../domain';

export class EmailTemplateVariableDto implements EmailTemplateVariable {
    public static from(data: EmailTemplateVariable) {
        const dto = new EmailTemplateVariableDto();
        dto.id = data.id;
        dto.name = data.name;
        dto.templateId = data.templateId;
        dto.createdAt = data.createdAt;
        dto.updatedAt = data.updatedAt;
        return dto;
    }

    /** Unique identifier of the template variable. */
    @ApiProperty()
    public id!: string;

    /** Name of the Handlebars variable (e.g. `username`). */
    @IsNotEmpty()
    @IsString()
    public name!: string;

    /** ID of the email template this variable belongs to. */
    @IsNotEmpty()
    @IsString()
    public templateId!: string;

    /** Timestamp when the variable was created. */
    @ApiProperty()
    public createdAt!: Date;

    /** Timestamp when the variable was last updated. */
    @ApiProperty()
    public updatedAt!: Date;
}
