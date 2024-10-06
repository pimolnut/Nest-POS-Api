import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OwnerService } from './owner.service';
import { CreateOwnerDto } from './dto/create-owner/create-owner.dto';
import { LoginOwnerDto } from './dto/login-owner/login-owner.dto';
import { ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto } from './dto/forgot-owner/forgot-owner.dto';

@Controller('owners')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Post('register')
  async register(@Body() createOwnerDto: CreateOwnerDto) {
    const existingOwner = await this.ownerService.findByEmail(
      createOwnerDto.email,
    );
    if (existingOwner) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    return this.ownerService.create(createOwnerDto);
  }

  @Post('login')
  async login(@Body() loginOwnerDto: LoginOwnerDto) {
    return this.ownerService.login(loginOwnerDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.ownerService.forgotPassword(forgotPasswordDto);
    return { message: 'OTP ถูกส่งไปยังอีเมลของคุณแล้ว' };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.ownerService.verifyOtp(verifyOtpDto);
    return { message: 'OTP ถูกต้อง สามารถตั้งรหัสผ่านใหม่ได้' };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.ownerService.resetPassword(resetPasswordDto);
    return { message: 'ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว' };
  }
  
}
