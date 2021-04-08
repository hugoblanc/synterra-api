import { Observable } from 'rxjs';
import { SpinalService } from '../hub/spinal.service';
import { SpinalInterface } from './spinal-model';
export abstract class HubRepository<T extends SpinalInterface> {
  protected abstract readonly NODE_NAME: string;
  protected abstract get emptyNode(): SpinalInterface;

  constructor(protected readonly spinal: SpinalService) {}

  load(): Observable<T> {
    return this.spinal.load<T>(this.NODE_NAME);
  }

  store(node = this.emptyNode) {
    return this.spinal.store(node, this.NODE_NAME);
  }
}
