import { Injectable, HttpException, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InitializePaymentDto, VerifyPaymentDto } from './payments.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private async getPaystackHeaders() {
    const secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    return {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  private async getFlutterwaveHeaders() {
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY || '';
    return {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  async initializePaystack(dto: InitializePaymentDto) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.paymentStatus === 'PAID') throw new BadRequestException('Order already paid');

    const headers = await this.getPaystackHeaders();
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: (await this.prisma.user.findUnique({ where: { id: order.userId } }))?.email,
        amount: Math.round(Number(order.total) * 100),
        reference: `TOL-${order.orderNumber}-${Date.now()}`,
        callback_url: dto.callbackUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.id}`,
        metadata: { orderId: order.id, orderNumber: order.orderNumber },
      }),
    });

    const data = await response.json();
    if (!data.status) throw new HttpException(data.message || 'Paystack initialization failed', HttpStatus.BAD_REQUEST);

    return { authorizationUrl: data.data.authorization_url, reference: data.data.reference, accessCode: data.data.access_code };
  }

  async verifyPaystack(dto: VerifyPaymentDto) {
    const headers = await this.getPaystackHeaders();
    const response = await fetch(`https://api.paystack.co/transaction/verify/${dto.reference}`, { headers });
    const data = await response.json();

    if (!data.status || data.data.status !== 'success') {
      throw new HttpException('Payment verification failed', HttpStatus.BAD_REQUEST);
    }

    const metadata = data.data.metadata;
    const order = await this.prisma.order.findUnique({ where: { id: metadata.orderId } });
    if (!order) throw new NotFoundException('Order not found');

    await this.prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'PAID', status: 'PAID', paidAt: new Date() },
    });

    await this.prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        provider: 'paystack',
        reference: dto.reference,
        transactionId: String(data.data.id),
        status: 'success',
        amount: order.total,
        currency: 'NGN',
      },
      update: {
        reference: dto.reference,
        transactionId: String(data.data.id),
        status: 'success',
      },
    });

    return { message: 'Payment verified successfully', orderId: order.id };
  }

  async initializeFlutterwave(dto: InitializePaymentDto) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.paymentStatus === 'PAID') throw new BadRequestException('Order already paid');

    const user = await this.prisma.user.findUnique({ where: { id: order.userId } });

    const headers = await this.getFlutterwaveHeaders();
    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tx_ref: `TOL-${order.orderNumber}-${Date.now()}`,
        amount: Number(order.total),
        currency: 'NGN',
        redirect_url: dto.callbackUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.id}`,
        customer: { email: user?.email, name: user?.name },
        meta: { orderId: order.id, orderNumber: order.orderNumber },
      }),
    });

    const data = await response.json();
    if (data.status !== 'success') throw new HttpException(data.message || 'Flutterwave initialization failed', HttpStatus.BAD_REQUEST);

    return { authorizationUrl: data.data.link, reference: data.data.tx_ref };
  }

  async verifyFlutterwave(dto: VerifyPaymentDto) {
    const headers = await this.getFlutterwaveHeaders();
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${dto.reference}`, { headers });
    const data = await response.json();

    if (data.status !== 'success' || data.data.status !== 'successful') {
      throw new HttpException('Payment verification failed', HttpStatus.BAD_REQUEST);
    }

    const meta = data.data.meta || {};
    const order = await this.prisma.order.findUnique({ where: { id: meta.orderId } });
    if (!order) throw new NotFoundException('Order not found');

    await this.prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'PAID', status: 'PAID', paidAt: new Date() },
    });

    await this.prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        provider: 'flutterwave',
        reference: dto.reference,
        transactionId: String(data.data.id),
        status: 'success',
        amount: order.total,
        currency: 'NGN',
      },
      update: {
        reference: dto.reference,
        transactionId: String(data.data.id),
        status: 'success',
      },
    });

    return { message: 'Payment verified successfully', orderId: order.id };
  }

  async handlePaystackWebhook(payload: any) {
    const event = payload.event;
    if (event === 'charge.success') {
      const reference = payload.data.reference;
      const metadata = payload.data.metadata;
      if (metadata?.orderId) {
        const order = await this.prisma.order.findUnique({ where: { id: metadata.orderId } });
        if (order && order.paymentStatus !== 'PAID') {
          await this.prisma.order.update({
            where: { id: order.id },
            data: { paymentStatus: 'PAID', status: 'PAID', paidAt: new Date() },
          });

          await this.prisma.payment.upsert({
            where: { orderId: order.id },
            create: {
              orderId: order.id,
              provider: 'paystack',
              reference,
              transactionId: String(payload.data.id),
              status: 'success',
              amount: order.total,
              currency: payload.data.currency || 'NGN',
            },
            update: { status: 'success', transactionId: String(payload.data.id) },
          });
        }
      }
    }
    return { message: 'Webhook processed' };
  }

  async handleFlutterwaveWebhook(payload: any) {
    if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
      const txRef = payload.data.tx_ref;
      const payment = await this.prisma.payment.findFirst({ where: { reference: txRef } });
      if (!payment) {
        const meta = payload.data.meta || {};
        if (meta.orderId) {
          const order = await this.prisma.order.findUnique({ where: { id: meta.orderId } });
          if (order && order.paymentStatus !== 'PAID') {
            await this.prisma.order.update({
              where: { id: order.id },
              data: { paymentStatus: 'PAID', status: 'PAID', paidAt: new Date() },
            });

            await this.prisma.payment.create({
              data: {
                orderId: order.id,
                provider: 'flutterwave',
                reference: txRef,
                transactionId: String(payload.data.id),
                status: 'success',
                amount: order.total,
                currency: payload.data.currency || 'NGN',
              },
            });
          }
        }
      }
    }
    return { message: 'Webhook processed' };
  }
}
