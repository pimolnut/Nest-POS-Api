import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CancelStatus } from './dto/create-order/create-order.dto';

const mockOrderRepository = {
  findOneBy: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
};

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        customer_id: 123,
        order_date: new Date(),
        total_price: 100,
        queue_number: 5,
        status: 'processing',
        cancel_status: CancelStatus.RefundPending,
      };

      const mockOrder = {
        order_id: 1,
        ...createOrderDto,
      };

      mockOrderRepository.create.mockReturnValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);

      const result = await service.create(createOrderDto);

      expect(result).toEqual(mockOrder);
      expect(repository.create).toHaveBeenCalledWith(createOrderDto);
      expect(repository.save).toHaveBeenCalledWith(mockOrder);
    });
  });

  describe('findOne', () => {
    it('should return an order if found', async () => {
      const mockOrder = {
        order_id: 1,
        customer_id: 123,
        order_date: new Date(),
        total_price: 100,
        queue_number: 5,
        status: 'processing',
        cancel_status: CancelStatus.RefundPending,
      };

      mockOrderRepository.findOneBy.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);
      expect(result).toEqual(mockOrder);
      expect(repository.findOneBy).toHaveBeenCalledWith({ order_id: 1 });
    });

    it('should return undefined if order not found', async () => {
      mockOrderRepository.findOneBy.mockResolvedValue(undefined);

      const result = await service.findOne(1);
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update an existing order', async () => {
      const updateOrderDto = { status: 'completed' };
      const mockOrder = {
        order_id: 1,
        customer_id: 123,
        order_date: new Date(),
        total_price: 100,
        queue_number: 5,
        status: 'processing',
        cancel_status: CancelStatus.RefundPending,
      };

      mockOrderRepository.findOneBy.mockResolvedValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue({
        ...mockOrder,
        ...updateOrderDto,
      });

      const result = await service.update(1, updateOrderDto);
      expect(result).toEqual({
        ...mockOrder,
        ...updateOrderDto,
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockOrder,
        ...updateOrderDto,
      });
    });

    it('should return undefined if order not found', async () => {
      mockOrderRepository.findOneBy.mockResolvedValue(undefined);

      const result = await service.update(1, { status: 'completed' });
      expect(result).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      mockOrderRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);
      expect(result).toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if order not found', async () => {
      mockOrderRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrowError(
        'Order with ID 1 not found',
      );
    });
  });
});
