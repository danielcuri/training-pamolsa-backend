import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { ListTrainingsDto } from './dto/list-trainings.dto';
import { TrainingEntity } from './entities/training.entity';
import { PeriodStatus } from '../../generated/prisma/client';
import {
  buildPaginatedResponse,
  buildPrismaQueryParams,
  buildWhere,
} from 'src/common/helpers';

@Injectable()
export class TrainingService {
  constructor(private readonly prisma: PrismaService) {}

  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  async create(createTrainingDto: CreateTrainingDto) {
    const { templateId, startDate } = createTrainingDto;

    const template = await this.prisma.trainingTemplate.findUnique({
      where: { id: templateId, deletedAt: null },
      select: { id: true, totalPeriods: true, periodDurationDays: true },
    });

    if (!template) throw new NotFoundException('Plantilla de capacitación no encontrada');

    if (!template.totalPeriods || template.totalPeriods <= 0) {
      throw new BadRequestException(
        'La plantilla de capacitación no tiene totalPeriods configurado',
      );
    }

    if (!template.periodDurationDays || template.periodDurationDays <= 0) {
      throw new BadRequestException(
        'La plantilla de capacitación no tiene periodDurationDays configurado',
      );
    }

    if (!startDate) {
      throw new BadRequestException(
        'El campo startDate es requerido para generar los periodos',
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      const training = await tx.training.create({
        data: { ...createTrainingDto },
        select: TrainingEntity.DEFAULT_SELECT,
      });

      const durationDays = template.periodDurationDays!;

      await tx.trainingPeriod.createMany({
        data: Array.from({ length: template.totalPeriods! }, (_, idx) => {
          const periodNumber = idx + 1;
          const periodStart = this.addDays(startDate, idx * durationDays);
          const periodEnd = this.addDays(periodStart, durationDays);

          return {
            trainingId: training.id,
            periodNumber,
            startDate: periodStart,
            endDate: periodEnd,
            status: PeriodStatus.NOT_STARTED,
          };
        }),
      });

      return await tx.training.findFirst({
        where: { id: training.id },
        select: TrainingEntity.DEFAULT_SELECT,
      });
    });
  }

  async findAll(dto: ListTrainingsDto) {
    const where = {
      deletedAt: null,
      ...buildWhere(dto, TrainingEntity.SEARCH_FIELDS as string[]),
      ...(dto.userId && { user: { id: dto.userId } }),
      ...(dto.templateId && { template: { id: dto.templateId } }),
      ...(dto.status && { status: dto.status }),
      ...(dto.result && { result: dto.result }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.training.findMany({
        where,
        select: TrainingEntity.DEFAULT_SELECT,
        ...buildPrismaQueryParams(dto, dto.allowedSortFields),
      }),
      this.prisma.training.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, dto);
  }

  async findOne(id: string) {
    return await this.prisma.training.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: TrainingEntity.DEFAULT_SELECT,
    });
  }

  async update(id: string, updateTrainingDto: UpdateTrainingDto) {
    const training = await this.prisma.training.findUnique({
      where: { id, deletedAt: null },
    });

    if (!training) throw new NotFoundException('Capacitación no encontrada');

    return this.prisma.training.update({
      where: { id },
      data: { ...updateTrainingDto },
      select: TrainingEntity.DEFAULT_SELECT,
    });
  }

  async remove(id: string) {
    const training = await this.prisma.training.findUnique({
      where: { id, deletedAt: null },
    });

    if (!training) throw new NotFoundException('Capacitación no encontrada');

    return this.prisma.training.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: TrainingEntity.DEFAULT_SELECT,
    });
  }
}

