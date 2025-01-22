import { IsString, IsInt, IsOptional, IsDecimal, IsUrl } from 'class-validator';

export class UpdateMenuDto {
  @IsInt()
  @IsOptional()
  store_id?: number;

  @IsInt()
  @IsOptional()
  category_id?: number;

  @IsString()
  @IsOptional()
  menu_name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal()
  @IsOptional()
  price?: number;

  @IsInt()
  @IsOptional()
  owner_id?: number;

  @IsInt()
  @IsOptional()
  branch_id?: number;

  @IsUrl()
  @IsOptional()
  image_url?: string;
}
