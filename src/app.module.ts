import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiGatewayModule } from './api-gateway/api-gateway.module';
import { DatabaseModule } from '@app/database';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';
import { RabbitModule } from '@app/rabbit';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule,
    RabbitModule,
    ApiGatewayModule,
    UsersModule,
    ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
