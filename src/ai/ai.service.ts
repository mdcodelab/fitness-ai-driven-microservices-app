import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitService } from '@app/rabbit';
import { DatabaseService } from '@app/database';
import axios from 'axios';

@Injectable()
export class AIResponseService implements OnModuleInit {
  constructor(
    private readonly rabbitService: RabbitService,
    private readonly databaseService: DatabaseService,
  ) {}

  async onModuleInit() {
    // Consumăm activitățile
    await this.rabbitService.consume('activity.queue', async (msg) => {
      if (!msg) return;
      const activity = JSON.parse(msg.content.toString());

      try {
        // 1️⃣ Trimitem activitatea către Genimi API pentru recomandare
        const apiKey = process.env.GENIMI_API_KEY;
        const response = await axios.post(
          'https://api.genimi.ai/v1/recommend', 
          {
            userId: activity.userId,
            activityType: activity.type,
            duration: activity.duration,
            calories: activity.calories,
          },
          {
            headers: { Authorization: `Bearer ${apiKey}` },
          }
        );

        // 2️⃣ Salvăm răspunsul AI în DB
        const aiResponse = await this.databaseService.client.aIResponse.create({
          data: {
            activityId: activity.id,
            userId: activity.userId,
            notes: response.data.recommendation,
          },
        });

        console.log('AI response saved:', aiResponse);
      } catch (err) {
        console.error('[AIResponseService] Error processing activity:', err);
      }
    });
  }

  // Optional: metode helper pentru alte query-uri
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
