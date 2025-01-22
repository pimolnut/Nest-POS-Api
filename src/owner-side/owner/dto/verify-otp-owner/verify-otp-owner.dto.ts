import { IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  usernameOrEmail: string;
  @IsString()
  otp: string;
}
