import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IsOptional, IsUUID } from 'class-validator';
import { OperationEntity } from '../entities/operation.entity';

export class ListOperationsDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  areaId?: string;

  override get filterWhitelist(): string[] {
    return OperationEntity.FILTERABLE_FIELDS as string[];
  }

  override get allowedSortFields(): string[] {
    return OperationEntity.SORTABLE_FIELDS as string[];
  }
}
