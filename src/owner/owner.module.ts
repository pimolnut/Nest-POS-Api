import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { Owner } from './entities/owner/owner.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Owner])], 
  controllers: [OwnerController],
  providers: [OwnerService],
})
export class OwnerModule {}
