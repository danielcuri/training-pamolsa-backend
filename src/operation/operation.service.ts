import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListOperationsDto } from './dto/list-operations.dto';
import { OperationEntity } from './entities/operation.entity';

import {
  buildPaginatedResponse,
  buildPrismaQueryParams,
  buildWhere,
} from 'src/common/helpers';

@Injectable()
export class OperationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOperationDto: CreateOperationDto) {
    return await this.prisma.areaOperation.create({
      data: {
        ...createOperationDto,
      },
    });
  }

  async findAll(dto: ListOperationsDto) {
    const where = {
      ...buildWhere(dto, OperationEntity.SEARCH_FIELDS as string[]),
      // areaId se maneja aparte con la sintaxis correcta de Prisma
      ...(dto.areaId && {
        area: { id: dto.areaId }, // ← sintaxis de relación
      }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.areaOperation.findMany({
        where,
        select: OperationEntity.DEFAULT_SELECT,
        ...buildPrismaQueryParams(dto, dto.allowedSortFields),
      }),
      this.prisma.areaOperation.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, dto);
  }

  async findOne(id: string) {
    return await this.prisma.areaOperation.findFirst({
      where: {
        id,
      },
      select: OperationEntity.DEFAULT_SELECT,
    });
  }

  async update(id: string, updateOperationDto: UpdateOperationDto) {
    const operation = await this.prisma.areaOperation.findUnique({
      where: { id, deletedAt: null },
    });

    if (!operation) throw new NotFoundException('Operacion no encontrado');

    return this.prisma.areaOperation.update({
      where: { id },
      data: { ...updateOperationDto },
    });
  }

  async remove(id: string) {
    const operation = await this.prisma.areaOperation.findUnique({
      where: { id },
    });

    if (!operation) throw new NotFoundException('Operacion no encontrada');

    return this.prisma.areaOperation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
