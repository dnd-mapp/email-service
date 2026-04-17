import { IsNotEmpty, IsString } from 'class-validator';
import { EmailTemplateVariable } from '../domain/email-template-variable.model';

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

    public id!: string;

    @IsNotEmpty()
    @IsString()
    public name!: string;

    @IsNotEmpty()
    @IsString()
    public templateId!: string;

    public createdAt!: Date;
    public updatedAt!: Date;
}
