import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch/update-branch.dto';

@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  async create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  @Get()
  async findAll() {
    return this.branchService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.branchService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    return this.branchService.update(+id, updateBranchDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.branchService.remove(+id);
  }
}
