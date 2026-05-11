import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePeriodScoreDto {
  @IsUUID()
  templateOperationId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  score: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  checklist?: string;
}

export class CreatePeriodProgressDto {
  @IsOptional()
  @IsDateString()
  evaluationDate?: string;

  @IsOptional()
  @IsUUID()
  evaluatorId?: string;

  @IsOptional()
  @IsString()
  validationNotes?: string;

  @IsOptional()
  @IsString()
  reinforcementNotes?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePeriodScoreDto)
  scores: CreatePeriodScoreDto[];
}