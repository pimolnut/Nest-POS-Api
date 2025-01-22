import { IsInt } from 'class-validator';

export class LinkOptionToMenuDto {
  @IsInt()
  menu_id: number;

  @IsInt()
  option_id: number;
}
