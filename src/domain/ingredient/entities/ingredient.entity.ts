import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IngredientUnit } from './ingredient-unite.enum';

@Entity()
export class IngredientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: IngredientUnit,
    default: IngredientUnit.KG,
  })
  unite: IngredientUnit;

  @Column({ type: 'float4', nullable: true })
  price: number;
}
