import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Category } from './entities/category/category.entity';
import { Menu } from 'src/owner-side/menus/entities/menu.entity';
import { CategoryController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Menu])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService, TypeOrmModule], // ตรวจสอบว่า TypeOrmModule ถูก export
})
export class CategoryModule {}
