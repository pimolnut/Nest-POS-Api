import {
  IsString,
  IsDecimal,
  IsOptional,
  IsInt,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class CreateOptionDto {
  @IsString()
  add_on_name: string;

  @IsDecimal()
  @IsOptional()
  price?: number;

  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  menu_id: number;
}
