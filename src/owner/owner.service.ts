import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './entities/owner/owner.entity';  // ตรวจสอบว่าไฟล์ entity มีเส้นทางถูกต้อง
import { CreateOwnerDto } from './dto/create-owner/create-owner.dto';
import * as bcrypt from 'bcrypt';
import { LoginOwnerDto } from './dto/login-owner/login-owner.dto';

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

    const passwordValid = await bcrypt.compare(loginOwnerDto.password, owner.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return owner;
  }
}
