import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; subtitle?: string; link?: string; image: string; order?: number; isActive?: boolean }) {
    return this.prisma.banner.create({ data });
  }

  async findAll() {
    return this.prisma.banner.findMany({ orderBy: { order: 'asc' } });
  }

  async findActive() {
    return this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    return banner;
  }

  async update(id: string, data: Partial<{ title: string; subtitle: string; link: string; image: string; order: number; isActive: boolean }>) {
    await this.findOne(id);
    return this.prisma.banner.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.banner.delete({ where: { id } });
    return { message: 'Banner deleted successfully' };
  }
}
