import { EmailTemplateVariableDto } from '@/email-template-variable';
import { SenderEmailDto } from '@/sender-email';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EmailTemplate } from '../domain';

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

    /** Unique identifier of the email template. */
    @ApiProperty()
    public id!: string;

    /** Human-readable name used to look up the template. */
    @IsNotEmpty()
    @IsString()
    public name!: string;

    /** Subject line rendered for outbound emails. */
    @IsNotEmpty()
    @IsString()
    public subject!: string;

    /** Handlebars template content for the email body. */
    @IsNotEmpty()
    @IsString()
    public content!: string;

    /** ID of the sender email address associated with this template. */
    @IsNotEmpty()
    @IsString()
    public senderId!: string;

    /** Resolved sender email address. */
    public sender?: SenderEmailDto;

    /** Variables defined for this template. */
    public variables?: EmailTemplateVariableDto[];

    /** Timestamp when the template was created. */
    @ApiProperty()
    public createdAt!: Date;

    /** Timestamp when the template was last updated. */
    @ApiProperty()
    public updatedAt!: Date;
}
