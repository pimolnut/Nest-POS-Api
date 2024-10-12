import { Test, TestingModule } from '@nestjs/testing';
import { OwnerService } from '../../src/owner/owner.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Owner } from '../../src/owner/entities/owner/owner.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

describe('OwnerService', () => {
  let service: OwnerService;

  // Mock repository
  const mockOwnerRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockOwner = {
    email: 'test@example.com',
    otp: null,
    otpExpiry: null,
    password: 'hashedpassword',
    save: jest.fn(),
  };

  const mockMailService = {
    sendOtpEmail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks(); // Clear all mock calls
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnerService,
        {
          provide: getRepositoryToken(Owner), // Mock repository
          useValue: mockOwnerRepository,
        },
      ],
    }).compile();
    service = module.get<OwnerService>(OwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return an owner by email', async () => {
      const owner = {
        owner_id: 1,
        owner_name: 'John Doe',
        contact_info: '123456789',
        email: 'john.doe@example.com',
        password: 'hashed_password',
      };

      // Mock findOne
      mockOwnerRepository.findOne.mockResolvedValue(owner);

      const result = await service.findByEmail('john.doe@example.com');
      expect(result).toEqual(owner);
      expect(mockOwnerRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
      });
    });

    it('should return undefined if no owner is found', async () => {
      mockOwnerRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findByEmail('john.doe@example.com');
      expect(result).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should validate password and return the owner', async () => {
      const owner = {
        owner_id: 1,
        owner_name: 'John Doe',
        contact_info: '123456789',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 10),
        otp: '123456',
        otpExpiry: new Date(Date.now() + 300000),
      };

      // Mock findByEmail
      jest.spyOn(service, 'findByEmail').mockResolvedValue(owner);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // Mock password comparison

      const result = await service.login({
        email: 'john.doe@example.com',
        password: 'password123',
      });

      expect(result).toEqual(owner);
      expect(service.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        owner.password,
      );
    });

    it('should throw an error if password is invalid', async () => {
      const owner = {
        owner_id: 1,
        owner_name: 'John Doe',
        contact_info: '123456789',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 10),
        otp: '123456', // เพิ่ม otp ให้ตรงตาม type
        otpExpiry: new Date(Date.now() + 300000),
      };

      // Mock findByEmail
      jest.spyOn(service, 'findByEmail').mockResolvedValue(owner);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // Mock password comparison failed

      await expect(
        service.login({
          email: 'john.doe@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw an error if email is not found', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(undefined); // Mock email not found

      await expect(
        service.login({
          email: 'john.doe@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('forgotPassword', () => {
    it('should send OTP to the user email', async () => {
      mockOwnerRepository.findOne.mockResolvedValueOnce(mockOwner);
      mockMailService.sendOtpEmail.mockResolvedValueOnce(undefined);

      await service.forgotPassword({ usernameOrEmail: 'test@example.com' });

      expect(mockOwner.otp).toBeDefined();
      expect(mockOwner.otpExpiry).toBeDefined();
      expect(mockMailService.sendOtpEmail).toHaveBeenCalledWith(
        'test@example.com',
        mockOwner.otp,
      );
      expect(mockOwnerRepository.save).toHaveBeenCalledWith(mockOwner);
    });

    it('should throw BadRequestException if user is not found', async () => {
      mockOwnerRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.forgotPassword({ usernameOrEmail: 'notfound@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('verifyOtp', () => {
    it('should verify OTP and allow user to reset password', async () => {
      mockOwnerRepository.findOne.mockResolvedValueOnce({
        ...mockOwner,
        otp: '123456',
        otpExpiry: new Date(Date.now() + 300000), // 5 นาทีในอนาคต
      });

      await service.verifyOtp({
        usernameOrEmail: 'test@example.com',
        otp: '123456',
      });

      expect(mockOwner.otp).toBeNull();
      expect(mockOwner.otpExpiry).toBeNull();
      expect(mockOwnerRepository.save).toHaveBeenCalledWith(mockOwner);
    });
    it('should throw BadRequestException if OTP is incorrect or expired', async () => {
      mockOwnerRepository.findOne.mockResolvedValueOnce({
        ...mockOwner,
        otp: '123456',
        otpExpiry: new Date(Date.now() - 300000), // หมดอายุแล้ว
      });

      await expect(
        service.verifyOtp({
          usernameOrEmail: 'test@example.com',
          otp: '123456',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPassword', () => {
    it('should reset password for the user', async () => {
      const newPassword = 'newpassword123';
      mockOwnerRepository.findOne.mockResolvedValueOnce(mockOwner);
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedNewPassword');

      await service.resetPassword({
        usernameOrEmail: 'test@example.com',
        newPassword,
      });

      expect(mockOwner.password).toEqual('hashedNewPassword');
      expect(mockOwnerRepository.save).toHaveBeenCalledWith(mockOwner);
    });

    it('should throw BadRequestException if user is not found', async () => {
      mockOwnerRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.resetPassword({
          usernameOrEmail: 'notfound@example.com',
          newPassword: 'password123',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
