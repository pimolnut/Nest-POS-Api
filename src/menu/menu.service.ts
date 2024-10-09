import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}
  // * create a new menu
  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const newMenu = this.menuRepository.create(createMenuDto);
    return this.menuRepository.save(newMenu);
  }
  // * get all menus
  async findAll(): Promise<Menu[]> {
    return this.menuRepository.find();
  }
  // * get a single menu
  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOne({ where: { menu_id: id } });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }
  // * update a menu
  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findOne(id);
    Object.assign(menu, updateMenuDto);
    return this.menuRepository.save(menu);
  }
  // * delete a menu
  async remove(id: number): Promise<void> {
    const menu = await this.findOne(id);
    await this.menuRepository.remove(menu);
  }
}
