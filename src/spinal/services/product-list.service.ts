/* eslint-disable @typescript-eslint/no-var-requires */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { SpinalService } from './spinal.service';
import { Dish } from '../../zelty/models/dish';
import { Observable } from 'rxjs';
import { SpinalInterface } from '../models/spinal-model';

type SpinalDish = Dish & SpinalInterface;

@Injectable()
export class ProductListService implements OnModuleInit {
  constructor(private readonly spinal: SpinalService) {}
  onModuleInit() {
    console.log('synchro product');
    // this.storeProductList([{ tu: 2 }]).subscribe();
    // setTimeout(() => {
    //   this.loadProductList();
    // }, 2000);
  }

  createProduct(dish: Dish): any {
    const models = require('../nodes/product');
    return new models.ProductModel(dish);
  }

  storeProductList(dishes: any[]): Observable<void> {
    const list = require('../nodes/product-list');
    const listProduct = new list.ProductListModel(dishes);
    return this.spinal.store(listProduct, 'list');
  }

  loadProductList(): void {
    this.spinal.load<SpinalDish>('list').subscribe((list) => {
      console.log('OK');
      console.log(JSON.stringify(list[0].tu.has_been_modified()));

      setInterval(() => {
        list[0].tu.set(3);
      }, 1000);
    });
  }
}
