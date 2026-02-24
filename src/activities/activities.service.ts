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

  async create(data: CreateActivityDto) {
    // 1️⃣ Salvăm activitatea în DB
    const activity = await this.databaseService.client.activity.create({
      data,
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
    return this.databaseService.client.activity.findMany();
  }

  async findByUser(userId: string) {
    return this.databaseService.client.activity.findMany({
      where: { userId },
    });
  }
}

