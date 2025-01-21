import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './entities/owner/owner.entity';
import { CreateOwnerDto } from './dto/create-owner/create-owner.dto';
import * as bcrypt from 'bcrypt';
import { sendTemporaryPasswordEmail } from '../utils/send-email.util';
import { UpdatePasswordDto } from './dto/update-password/update-password.dto';
import { LoginOwnerDto } from './dto/login-owner/login-owner.dto';
import { ForgotPasswordDto } from './dto/forgot-owner/forgot-owner.dto';
import { VerifyOtpDto } from './dto/verify-otp-owner/verify-otp-owner.dto';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
  ) {}

  // * Check for duplicate email before creating Owner
  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    const existingOwner = await this.findByEmail(createOwnerDto.email);
    // * Check if there is already an email in the system.
    if (existingOwner) {
      throw new BadRequestException('Email already exists');
    }

    // * Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8); // ? Generate a random temporary password
    // * Hash the password before saving it to the database.
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    // * Create a new owner
    const newOwner = this.ownerRepository.create({
      ...createOwnerDto,
      password: hashedPassword, // ? Save the hashed password
    });

    // return this.ownerRepository.save(newOwner);
    // * Save the new owner to the database
    const savedOwner = await this.ownerRepository.save(newOwner);
    // * Send the temporary password to the owner's email
    try {
      await sendTemporaryPasswordEmail(savedOwner.email, tempPassword);
    } catch (error) {
      console.error('Failed to send temporary password email:', error);
      throw new BadRequestException(
        'Failed to send email. Please try again later.',
      );
    }
    return savedOwner;
  }
  // * Create multiple Owners
  async createMany(owners: CreateOwnerDto[]): Promise<Owner[]> {
    const createdOwners: Owner[] = [];

    for (const createOwnerDto of owners) {
      const existingOwner = await this.findByEmail(createOwnerDto.email);
      if (existingOwner) {
        console.warn(`
          Owner with email ${createOwnerDto.email} already exists. Skipping.
          Continuing to the next record.
      `);
        continue; // ? Skip to the next record
      }
      // * Generate a temporary password for each new owner
      const tempPassword = Math.random().toString(36).slice(-8);

      // * Hash the temporary password before saving it
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const newOwner = this.ownerRepository.create({
        ...createOwnerDto,
        password: hashedPassword,
      });
      // * Save the new owner to the database
      const savedOwner = await this.ownerRepository.save(newOwner);
      createdOwners.push(savedOwner);
      // * Send the temporary password to the owner's email
      try {
        await sendTemporaryPasswordEmail(savedOwner.email, tempPassword);
      } catch (error) {
        console.error(`Failed to send email to ${savedOwner.email}:`, error);
      }
    }

    return createdOwners;
  }

  // * Find Owner by email
  async findByEmail(email: string): Promise<Owner | undefined> {
    return this.ownerRepository.findOne({ where: { email } });
  }

  // * Login Owner
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
      throw new BadRequestException('not found');
    }

    // create OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save OTP and expiry time 5 minutes
    owner.otp = otp;
    owner.otpExpiry = new Date();
    owner.otpExpiry.setMinutes(owner.otpExpiry.getMinutes() + 15);

    await this.ownerRepository.save(owner);

    await this.sendOtpEmail(owner.email, otp);
  }

  async sendOtpEmail(email: string, otp: string) {
    console.log(`ส่ง OTP ${otp} to this email ${email}`);
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<void> {
    const { usernameOrEmail, otp } = verifyOtpDto;

    const owner = await this.ownerRepository.findOne({
      where: { email: usernameOrEmail },
    });

    if (!owner || owner.otp !== otp || owner.otpExpiry < new Date()) {
      throw new BadRequestException('OTP expired or invalid');
    }

    owner.otp = null; // ลบ OTP after verify
    owner.otpExpiry = null;

    await this.ownerRepository.save(owner);
  }

  async updatePassword(
    ownerId: number,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Owner> {
    const owner = await this.ownerRepository.findOne({
      where: { owner_id: ownerId },
    });
    if (!owner) {
      throw new BadRequestException('Owner not found');
    }
    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    owner.password = hashedPassword;

    return this.ownerRepository.save(owner);
  }
}
