import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TrainingTemplateEntity } from '../entities/training-template.entity';
import { IsOptional, IsUUID } from 'class-validator';

export class ListTrainingTemplatesDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  areaId?: string;

  override get filterWhitelist(): string[] {
    return TrainingTemplateEntity.FILTERABLE_FIELDS as string[];
  }

  override get allowedSortFields(): string[] {
    return TrainingTemplateEntity.SORTABLE_FIELDS as string[];
  }
}
