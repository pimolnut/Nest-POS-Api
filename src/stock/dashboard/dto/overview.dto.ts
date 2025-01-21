import {
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TopItemDto {
  @IsString()
  name: string;

  @IsNumber()
  count: number;
}

export class Overview {
  @IsNumber()
  total_revenue: number;

  @IsNumber()
  total_orders: number;

  @IsNumber()
  canceled_orders: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopItemDto)
  top_three: TopItemDto[];

  @IsArray()
  @IsNumber({}, { each: true })
  monthly_revenue: number[];
}
