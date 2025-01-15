import { IsEnum, IsInt, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { Column } from 'typeorm';

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

  @Column({ default: 'รอทำ' }) // สถานะเริ่มต้น
  status: string;

  @IsEnum(CancelStatus)
  @IsNotEmpty()
  cancel_status: CancelStatus;

  @Column({ nullable: true })
  customer_name: string;

  @Column({ nullable: true })
  contact: string;
}
