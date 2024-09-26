import { Test, TestingModule } from '@nestjs/testing';
import { OwnerService } from './owner.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './entities/owner/owner.entity';
import * as bcrypt from 'bcrypt';

describe('OwnerService', () => {
  let service: OwnerService;
  let repository: Repository<Owner>;

  // Mock repository
  const mockOwnerRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks(); // รีเซ็ต mock ฟังก์ชันทุกครั้งก่อนเริ่มการทดสอบ
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnerService,
        {
          provide: getRepositoryToken(Owner),  // Mock repository
          useValue: mockOwnerRepository,
        },
      ],
    }).compile();

    service = module.get<OwnerService>(OwnerService);
    repository = module.get<Repository<Owner>>(getRepositoryToken(Owner));
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
      };

      // Mock findByEmail
      jest.spyOn(service, 'findByEmail').mockResolvedValue(owner);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);  // Mock password comparison

      const result = await service.login({
        email: 'john.doe@example.com',
        password: 'password123',
      });

      expect(result).toEqual(owner);
      expect(service.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', owner.password);
    });

    it('should throw an error if password is invalid', async () => {
      const owner = {
        owner_id: 1,
        owner_name: 'John Doe',
        contact_info: '123456789',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      // Mock findByEmail
      jest.spyOn(service, 'findByEmail').mockResolvedValue(owner);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);  // Mock password comparison failed

      await expect(
        service.login({ email: 'john.doe@example.com', password: 'wrongpassword' }),
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw an error if email is not found', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(undefined);  // Mock email not found

      await expect(
        service.login({ email: 'john.doe@example.com', password: 'password123' }),
      ).rejects.toThrow('Invalid email or password');
    });
  });
});
