import { PaginationDto } from '../dto/pagination.dto';
import { buildDynamicWhere } from './filters-to-prisma.helper';

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMeta;
}

export function buildPrismaQueryParams(
  dto: PaginationDto,
  allowedSortFields: string[],
) {
  const limit = dto.limit ?? 20;
  const sortBy = allowedSortFields.includes(dto.sortBy ?? '')
    ? dto.sortBy!
    : 'createdAt';

  return {
    skip: dto.cursor ? undefined : dto.skip,
    take: limit,
    ...(dto.cursor && { cursor: { id: dto.cursor }, skip: 1 }),
    orderBy: { [sortBy]: dto.order ?? 'desc' },
  };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  dto: PaginationDto,
): PaginatedResult<T> {
  const limit = dto.limit ?? 20;
  const page = dto.page ?? 1;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
export function buildWhere<T extends Record<string, any>>(
  dto: PaginationDto,
  searchFields: string[] = [],
): T {
  const dynamicWhere = buildDynamicWhere(dto.filter, dto.filterWhitelist);

  const searchClause =
    dto.search && searchFields.length > 0
      ? {
          OR: searchFields.map((field) => ({
            [field]: {
              contains: dto.search,
              mode: 'insensitive' as const,
            },
          })),
        }
      : {};

  return {
    ...dynamicWhere,
    ...searchClause,
  } as T;
}
