import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '@app/database';
import { CreateAIResponseDto } from '../../libs/dtos/create.ai.response.dto';
import { RabbitService } from '@app/rabbit';

@Injectable()
export class AIResponseService implements OnModuleInit {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly rabbitService: RabbitService,
  ) {}

  async onModuleInit() {
    // Consuma mesajele de la activități
    await this.rabbitService.consume('activity.queue', async (message) => {
      const activity = JSON.parse(message.content.toString());

      const aiResponse = {
        activityId: activity.id,
        userId: activity.userId,
        recommendation: "Great job! Increase duration next time.",
      };

      await this.databaseService.client.aIResponse.create({
        data: aiResponse,
      });

      // Poți publica event dacă vrei
      await this.rabbitService.publish(
        'ai.exchange',
        'ai.response.created',
        aiResponse,
      );
    });
  }

  async findByUser(userId: string) {
    return this.databaseService.client.aIResponse.findMany({
      where: { userId },
    });
  }

  async findByActivity(activityId: string) {
    return this.databaseService.client.aIResponse.findMany({
      where: { activityId },
    });
  }
}
