import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Menus } from './entities/menus.entity';
import { CategoryModule } from '../category/category.module'; 
import { OwnerModule } from '../owner/owner.module'; 
import { BranchModule } from '../branch/branch.module'; 


@Module({
  imports: [
  TypeOrmModule.forFeature([Menus]),
  CategoryModule,
  OwnerModule, 
  BranchModule, 
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
