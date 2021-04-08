/* eslint-disable @typescript-eslint/no-var-requires */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { SpinalService } from '../core/hub/spinal.service';
import { Dish } from '../../zelty/models/dish';
import { Observable } from 'rxjs';
import { SpinalInterface } from '../core/framework/spinal-model';

type SpinalDish = Dish & SpinalInterface;

// @Injectable()
// export class ProductListService implements OnModuleInit {
//   constructor(private readonly spinal: SpinalService) {}
//   onModuleInit() {
//     // this.storeProductList([{ tu: 2 }]).subscribe();
//     // setTimeout(() => {
//     //   this.loadProductList();
//     // }, 2000);
//   }

//   createProduct(dish: Dish): any {
//     const models = require('../nodes/product');
//     return new models.ProductModel(dish);
//   }

//   storeProductList(dishes: any[]): Observable<void> {
//     const list = require('../nodes/product-list');
//     const listProduct = new list.ProductListModel(dishes);
//     return this.spinal.store(listProduct, 'list');
//   }

//   loadProductList(): void {
//     this.spinal.load<SpinalDish>('list').subscribe((list) => {
//       setInterval(() => {
//         list[0].tu.set(3);
//       }, 1000);
//     });
//   }
// }
