import { Test, TestingModule } from '@nestjs/testing';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';

describe('OwnerController', () => {
  let controller: OwnerController;
  let service: OwnerService;

  // Mock OwnerService
  const mockOwnerService = {
    create: jest.fn(), // mock ฟังก์ชัน create
    login: jest.fn(), // mock ฟังก์ชัน login
    findByEmail: jest.fn(), // mock ฟังก์ชัน findByEmail
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnerController],
      providers: [
        {
          provide: OwnerService,
          useValue: mockOwnerService, // ใช้ mock service แทนตัวจริง
        },
      ],
    }).compile();

    controller = module.get<OwnerController>(OwnerController);
    service = module.get<OwnerService>(OwnerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ทดสอบการเรียก create
  it('should call create method on the service', async () => {
    const dto = {
      owner_name: 'John Doe',
      contact_info: '123456789',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    mockOwnerService.findByEmail.mockResolvedValue(null); // mock ให้ findByEmail คืนค่าเป็น null (แสดงว่าไม่มี user นี้)

    await controller.register(dto); // เรียก controller register

    expect(service.create).toHaveBeenCalledWith(dto); // ตรวจสอบว่า service.create ถูกเรียกด้วย DTO ที่ถูกต้อง
  });

  // ทดสอบกรณีที่อีเมลมีอยู่แล้ว
  it('should throw error if email already exists', async () => {
    const dto = {
      owner_name: 'John Doe',
      contact_info: '123456789',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    mockOwnerService.findByEmail.mockResolvedValue(dto); // mock ให้ findByEmail คืนค่าเป็น DTO (แสดงว่ามี user นี้แล้ว)

    await expect(controller.register(dto)).rejects.toThrowError(
      'Email already exists',
    ); // ตรวจสอบว่ามีการ throw error
  });
});
