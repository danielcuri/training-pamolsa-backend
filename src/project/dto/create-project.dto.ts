import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { RecordStatus } from '../../../generated/prisma/client';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(RecordStatus)
  @IsOptional()
  status?: RecordStatus;
}
