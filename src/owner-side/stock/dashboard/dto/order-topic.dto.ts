import {
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderTopic {
  @IsNumber()
  order_id: number;

  @IsDate()
  order_date: Date;

  @IsString()
  quantity: string;

  @IsString()
  total_amount: string;

  @IsString()
  payment_method: string;
}

export class OrderTopicDto {
  @IsNumber()
  total_orders: number;

  @IsNumber()
  canceled_orders: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderTopic)
  order_topic: OrderTopic[];
}
