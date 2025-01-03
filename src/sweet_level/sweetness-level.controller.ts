import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  Delete,
} from '@nestjs/common';

import { SweetnessLevelService } from './sweetness-level.service.js';
import { CreateSweetnessLevelDto } from './dto/create-sweetness-level.dto';

@Controller('sweetness-levels')
export class SweetnessLevelController {
  constructor(private readonly sweetnessLevelService: SweetnessLevelService) {}

  // Create a new sweetness level
  @Post()
  async create(@Body() createSweetnessLevelDto: CreateSweetnessLevelDto) {
    return this.sweetnessLevelService.create(createSweetnessLevelDto);
  }

  // Get all sweetness levels
  @Get()
  async findAll() {
    return this.sweetnessLevelService.findAll();
  }

  // Get sweetness levels for a specific menu
  @Get('menu/:menuId')
  async findByMenu(@Param('menuId') menuId: number) {
    const sweetnessLevels = await this.sweetnessLevelService.findByMenu(menuId);
    if (!sweetnessLevels.length) {
      throw new NotFoundException(
        `No sweetness levels found for menu with ID ${menuId}`,
      );
    }
    return sweetnessLevels;
  }

  // Delete a sweetness level
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.sweetnessLevelService.remove(id);
  }
}
