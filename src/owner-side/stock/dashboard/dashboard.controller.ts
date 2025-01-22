import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Overview } from './dto/overview.dto';
import { Linegraph } from './dto/linegraph.dto';
import { OrderItemDto } from 'src/employee-side/order/dto/order-item/order-item.dto';

@Controller('owner')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stock-summary/:date')
  async getStockSummary(@Param('date') date: string): Promise<Overview> {
    date = date + 'T08:00:00.000Z';
    return this.dashboardService.getStockSummary(new Date(date));
  }

  @Get('stock-sale/:date')
  async getStockLineGraph(@Param('date') date: string): Promise<Linegraph> {
    date = date + 'T08:00:00.000Z';
    return this.dashboardService.getStockLineGraph(new Date(date));
  }

  @Get('stock-orders/:date')
  async getOrderTopic(@Param('date') date: string): Promise<OrderItemDto> {
    date = date + 'T08:00:00.000Z';
    return this.dashboardService.getOrderTopic(new Date(date));
  }
}
