import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IngredientModule } from './ingredient/ingredient.module';
import { ConfigModule } from './core/config/config.module';
import { RecipeModule } from './recipe/recipe.module';
import { QuantityModule } from './quantity/quantity.module';

@Module({
  imports: [IngredientModule, ConfigModule, RecipeModule, QuantityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
