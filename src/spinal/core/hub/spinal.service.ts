/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SpinalInterface } from '../framework/spinal-model';

@Injectable()
export class SpinalService implements OnModuleInit {
  private spinalCore = require('spinal-core-connectorjs');
  private conn: any;

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
    return new Observable<T>((observer) => {
      this.spinalCore.load(
        this.conn,
        name,
        (object: T) => {
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
