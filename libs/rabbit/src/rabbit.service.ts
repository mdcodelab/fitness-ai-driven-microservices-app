import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  private readonly url = process.env.RABBITMQ_URL;

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      console.log('[RabbitMQService] Connected to RabbitMQ Cloud');
    } catch (err) {
      console.error('[RabbitMQService] Failed to connect:', err);
    }
  }

  async publish(exchange: string, routingKey: string, message: any) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
    );
  }

  /**
   * Consume messages from a queue. The handler receives the raw amqplib message
   * and can be async. Messages are acked on success and nacked on error.
   */
  async consume(queue: string, handler: (msg: amqp.ConsumeMessage) => Promise<void> | void) {
    if (!this.channel) {
      console.warn('[RabbitMQService] Channel not ready, cannot consume messages yet');
      return;
    }

    await this.channel.assertQueue(queue, { durable: true });

    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;
      try {
        await handler(msg);
        this.channel.ack(msg);
      } catch (err) {
        console.error('[RabbitMQService] Error processing message:', err);
        try {
          // don't requeue by default
          this.channel.nack(msg, false, false);
        } catch (e) {
          console.error('[RabbitMQService] Failed to nack message:', e);
        }
      }
    });
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (err) {
      console.error('[RabbitMQService] Error closing connection:', err);
    }
  }
}
