import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuOptionsController } from './menu-options.controller';
import { MenuOptionsService } from './menu-options.service';
import { SweetnessLevel } from './entities/sweetness-level.entity';
import { Size } from './entities/size.entity';
import { Topping } from './entities/topping.entity';
import { MenuType } from './entities/menu-type.entity';
import { Menu } from 'src/menus/entities/menu.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SweetnessLevel, Size, Topping, MenuType, Menu]),
  ],
  controllers: [MenuOptionsController],
  providers: [MenuOptionsService],
})
export class MenuOptionsModule {}
