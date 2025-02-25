import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/loggingMiddleware';
import { RouteNotFoundMiddleware } from './middleware/routeNotFoundMiddleware';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer
      .apply(RouteNotFoundMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
