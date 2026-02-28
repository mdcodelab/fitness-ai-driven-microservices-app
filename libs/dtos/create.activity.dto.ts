import { IsString, IsOptional, IsInt, IsDateString, IsUUID } from 'class-validator';

export class CreateActivityDto {

  @IsUUID()
  typeId: string;

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