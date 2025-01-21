import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { Owner } from './entities/owner/owner.entity';

/**
 * * The OwnerModule is responsible for handling everything related to Owners.
 * * This includes managing owner data, handling registration and login, and
 * * interacting with the Owner entity in the database.
 */
@Module({
  /**
   * * Imports the TypeOrmModule for the Owner entity.
   * * This allows us to use the repository pattern with TypeORM for interacting
   * * with the 'owner' table in the database.
   */
  imports: [TypeOrmModule.forFeature([Owner])],

  /**
   * * Controllers define the routes and the HTTP methods for interacting with the owner data.
   * * Here we are using OwnerController to handle routes like registering and logging in owners.
   */
  controllers: [OwnerController],

  /**
   * * Providers define the services used within this module.
   * * The OwnerService contains the business logic for creating, updating, and managing owners.
   */
  providers: [OwnerService],

  exports: [OwnerService, TypeOrmModule],
})
export class OwnerModule {}
