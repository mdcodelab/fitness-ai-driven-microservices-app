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
    const queueName = 'activity.queue';
    const exchangeName = 'activity.exchange';
    const routingKey = 'activity.created';

    await this.rabbitService.assertQueue(queueName);
    await this.rabbitService.bindQueue(queueName, exchangeName, routingKey);

    await this.rabbitService.consume(queueName, async (msg) => {
      if (!msg) return;

      const activity = JSON.parse(msg.content.toString());
      console.log('[AIResponseService] Activity received:', activity);

      let recommendation = 'No recommendation available';

      try {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
          console.warn('[AIResponseService] OPENAI_API_KEY not set.');
        } else {
          const url = 'https://api.openai.com/v1/chat/completions';

          const prompt = `You are a fitness assistant.
Recommend 5 ways for user ${activity.userId} to improve ${activity.type}.
Duration: ${activity.duration || 'unknown'} minutes.
Calories burned: ${activity.calories || 'unknown'}.`;

          const response = await axios.post(
            url,
            {
              model: 'gpt-5-nano',
              messages: [
                {
                  role: 'user',
                  content: prompt,
                },
              ],
              temperature: 1, // default, nu dă eroare
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
            },
          );

          recommendation =
            response.data?.choices?.[0]?.message?.content || recommendation;

          console.log('[AIResponseService] GPT response:', recommendation);
        }

        const aiResponse =
          await this.databaseService.client.aIResponse.create({
            data: {
              activityId: activity.id,
              userId: activity.userId,
              notes: recommendation,
            },
          });

        console.log('[AIResponseService] AI response saved:', aiResponse);
      } catch (error: any) {
        console.error(
          '[AIResponseService] Error processing activity:',
          error.response?.data || error.message,
        );
      }
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
