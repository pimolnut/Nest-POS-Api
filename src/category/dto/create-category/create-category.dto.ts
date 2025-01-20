import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  category_name: string;

  @IsArray()
  @ArrayNotEmpty()
  // @IsInt({ each: true })
  menu_id: number[];
}
