/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { AbstractList } from '@synterra/spinal-rxjs';
import { Observable } from 'rxjs';
import { spinalCore } from 'spinal-core-connectorjs_type';

@Injectable()
export class SpinalService implements OnModuleInit {
  private conn: any;

  onModuleInit() {
    this.initSpinalConnexion();
  }

  private initSpinalConnexion(): void {
    this.conn = spinalCore.connect(
      `http://${process.env.SPINAL_USER_ID}:${process.env.SPINAL_PASSWORD}@${process.env.SPINALHUB_IP}:${process.env.SPINALHUB_PORT}/general`,
    );
  }

  public store<T extends spinal.Model>(
    object: AbstractList<T>,
    name: string,
  ): Observable<void> {
    return new Observable<void>((observer) => {
      spinalCore.store(
        this.conn,
        object,
        name,
        () => {
          observer.next();
          observer.complete();
        },
        () => observer.error('Fail storing model' + name),
      );
    });
  }

  public load<T extends spinal.Model>(
    name: string,
  ): Observable<AbstractList<T>> {
    return new Observable<AbstractList<T>>((observer) => {
      spinalCore.load(
        this.conn,
        name,
        (object: AbstractList<T>) => {
          if (!object) {
            observer.next();
            observer.complete();
            return;
          }

          object.bind(() => {
            observer.next(object);
          });
        },
        () => observer.error('Fail loading model ' + name),
      );
    });
  }
}
