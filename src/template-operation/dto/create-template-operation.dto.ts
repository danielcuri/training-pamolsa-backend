import { OperationPriority } from '../../../generated/prisma';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTemplateOperationDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(OperationPriority)
  priority: OperationPriority;

  @IsOptional()
  @IsNumber()
  weightPercent?: number;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsNumber()
  minimumScore?: number;

  @IsOptional()
  @IsUUID()
  areaOperationId?: string;
}

