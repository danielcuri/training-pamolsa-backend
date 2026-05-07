import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Página (1-indexed).',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de registros por página.',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar.',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Orden de ordenamiento.',
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({
    description: 'Búsqueda global (aplica a campos configurados por entidad).',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Cursor para paginación basada en cursor (si aplica).',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  /**
   * Filtros dinámicos. Se envía como JSON string en la URL.
   * Ejemplo: ?filter={"status__in":"ACTIVE,PENDING","deletedAt__null":"true"}
   */
  @ApiPropertyOptional({
    description:
      'Filtros dinámicos como JSON string. Ej: `{"status__in":"ACTIVE,INACTIVE"}`',
    type: Object,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    }
    return value ?? {};
  })
  @IsObject()
  filter?: Record<string, string> = {};

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 20);
  }

  get allowedSortFields(): string[] {
    return ['createdAt', 'updatedAt'];
  }

  get filterWhitelist(): string[] {
    return [];
  }
}
