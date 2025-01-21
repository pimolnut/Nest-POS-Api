import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { SalesSummary } from 'src/stock/dashboard/entities/sales_summary';

@Module({
  imports: [TypeOrmModule.forFeature([Order, SalesSummary])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
