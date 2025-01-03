import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';

@Controller('sizes')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post(':menuId')
  async create(
    @Param('menuId') menuId: number,
    @Body() createSizeDto: CreateSizeDto,
  ) {
    return this.sizeService.create(menuId, createSizeDto);
  }

  @Get()
  async findAll() {
    return this.sizeService.findAll();
  }

  @Get(':sizeId')
  async findOne(@Param('sizeId') sizeId: number) {
    return this.sizeService.findOne(sizeId);
  }

  @Delete(':sizeId')
  async remove(@Param('sizeId') sizeId: number) {
    return this.sizeService.remove(sizeId);
  }
}
