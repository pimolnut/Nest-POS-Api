import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateBranchDto {
  @IsString()
  @IsOptional()
  branch_name?: string;

  @IsString()
  @IsOptional()
  branch_address?: string;

  @IsString()
  @IsOptional()
  branch_phone_number?: string;

  @IsInt()
  @IsOptional()
  owner_id?: number;
}
