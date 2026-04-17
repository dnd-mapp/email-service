import { ApiProperty } from '@nestjs/swagger';
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

    /** Unique identifier of the sender email address. */
    @ApiProperty()
    public id!: string;

    /** Display name shown in the From field of outbound emails. */
    @IsNotEmpty()
    @IsString()
    public name!: string;

    /** Email address used as the sender. */
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    public email!: string;

    /** Timestamp when the sender email was created. */
    @ApiProperty()
    public createdAt!: Date;

    /** Timestamp when the sender email was last updated. */
    @ApiProperty()
    public updatedAt!: Date;
}
