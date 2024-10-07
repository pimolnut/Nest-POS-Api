import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OwnerService } from './owner.service';
import { CreateOwnerDto } from './dto/create-owner/create-owner.dto';
import { LoginOwnerDto } from './dto/login-owner/login-owner.dto';
import { Express } from 'express';
import { Readable } from 'stream';
import * as csvParser from 'csv-parser';

@Controller('owners')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  // function Register
  @Post('register')
  async register(@Body() createOwnerDto: CreateOwnerDto) {
    const existingOwner = await this.ownerService.findByEmail(
      createOwnerDto.email,
    );
    //Check if there is already an email in the system.
    if (existingOwner) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    return this.ownerService.create(createOwnerDto);
  }

  // function Login
  @Post('login')
  async login(@Body() loginOwnerDto: LoginOwnerDto) {
    return this.ownerService.login(loginOwnerDto);
  }

  // function upload and read CSV
  @Post('upload-csv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    const owners: CreateOwnerDto[] = [];

    // Convert the uploaded file (buffer) to a readable stream and use csv-parser to read the CSV data.
    const stream = Readable.from(file.buffer.toString());
    return new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', (row) => {
          // Create a DTO for Owner from data in each row of the CSV file.
          const createOwnerDto: CreateOwnerDto = {
            owner_name: row.owner_name,
            contact_info: row.contact_info,
            email: row.email,
            password: row.password,
          };
          owners.push(createOwnerDto);
        })
        .on('end', async () => {
          try {
            // Loop through each owner data into the database.
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
