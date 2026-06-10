import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';
import * as slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        children: { include: { _count: { select: { products: true } } } },
        parent: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });

    const topLevel = categories.filter((c) => !c.parentId);
    const childMap = new Map<string, any[]>();
    categories.forEach((c) => {
      if (c.parentId) {
        const existing = childMap.get(c.parentId) || [];
        existing.push(c);
        childMap.set(c.parentId, existing);
      }
    });

    return topLevel.map((cat) => ({
      ...cat,
      subcategories: childMap.get(cat.id) || [],
    }));
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          include: { _count: { select: { products: true } } },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(dto: CreateCategoryDto) {
    let slug = slugify.default(dto.name, { lower: true, strict: true });

    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException('Parent category not found');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        image: dto.image,
        parentId: dto.parentId,
      },
      include: { parent: true, children: true },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    const data: any = { ...dto };

    if (dto.name && dto.name !== category.name) {
      let slug = slugify.default(dto.name, { lower: true, strict: true });
      const existing = await this.prisma.category.findUnique({ where: { slug } });
      if (existing && existing.id !== id) slug = `${slug}-${Date.now()}`;
      data.slug = slug;
    }

    if (dto.parentId === id) {
      throw new ConflictException('Category cannot be its own parent');
    }

    return this.prisma.category.update({
      where: { id },
      data,
      include: { parent: true, children: true },
    });
  }

  async delete(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true, products: { take: 1 } },
    });

    if (!category) throw new NotFoundException('Category not found');
    if (category.children.length > 0) {
      throw new ConflictException('Cannot delete category with subcategories. Remove subcategories first.');
    }
    if (category.products.length > 0) {
      throw new ConflictException('Cannot delete category with associated products. Remove products first.');
    }

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}
