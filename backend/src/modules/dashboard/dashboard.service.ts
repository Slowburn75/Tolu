import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalRevenue, todayRevenue, weekRevenue, monthRevenue, totalOrders, todayOrders, weekOrders, monthOrders, totalUsers, todayUsers, totalProducts, activeProducts] = await Promise.all([
      this.prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID' } }),
      this.prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID', paidAt: { gte: startOfDay } } }),
      this.prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID', paidAt: { gte: startOfWeek } } }),
      this.prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID', paidAt: { gte: startOfMonth } } }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      this.prisma.order.count({ where: { createdAt: { gte: startOfWeek } } }),
      this.prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
      this.prisma.product.count(),
      this.prisma.product.count({ where: { status: 'ACTIVE' } }),
    ]);

    const pendingOrders = await this.prisma.order.count({ where: { status: 'PENDING' } });
    const processingOrders = await this.prisma.order.count({ where: { status: 'PROCESSING' } });
    const lowStockCount = await this.prisma.product.count({ where: { stockQuantity: { lte: 10 }, status: 'ACTIVE' } });

    return {
      revenue: {
        total: totalRevenue._sum.total || 0,
        today: todayRevenue._sum.total || 0,
        thisWeek: weekRevenue._sum.total || 0,
        thisMonth: monthRevenue._sum.total || 0,
      },
      orders: {
        total: totalOrders,
        today: todayOrders,
        thisWeek: weekOrders,
        thisMonth: monthOrders,
        pending: pendingOrders,
        processing: processingOrders,
      },
      users: { total: totalUsers, today: todayUsers },
      products: { total: totalProducts, active: activeProducts, lowStock: lowStockCount },
    };
  }

  async getSalesChart(days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.prisma.order.findMany({
      where: { paidAt: { gte: startDate, lte: endDate }, paymentStatus: 'PAID' },
      orderBy: { paidAt: 'asc' },
    });

    const dailyData: Record<string, number> = {};
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dailyData[d.toISOString().split('T')[0]] = 0;
    }

    orders.forEach((order) => {
      if (order.paidAt) {
        const dateKey = order.paidAt.toISOString().split('T')[0];
        dailyData[dateKey] = (dailyData[dateKey] || 0) + Number(order.total);
      }
    });

    return Object.entries(dailyData).map(([date, revenue]) => ({ date, revenue }));
  }

  async getTopProducts(limit = 10) {
    const topItems = await this.prisma.orderItem.groupBy({
      by: ['productId', 'name', 'image'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    return Promise.all(
      topItems.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { slug: true, price: true, images: { take: 1, orderBy: { order: 'asc' } } },
        });

        return {
          productId: item.productId,
          name: item.name,
          slug: product?.slug || '',
          image: product?.images?.[0]?.url || item.image || '',
          totalSold: item._sum.quantity || 0,
          price: product?.price || 0,
        };
      }),
    );
  }

  async getTopCategories(limit = 10) {
    const categories = await this.prisma.productCategory.groupBy({
      by: ['categoryId'],
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: limit,
    });

    return Promise.all(
      categories.map(async (cat) => {
        const category = await this.prisma.category.findUnique({
          where: { id: cat.categoryId },
          select: { id: true, name: true, slug: true, image: true },
        });
        return { ...category, productCount: cat._count.productId };
      }),
    );
  }

  async getRecentOrders(limit = 10) {
    return this.prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        items: { take: 3 },
      },
    });
  }
}
