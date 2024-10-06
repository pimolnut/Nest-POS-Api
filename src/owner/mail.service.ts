import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
  } from '@nestjs/common';
  
@Injectable()
export class MailService {
  async sendOtpEmail(email: string, otp: string) {
    // ส่งอีเมลที่มี OTP ให้กับผู้ใช้
    console.log(`ส่ง OTP ${otp} ไปยังอีเมล ${email}`);
  }
}
