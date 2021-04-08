import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './core/config/config.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { QuantityModule } from './quantity/quantity.module';
import { RecipeModule } from './recipe/recipe.module';
import { SpinalModule } from './spinal/spinal.module';
import { ZeltyModule } from './zelty/zelty.module';
import { DishModule } from './dish/dish.module';

@Module({
  imports: [
    SpinalModule,
    ZeltyModule,
    IngredientModule,
    ConfigModule,
    RecipeModule,
    QuantityModule,
    DishModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
