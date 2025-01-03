import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SweetnessLevelController } from './sweetness-level.controller';
import { SweetnessLevelService } from './sweetness-level.service';
import { SweetnessLevel } from '../menu-options/entities/sweetness-level.entity';
import { Menu } from '../menus/entities/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SweetnessLevel, Menu])],
  controllers: [SweetnessLevelController],
  providers: [SweetnessLevelService],
})
export class SweetnessLevelModule {}
