import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './addresses.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(userId: string, dto: CreateAddressDto) {
    const count = await this.prisma.address.count({ where: { userId } });
    const isDefault = dto.isDefault ?? count === 0;

    if (isDefault) {
      await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    return this.prisma.address.create({
      data: {
        ...dto,
        country: dto.country || 'Nigeria',
        isDefault,
        userId,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateAddressDto) {
    await this.findOwned(userId, id);

    if (dto.isDefault) {
      await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    return this.prisma.address.update({
      where: { id },
      data: dto,
    });
  }

  async setDefault(userId: string, id: string) {
    await this.findOwned(userId, id);
    await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    return this.prisma.address.update({ where: { id }, data: { isDefault: true } });
  }

  async delete(userId: string, id: string) {
    const address = await this.findOwned(userId, id);
    await this.prisma.address.delete({ where: { id } });

    if (address.isDefault) {
      const next = await this.prisma.address.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } });
      if (next) {
        await this.prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
      }
    }

    return { message: 'Address deleted successfully' };
  }

  private async findOwned(userId: string, id: string) {
    const address = await this.prisma.address.findFirst({ where: { id, userId } });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }
}
