import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { ZeltyDishResponse } from '../../dist/recipe/zelty/models';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeEntity } from './entities/recipe.entity';
import { Dish, ZeltyDishesResponse } from './zelty/models';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private repository: Repository<RecipeEntity>,
    private readonly http: HttpService,
  ) {}

  create(createRecipeDto: CreateRecipeDto) {
    // return this.repository.save(createRecipeDto);
  }

  async synchronize() {
    const dishes = await this.getProductFromZelty().toPromise();
    const recipes = dishes.map((d) => new RecipeEntity(d.id));
    await this.repository.save(recipes);
    return dishes;
  }

  async findAll() {
    const locaRecipes = await this.repository.find();
    if (locaRecipes.length === 0) {
      throw new NotFoundException();
    }
    return this.getProductFromZelty();
  }

  async findOne(id: number) {
    const dish = await this.getProductFromZeltyById(id).toPromise();

    const recipe = await this.repository.findOne(id, {
      relations: ['quantities', 'quantities.ingredient'],
    });
    return Object.assign(dish, recipe);
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }

  private getProductFromZelty(): Observable<Dish[]> {
    const config: AxiosRequestConfig = {
      headers: { Authorization: 'Bearer MjEzOToA8z9gdxQgQWqeSK6BKPMMReIuBA==' },
    };
    return this.http
      .get<ZeltyDishesResponse>(
        'https://api.zelty.fr/2.4/catalog/dishes',
        config,
      )
      .pipe(map((response) => response.data.dishes));
  }

  private getProductFromZeltyById(id: number): Observable<Dish> {
    const config: AxiosRequestConfig = {
      headers: { Authorization: 'Bearer MjEzOToA8z9gdxQgQWqeSK6BKPMMReIuBA==' },
    };
    return this.http
      .get<ZeltyDishResponse>(
        'https://api.zelty.fr/2.4/catalog/dishes/' + id,
        config,
      )
      .pipe(map((response) => response.data.dish));
  }
}
