import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { UpdateMenuDto } from './dto/update-menu.dto/update-menu.dto';
import { CreateOptionDto } from './dto/create-option/create-option.dto';

import { CreateMenuDto } from './dto/create-menu/create-menu.dto';

@Controller('owner/menus')
export class MenuController {
  constructor(
    private readonly menuService: MenuService, // Inject MenuService
  ) {}

  // * Create a new menu
  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  // * Get all menus
  @HttpCode(200)
  @Get()
  findAll() {
    return this.menuService.findAll();
  }

    // * Get all menus send only name & description for list menu:customer
    // @HttpCode(200)
    // @Get()
    // findAll() {
    //   return this.menuService.findAll();
    // }

  // * Create options like sweetness, size, etc.
  @Post('options/:type')
  createOption(
    @Param('type') type: 'sweetness' | 'size' | 'add-ons' | 'menu-type',
    @Body() createOptionDto: CreateOptionDto,
  ) {
    return this.menuService.createOption(type, createOptionDto);
  }

  // * Link options to a menu
  @Post('options/:type/link/:menu_id/:option_id')
  linkOptionToMenu(
    @Param('type') type: 'sweetness' | 'size' | 'add-ons' | 'menu-type',
    @Param('menu_id') menu_id: number,
    @Param('option_id') option_id: number,
  ) {
    return this.menuService.linkOptionToMenu(menu_id, type, option_id);
  }

  // * Get ingredients linked to a menu
  // @Get(':menu_id/ingredients')
  // async getIngredientsByMenu(@Param('menu_id') menu_id: number) {
  //   return this.stockService.getIngredientsByMenu(menu_id);
  // }

  // * Add a new ingredient to a menu
  // @Post(':menu_id/ingredients')
  // async addIngredientToMenu(
  //   @Param('menu_id') menu_id: number,
  //   @Body() createMenuIngredientDto: CreateMenuIngredientDto,
  // ) {
  //   // เชื่อมโยงวัตถุดิบกับเมนู
  //   const menuIngredient = {
  //     ...createMenuIngredientDto,
  //     menu_id, // เชื่อมโยงเมนูจากพารามิเตอร์
  //   };
  //   return this.stockService.addMenuIngredient(menuIngredient);
  // }

  // * Update ingredient in a menu
  // @Patch(':menu_id/ingredients/:menu_ingredient_id')
  // async updateMenuIngredient(
  //   @Param('menu_id') menu_id: number,
  //   @Param('menu_ingredient_id') menu_ingredient_id: number,
  //   @Body() updateMenuIngredientDto: UpdateMenuIngredientDto,
  // ) {
  //   return this.stockService.updateMenuIngredient(
  //     menu_ingredient_id,
  //     updateMenuIngredientDto,
  //   );
  // }

  // // * Delete an ingredient from a menu
  // @Delete(':menu_id/ingredients/:menu_ingredient_id')
  // async deleteMenuIngredient(
  //   @Param('menu_id') menu_id: number,
  //   @Param('menu_ingredient_id') menu_ingredient_id: number,
  // ) {
  //   return this.stockService.deleteMenuIngredient(menu_ingredient_id);
  // }

  // * Get a single menu
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  // * Update a menu
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  // * Delete a menu
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
