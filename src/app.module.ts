import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './core/auth/auth.module';
import { ConfigModule } from './core/config/config.module';
import { RequestContextMiddleware } from './core/context/request-context.middleware';
import { DishModule } from './domain/dish/dish.module';
import { DomainModule } from './domain/domain.module';
import { JiraModule } from './jira/jira.module';
import { ReportingModule } from './reporting/reporting.module';
import { SpinalModule } from './spinal/spinal.module';
import { ZeltyModule } from './zelty/zelty.module';

@Module({
  imports: [
    SpinalModule,
    ZeltyModule,
    ConfigModule,
    DishModule,
    DomainModule,
    ReportingModule,
    JiraModule,
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware)
      .exclude({ path: '*', method: RequestMethod.OPTIONS })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
