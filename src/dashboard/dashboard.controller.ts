import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Overview } from './dto/overview.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stock-summary/:date')
  async getStockSummary(): Promise<Overview> {
    return this.dashboardService.getStockSummary();
  }
}
