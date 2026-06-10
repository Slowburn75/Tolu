import { IsString, IsNumber, IsOptional, Min, IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
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

export class UpdateCartItemDto {
  @IsNumber()
  @Min(0)
  quantity: number;
}
