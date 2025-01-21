import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Overview, TopItemDto } from './dto/overview.dto';
import { SalesSummary } from './entities/sales_summary';
import { Linegraph } from './dto/linegraph.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(SalesSummary)
    private readonly salesSummaryRepository: Repository<SalesSummary>,
  ) {}

  private async calculateMonthlyRevenue(year: number): Promise<number[]> {
    const monthlyRevenue = Array(12).fill(0);
    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const salesSummaries = await this.salesSummaryRepository.find({
        where: {
          date: Between(startOfMonth, endOfMonth),
        },
      });

      monthlyRevenue[month] = salesSummaries.reduce(
        (sum, item) => sum + item.total_revenue,
        0,
      );
    }
    return monthlyRevenue;
  }

  private async calculateDailyStats(date: Date): Promise<{
    totalRevenue: number;
    totalOrders: number;
    canceledOrders: number;
  }> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const salesSummariesForDay = await this.salesSummaryRepository.find({
      where: {
        date: Between(startOfDay, endOfDay),
      },
    });

    return {
      totalRevenue: salesSummariesForDay.reduce(
        (sum, item) => sum + item.total_revenue,
        0,
      ),
      totalOrders: salesSummariesForDay.reduce(
        (sum, item) => sum + item.total_orders,
        0,
      ),
      canceledOrders: salesSummariesForDay.reduce(
        (sum, item) => sum + item.canceled_orders,
        0,
      ),
    };
  }

  async getStockSummary(date: Date): Promise<Overview> {
    const year = date.getFullYear();
    const monthlyRevenue = await this.calculateMonthlyRevenue(year);
    const { totalRevenue, totalOrders, canceledOrders } =
      await this.calculateDailyStats(date);

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

  async getStockLineGraph(date: Date): Promise<Linegraph> {
    const year = date.getFullYear();
    const monthlyRevenue = await this.calculateMonthlyRevenue(year);
    const { totalRevenue, totalOrders, canceledOrders } =
      await this.calculateDailyStats(date);

    return {
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      canceled_orders: canceledOrders,
      monthly_revenue: monthlyRevenue,
    };
  }
}
