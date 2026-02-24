import { Injectable } from '@nestjs/common';
import { RabbitService } from '@app/rabbit';
import { DatabaseService } from '@app/database';

@Injectable()
export class UsersService {
  constructor(
    private readonly rabbitService: RabbitService,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(data: any) {
    // 1️⃣ Save to DB using the Prisma client exposed by DatabaseService
    const user = await this.databaseService.client.user.create({
      data,
    });

    console.log('User saved in DB:', user);

    // 2️⃣ Publish event ONLY after DB succeeded. RabbitMQ publish expects (exchange, routingKey, message)
    try {
      await this.rabbitService.publish('user.exchange', 'user.created', user);
    } catch (err) {
      // Log but don't fail the request — event publishing is best-effort.
      console.error('[UsersService] Failed to publish user.created event:', err);
    }

    return user;
  }
}
