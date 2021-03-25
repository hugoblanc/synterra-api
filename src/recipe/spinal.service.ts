/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { Dish } from './zelty/models';

const spinalCore = require('spinal-core-connectorjs');
const models = require('./spinal/product');
const list = require('./spinal/product-list');

@Injectable()
export class SpinalService {
  conn: any;
  constructor() {
    process.env.SPINALHUB_PORT = '7777';
    process.env.SPINALHUB_IP = 'localhost';
    process.env.SPINAL_USER_ID = '168';
    process.env.SPINAL_PASSWORD = 'bRalJJ107AUv'; // you will find it in th file .config.json  (spinalcom connection configuration file)
    this.conn = spinalCore.connect(
      `http://${process.env.SPINAL_USER_ID}:${process.env.SPINAL_PASSWORD}@${process.env.SPINALHUB_IP}:${process.env.SPINALHUB_PORT}/general`,
    );
  }
  press(button) {
    console.log('button pressed');
    console.log(button.tva.get() + 10);
    button.tva.set(button.tva.get() + 10);
    button.addAttr({ tvax: 10 });
  }

  storeProduct(dish: Dish) {
    const product = new models.ProductModel(dish);
    spinalCore.store(this.conn, product, 'product-' + dish.id, () => {
      console.log('product-' + dish.id);
    });
  }

  createProduct(dish: Dish) {
    return new models.ProductModel(dish);
  }

  storeProductList(dishes: any[]) {
    const listProduct = new list.ProductListModel(dishes);
    spinalCore.store(this.conn, listProduct, 'list', () => {
      console.log('list-');
    });
  }
}
