import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
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
    console.log(date);

    // Extract the year from the provided date
    const year = date.getFullYear();

    // Create a list to store monthly revenue
    const monthlyRevenue = Array(12).fill(0);

    // Loop through each month and calculate the total revenue
    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const salesSummaries = await this.salesSummaryRepository.find({
        where: {
          date: Between(startOfMonth, endOfMonth),
        },
      });

      // Calculate total revenue for the month
      const totalRevenueForMonth = salesSummaries.reduce(
        (sum, item) => sum + item.total_revenue,
        0,
      );

      monthlyRevenue[month] = totalRevenueForMonth;
    }

    // Fetch data for the given day for other calculations
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const salesSummariesForDay = await this.salesSummaryRepository.find({
      where: {
        date: Between(startOfDay, endOfDay),
      },
    });

    const totalRevenue = salesSummariesForDay.reduce(
      (sum, item) => sum + item.total_revenue,
      0,
    );
    const totalOrders = salesSummariesForDay.reduce(
      (sum, item) => sum + item.total_orders,
      0,
    );
    const canceledOrders = salesSummariesForDay.reduce(
      (sum, item) => sum + item.canceled_orders,
      0,
    );

    // Hardcoded top_three for now
    const topThree: TopItemDto[] = [
      { name: 'ข้าวมันไก่', count: 50 },
      { name: 'ข้าวไข่เจียว', count: 48 },
      { name: 'ราดหน้า', count: 42 },
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
