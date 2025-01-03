import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeService } from './size.service';
import { SizeController } from './size.controller';
import { Size } from '../menu-options/entities/size.entity';
import { Menu } from '../menus/entities/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Size, Menu])],
  controllers: [SizeController],
  providers: [SizeService],
})
export class SizeModule {}
