import { IsInt, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  menu_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  price: number;

  @IsInt()
  category_id: number;

  @IsInt()
  owner_id: number;

  @IsInt()
  branch_id: number;

  @IsOptional()
  @IsString()
  image_url?: string;
}
