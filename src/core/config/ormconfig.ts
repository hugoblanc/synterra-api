import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CustomTableNamingStrategy } from './custom-table-naming.strategy';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.PIM_DB_HOST,
  port: +process.env.PORT,
  username: process.env.PIM_DB_USERNAME,
  password: process.env.PIM_DB_PASSWORD,
  database: 'recipe',
  synchronize: true,
  autoLoadEntities: true,
  namingStrategy: new CustomTableNamingStrategy(),
  // logging:true
};
