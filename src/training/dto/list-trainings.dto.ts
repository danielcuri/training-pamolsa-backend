import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TrainingEntity } from '../entities/training.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  TrainingResult,
  TrainingStatus,
} from '../../../generated/prisma/client';

export class ListTrainingsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtra por ID de usuario.',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filtra por ID de plantilla de capacitación.',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  templateId?: string;

  @ApiPropertyOptional({
    description: 'Filtra por estado del entrenamiento.',
    enum: TrainingStatus,
  })
  @IsOptional()
  @IsEnum(TrainingStatus)
  status?: TrainingStatus;

  @ApiPropertyOptional({
    description: 'Filtra por resultado final del entrenamiento.',
    enum: TrainingResult,
  })
  @IsOptional()
  @IsEnum(TrainingResult)
  result?: TrainingResult;

  @ApiPropertyOptional({
    description: 'Filtra por ID de proyecto.',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional({
    description: 'Filtra por ID de área.',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  areaId?: string;

  override get filterWhitelist(): string[] {
    return TrainingEntity.FILTERABLE_FIELDS as string[];
  }

  override get allowedSortFields(): string[] {
    return TrainingEntity.SORTABLE_FIELDS as string[];
  }
}

