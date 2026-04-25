import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { SendEmail } from '../domain';

export class SendEmailDto implements SendEmail {
    /** The recipient email address. */
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    public to!: string;

    /** The unique name of the email template to render. */
    @IsNotEmpty()
    @IsString()
    public templateName!: string;

    /** Key-value pairs used to interpolate template variables. */
    @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
    @IsObject()
    @IsOptional()
    public variables?: Record<string, string>;
}
