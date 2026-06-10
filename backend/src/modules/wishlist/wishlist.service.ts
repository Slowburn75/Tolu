import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    let wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { order: 'asc' }, take: 1 },
                brand: true,
                _count: { select: { reviews: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { orderBy: { order: 'asc' }, take: 1 },
                  brand: true,
                  _count: { select: { reviews: true } },
                },
              },
            },
          },
        },
      });
    }

    return wishlist;
  }

  async addItem(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.status !== 'ACTIVE') {
      throw new NotFoundException('Product not found');
    }

    let wishlist = await this.prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({ data: { userId } });
    }

    const existingItem = await this.prisma.wishlistItem.findFirst({
      where: { wishlistId: wishlist.id, productId },
    });

    if (existingItem) {
      throw new ConflictException('Product already in wishlist');
    }

    await this.prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
    });

    return this.getWishlist(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const wishlist = await this.prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) throw new NotFoundException('Wishlist not found');

    const item = await this.prisma.wishlistItem.findFirst({
      where: { id: itemId, wishlistId: wishlist.id },
    });

    if (!item) throw new NotFoundException('Wishlist item not found');

    await this.prisma.wishlistItem.delete({ where: { id: itemId } });
    return this.getWishlist(userId);
  }
}
