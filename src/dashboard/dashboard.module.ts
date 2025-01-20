import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SalesSummary } from './entities/sales_summary';

@Module({
  imports: [TypeOrmModule.forFeature([SalesSummary])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
