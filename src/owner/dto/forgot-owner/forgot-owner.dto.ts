import { IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  usernameOrEmail: string;
}
