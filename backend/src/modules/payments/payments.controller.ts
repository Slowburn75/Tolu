import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto, VerifyPaymentDto } from './payments.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('paystack/initialize')
  @UseGuards(JwtAuthGuard)
  async initializePaystack(@CurrentUser('id') userId: string, @Body() dto: InitializePaymentDto) {
    return this.paymentsService.initializePaystack(userId, dto);
  }

  @Post('paystack/verify')
  @UseGuards(JwtAuthGuard)
  async verifyPaystack(@CurrentUser('id') userId: string, @Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPaystack(userId, dto);
  }

  @Post('flutterwave/initialize')
  @UseGuards(JwtAuthGuard)
  async initializeFlutterwave(@CurrentUser('id') userId: string, @Body() dto: InitializePaymentDto) {
    return this.paymentsService.initializeFlutterwave(userId, dto);
  }

  @Post('flutterwave/verify')
  @UseGuards(JwtAuthGuard)
  async verifyFlutterwave(@CurrentUser('id') userId: string, @Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyFlutterwave(userId, dto);
  }

  @Post('webhook/paystack')
  async handlePaystackWebhook(@Body() payload: any) {
    return this.paymentsService.handlePaystackWebhook(payload);
  }

  @Post('webhook/flutterwave')
  async handleFlutterwaveWebhook(@Body() payload: any) {
    return this.paymentsService.handleFlutterwaveWebhook(payload);
  }
}
