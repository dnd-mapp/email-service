import { IsNotEmpty, IsString } from 'class-validator';
import { EmailTemplateVariableDto } from '../../email-template-variable/dtos';
import { SenderEmailDto } from '../../sender-email/dtos';
import { EmailTemplate } from '../domain/email-template.model';

export class EmailTemplateDto implements EmailTemplate {
    public static from(data: EmailTemplate) {
        const dto = new EmailTemplateDto();
        dto.id = data.id;
        dto.name = data.name;
        dto.subject = data.subject;
        dto.content = data.content;
        dto.senderId = data.senderId;
        dto.createdAt = data.createdAt;
        dto.updatedAt = data.updatedAt;

        if (data.sender) {
            dto.sender = SenderEmailDto.from(data.sender);
        }

        if (data.variables) {
            dto.variables = data.variables.map((v) => EmailTemplateVariableDto.from(v));
        }

        return dto;
    }

    public id!: string;

    @IsNotEmpty()
    @IsString()
    public name!: string;

    @IsNotEmpty()
    @IsString()
    public subject!: string;

    @IsNotEmpty()
    @IsString()
    public content!: string;

    @IsNotEmpty()
    @IsString()
    public senderId!: string;

    public sender?: SenderEmailDto;
    public variables?: EmailTemplateVariableDto[];

    public createdAt!: Date;
    public updatedAt!: Date;
}
