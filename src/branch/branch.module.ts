import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchService } from './branch.service';
import { Branch } from './entities/branch/branch.entity';
import { BranchController } from './branch.controller';
import { OwnerModule } from '../owner/owner.module';

@Module({
  imports: [TypeOrmModule.forFeature([Branch]),
  OwnerModule,
], 
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService, TypeOrmModule],
})
export class BranchModule {}
