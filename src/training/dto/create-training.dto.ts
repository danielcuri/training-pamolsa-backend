import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TrainingResult,
  TrainingStatus,
} from '../../../generated/prisma/client';

export class CreateTrainingDto {
  @ApiProperty({
    description: 'ID del usuario que será capacitado.',
    format: 'uuid',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'ID de la plantilla de capacitación.',
    format: 'uuid',
  })
  @IsUUID()
  templateId: string;

  @ApiPropertyOptional({
    description:
      'Fecha de inicio del entrenamiento. Si se omite, el backend rechazará la creación porque la necesita para generar periodos.',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description:
      'Estado del entrenamiento. En BD es requerido, pero tiene default `NOT_STARTED` si no se envía.',
    enum: TrainingStatus,
    default: TrainingStatus.NOT_STARTED,
  })
  @IsOptional()
  @IsEnum(TrainingStatus)
  status?: TrainingStatus;

  @ApiPropertyOptional({
    description: 'Resultado final del entrenamiento (si aplica).',
    enum: TrainingResult,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(TrainingResult)
  result?: TrainingResult;
}

