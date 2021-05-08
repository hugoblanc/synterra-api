import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientEntity } from './entities/ingredient.entity';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(IngredientEntity)
    private repository: Repository<IngredientEntity>,
  ) {}

  create(createIngredientDto: CreateIngredientDto) {
    return this.repository.save(createIngredientDto);
  }

  findAll() {
    return this.repository.find();
  }

  findByNameLike(name: string) {
    return this.repository.find({
      name: ILike(`%${name}%`),
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} ingredient`;
  }

  update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return `This action updates a #${id} ingredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredient`;
  }
}
