import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SweetnessLevel } from './entities/sweetness-level.entity';
import { Size } from './entities/size.entity';
import { MenuType } from './entities/menu-type.entity';
import { Menu } from 'src/menus/entities/menu.entity';
import { CreateOptionDto } from './dto/create-option/create-option.dto';
import { AddOn } from './entities/add-on.entity';

@Injectable()
export class MenuOptionsService {
  constructor(
    @InjectRepository(SweetnessLevel)
    private readonly sweetnessRepository: Repository<SweetnessLevel>,
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
    @InjectRepository(AddOn)
    private readonly addOnRepository: Repository<AddOn>,
    @InjectRepository(MenuType)
    private readonly menuTypeRepository: Repository<MenuType>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async createOption(type: string, createOptionDto: CreateOptionDto) {
    let repository: Repository<any>;

    switch (type) {
      case 'sweetness':
        repository = this.sweetnessRepository;
        break;
      case 'size':
        repository = this.sizeRepository;
        break;
      case 'add-ons':
        repository = this.addOnRepository;
        break;
      case 'menu-type':
        repository = this.menuTypeRepository;
        break;
      default:
        throw new NotFoundException(`Invalid option type: ${type}`);
    }

    const menu = await this.menuRepository.findOne({
      where: { menu_id: createOptionDto.menu_id },
    });
    if (!menu) {
      throw new NotFoundException(
        `Menu with ID ${createOptionDto.menu_id} not found`,
      );
    }

    // สร้างตัวเลือกพร้อมลิงก์กับเมนู
    const option = repository.create({
      ...createOptionDto,
      menu, // ลิงก์กับเมนู
    });

    return repository.save(option);
  }

  // const option = repository.create(createOptionDto);
  // return repository.save(option);

  async linkOptionToMenu(menu_id: number, type: string, option_id: number) {
    const menu = await this.menuRepository.findOne({ where: { menu_id } });
    if (!menu) throw new NotFoundException(`Menu with ID ${menu_id} not found`);

    let repository: Repository<any>;
    let relationField: string;

    switch (type) {
      case 'sweetness':
        repository = this.sweetnessRepository;
        relationField = 'sweetnessLevels';
        break;
      case 'size':
        repository = this.sizeRepository;
        relationField = 'sizes';
        break;
      case 'add-ons':
        repository = this.addOnRepository;
        relationField = 'add-ons';
        break;
      case 'menu-type':
        repository = this.menuTypeRepository;
        relationField = 'menuTypes';
        break;
      default:
        throw new NotFoundException(`Invalid option type: ${type}`);
    }

    const option = await repository.findOne({ where: { id: option_id } });
    if (!option)
      throw new NotFoundException(`Option with ID ${option_id} not found`);

    menu[relationField].push(option);
    return this.menuRepository.save(menu);
  }
}
