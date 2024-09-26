import { IsEnum, IsInt, IsNotEmpty, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export enum CancelStatus {
  RefundComplete = 'คืนเงินเสร็จสิ้น',
  RefundPending = 'ยังไม่คืนเงิน',
}

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  customer_id: number;

  @IsDate()
  @Type(() => Date)
  order_date: Date;

  @IsInt()
  @IsNotEmpty()
  total_price: number;

  @IsInt()
  @IsNotEmpty()
  queue_number: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsEnum(CancelStatus)
  @IsNotEmpty()
  cancel_status: CancelStatus;
}
