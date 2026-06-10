import { IsString, IsOptional, IsObject, IsArray, IsNumber, Min, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderAddressDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;
}

export class CreateOrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => CreateOrderAddressDto)
  shippingAddress: CreateOrderAddressDto;

  @IsOptional()
  @IsObject()
  @Type(() => CreateOrderAddressDto)
  billingAddress?: CreateOrderAddressDto;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  deliveryMethod?: string;
}

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class UpdateTrackingDto {
  @IsString()
  @IsNotEmpty()
  trackingNumber: string;

  @IsOptional()
  @IsString()
  courier?: string;
}
