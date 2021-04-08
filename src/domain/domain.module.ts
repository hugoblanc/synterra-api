import { Module } from '@nestjs/common';
import { IngredientModule } from './ingredient/ingredient.module';
import { QuantityModule } from './quantity/quantity.module';
import { DishModule } from './dish/dish.module';

@Module({
  imports: [IngredientModule, DishModule, QuantityModule],
})
export class DomainModule {}
