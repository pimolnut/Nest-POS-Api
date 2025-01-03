import { Controller, Post, Body, Param } from '@nestjs/common';
import { MenuOptionsService } from './menu-options.service';
import { CreateOptionDto } from './dto/create-option/create-option.dto';

@Controller('menu-options')
export class MenuOptionsController {
  constructor(private readonly menuOptionsService: MenuOptionsService) {}

  @Post(':type')
  createOption(
    @Param('type') type: 'sweetness' | 'size' | 'topping' | 'menu-type',
    @Body() createOptionDto: CreateOptionDto,
  ) {
    return this.menuOptionsService.createOption(type, createOptionDto);
  }

  @Post(':type/link/:menu_id/:option_id')
  linkOptionToMenu(
    @Param('type') type: 'sweetness' | 'size' | 'topping' | 'menu-type',
    @Param('menu_id') menu_id: number,
    @Param('option_id') option_id: number,
  ) {
    return this.menuOptionsService.linkOptionToMenu(menu_id, type, option_id);
  }
}
