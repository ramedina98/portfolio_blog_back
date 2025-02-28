import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/loggingMiddleware';
import { AuthController } from './modules/auth/auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
