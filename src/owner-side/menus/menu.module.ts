import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Menu } from './entities/menu.entity';

import { SweetnessLevel } from './entities/sweetness-level.entity';
import { Size } from './entities/size.entity';
import { AddOn } from './entities/add-on.entity';
import { MenuType } from './entities/menu-type.entity';

// เชื่อมโยง StockModule (หรือ IngredientModule หากต้องการ)
import { CategoryModule } from 'src/owner-side/category/category.module';
import { OwnerModule } from 'src/owner-side/owner/owner.module';
import { BranchModule } from 'src/owner-side/branch/branch.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, AddOn, MenuType, Size, SweetnessLevel]),
    CategoryModule,
    OwnerModule,
    BranchModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
