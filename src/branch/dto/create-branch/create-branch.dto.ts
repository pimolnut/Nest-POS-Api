import { IsString, IsInt } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  branch_name: string;

  @IsString()
  branch_address: string;

  @IsString()
  branch_phone_number: string;

  @IsInt()
  owner_id: number;
}
