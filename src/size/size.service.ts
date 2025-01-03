import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Size } from '../menu-options/entities/size.entity';
import { CreateSizeDto } from './dto/create-size.dto';
import { Menu } from '../menus/entities/menu.entity';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async create(menuId: number, createSizeDto: CreateSizeDto): Promise<Size> {
    const menu = await this.menuRepository.findOne({
      where: { menu_id: menuId },
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${menuId} not found`);
    }

    const newSize = this.sizeRepository.create({ ...createSizeDto, menu });
    return this.sizeRepository.save(newSize);
  }

  async findAll(): Promise<Size[]> {
    return this.sizeRepository.find({ relations: ['menu'] });
  }

  async findOne(sizeId: number): Promise<Size> {
    const size = await this.sizeRepository.findOne({
      where: { size_id: sizeId },
      relations: ['menu'],
    });
    if (!size) {
      throw new NotFoundException(`Size with ID ${sizeId} not found`);
    }
    return size;
  }

  async remove(sizeId: number): Promise<void> {
    const size = await this.findOne(sizeId);
    await this.sizeRepository.remove(size);
  }
}
