import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class IngredientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
