import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { SalesSummary } from 'src/owner-side/stock/dashboard/entities/sales_summary';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, SalesSummary, OrderItem])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
