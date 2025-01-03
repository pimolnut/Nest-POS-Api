import { IsString, IsDecimal } from 'class-validator';

export class CreateSizeDto {
  @IsString()
  size_name: string;

  @IsDecimal()
  size_price: number;
}
