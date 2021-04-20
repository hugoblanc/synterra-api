import { FindManyOptions, Repository } from 'typeorm';
import { RequestContextHelper } from '../../context/request-context.helper';
import { AbstractEntityService } from '../entity/abstract-entity.service';
import { IPersonal } from './i-personal';

export abstract class AbstractPersonalService<
  T extends IPersonal
> extends AbstractEntityService<T> {
  protected abstract readonly repository: Repository<T>;

  getByUserId(userId: string, options?: FindManyOptions<T>): Promise<T> {
    options = this.mergeFindOptions(userId, options);
    return this.repository.findOne(options);
  }

  getAllForCurrentUser(options?: FindManyOptions<T>): Promise<T[]> {
    const userId = RequestContextHelper.getCurrentUserId();
    return this.getAllByUserId(userId, options);
  }

  countAllForCurrentUser(): Promise<number> {
    const userId = RequestContextHelper.getCurrentUserId();
    return this.repository.count({ where: { user: { id: userId } } });
  }

  getAllByUserId(userId: string, options?: FindManyOptions<T>): Promise<T[]> {
    options = this.mergeFindOptions(userId, options);
    return this.repository.find(options);
  }

  private mergeFindOptions(userId: string, options: FindManyOptions<T> = {}) {
    const baseOption: FindManyOptions<T> = { where: { user: { id: userId } } };
    Object.assign(options, baseOption);
    return options;
  }
}
