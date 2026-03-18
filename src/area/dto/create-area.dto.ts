import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RecordStatus } from '../../../generated/prisma/client';

export class CreateAreaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(RecordStatus)
  @IsOptional()
  status?: RecordStatus;

  @IsString()
  projectId: string;
}
