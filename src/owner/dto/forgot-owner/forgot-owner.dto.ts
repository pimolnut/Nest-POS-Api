import {  IsString ,IsNotEmpty} from 'class-validator';

export class ForgotPasswordDto {
    @IsString()
    usernameOrEmail: string;
  }
  

  export class VerifyOtpDto {
    @IsString()
    usernameOrEmail: string;
  
    @IsString()
    otp: string;
  }
  
 
  export class ResetPasswordDto {
    @IsString()
    usernameOrEmail: string;
  
    @IsString()
    newPassword: string;
  }
  