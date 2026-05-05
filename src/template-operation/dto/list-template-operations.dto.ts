import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IsOptional, IsUUID } from 'class-validator';
import { TemplateOperationEntity } from '../entities/template-operation.entity';

export class ListTemplateOperationsDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  areaOperationId?: string;

  override get filterWhitelist(): string[] {
    return TemplateOperationEntity.FILTERABLE_FIELDS as string[];
  }

  override get allowedSortFields(): string[] {
    return TemplateOperationEntity.SORTABLE_FIELDS as string[];
  }
}

