import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner/create-owner.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginOwnerDto } from './dto/login-owner/login-owner.dto';
import { OwnerService } from './owner.service';
import { Readable } from 'stream';
import { sendTemporaryPasswordEmail } from '../utils/send-email.util';
import { UpdatePasswordDto } from './dto/update-password/update-password.dto';
import * as csvParser from 'csv-parser';

@Controller('owners')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}
  @Patch('reset-password/:id')
  async resetPassword(
    @Param('id') ownerId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.ownerService.updatePassword(+ownerId, updatePasswordDto);
  }
  // * Function Register Owner
  @Post('register')
  async register(@Body() createOwnerDto: CreateOwnerDto) {
    const existingOwner = await this.ownerService.findByEmail(
      createOwnerDto.email,
    );
    // * Check if there is already an email in the system.
    if (existingOwner) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    // * Create a new owner
    return this.ownerService.create(createOwnerDto);
  }

  // * Function Login Owner
  @Post('login')
  async login(@Body() loginOwnerDto: LoginOwnerDto) {
    return this.ownerService.login(loginOwnerDto);
  }

  // * Function upload and read CSV with owner data
  @Post('upload-csv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    // * Create an array to store the owner data from the CSV file.
    const owners: CreateOwnerDto[] = [];

    // * Convert the uploaded file (buffer) to a readable stream and use csv-parser to read the CSV data.
    const stream = Readable.from(file.buffer.toString());
    return new Promise((resolve, reject) => {
      stream
        // * Read the CSV data
        .pipe(csvParser())
        .on('data', async (row) => {
          // * Generate a random temporary password
          const tempPassword = Math.random().toString(36).slice(-8);
          // * Create a DTO for Owner from data in each row of the CSV file.
          const createOwnerDto: CreateOwnerDto = {
            owner_name: row.owner_name,
            contact_info: row.contact_info,
            email: row.email,
            password: tempPassword,
          };
          // * Send temporary password to the user's email
          await sendTemporaryPasswordEmail(createOwnerDto.email, tempPassword);
          // * Add the owner data to the array for later processing
          owners.push(createOwnerDto);
        })
        .on('end', async () => {
          try {
            // * Loop through each owner data into the database.
            for (const owner of owners) {
              await this.ownerService.create(owner);
            }
            resolve({ message: 'CSV data uploaded successfully' });
          } catch (error) {
            reject(
              new HttpException(
                'Error uploading CSV data',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          }
        })
        .on('error', (error) => {
          reject(
            new HttpException(
              `Error reading CSV file: ${error.message}`,
              HttpStatus.BAD_REQUEST,
            ),
          );
        });
    });
  }
}
