import { HttpModule, Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './entities/recipe.entity';
import { SpinalModule } from '../spinal/spinal.module';
import { ZeltyModule } from '../zelty/zelty.module';

@Module({
  // imports: [
  //   // TypeOrmModule.forFeature([RecipeEntity]),
  //   HttpModule,
  //   SpinalModule,
  //   ZeltyModule,
  // ],
  // controllers: [RecipeController],
  // providers: [RecipeService],
})
export class RecipeModule {}
