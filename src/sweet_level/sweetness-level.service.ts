import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SweetnessLevel } from '../menu-options/entities/sweetness-level.entity';
import { CreateSweetnessLevelDto } from './dto/create-sweetness-level.dto';
import { Menu } from '../menus/entities/menu.entity';

@Injectable()
export class SweetnessLevelService {
  constructor(
    @InjectRepository(SweetnessLevel)
    private readonly sweetnessLevelRepository: Repository<SweetnessLevel>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  // Create a new sweetness level
  async create(createSweetnessLevelDto: CreateSweetnessLevelDto) {
    const { menu_id, level_name } = createSweetnessLevelDto;

    // Verify menu exists
    const menu = await this.menuRepository.findOne({ where: { menu_id } });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menu_id} not found`);
    }

    const sweetnessLevel = this.sweetnessLevelRepository.create({
      level_name,
      menu,
    });

    return this.sweetnessLevelRepository.save(sweetnessLevel);
  }

  // Get all sweetness levels
  async findAll() {
    return this.sweetnessLevelRepository.find({ relations: ['menu'] });
  }

  // Get sweetness levels by menu
  async findByMenu(menuId: number) {
    return this.sweetnessLevelRepository.find({
      where: { menu: { menu_id: menuId } },
      relations: ['menu'],
    });
  }

  // Remove sweetness level
  async remove(id: number) {
    const sweetnessLevel = await this.sweetnessLevelRepository.findOne({
      where: { sweetness_id: id },
    });
    if (!sweetnessLevel) {
      throw new NotFoundException(`Sweetness level with ID ${id} not found`);
    }
    return this.sweetnessLevelRepository.remove(sweetnessLevel);
  }
}
