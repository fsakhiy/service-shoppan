import { IsNotEmpty, IsNumber } from 'class-validator';

class PurchaseProductDto {
  @IsNotEmpty()
  productId: string;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export { PurchaseProductDto };
