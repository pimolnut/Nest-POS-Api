import { IsInt, IsArray, ArrayNotEmpty } from 'class-validator';

export class LinkMenuToCategoryDto {
  @IsInt()
  category_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  menu_ids: number[]; // ลิสต์ของ menu_id ที่ต้องการเพิ่มในหมวดหมู่
}
