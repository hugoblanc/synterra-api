import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { QuantityEntity } from '../../quantity/entities/quantity.entity';

@Entity()
export class DishEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => QuantityEntity, (quantity) => quantity.dish)
  quantities: QuantityEntity[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
