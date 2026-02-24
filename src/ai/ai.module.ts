import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { RabbitModule } from '@app/rabbit';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [RabbitModule, DatabaseModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
