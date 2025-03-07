import { IsString, IsEmail, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateEmailDto {
    @IsEmail()
    email_sender: string;

    @IsString()
    name_sender: string;

    @IsEmail()
    email_receiver: string;

    @IsString()
    subject: string;

    @IsString()
    message: string;

    @IsString()
    email_type: string;

    @IsBoolean()
    @IsOptional()
    is_read?: boolean;
}

export class UpdateEmailDto {
    @IsEmail()
    @IsOptional()
    email_sender?: string;

    @IsString()
    @IsOptional()
    name_sender?: string;

    @IsEmail()
    @IsOptional()
    email_receiver?: string;

    @IsString()
    @IsOptional()
    subject?: string;

    @IsString()
    @IsOptional()
    message?: string;

    @IsString()
    @IsOptional()
    email_type?: string;

    @IsBoolean()
    @IsOptional()
    is_read?: boolean;
}