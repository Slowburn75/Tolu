import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class InitializePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsOptional()
  @IsString()
  callbackUrl?: string;
}

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  provider: string;
}
