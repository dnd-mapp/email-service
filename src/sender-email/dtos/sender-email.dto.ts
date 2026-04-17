import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SenderEmail } from '../domain/sender-email.model';

export class SenderEmailDto implements SenderEmail {
    public static from(data: SenderEmail) {
        const dto = new SenderEmailDto();
        dto.id = data.id;
        dto.name = data.name;
        dto.email = data.email;
        dto.createdAt = data.createdAt;
        dto.updatedAt = data.updatedAt;

        return dto;
    }

    public id!: string;

    @IsNotEmpty()
    @IsString()
    public name!: string;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    public email!: string;

    public createdAt!: Date;
    public updatedAt!: Date;
}
