import { Module } from '@nestjs/common';
import { IngredientModule } from './ingredient/ingredient.module';
import { QuantityModule } from './quantity/quantity.module';
import { DishModule } from './dish/dish.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './tasks/task.module';

@Module({
  imports: [
    IngredientModule,
    DishModule,
    QuantityModule,
    UserModule,
    TaskModule,
  ],
  exports: [UserModule],
})
export class DomainModule {}
