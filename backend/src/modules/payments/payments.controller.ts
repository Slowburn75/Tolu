import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto, VerifyPaymentDto } from './payments.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('paystack/initialize')
  @UseGuards(JwtAuthGuard)
  async initializePaystack(@Body() dto: InitializePaymentDto) {
    return this.paymentsService.initializePaystack(dto);
  }

  @Post('paystack/verify')
  @UseGuards(JwtAuthGuard)
  async verifyPaystack(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPaystack(dto);
  }

  @Post('flutterwave/initialize')
  @UseGuards(JwtAuthGuard)
  async initializeFlutterwave(@Body() dto: InitializePaymentDto) {
    return this.paymentsService.initializeFlutterwave(dto);
  }

  @Post('flutterwave/verify')
  @UseGuards(JwtAuthGuard)
  async verifyFlutterwave(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyFlutterwave(dto);
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
