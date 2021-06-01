import { Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap, skip, take } from 'rxjs/operators';
import { SpinalService } from '../hub/spinal.service';
import { SpinalInterface } from './spinal-model';

export abstract class HubRepository<T extends SpinalInterface> {
  private logger = new Logger(HubRepository.name);

  protected abstract readonly NODE_NAME: string;
  protected abstract readonly ROOT_NAME: string;
  protected abstract get emptyNode(): SpinalInterface;

  constructor(protected readonly spinal: SpinalService) {}

  load(): Observable<T> {
    return this.spinal
      .load<T>(this.NODE_NAME)
      .pipe(catchError((error) => this.createIfUnknown(error)));
  }

  detectChanges(): Observable<T> {
    return this.load().pipe(skip(1));
  }

  store(node = this.emptyNode) {
    console.log(this.spinal);
    return this.spinal.store(node, this.NODE_NAME);
  }

  findAll<K>() {
    return this.load().pipe(
      take(1),
      map((nodes: T): K[] => {
        if (nodes[this.ROOT_NAME].length === 0) {
          return [];
        }

        return (nodes[this.ROOT_NAME] as any).get();
      }),
    );
  }

  find<K>(where: Partial<K> | Partial<K>[]): Observable<K[]> {
    return this.load().pipe(
      take(1),
      map((nodeList: T) => {
        const nodes: K[] = nodeList[this.ROOT_NAME].filter((d: any) => {
          const validatePartial = (partial: Partial<K>) => {
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
        });

        return nodes;
      }),
    );
  }

  private createIfUnknown(error: any): Observable<T> {
    this.logger.error(error);
    return this.store().pipe(mergeMap(() => this.load()));
  }
}
