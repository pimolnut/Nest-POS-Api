import {
  IsString,
  IsDecimal,
  IsOptional,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreateOptionDto {
  @IsString()
  name: string;

  @IsDecimal()
  @IsOptional()
  price?: number;

  @IsInt()
  @IsNotEmpty()
  menu_id: number;
}
