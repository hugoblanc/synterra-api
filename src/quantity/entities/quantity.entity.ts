import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IngredientEntity } from '../../ingredient/entities/ingredient.entity';
import { RecipeEntity } from '../../recipe/entities/recipe.entity';
import { DishEntity } from '../../dish/entities/dish.entity';

@Entity()
export class QuantityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal' })
  amount: number;

  @ManyToOne(() => IngredientEntity, { nullable: false })
  ingredient: IngredientEntity;

  @ManyToOne(() => DishEntity, { nullable: false })
  dish: DishEntity;
}
