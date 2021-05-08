import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SpinalService } from '../hub/spinal.service';
import { SpinalInterface } from './spinal-model';
export abstract class HubRepository<T extends SpinalInterface> {
  protected abstract readonly NODE_NAME: string;
  protected abstract readonly ROOT_NAME: string;
  protected abstract get emptyNode(): SpinalInterface;

  constructor(protected readonly spinal: SpinalService) {}

  load(): Observable<T> {
    return this.spinal.load<T>(this.NODE_NAME);
  }

  store(node = this.emptyNode) {
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

  find<K>(where: Partial<K>): Observable<K[]> {
    return this.load().pipe(
      take(1),
      map((nodeList: T) => {
        const nodes: K[] = nodeList[this.ROOT_NAME].filter((d: any) => {
          for (const key in where) {
            if (Object.prototype.hasOwnProperty.call(where, key)) {
              const nodeValue = (d[key] as any)?.get();
              if (nodeValue !== where[key]) {
                return false;
              }
            }
          }
          return true;
        });
        return nodes;
      }),
    );
  }
}
