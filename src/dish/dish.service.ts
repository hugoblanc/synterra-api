import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DishZeltyService } from '../zelty/services/dish-zelty.service';
import { UpdateDishDto } from './dto/update-dish.dto';
import { DishEntity } from './entities/dish.entity';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(DishEntity)
    private repository: Repository<DishEntity>,
    private readonly dishZeltyService: DishZeltyService,
  ) {}

  async synchronize() {
    const dishes = await this.dishZeltyService.getAll().toPromise();
    const recipes = dishes.map((d) => new DishEntity(d.id, d.name));
    console.log(recipes);
    return await this.repository.save(recipes);
    // const productList = dishes.map((d: Dish) =>
    //   this.productListService.createProduct(d),
    // );
    // this.productListService.storeProductList(productList);
    // return dishes;
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const dish = await this.dishZeltyService.getById(id).toPromise();
    const recipe = await this.repository.findOne(id, {
      relations: ['quantities', 'quantities.ingredient'],
    });
    return Object.assign(dish, recipe);
  }

  update(id: number, updateDishDto: UpdateDishDto) {
    return `This action updates a #${id} dish`;
  }

  remove(id: number) {
    return `This action removes a #${id} dish`;
  }
}
