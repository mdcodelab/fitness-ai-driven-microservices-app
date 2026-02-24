import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateAIResponseDto {
  @IsString()
  userId: string;

  @IsString()
  activityId: string;

  @IsOptional()
  @IsDateString()
  recommendedAt?: string; // dacă nu e trimis, se poate seta default în DB

  @IsOptional()
  @IsString()
  notes?: string;
}
