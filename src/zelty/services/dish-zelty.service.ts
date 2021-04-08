import { Injectable, Logger } from '@nestjs/common';
import { ZeltyHttpService } from '../core/zelty-http.service';
import { Observable } from 'rxjs';
import {
  DishDTO,
  GetDishesZeltyDTO,
  GetDishByIdZeltyDTO,
} from '../models/dish';
import { map } from 'rxjs/operators';

@Injectable()
export class DishZeltyService {
  private static BASE_RESOURCES = 'catalog/dishes';
  private logger = new Logger(DishZeltyService.name);

  constructor(private readonly http: ZeltyHttpService) {}

  getAll(): Observable<DishDTO[]> {
    this.logger.log('Get dishes from zelty');
    return this.http
      .get<GetDishesZeltyDTO>(DishZeltyService.BASE_RESOURCES)
      .pipe(map((dishesResponse) => dishesResponse.dishes));
  }

  public getById(id: number): Observable<DishDTO[]> {
    return this.http
      .get<GetDishByIdZeltyDTO>(DishZeltyService.BASE_RESOURCES + '/' + id)
      .pipe(map((response) => response.dish));
  }
}
