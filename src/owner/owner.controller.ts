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
}
