import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './core/config/config.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { QuantityModule } from './quantity/quantity.module';
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [IngredientModule, ConfigModule, RecipeModule, QuantityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
