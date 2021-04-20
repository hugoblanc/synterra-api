import { BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { PostgresError } from 'pg-error-enum';

export abstract class AbstractService {
  protected readonly logger = new Logger(AbstractService.name);

  async try<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      this.handleSqlException(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSqlException(error: any): never {
    console.error(error);
    switch (error.code) {
      case PostgresError.UNIQUE_VIOLATION:
        throw new ConflictException('data already present');
      default:
        throw new BadRequestException();
    }
  }
}
