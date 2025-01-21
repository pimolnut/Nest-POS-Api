import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  category_name: string;

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  // @IsInt({ each: true })
  menu_id: number[];
}
