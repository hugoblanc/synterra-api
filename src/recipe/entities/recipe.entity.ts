import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuantityEntity } from '../../quantity/entities/quantity.entity';

@Entity()
export class RecipeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => QuantityEntity, (quantity) => quantity.recipe)
  quantities: QuantityEntity[];

  constructor(id: number) {
    this.id = id;
  }
}
