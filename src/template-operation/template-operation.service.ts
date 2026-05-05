import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTemplateOperationDto } from './dto/create-template-operation.dto';
import { UpdateTemplateOperationDto } from './dto/update-template-operation.dto';
import { ListTemplateOperationsDto } from './dto/list-template-operations.dto';
import { TemplateOperationEntity } from './entities/template-operation.entity';
import {
  buildPaginatedResponse,
  buildPrismaQueryParams,
  buildWhere,
} from 'src/common/helpers';

@Injectable()
export class TemplateOperationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(templateId: string, dto: CreateTemplateOperationDto) {
    const template = await this.prisma.trainingTemplate.findUnique({
      where: { id: templateId, deletedAt: null },
      select: { id: true },
    });

    if (!template) {
      throw new NotFoundException('Plantilla de capacitación no encontrada');
    }

    return this.prisma.templateOperation.create({
      data: { ...dto, templateId },
      select: TemplateOperationEntity.DEFAULT_SELECT,
    });
  }

  async findAll(templateId: string, dto: ListTemplateOperationsDto) {
    const where = {
      templateId,
      deletedAt: null,
      ...buildWhere(dto, TemplateOperationEntity.SEARCH_FIELDS as string[]),
      ...(dto.areaOperationId && {
        areaOperation: { id: dto.areaOperationId },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.templateOperation.findMany({
        where,
        select: TemplateOperationEntity.DEFAULT_SELECT,
        ...buildPrismaQueryParams(dto, dto.allowedSortFields),
      }),
      this.prisma.templateOperation.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, dto);
  }

  async findOne(templateId: string, id: string) {
    const operation = await this.prisma.templateOperation.findFirst({
      where: { id, templateId, deletedAt: null },
      select: TemplateOperationEntity.DEFAULT_SELECT,
    });

    if (!operation) throw new NotFoundException('Operación no encontrada');

    return operation;
  }

  async update(templateId: string, id: string, dto: UpdateTemplateOperationDto) {
    const operation = await this.prisma.templateOperation.findFirst({
      where: { id, templateId, deletedAt: null },
      select: { id: true },
    });

    if (!operation) throw new NotFoundException('Operación no encontrada');

    return this.prisma.templateOperation.update({
      where: { id },
      data: { ...dto },
      select: TemplateOperationEntity.DEFAULT_SELECT,
    });
  }

  async remove(templateId: string, id: string) {
    const operation = await this.prisma.templateOperation.findFirst({
      where: { id, templateId, deletedAt: null },
      select: { id: true },
    });

    if (!operation) throw new NotFoundException('Operación no encontrada');

    return this.prisma.templateOperation.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: TemplateOperationEntity.DEFAULT_SELECT,
    });
  }
}

