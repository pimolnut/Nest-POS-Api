import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topping } from '../menu-options/entities/topping.entity';
import { CreateToppingDto } from './dto/create-topping.dto';

@Injectable()
export class ToppingService {
  constructor(
    @InjectRepository(Topping)
    private readonly toppingRepository: Repository<Topping>,
  ) {}

  // Create a new topping
  async create(createToppingDto: CreateToppingDto): Promise<Topping> {
    const topping = this.toppingRepository.create(createToppingDto);
    return this.toppingRepository.save(topping);
  }

  // Get all toppings
  async findAll(): Promise<Topping[]> {
    return this.toppingRepository.find();
  }

  // Get a specific topping
  async findOne(id: number): Promise<Topping> {
    const topping = await this.toppingRepository.findOne({
      where: { topping_id: id },
    });
    if (!topping) {
      throw new NotFoundException(`Topping with ID ${id} not found`);
    }
    return topping;
  }

  // Update a topping
  async update(
    id: number,
    updateToppingDto: Partial<CreateToppingDto>,
  ): Promise<Topping> {
    const topping = await this.findOne(id);
    Object.assign(topping, updateToppingDto);
    return this.toppingRepository.save(topping);
  }

  // Delete a topping
  async remove(id: number): Promise<void> {
    const topping = await this.findOne(id);
    await this.toppingRepository.remove(topping);
  }
}
