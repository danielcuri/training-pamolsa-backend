import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  RecordStatus,
  OperationPriority,
} from '../../../generated/prisma/client';

export class CreateOperationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(OperationPriority)
  priority: OperationPriority;

  @IsOptional()
  weightPercent?: number;

  @IsEnum(RecordStatus)
  @IsOptional()
  status?: RecordStatus;

  @IsString()
  areaId: string;
}
