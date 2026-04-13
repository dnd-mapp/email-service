import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    public to!: string;
}
