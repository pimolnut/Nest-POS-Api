import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity/branch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch]), // Registers the repository
  ],
  providers: [BranchService],
  controllers: [BranchController],
})
export class BranchModule {}
