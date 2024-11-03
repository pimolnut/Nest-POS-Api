import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menus } from './entities/menus.entity';
import { CreateMenuDto } from './dto/create-menu/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto/update-menu.dto';
import { Category } from '../category/entities/category/category.entity';
import { Owner } from '../owner/entities/owner/owner.entity';
import { Branch } from '../branch/entities/branch/branch.entity';


@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menus)
    private readonly menuRepository: Repository<Menus>,
      // Inject repositories ของ entities ที่เกี่ยวข้อง
      @InjectRepository(Category)
      private readonly categoryRepository: Repository<Category>,
  
      @InjectRepository(Owner)
      private readonly ownerRepository: Repository<Owner>,
  
      @InjectRepository(Branch)
      private readonly branchRepository: Repository<Branch>,
  ) {}
  // * create a new menu
  async create(createMenuDto: CreateMenuDto): Promise<Menus> {
    const { category_id, owner_id, branch_id, ...menuData } = createMenuDto;
    // * Load Category
    const category = await this.categoryRepository.findOne({ where: { category_id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${category_id} not found`);
    }

    // * Load Owner
    const owner = await this.ownerRepository.findOne({ where: { owner_id } });
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${owner_id} not found`);
    }

    // * Load Branch
    const branch = await this.branchRepository.findOne({ where: { branch_id } });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${branch_id} not found`);
    }

    // * create a new menu
    const newMenu = this.menuRepository.create({
      ...menuData,
      category,
      owner,
      branch,
    });
    const savedMenu = await this.menuRepository.save(newMenu);
    console.log('Saved Menu:', savedMenu);

    return savedMenu;
  }
  // * get all menus
  async findAll(): Promise<Menus[]> {
    return this.menuRepository.find();
  }
  // * get a single menu
  async findOne(id: number): Promise<Menus> {
    const menu = await this.menuRepository.findOne({ where: { menu_id: id } });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }
  // * update a menu
  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menus> {
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
