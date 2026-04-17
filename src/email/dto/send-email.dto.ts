import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { SendEmail } from '../domain/send-email.model';

export class SendEmailDto implements SendEmail {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    public to!: string;

    @IsNotEmpty()
    @IsString()
    public templateName!: string;

    @IsObject()
    @IsOptional()
    public variables?: Record<string, string>;
}
