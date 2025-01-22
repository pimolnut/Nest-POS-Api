import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Overview, TopItemDto } from './dto/overview.dto';
import { SalesSummary } from './entities/sales_summary';
import { Linegraph } from './dto/linegraph.dto';
import { Order } from 'src/employee-side/order/entities/order.entity';
import { OrderItem } from 'src/employee-side/order/entities/order-item.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(SalesSummary)
    private readonly salesSummaryRepository: Repository<SalesSummary>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
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

  async getOrderTopic(date: Date): Promise<any> {
    // Log the input date
    console.log(date);

    // Query for the total orders and canceled orders
    const salesSummary = await this.salesSummaryRepository.findOne({
      where: { date },
    });

    // Fallback values if no sales summary exists for the given date
    const totalOrders = salesSummary?.total_orders || 0;
    const canceledOrders = salesSummary?.canceled_orders || 0;

    // Query orders and their related items
    const orders = await this.orderRepository.find({
      // where: { order_date: date },
      // relations: ['order_items'], // Ensure you include relations to fetch associated order items
    });

    // Format the orders for the response
    const orderTopic = orders.map((order) => ({
      order_id: order.order_id,
      order_date: order.order_date,
      // quantity: order.order_items.reduce((sum, item) => sum + item.quantity, 0),
      quantity: 1,
      total_amount: order.total_price || 0,
      payment_method: 'Unknown', // Add real logic to fetch payment method if available
    }));

    // Return the formatted response
    return {
      total_order: totalOrders,
      canceled_orders: canceledOrders,
      order_topic: orderTopic,
    };
  }
}
