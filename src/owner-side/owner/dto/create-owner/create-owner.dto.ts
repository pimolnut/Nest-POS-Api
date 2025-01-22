import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateOwnerDto {
  @IsString()
  @IsNotEmpty()
  owner_name: string;

  @IsString()
  @IsNotEmpty()
  contact_info: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
