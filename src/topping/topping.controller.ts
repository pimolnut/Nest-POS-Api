import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ToppingService } from 'src/topping/topping.service';

import { CreateToppingDto } from './dto/create-topping.dto';

@Controller('toppings')
export class ToppingController {
  constructor(private readonly toppingService: ToppingService) {}

  // Create a new topping
  @Post()
  create(@Body() createToppingDto: CreateToppingDto) {
    return this.toppingService.create(createToppingDto);
  }

  // Get all toppings
  @Get()
  findAll() {
    return this.toppingService.findAll();
  }

  // Get a specific topping
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.toppingService.findOne(id);
  }

  // Update a topping
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateToppingDto: Partial<CreateToppingDto>,
  ) {
    return this.toppingService.update(id, updateToppingDto);
  }

  // Delete a topping
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.toppingService.remove(id);
  }
}
