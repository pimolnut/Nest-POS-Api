import { IsInt, IsString } from 'class-validator';

export class CancelOrderDto {
  @IsInt()
  order_id: number;

  @IsString()
  customer_name: string;

  @IsString()
  contact: string;
}
