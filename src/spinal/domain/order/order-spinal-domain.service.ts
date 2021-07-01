import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrderDTO } from '../../../zelty/models/order.dto';
import { OrderHubRepository } from './order-hub.repository';

@Injectable()
export class OrderSpinalDomainService {
  constructor(private readonly hubRepository: OrderHubRepository) {}

  findAll(): Observable<OrderDTO[]> {
    return this.hubRepository.findAll();
  }
}
