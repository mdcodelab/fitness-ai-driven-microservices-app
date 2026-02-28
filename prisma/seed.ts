// Load environment variables
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';


const adapterPkg = require('@prisma/adapter-pg');
const PrismaPg = adapterPkg.PrismaPg ?? adapterPkg.default ?? adapterPkg;
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  const activityTypes = [
    { name: "RUNNING", description: "Cardio outdoor", icon: "🏃‍♂️" },
    { name: "CYCLING", description: "Bike rides", icon: "🚴‍♀️" },
    { name: "SWIMMING", description: "Pool or open water", icon: "🏊‍♂️" },
    { name: "YOGA", description: "Flexibility & balance", icon: "🧘‍♀️" },
    { name: "WEIGHT_LIFTING", description: "Strength training", icon: "🏋️‍♂️" },
    { name: "HIIT", description: "High intensity interval", icon: "🔥" },
    { name: "PILATES", description: "Core & flexibility", icon: "🤸‍♀️" },
    { name: "JUMP_ROPE", description: "Cardio & coordination", icon: "🤾‍♂️" },
    { name: "CROSSFIT", description: "Mixed functional training", icon: "🏋️‍♀️" },
    { name: "STRETCHING", description: "Warm-up or cooldown", icon: "🤸" },
    { name: "CIRCUIT_TRAINING", description: "Full body circuit", icon: "💪" },
    { name: "HIKING", description: "Outdoor endurance", icon: "🥾" },
  ];


  if ((prisma as any).activityType) {
    for (const act of activityTypes) {
      await (prisma as any).activityType.upsert({
        where: { name: act.name },
        update: {
          description: act.description,
          icon: act.icon,
        },
        create: {
          name: act.name,
          description: act.description,
          icon: act.icon,
        },
      });
    }
    console.log("Seed completed: ActivityTypes upserted");
  } else {
    console.warn("Skipping ActivityType seed: generated Prisma client has no 'activityType' delegate (schema likely uses an enum ActivityType)");
  }

  // Create a demo user if none exists and insert a few Activity rows using
  // the enum values (the schema uses an enum ActivityType, so we seed
  // Activity records directly).
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'seed@local',
        password: 'seed',
        first_name: 'Seed',
      },
    });
    console.log('Created seed user:', user.id);
  } else {
    console.log('Using existing user for seed:', user.id);
  }

  const demoActivities = [
    { type: 'RUNNING', duration: 30, calories: 300 },
    { type: 'YOGA', duration: 60, calories: 200 },
    { type: 'CYCLING', duration: 45, calories: 400 },
  ];

  for (const a of demoActivities) {
    const act = await prisma.activity.create({
      data: {
        userId: user.id,
        type: a.type as any,
        duration: a.duration,
        calories: a.calories,
        date: new Date(),
      },
    });
    console.log('Inserted demo activity:', act.id, act.typeId);
  }
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());