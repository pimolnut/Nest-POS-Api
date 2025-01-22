import {
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';


export class Linegraph {
  @IsNumber()
  total_revenue: number;

  @IsNumber()
  total_orders: number;

  @IsNumber()
  canceled_orders: number;

  @IsArray()
  @IsNumber({}, { each: true })
  monthly_revenue: number[];
}
