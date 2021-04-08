import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from './entities/recipe.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private repository: Repository<RecipeEntity>, // private readonly productListService: ProductListService, // private readonly zeltyService: ZeltyHttpService,
  ) {}

  async synchronize() {
    // const dishes = await this.zeltyService.getProductFromZelty().toPromise();
    // const recipes = dishes.map((d) => new RecipeEntity(d.id));
    // await this.repository.save(recipes);
    // const productList = dishes.map((d: Dish) =>
    //   this.productListService.createProduct(d),
    // );
    // this.productListService.storeProductList(productList);
    // return dishes;
  }

  async findAll() {
    // this.productListService.loadProductList();
    // const localRecipes = await this.repository.find();
    // if (localRecipes.length === 0) {
    //   throw new NotFoundException();
    // }
    // return this.zeltyService.getProductFromZelty();
  }

  async findOne(id: number) {
    // // const dish = await this.zeltyService
    // //   .getProductFromZeltyById(id)
    // //   .toPromise();
    // const recipe = await this.repository.findOne(id, {
    //   relations: ['quantities', 'quantities.ingredient'],
    // });
    // return Object.assign(dish, recipe);
  }
}
