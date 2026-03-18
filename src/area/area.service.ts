import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

import { PrismaService } from '../prisma/prisma.service';
import { ListAreasDto } from './dto/list-areas.dto';
import { AreaEntity } from './entities/area.entity';
import {
  buildPaginatedResponse,
  buildPrismaQueryParams,
  buildWhere,
} from 'src/common/helpers';
@Injectable()
export class AreaService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAreaDto: CreateAreaDto) {
    return await this.prisma.area.create({
      data: {
        ...createAreaDto,
      },
    });
  }

  async findAll(dto: ListAreasDto) {
    const where = {
      ...buildWhere(dto, AreaEntity.SEARCH_FIELDS as string[]),
      // projectId se maneja aparte con la sintaxis correcta de Prisma
      ...(dto.projectId && {
        project: { id: dto.projectId }, // ← sintaxis de relación
      }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.area.findMany({
        where,
        select: AreaEntity.DEFAULT_SELECT,
        ...buildPrismaQueryParams(dto, dto.allowedSortFields),
      }),
      this.prisma.area.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, dto);
  }

  async findOne(id: string) {
    return await this.prisma.area.findFirst({
      where: {
        id,
      },
      select: AreaEntity.DEFAULT_SELECT,
    });
  }

  async update(id: string, updateAreaDto: UpdateAreaDto) {
    const area = await this.prisma.area.findUnique({
      where: { id, deletedAt: null },
    });

    if (!area) throw new NotFoundException('Area no encontrado');

    return this.prisma.area.update({
      where: { id },
      data: { ...updateAreaDto },
    });
  }

  async remove(id: string) {
    const area = await this.prisma.area.findUnique({
      where: { id },
    });

    if (!area) throw new NotFoundException('Area no encontrado');

    return this.prisma.area.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
