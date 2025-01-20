import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Overview, TopItemDto } from './dto/overview.dto';
import { SalesSummary } from './entities/sales_summary';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(SalesSummary)
    private readonly salesSummaryRepository: Repository<SalesSummary>,
  ) {}

  async getStockSummary(date: Date): Promise<Overview> {
    // Fetch data from the database for the given date
    const salesSummaries = await this.salesSummaryRepository.find({
      where: {
        date,
      },
    });

    // Aggregate data for the response
    const totalRevenue = salesSummaries.reduce(
      (sum, item) => sum + item.total_revenue,
      0,
    );
    const totalOrders = salesSummaries.reduce(
      (sum, item) => sum + item.total_orders,
      0,
    );
    const canceledOrders = salesSummaries.reduce(
      (sum, item) => sum + item.canceled_orders,
      0,
    );

    // Hardcoded top_three and monthly_revenue for now
    const topThree: TopItemDto[] = [
      { name: 'ข้าวมันไก่', count: 50 },
      { name: 'ข้าวไข่เจียว', count: 48 },
      { name: 'ราดหน้า', count: 42 },
    ];

    const monthlyRevenue = [
      50000, 10000, 40000, 30000, 60000, 50000, 80000, 70000, 90000, 60000,
      70000, 40000,
    ];

    return {
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      canceled_orders: canceledOrders,
      top_three: topThree,
      monthly_revenue: monthlyRevenue,
    };
  }
}
