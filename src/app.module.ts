import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/loggingMiddleware';
import { RouteNotFoundMiddleware } from './middleware/routeNotFoundMiddleware';

@Module({
  imports: [],
  // TODO: Posteriormente agregar aquí los servicios y controladores de la aplicación...
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
