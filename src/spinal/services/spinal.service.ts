/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SpinalInterface } from '../models/spinal-model';

@Injectable()
export class SpinalService implements OnModuleInit {
  private spinalCore = require('spinal-core-connectorjs');
  private conn: any;

  constructor() {
    process.env.SPINALHUB_PORT = '7777';
    process.env.SPINALHUB_IP = 'localhost';
    process.env.SPINAL_USER_ID = '168';
    process.env.SPINAL_PASSWORD = 'bRalJJ107AUv'; // you will find it in th file .config.json  (spinalcom connection configuration file)
  }
  onModuleInit() {
    this.initSpinalConnexion();
  }

  private initSpinalConnexion(): void {
    this.conn = this.spinalCore.connect(
      `http://${process.env.SPINAL_USER_ID}:${process.env.SPINAL_PASSWORD}@${process.env.SPINALHUB_IP}:${process.env.SPINALHUB_PORT}/general`,
    );
  }

  public store(object: any, name: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.spinalCore.store(
        this.conn,
        object,
        name,
        () => {
          observer.next();
          observer.complete();
        },
        (error: any) => observer.error(error),
      );
    });
  }

  public load<T extends SpinalInterface>(name: string): Observable<T> {
    console.log('spinal service');
    return new Observable<T>((observer) => {
      this.spinalCore.load(
        this.conn,
        name,
        (object: T) => {
          observer.next(object);
          object.bind(() => {
            observer.next(object);
          });
          // TODO: trouver un moyen de complete
          // observer.complete();
        },
        (error: any) => observer.error(error),
      );
    });
  }
}

// public load<T extends SpinalInterface>(
//   name: string,
//   constructor?: new () => T,
// ): Observable<T> {
//   return new Observable<T>((observer) => {
//     this.spinalLoad(observer, name, constructor);
//   });
// }

// private spinalLoad<T extends SpinalInterface>(
//   observer: Subscriber<T>,
//   name: string,
//   constructor?: new () => T,
// ): void {
//   this.spinalCore.load(
//     this.conn,
//     name,
//     (node: T) => {
//       this.bindNode(node, observer);
//       // TODO: trouver un moyen de complete
//       // observer.complete();
//     },
//     (error: any) => {
//       if (!constructor) {
//         observer.error(error);
//         return;
//       }

//       const node = new constructor();
//       this.store(node, name).subscribe(() => {
//         this.bindNode(node, observer);
//       });
//     },
//   );
// }

// private bindNode<T extends SpinalInterface>(
//   node: T,
//   observer: Subscriber<T>,
// ): void {
//   observer.next(node);
//   node.bind(() => {
//     observer.next(node);
//   });
// }
// }
