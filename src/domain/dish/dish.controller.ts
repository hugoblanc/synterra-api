import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { DishService } from './dish.service';

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
}
