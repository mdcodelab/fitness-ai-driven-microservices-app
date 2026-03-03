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

  // ✅ Creare activitate (post)
  async create(data: CreateActivityDto & { userId: string }) {
    // 1️⃣ Găsim ActivityType după ID
    const activityType = await this.databaseService.client.activityType.findUnique({
      where: { id: data.typeId },
    });

    if (!activityType) {
      throw new Error('Invalid activity type');
    }

    // 2️⃣ Salvăm activitatea în DB
    const activity = await this.databaseService.client.activity.create({
      data: {
        userId: data.userId,
        typeId: activityType.id, // FK către ActivityType
        duration: data.duration,
        calories: data.calories,
        date: data.date ? new Date(data.date) : undefined,
      },
      include: { type: true }, // 🔥 Include ActivityType pentru name
    });

    console.log('Activity saved in DB:', activity);

    // 3️⃣ Publicăm event în RabbitMQ
    await this.rabbitService.publish(
      'activity.exchange',
      'activity.created',
      activity,
    );

    return activity;
  }

  // ✅ Toate ActivityType-urile disponibile
  async findAll() {
    return this.databaseService.client.activityType.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Activitățile unui user (include type pentru name)
  async findAllByUser(userId: string) {
    return this.databaseService.client.activity.findMany({
      where: { userId },
      include: { type: true }, // 🔥 aici avem name
      orderBy: { createdAt: 'desc' },
    });
  }

  //delete activity
  async deleteActivity(userId: string, activityId: string) {
    // Verificăm dacă activitatea există și aparține userului
    const activity = await this.databaseService.client.activity.findFirst({
      where: { id: activityId, userId },
    });

    if (!activity) {
      throw new Error('Activity not found or does not belong to user');
    }

    // Ștergem activitatea
    await this.databaseService.client.activity.delete({
      where: { id: activityId },
    });

    console.log(`Activity ${activityId} deleted for user ${userId}`);

    return { message: 'Activity deleted successfully' };
}

}