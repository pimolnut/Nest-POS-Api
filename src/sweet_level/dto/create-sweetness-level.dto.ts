import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateSweetnessLevelDto {
  @IsString()
  @IsNotEmpty()
  level_name: string;

  @IsInt()
  @IsNotEmpty()
  menu_id: number;
}
