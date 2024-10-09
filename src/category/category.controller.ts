import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Post()
  async create(@Body('category_name') category_name: string) {
    return this.categoryService.create(category_name);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
