import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  usernameOrEmail: string;
  @IsString()
  newPassword: string;
}
