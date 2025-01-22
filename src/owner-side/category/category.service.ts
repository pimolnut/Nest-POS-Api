import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category/category.entity';
import { CreateCategoryDto } from './dto/create-category/create-category.dto';
import { LinkMenuToCategoryDto } from './dto/link-menu-to-category/link-menu-to-category.dto';
import { Menu } from '../menus/entities/menu.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { category_id: id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  // เพิ่มฟังก์ชันสำหรับลิงก์เมนูเข้ากับหมวดหมู่
  async linkMenusToCategory(
    linkMenuToCategoryDto: LinkMenuToCategoryDto,
  ): Promise<Category> {
    const { category_id, menu_ids } = linkMenuToCategoryDto;

    // ตรวจสอบว่าหมวดหมู่มีอยู่หรือไม่
    const category = await this.categoryRepository.findOne({
      where: { category_id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${category_id} not found`);
    }

    // ดึงเมนูทั้งหมดที่ต้องการลิงก์
    const menus = await this.menuRepository.findByIds(menu_ids);
    if (menus.length !== menu_ids.length) {
      throw new NotFoundException(`Some menus with IDs ${menu_ids} not found`);
    }

    // อัปเดตเมนูให้ลิงก์กับหมวดหมู่
    menus.forEach((menu) => {
      menu.category = category; // กำหนดความสัมพันธ์
    });

    await this.menuRepository.save(menus); // บันทึกการเปลี่ยนแปลง

    return category;
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async getMenusByCategory(categoryId: number): Promise<Menu[]> {
    const category = await this.categoryRepository.findOne({
      where: { category_id: categoryId },
      relations: ['menu'], // โหลดเมนูที่สัมพันธ์กับหมวดหมู่
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return category.menu; // คืนค่ารายการเมนูในหมวดหมู่
  }
}
