import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../auth/email.service';
import { CreateOrderDto, UpdateOrderStatusDto, UpdateTrackingDto } from './orders.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  private generateOrderNumber(): string {
    const prefix = 'TOL';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
  }

  async create(userId: string, dto: CreateOrderDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let subtotal = 0;
    const orderItemsData: Array<{
      productId: string;
      name: string;
      price: any;
      quantity: number;
      size?: string;
      color?: string;
      image: string | null;
    }> = [];

    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: { images: { take: 1, orderBy: { order: 'asc' } } },
      });
      if (!product || product.status !== 'ACTIVE') {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (item.quantity > product.stockQuantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }

      const price = product.discountPrice || product.price;
      subtotal += Number(price) * item.quantity;

      orderItemsData.push({
        productId: product.id,
        name: product.name,
        price: price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.images?.[0]?.url || null,
      });
    }

    let discount = 0;
    let couponId: string | null = null;

    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: dto.couponCode } });
      if (!coupon || !coupon.isActive) {
        throw new BadRequestException('Invalid coupon code');
      }
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new BadRequestException('Coupon has expired');
      }
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new BadRequestException('Coupon usage limit reached');
      }
      if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
        throw new BadRequestException(`Minimum order amount of ${coupon.minOrderAmount} required`);
      }

      if (coupon.discountType === 'PERCENTAGE') {
        discount = (subtotal * Number(coupon.discountValue)) / 100;
      } else {
        discount = Number(coupon.discountValue);
      }
      couponId = coupon.id;
    }

    const shippingFee = subtotal >= 50000 ? 0 : 2500;
    const total = Math.max(0, subtotal - discount + shippingFee);
    const orderNumber = this.generateOrderNumber();

    const shippingAddress = dto.shippingAddress;
    const billingAddress = dto.billingAddress || dto.shippingAddress;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        subtotal,
        shippingFee,
        discount,
        total,
        couponCode: dto.couponCode,
        shippingAddress: shippingAddress as any,
        billingAddress: billingAddress as any,
        deliveryMethod: dto.deliveryMethod,
        notes: dto.notes,
        couponId,
        items: { create: orderItemsData },
      },
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    for (const item of dto.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });

      await this.prisma.inventoryLog.create({
        data: {
          productId: item.productId,
          change: -item.quantity,
          type: 'ORDER',
          note: `Order #${orderNumber}`,
        },
      });
    }

    if (couponId) {
      await this.prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    try {
      await this.emailService.sendOrderConfirmationEmail(user.email, orderNumber);
    } catch {}

    return order;
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          items: { include: { product: { select: { id: true, slug: true, images: { take: 1, orderBy: { order: 'asc' } } } } } },
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: { select: { id: true, slug: true, name: true, images: { orderBy: { order: 'asc' } } } },
          },
        },
        payment: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async track(orderNumber: string, email: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        orderNumber,
        user: { email },
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        total: true,
        trackingNumber: true,
        courier: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            name: true,
            quantity: true,
            price: true,
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findAll(page = 1, limit = 20, status?: string, search?: string, userId?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: true,
          payment: true,
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'];

    const status = dto.status.toUpperCase();

    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid order status');
    }

    if (order.status === 'CANCELLED' || order.status === 'DELIVERED') {
      throw new BadRequestException(`Cannot update status of ${order.status.toLowerCase()} order`);
    }

    const updateData: any = { status: status as OrderStatus };

    if (status === 'PAID') updateData.paidAt = new Date();
    if (status === 'DELIVERED') updateData.deliveredAt = new Date();

    const updated = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true, user: { select: { email: true } } },
    });

    try {
      await this.emailService.sendOrderStatusUpdateEmail(updated.user.email, updated.orderNumber, status);
    } catch {}

    return updated;
  }

  async updateTracking(id: string, dto: UpdateTrackingDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: { trackingNumber: dto.trackingNumber, courier: dto.courier },
      include: { items: true, user: { select: { id: true, name: true, email: true } } },
    });
  }
}
