import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainingTemplateDto } from './dto/create-training-template.dto';
import { UpdateTrainingTemplateDto } from './dto/update-training-template.dto';

import { PrismaService } from '../prisma/prisma.service';
import { ListTrainingTemplatesDto } from './dto/list-training-templates.dto';
import { TrainingTemplateEntity } from './entities/training-template.entity';
import {
  buildPaginatedResponse,
  buildPrismaQueryParams,
  buildWhere,
} from 'src/common/helpers';

const TRAINING_TEMPLATE_SCALAR_SELECT = {
  id: true,
  name: true,
  version: true,
  periodDurationDays: true,
  totalPeriods: true,
  minimumPassingScore: true,
  certificateTemplatePdf: true,
  status: true,
  areaId: true,
  projectId: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class TrainingTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrainingTemplateDto: CreateTrainingTemplateDto) {
    const { areaId, projectId, ...templateFields } = createTrainingTemplateDto;

    return await this.prisma.$transaction(async (tx) => {
      const areaOperations = await tx.areaOperation.findMany({
        where: { areaId, deletedAt: null },
      });

      const template = await tx.trainingTemplate.create({
        data: { ...templateFields, areaId, projectId },
        select: TRAINING_TEMPLATE_SCALAR_SELECT,
      });

      if (areaOperations.length > 0) {
        await tx.templateOperation.createMany({
          data: areaOperations.map((op, index) => ({
            name: op.name,
            description: op.description,
            priority: op.priority,
            weightPercent: op.weightPercent,
            order: index + 1,
            templateId: template.id,
            areaOperationId: op.id,
          })),
        });
      }

      return template;
    });
  }

  async findAll(dto: ListTrainingTemplatesDto) {
    const where = {
      ...buildWhere(dto, TrainingTemplateEntity.SEARCH_FIELDS as string[]),
      ...(dto.projectId && {
        project: { id: dto.projectId },
      }),
      ...(dto.areaId && {
        area: { id: dto.areaId },
      }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.trainingTemplate.findMany({
        where,
        select: TrainingTemplateEntity.DEFAULT_SELECT,
        ...buildPrismaQueryParams(dto, dto.allowedSortFields),
      }),
      this.prisma.trainingTemplate.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, dto);
  }

  async findOne(id: string) {
    return await this.prisma.trainingTemplate.findFirst({
      where: {
        id,
      },
      select: TrainingTemplateEntity.DEFAULT_SELECT,
    });
  }

  async update(id: string, updateTrainingTemplateDto: UpdateTrainingTemplateDto) {
    const template = await this.prisma.trainingTemplate.findUnique({
      where: { id, deletedAt: null },
    });

    if (!template)
      throw new NotFoundException('Plantilla de capacitación no encontrada');

    return this.prisma.trainingTemplate.update({
      where: { id },
      data: { ...updateTrainingTemplateDto },
      select: TrainingTemplateEntity.DEFAULT_SELECT,
    });
  }

  async remove(id: string) {
    const template = await this.prisma.trainingTemplate.findUnique({
      where: { id },
    });

    if (!template)
      throw new NotFoundException('Plantilla de capacitación no encontrada');

    return this.prisma.trainingTemplate.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: TrainingTemplateEntity.DEFAULT_SELECT,
    });
  }
}
