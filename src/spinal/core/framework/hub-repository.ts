import { Logger } from '@nestjs/common';
import { AbstractList } from '@synterra/spinal-rxjs';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, mergeMap, skip, take } from 'rxjs/operators';
import { SpinalService } from '../hub/spinal.service';

export abstract class HubRepository<T extends spinal.Model, K> {
  private logger = new Logger(HubRepository.name);

  protected abstract readonly NODE_NAME: string;
  protected abstract get emptyNode(): AbstractList<T>;

  constructor(protected readonly spinal: SpinalService) {}

  public load(): Observable<AbstractList<T>> {
    return this.loadOrCreate().pipe(take(1));
  }

  public watch(): Observable<AbstractList<T>> {
    return this.loadOrCreate().pipe(skip(1));
  }

  public store(node = this.emptyNode) {
    return this.spinal.store(node, this.NODE_NAME);
  }

  public findAll(): Observable<K[]> {
    return this.load().pipe(
      map((nodes: AbstractList<T>): K[] =>
        nodes.list.length === 0 ? [] : nodes.list.get(),
      ),
      catchError((error) => {
        this.logger.error('Error finding all nodes for' + this.NODE_NAME);
        return EMPTY;
      }),
    );
  }

  public find(where: Partial<T> | Partial<T>[]): Observable<AbstractList<T>> {
    return this.load().pipe(
      map((nodes: AbstractList<T>) => {
        nodes = (nodes.filter((d: any) => {
          const validatePartial = (partial: Partial<T>) => {
            for (const key in partial) {
              if (Object.prototype.hasOwnProperty.call(partial, key)) {
                const nodeValue = (d[key] as any)?.get();
                if (nodeValue !== partial[key]) {
                  return false;
                }
              }
            }
            return true;
          };

          if (Array.isArray(where)) {
            for (const partial of where) {
              if (!validatePartial(partial)) {
                return false;
              }
            }
            return true;
          } else {
            return validatePartial(where);
          }
        }) as unknown) as AbstractList<T>;

        return nodes;
      }),
    );
  }

  private loadOrCreate(): Observable<AbstractList<T>> {
    return this.spinalLoad().pipe(
      catchError((error) => this.createAndLoad(error)),
    );
  }

  private spinalLoad() {
    return this.spinal.load<T>(this.NODE_NAME);
  }

  private createAndLoad(error: any): Observable<AbstractList<T>> {
    this.logger.error(error);
    return this.store().pipe(mergeMap(() => this.spinalLoad()));
  }
}
