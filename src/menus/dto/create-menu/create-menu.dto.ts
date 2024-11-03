import { IsString, IsInt, IsOptional, IsDecimal, IsUrl } from 'class-validator';

export class CreateMenuDto {
  @IsInt()
  store_id: number;

  @IsInt()
  category_id: number;

  @IsString()
  menu_name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal()
  price: number;

  @IsInt()
  owner_id: number;

  @IsInt()
  branch_id: number;

  @IsUrl()
  @IsOptional()
  image_url?: string;
}
