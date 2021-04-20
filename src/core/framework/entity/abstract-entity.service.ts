import { DeleteResult, Repository } from 'typeorm';
import { AbstractService } from '../abstract.service';

export abstract class AbstractEntityService<T> extends AbstractService {
  protected abstract readonly repository: Repository<T>;

  deleteById(id: string): Promise<DeleteResult> {
    return this.try(this.repository.delete(id));
  }

  deleteByIds(ids: string[]): Promise<DeleteResult> {
    if (ids) {
      return this.try(this.repository.delete(ids));
    }
  }

  saveAll(entities: T[]): Promise<T[]> {
    return this.repository.save(entities);
  }

  save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }
}
