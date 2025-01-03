import { IsString, IsDecimal, IsNotEmpty } from 'class-validator';

export class CreateToppingDto {
  @IsString()
  @IsNotEmpty()
  topping_name: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;
}
