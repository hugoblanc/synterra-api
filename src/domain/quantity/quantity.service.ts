import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateQuantityDto } from './dto/create-quantity.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { Repository } from 'typeorm';
import { QuantityEntity } from './entities/quantity.entity';

@Injectable()
export class QuantityService {
  constructor(
    @InjectRepository(QuantityEntity)
    private repository: Repository<QuantityEntity>,
  ) {}

  create(createQuantityDto: CreateQuantityDto) {
    return this.repository.save(createQuantityDto);
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
