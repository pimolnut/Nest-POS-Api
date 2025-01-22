import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SalesSummary } from './entities/sales_summary';
import { Order } from 'src/employee-side/order/entities/order.entity';
import { OrderItem } from 'src/employee-side/order/entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesSummary, Order, OrderItem])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
