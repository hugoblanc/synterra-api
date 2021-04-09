import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from 'eventemitter2';
import { Repository } from 'typeorm';
import { CreateQuantityDto } from './dto/create-quantity.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { QuantityEntity } from './entities/quantity.entity';
import { QuantityCreatedEvent } from '../../event/quantity.event';

@Injectable()
export class QuantityService {
  constructor(
    @InjectRepository(QuantityEntity)
    private repository: Repository<QuantityEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createQuantityDto: CreateQuantityDto) {
    const quantity = await this.repository.save(createQuantityDto);
    const event = new QuantityCreatedEvent(quantity);
    this.eventEmitter.emit(QuantityCreatedEvent.EVENT_NAME, event);
  }

  findAll() {
    return `This action returns all quantity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quantity`;
  }

  update(id: number, updateQuantityDto: UpdateQuantityDto) {
    return `This action updates a #${id} quantity`;
  }

  remove(id: number) {
    return `This action removes a #${id} quantity`;
  }
}
