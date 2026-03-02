import { IsString, IsOptional, IsDateString, MaxLength } from 'class-validator';

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
  @MaxLength(200, { message: 'Notes cannot exceed 200 characters' })
  notes?: string;
}
