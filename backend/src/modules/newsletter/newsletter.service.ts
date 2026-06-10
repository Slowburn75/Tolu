import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(email: string) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.isActive) {
        throw new ConflictException('Email already subscribed');
      }
      await this.prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: true },
      });
      return { message: 'Successfully re-subscribed to newsletter' };
    }

    await this.prisma.newsletterSubscriber.create({ data: { email } });
    return { message: 'Successfully subscribed to newsletter' };
  }

  async unsubscribe(email: string) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (!existing) {
      return { message: 'Email not found in subscribers' };
    }

    await this.prisma.newsletterSubscriber.update({
      where: { email },
      data: { isActive: false },
    });

    return { message: 'Successfully unsubscribed from newsletter' };
  }

  async deleteSubscriber(id: string) {
    await this.prisma.newsletterSubscriber.delete({ where: { id } });
    return { message: 'Subscriber deleted successfully' };
  }

  async getSubscribers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      this.prisma.newsletterSubscriber.findMany({
        where: { isActive: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    ]);

    return {
      data: subscribers,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
