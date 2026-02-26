import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { UsersModule } from '../users/users.module';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [UsersModule, ActivitiesModule],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService]
})
export class ApiGatewayModule {}
