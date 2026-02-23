import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiGatewayModule } from './api-gateway/api-gateway.module';
import { DatabaseModule } from '@app/database';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ApiGatewayModule, UsersModule, ActivitiesModule, AiModule,
     DatabaseModule,
     AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
