import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { UpdateDishDto } from './dto/update-dish.dto';

@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post('synchronize')
  synchronize() {
    return this.dishService.synchronize();
  }

  @Get()
  findAll() {
    return this.dishService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    return this.dishService.update(+id, updateDishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dishService.remove(+id);
  }
}
