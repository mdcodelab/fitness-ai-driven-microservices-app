import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly url = process.env.RABBITMQ_URL;

  async onModuleInit() {
    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createChannel();
    console.log('[RabbitService] Connected to RabbitMQ');
  }

  async publish(exchange: string, routingKey: string, message: any) {
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    const payload = JSON.stringify(message);
    this.channel.publish(exchange, routingKey, Buffer.from(payload));
    console.log(`[RabbitService] Published to exchange=${exchange} routingKey=${routingKey} payload=${payload}`);
  }

  async consume(queue: string, handler: (msg: amqp.ConsumeMessage) => Promise<void> | void) {
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;
      try {
        console.log(`[RabbitService] Message received on queue=${queue}: ${msg.content.toString()}`);
        await handler(msg);
        this.channel.ack(msg);
      } catch (err) {
        console.error('[RabbitService] Error handling message:', err);
        this.channel.nack(msg, false, false);
      }
    });
  }

  // 🔹 Adaugă metoda assertQueue
  async assertQueue(queue: string) {
    if (!this.channel) throw new Error('RabbitMQ channel not initialized');
    await this.channel.assertQueue(queue, { durable: true });
  }

  // 🔹 Adaugă metoda bindQueue
  async bindQueue(queue: string, exchange: string, routingKey: string) {
    if (!this.channel) throw new Error('RabbitMQ channel not initialized');
    // Ensure the exchange exists before binding the queue to it. This avoids
    // a race where a consumer starts before any publisher has asserted the
    // exchange and bindQueue fails.
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    await this.channel.bindQueue(queue, exchange, routingKey);
    console.log(`[RabbitService] Bound queue=${queue} to exchange=${exchange} with routingKey=${routingKey}`);
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
