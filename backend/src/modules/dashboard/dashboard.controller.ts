import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('sales-chart')
  async getSalesChart(@Query('days') days?: number) {
    return this.dashboardService.getSalesChart(days || 30);
  }

  @Get('top-products')
  async getTopProducts(@Query('limit') limit?: number) {
    return this.dashboardService.getTopProducts(limit || 10);
  }

  @Get('top-categories')
  async getTopCategories(@Query('limit') limit?: number) {
    return this.dashboardService.getTopCategories(limit || 10);
  }

  @Get('recent-orders')
  async getRecentOrders(@Query('limit') limit?: number) {
    return this.dashboardService.getRecentOrders(limit || 10);
  }
}
