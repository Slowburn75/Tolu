import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBrandDto, UpdateBrandDto } from './brands.dto';
import * as slugify from 'slugify';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: true } },
        products: {
          where: { status: 'ACTIVE' },
          take: 20,
          include: {
            images: { orderBy: { order: 'asc' }, take: 1 },
            categories: { include: { category: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async create(dto: CreateBrandDto) {
    let slug = slugify.default(dto.name, { lower: true, strict: true });

    const existing = await this.prisma.brand.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    return this.prisma.brand.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        logo: dto.logo,
      },
    });
  }

  async update(id: string, dto: UpdateBrandDto) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');

    const data: any = { ...dto };

    if (dto.name && dto.name !== brand.name) {
      let slug = slugify.default(dto.name, { lower: true, strict: true });
      const existing = await this.prisma.brand.findUnique({ where: { slug } });
      if (existing && existing.id !== id) slug = `${slug}-${Date.now()}`;
      data.slug = slug;
    }

    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: { products: { take: 1 } },
    });

    if (!brand) throw new NotFoundException('Brand not found');
    if (brand.products.length > 0) {
      throw new Error('Cannot delete brand with associated products');
    }

    await this.prisma.brand.delete({ where: { id } });
    return { message: 'Brand deleted successfully' };
  }
}
