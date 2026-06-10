import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './wishlist.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@CurrentUser('id') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @Post('items')
  async addItem(@CurrentUser('id') userId: string, @Body() dto: AddToWishlistDto) {
    return this.wishlistService.addItem(userId, dto.productId);
  }

  @Delete('items/:id')
  async removeItem(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.wishlistService.removeItem(userId, id);
  }
}
