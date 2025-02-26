import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/loggingMiddleware';

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
  }
}
