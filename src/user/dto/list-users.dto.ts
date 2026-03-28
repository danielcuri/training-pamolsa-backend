import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UserEntity } from '../entities/user.entity';
import { IsOptional, IsUUID } from 'class-validator';

export class ListUsersDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  areaId?: string;

  override get filterWhitelist(): string[] {
    return UserEntity.FILTERABLE_FIELDS as string[];
  }

  override get allowedSortFields(): string[] {
    return UserEntity.SORTABLE_FIELDS as string[];
  }
}
