import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { RabbitModule } from '@app/rabbit';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [RabbitModule, DatabaseModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
