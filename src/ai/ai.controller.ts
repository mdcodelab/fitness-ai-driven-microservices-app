import { Body, Controller, Post } from '@nestjs/common';
import { AIResponseService } from './ai-response.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AIResponseService) {}

  @Post()
  async getAIResponse(@Body() activity: any) {
    try {
      // Trimite activitatea către AIResponseService și primește răspunsul
      const gptResponse = await this.aiService.getAIResponse(activity);
      return { success: true, data: gptResponse };
    } catch (error) {
      console.error('[AIResponseService] Error processing activity:', error);
      return {
        success: false,
        message: 'Failed to get AI response',
        error: error.message || error,
      };
    }
  }
}

