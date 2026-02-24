import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    try {
      const url = process.env.RABBITMQ_URL; // ia din .env
      console.log('ENV URL:', process.env.RABBITMQ_URL);

      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      console.log('[RabbitMQService] Connected to RabbitMQ Cloud');
    } catch (err) {
      console.error('[RabbitMQService] Failed to connect to RabbitMQ:', err);
    }
  }

  getChannel() {
    return this.channel;
  }
}
