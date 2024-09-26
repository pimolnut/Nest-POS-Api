import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginOwnerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
