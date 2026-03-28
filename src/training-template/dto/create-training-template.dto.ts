import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { RecordStatus } from '../../../generated/prisma/client';

export class CreateTrainingTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  version?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  periodDurationDays?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  totalPeriods?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minimumPassingScore?: number;

  @IsOptional()
  @IsString()
  certificateTemplatePdf?: string;

  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus;

  @IsUUID()
  areaId: string;

  @IsUUID()
  projectId: string;
}
