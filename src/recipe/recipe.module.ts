import { HttpModule, Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './entities/recipe.entity';
import { SpinalService } from './spinal.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity]), HttpModule],
  controllers: [RecipeController],
  providers: [RecipeService, SpinalService],
})
export class RecipeModule {}
