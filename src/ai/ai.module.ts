import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AIResponseService } from './ai.service';
import { RabbitModule } from '@app/rabbit';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [RabbitModule, DatabaseModule],
  controllers: [AiController],
  providers: [AIResponseService],
})
export class AiModule {}
