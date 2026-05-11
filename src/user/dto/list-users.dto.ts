import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UserEntity } from '../entities/user.entity';
import { RecordStatus } from '../../../generated/prisma/enums';

export class ListUsersDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  areaId?: string;

  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus;

  override get filterWhitelist(): string[] {
    return UserEntity.FILTERABLE_FIELDS as string[];
  }

  override get allowedSortFields(): string[] {
    return UserEntity.SORTABLE_FIELDS as string[];
  }
}