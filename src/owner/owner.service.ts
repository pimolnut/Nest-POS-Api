import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './entities/owner/owner.entity'; // ตรวจสอบว่าไฟล์ entity มีเส้นทางถูกต้อง
import { CreateOwnerDto } from './dto/create-owner/create-owner.dto';
import * as bcrypt from 'bcrypt';
import { LoginOwnerDto } from './dto/login-owner/login-owner.dto';
import * as crypto from 'crypto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from './dto/forgot-owner/forgot-owner.dto';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,

  ) {}

  // ตรวจสอบอีเมลซ้ำก่อนสร้าง Owner
  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    const existingOwner = await this.findByEmail(createOwnerDto.email);
    if (existingOwner) {
      throw new BadRequestException('Email already exists');
    }

    const { password, ...rest } = createOwnerDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = this.ownerRepository.create({
      ...rest,
      password: hashedPassword,
    });

    return this.ownerRepository.save(newOwner);
  }

  // ค้นหา Owner ด้วยอีเมล
  async findByEmail(email: string): Promise<Owner | undefined> {
    return this.ownerRepository.findOne({ where: { email } });
  }

  // ตรวจสอบการเข้าสู่ระบบ
  async login(loginOwnerDto: LoginOwnerDto): Promise<Owner> {
    const owner = await this.findByEmail(loginOwnerDto.email);
    if (!owner) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(
      loginOwnerDto.password,
      owner.password,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return owner;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { usernameOrEmail } = forgotPasswordDto;

    const owner = await this.ownerRepository.findOne({
      where: { email: usernameOrEmail },
    });

    if (!owner) {
      throw new BadRequestException('ไม่พบผู้ใช้นี้ในระบบ');
    }

    // สร้าง OTP (รหัส 6 หลัก)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // บันทึก OTP และเวลาหมดอายุ (5 นาที)
    owner.otp = otp;
    owner.otpExpiry = new Date();
    owner.otpExpiry.setMinutes(owner.otpExpiry.getMinutes() + 15);

    await this.ownerRepository.save(owner);

    await this.sendOtpEmail(owner.email, otp);
  }

  async sendOtpEmail(email: string, otp: string) {

    console.log(`ส่ง OTP ${otp} ไปยังอีเมล ${email}`);
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<void> {
    const { usernameOrEmail, otp } = verifyOtpDto;

    const owner = await this.ownerRepository.findOne({
      where: { email: usernameOrEmail },
    });

    if (!owner || owner.otp !== otp || owner.otpExpiry < new Date()) {
      throw new BadRequestException('OTP ไม่ถูกต้องหรือหมดอายุ');
    }

    owner.otp = null; // ลบ OTP หลังการยืนยันเสร็จสิ้น
    owner.otpExpiry = null;

    await this.ownerRepository.save(owner);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { usernameOrEmail, newPassword } = resetPasswordDto;

    const owner = await this.ownerRepository.findOne({
      where: { email: usernameOrEmail },
    });

    if (!owner) {
      throw new BadRequestException('ไม่พบผู้ใช้นี้ในระบบ');
    }

    owner.password = await bcrypt.hash(newPassword, 10);

    await this.ownerRepository.save(owner);
  }
}
