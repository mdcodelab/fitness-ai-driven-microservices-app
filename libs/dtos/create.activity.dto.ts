import { IsString, IsOptional, IsEnum, IsInt, IsDateString } from 'class-validator';
import { ActivityType } from '@prisma/client'; // enumul tău Prisma

export class CreateActivityDto {
  @IsString()
  userId: string;

  @IsEnum(ActivityType)
  type: ActivityType;

  @IsOptional()
  @IsInt()
  duration?: number; // minute

  @IsOptional()
  @IsInt()
  calories?: number; // calorii estimate

  @IsOptional()
  @IsDateString()
  date?: string; // data activității
}

