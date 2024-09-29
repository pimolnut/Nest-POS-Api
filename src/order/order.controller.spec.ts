import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order/create-order.dto';
import { UpdateOrderDto } from './dto/update-order/update-order.dto';
import { CancelStatus } from './dto/create-order/create-order.dto'; 
import { Response } from 'express';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;
  let res: Partial<Response>;


  const mockOrder = {
    order_id: 1,
    customer_id: 123,
    order_date: new Date(),
    total_price: 100,
    queue_number: 5,
    status: 'processing',
    cancel_status: CancelStatus.RefundPending, 
  };

  
  const mockOrderService = {
    create: jest.fn().mockResolvedValue(mockOrder),
    findAll: jest.fn().mockResolvedValue([mockOrder]),
    findOne: jest.fn().mockResolvedValue(mockOrder),
    update: jest.fn().mockResolvedValue(mockOrder),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService, 
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an order', async () => {
    const createOrderDto: CreateOrderDto = {
      customer_id: 123,
      order_date: new Date(),
      total_price: 100,
      queue_number: 5,
      status: 'processing',
      cancel_status: CancelStatus.RefundPending, 
    };
    const result = await controller.create(createOrderDto);
    expect(result).toEqual(mockOrder);
    expect(service.create).toHaveBeenCalledWith(createOrderDto);
  });

  it('should return an array of orders', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockOrder]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single order by ID', async () => {
    await controller.findOne('1', res as Response);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockOrder);
  });

  it('should update an order', async () => {
    const updateOrderDto: UpdateOrderDto = {
      status: 'completed',
    };
    await controller.update('1', updateOrderDto, res as Response);
    expect(service.update).toHaveBeenCalledWith(1, updateOrderDto);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockOrder);
  });

  it('should remove an order by ID', async () => {
    await controller.remove('1', res as Response);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
