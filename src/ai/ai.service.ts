import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@app/database';
import { CreateAIResponseDto } from '../../libs/dtos/create.ai.response.dto';
import { RabbitService } from '@app/rabbit';

@Injectable()
export class AIResponseService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly rabbitService: RabbitService,
  ) {}

  async create(data: CreateAIResponseDto) {
    // 1️⃣ Salvează în DB
    const aiResponse = await this.databaseService.client.aIResponse.create({
      data,
    });

    // 2️⃣ Publică event dacă vrei
    await this.rabbitService.publish(
      'ai.exchange',
      'ai.response.created',
      aiResponse,
    );

    return aiResponse;
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
