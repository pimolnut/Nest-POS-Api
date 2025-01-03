import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToppingController } from './topping.controller';
import { ToppingService } from './topping.service';
import { Topping } from '../menu-options/entities/topping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topping])],
  controllers: [ToppingController],
  providers: [ToppingService],
  exports: [ToppingService],
})
export class ToppingModule {}
