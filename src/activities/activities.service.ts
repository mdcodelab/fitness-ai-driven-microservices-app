import { Injectable } from '@nestjs/common';
import { RabbitService } from '@app/rabbit';
import { DatabaseService } from '@app/database';
import { CreateActivityDto } from '../../libs/dtos/create.activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly rabbitService: RabbitService,
  ) {}

  async create(data: CreateActivityDto & { userId: string }) {
    // 1️⃣ Salvăm activitatea în DB
    const activity = await this.databaseService.client.activity.create({
      data: {
        userId: data.userId,
        // map incoming typeId -> type (enum value expected by generated client)
        type: data.typeId as any,
        duration: data.duration,
        calories: data.calories,
        date: data.date ? new Date(data.date) : undefined,
      },
    });

    console.log('Activity saved in DB:', activity);

    // 2️⃣ Publicăm event în RabbitMQ
    await this.rabbitService.publish(
      'activity.exchange',
      'activity.created',
      activity,
    );

    return activity;
  }

  async findAll() {
    return this.databaseService.client.activity.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByUser(userId: string) {
    return this.databaseService.client.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}