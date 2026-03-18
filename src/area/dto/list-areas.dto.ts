import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AreaEntity } from '../entities/area.entity';
import { IsOptional, IsUUID } from 'class-validator';

export class ListAreasDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  override get filterWhitelist(): string[] {
    return AreaEntity.FILTERABLE_FIELDS as string[];
  }

  override get allowedSortFields(): string[] {
    return AreaEntity.SORTABLE_FIELDS as string[];
  }
}
