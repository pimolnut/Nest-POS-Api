import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Overview } from './dto/overview.dto';

@Controller('owner')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stock-summary/:date')
  async getStockSummary(@Param('date') date: string): Promise<Overview> {
    date = date + 'T08:00:00.000Z';
    return this.dashboardService.getStockSummary(new Date(date));
  }
}
