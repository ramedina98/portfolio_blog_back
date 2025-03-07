import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/loggingMiddleware';
import { AuthModule } from './modules/auth/auth.module';
import { EmailsModule } from './modules/email/emails-module.module';

@Module({
  imports: [
    AuthModule,
    EmailsModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
