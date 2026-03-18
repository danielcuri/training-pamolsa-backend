import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProjectEntity } from '../entities/project.entity';

export class ListProjectsDto extends PaginationDto {
  override get filterWhitelist(): string[] {
    return ProjectEntity.FILTERABLE_FIELDS as string[];
  }

  override get allowedSortFields(): string[] {
    return ProjectEntity.SORTABLE_FIELDS as string[];
  }
}
