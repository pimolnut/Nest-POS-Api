import { IsEnum, IsInt, IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { CancelStatus } from '../create-order/create-order.dto';

export class UpdateOrderDto {
  @IsInt()
  @IsOptional()
  customer_id?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  order_date?: Date;

  @IsInt()
  @IsOptional()
  total_price?: number;

  @IsInt()
  @IsOptional()
  queue_number?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsEnum(CancelStatus)
  @IsOptional()
  cancel_status?: CancelStatus;
}
