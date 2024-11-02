import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const order = await this.orderService.findOne(+id);
    if (!order) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Order not found' });
    }
    return res.status(HttpStatus.OK).json(order);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() res: Response,
  ) {
    const existingOrder = await this.orderService.findOne(+id);
    if (!existingOrder) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Order not found' });
    }

    // ถ้าพบข้อมูล ให้ทำการอัปเดต
    const updatedOrder = await this.orderService.update(+id, updateOrderDto);
    return res.status(HttpStatus.OK).json(updatedOrder);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Res() res: Response) {
    const order = await this.orderService.findOne(+id);
    if (!order) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Order not found' });
    }
    await this.orderService.remove(+id);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
