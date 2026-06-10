import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './reviews.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('reviews/product/:productId')
  async findByProduct(@Param('productId') productId: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.reviewsService.findByProduct(productId, page, limit);
  }

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(userId, dto);
  }

  @Patch('reviews/:id')
  @UseGuards(JwtAuthGuard)
  async update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(userId, id, dto);
  }

  @Delete('reviews/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.reviewsService.delete(userId, id);
  }

  @Get('admin/reviews')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async adminFindAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.reviewsService.adminFindAll(page, limit);
  }

  @Patch('admin/reviews/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async approve(@Param('id') id: string) {
    return this.reviewsService.approve(id);
  }

  @Patch('admin/reviews/:id/hide')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async hide(@Param('id') id: string) {
    return this.reviewsService.hide(id);
  }

  @Delete('admin/reviews/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async adminDelete(@Param('id') id: string) {
    return this.reviewsService.adminDelete(id);
  }
}
