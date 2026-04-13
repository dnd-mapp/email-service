import { IsEmail, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { EmailTemplates, type EmailTemplate } from '../email-template.enum';

export class SendEmailDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    public to!: string;

    @IsEnum(EmailTemplates)
    @IsNotEmpty()
    public template!: EmailTemplate;

    @IsObject()
    @IsOptional()
    public variables?: Record<string, string>;
}
